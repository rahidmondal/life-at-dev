'use client';

export function ProTipsPanel() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto border-l border-gray-800 bg-black p-3 sm:gap-6 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-lg sm:text-xl">💡</span>
        <h3 className="font-mono text-xs font-bold text-emerald-400 sm:text-sm">PROTIPS</h3>
      </div>

      {/* Tips */}
      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-1 border-l-2 border-cyan-500 bg-cyan-950/20 p-2 sm:space-y-2 sm:p-3">
          <p className="font-mono text-xs font-bold text-cyan-400">⚡ Energy is life</p>
          <p className="font-mono text-xs leading-relaxed text-gray-400">
            Keep it above 10 to stay productive. Sleep and vacation to recharge.
          </p>
        </div>

        <div className="space-y-1 border-l-2 border-red-500 bg-red-950/20 p-2 sm:space-y-2 sm:p-3">
          <p className="font-mono text-xs font-bold text-red-400">😰 Stress kills</p>
          <p className="font-mono text-xs leading-relaxed text-gray-400">
            If stress hits 100, you burn out. Game over.
          </p>
        </div>

        <div className="space-y-1 border-l-2 border-emerald-500 bg-emerald-950/20 p-2 sm:space-y-2 sm:p-3">
          <p className="font-mono text-xs font-bold text-emerald-400">💻 Skill unlocks better jobs</p>
          <p className="font-mono text-xs leading-relaxed text-gray-400">LeetCode grind is real.</p>
        </div>

        <div className="space-y-1 border-l-2 border-yellow-500 bg-yellow-950/20 p-2 sm:space-y-2 sm:p-3">
          <p className="font-mono text-xs font-bold text-yellow-400">⭐ Reputation opens doors</p>
          <p className="font-mono text-xs leading-relaxed text-gray-400">Network and build in public.</p>
        </div>

        <div className="space-y-1 border-l-2 border-green-500 bg-green-950/20 p-2 sm:space-y-2 sm:p-3">
          <p className="font-mono text-xs font-bold text-green-400">💰 Money grows with promotions</p>
          <p className="font-mono text-xs leading-relaxed text-gray-400">Chase that TC!</p>
        </div>
      </div>

      {/* Game Rules */}
      <div className="space-y-3 border-t border-gray-800 pt-3 sm:space-y-4 sm:pt-4">
        <h4 className="font-mono text-xs font-bold text-gray-500">📋 GAME RULES</h4>

        <div className="space-y-2">
          <p className="font-mono text-xs leading-relaxed text-gray-400">
            Click <span className="text-emerald-400">Next Year</span> to age up, get paid, and trigger random events.
          </p>

          <p className="font-mono text-xs leading-relaxed text-gray-400">
            Each year has <span className="text-cyan-400">52 weeks</span>. Use them wisely.
          </p>

          <p className="font-mono text-xs leading-relaxed text-gray-400">
            Most actions cost <span className="text-cyan-400">1 week</span>. Some cost more.
          </p>

          <p className="font-mono text-xs leading-relaxed text-gray-400">
            Coffee Binge is <span className="text-cyan-400">instant (0 weeks)</span> but adds stress.
          </p>
        </div>
      </div>

      {/* Difficulty Levels */}
      <div className="space-y-3 border-t border-gray-800 pt-3 sm:space-y-4 sm:pt-4">
        <h4 className="font-mono text-xs font-bold text-gray-500">🎮 DIFFICULTY LEVELS</h4>

        <div className="space-y-2">
          <div className="rounded bg-green-950/30 p-2">
            <p className="font-mono text-xs font-bold text-green-400">Easy: Family-Supported Student</p>
            <p className="font-mono text-xs leading-relaxed text-gray-400">
              Free rent + tuition for 4 years. Best for learning.
            </p>
          </div>

          <div className="rounded bg-yellow-950/30 p-2">
            <p className="font-mono text-xs font-bold text-yellow-400">Medium: Self-Taught</p>
            <p className="font-mono text-xs leading-relaxed text-gray-400">Flexible but grindy. No degree debt.</p>
          </div>

          <div className="rounded bg-red-950/30 p-2">
            <p className="font-mono text-xs font-bold text-red-400">Hardest: CS Student</p>
            <p className="font-mono text-xs leading-relaxed text-gray-400">
              $0 start + negative income (tuition) + rent. High risk, high reward.
            </p>
          </div>
        </div>
      </div>

      {/* Win Conditions */}
      <div className="space-y-3 border-t border-gray-800 pt-3 sm:space-y-4 sm:pt-4">
        <h4 className="font-mono text-xs font-bold text-gray-500">🏆 WIN CONDITIONS</h4>

        <div className="space-y-2">
          <div className="rounded bg-green-950/30 p-2">
            <p className="font-mono text-xs font-bold text-green-400">Victory</p>
            <p className="font-mono text-xs leading-relaxed text-gray-400">
              Reach CTO, Distinguished Fellow, Tech Mogul, or Industry Architect
            </p>
          </div>

          <div className="rounded bg-red-950/30 p-2">
            <p className="font-mono text-xs font-bold text-red-400">Burnout</p>
            <p className="font-mono text-xs leading-relaxed text-gray-400">Stress hits 100</p>
          </div>

          <div className="rounded bg-gray-900 p-2">
            <p className="font-mono text-xs font-bold text-gray-400">Bankruptcy</p>
            <p className="font-mono text-xs leading-relaxed text-gray-400">Money drops below $0</p>
          </div>
        </div>
      </div>

      {/* Career Paths */}
      <div className="space-y-3 border-t border-gray-800 pt-3 sm:space-y-4 sm:pt-4">
        <h4 className="font-mono text-xs font-bold text-gray-500">🛤️ CAREER PATHS</h4>

        <div className="space-y-2">
          <div className="space-y-1">
            <p className="font-mono text-xs font-bold text-purple-400">Corporate Ladder</p>
            <p className="font-mono text-xs text-gray-500">CS Student → Intern → Junior → Mid → Senior</p>
          </div>

          <div className="space-y-1">
            <p className="font-mono text-xs font-bold text-blue-400">Management Track</p>
            <p className="font-mono text-xs text-gray-500">Senior → Team Lead → Eng Manager → CTO</p>
          </div>

          <div className="space-y-1">
            <p className="font-mono text-xs font-bold text-cyan-400">IC Track</p>
            <p className="font-mono text-xs text-gray-500">Senior → Staff → Principal → Distinguished Fellow</p>
          </div>

          <div className="space-y-1">
            <p className="font-mono text-xs font-bold text-yellow-400">Hustler Path</p>
            <p className="font-mono text-xs text-gray-500">Freelancer → Digital Nomad</p>
          </div>

          <div className="space-y-1">
            <p className="font-mono text-xs font-bold text-green-400">Business Track</p>
            <p className="font-mono text-xs text-gray-500">Agency Owner → Tech Influencer → Tech Mogul</p>
          </div>

          <div className="space-y-1">
            <p className="font-mono text-xs font-bold text-orange-400">Specialist Track</p>
            <p className="font-mono text-xs text-gray-500">Contractor → Consultant → Industry Architect</p>
          </div>

          <p className="mt-2 font-mono text-xs italic leading-relaxed text-gray-600 sm:mt-3">
            💡 Senior devs can pick Management/IC. Freelancers can branch to Business/Specialist tracks.
          </p>
        </div>
      </div>
    </div>
  );
}
