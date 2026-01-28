import { create } from 'zustand';

interface GameStore {
  version: string;
}

export const useGameStore = create<GameStore>(set => ({
  version: '2.0.0',
}));
