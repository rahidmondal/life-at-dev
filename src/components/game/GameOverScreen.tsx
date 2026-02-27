'use client';

import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { PlayIcon, SaveIcon } from '../ui/icons';

interface GameOverScreenProps {
  reason: 'bankruptcy' | 'burnout' | 'retirement' | 'aged_out';
  outcome: 'win' | 'loss';
  onRestart: () => void;
}

export function GameOverScreen({ reason, outcome, onRestart }: GameOverScreenProps) {
  const { meta, resources, stats, career } = useGameStore();
  const gameOverRef = useRef<HTMLDivElement>(null);

  const age = meta.startAge + Math.floor(meta.tick / 52);
  const totalXP = stats.xp.corporate + stats.xp.freelance;
  const totalSkill = stats.skills.coding + stats.skills.politics;

  const exportAsPNG = async () => {
    if (!gameOverRef.current) return;

    try {
      const canvas = await html2canvas(gameOverRef.current, {
        backgroundColor: '#0D1117',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `life-at-dev-${ending.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString()}.png`;
      link.href = canvas.toDataURL('image/png');

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export PNG:', error);
    }
  };

  const getEndingType = () => {
    if (reason === 'bankruptcy') return { title: 'Bankruptcy', emoji: '💸', color: '#FF7B72' };
    if (reason === 'burnout') return { title: 'Institutional Burnout', emoji: '🔥', color: '#F0883E' };
    if (reason === 'aged_out') return { title: "Time's Up", emoji: '⏰', color: '#8B949E' };

    if (resources.money > 1000000 && resources.fulfillment > 5000) {
      return { title: 'The Balanced Master', emoji: '🧘', color: '#39D353' };
    }
    if (resources.money > 1000000) {
      return { title: 'The Wealthy', emoji: '💰', color: '#D2A8FF' };
    }
    if (resources.fulfillment > 8000) {
      return { title: 'The Zen Developer', emoji: '☮️', color: '#58A6FF' };
    }
    if (stats.xp.reputation > 5000) {
      return { title: 'The Legend', emoji: '🌟', color: '#F0883E' };
    }
    if (totalSkill > 8000) {
      return { title: 'The Master Craftsman', emoji: '🔧', color: '#39D353' };
    }
    return { title: 'The Developer', emoji: '👨‍💻', color: '#8B949E' };
  };

  const ending = getEndingType();

  const legacyScore = Math.round(
    totalSkill * 0.2 +
      totalXP * 0.3 +
      resources.money / 100 +
      resources.fulfillment * 0.5 +
      stats.xp.reputation * 0.4 -
      (reason === 'bankruptcy' ? 2000 : 0) -
      (reason === 'burnout' ? 1500 : 0),
  );

  const generateObituaryText = () => {
    const lines: string[] = [];

    if (reason === 'bankruptcy') {
      lines.push(`After ${String(meta.tick)} weeks in the industry, the bills finally caught up.`);
      lines.push('The dream of financial stability remained just that—a dream.');
    } else if (reason === 'burnout') {
      lines.push(`The constant grind took its toll after ${String(meta.tick)} weeks.`);
      lines.push('Sometimes the code writes you.');
    } else if (reason === 'aged_out') {
      lines.push(`At age ${String(age)}, the journey came to its natural end.`);
      lines.push('Time waits for no developer.');
    } else {
      lines.push(`After ${String(meta.tick)} weeks and countless commits, retirement beckons.`);
      lines.push('A career well-coded.');
    }

    return lines;
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] font-mono flex items-center justify-center p-4">
      <div className="fixed inset-0 crt-scanlines z-50 pointer-events-none" />

      <div className="w-full max-w-2xl animate-fade-in">
        <div ref={gameOverRef} className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
          <div className="p-6 text-center border-b border-[#30363D]" style={{ backgroundColor: `${ending.color}10` }}>
            <span className="text-6xl mb-4 block">{ending.emoji}</span>
            <h1 className="text-2xl font-bold" style={{ color: ending.color }}>
              {ending.title}
            </h1>
            <p className="text-[#8B949E] mt-2">
              {outcome === 'win'
                ? 'Victory Certificate'
                : reason === 'retirement'
                  ? 'Retirement Certificate'
                  : 'End of Journey'}
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center border-b border-[#30363D] pb-6">
              {generateObituaryText().map((line, i) => (
                <p key={i} className="text-[#C9D1D9] italic">
                  {line}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Age" value={String(age)} color="#8B949E" />
              <StatCard label="Weeks" value={String(meta.tick)} color="#58A6FF" />
              <StatCard label="Skill" value={totalSkill.toLocaleString()} color="#39D353" />
              <StatCard label="XP" value={totalXP.toLocaleString()} color="#A371F7" />
              <StatCard label="Money" value={`$${resources.money.toLocaleString()}`} color="#D2A8FF" />
              <StatCard label="Fulfillment" value={resources.fulfillment.toLocaleString()} color="#58A6FF" />
              <StatCard label="Reputation" value={stats.xp.reputation.toLocaleString()} color="#F0883E" />
              <StatCard label="Jobs Held" value={String(career.jobHistory.length)} color="#8B949E" />
            </div>

            <div className="text-center py-6 border-t border-[#30363D]">
              <p className="text-[#8B949E] text-sm mb-2">LEGACY SCORE</p>
              <p
                className="text-5xl font-bold"
                style={{ color: legacyScore > 5000 ? '#39D353' : legacyScore > 2000 ? '#F0883E' : '#FF7B72' }}
              >
                {legacyScore.toLocaleString()}
              </p>
              <p className="text-[#484F58] text-xs mt-2">
                {legacyScore > 8000 && 'Legendary Developer'}
                {legacyScore > 5000 && legacyScore <= 8000 && 'Master Developer'}
                {legacyScore > 2000 && legacyScore <= 5000 && 'Senior Developer'}
                {legacyScore <= 2000 && 'Junior Developer'}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onRestart}
                className="flex-1 py-3 bg-[#39D353] text-[#0D1117] font-bold rounded-lg
                           hover:bg-[#39D353]/90 transition-all flex items-center justify-center gap-2"
              >
                <PlayIcon size={18} />
                New Life
              </button>
              <button
                onClick={exportAsPNG}
                className="px-6 py-3 bg-[#161B22] border border-[#30363D] text-[#8B949E] font-bold rounded-lg
                           hover:border-[#8B949E] transition-all flex items-center justify-center gap-2"
              >
                <SaveIcon size={18} />
                Export PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#0D1117] rounded-lg p-3 text-center">
      <p className="text-[#484F58] text-xs mb-1">{label}</p>
      <p className="font-bold font-mono" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
