'use client';

import { BriefcaseIcon, GraduationCapIcon } from '../ui/icons';

interface GraduationModalProps {
  playerName: string;
  path: 'scholar' | 'funded' | 'dropout' | null;
  onContinue: () => void;
}

const PATH_INFO: Record<string, { title: string; description: string }> = {
  scholar: {
    title: 'Full Scholarship Graduate',
    description: 'Debt-free and ready to take on the world!',
  },
  funded: {
    title: 'Self-Funded Graduate',
    description: 'Your investment in yourself is about to pay off.',
  },
  dropout: {
    title: 'Graduate',
    description: 'Your academic journey is complete.',
  },
};

/**
 * GraduationModal: Celebratory modal shown when player graduates from college.
 * Prompts them to start applying for jobs.
 */
export function GraduationModal({ playerName, path, onContinue }: GraduationModalProps) {
  const pathInfo = PATH_INFO[path ?? 'dropout'];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg mx-4 bg-[#161B22] border-2 border-[#39D353] rounded-lg shadow-[0_0_60px_rgba(57,211,83,0.4)] overflow-hidden animate-scale-in">
        {/* Confetti Background Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-2 h-8 bg-[#39D353] opacity-60 animate-confetti-1" />
          <div className="absolute top-0 left-1/2 w-2 h-6 bg-[#58A6FF] opacity-60 animate-confetti-2" />
          <div className="absolute top-0 left-3/4 w-2 h-10 bg-[#F0883E] opacity-60 animate-confetti-3" />
          <div className="absolute top-0 left-1/3 w-3 h-6 bg-[#A371F7] opacity-60 animate-confetti-4" />
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#39D353]/20 to-[#58A6FF]/20 border-b border-[#39D353]/30 px-6 py-6 text-center relative">
          <div className="text-6xl mb-4 animate-bounce-slow">🎓</div>
          <h1 className="text-[#39D353] font-bold text-2xl mb-2">GRADUATION!</h1>
          <p className="text-[#C9D1D9] text-lg font-medium">
            Congratulations, <span className="text-[#58A6FF]">{playerName}</span>!
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5 relative">
          {/* Achievement Badge */}
          <div className="flex items-center justify-center">
            <div className="bg-[#0D1117] border-2 border-[#39D353] rounded-xl px-6 py-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#39D353]/20 flex items-center justify-center">
                <GraduationCapIcon size={32} className="text-[#39D353]" />
              </div>
              <div>
                <p className="text-[#39D353] font-bold text-lg">{pathInfo.title}</p>
                <p className="text-[#8B949E] text-sm">{pathInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4 space-y-2">
            <p className="text-[#8B949E] text-xs font-medium uppercase tracking-wide">// Degree Complete</p>
            <p className="text-[#C9D1D9] text-sm">
              You&apos;ve completed 4 years of higher education. Your skills and knowledge have grown significantly
              during this time.
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-[#58A6FF]/10 border border-[#58A6FF]/30 rounded-lg p-4">
            <p className="text-[#58A6FF] text-sm font-medium mb-2">📋 What&apos;s Next?</p>
            <ul className="text-[#C9D1D9] text-sm space-y-1">
              <li>
                • Use <span className="text-[#39D353] font-bold">Apply for Job</span> to find your first role
              </li>
              <li>
                • Start with an <span className="text-[#58A6FF] font-bold">Internship</span> or aim higher if qualified
              </li>
              <li>• Your college skills give you a head start in the job market</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-[#0D1117] border-t border-[#30363D]">
          <button
            onClick={onContinue}
            className="w-full flex items-center justify-center gap-3 py-4 bg-[#39D353]/20 border-2 border-[#39D353] rounded-lg text-[#39D353] font-bold text-lg hover:bg-[#39D353]/30 transition-colors"
          >
            <BriefcaseIcon size={24} />
            Start Your Career
          </button>
        </div>
      </div>
    </div>
  );
}
