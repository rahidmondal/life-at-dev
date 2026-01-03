'use client';

interface HowToPlayModalProps {
  onClose: () => void;
}

export default function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="h-[90vh] w-full max-w-4xl overflow-hidden rounded border-2 border-cyan-400 bg-black shadow-xl shadow-cyan-400/20">
        {/* Header */}
        <div className="border-b-2 border-cyan-400/30 bg-cyan-400/5 p-4">
          <h2 className="font-mono text-2xl font-bold text-cyan-400">// HOW TO PLAY</h2>
          <p className="mt-1 font-mono text-xs text-cyan-400/70">Master the game, climb the ladder</p>
        </div>

        {/* Scrollable content */}
        <div className="h-[calc(100%-140px)] overflow-y-auto p-6">
          {/* Game Overview */}
          <section className="mb-6">
            <h3 className="mb-3 font-mono text-lg font-bold text-emerald-500">📖 GAME OVERVIEW</h3>
            <p className="mb-2 font-mono text-sm leading-relaxed text-white/90">
              Life @ Dev simulates a developer's career over multiple years. You start with 52 weeks per year and must
              balance work, learning, and well-being to climb the career ladder.
            </p>
          </section>

          {/* Win Conditions */}
          <section className="mb-6">
            <h3 className="mb-3 font-mono text-lg font-bold text-emerald-500">🏆 WIN CONDITIONS</h3>
            <div className="space-y-2 font-mono text-sm text-white/90">
              <p>Reach one of these top-tier positions:</p>
              <ul className="ml-4 list-disc space-y-1 text-emerald-500/80">
                <li>
                  <span className="text-white">CTO</span> - Management path
                </li>
                <li>
                  <span className="text-white">Distinguished Fellow</span> - IC path
                </li>
                <li>
                  <span className="text-white">Tech Mogul</span> - Business path
                </li>
                <li>
                  <span className="text-white">Industry Architect</span> - Specialist path
                </li>
              </ul>
            </div>
          </section>

          {/* Game Over Conditions */}
          <section className="mb-6">
            <h3 className="mb-3 font-mono text-lg font-bold text-red-500">☠️ GAME OVER CONDITIONS</h3>
            <div className="space-y-2 font-mono text-sm text-white/90">
              <p className="text-red-500/80">
                💀 <strong className="text-red-500">BURNOUT:</strong> Stress reaches 100
              </p>
              <p className="text-red-500/80">
                💸 <strong className="text-red-500">BANKRUPTCY:</strong> Money drops to $0 or below
              </p>
              <p className="text-emerald-500/70 text-xs mt-2">Manage your resources carefully!</p>
            </div>
          </section>

          {/* Stats Explained */}
          <section className="mb-6">
            <h3 className="mb-3 font-mono text-lg font-bold text-cyan-400">📊 STATS EXPLAINED</h3>
            <div className="space-y-3 font-mono text-sm">
              <div>
                <p className="font-bold text-cyan-400">⏳ WEEKS</p>
                <p className="text-white/80">
                  Your primary resource. Each action costs time. When you hit 0 weeks, the year ends.
                </p>
              </div>
              <div>
                <p className="font-bold text-emerald-500">⚡ ENERGY</p>
                <p className="text-white/80">
                  Drains from work. Recharge with rest, gym, or therapy. Low energy = lower action effectiveness.
                </p>
              </div>
              <div>
                <p className="font-bold text-pink-500">🔥 STRESS</p>
                <p className="text-white/80">
                  Increases from intense work. Reduce with vacation, therapy, or gym.{' '}
                  <strong className="text-red-500">100 stress = GAME OVER</strong>
                </p>
              </div>
              <div>
                <p className="font-bold text-cyan-400">💻 CODING</p>
                <p className="text-white/80">
                  Technical skill level (0-1000 scale). Required for job promotions. Gained through work and learning.
                </p>
              </div>
              <div>
                <p className="font-bold text-emerald-500">🎯 REPUTATION</p>
                <p className="text-white/80">
                  Industry visibility (0-1000 scale). Gained from networking, blogging, hackathons, and projects.
                </p>
              </div>
              <div>
                <p className="font-bold text-yellow-500">💰 MONEY</p>
                <p className="text-white/80">
                  Financial buffer. Earn through salary and gigs. Lose through expenses and rent.{' '}
                  <strong className="text-red-500">$0 = GAME OVER</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Actions Guide */}
          <section className="mb-6">
            <h3 className="mb-3 font-mono text-lg font-bold text-emerald-500">⚙️ ACTIONS GUIDE</h3>

            <div className="mb-4">
              <h4 className="mb-2 font-mono text-sm font-bold text-cyan-400">💼 WORK</h4>
              <ul className="ml-4 space-y-1 font-mono text-xs text-white/80">
                <li>
                  <strong>Grind LeetCode:</strong> +5 coding (1 week)
                </li>
                <li>
                  <strong>Freelance Gig:</strong> Random pay $300-800, +2 rep (4 weeks)
                </li>
                <li>
                  <strong>Side Project:</strong> +8 coding, +5 rep (3 weeks)
                </li>
                <li>
                  <strong>Hackathon:</strong> +20 coding, high stress (2 weeks)
                </li>
                <li>
                  <strong>Network Online:</strong> +10 rep ($100, 1 week)
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="mb-2 font-mono text-sm font-bold text-pink-500">🛒 SHOP</h4>
              <ul className="ml-4 space-y-1 font-mono text-xs text-white/80">
                <li>
                  <strong>Sleep In:</strong> +50 energy, -10 stress (1 week)
                </li>
                <li>
                  <strong>Coffee Binge:</strong> +25 energy, +10 stress ($15, 0 weeks)
                </li>
                <li>
                  <strong>Vacation:</strong> Full reset - +100 energy, -50 stress ($1000, 3 weeks)
                </li>
              </ul>
            </div>
          </section>

          {/* Career Paths */}
          <section className="mb-6">
            <h3 className="mb-3 font-mono text-lg font-bold text-emerald-500">🎯 CAREER PATHS</h3>
            <div className="space-y-2 font-mono text-xs text-white/80">
              <p>
                <strong className="text-cyan-400">Corporate Ladder:</strong> Traditional path (Student → Intern → Junior
                → Senior)
              </p>
              <p>
                <strong className="text-pink-500">Management Track:</strong> Lead teams (Team Lead → Manager → CTO)
              </p>
              <p>
                <strong className="text-emerald-500">IC Track:</strong> Deep tech expertise (Staff → Principal →
                Distinguished Fellow)
              </p>
              <p>
                <strong className="text-yellow-500">Hustler Path:</strong> Freelance freedom (Unemployed → Freelancer →
                Nomad)
              </p>
              <p>
                <strong className="text-purple-500">Business Track:</strong> Entrepreneurship (Agency → Influencer →
                Mogul)
              </p>
              <p>
                <strong className="text-cyan-400">Specialist Track:</strong> High-value consulting (Contractor →
                Consultant → Architect)
              </p>
            </div>
          </section>

          {/* Year-End Review */}
          <section className="mb-6">
            <h3 className="mb-3 font-mono text-lg font-bold text-cyan-400">📅 YEAR-END REVIEW</h3>
            <p className="mb-2 font-mono text-sm text-white/90">When weeks hit 0, the year ends:</p>
            <ul className="ml-4 list-disc space-y-1 font-mono text-xs text-white/80">
              <li>Salary is paid based on your job</li>
              <li>Rent is deducted (scales with career level)</li>
              <li>Automatic promotion check (if you meet requirements)</li>
              <li>Age increases by 1</li>
              <li>Weeks reset to 52 for next year</li>
            </ul>
          </section>

          {/* Job Interviews */}
          <section className="mb-6">
            <h3 className="mb-3 font-mono text-lg font-bold text-emerald-500">🎤 JOB INTERVIEWS</h3>
            <p className="font-mono text-sm text-white/90">
              Most job changes require passing a technical interview (multiple-choice question). Answer correctly to
              unlock the role. Wrong answers mean you'll need to try again next year.
            </p>
          </section>

          {/* Pro Tips */}
          <section>
            <h3 className="mb-3 font-mono text-lg font-bold text-emerald-500">💡 PRO TIPS</h3>
            <ul className="ml-4 list-disc space-y-2 font-mono text-xs text-emerald-500/80">
              <li className="text-white/80">
                <strong className="text-emerald-500">Balance is key:</strong> Don't neglect any stat too long
              </li>
              <li className="text-white/80">
                <strong className="text-cyan-400">Plan your year:</strong> Expensive actions early, cheap actions later
              </li>
              <li className="text-white/80">
                <strong className="text-pink-500">Watch stress:</strong> Better to rest early than burn out
              </li>
              <li className="text-white/80">
                <strong className="text-yellow-500">Save money:</strong> Keep a buffer for rent and emergencies
              </li>
              <li className="text-white/80">
                <strong className="text-emerald-500">Check requirements:</strong> Know what your next job needs
              </li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-cyan-400/30 bg-cyan-400/5 p-4">
          <button
            onClick={onClose}
            className="w-full rounded border-2 border-cyan-400 bg-cyan-400/10 px-4 py-2 font-mono text-sm font-bold text-cyan-400 transition-all hover:bg-cyan-400 hover:text-black"
          >
            &gt;&gt; GOT IT, LET&apos;S PLAY
          </button>
        </div>
      </div>
    </div>
  );
}
