'use client';

import HowToPlayModal from '@/components/HowToPlayModal';
import { RestartConfirmModal } from '@/components/RestartConfirmModal';
import StartingPathModal from '@/components/StartingPathModal';
import { useGame } from '@/context/GameContext';
import Image from 'next/image';
import { useState } from 'react';

export function StartScreen() {
  const { dispatch, hasSavedGame, isStorageReady, resumeGame, restartGame } = useGame();
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showPathSelection, setShowPathSelection] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  const handleStartGame = () => {
    sessionStorage.removeItem('on-home-screen');
    setShowPathSelection(true);
  };

  const handlePathSelect = (path: 'student' | 'student-easy' | 'self-taught') => {
    dispatch({ type: 'START_GAME', payload: { path } });
    setShowPathSelection(false);
  };

  const handleResume = async () => {
    sessionStorage.removeItem('on-home-screen');
    await resumeGame();
  };

  const handleRestartClick = () => {
    setShowRestartConfirm(true);
  };

  const handleRestartConfirm = async () => {
    setShowRestartConfirm(false);
    await restartGame();
  };

  const handleRestartCancel = () => {
    setShowRestartConfirm(false);
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-black px-3 py-6 sm:px-4 sm:py-12">
        <div className="w-full max-w-4xl space-y-6 text-center sm:space-y-8 lg:space-y-12">
          {/* Main Content */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <Image
              src="/logo.png"
              alt="Life @ Dev Logo"
              width={400}
              height={300}
              className="mx-auto h-auto w-48 sm:w-64 lg:w-96"
              priority
            />

            <h2 className="font-mono text-xl font-bold text-emerald-400 sm:text-2xl lg:text-3xl">
              Ready to Hack Your Way
              <br />
              to the Top?
            </h2>

            <div className="mx-auto max-w-2xl space-y-3 text-left sm:space-y-4">
              <p className="font-mono text-sm leading-relaxed text-gray-300 sm:text-base lg:text-lg">
                You&apos;re <span className="text-emerald-400">18</span>, fresh out of high school, with nothing but a
                laptop and big dreams. Can you go from <span className="text-red-400">unemployed</span> to{' '}
                <span className="text-emerald-400">CTO</span>?
              </p>

              <div className="space-y-1.5 border-l-2 border-emerald-500 bg-emerald-950/20 p-3 sm:space-y-2 sm:p-4">
                <p className="font-mono text-xs text-emerald-400 sm:text-sm">💻 Grind your coding skills</p>
                <p className="font-mono text-xs text-emerald-400 sm:text-sm">⭐ Build your reputation</p>
                <p className="font-mono text-xs text-gray-300 sm:text-sm">
                  ⚡ Manage your energy <span className="text-red-400">(or burn out!)</span>
                </p>
                <p className="font-mono text-xs text-gray-300 sm:text-sm">
                  💰 Make tough choices <span className="text-red-400">(coffee or rent?)</span>
                </p>
              </div>

              <p className="font-mono text-xs leading-relaxed text-gray-400 sm:text-sm">
                Click <span className="text-emerald-400">Next Year</span> to age up, get paid, and trigger random
                events.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            {isStorageReady && hasSavedGame ? (
              <>
                {/* Resume Game - Primary */}
                <button
                  onClick={handleResume}
                  className="group relative min-h-11 overflow-hidden rounded-lg bg-emerald-500 px-8 py-3 font-mono text-base font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/50 sm:px-12 sm:py-4 sm:text-lg lg:text-xl"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">▶ Resume Game</span>
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                </button>

                {/* Restart Game - Secondary */}
                <button
                  onClick={handleRestartClick}
                  className="min-h-11 rounded-lg border-2 border-red-400 bg-red-400/10 px-6 py-3 font-mono text-base font-bold text-red-400 transition-all hover:bg-red-400 hover:text-black sm:px-8 sm:py-4 sm:text-lg"
                >
                  🔄 Restart Game
                </button>
              </>
            ) : (
              <>
                {/* Start Game - When no save exists */}
                <button
                  onClick={handleStartGame}
                  className="group relative min-h-11 overflow-hidden rounded-lg bg-emerald-500 px-8 py-3 font-mono text-base font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/50 sm:px-12 sm:py-4 sm:text-lg lg:text-xl"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">▶ Start Game</span>
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                </button>
              </>
            )}

            <button
              onClick={() => {
                setShowHowToPlay(true);
              }}
              className="min-h-11 rounded-lg border-2 border-cyan-400 bg-cyan-400/10 px-6 py-3 font-mono text-base font-bold text-cyan-400 transition-all hover:bg-cyan-400 hover:text-black sm:px-8 sm:py-4 sm:text-lg"
            >
              ? How to Play
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showHowToPlay && (
        <HowToPlayModal
          onClose={() => {
            setShowHowToPlay(false);
          }}
        />
      )}
      {showPathSelection && <StartingPathModal onSelect={handlePathSelect} />}
      {showRestartConfirm && <RestartConfirmModal onConfirm={handleRestartConfirm} onCancel={handleRestartCancel} />}
    </>
  );
}
