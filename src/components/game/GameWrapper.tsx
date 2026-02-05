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

export function GameWrapper() {
  const [phase, setPhase] = useState<GamePhase>('landing');
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>('retirement');
  const [playerName, setPlayerName] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  const { resources, flags, meta, resetGame, startNewGame, currentSaveId } = useGameStore();

  useEffect(() => {
    const unsubFinishHydration = useGameStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    if (useGameStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => {
      unsubFinishHydration();
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (currentSaveId && meta.tick > 0) {
      // Check bankruptcy flag (set by year-end processing)
      if (flags.isBankrupt) {
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
          setPhase('playing');
        }
      }
    }
  }, [isHydrated, currentSaveId, meta.tick, meta.startAge, flags.isBankrupt, resources.stress]);

  useEffect(() => {
    if (phase !== 'playing') return;

    // Check bankruptcy flag (set by year-end processing)
    if (flags.isBankrupt) {
      setGameOverReason('bankruptcy');
      setPhase('gameover');
      return;
    }

    if (resources.stress >= 100) {
      setGameOverReason('burnout');
      setPhase('gameover');
      return;
    }

    const age = meta.startAge + Math.floor(meta.tick / 52);
    if (age >= 65) {
      setGameOverReason('aged_out');
      setPhase('gameover');
    }
  }, [phase, flags.isBankrupt, resources.stress, meta.tick, meta.startAge]);

  const handleStartClick = () => {
    resetGame();
    setPhase('loading');
  };

  const handleContinue = () => {
    setPhase('playing');
  };

  const handleLoadingComplete = () => {
    setPhase('selecting');
  };

  const handlePathSelected = async (path: 'scholar' | 'funded' | 'dropout', name: string) => {
    setPlayerName(name);
    setPhase('launching');

    await startNewGame(path, name);

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

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] font-mono flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#39D353]/30 border-t-[#39D353] rounded-full animate-spin" />
      </div>
    );
  }

  const hasSavedGame = currentSaveId !== null && meta.tick > 0;

  if (phase === 'landing') {
    return <LandingScreen onStartGame={handleStartClick} onContinue={hasSavedGame ? handleContinue : undefined} />;
  }

  if (phase === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (phase === 'selecting') {
    return <StartScreen onStart={handlePathSelected} />;
  }

  if (phase === 'launching') {
    return (
      <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
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

  if (phase === 'gameover') {
    return <GameOverScreen reason={gameOverReason} onRestart={handleRestart} />;
  }

  const handleExitGame = () => {
    setPhase('landing');
  };

  return <CommandCenter onExitGame={handleExitGame} />;
}
