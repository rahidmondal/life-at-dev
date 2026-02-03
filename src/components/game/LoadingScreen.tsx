'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
  playerName?: string;
}

const BOOT_MESSAGES = [
  '> mount --bind /life /dev/null',
  '> initializing economy_engine... OK',
  '> loading career_paths... OK',
  '> checking student_loans.sys...',
  '> WARNING: debt_accumulation detected',
  '> loading skill_trees... OK',
  '> entropy_decay_rate: 0.02/week',
  '> Ready to initialize developer...',
];

/**
 * LoadingScreen: Terminal-style boot animation.
 * Displays after clicking "Start Game" and before path selection.
 */
export function LoadingScreen({ onComplete, playerName }: LoadingScreenProps) {
  const [bootIndex, setBootIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (bootIndex < BOOT_MESSAGES.length) {
      const timer = setTimeout(
        () => {
          setBootIndex(prev => prev + 1);
        },
        250 + Math.random() * 100,
      );
      return () => {
        clearTimeout(timer);
      };
    } else if (!isComplete) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        onComplete();
      }, 500);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [bootIndex, isComplete, onComplete]);

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* CRT Scanlines */}
      <div className="fixed inset-0 crt-scanlines z-50 pointer-events-none" />

      {/* Nebula Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(57,211,83,0.4) 0%, transparent 70%)',
            top: '10%',
            left: '5%',
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(163,113,247,0.4) 0%, transparent 70%)',
            bottom: '20%',
            right: '10%',
          }}
        />
      </div>

      {/* Terminal Boot Sequence */}
      <div className="w-full max-w-2xl animate-fade-in relative z-10">
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 font-mono text-sm">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#30363D]">
            <span className="text-[#39D353]">❯</span>
            <span className="text-[#8B949E] text-xs">life@dev:~$</span>
          </div>

          {/* Boot Messages */}
          <div className="space-y-1 min-h-50">
            {BOOT_MESSAGES.slice(0, bootIndex).map((msg, i) => (
              <p
                key={i}
                className={`animate-fade-in ${
                  msg.includes('WARNING') ? 'text-[#F0883E]' : msg.includes('OK') ? 'text-[#39D353]' : 'text-[#8B949E]'
                }`}
              >
                {msg}
              </p>
            ))}
            {bootIndex < BOOT_MESSAGES.length && <span className="inline-block animate-pulse text-[#39D353]">█</span>}
          </div>

          {/* Loading Progress */}
          <div className="mt-4 pt-4 border-t border-[#30363D]">
            <div className="flex items-center justify-between text-xs text-[#8B949E] mb-2">
              <span>Loading...</span>
              <span>{Math.round((bootIndex / BOOT_MESSAGES.length) * 100)}%</span>
            </div>
            <div className="h-1 bg-[#30363D] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#39D353] transition-all duration-300 ease-out"
                style={{ width: `${((bootIndex / BOOT_MESSAGES.length) * 100).toFixed(0)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        {playerName && bootIndex >= BOOT_MESSAGES.length && (
          <p className="text-center text-[#8B949E] text-sm mt-4 animate-fade-in">
            Welcome back, <span className="text-[#39D353]">{playerName}</span>
          </p>
        )}
      </div>

      {/* Version Footer */}
      <div className="absolute bottom-4 text-center text-[#484F58] text-xs">Life@Dev v2.0 • Initializing...</div>
    </div>
  );
}
