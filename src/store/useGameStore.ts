import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { JOB_REGISTRY } from '../data/tracks';
import { getEligibleJobsForApplication, promotePlayer } from '../engine/career';
import { generateJobChangeMessage } from '../engine/eventLog';
import { calculateProjectedSkillChange } from '../engine/mechanics';
import { processTurn } from '../engine/processTurn';
import { isYearEnd, processYearEnd } from '../engine/yearEnd';
import { createSave, loadSave, updateSave } from '../storage/gameStorage';
import type { JobNode } from '../types/career';
import type { GameState } from '../types/gamestate';
import type { Resources } from '../types/resources';
import type { SkillMap, XPCurrency } from '../types/stats';
import { INITIAL_GAME_STATE } from './initialState';

interface PathConfig {
  startAge: number;
  resources: Partial<Resources>;
  skills: Partial<SkillMap>;
  xp: Partial<XPCurrency>;
  accumulatesDebt: boolean;
}

const PATH_CONFIGS: Record<string, PathConfig> = {
  scholar: {
    startAge: 18,
    resources: { money: 0, debt: 0 },
    skills: { coding: 0, politics: 0 },
    xp: { corporate: 0, freelance: 0, reputation: 0 },
    accumulatesDebt: false,
  },
  funded: {
    startAge: 18,
    resources: { money: 0, debt: 0 },
    skills: { coding: 0, politics: 0 },
    xp: { corporate: 0, freelance: 0, reputation: 0 },
    accumulatesDebt: true,
  },
  dropout: {
    startAge: 18,
    resources: { money: 0, debt: 0 },
    skills: { coding: 0, politics: 0 },
    xp: { corporate: 0, freelance: 0, reputation: 0 },
    accumulatesDebt: false,
  },
};

function getPathInitialState(path?: string): PathConfig {
  if (path && path in PATH_CONFIGS) {
    return PATH_CONFIGS[path];
  }
  return PATH_CONFIGS.dropout;
}

interface GameActions {
  tick: () => void;
  setJob: (jobId: string) => void;
  updateResources: (delta: Partial<Resources>) => void;
  updateStats: (delta: Partial<SkillMap & XPCurrency>) => void;
  resetGame: () => void;

  performAction: (actionId: string) => void;
  advanceWeek: () => void;
  triggerYearEnd: () => boolean;

  // Job application flow
  openJobApplication: () => void;
  closeJobApplication: () => void;
  applyForJob: (jobId: string) => void;
  getAvailableJobs: () => JobNode[];

  // Graduation flow
  acknowledgeGraduation: () => void;

  startNewGame: (path?: string, playerName?: string) => Promise<void>;
  loadGame: (saveId: string) => Promise<void>;
  saveGame: () => Promise<void>;

  resetState: () => void;

  // Selectors/Computed
  getProjectedSkillChange: () => number;
}

interface UIState {
  showJobApplicationModal: boolean;
  showGraduationModal: boolean;
}

type GameStore = GameState & { currentSaveId: string | null } & UIState & GameActions;

