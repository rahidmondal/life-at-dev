import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState } from '../types/gamestate';
import type { Resources } from '../types/resources';
import type { SkillMap, XPCurrency } from '../types/stats';
import { INITIAL_GAME_STATE } from './initialState';

/**
 * Store Actions: Mutations available on the game state.
 */
interface GameActions {
  /** Advance simulation by 1 week. */
  tick: () => void;

  /** Update current job. */
  setJob: (jobId: string) => void;

  /** Merge resource deltas (clamped to valid ranges). */
  updateResources: (delta: Partial<Resources>) => void;

  /** Update skill and XP values. */
  updateStats: (delta: Partial<SkillMap & XPCurrency>) => void;

  /** Reset to initial state. */
  resetGame: () => void;
}

type GameStore = GameState & GameActions;

/**
 * useGameStore: Zustand store with localStorage persistence.
 */
export const useGameStore = create<GameStore>()(
  persist(
    set => ({
      ...INITIAL_GAME_STATE,

      tick: () =>
        set(state => ({
          meta: { ...state.meta, tick: state.meta.tick + 1 },
        })),

      setJob: (jobId: string) =>
        set(state => ({
          career: { ...state.career, currentJobId: jobId },
        })),

      updateResources: (delta: Partial<Resources>) =>
        set(state => {
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
        }),

      updateStats: (delta: Partial<SkillMap & XPCurrency>) =>
        set(state => {
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
        }),

      resetGame: () => set(INITIAL_GAME_STATE),
    }),
    {
      name: 'life-at-dev-v2-storage',
    },
  ),
);
