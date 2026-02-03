'use client';

import { useGameStore } from '../../store/useGameStore';
import { DollarIcon, MenuIcon, ZapIcon } from '../ui/icons';

interface MobileHeaderProps {
  onTapStats: () => void;
  onTapLogo: () => void;
}

/**
 * MobileHeader: Sticky HUD showing critical vitals on mobile.
 * Tapping opens the full stats drawer.
 */
export function MobileHeader({ onTapStats, onTapLogo }: MobileHeaderProps) {
  const { meta, resources } = useGameStore();

  const age = meta.startAge + Math.floor(meta.tick / 52);

  // Energy bar segments (out of 10)
  const energySegments = Math.ceil(resources.energy / 10);

  return (
    <header className="shrink-0 sticky top-0 z-30 bg-[#161B22] border-b border-[#30363D]">
      {/* Main Header Row */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo & Title (Tappable for exit) */}
        <button onClick={onTapLogo} className="flex items-center gap-2 active:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src="/logo.png" alt="Life@Dev" className="w-full h-full object-cover" />
          </div>
          <div className="text-left">
            <h1 className="text-[#39D353] font-bold text-sm">Life@Dev</h1>
            <p className="text-[#484F58] text-[10px]">Age {age}</p>
          </div>
        </button>

        {/* Quick Stats (Tappable) */}
        <button
          onClick={onTapStats}
          className="flex items-center gap-4 bg-[#0D1117] rounded-lg px-3 py-2 active:scale-95 transition-transform"
        >
          {/* Money */}
          <div className="flex items-center gap-1">
            <DollarIcon size={14} className="text-[#D2A8FF]" />
            <span className="text-[#D2A8FF] font-mono text-xs">${resources.money.toLocaleString()}</span>
          </div>

          {/* Energy Bar (Mini) */}
          <div className="flex items-center gap-1">
            <ZapIcon size={14} className="text-[#58A6FF]" />
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-3 rounded-sm ${energySegments > i * 2 ? 'bg-[#58A6FF]' : 'bg-[#30363D]'}`}
                />
              ))}
            </div>
          </div>

          {/* Menu indicator */}
          <MenuIcon size={16} className="text-[#8B949E]" />
        </button>
      </div>

      {/* Stress Warning Bar */}
      {resources.stress >= 80 && (
        <div className="px-4 py-1.5 bg-[#FF7B72]/20 border-t border-[#FF7B72]/30 animate-pulse">
          <p className="text-[#FF7B72] text-xs text-center font-mono">
            ⚠️ BURNOUT WARNING: Stress at {resources.stress}%
          </p>
        </div>
      )}
    </header>
  );
}
