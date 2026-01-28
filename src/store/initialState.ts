import { UNEMPLOYED_JOB_ID } from '../data/tracks';
import type { GameState } from '../types/gamestate';

/**
 * INITIAL_GAME_STATE: Default "New Game" state before player choices.
 */
export const INITIAL_GAME_STATE: GameState = {
  meta: {
    version: '2.0.0',
    tick: 0,
    startAge: 18,
  },

  resources: {
    money: 0,
    stress: 0,
    energy: 100,
    fulfillment: 0,
  },

  stats: {
    skills: {
      coding: 0,
      politics: 0,
    },
    xp: {
      corporate: 0,
      freelance: 0,
      reputation: 0,
    },
  },

  career: {
    currentJobId: UNEMPLOYED_JOB_ID,
    jobHistory: [],
  },

  flags: {
    isBurnedOut: false,
    hasMetCoFounder: false,
    streak: 0,
    cooldowns: {},
  },
};
