'use client';

import LifeSummary from '@/components/LifeSummary';
import { ScoreCard } from '@/components/ScoreCard';
import { useGame } from '@/context/GameContext';
import { getPlayerTags } from '@/logic/tags';

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
    <div className={`flex min-h-screen items-center justify-center ${theme.bg} px-3 py-6 sm:px-4 sm:py-12`}>
      <div className="w-full max-w-4xl space-y-4 text-center sm:space-y-8">
        {/* Title */}
        <div className="space-y-2 sm:space-y-4">
          <div className="text-5xl sm:text-6xl lg:text-8xl">{theme.emoji}</div>
          <h1 className={`font-mono text-3xl font-bold sm:text-4xl lg:text-6xl ${theme.text}`}>{theme.title}</h1>
          {isEasterEggWin && (
            <p className="font-mono text-xs text-purple-500/80 sm:text-sm">
              You truly hacked your way to the top. You're just like <em>Blue Shirt Guy</em>.
            </p>
          )}
        </div>

        {/* Message */}
        <div className={`mx-auto max-w-2xl border-2 ${theme.border} bg-black/50 p-4 sm:p-6 lg:p-8`}>
          <p className="font-mono text-base text-gray-300 sm:text-lg lg:text-xl">{message}</p>
        </div>

        {/* Life Summary - Narrative */}
        <div className={`mx-auto max-w-3xl border-2 ${theme.border} bg-black/80 p-4 text-left sm:p-6 lg:p-8`}>
          <LifeSummary stats={finalStats} gameOver={state.gameOver} eventLog={state.eventLog} />
        </div>

        {/* Final Stats Grid */}
        <div className="mx-auto max-w-3xl">
          <div className={`border-2 ${theme.border} bg-black/80 p-4 sm:p-6`}>
            <h2 className="mb-4 font-mono text-lg font-bold text-gray-100 sm:mb-6 sm:text-xl lg:text-2xl">
              CAREER METRICS
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="font-mono text-xs text-gray-500">AGE</p>
                <p className="font-mono text-2xl font-bold text-emerald-400 sm:text-3xl">{finalStats.age}</p>
              </div>

              <div className="space-y-1">
                <p className="font-mono text-xs text-gray-500">YEARS WORKED</p>
                <p className="font-mono text-2xl font-bold text-cyan-400 sm:text-3xl">{finalStats.yearsWorked}</p>
              </div>

              <div className="space-y-1">
                <p className="font-mono text-xs text-gray-500">TOTAL EARNED</p>
                <p className="font-mono text-xl font-bold text-yellow-400 sm:text-2xl">
                  ${Math.floor(finalStats.totalEarned / 1000)}k
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-mono text-xs text-gray-500">FINAL ROLE</p>
                <p className="font-mono text-xs font-bold text-purple-400 sm:text-sm">{finalStats.currentJob.title}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-700 pt-4 sm:mt-6 sm:gap-4 sm:pt-6 lg:grid-cols-4">
              <div>
                <p className="font-mono text-xs text-gray-500">Coding</p>
                <p className="font-mono text-lg font-bold text-emerald-400 sm:text-xl">{finalStats.coding}</p>
              </div>

              <div>
                <p className="font-mono text-xs text-gray-500">Reputation</p>
                <p className="font-mono text-lg font-bold text-yellow-400 sm:text-xl">{finalStats.reputation}</p>
              </div>

              <div>
                <p className="font-mono text-xs text-gray-500">Final Stress</p>
                <p className="font-mono text-lg font-bold text-red-400 sm:text-xl">{finalStats.stress}</p>
              </div>

              <div>
                <p className="font-mono text-xs text-gray-500">Final Money</p>
                <p className="font-mono text-lg font-bold text-green-400 sm:text-xl">${finalStats.money}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Player Tags Section */}
        {(() => {
          const playerTags = getPlayerTags(finalStats);
          if (playerTags.length === 0) return null;

          return (
            <div className="mx-auto max-w-3xl">
              <div className={`border-2 ${theme.border} bg-black/80 p-6`}>
                <h2 className="mb-4 font-mono text-xl font-bold text-gray-100">// PLAYER TAGS</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {playerTags.map((tag, index) => (
                    <div
                      key={index}
                      className={`group relative rounded-full border-2 border-current px-4 py-2 transition-all hover:scale-105 ${tag.color}`}
                      title={tag.description}
                    >
                      <span className="font-mono text-sm font-bold">
                        {tag.emoji} {tag.label}
                      </span>
                      {/* Tooltip on hover */}
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded border border-gray-700 bg-black px-3 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="font-mono text-xs text-gray-300">{tag.description}</p>
                        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

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
