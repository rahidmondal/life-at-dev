'use client';

import LifeSummary from '@/components/LifeSummary';
import { ScoreCard } from '@/components/ScoreCard';
import { useGame } from '@/context/GameContext';

export function GameOverScreen() {
  const { state, dispatch } = useGame();

  if (!state.gameOver) return null;

  const handleRestart = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const { reason, finalStats, message, isEasterEggWin } = state.gameOver;

  const themes = {
    burnout: {
      bg: 'bg-gradient-to-br from-red-950 via-black to-black',
      border: 'border-red-500',
      text: 'text-red-400',
      title: '💀 BURNOUT',
      emoji: '🔥',
    },
    bankruptcy: {
      bg: 'bg-gradient-to-br from-gray-900 via-black to-black',
      border: 'border-gray-500',
      text: 'text-gray-400',
      title: '💸 BANKRUPTCY',
      emoji: '😭',
    },
    victory: {
      bg: isEasterEggWin
        ? 'bg-gradient-to-br from-purple-900 via-black to-black'
        : 'bg-gradient-to-br from-yellow-900 via-emerald-950 to-black',
      border: isEasterEggWin ? 'border-purple-500' : 'border-yellow-500',
      text: isEasterEggWin ? 'text-purple-400' : 'text-yellow-400',
      title: isEasterEggWin ? '🌟 EASTER EGG VICTORY!' : '🏆 VICTORY!',
      emoji: isEasterEggWin ? '🎮' : '🎉',
    },
  };

  const theme = themes[reason];

  return (
    <div className={`flex min-h-screen items-center justify-center ${theme.bg} px-4 py-12`}>
      <div className="w-full max-w-4xl space-y-8 text-center">
        {/* Title */}
        <div className="space-y-4">
          <div className="text-8xl">{theme.emoji}</div>
          <h1 className={`font-mono text-6xl font-bold ${theme.text}`}>{theme.title}</h1>
          {isEasterEggWin && (
            <p className="font-mono text-sm text-purple-500/80">
              You truly hacked your way to the top. You&apos;re just like <em>Blue Shirt Guy</em>.
            </p>
          )}
        </div>

        {/* Message */}
        <div className={`mx-auto max-w-2xl border-2 ${theme.border} bg-black/50 p-8`}>
          <p className="font-mono text-xl text-gray-300">{message}</p>
        </div>

        {/* Life Summary - Narrative */}
        <div className={`mx-auto max-w-3xl border-2 ${theme.border} bg-black/80 p-8 text-left`}>
          <LifeSummary stats={finalStats} gameOver={state.gameOver} eventLog={state.eventLog} />
        </div>

        {/* Final Stats Grid */}
        <div className="mx-auto max-w-3xl">
          <div className={`border-2 ${theme.border} bg-black/80 p-6`}>
            <h2 className="mb-6 font-mono text-2xl font-bold text-gray-100">CAREER METRICS</h2>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="space-y-1">
                <p className="font-mono text-xs text-gray-500">AGE</p>
                <p className="font-mono text-3xl font-bold text-emerald-400">{finalStats.age}</p>
              </div>

              <div className="space-y-1">
                <p className="font-mono text-xs text-gray-500">YEARS WORKED</p>
                <p className="font-mono text-3xl font-bold text-cyan-400">{finalStats.yearsWorked}</p>
              </div>

              <div className="space-y-1">
                <p className="font-mono text-xs text-gray-500">TOTAL EARNED</p>
                <p className="font-mono text-2xl font-bold text-yellow-400">
                  ${Math.floor(finalStats.totalEarned / 1000)}k
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-mono text-xs text-gray-500">FINAL ROLE</p>
                <p className="font-mono text-sm font-bold text-purple-400">{finalStats.currentJob.title}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-700 pt-6 md:grid-cols-4">
              <div>
                <p className="font-mono text-xs text-gray-500">Coding</p>
                <p className="font-mono text-xl font-bold text-emerald-400">{finalStats.coding}</p>
              </div>

              <div>
                <p className="font-mono text-xs text-gray-500">Reputation</p>
                <p className="font-mono text-xl font-bold text-yellow-400">{finalStats.reputation}</p>
              </div>

              <div>
                <p className="font-mono text-xs text-gray-500">Final Stress</p>
                <p className="font-mono text-xl font-bold text-red-400">{finalStats.stress}</p>
              </div>

              <div>
                <p className="font-mono text-xs text-gray-500">Final Money</p>
                <p className="font-mono text-xl font-bold text-green-400">${finalStats.money}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Score Section */}
        <ScoreCard
          finalStats={finalStats}
          reason={reason}
          isEasterEggWin={isEasterEggWin}
          themeBorder={theme.border}
          themeText={theme.text}
        />

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={handleRestart}
            className="group relative overflow-hidden rounded-lg bg-emerald-500 px-12 py-4 font-mono text-xl font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/50"
          >
            <span className="relative z-10">▶ Play Again</span>
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </button>

          {/* TODO Phase 3: Add "View Leaderboard" button */}
          {/*
          <button
            className="px-8 py-3 font-mono text-gray-400 hover:text-emerald-400 transition-colors"
          >
            View Leaderboard →
          </button>
          */}
        </div>
      </div>
    </div>
  );
}
