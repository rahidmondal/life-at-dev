'use client';

import HowToPlayModal from '@/components/HowToPlayModal';
import StartingPathModal from '@/components/StartingPathModal';
import { useGame } from '@/context/GameContext';
import Image from 'next/image';
import { useState } from 'react';

export function StartScreen() {
  const { dispatch } = useGame();
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showPathSelection, setShowPathSelection] = useState(false);

  const handleStartGame = () => {
    setShowPathSelection(true);
  };

  const handlePathSelect = (path: 'student' | 'student-easy' | 'self-taught') => {
    dispatch({ type: 'START_GAME', payload: { path } });
    setShowPathSelection(false);
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-4xl space-y-12 text-center">
          {/* Main Content */}
          <div className="space-y-8">
            <Image src="/logo.png" alt="Life @ Dev Logo" width={400} height={300} className="mx-auto" />

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

              <div className="space-y-2 border-l-2 border-emerald-500 bg-emerald-950/20 p-4">
                <p className="font-mono text-sm text-emerald-400">💻 Grind your coding skills</p>
                <p className="font-mono text-sm text-emerald-400">⭐ Build your reputation</p>
                <p className="font-mono text-sm text-gray-300">
                  ⚡ Manage your energy <span className="text-red-400">(or burn out!)</span>
                </p>
                <p className="font-mono text-sm text-gray-300">
                  💰 Make tough choices <span className="text-red-400">(coffee or rent?)</span>
                </p>
              </div>

              <p className="font-mono text-sm text-gray-400">
                Click <span className="text-emerald-400">Next Year</span> to age up, get paid, and trigger random
                events.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleStartGame}
              className="group relative overflow-hidden rounded-lg bg-emerald-500 px-12 py-4 font-mono text-xl font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/50"
            >
              <span className="relative z-10 flex items-center gap-2">▶ Start Game</span>
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </button>

            <button
              onClick={() => {
                setShowHowToPlay(true);
              }}
              className="rounded-lg border-2 border-cyan-400 bg-cyan-400/10 px-8 py-4 font-mono text-lg font-bold text-cyan-400 transition-all hover:bg-cyan-400 hover:text-black"
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
    </>
  );
}
