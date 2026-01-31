import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { processTurn } from '../engine/processTurn';
import { createSave, loadSave, updateSave } from '../storage/gameStorage';
import type { GameState } from '../types/gamestate';
import type { Resources } from '../types/resources';
import type { SkillMap, XPCurrency } from '../types/stats';
import { INITIAL_GAME_STATE } from './initialState';

interface GameActions {
  tick: () => void;
  setJob: (jobId: string) => void;
  updateResources: (delta: Partial<Resources>) => void;
  updateStats: (delta: Partial<SkillMap & XPCurrency>) => void;
  resetGame: () => void;

  performAction: (actionId: string) => void;

  startNewGame: (path?: string) => Promise<void>;
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

        startNewGame: async (_path?: string) => {
          const newId = await createSave(INITIAL_GAME_STATE, true);
          set({ ...INITIAL_GAME_STATE, currentSaveId: newId }, false, 'startNewGame');
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
        partialize: state => ({
          ...extractGameState(state),
          currentSaveId: state.currentSaveId,
        }),
      },
    ),
    { name: 'LifeAtDev' },
  ),
);
