'use client';

import React, { createContext, ReactNode, useContext, useReducer } from 'react';
import { createInitialState, GameActionType, gameReducer, GameState } from './gameReducer';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameActionType>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
