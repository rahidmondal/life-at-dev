import type { GameState } from '../types/gamestate';

export interface SaveFile {
  id: string;

  version: string;

  createdAt: number;

  updatedAt: number;

  isAutoSave: boolean;

  preview: {
    jobTitle: string;
    year: number;
    week: number;
    money: number;
    stress: number;
  };

  data: GameState;
}
