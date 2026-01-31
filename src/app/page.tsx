import Image from 'next/image';

function StarField() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Stars Layer 1 - Small stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`star-sm-${String(i)}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{
              left: `${String(Math.random() * 100)}%`,
              top: `${String(Math.random() * 100)}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDelay: `${String(Math.random() * 3)}s`,
              animationDuration: `${String(Math.random() * 2 + 2)}s`,
            }}
          />
        ))}
      </div>
      {/* Stars Layer 2 - Medium stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`star-md-${String(i)}`}
            className="absolute w-0.75 h-0.75 bg-emerald-200 rounded-full animate-pulse"
            style={{
              left: `${String(Math.random() * 100)}%`,
              top: `${String(Math.random() * 100)}%`,
              opacity: Math.random() * 0.5 + 0.2,
              animationDelay: `${String(Math.random() * 4)}s`,
              animationDuration: `${String(Math.random() * 3 + 3)}s`,
            }}
          />
        ))}
      </div>
      {/* Stars Layer 3 - Large glowing stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`star-lg-${String(i)}`}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-pulse"
            style={{
              left: `${String(Math.random() * 100)}%`,
              top: `${String(Math.random() * 100)}%`,
              opacity: Math.random() * 0.4 + 0.2,
              animationDelay: `${String(Math.random() * 5)}s`,
              animationDuration: `${String(Math.random() * 4 + 4)}s`,
              boxShadow: '0 0 6px 2px rgba(103, 232, 249, 0.5)',
            }}
          />
        ))}
      </div>
      {/* Nebula effects */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)',
          top: '10%',
          left: '5%',
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)',
          bottom: '20%',
          right: '10%',
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full opacity-5 blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
          top: '50%',
          left: '40%',
        }}
      />
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0a0f14] text-white font-mono relative">
      {/* Universe Background */}
      <StarField />

      {/* Header */}
      <header className="relative z-10 border-b border-emerald-900/50 px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-[#0a0f14]/80">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Life@Dev Logo" width={40} height={40} className="rounded-full" />
          <div>
            <h1 className="text-emerald-400 font-bold text-xl">Life@Dev</h1>
            <p className="text-gray-500 text-xs">Survive the grind. Climb the ladder.</p>
          </div>
        </div>
        <div className="px-4 py-2 border border-emerald-600/50 rounded text-emerald-400 text-sm opacity-50 cursor-not-allowed">
          🎮 Coming Soon
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 bg-emerald-900/30 border border-emerald-700/50 rounded-full text-emerald-400 text-sm mb-6">
            🚀 Version 2.0 In Development
          </div>
          <h2 className="text-5xl font-bold mb-4 bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Your Developer Journey Awaits
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Start as a CS student, grind LeetCode, build side projects, survive burnout, and climb the tech ladder.
            Every week counts.
          </p>
        </div>

        {/* Preview Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Stats Preview */}
          <div className="bg-[#111921]/90 backdrop-blur-sm border border-emerald-900/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-emerald-900/30 rounded-lg flex items-center justify-center text-3xl">👨‍💻</div>
              <div>
                <p className="text-emerald-400 font-semibold">CS Student</p>
                <p className="text-gray-500 text-sm">Age 18</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">⚡ Energy</span>
                <span className="text-emerald-400">100/100</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-full bg-linear-to-r from-emerald-600 to-emerald-400 rounded-full"></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">😰 Stress</span>
                <span className="text-rose-400">0/100</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-linear-to-r from-rose-600 to-rose-400 rounded-full"></div>
              </div>
              <div className="pt-3 border-t border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">💰 Balance</span>
                  <span className="text-emerald-400">$500</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Preview */}
          <div className="bg-[#111921]/90 backdrop-blur-sm border border-emerald-900/30 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-emerald-400 text-sm font-semibold">TERMINAL — EVENT LOG</span>
              <span className="ml-auto flex items-center gap-1 text-xs text-rose-400">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                LIVE
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-emerald-400">
                <span className="text-yellow-400">[SUCCESS]</span> &gt; Viral Tweet! Your hot take resonated.
              </p>
              <p className="text-gray-400">
                <span className="text-rose-400">[EVENT]</span> &gt; Imposter Syndrome hits... "Am I even a dev?"
              </p>
              <p className="text-gray-400">
                <span className="text-cyan-400">[INFO]</span> &gt; Legacy bug took down production. RIP.
              </p>
              <p className="text-emerald-400 animate-pulse">$ _</p>
            </div>
          </div>

          {/* Actions Preview */}
          <div className="bg-[#111921]/90 backdrop-blur-sm border border-emerald-900/30 rounded-lg p-6">
            <p className="text-yellow-400 text-sm font-semibold mb-4">⚡ DAILY GRIND</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🚀', name: 'Side Project', time: '3w' },
                { icon: '📚', name: 'Read Docs', time: '0w' },
                { icon: '💼', name: 'Freelance Gig', time: '3w' },
                { icon: '🎤', name: 'Tech Conference', time: '3w' },
              ].map((action, i) => (
                <div
                  key={i}
                  className="bg-[#0a0f14] border border-emerald-900/50 rounded-lg p-3 text-center hover:border-emerald-600/50 transition-colors cursor-not-allowed opacity-75"
                >
                  <div className="text-2xl mb-1">{action.icon}</div>
                  <p className="text-xs text-gray-300">{action.name}</p>
                  <p className="text-xs text-gray-500 mt-1">⏱ {action.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-emerald-400">What&apos;s Coming in v2.0</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '📈', title: 'Career Paths', desc: 'Multiple tracks from startup to FAANG' },
              { icon: '🎲', title: 'Random Events', desc: 'Viral tweets, legacy bugs, burnout & more' },
              { icon: '🛒', title: 'Shop & Invest', desc: 'Keyboards, chairs, workstations' },
              { icon: '💾', title: 'Save Progress', desc: 'Local saves to continue your journey' },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-[#111921]/80 backdrop-blur-sm border border-gray-800 rounded-lg p-4 text-center hover:border-emerald-900/50 transition-colors"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Preview */}
        <div className="bg-[#111921]/90 backdrop-blur-sm border border-emerald-900/30 rounded-lg p-6 max-w-md mx-auto mb-16">
          <h4 className="text-sm font-semibold text-gray-400 mb-4">📊 SKILLS TO MASTER</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-[#0a0f14] rounded-lg border border-emerald-900/30">
              <p className="text-2xl font-bold text-emerald-400">100</p>
              <p className="text-xs text-gray-500 mt-1">💻 Coding</p>
            </div>
            <div className="p-3 bg-[#0a0f14] rounded-lg border border-yellow-900/30">
              <p className="text-2xl font-bold text-yellow-400">20</p>
              <p className="text-xs text-gray-500 mt-1">⭐ Reputation</p>
            </div>
            <div className="p-3 bg-[#0a0f14] rounded-lg border border-cyan-900/30">
              <p className="text-2xl font-bold text-cyan-400">0</p>
              <p className="text-xs text-gray-500 mt-1">🤝 Networking</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 text-center mt-3">Skills can reach up to 10,000+</p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-900/30 border border-emerald-700/50 rounded-lg text-emerald-400 backdrop-blur-sm">
            <span className="animate-spin">⚙️</span>
            <span>Engine Under Construction — Check Back Soon!</span>
          </div>
          <p className="text-gray-600 text-sm mt-4">Built with Next.js, TypeScript, and ☕</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-emerald-900/30 px-6 py-4 text-center text-gray-600 text-sm backdrop-blur-sm bg-[#0a0f14]/80">
        <p>Life@Dev v2.0 • © 2026 • Survive the grind. Climb the ladder.</p>
      </footer>
    </div>
  );
}
