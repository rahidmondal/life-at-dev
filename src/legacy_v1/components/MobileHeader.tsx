'use client';

import { useGame } from '@/context/GameContext';

interface MobileHeaderProps {
  onProfileClick: () => void;
}

export function MobileHeader({ onProfileClick }: MobileHeaderProps) {
  const { state } = useGame();
  const { stats } = state;

  const getStressColor = (stress: number) => {
    if (stress >= 80) return 'text-red-400';
    if (stress >= 50) return 'text-orange-400';
    return 'text-yellow-400';
  };

  const getEnergyColor = (energy: number) => {
    if (energy <= 20) return 'text-red-400';
    if (energy <= 40) return 'text-orange-400';
    return 'text-cyan-400';
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-gray-800 bg-gray-950/90 px-3 py-2 backdrop-blur-md">
      {/* Profile Button */}
      <button
        onClick={onProfileClick}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-2xl transition-all active:scale-95"
        aria-label="View profile stats"
      >
        👤
      </button>

      {/* Vital Stats - 2 Column Grid with Label: Current/Max format */}
      <div className="grid flex-1 grid-cols-2 gap-x-3 gap-y-0.5 font-mono text-[10px]">
        {/* Energy */}
        <div className="flex items-center gap-1">
          <span className="text-gray-500">⚡ Energy:</span>
          <span className={`font-bold ${getEnergyColor(stats.energy)}`}>{stats.energy}/100</span>
        </div>

        {/* Stress */}
        <div className="flex items-center gap-1">
          <span className="text-gray-500">😰 Stress:</span>
          <span className={`font-bold ${getStressColor(stats.stress)}`}>{stats.stress}/100</span>
        </div>

        {/* Money */}
        <div className="flex items-center gap-1">
          <span className="text-gray-500">💰 Money:</span>
          <span
            className={`font-bold ${stats.money < 0 ? 'text-red-400' : stats.money < 500 ? 'text-yellow-400' : 'text-emerald-400'}`}
          >
            ${stats.money >= 1000 ? `${(stats.money / 1000).toFixed(1)}k` : stats.money}
          </span>
        </div>

        {/* Weeks */}
        <div className="flex items-center gap-1">
          <span className="text-gray-500">📅 Weeks:</span>
          <span className="font-bold text-cyan-400">{stats.weeks}/52</span>
        </div>
      </div>
    </header>
  );
}
