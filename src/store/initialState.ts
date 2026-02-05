import { UNEMPLOYED_JOB_ID } from '../data/tracks';
import type { GameState } from '../types/gamestate';

export const INITIAL_GAME_STATE: GameState = {
  meta: {
    version: '2.0.0',
    tick: 0,
    startAge: 18,
    playerName: 'Developer',
  },

  resources: {
    money: 0,
    debt: 0,
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
    jobStartTick: 0,
    jobHistory: [],
  },

  flags: {
    isBurnedOut: false,
    isBankrupt: false,
    streak: 0,
    cooldowns: {},
    accumulatesDebt: false,
    startingPath: null,
  },
  eventLog: [],
};
