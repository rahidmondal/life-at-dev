'use client';

import { LeaveGameModal } from '@/components/LeaveGameModal';
import { useGame } from '@/context/GameContext';
import Image from 'next/image';
import { useState } from 'react';
import { ActionsPanel } from './ActionsPanel';
import { EventLog } from './EventLog';
import { ProTipsPanel } from './ProTipsPanel';
import { StatsPanel } from './StatsPanel';

export function GameScreen() {
  const [mobileTab, setMobileTab] = useState<'stats' | 'events' | 'tips'>('stats');
  const { saveGameManually, isStorageReady, goToHomeScreen } = useGame();
  const [isSaving, setIsSaving] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await saveGameManually();
    setTimeout(() => {
      setIsSaving(false);
    }, 300);
  };

  const handleLogoClick = () => {
    setShowLeaveModal(true);
  };

  const handleGoHome = () => {
    setShowLeaveModal(false);
    goToHomeScreen();
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
  };

  return (
    <div className="flex h-screen flex-col bg-black">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-black px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 transition-opacity hover:opacity-80 active:opacity-60 sm:gap-4"
          aria-label="Go to home screen"
        >
          <Image
            src="/logo-sm.png"
            alt="Life @ Dev"
            width={60}
            height={60}
            className="h-12 w-12 rounded-lg sm:h-16 sm:w-16 lg:h-20 lg:w-20"
          />
          <div>
            <h1 className="font-mono text-lg font-bold text-emerald-400 sm:text-xl lg:text-2xl">Life@Dev</h1>
            <p className="hidden font-mono text-xs text-gray-400 sm:block">Survive the grind. Climb the ladder.</p>
          </div>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden w-80 shrink-0 lg:block">
          <StatsPanel />
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-hidden">
            <ActionsPanel />
          </div>

          <div className="hidden h-48 shrink-0 md:block">
            <EventLog />
          </div>
        </div>

        <div className="hidden w-80 shrink-0 lg:block">
          <ProTipsPanel />
        </div>
      </div>

      <div className="lg:hidden">
        {/* Tab Navigation */}
        <div className="flex border-t border-gray-800 bg-gray-950">
          <button
            onClick={() => {
              setMobileTab('stats');
            }}
            className={`flex-1 border-r border-gray-800 py-3 font-mono text-xs font-bold transition-colors sm:text-sm ${
              mobileTab === 'stats'
                ? 'bg-emerald-950 text-emerald-400'
                : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
            }`}
          >
            📊 Stats
          </button>
          <button
            onClick={() => {
              setMobileTab('events');
            }}
            className={`flex-1 border-r border-gray-800 py-3 font-mono text-xs font-bold transition-colors sm:text-sm ${
              mobileTab === 'events'
                ? 'bg-emerald-950 text-emerald-400'
                : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
            }`}
          >
            ⚡ Events
          </button>
          <button
            onClick={() => {
              setMobileTab('tips');
            }}
            className={`flex-1 py-3 font-mono text-xs font-bold transition-colors sm:text-sm ${
              mobileTab === 'tips'
                ? 'bg-emerald-950 text-emerald-400'
                : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
            }`}
          >
            💡 Tips
          </button>
        </div>

        {/* Tab Content */}
        <div className="h-64 overflow-hidden border-t border-gray-800">
          {mobileTab === 'stats' && <StatsPanel />}
          {mobileTab === 'events' && <EventLog />}
          {mobileTab === 'tips' && <ProTipsPanel />}
        </div>
      </div>

      {/* Floating Save Button - Mobile & Tablet Only */}
      {isStorageReady && (
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 font-mono text-2xl shadow-lg backdrop-blur-sm transition-all lg:hidden ${
            isSaving
              ? 'animate-pulse border-emerald-400 bg-emerald-500 text-black'
              : 'border-emerald-500 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black active:scale-95'
          }`}
          aria-label="Save Game"
        >
          💾
        </button>
      )}

      {/* Leave Game Modal */}
      {showLeaveModal && <LeaveGameModal onGoHome={handleGoHome} onCancel={handleCancelLeave} />}
    </div>
  );
}
