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
      {/* Desktop Layout */}
      <div className="hidden min-h-screen items-center justify-center bg-black px-6 py-12 lg:flex">
        <div className="w-full max-w-3xl space-y-10 rounded-2xl border border-emerald-500/20 bg-gray-900/50 p-10 text-center backdrop-blur-md shadow-2xl shadow-emerald-500/10">
          {/* Main Content */}
          <div className="space-y-8">
            <Image
              src="/logo.png"
              alt="Life @ Dev Logo"
              width={400}
              height={300}
              className="mx-auto h-auto w-96"
              priority
            />

            <h2 className="font-mono text-3xl font-bold text-emerald-400">
              Ready to Hack Your Way
              <br />
              to the Top?
            </h2>

            <div className="mx-auto max-w-2xl space-y-4 text-left">
              <p className="font-mono text-lg leading-relaxed text-gray-300">
                You&apos;re <span className="text-emerald-400">18</span>, fresh out of high school, with nothing but a
                laptop and big dreams. Can you go from <span className="text-red-400">unemployed</span> to{' '}
                <span className="text-emerald-400">CTO</span>?
              </p>

              <div className="space-y-2 rounded-xl border-l-4 border-emerald-500 bg-emerald-950/30 p-4">
                <p className="font-mono text-sm text-emerald-400">💻 Grind your coding skills</p>
                <p className="font-mono text-sm text-emerald-400">⭐ Build your reputation</p>
                <p className="font-mono text-sm text-gray-300">
                  ⚡ Manage your energy <span className="text-red-400">(or burn out!)</span>
                </p>
                <p className="font-mono text-sm text-gray-300">
                  💰 Make tough choices <span className="text-red-400">(coffee or rent?)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Desktop CTA Buttons - Horizontal */}
          <div className="flex flex-wrap justify-center gap-4">
            {isStorageReady && hasSavedGame ? (
              <>
                <button
                  onClick={handleResume}
                  className="group relative min-h-14 overflow-hidden rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 px-12 py-4 font-mono text-xl font-bold text-black shadow-lg shadow-emerald-500/30 transition-all hover:from-emerald-500 hover:to-emerald-400 hover:shadow-emerald-500/50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">▶ Resume Game</span>
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                </button>

                <button
                  onClick={handleRestartClick}
                  className="min-h-14 rounded-xl border-2 border-red-400/50 bg-red-400/10 px-8 py-4 font-mono text-lg font-bold text-red-400 transition-all hover:border-red-400 hover:bg-red-400 hover:text-black"
                >
                  🔄 Restart
                </button>
              </>
            ) : (
              <button
                onClick={handleStartGame}
                className="group relative min-h-14 overflow-hidden rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 px-12 py-4 font-mono text-xl font-bold text-black shadow-lg shadow-emerald-500/30 transition-all hover:from-emerald-500 hover:to-emerald-400 hover:shadow-emerald-500/50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">▶ Start Game</span>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </button>
            )}

            <button
              onClick={() => setShowHowToPlay(true)}
              className="min-h-14 rounded-xl border-2 border-cyan-400/50 bg-cyan-400/10 px-8 py-4 font-mono text-lg font-bold text-cyan-400 transition-all hover:border-cyan-400 hover:bg-cyan-400 hover:text-black"
            >
              ? How to Play
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Buttons at bottom for thumb reach */}
      <div className="flex min-h-screen flex-col bg-black lg:hidden">
        {/* Top Content - Logo & Info */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="mx-auto max-w-md space-y-6 text-center">
            <Image
              src="/logo.png"
              alt="Life @ Dev Logo"
              width={400}
              height={300}
              className="mx-auto h-auto w-48"
              priority
            />

            <h2 className="font-mono text-xl font-bold text-emerald-400">
              Ready to Hack Your Way
              <br />
              to the Top?
            </h2>

            <div className="space-y-4 text-left">
              <p className="font-mono text-sm leading-relaxed text-gray-300">
                You&apos;re <span className="text-emerald-400">18</span>, fresh out of high school, with nothing but a
                laptop and big dreams. Can you go from <span className="text-red-400">unemployed</span> to{' '}
                <span className="text-emerald-400">CTO</span>?
              </p>

              <div className="space-y-1.5 rounded-xl border-l-4 border-emerald-500 bg-emerald-950/30 p-3">
                <p className="font-mono text-xs text-emerald-400">💻 Grind your coding skills</p>
                <p className="font-mono text-xs text-emerald-400">⭐ Build your reputation</p>
                <p className="font-mono text-xs text-gray-300">
                  ⚡ Manage energy <span className="text-red-400">(or burn out!)</span>
                </p>
                <p className="font-mono text-xs text-gray-300">
                  💰 Tough choices <span className="text-red-400">(coffee or rent?)</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Buttons - Stacked for thumb reach */}
        <div className="shrink-0 space-y-3 border-t border-gray-800 bg-gray-950/80 p-4 pb-12 backdrop-blur-lg">
          {isStorageReady && hasSavedGame ? (
            <>
              <button
                onClick={handleResume}
                className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 py-4 font-mono text-lg font-bold text-black shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">▶ Resume Game</span>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleRestartClick}
                  className="flex-1 rounded-xl border-2 border-red-400/50 bg-red-400/10 py-3 font-mono text-base font-bold text-red-400 transition-all active:scale-[0.98]"
                >
                  🔄 Restart
                </button>
                <button
                  onClick={() => setShowHowToPlay(true)}
                  className="flex-1 rounded-xl border-2 border-cyan-400/50 bg-cyan-400/10 py-3 font-mono text-base font-bold text-cyan-400 transition-all active:scale-[0.98]"
                >
                  ? How to Play
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleStartGame}
                className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 py-4 font-mono text-lg font-bold text-black shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">▶ Start Game</span>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </button>

              <button
                onClick={() => setShowHowToPlay(true)}
                className="w-full rounded-xl border-2 border-cyan-400/50 bg-cyan-400/10 py-3 font-mono text-base font-bold text-cyan-400 transition-all active:scale-[0.98]"
              >
                ? How to Play
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
      {showPathSelection && <StartingPathModal onSelect={handlePathSelect} />}
      {showRestartConfirm && <RestartConfirmModal onConfirm={handleRestartConfirm} onCancel={handleRestartCancel} />}
    </>
  );
}
