import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { processTurn } from '../engine/processTurn';
import { createSave, loadSave, updateSave } from '../storage/gameStorage';
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
    startAge: 22,
    resources: { money: 0, debt: 0 },
    skills: { coding: 200, politics: 50 },
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

  startNewGame: (path?: string, playerName?: string) => Promise<void>;
  loadGame: (saveId: string) => Promise<void>;
  saveGame: () => Promise<void>;

  resetState: () => void;
}

type GameStore = GameState & { currentSaveId: string | null } & GameActions;

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

        resetGame: () => set({ ...INITIAL_GAME_STATE, currentSaveId: null }, false, 'resetGame'),

        performAction: (actionId: string) => {
          const currentState = extractGameState(get());
          const newState = processTurn(currentState, actionId);
          set({ ...newState }, false, `performAction:${actionId}`);
          void get().saveGame();
        },

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

        startNewGame: async (path?: string, playerName?: string) => {
          const pathConfig = getPathInitialState(path);
          const startingPath = path as 'scholar' | 'funded' | 'dropout';
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
      }),
      {
        name: 'life-at-dev-v2-storage',
        version: 1,
        partialize: state => ({
          ...extractGameState(state),
          currentSaveId: state.currentSaveId,
        }),
        migrate: (persistedState, version) => {
          // Migration from version 0 (no playerName, no debt fields)
          if (version === 0) {
            interface OldState {
              meta?: { playerName?: string; [key: string]: unknown };
              resources?: { debt?: number; [key: string]: unknown };
              flags?: { accumulatesDebt?: boolean; startingPath?: string; [key: string]: unknown };
              [key: string]: unknown;
            }
            const state = persistedState as OldState;
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
              },
            };
          }
          return persistedState;
        },
      },
    ),
    { name: 'LifeAtDev' },
  ),
);
