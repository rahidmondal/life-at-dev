'use client';

import HowToPlayModal from '@/components/HowToPlayModal';
import { RestartConfirmModal } from '@/components/RestartConfirmModal';
import StartingPathModal from '@/components/StartingPathModal';
import { useGame } from '@/context/GameContext';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================================
// MATRIX RAIN COMPONENT
// ============================================================================
interface MatrixRainProps {
  isMobile?: boolean;
}

function MatrixRain({ isMobile = false }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Katakana + Latin characters
    const katakana =
      'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const chars = katakana + latin;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = 12;
    const columns = Math.floor(width / fontSize);
    // Reduce density for subtlety
    const dropDensity = isMobile ? 0.3 : 0.6;
    const activeColumns = Math.floor(columns * dropDensity);

    // Create drops array with random starting positions
    const drops: number[] = [];
    for (let i = 0; i < activeColumns; i++) {
      drops[i] = Math.random() * -100;
    }

    let animationId: number;

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${String(fontSize)}px monospace`;

      for (let i = 0; i < activeColumns; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = (i / dropDensity) * fontSize;
        const y = drops[i] * fontSize;

        // Subtle glow effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#10B981';
        ctx.fillStyle = '#10B981';
        ctx.fillText(char, x, y);

        // Reset shadow for performance
        ctx.shadowBlur = 0;

        // Reset drop randomly or when it goes off screen
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return function cleanup() {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" style={{ opacity: 0.25 }} />;
}

// ============================================================================
// FLOATING PARTICLES COMPONENT
// ============================================================================
function FloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 15 + Math.random() * 20,
    size: 1 + Math.random() * 2,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-emerald-500/20"
          style={{
            left: `${String(p.left)}%`,
            bottom: '-10px',
            width: `${String(p.size)}px`,
            height: `${String(p.size)}px`,
            animation: `float-up ${String(p.duration)}s linear infinite`,
            animationDelay: `${String(p.delay)}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// MAIN START SCREEN COMPONENT
// ============================================================================
export function StartScreen() {
  const { dispatch, hasSavedGame, isStorageReady, resumeGame, restartGame } = useGame();
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showPathSelection, setShowPathSelection] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for matrix rain optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleStartGame = useCallback(() => {
    sessionStorage.removeItem('on-home-screen');
    setShowPathSelection(true);
  }, []);

  const handlePathSelect = useCallback(
    (path: 'student' | 'student-easy' | 'self-taught') => {
      dispatch({ type: 'START_GAME', payload: { path } });
      setShowPathSelection(false);
    },
    [dispatch],
  );

  const handleResume = useCallback(async () => {
    sessionStorage.removeItem('on-home-screen');
    await resumeGame();
  }, [resumeGame]);

  const handleRestartClick = useCallback(() => {
    setShowRestartConfirm(true);
  }, []);

  const handleRestartConfirm = useCallback(async () => {
    setShowRestartConfirm(false);
    await restartGame();
  }, [restartGame]);

  const handleRestartCancel = useCallback(() => {
    setShowRestartConfirm(false);
  }, []);

  return (
    <>
      {/* Background Layers */}
      <div className="fixed inset-0 z-0 bg-black" />
      <MatrixRain isMobile={isMobile} />
      <FloatingParticles />

      {/* Circuit Overlay Pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)`,
        }}
      />

      {/* Desktop Layout */}
      <div className="relative z-10 hidden h-screen items-center justify-center px-6 py-4 lg:flex">
        <div
          className={`w-full max-w-2xl space-y-5 rounded-2xl border border-emerald-500/20 bg-black/50 p-8 text-center shadow-xl shadow-emerald-500/10 backdrop-blur-md transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {/* Logo */}
          <div className="relative mx-auto w-fit">
            <Image
              src="/logo.png"
              alt="Life @ Dev Logo"
              width={320}
              height={240}
              className="mx-auto h-auto w-70 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              style={{
                animation: 'pulse-glow 4s ease-in-out infinite',
              }}
              priority
            />
          </div>

          {/* Tagline */}
          <div className="space-y-3">
            <h2 className="font-mono text-2xl font-bold tracking-tight text-emerald-400">
              Ready to Hack Your Way{' '}
              <span className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                to the Top?
              </span>
            </h2>

            <p className="mx-auto max-w-lg font-mono text-sm leading-relaxed text-gray-300">
              You&apos;re <span className="text-emerald-400">18</span>, fresh out of high school, with nothing but a
              laptop and big dreams. Can you go from <span className="text-red-400">unemployed</span> to{' '}
              <span className="text-emerald-400">CTO</span>?
            </p>
          </div>

          {/* Feature List - Matching old design */}
          <div className="mx-auto max-w-md space-y-1.5 rounded-lg border-l-2 border-emerald-500/50 bg-emerald-950/20 py-3 pl-4 pr-6 text-left">
            <p className="font-mono text-sm text-emerald-400">
              <span className="mr-2">💻</span> Grind your coding skills
            </p>
            <p className="font-mono text-sm text-emerald-400">
              <span className="mr-2">⭐</span> Build your reputation
            </p>
            <p className="font-mono text-sm text-gray-300">
              <span className="mr-2">⚡</span> Manage your energy <span className="text-red-400">(or burn out!)</span>
            </p>
            <p className="font-mono text-sm text-gray-300">
              <span className="mr-2">💰</span> Make tough choices{' '}
              <span className="text-red-400">(coffee or rent?)</span>
            </p>
          </div>

          {/* Hint Text */}
          <p className="font-mono text-xs text-gray-500">
            Click <span className="text-cyan-400">Next Year</span> to age up, get paid, and trigger random events.
          </p>

          {/* Desktop CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isStorageReady && hasSavedGame ? (
              <>
                <button
                  onClick={() => {
                    void handleResume();
                  }}
                  className="group relative overflow-hidden rounded-lg bg-linear-to-r from-emerald-600 to-emerald-500 px-10 py-3 font-mono text-base font-bold text-black shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/40"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">▶ Resume Game</span>
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                </button>

                <button
                  onClick={handleRestartClick}
                  className="rounded-lg border border-red-500/30 bg-red-500/5 px-6 py-3 font-mono text-sm font-medium text-red-400 transition-all duration-300 hover:border-red-400/50 hover:bg-red-500/10"
                >
                  🔄 Restart
                </button>
              </>
            ) : (
              <button
                onClick={handleStartGame}
                className="group relative overflow-hidden rounded-lg bg-linear-to-r from-emerald-600 to-emerald-500 px-10 py-3 font-mono text-base font-bold text-black shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/40"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">▶ Start Game</span>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </button>
            )}

            <button
              onClick={() => {
                setShowHowToPlay(true);
              }}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-6 py-3 font-mono text-sm font-medium text-emerald-400 transition-all duration-300 hover:border-emerald-400/50 hover:bg-emerald-500/10"
            >
              ❓ How to Play
            </button>
          </div>

          {/* Version Badge */}
          <div className="pt-2">
            <span className="font-mono text-[10px] text-gray-600">v1.0.0</span>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Cyberpunk Game Style */}
      <div className="relative z-10 flex min-h-screen flex-col lg:hidden">
        {/* Mobile Background Enhancements */}
        <div className="pointer-events-none fixed inset-0 z-0 lg:hidden">
          {/* Cyberpunk Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          {/* Radial Glows */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
          {/* Rising Particles */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-sm bg-emerald-400/40"
              style={{
                left: `${String(5 + i * 6.5)}%`,
                bottom: '-10px',
                animation: `rise-particle ${String(8 + (i % 5) * 3)}s linear infinite`,
                animationDelay: `${String(i * 0.7)}s`,
              }}
            />
          ))}
        </div>

        {/* Version Badge - Absolute Top Right */}
        <div className="absolute right-4 top-4 z-20">
          <span className="rounded-full border border-gray-700/50 bg-gray-900/60 px-2.5 py-1 font-mono text-[10px] text-gray-500 backdrop-blur-sm">
            v1.0.0
          </span>
        </div>

        {/* Main Content Area */}
        <div
          className={`relative flex flex-1 flex-col items-center justify-center px-6 pb-6 pt-16 transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {/* Logo with Animated Pulse Rings */}
          <div className="relative mb-5">
            {/* Outer Pulse Ring */}
            <div
              className="absolute -inset-8 rounded-full border border-emerald-500/20"
              style={{ animation: 'pulse-ring 3s ease-out infinite' }}
            />
            <div
              className="absolute -inset-12 rounded-full border border-emerald-500/10"
              style={{ animation: 'pulse-ring 3s ease-out infinite 0.5s' }}
            />
            {/* Inner Glow */}
            <div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-2xl" />
            <Image
              src="/logo.png"
              alt="Life @ Dev Logo"
              width={264}
              height={198}
              className="relative h-auto w-66 drop-shadow-[0_0_25px_rgba(16,185,129,0.5)]"
              style={{ animation: 'pulse-glow 4s ease-in-out infinite' }}
              priority
            />
          </div>

          {/* Tagline with Sparkles */}
          <div className="mb-6 flex items-center gap-2">
            <span className="text-emerald-400" style={{ animation: 'sparkle 2s ease-in-out infinite' }}>
              ✨
            </span>
            <h2 className="font-mono text-xl font-bold tracking-wide text-white">
              From <span className="text-emerald-400">Zero</span> to <span className="text-cyan-400">CTO</span>
            </h2>
            <span className="text-emerald-400" style={{ animation: 'sparkle 2s ease-in-out infinite 0.3s' }}>
              ✨
            </span>
          </div>

          {/* Feature List - The Grind List */}
          <div
            className={`w-full max-w-sm rounded-lg border-l-2 border-emerald-500 bg-emerald-950/20 py-4 pl-4 pr-5 backdrop-blur-sm transition-all delay-300 duration-700 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`}
          >
            <div className="space-y-2.5">
              <p className="font-mono text-sm">
                <span className="mr-2.5">💻</span>
                <span className="text-emerald-400">Grind</span>
                <span className="text-gray-300"> your coding skills</span>
              </p>
              <p className="font-mono text-sm">
                <span className="mr-2.5">⭐</span>
                <span className="text-emerald-400">Build</span>
                <span className="text-gray-300"> your reputation</span>
              </p>
              <p className="font-mono text-sm">
                <span className="mr-2.5">⚡</span>
                <span className="text-emerald-400">Manage</span>
                <span className="text-gray-300"> your energy </span>
                <span className="text-red-400">(or burn out!)</span>
              </p>
              <p className="font-mono text-sm">
                <span className="mr-2.5">💰</span>
                <span className="text-emerald-400">Make</span>
                <span className="text-gray-300"> tough choices </span>
                <span className="text-red-400">(coffee or rent?)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Action Area - Thumb Zone */}
        <div
          className={`shrink-0 border-t border-emerald-500/10 bg-gray-950/90 px-5 pb-safe pt-5 backdrop-blur-xl transition-all delay-400 duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}
        >
          {isStorageReady && hasSavedGame ? (
            <div className="space-y-3">
              {/* Resume - Primary CTA */}
              <button
                onClick={() => {
                  void handleResume();
                }}
                className="group relative min-h-14 w-full overflow-hidden rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 py-4 font-mono text-base font-bold text-black shadow-lg shadow-emerald-500/40 transition-all duration-300 active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">▶ Resume Journey</span>
                {/* Shine Effect */}
                <div
                  className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent"
                  style={{ animation: 'shine-sweep 3s ease-in-out infinite' }}
                />
              </button>

              {/* Secondary Buttons - Grid Layout */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setShowHowToPlay(true);
                  }}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 py-3.5 backdrop-blur-sm transition-all duration-300 active:scale-[0.98]"
                >
                  <span className="text-xl">❓</span>
                  <span className="font-mono text-xs font-medium text-emerald-400">How to Play</span>
                </button>
                <button
                  onClick={handleRestartClick}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/5 py-3.5 backdrop-blur-sm transition-all duration-300 active:scale-[0.98]"
                >
                  <span className="text-xl">🔄</span>
                  <span className="font-mono text-xs font-medium text-red-400">New Game</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Start Game - Primary CTA */}
              <button
                onClick={handleStartGame}
                className="group relative min-h-14 w-full overflow-hidden rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 py-4 font-mono text-base font-bold text-black shadow-lg shadow-emerald-500/40 transition-all duration-300 active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">🚀 Start Your Journey</span>
                {/* Shine Effect */}
                <div
                  className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent"
                  style={{ animation: 'shine-sweep 3s ease-in-out infinite' }}
                />
              </button>

              {/* Secondary Buttons - Grid Layout */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setShowHowToPlay(true);
                  }}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 py-3.5 backdrop-blur-sm transition-all duration-300 active:scale-[0.98]"
                >
                  <span className="text-xl">❓</span>
                  <span className="font-mono text-xs font-medium text-emerald-400">How to Play</span>
                </button>
                <button
                  onClick={() => {
                    window.history.back();
                  }}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-600/30 bg-gray-800/30 py-3.5 backdrop-blur-sm transition-all duration-300 active:scale-[0.98]"
                >
                  <span className="text-xl">🚪</span>
                  <span className="font-mono text-xs font-medium text-gray-400">Exit</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes pulse-glow {
          0%,
          100% {
            filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(16, 185, 129, 0.6));
          }
        }
        @keyframes pulse-ring {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        @keyframes sparkle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }
        @keyframes shine-sweep {
          0% {
            transform: translateX(-100%);
          }
          20%,
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes rise-particle {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100vh) rotate(180deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Modals */}
      {showHowToPlay && (
        <HowToPlayModal
          onClose={() => {
            setShowHowToPlay(false);
          }}
        />
      )}
      {showPathSelection && <StartingPathModal onSelect={handlePathSelect} />}
      {showRestartConfirm && <RestartConfirmModal onConfirm={handleRestartConfirm} onCancel={handleRestartCancel} />}
    </>
  );
}
