'use client';

import { clearSave, isStorageAvailable, loadGame, saveGame } from '@/storage/gameStorage';
import React, { createContext, ReactNode, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { createInitialState, GameActionType, gameReducer, GameState } from './gameReducer';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameActionType>;
  hasSavedGame: boolean;
  isStorageReady: boolean;
  saveGameManually: () => Promise<void>;
  resumeGame: () => Promise<void>;
  restartGame: () => Promise<void>;
  goToHomeScreen: () => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; message: string; type?: 'success' | 'error' | 'info' }[]>([]);
  const lastActionRef = useRef<string | null>(null);
  const isSavingRef = useRef(false);
  const lastSavedPhaseRef = useRef<string | null>(null);

  useEffect(() => {
    const checkSave = async () => {
      if (!isStorageAvailable()) {
        setIsStorageReady(true);
        setHasSavedGame(false);
        return;
      }

      try {
        const savedState: GameState | null = await loadGame();

        if (savedState) {
          setHasSavedGame(true);

          const isOnHomeScreen = sessionStorage.getItem('on-home-screen') === 'true';

          const isRefresh = sessionStorage.getItem('life-dev-session') === 'active';

          sessionStorage.setItem('life-dev-session', 'active');

          if (isOnHomeScreen) {
            setIsStorageReady(true);
            return;
          }

          if (isRefresh) {
            dispatch({ type: 'RESTORE_STATE', payload: savedState });
          }
        } else {
          setHasSavedGame(false);
        }

        setIsStorageReady(true);
      } catch (error) {
        console.error('Storage check failed:', error instanceof Error ? error.message : 'Unknown error');
        setIsStorageReady(true);
        setHasSavedGame(false);
      }
    };

    void checkSave();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('life-dev-session');
      sessionStorage.removeItem('on-home-screen');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const performAutosave = async () => {
      if (!isStorageAvailable() || isSavingRef.current) return;

      const isGameOverSave = state.phase === 'gameover';
      const isYearEndSave = lastActionRef.current === 'YEAR_END_REVIEW';
      const saveMarker = isGameOverSave ? 'gameover' : isYearEndSave ? 'year-end' : null;

      if (saveMarker && lastSavedPhaseRef.current !== saveMarker && state.phase !== 'start') {
        isSavingRef.current = true;
        lastSavedPhaseRef.current = saveMarker;
        try {
          await saveGame(state, true);
          setHasSavedGame(true);
          const label = saveMarker === 'gameover' ? 'GAME OVER' : 'Year End';
          dispatch({
            type: 'ADD_LOG',
            payload: {
              id: `autosave-${String(Date.now())}`,
              timestamp: Date.now(),
              message: `> 💾 Autosaved (${label}).`,
              type: 'info',
            },
          });
        } catch (error) {
          console.error('Autosave failed:', error instanceof Error ? error.message : 'Unknown error');
        } finally {
          isSavingRef.current = false;
        }
      }
    };

    void performAutosave();
  }, [state]);

  const saveGameManually = async () => {
    if (!isStorageAvailable()) {
      addToast('Save unavailable', 'error');
      return;
    }

    if (state.phase === 'start') {
      addToast('No game to save', 'info');
      return;
    }

    try {
      await saveGame(state, false);
      setHasSavedGame(true);
      addToast('Game Saved!', 'success');
    } catch (error) {
      console.error('Manual save failed:', error instanceof Error ? error.message : 'Unknown error');
      addToast('Save failed', 'error');
    }
  };

  const resumeGame = async () => {
    if (!isStorageAvailable()) {
      addToast('Load unavailable', 'error');
      return;
    }

    try {
      const savedState: GameState | null = await loadGame();
      if (savedState) {
        dispatch({ type: 'RESTORE_STATE', payload: savedState });
        addToast('Game Resumed!', 'success');
      } else {
        addToast('No save found', 'error');
        setHasSavedGame(false);
      }
    } catch (error) {
      console.error('Resume failed:', error instanceof Error ? error.message : 'Unknown error');
      addToast('Load failed', 'error');
    }
  };

  const restartGame = async () => {
    try {
      if (isStorageAvailable()) {
        await clearSave();
      }
      setHasSavedGame(false);
      dispatch({ type: 'RESET_GAME' });
      sessionStorage.removeItem('life-dev-session');
      sessionStorage.removeItem('on-home-screen');
      lastSavedPhaseRef.current = null;
    } catch (error) {
      console.error('Restart failed:', error instanceof Error ? error.message : 'Unknown error');
      setHasSavedGame(false);
      dispatch({ type: 'RESET_GAME' });
      lastSavedPhaseRef.current = null;
    }
  };

  const goToHomeScreen = () => {
    sessionStorage.setItem('on-home-screen', 'true');
    dispatch({ type: 'RESET_GAME' });
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${String(Date.now())}-${String(Math.random())}`;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const wrappedDispatch = (action: GameActionType) => {
    lastActionRef.current = action.type;
    dispatch(action);
  };

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch: wrappedDispatch,
        hasSavedGame,
        isStorageReady,
        saveGameManually,
        resumeGame,
        restartGame,
        goToHomeScreen,
        addToast,
      }}
    >
      {children}
      {/* Toast Container */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => {
            removeToast(toast.id);
          }}
        />
      ))}
    </GameContext.Provider>
  );
}

function Toast({
  message,
  type = 'success',
  onClose,
}: {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1700);
    const closeTimer = setTimeout(onClose, 2000);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-500/90 text-black border-emerald-400',
    error: 'bg-red-500/90 text-white border-red-400',
    info: 'bg-cyan-500/90 text-black border-cyan-400',
  };

  const icons = {
    success: '💾',
    error: '❌',
    info: 'ℹ️',
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border-2 px-4 py-3 font-mono text-sm font-bold shadow-lg backdrop-blur-sm transition-all duration-300 sm:bottom-6 sm:right-6 sm:px-6 sm:py-4 sm:text-base ${
        styles[type]
      } ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
    >
      <span className="text-lg sm:text-xl">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
