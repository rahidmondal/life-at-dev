'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { CommandCenter } from './CommandCenter';
import { GameOverScreen } from './GameOverScreen';
import { LandingScreen } from './LandingScreen';
import { LoadingScreen } from './LoadingScreen';
import { StartScreen } from './StartScreen';

type GamePhase = 'landing' | 'loading' | 'selecting' | 'launching' | 'playing' | 'gameover';
type GameOverReason = 'bankruptcy' | 'burnout' | 'retirement' | 'aged_out';

/**
 * GameWrapper: Root component that manages game state transitions.
 * Handles Landing -> Loading -> Selecting -> Launching -> Playing -> GameOver flow.
 */
export function GameWrapper() {
  const [phase, setPhase] = useState<GamePhase>('landing');
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>('retirement');
  const [playerName, setPlayerName] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  const { resources, meta, resetGame, startNewGame, currentSaveId } = useGameStore();

  // Check if we have an existing game on mount (after hydration)
  useEffect(() => {
    // Wait for zustand persist to hydrate
    const unsubFinishHydration = useGameStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    // If already hydrated (e.g., from cache)
    if (useGameStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => {
      unsubFinishHydration();
    };
  }, []);

  // After hydration, check if there's an active game to resume
  useEffect(() => {
    if (!isHydrated) return;

    // If we have a save ID and tick > 0, there's an active game
    if (currentSaveId && meta.tick > 0) {
      // Check if game is over conditions
      if (resources.money < -5000) {
        setGameOverReason('bankruptcy');
        setPhase('gameover');
      } else if (resources.stress >= 100) {
        setGameOverReason('burnout');
        setPhase('gameover');
      } else {
        const age = meta.startAge + Math.floor(meta.tick / 52);
        if (age >= 65) {
          setGameOverReason('aged_out');
          setPhase('gameover');
        } else {
          // Resume playing
          setPhase('playing');
        }
      }
    }
  }, [isHydrated, currentSaveId, meta.tick, meta.startAge, resources.money, resources.stress]);

  // Check for game over conditions during gameplay
  useEffect(() => {
    if (phase !== 'playing') return;

    // Bankruptcy check
    if (resources.money < -5000) {
      setGameOverReason('bankruptcy');
      setPhase('gameover');
      return;
    }

    // Burnout check
    if (resources.stress >= 100) {
      setGameOverReason('burnout');
      setPhase('gameover');
      return;
    }

    // Age out check
    const age = meta.startAge + Math.floor(meta.tick / 52);
    if (age >= 65) {
      setGameOverReason('aged_out');
      setPhase('gameover');
    }
  }, [phase, resources.money, resources.stress, meta.tick, meta.startAge]);

  // Handle clicking "Start Game" from landing page (new game)
  const handleStartClick = () => {
    // Reset any existing game state before starting new
    resetGame();
    setPhase('loading');
  };

  // Handle "Continue" from landing page (resume saved game)
  const handleContinue = () => {
    setPhase('playing');
  };

  // Handle loading screen completion
  const handleLoadingComplete = () => {
    setPhase('selecting');
  };

  // Handle path selection and name input completion
  const handlePathSelected = async (path: 'scholar' | 'funded' | 'dropout', name: string) => {
    setPlayerName(name);
    setPhase('launching');

    // Start the game with selected path
    await startNewGame(path);

    // Brief launching animation then start playing
    setTimeout(() => {
      setPhase('playing');
    }, 1500);
  };

  const handleRestart = () => {
    resetGame();
    setPlayerName('');
    setPhase('landing');
  };

  const _handleRetire = () => {
    setGameOverReason('retirement');
    setPhase('gameover');
  };

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] font-mono flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#39D353]/30 border-t-[#39D353] rounded-full animate-spin" />
      </div>
    );
  }

  // Check if there's a saved game to continue
  const hasSavedGame = currentSaveId !== null && meta.tick > 0;

  // Landing Page
  if (phase === 'landing') {
    return <LandingScreen onStartGame={handleStartClick} onContinue={hasSavedGame ? handleContinue : undefined} />;
  }

  // Loading Screen
  if (phase === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // Path Selection + Name Input
  if (phase === 'selecting') {
    return <StartScreen onStart={handlePathSelected} />;
  }

  // Launching Animation
  if (phase === 'launching') {
    return (
      <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* CRT Scanlines */}
        <div className="fixed inset-0 crt-scanlines z-50 pointer-events-none" />

        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-[#39D353]/30 border-t-[#39D353] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#39D353] font-mono text-lg">&gt; Initializing simulation...</p>
          <p className="text-[#8B949E] text-sm mt-2">
            Welcome, <span className="text-[#39D353]">{playerName}</span>
          </p>
        </div>
      </div>
    );
  }

  // Game Over
  if (phase === 'gameover') {
    return <GameOverScreen reason={gameOverReason} onRestart={handleRestart} />;
  }

  // Handle exiting game from Command Center
  const handleExitGame = () => {
    setPhase('landing');
  };

  // Playing - Command Center
  return <CommandCenter onExitGame={handleExitGame} />;
}
