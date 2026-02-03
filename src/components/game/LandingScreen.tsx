'use client';

import { useEffect, useState } from 'react';
import { PlayIcon } from '../ui/icons';
import { HowToPlayModal } from './HowToPlayModal';
import { MatrixRain } from './MatrixRain';

interface LandingScreenProps {
  onStartGame: () => void;
  onContinue?: () => void;
}

export function LandingScreen({ onStartGame, onContinue }: LandingScreenProps) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <div className="h-screen bg-[#0D1117] text-[#C9D1D9] font-mono flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <div className="fixed inset-0 crt-scanlines z-50 pointer-events-none" />

      <MatrixRain isMobile={isMobile} />

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
        <div
          className="absolute w-64 h-64 rounded-full opacity-8 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(88,166,255,0.3) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <div className="hidden md:flex relative z-10 flex-col items-center justify-center flex-1">
        <div
          className="bg-[#0D1117]/80 backdrop-blur-sm border border-[#30363D] rounded-2xl p-5 lg:p-6
                      shadow-[0_0_60px_rgba(57,211,83,0.15),0_0_100px_rgba(57,211,83,0.05)]
                      max-w-md w-full text-center animate-fade-in flex flex-col items-center"
        >
          <img
            src="/logo.png"
            alt="Life@Dev Logo"
            className="w-36 lg:w-44 h-auto mb-3 drop-shadow-[0_0_30px_rgba(57,211,83,0.3)]"
          />

          <h1 className="text-xl lg:text-2xl font-bold text-[#39D353] mb-2">Build. Climb. Thrive.</h1>

          <p className="text-[#8B949E] text-xs lg:text-sm mb-3 max-w-sm leading-relaxed">
            A strategic simulation from <span className="text-[#58A6FF]">age 18</span> to retirement. Balance{' '}
            <span className="text-[#39D353]">ambition</span> and <span className="text-[#A371F7]">sanity</span> on the
            road to becoming a <span className="text-[#F0883E]">tech legend</span>.
          </p>

          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3 lg:p-4 mb-3 text-left w-full max-w-xs">
            <ul className="space-y-1.5 text-xs lg:text-sm">
              <li className="flex items-center gap-2">
                <span className="text-sm">🏢</span>
                <span className="text-[#C9D1D9]">
                  Climb the <span className="text-[#58A6FF]">corporate ladder</span> or go{' '}
                  <span className="text-[#F0883E]">freelance</span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sm">📚</span>
                <span className="text-[#C9D1D9]">
                  Study to learn, <span className="text-[#39D353]">work to prove</span> yourself
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sm">🔥</span>
                <span className="text-[#C9D1D9]">
                  Push hard or <span className="text-[#FF7B72]">burn out</span> trying
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sm">🎭</span>
                <span className="text-[#C9D1D9]">
                  Choose your ending: <span className="text-[#A371F7]">Legend, Zen, or Tragedy?</span>
                </span>
              </li>
            </ul>
          </div>

          <p className="text-[#8B949E] text-[10px] lg:text-xs mb-3">
            Every week counts. Every choice matters. <span className="text-[#39D353]">Will you make it?</span>
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            {onContinue && (
              <button
                onClick={onContinue}
                className="w-full py-3 bg-[#39D353] text-[#0D1117] font-bold rounded-lg text-sm
                           hover:bg-[#39D353]/90 hover:shadow-[0_0_30px_rgba(57,211,83,0.4)]
                           transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <PlayIcon size={16} />
                <span>Continue</span>
              </button>
            )}

            <div className="flex flex-row gap-3 justify-center items-center">
              <button
                onClick={onStartGame}
                className={`px-5 py-2.5 font-bold rounded-lg text-sm transition-all duration-300 flex items-center gap-2 justify-center ${
                  onContinue
                    ? 'bg-transparent border-2 border-[#30363D] text-[#C9D1D9] hover:border-[#39D353] hover:text-[#39D353]'
                    : 'bg-[#39D353] text-[#0D1117] hover:bg-[#39D353]/90 hover:shadow-[0_0_30px_rgba(57,211,83,0.4)]'
                }`}
              >
                <span>▶</span>
                <span>{onContinue ? 'New Game' : 'Start Game'}</span>
              </button>

              <button
                onClick={() => {
                  setShowHowToPlay(true);
                }}
                className="px-5 py-2.5 bg-transparent border-2 border-[#30363D] text-[#C9D1D9] font-bold rounded-lg text-sm
                           hover:border-[#39D353] hover:text-[#39D353]
                           transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <span>How to Play</span>
                <span>?</span>
              </button>
            </div>
            <div className="text-center text-[#8B949E] text-xs mt-3">v2.0.0</div>
          </div>
        </div>
      </div>

      <div className="flex md:hidden relative z-10 flex-col items-center justify-center flex-1 w-full px-4">
        <div className="flex flex-col items-center text-center">
          <img
            src="/logo.png"
            alt="Life@Dev Logo"
            className="w-80 h-auto mb-3 drop-shadow-[0_0_20px_rgba(57,211,83,0.3)]"
          />

          <h1 className="text-lg font-bold text-[#39D353] mb-1.5">Code. Climb. Survive.</h1>

          <p className="text-[#8B949E] text-[11px] mb-3 leading-relaxed max-w-70">
            From <span className="text-[#58A6FF]">age 18</span> to retirement. Balance{' '}
            <span className="text-[#39D353]">ambition</span> and <span className="text-[#A371F7]">sanity</span> to
            become a <span className="text-[#F0883E]">tech legend</span>.
          </p>

          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3 mb-3 text-left w-full max-w-70">
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-2">
                <span className="text-sm">🏢</span>
                <span className="text-[#C9D1D9]">
                  <span className="text-[#58A6FF]">Corporate</span> or <span className="text-[#F0883E]">Freelance</span>{' '}
                  — your call
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sm">📚</span>
                <span className="text-[#C9D1D9]">
                  Study to learn, <span className="text-[#39D353]">work to prove</span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sm">🔥</span>
                <span className="text-[#C9D1D9]">
                  Push hard or <span className="text-[#FF7B72]">burn out</span> trying
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sm">🎭</span>
                <span className="text-[#C9D1D9]">
                  <span className="text-[#A371F7]">Legend, Zen, or Tragedy?</span>
                </span>
              </li>
            </ul>
          </div>

          <p className="text-[#484F58] text-[10px] mb-4">
            Every choice matters. <span className="text-[#39D353]">Will you make it?</span>
          </p>

          <div className="flex flex-col gap-3 w-full max-w-70">
            {onContinue && (
              <button
                onClick={onContinue}
                className="w-full h-12 bg-[#39D353] text-[#0D1117] font-bold rounded-xl text-sm
                           active:scale-[0.98] transition-transform flex items-center justify-center gap-2
                           shadow-[0_0_20px_rgba(57,211,83,0.3)]"
              >
                <PlayIcon size={16} />
                <span>Continue</span>
              </button>
            )}

            <div className="flex flex-row gap-3 justify-center">
              <button
                onClick={onStartGame}
                className={`w-28 h-12 font-bold rounded-xl text-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5 ${
                  onContinue
                    ? 'bg-[#161B22] border border-[#30363D] text-[#8B949E]'
                    : 'bg-[#39D353] text-[#0D1117] shadow-[0_0_20px_rgba(57,211,83,0.3)]'
                }`}
              >
                <span>▶</span>
                <span>{onContinue ? 'New' : 'Start'}</span>
              </button>

              <button
                onClick={() => {
                  setShowHowToPlay(true);
                }}
                className="w-28 h-12 bg-[#161B22] border border-[#30363D] text-[#8B949E] font-medium rounded-xl text-sm
                           active:bg-[#1c2128] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>How to Play</span>
                <span>?</span>
              </button>
            </div>
            <div className="text-center text-[#8B949E] text-xs mt-3">v2.0.0</div>
          </div>
        </div>
      </div>

      {showHowToPlay && (
        <HowToPlayModal
          onClose={() => {
            setShowHowToPlay(false);
          }}
        />
      )}
    </div>
  );
}
