'use client';

import { XIcon } from '../ui/icons';

interface HowToPlayModalProps {
  onClose: () => void;
}

/**
 * HowToPlayModal: A popup modal explaining game mechanics.
 * Cyberpunk-themed, consistent with the game's design system.
 */
export function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl border border-[#30363D] bg-[#0D1117] shadow-[0_0_60px_rgba(57,211,83,0.15)]"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30363D] bg-[#161B22] px-6 py-4">
          <div>
            <h2 className="font-mono text-xl font-bold text-[#39D353]">// HOW TO PLAY</h2>
            <p className="font-mono text-xs text-[#8B949E] mt-1">Master the game, climb the ladder</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#30363D] text-[#8B949E]
                       transition-all hover:border-[#39D353] hover:bg-[#39D353]/10 hover:text-[#39D353]"
            aria-label="Close modal"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6 space-y-6">
          {/* Game Overview */}
          <section>
            <h3 className="font-mono text-lg font-bold text-[#39D353] mb-3 flex items-center gap-2">
              <span>📖</span> THE JOURNEY
            </h3>
            <p className="font-mono text-sm text-[#C9D1D9] leading-relaxed">
              Life@Dev is a strategic simulation of a developer&apos;s career. You start at{' '}
              <span className="text-[#58A6FF]">age 18</span> and navigate weekly decisions until retirement at{' '}
              <span className="text-[#A371F7]">65</span>. Your goal? Reach the legendary{' '}
              <span className="text-[#39D353]">10,000 hours</span> of mastery while balancing ambition and humanity.
            </p>
          </section>

          {/* Core Mechanic: Skill vs XP */}
          <section>
            <h3 className="font-mono text-lg font-bold text-[#A371F7] mb-3 flex items-center gap-2">
              <span>⚔️</span> THE TWO-CURRENCY PUZZLE
            </h3>
            <div className="space-y-3 font-mono text-sm text-[#C9D1D9]">
              <p>The game separates your worth into two currencies:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3">
                  <p className="font-bold text-[#39D353] mb-1">💻 SKILL (Potential)</p>
                  <p className="text-[#8B949E] text-xs">
                    &quot;Book Smarts&quot; — Gained by studying, tutorials, side projects. Required to{' '}
                    <em>pass interviews</em>.
                  </p>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3">
                  <p className="font-bold text-[#A371F7] mb-1">⭐ XP (Proof)</p>
                  <p className="text-[#8B949E] text-xs">
                    &quot;Street Smarts&quot; — Gained by shipping code, fixing bugs, surviving crunches. Required for{' '}
                    <em>promotions</em>.
                  </p>
                </div>
              </div>
              <p className="text-[#F0883E] text-xs">
                ⚠️ High Skill + 0 XP = &quot;Paper Tiger&quot; — Brilliant in theory, unemployable in practice!
              </p>
            </div>
          </section>

          {/* Stats Explained */}
          <section>
            <h3 className="font-mono text-lg font-bold text-[#58A6FF] mb-3 flex items-center gap-2">
              <span>📊</span> THE LEDGER
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-sm">
              <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3">
                <p className="font-bold text-[#58A6FF] mb-1">⚡ ENERGY</p>
                <p className="text-[#8B949E] text-xs">
                  Your weekly action points. Every action costs energy. Run out = forced rest.
                </p>
              </div>
              <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3">
                <p className="font-bold text-[#FF7B72] mb-1">🔥 STRESS (0-100)</p>
                <p className="text-[#8B949E] text-xs">
                  50-80 = &quot;High Performance&quot; mode. 80+ = Danger Zone. 100 = Burnout risk!
                </p>
              </div>
              <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3">
                <p className="font-bold text-[#D2A8FF] mb-1">💰 MONEY</p>
                <p className="text-[#8B949E] text-xs">
                  Buys time (courses, tools) and survival (rent). Cash flow is king!
                </p>
              </div>
              <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3">
                <p className="font-bold text-[#F0883E] mb-1">🌟 REPUTATION</p>
                <p className="text-[#8B949E] text-xs">
                  Industry fame. Required for Senior+ roles. Build via networking & conferences.
                </p>
              </div>
            </div>
          </section>

          {/* Entropy: The Villain */}
          <section>
            <h3 className="font-mono text-lg font-bold text-[#FF7B72] mb-3 flex items-center gap-2">
              <span>⏳</span> ENTROPY: THE VILLAIN
            </h3>
            <p className="font-mono text-sm text-[#C9D1D9] leading-relaxed">
              Your skills <span className="text-[#FF7B72]">decay every week</span>. The higher your stats, the faster
              they fall. A Junior loses ~1 Skill/week. A CTO loses ~50/week. You must run just to stay in place!
            </p>
          </section>

          {/* Career Paths */}
          <section>
            <h3 className="font-mono text-lg font-bold text-[#39D353] mb-3 flex items-center gap-2">
              <span>🎯</span> CAREER TRACKS
            </h3>
            <div className="space-y-3 font-mono text-xs text-[#C9D1D9]">
              <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3">
                <p className="font-bold text-[#58A6FF] mb-2">🏢 CORPORATE LADDER (Stability)</p>
                <p className="text-[#8B949E]">
                  Intern → Junior → Mid → Senior → <span className="text-[#A371F7]">[Fork]</span>
                </p>
                <p className="text-[#8B949E] mt-1">
                  • <span className="text-[#39D353]">Management:</span> Lead → Manager → CTO
                </p>
                <p className="text-[#8B949E]">
                  • <span className="text-[#D2A8FF]">IC Track:</span> Staff → Principal → Distinguished
                </p>
              </div>
              <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3">
                <p className="font-bold text-[#F0883E] mb-2">🐺 HUSTLER PATH (Freedom)</p>
                <p className="text-[#8B949E]">
                  Unemployed → Freelancer → Nomad → <span className="text-[#A371F7]">[Fork]</span>
                </p>
                <p className="text-[#8B949E] mt-1">
                  • <span className="text-[#39D353]">Business:</span> Agency → Influencer → Tech Mogul
                </p>
                <p className="text-[#8B949E]">
                  • <span className="text-[#D2A8FF]">Specialist:</span> Contractor → Consultant → Architect
                </p>
              </div>
            </div>
          </section>

          {/* Endings */}
          <section>
            <h3 className="font-mono text-lg font-bold text-[#A371F7] mb-3 flex items-center gap-2">
              <span>🏆</span> ENDINGS
            </h3>
            <p className="font-mono text-xs text-[#8B949E] mb-3">
              After age 40 with $1M+ saved, you can choose to <span className="text-[#39D353]">Retire</span>. Or play
              until 65.
            </p>
            <div className="space-y-2 font-mono text-sm">
              <p className="text-[#C9D1D9]">
                <span className="text-[#FF7B72]">💔 The Tragedy:</span>{' '}
                <span className="text-[#8B949E]">Rich but unfulfilled. Penthouse, but alone.</span>
              </p>
              <p className="text-[#C9D1D9]">
                <span className="text-[#39D353]">🧘 The Zen Master:</span>{' '}
                <span className="text-[#8B949E]">Balanced life. Retired happy, teaching kids to code.</span>
              </p>
              <p className="text-[#C9D1D9]">
                <span className="text-[#A371F7]">🌟 The Legend:</span>{' '}
                <span className="text-[#8B949E]">Max everything. They named the npm library after you.</span>
              </p>
            </div>
          </section>

          {/* Game Over Conditions */}
          <section>
            <h3 className="font-mono text-lg font-bold text-[#FF7B72] mb-3 flex items-center gap-2">
              <span>☠️</span> FAILURE STATES
            </h3>
            <div className="space-y-2 font-mono text-sm">
              <p className="text-[#C9D1D9]">
                <span className="text-[#FF7B72] font-bold">💸 INSOLVENCY:</span> Money below $0 for 4 consecutive weeks.
                Evicted. Game Over.
              </p>
              <p className="text-[#C9D1D9]">
                <span className="text-[#FF7B72] font-bold">🏥 BURNOUT:</span> Hit 100 Stress with the [Fragile] tag =
                6-month forced leave, massive skill decay.
              </p>
            </div>
          </section>

          {/* Pro Tips */}
          <section>
            <h3 className="font-mono text-lg font-bold text-[#F0883E] mb-3 flex items-center gap-2">
              <span>💡</span> SURVIVAL TIPS
            </h3>
            <ul className="space-y-2 font-mono text-xs">
              <li className="flex items-start gap-2 text-[#C9D1D9]">
                <span className="text-[#39D353]">✓</span>
                <span>
                  <strong className="text-[#39D353]">Find your rhythm:</strong> Work 4 weeks, Study 1 week. Balance
                  Skill and XP.
                </span>
              </li>
              <li className="flex items-start gap-2 text-[#C9D1D9]">
                <span className="text-[#39D353]">✓</span>
                <span>
                  <strong className="text-[#A371F7]">Build streaks:</strong> Same action category 3x = Flow State (+20%
                  bonus).
                </span>
              </li>
              <li className="flex items-start gap-2 text-[#C9D1D9]">
                <span className="text-[#39D353]">✓</span>
                <span>
                  <strong className="text-[#FF7B72]">Don&apos;t crunch young:</strong> Burnouts leave permanent scars
                  ([Fragile] tag).
                </span>
              </li>
              <li className="flex items-start gap-2 text-[#C9D1D9]">
                <span className="text-[#39D353]">✓</span>
                <span>
                  <strong className="text-[#58A6FF]">Network matters:</strong> Past Senior, coding alone won&apos;t cut
                  it. Build Reputation!
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