function extractGameState(store: GameStore): GameState {
  return {
    meta: store.meta,
    resources: store.resources,
    stats: store.stats,
    career: store.career,
    flags: store.flags,
    eventLog: store.eventLog,
  };
}

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...INITIAL_GAME_STATE,
        currentSaveId: null,
        showJobApplicationModal: false,
        showGraduationModal: false,

        tick: () =>
          set(
            state => ({
              meta: { ...state.meta, tick: state.meta.tick + 1 },
            }),
            false,
            'tick',
          ),

        setJob: (jobId: string) =>
          set(
            state => ({
              career: { ...state.career, currentJobId: jobId },
            }),
            false,
            'setJob',
          ),

        updateResources: (delta: Partial<Resources>) =>
          set(
            state => {
              const updated = { ...state.resources };

              if (delta.money !== undefined) {
                updated.money = state.resources.money + delta.money;
              }
              if (delta.debt !== undefined) {
                updated.debt = Math.max(0, state.resources.debt + delta.debt);
              }
              if (delta.stress !== undefined) {
                updated.stress = Math.max(0, Math.min(100, state.resources.stress + delta.stress));
              }
              if (delta.energy !== undefined) {
                updated.energy = Math.max(0, Math.min(100, state.resources.energy + delta.energy));
              }
              if (delta.fulfillment !== undefined) {
                updated.fulfillment = Math.max(0, Math.min(10000, state.resources.fulfillment + delta.fulfillment));
              }

              return { resources: updated };
            },
            false,
            'updateResources',
          ),

        updateStats: (delta: Partial<SkillMap & XPCurrency>) =>
          set(
            state => {
              const skills = { ...state.stats.skills };
              const xp = { ...state.stats.xp };

              if (delta.coding !== undefined) {
                skills.coding = Math.max(0, Math.min(10000, skills.coding + delta.coding));
              }
              if (delta.politics !== undefined) {
                skills.politics = Math.max(0, Math.min(10000, skills.politics + delta.politics));
              }
              if (delta.corporate !== undefined) {
                xp.corporate = Math.max(0, xp.corporate + delta.corporate);
              }
              if (delta.freelance !== undefined) {
                xp.freelance = Math.max(0, xp.freelance + delta.freelance);
              }
              if (delta.reputation !== undefined) {
                xp.reputation = Math.max(0, Math.min(10000, xp.reputation + delta.reputation));
              }

              return { stats: { skills, xp } };
            },
            false,
            'updateStats',
          ),

        resetGame: () =>
          set(
            { ...INITIAL_GAME_STATE, currentSaveId: null, showJobApplicationModal: false, showGraduationModal: false },
            false,
            'resetGame',
          ),

        performAction: (actionId: string) => {
          // Special handling for apply_job - open modal instead of processing
          if (actionId === 'apply_job') {
            get().openJobApplication();
            return;
          }

          const currentState = extractGameState(get());
          const newState = processTurn(currentState, actionId);
          set({ ...newState }, false, `performAction:${actionId}`);

          // Check if year-end should be triggered after this action
          if (isYearEnd(newState.meta.tick)) {
            get().triggerYearEnd();
          }

          void get().saveGame();
        },

        // Job application flow
        openJobApplication: () => set({ showJobApplicationModal: true }, false, 'openJobApplication'),

        closeJobApplication: () => set({ showJobApplicationModal: false }, false, 'closeJobApplication'),

        getAvailableJobs: () => {
          const currentState = extractGameState(get());
          return getEligibleJobsForApplication(currentState);
        },

        applyForJob: (jobId: string) => {
          const currentState = extractGameState(get());
          const oldJobId = currentState.career.currentJobId;
          const oldJob = JOB_REGISTRY[oldJobId];
          const newJob = JOB_REGISTRY[jobId];

          // Use promotePlayer to handle the job change
          const newState = promotePlayer(currentState, jobId);

          // Generate job change event
          const oldJobTitle = oldJob.title;
          const jobChangeEntry = generateJobChangeMessage(oldJobTitle, newJob.title, newJob.salary);

          // Merge the event into state
          set(
            {
              ...newState,
              eventLog: [...newState.eventLog, { ...jobChangeEntry, tick: newState.meta.tick }],
              showJobApplicationModal: false,
            },
            false,
            `applyForJob:${jobId}`,
          );

          void get().saveGame();
        },

        // Graduation flow
        acknowledgeGraduation: () => set({ showGraduationModal: false }, false, 'acknowledgeGraduation'),

        advanceWeek: () =>
          set(
            state => ({
              meta: { ...state.meta, tick: state.meta.tick + 1 },
              resources: {
                ...state.resources,
                energy: Math.min(100, state.resources.energy + 50),
              },
            }),
            false,
            'advanceWeek',
          ),

        triggerYearEnd: () => {
          const currentState = extractGameState(get());
          const wasGraduated = currentState.flags.hasGraduated;
          const result = processYearEnd(currentState);

          if (result.isBankrupt) {
            // Set bankruptcy flag
            set(
              {
                ...result.newState,
                flags: {
                  ...result.newState.flags,
                  isBankrupt: true,
                },
              },
              false,
              'yearEnd:bankruptcy',
            );
            return true; // Returns true if bankrupt
          }

          // Check if player just graduated
          const justGraduated = !wasGraduated && result.newState.flags.hasGraduated;

          set(
            {
              ...result.newState,
              showGraduationModal: justGraduated,
            },
            false,
            justGraduated ? 'yearEnd:graduation' : 'yearEnd:success',
          );
          return false;
        },

        startNewGame: async (path?: string, playerName?: string) => {
          const pathConfig = getPathInitialState(path);
          const startingPath = path as 'scholar' | 'funded' | 'dropout';
          const isScholar = startingPath === 'scholar';
          const initialState: GameState = {
            ...INITIAL_GAME_STATE,
            meta: {
              ...INITIAL_GAME_STATE.meta,
              startAge: pathConfig.startAge,
              playerName: playerName ?? 'Developer',
            },
            resources: {
              ...INITIAL_GAME_STATE.resources,
              ...pathConfig.resources,
            },
            stats: {
              skills: {
                ...INITIAL_GAME_STATE.stats.skills,
                ...pathConfig.skills,
              },
              xp: {
                ...INITIAL_GAME_STATE.stats.xp,
                ...pathConfig.xp,
              },
            },
            flags: {
              ...INITIAL_GAME_STATE.flags,
              accumulatesDebt: pathConfig.accumulatesDebt,
              startingPath,
              isScholar,
              scholarYearsRemaining: isScholar ? 4 : 0,
            },
          };

          const newId = await createSave(initialState, true);
          set({ ...initialState, currentSaveId: newId }, false, 'startNewGame');
        },

        loadGame: async (saveId: string) => {
          const save = await loadSave(saveId);
          if (!save) {
            console.error(`Save not found: ${saveId}`);
            return;
          }
          set({ ...save.data, currentSaveId: saveId }, false, 'loadGame');
        },

        saveGame: async () => {
          const { currentSaveId } = get();
          if (!currentSaveId) {
            console.warn('No current save ID, creating new save');
            const newId = await createSave(extractGameState(get()), false);
            set({ currentSaveId: newId }, false, 'saveGame:created');
            return;
          }
          await updateSave(currentSaveId, extractGameState(get()));
        },

        resetState: () => set({ ...INITIAL_GAME_STATE, currentSaveId: null }, false, 'resetState'),

        getProjectedSkillChange: () => {
          const state = get();
          const currentJob = JOB_REGISTRY[state.career.currentJobId];
          const displacement = currentJob.roleDisplacement ?? 0;
          const weeklyGain = currentJob.weeklyGains?.coding ?? 0;

          return calculateProjectedSkillChange(state.stats.skills.coding, displacement, weeklyGain);
        },
      }),
      {
        name: 'life-at-dev-v2-storage',
        version: 1,
        partialize: state => ({
          ...extractGameState(state),
          currentSaveId: state.currentSaveId,
        }),
        migrate: (persistedState, _version) => {
          interface OldState {
            meta?: { playerName?: string; [key: string]: unknown };
            resources?: { debt?: number; [key: string]: unknown };
            flags?: {
              accumulatesDebt?: boolean;
              startingPath?: string;
              isScholar?: boolean;
              scholarYearsRemaining?: number;
              hasGraduated?: boolean;
              purchasedInvestments?: string[];
              activeBuffs?: unknown[];
              [key: string]: unknown;
            };
            [key: string]: unknown;
          }
          const state = persistedState as OldState;

          // Always ensure new fields exist (handles all versions)
          return {
            ...state,
            meta: {
              ...state.meta,
              playerName: state.meta?.playerName ?? 'Developer',
            },
            resources: {
              ...state.resources,
              debt: state.resources?.debt ?? 0,
            },
            flags: {
              ...state.flags,
              accumulatesDebt: state.flags?.accumulatesDebt ?? false,
              startingPath: state.flags?.startingPath ?? null,
              isScholar: state.flags?.isScholar ?? false,
              scholarYearsRemaining: state.flags?.scholarYearsRemaining ?? 0,
              hasGraduated: state.flags?.hasGraduated ?? false,
              purchasedInvestments: state.flags?.purchasedInvestments ?? [],
              activeBuffs: state.flags?.activeBuffs ?? [],
            },
          };
        },
      },
    ),
    { name: 'LifeAtDev' },
  ),
);
