'use client';

import { useGame } from '@/context/GameContext';
import { getNextJobSuggestion } from '@/logic/yearEnd';

interface MobileStatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileStatsDrawer({ isOpen, onClose }: MobileStatsDrawerProps) {
  const { state } = useGame();
  const { stats } = state;
  const nextJob = getNextJobSuggestion(stats.currentJob);

  if (!isOpen) return null;

  // Chunky Progress Bar Component - same as StatsPanel
  const ChunkyProgressBar = ({
    value,
    max,
    colorClass,
    showWarning = false,
    warningThreshold = 0,
  }: {
    value: number;
    max: number;
    colorClass: string;
    showWarning?: boolean;
    warningThreshold?: number;
  }) => (
    <div className="relative h-4 overflow-hidden rounded-lg bg-gray-800/80 shadow-inner">
      <div
        className={`h-full rounded-lg transition-all duration-500 ${colorClass}`}
        style={{ width: `${String((value / max) * 100)}%` }}
      />
      {showWarning && value >= warningThreshold && <div className="absolute inset-0 animate-pulse bg-red-500/20" />}
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] transform overflow-y-auto border-r border-emerald-500/30 bg-gray-950/95 backdrop-blur-lg transition-transform">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-500/30 bg-gray-950/80 px-4 py-3 backdrop-blur-sm">
          <h2 className="font-mono text-lg font-bold text-emerald-400">👤 Profile</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        {/* Content - Match StatsPanel exactly */}
        <div className="flex flex-col gap-4 p-4">
          {/* Avatar & Job Card */}
          <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-500/30 bg-linear-to-b from-emerald-950/50 to-gray-950/50 p-4">
            {/* Pixel Avatar */}
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-emerald-500/50 bg-linear-to-br from-emerald-900/50 to-cyan-900/50 shadow-lg shadow-emerald-500/20">
                <span className="text-5xl">👨‍💻</span>
              </div>
              {/* Level Badge */}
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-emerald-400 bg-gray-950 font-mono text-xs font-bold text-emerald-400">
                {stats.age}
              </div>
            </div>

            {/* Job Title & Salary */}
            <div className="text-center">
              <p className="font-mono text-sm font-bold text-emerald-400">{stats.currentJob.title}</p>
              <p className="font-mono text-xs text-gray-500">Age {stats.age}</p>
            </div>

            {/* Financial Summary */}
            <div className="flex w-full gap-2 text-center">
              <div className="flex-1 rounded-lg bg-gray-900/50 p-2">
                <p className="font-mono text-[10px] text-gray-500">Salary</p>
                <p className="font-mono text-xs font-bold text-emerald-400">
                  ${(stats.currentJob.yearlyPay / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="flex-1 rounded-lg bg-gray-900/50 p-2">
                <p className="font-mono text-[10px] text-gray-500">Rent</p>
                <p className="font-mono text-xs font-bold text-red-400">
                  -${(stats.currentJob.rentPerYear / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="space-y-2 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs font-bold text-cyan-400">📅 YEAR PROGRESS</p>
              <p className="font-mono text-xs text-gray-400">Week {52 - stats.weeks}/52</p>
            </div>
            <ChunkyProgressBar
              value={52 - stats.weeks}
              max={52}
              colorClass="bg-gradient-to-r from-cyan-600 to-cyan-400"
            />
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-2xl font-bold text-cyan-400">{stats.weeks}</span>
              <span className="font-mono text-xs text-gray-500">weeks left</span>
            </div>
          </div>

          {/* Vitals Section */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-bold text-gray-500">⚡ VITALS</h3>

            {/* Energy */}
            <div className="space-y-1">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-gray-400">⚡ Energy</span>
                <span className={stats.energy <= 20 ? 'text-red-400' : 'text-cyan-400'}>{stats.energy}/100</span>
              </div>
              <ChunkyProgressBar
                value={stats.energy}
                max={100}
                colorClass="bg-gradient-to-r from-cyan-600 to-cyan-400"
              />
            </div>

            {/* Stress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-gray-400">😰 Stress</span>
                <span
                  className={
                    stats.stress >= 80 ? 'text-red-400' : stats.stress >= 50 ? 'text-orange-400' : 'text-yellow-400'
                  }
                >
                  {stats.stress}/100
                </span>
              </div>
              <ChunkyProgressBar
                value={stats.stress}
                max={100}
                colorClass={
                  stats.stress >= 80
                    ? 'bg-gradient-to-r from-red-600 to-red-400'
                    : stats.stress >= 50
                      ? 'bg-gradient-to-r from-orange-600 to-orange-400'
                      : 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                }
                showWarning={true}
                warningThreshold={90}
              />
              {stats.stress >= 90 && (
                <p className="font-mono text-xs text-red-400 animate-pulse">⚠️ CRITICAL! Near burnout!</p>
              )}
            </div>
          </div>

          {/* Money Display */}
          <div className="rounded-xl border border-green-500/20 bg-green-950/20 p-3 text-center">
            <p className="font-mono text-xs text-gray-500">💰 BALANCE</p>
            <p className={`font-mono text-2xl font-bold ${stats.money < 0 ? 'text-red-400' : 'text-green-400'}`}>
              ${stats.money.toLocaleString()}
            </p>
            {stats.money < 100 && <p className="font-mono text-xs text-red-400">⚠️ Low funds!</p>}
          </div>

          {/* Skills Section */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-bold text-gray-500">💻 SKILLS</h3>

            {/* Coding */}
            <div className="space-y-1">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-gray-400">💻 Coding</span>
                <span className="text-emerald-400">{stats.coding}/1000</span>
              </div>
              <ChunkyProgressBar
                value={stats.coding}
                max={1000}
                colorClass="bg-gradient-to-r from-emerald-600 to-emerald-400"
              />
            </div>

            {/* Reputation */}
            <div className="space-y-1">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-gray-400">⭐ Reputation</span>
                <span className="text-yellow-400">{stats.reputation}/1000</span>
              </div>
              <ChunkyProgressBar
                value={stats.reputation}
                max={1000}
                colorClass="bg-gradient-to-r from-yellow-600 to-yellow-400"
              />
            </div>
          </div>

          {/* Next Unlock */}
          <div className="space-y-2 rounded-xl border border-purple-500/20 bg-purple-950/20 p-3">
            <h3 className="font-mono text-xs font-bold text-purple-400">🔓 NEXT UNLOCK</h3>
            {nextJob ? (
              <div className="space-y-1">
                <p className="font-mono text-sm font-bold text-purple-300">{nextJob.title}</p>
                <p className="font-mono text-[10px] text-gray-400">
                  Need: {nextJob.requirements.coding} coding • {nextJob.requirements.reputation} rep
                </p>
                <p className="font-mono text-xs font-bold text-green-400">${nextJob.yearlyPay.toLocaleString()}/yr</p>
              </div>
            ) : (
              <p className="font-mono text-xs text-gray-500">Max level! 🎉</p>
            )}
          </div>

          {/* Career Stats */}
          <div className="space-y-2 border-t border-gray-800 pt-3">
            <h3 className="font-mono text-xs font-bold text-gray-600">📊 CAREER</h3>
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
              <span className="text-gray-500">Years:</span>
              <span className="text-right text-gray-400">{stats.yearsWorked}</span>
              <span className="text-gray-500">Earned:</span>
              <span className="text-right text-green-400">${stats.totalEarned.toLocaleString()}</span>
            </div>
          </div>

          {/* Version Number */}
          <div className="mt-auto pt-4 text-center">
            <p className="font-mono text-[10px] text-gray-600">v1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
}
