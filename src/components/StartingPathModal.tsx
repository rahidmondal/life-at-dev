'use client';

import { useRef, useState } from 'react';

interface StartingPathModalProps {
  onSelect: (path: 'student' | 'student-easy' | 'self-taught') => void;
}

type PathOption = {
  id: 'student-easy' | 'student' | 'self-taught';
  icon: string;
  title: string;
  subtitle: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  hoverBg: string;
  hoverBorder: string;
  shadowColor: string;
  stats: { label: string; value: string; color: string }[];
  description: string;
  difficulty: number;
  difficultyColor: string;
};

const PATH_OPTIONS: PathOption[] = [
  {
    id: 'student-easy',
    icon: '🏠',
    title: 'CS Student Easy',
    subtitle: 'Family Supported',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-950/20',
    textColor: 'text-green-400',
    hoverBg: 'hover:bg-green-950/40',
    hoverBorder: 'hover:border-green-400',
    shadowColor: 'hover:shadow-green-500/30',
    stats: [
      { label: '💰 Money', value: '$500', color: 'text-green-400' },
      { label: '💻 Coding', value: '+100', color: 'text-emerald-400' },
      { label: '⭐ Rep', value: '+20', color: 'text-emerald-400' },
      { label: '🏠 Rent', value: '$0 (4yrs)', color: 'text-green-400' },
      { label: '💸 Tuition', value: '$0 (4yrs)', color: 'text-green-400' },
    ],
    description: 'Family covers tuition and rent. Build skills and get promoted to paid jobs.',
    difficulty: 1,
    difficultyColor: 'bg-green-500',
  },
  {
    id: 'student',
    icon: '🎓',
    title: 'CS Student',
    subtitle: 'Self-Funded',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-950/20',
    textColor: 'text-yellow-400',
    hoverBg: 'hover:bg-yellow-950/40',
    hoverBorder: 'hover:border-yellow-400',
    shadowColor: 'hover:shadow-yellow-500/30',
    stats: [
      { label: '💰 Money', value: '$0', color: 'text-red-400' },
      { label: '💻 Coding', value: '+100', color: 'text-emerald-400' },
      { label: '⭐ Rep', value: '+20', color: 'text-emerald-400' },
      { label: '🏠 Rent', value: '$4k/yr', color: 'text-yellow-400' },
      { label: '💸 Income', value: '-$10k/yr', color: 'text-red-400' },
    ],
    description: 'Slower start, but structured growth. Negative income from tuition is brutal.',
    difficulty: 2,
    difficultyColor: 'bg-yellow-500',
  },
  {
    id: 'self-taught',
    icon: '💪',
    title: 'Self-Taught',
    subtitle: 'Bootcamp / Hustle',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-950/20',
    textColor: 'text-red-400',
    hoverBg: 'hover:bg-red-950/40',
    hoverBorder: 'hover:border-red-400',
    shadowColor: 'hover:shadow-red-500/30',
    stats: [
      { label: '💰 Money', value: '$1,000', color: 'text-emerald-400' },
      { label: '💻 Coding', value: '50', color: 'text-gray-400' },
      { label: '⭐ Rep', value: '0', color: 'text-gray-400' },
      { label: '🏠 Rent', value: '$6k/yr', color: 'text-red-400' },
      { label: '💸 Income', value: '$0/yr', color: 'text-gray-400' },
    ],
    description: 'No degree. No safety net. Maximum freedom. Freelance and grind hard.',
    difficulty: 3,
    difficultyColor: 'bg-red-500',
  },
];

// Mobile order: Easy (left), Medium (center), Hard (right)
const MOBILE_PATH_ORDER: PathOption[] = [
  PATH_OPTIONS[0], // Easy - student-easy (Family Supported)
  PATH_OPTIONS[1], // Medium - student (CS Student Self-Funded)
  PATH_OPTIONS[2], // Hard - self-taught (Bootcamp)
];

