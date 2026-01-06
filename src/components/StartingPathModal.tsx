'use client';

interface StartingPathModalProps {
  onSelect: (path: 'student' | 'student-easy' | 'self-taught') => void;
}

export default function StartingPathModal({ onSelect }: StartingPathModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-3 backdrop-blur-sm sm:px-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border-2 border-emerald-500 bg-zinc-950 shadow-2xl shadow-emerald-500/20">
        {/* Header */}
        <div className="border-b-2 border-emerald-500 bg-emerald-950/30 px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
          <h2 className="font-mono text-lg font-bold text-emerald-400 sm:text-xl lg:text-2xl">
            Choose Your Starting Path
          </h2>
          <p className="font-mono text-xs text-gray-400 sm:text-sm">This choice is permanent for this run</p>
        </div>

        {/* Path Options */}
        <div className="grid gap-3 p-3 sm:gap-4 sm:p-4 md:grid-cols-3 lg:gap-6 lg:p-6">
          {/* Option A - CS Student */}
          <button
            onClick={() => {
              onSelect('student');
            }}
            className="group relative overflow-hidden rounded-lg border-2 border-cyan-500 bg-cyan-950/20 p-6 text-left transition-all hover:scale-105 hover:border-cyan-400 hover:bg-cyan-950/40 hover:shadow-lg hover:shadow-cyan-500/30"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🎓</span>
                <div>
                  <h3 className="font-mono text-xl font-bold text-cyan-400">CS Student</h3>
                  <p className="font-mono text-xs text-gray-400">Academic Foundation</p>
                </div>
              </div>

              <div className="space-y-2 border-l-2 border-cyan-500/50 pl-4">
                <p className="font-mono text-sm text-cyan-300">Starting Stats:</p>
                <ul className="space-y-1 font-mono text-xs text-gray-300">
                  <li>
                    💰 Money: <span className="text-red-400">$0</span> (broke student)
                  </li>
                  <li>
                    💻 Coding: <span className="text-emerald-400">+100</span> (strong foundation)
                  </li>
                  <li>
                    ⭐ Reputation: <span className="text-emerald-400">+20</span> (some network)
                  </li>
                  <li>
                    🏠 Rent: <span className="text-yellow-400">$4,000/year</span> (dorm)
                  </li>
                  <li>
                    💸 Income: <span className="text-red-400">-$10,000/year</span> (tuition)
                  </li>
                </ul>
              </div>

              <div className="rounded border border-cyan-500/30 bg-cyan-950/30 p-3">
                <p className="font-mono text-xs italic text-cyan-200">
                  "Slower start, but structured growth. You'll need to grind through negative income, but your skills
                  will grow faster"
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-gray-400">Difficulty:</span>
                <div className="flex gap-1">
                  <div className="h-2 w-8 rounded-full bg-red-500" />
                  <div className="h-2 w-8 rounded-full bg-red-500" />
                  <div className="h-2 w-8 rounded-full bg-red-500" />
                </div>
              </div>
            </div>

            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-cyan-400/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>

          {/* Option B - CS Student Easy (Family Supported) */}
          <button
            onClick={() => {
              onSelect('student-easy');
            }}
            className="group relative overflow-hidden rounded-lg border-2 border-green-500 bg-green-950/20 p-6 text-left transition-all hover:scale-105 hover:border-green-400 hover:bg-green-950/40 hover:shadow-lg hover:shadow-green-500/30"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🏠</span>
                <div>
                  <h3 className="font-mono text-xl font-bold text-green-400">CS Student Easy</h3>
                  <p className="font-mono text-xs text-gray-400">Family Supported</p>
                </div>
              </div>

              <div className="space-y-2 border-l-2 border-green-500/50 pl-4">
                <p className="font-mono text-sm text-green-300">Starting Stats:</p>
                <ul className="space-y-1 font-mono text-xs text-gray-300">
                  <li>
                    💰 Money: <span className="text-green-400">$500</span> (small allowance)
                  </li>
                  <li>
                    💻 Coding: <span className="text-emerald-400">+100</span> (strong foundation)
                  </li>
                  <li>
                    ⭐ Reputation: <span className="text-emerald-400">+20</span> (some network)
                  </li>
                  <li>
                    🏠 Rent: <span className="text-green-400">$0 for 4 years</span> (family pays!)
                  </li>
                  <li>
                    💸 Tuition: <span className="text-green-400">$0 for 4 years</span> (family pays!)
                  </li>
                </ul>
              </div>

              <div className="rounded border border-green-500/30 bg-green-950/30 p-3">
                <p className="font-mono text-xs italic text-green-200">
                  "Family covers tuition and rent. Build skills and get promoted to paid jobs. When promoted or after 4
                  years, you're on your own."
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-gray-400">Difficulty:</span>
                <div className="flex gap-1">
                  <div className="h-2 w-8 rounded-full bg-green-500" />
                  <div className="h-2 w-8 rounded-full bg-gray-700" />
                  <div className="h-2 w-8 rounded-full bg-gray-700" />
                </div>
              </div>
            </div>

            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-green-400/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>

          {/* Option C - Self-Taught */}
          <button
            onClick={() => {
              onSelect('self-taught');
            }}
            className="group relative overflow-hidden rounded-lg border-2 border-emerald-500 bg-emerald-950/20 p-6 text-left transition-all hover:scale-105 hover:border-emerald-400 hover:bg-emerald-950/40 hover:shadow-lg hover:shadow-emerald-500/30"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">💪</span>
                <div>
                  <h3 className="font-mono text-xl font-bold text-emerald-400">Self-Taught / Unemployed</h3>
                  <p className="font-mono text-xs text-gray-400">Hustle from Zero</p>
                </div>
              </div>

              <div className="space-y-2 border-l-2 border-emerald-500/50 pl-4">
                <p className="font-mono text-sm text-emerald-300">Starting Stats:</p>
                <ul className="space-y-1 font-mono text-xs text-gray-300">
                  <li>
                    💰 Money: <span className="text-emerald-400">$1,000</span> (small cushion)
                  </li>
                  <li>
                    💻 Coding: <span className="text-gray-400">50</span> (basic skills)
                  </li>
                  <li>
                    ⭐ Reputation: <span className="text-gray-400">0</span> (unknown)
                  </li>
                  <li>
                    🏠 Rent: <span className="text-emerald-400">$6,000/year</span> (cheap)
                  </li>
                  <li>
                    💸 Income: <span className="text-gray-400">$0/year</span> (freelance to survive)
                  </li>
                </ul>
              </div>

              <div className="rounded border border-emerald-500/30 bg-emerald-950/30 p-3">
                <p className="font-mono text-xs italic text-emerald-200">
                  "No degree. No safety net. Maximum freedom. You'll need to freelance and grind hard, but progression
                  is in your hands."
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-gray-400">Difficulty:</span>
                <div className="flex gap-1">
                  <div className="h-2 w-8 rounded-full bg-yellow-500" />
                  <div className="h-2 w-8 rounded-full bg-yellow-500" />
                  <div className="h-2 w-8 rounded-full bg-gray-700" />
                </div>
              </div>
            </div>

            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-emerald-400/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
        </div>

        {/* Footer Note */}
        <div className="border-t-2 border-emerald-500/30 bg-zinc-900/50 px-6 py-3">
          <p className="text-center font-mono text-xs text-gray-400">
            💡 <span className="text-emerald-400">Pro Tip:</span> Family-Supported is easiest (free everything). CS
            Student is hardest (broke + debt). Self-Taught is medium (no debt, pure grind).
          </p>
        </div>
      </div>
    </div>
  );
}
