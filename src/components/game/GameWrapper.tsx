'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { CommandCenter } from './CommandCenter';
import { GameOverScreen } from './GameOverScreen';
import { GraduationModal } from './GraduationModal';
import { InterviewModal } from './InterviewModal';
import { JobApplicationModal } from './JobApplicationModal';
import { LandingScreen } from './LandingScreen';
import { LoadingScreen } from './LoadingScreen';
import { StartScreen } from './StartScreen';

type GamePhase = 'landing' | 'loading' | 'selecting' | 'launching' | 'playing' | 'gameover';

export function GameWrapper() {
  const [phase, setPhase] = useState<GamePhase>('landing');
  const [playerName, setPlayerName] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    status,
    gameOverReason,
    gameOverOutcome,
    flags,
    meta,
    career,
    stats,
    resetGame,
    startNewGame,
    currentSaveId,
    showGraduationModal,
    showJobApplicationModal,
    acknowledgeGraduation,
    closeJobApplication,
    isInterviewOpen,
    startInterview: startInterviewRaw,
    getAvailableJobs,
    getNextJobs,
  } = useGameStore();

  const startInterview = startInterviewRaw as (jobId: string) => void;

  useEffect(() => {
    // No persist middleware — state is always immediately available
    setIsHydrated(true);
  }, []);

  // On hydration: determine initial phase from persisted state
  useEffect(() => {
    if (!isHydrated) return;

    if (currentSaveId && meta.tick > 0) {
      if (status === 'GAME_OVER') {
        setPhase('gameover');
      } else {
        setPhase('playing');
      }
    }
  }, [isHydrated, currentSaveId, meta.tick, status]);

  // React to game-over status changes while playing
  useEffect(() => {
    if (phase !== 'playing') return;

    if (status === 'GAME_OVER') {
      setPhase('gameover');
    }
  }, [phase, status]);

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
    return (
      <GameOverScreen
        reason={(gameOverReason as 'burnout' | 'bankruptcy' | 'retirement' | 'aged_out' | null) ?? 'aged_out'}
        outcome={(gameOverOutcome as 'win' | 'loss' | null) ?? 'loss'}
        onRestart={handleRestart}
      />
    );
  }

  const handleExitGame = () => {
    setPhase('landing');
  };

  return (
    <>
      <CommandCenter onExitGame={handleExitGame} />

      {showGraduationModal && (
        <GraduationModal playerName={meta.playerName} path={flags.startingPath} onContinue={acknowledgeGraduation} />
      )}

      {showJobApplicationModal && (
        <JobApplicationModal
          currentJobId={career.currentJobId}
          stats={stats}
          isStudent={flags.isScholar && !flags.hasGraduated}
          availableJobs={getAvailableJobs()}
          nextJobs={getNextJobs()}
          onSelectJob={startInterview}
          onClose={closeJobApplication}
        />
      )}

      {isInterviewOpen && <InterviewModal />}
    </>
  );
}