export default function StartingPathModal({ onSelect }: StartingPathModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.offsetWidth * 0.85;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(newIndex, 0), MOBILE_PATH_ORDER.length - 1));
    }
  };

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth * 0.85;
      carouselRef.current.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
    }
  };

  // Card Component
  const PathCard = ({ path, isMobile = false }: { path: PathOption; isMobile?: boolean }) => (
    <button
      onClick={() => onSelect(path.id)}
      className={`group relative overflow-hidden rounded-xl border-2 ${path.borderColor} ${path.bgColor} p-4 text-left transition-all ${path.hoverBg} ${path.hoverBorder} hover:shadow-lg ${path.shadowColor} ${
        isMobile ? 'w-[85vw] shrink-0 snap-center' : 'hover:scale-[1.02]'
      }`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">{path.icon}</span>
          <div>
            <h3 className={`font-mono text-lg font-bold ${path.textColor}`}>{path.title}</h3>
            <p className="font-mono text-xs text-gray-400">{path.subtitle}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 gap-1.5 rounded-lg border ${path.borderColor}/30 bg-gray-900/50 p-2`}>
          {path.stats.map((stat, i) => (
            <div key={i} className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-gray-400">{stat.label}</span>
              <span className={`font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className={`font-mono text-xs italic ${path.textColor}/80`}>"{path.description}"</p>

        {/* Difficulty */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-gray-400">Difficulty:</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(level => (
              <div
                key={level}
                className={`h-2 w-6 rounded-full ${level <= path.difficulty ? path.difficultyColor : 'bg-gray-700'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Shimmer effect */}
      <div
        className={`absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full`}
      />
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Desktop Layout - Vertical List */}
      <div className="hidden max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border-2 border-emerald-500 bg-zinc-950 shadow-2xl shadow-emerald-500/20 lg:block">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b-2 border-emerald-500 bg-zinc-950 px-6 py-4">
          <h2 className="font-mono text-2xl font-bold text-emerald-400">Choose Your Starting Path</h2>
          <p className="font-mono text-sm text-gray-400">This choice is permanent for this run</p>
        </div>

        {/* Desktop Grid */}
        <div className="grid gap-4 p-6 md:grid-cols-3">
          {PATH_OPTIONS.map(path => (
            <PathCard key={path.id} path={path} />
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t-2 border-emerald-500/30 bg-zinc-900/80 px-6 py-3 backdrop-blur-sm">
          <p className="text-center font-mono text-xs text-gray-400">
            💡 <span className="text-emerald-400">Pro Tip:</span> Family-Supported (Easy) → CS Student Self-Funded
            (Medium) → Bootcamp (Hard)
          </p>
        </div>
      </div>

      {/* Mobile Layout - Horizontal Carousel */}
      <div className="flex h-full w-full flex-col lg:hidden">
        {/* Header */}
        <div className="shrink-0 border-b border-emerald-500/30 bg-gray-950/80 px-4 py-4 backdrop-blur-sm">
          <h2 className="text-center font-mono text-lg font-bold text-emerald-400">Choose Your Path</h2>
          <p className="text-center font-mono text-xs text-gray-400">Swipe to explore • Tap to select</p>
        </div>

        {/* Carousel */}
        <div className="flex flex-1 items-center overflow-hidden py-4">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[7.5vw] scrollbar-none"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {MOBILE_PATH_ORDER.map(path => (
              <PathCard key={path.id} path={path} isMobile />
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex shrink-0 items-center justify-center gap-2 pb-4">
          {MOBILE_PATH_ORDER.map((path, index) => (
            <button
              key={path.id}
              onClick={() => scrollToIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index ? `w-8 ${path.difficultyColor}` : 'w-2.5 bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to ${path.title}`}
            />
          ))}
        </div>

        {/* Footer Tip */}
        <div className="shrink-0 border-t border-gray-800 bg-gray-950/80 p-3 pb-safe backdrop-blur-sm">
          <p className="text-center font-mono text-[10px] text-gray-500">
            {MOBILE_PATH_ORDER[activeIndex] && (
              <>
                {MOBILE_PATH_ORDER[activeIndex].difficulty === 1 && '🟢 EASY: '}
                {MOBILE_PATH_ORDER[activeIndex].difficulty === 2 && '🟡 MEDIUM: '}
                {MOBILE_PATH_ORDER[activeIndex].difficulty === 3 && '🔴 HARD: '}
                {MOBILE_PATH_ORDER[activeIndex].description}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
