'use client';

import { useMemo, useState } from 'react';

import { calculateScore, getScoreBreakdownText } from '@/logic/score';
import type { GameOverReason, GameStats } from '@/types/game';

export interface ScoreCardProps {
  finalStats: GameStats;
  reason: GameOverReason;
  isEasterEggWin?: boolean;
  themeBorder: string;
  themeText: string;
}

export function ScoreCard({ finalStats, reason, isEasterEggWin, themeBorder, themeText }: ScoreCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const scoreBreakdown = useMemo(
    () =>
      calculateScore({
        finalStats,
        reason,
        isEasterEggWin,
      }),
    [finalStats, reason, isEasterEggWin],
  );

  const _breakdownText = useMemo(() => getScoreBreakdownText(scoreBreakdown), [scoreBreakdown]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className={`border-2 ${themeBorder} bg-black/90 p-6`}>
        {/* Score Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-2xl font-bold text-gray-100">FINAL SCORE</h2>
          <button
            onClick={() => {
              setShowBreakdown(!showBreakdown);
            }}
            className="font-mono text-xs text-gray-500 transition-colors hover:text-gray-300"
            title="Toggle score breakdown"
          >
            {showBreakdown ? '▲ Hide Details' : '▼ Show Details'}
          </button>
        </div>

        {/* Main Score Display */}
        <div className="mt-4 text-center">
          <p className={`font-mono text-6xl font-bold ${themeText} drop-shadow-lg`}>
            {scoreBreakdown.totalScore.toLocaleString()}
          </p>
          <p className="mt-1 font-mono text-sm text-gray-500">points</p>
        </div>

        {/* Outcome Multiplier Badge */}
        <div className="mt-4 flex justify-center">
          <span
            className={`inline-block rounded-full border ${themeBorder} bg-black/50 px-4 py-1 font-mono text-sm ${themeText}`}
          >
            ×{scoreBreakdown.outcomeMultiplier}{' '}
            {reason === 'victory'
              ? isEasterEggWin
                ? 'Easter Egg'
                : 'Victory'
              : reason === 'burnout'
                ? 'Burnout'
                : 'Bankruptcy'}{' '}
            Multiplier
          </span>
        </div>

        {/* Breakdown Panel (collapsible) */}
        {showBreakdown && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            <p className="mb-3 font-mono text-xs text-gray-500">SCORE BREAKDOWN</p>
            <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
              <div className="flex justify-between border-b border-gray-800 pb-1">
                <span className="font-mono text-gray-500">Base</span>
                <span className="font-mono text-gray-300">{scoreBreakdown.basePoints}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-1">
                <span className="font-mono text-gray-500">Job Level</span>
                <span className="font-mono text-purple-400">+{scoreBreakdown.jobLevelBonus}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-1">
                <span className="font-mono text-gray-500">Wealth</span>
                <span className="font-mono text-green-400">+{scoreBreakdown.wealthBonus}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-1">
                <span className="font-mono text-gray-500">Coding</span>
                <span className="font-mono text-emerald-400">+{scoreBreakdown.codingBonus}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-1">
                <span className="font-mono text-gray-500">Reputation</span>
                <span className="font-mono text-yellow-400">+{scoreBreakdown.reputationBonus}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-1">
                <span className="font-mono text-gray-500">Efficiency</span>
                <span className="font-mono text-cyan-400">+{scoreBreakdown.efficiencyBonus}</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="font-mono text-xs text-gray-600">
                (
                {scoreBreakdown.basePoints +
                  scoreBreakdown.jobLevelBonus +
                  scoreBreakdown.wealthBonus +
                  scoreBreakdown.codingBonus +
                  scoreBreakdown.reputationBonus +
                  scoreBreakdown.efficiencyBonus}{' '}
                × {scoreBreakdown.outcomeMultiplier} = {scoreBreakdown.totalScore})
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
