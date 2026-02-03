'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/icons';

interface StartScreenProps {
  onStart: (path: 'scholar' | 'funded' | 'dropout', playerName: string) => void;
}

const PATHS = [
  {
    id: 'scholar' as const,
    title: 'The Scholar',
    subtitle: 'Full Scholarship',
    difficulty: 'Easy',
    emoji: '🎓',
    color: '#39D353',
    stats: {
      skill: 'HIGH (+200)',
      debt: '$0',
      xp: '0 (Never worked)',
      time: '4 years in university',
    },
    description: 'Parents paid for everything. Graduate with knowledge but zero real-world experience.',
    pros: ['High starting skill', 'No debt', 'Good foundation'],
    cons: ['Zero XP', 'Entitled attitude', '4 years behind hustlers'],
  },
  {
    id: 'funded' as const,
    title: 'The Debtor',
    subtitle: 'Self-Funded Degree',
    difficulty: 'Medium',
    emoji: '💸',
    color: '#F0883E',
    stats: {
      skill: 'MEDIUM (+100)',
      debt: '-$40,000',
      xp: '50 (Part-time jobs)',
      time: '4 years in university',
    },
    description: 'Worked your way through college. You know struggle but also carry its weight.',
    pros: ['Balanced start', 'Some work experience', 'Appreciates money'],
    cons: ['Massive debt', 'Constant stress', 'Must pay loans'],
  },
  {
    id: 'dropout' as const,
    title: 'The Dropout',
    subtitle: 'Skip University',
    difficulty: 'Hard',
    emoji: '🚀',
    color: '#A371F7',
    stats: {
      skill: 'LOW (+0)',
      debt: '$0',
      xp: '0 (Starting fresh)',
      time: '4 EXTRA years',
    },
    description: 'Skip the system. Start from zero with nothing but time and raw ambition.',
    pros: ['No debt', '4 extra years', 'Self-made story'],
    cons: ['Zero skill', 'Zero XP', 'Harder interviews'],
  },
];

/**
 * StartScreen: Path selection and name input screen.
 * Shows after the loading screen, before the game begins.
 */
export function StartScreen({ onStart }: StartScreenProps) {
  const [selectedPath, setSelectedPath] = useState<'scholar' | 'funded' | 'dropout' | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [mobileCardIndex, setMobileCardIndex] = useState(0);

  const handleLaunch = () => {
    if (selectedPath && playerName.trim()) {
      onStart(selectedPath, playerName.trim());
    }
  };

  const nextCard = () => {
    setMobileCardIndex(prev => (prev + 1) % PATHS.length);
  };

  const prevCard = () => {
    setMobileCardIndex(prev => (prev - 1 + PATHS.length) % PATHS.length);
  };

  // Shared card component for both desktop and mobile
  const PathCard = ({
    path,
    isSelected,
    onSelect,
    compact = false,
  }: {
    path: (typeof PATHS)[0];
    isSelected: boolean;
    onSelect: () => void;
    compact?: boolean;
  }) => (
    <button
      onClick={onSelect}
      className={`relative text-left p-3 rounded-xl border-2 transition-all duration-300 w-full ${
        isSelected
          ? 'border-[#39D353] bg-[#39D353]/5 shadow-[0_0_20px_rgba(57,211,83,0.2)]'
          : 'border-[#30363D] bg-[#161B22] hover:border-[#8B949E]'
      } ${compact ? 'md:scale-100' : ''}`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">{path.emoji}</span>
          <div>
            <h3 className="text-sm font-bold" style={{ color: path.color }}>
              {path.title}
            </h3>
            <p className="text-[#8B949E] text-[10px]">{path.subtitle}</p>
          </div>
        </div>
        <span
          className="text-[9px] px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: `${path.color}20`,
            color: path.color,
          }}
        >
          {path.difficulty}
        </span>
      </div>

      {/* Description */}
      <p className="text-[#C9D1D9] text-[10px] mb-2 leading-relaxed">{path.description}</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[9px] font-mono border-t border-[#30363D] pt-1.5">
        <div className="flex justify-between">
          <span className="text-[#8B949E]">Skill:</span>
          <span className="text-[#39D353]">{path.stats.skill}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#8B949E]">Debt:</span>
          <span className={path.stats.debt === '$0' ? 'text-[#39D353]' : 'text-[#FF7B72]'}>{path.stats.debt}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#8B949E]">XP:</span>
          <span className="text-[#A371F7]">{path.stats.xp}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#8B949E]">Time:</span>
          <span className="text-[#58A6FF]">{path.stats.time}</span>
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 rounded-full bg-[#39D353] flex items-center justify-center">
            <span className="text-[#0D1117] text-[8px]">✓</span>
          </div>
        </div>
      )}
    </button>
  );

  return (
    <div className="h-screen bg-[#0D1117] text-[#C9D1D9] font-mono flex flex-col items-center justify-center p-4 md:p-3 relative overflow-hidden">
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

      {/* Selection Content */}
      <div className="w-full max-w-3xl animate-fade-in space-y-3 md:space-y-3 relative z-10">
        {/* Logo & Title */}
        <div className="text-center">
          <img
            src="/logo.png"
            alt="Life@Dev Logo"
            className="w-60 md:w-60 h-auto mx-auto mb-1 drop-shadow-[0_0_20px_rgba(57,211,83,0.5)]"
          />
          <h1 className="text-2xl md:text-xl font-bold text-[#39D353] mb-0.5">
            Life@Dev <span className="text-[#8B949E] text-sm md:text-xs">v2.0</span>
          </h1>
          <p className="text-[#8B949E] text-sm md:text-xs">Choose your origin story</p>
        </div>

        {/* Path Cards - Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-2">
          {PATHS.map(path => (
            <PathCard
              key={path.id}
              path={path}
              isSelected={selectedPath === path.id}
              onSelect={() => {
                setSelectedPath(path.id);
              }}
            />
          ))}
        </div>

        {/* Path Cards - Mobile Carousel */}
        <div className="md:hidden">
          <div className="flex items-center gap-2">
            {/* Left Arrow */}
            <button
              onClick={prevCard}
              className="shrink-0 w-10 h-10 rounded-full border border-[#30363D] bg-[#161B22]
                           flex items-center justify-center text-[#8B949E] hover:text-[#39D353]
                           hover:border-[#39D353] transition-colors active:scale-95"
            >
              <ChevronLeftIcon size={20} />
            </button>

            {/* Card */}
            <div className="flex-1">
              <PathCard
                path={PATHS[mobileCardIndex]}
                isSelected={selectedPath === PATHS[mobileCardIndex].id}
                onSelect={() => {
                  setSelectedPath(PATHS[mobileCardIndex].id);
                }}
                compact
              />
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextCard}
              className="shrink-0 w-10 h-10 rounded-full border border-[#30363D] bg-[#161B22]
                           flex items-center justify-center text-[#8B949E] hover:text-[#39D353]
                           hover:border-[#39D353] transition-colors active:scale-95"
            >
              <ChevronRightIcon size={20} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-3">
            {PATHS.map((path, index) => (
              <button
                key={path.id}
                onClick={() => {
                  setMobileCardIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === mobileCardIndex ? 'bg-[#39D353] w-4' : 'bg-[#30363D] hover:bg-[#8B949E]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Name Input & Launch */}
        {selectedPath && (
          <div className="animate-fade-in bg-[#161B22] border border-[#30363D] rounded-lg p-4 md:p-3 max-w-sm mx-auto">
            <label className="block text-xs text-[#8B949E] mb-1">const username = &quot;</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={playerName}
                onChange={e => {
                  setPlayerName(e.target.value);
                }}
                placeholder="your_name"
                maxLength={20}
                className="flex-1 bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-[#39D353] font-mono text-sm
                             focus:border-[#39D353] focus:outline-none focus:ring-1 focus:ring-[#39D353]"
                onKeyDown={e => {
                  if (e.key === 'Enter' && playerName.trim()) {
                    handleLaunch();
                  }
                }}
              />
              <span className="text-[#8B949E]">&quot;;</span>
            </div>

            <button
              onClick={handleLaunch}
              disabled={!playerName.trim()}
              className="w-full mt-3 py-2 bg-[#39D353] text-[#0D1117] font-bold rounded-lg text-sm
                         hover:bg-[#39D353]/90 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all flex items-center justify-center gap-2"
            >
              <span>&gt; npm run start:life</span>
              <ChevronRightIcon size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Version Footer */}
      <div className="absolute bottom-4 text-center text-[#484F58] text-xs">
        Life@Dev v2.0 • &quot;Survive the Grind. Climb the Ladder.&quot;
      </div>
    </div>
  );
}
