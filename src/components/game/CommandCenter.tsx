'use client';

import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { CheckCircleIcon, SaveIcon } from '../ui/icons';
import { ActionDeck } from './ActionDeck';
import { ExitGameModal } from './ExitGameModal';
import { Ledger } from './Ledger';
import { MobileActionSheet } from './MobileActionSheet';
import { MobileHeader } from './MobileHeader';
import { MobileNav } from './MobileNav';
import { Terminal } from './Terminal';

interface CommandCenterProps {
  onExitGame: () => void;
}

/**
 * CommandCenter: The main 3-column gameplay layout.
 * Desktop: [Ledger (25%) | Terminal (45%) | ActionDeck (30%)]
 * Mobile: Full-width Terminal with bottom nav and slide-up sheets
 */
export function CommandCenter({ onExitGame }: CommandCenterProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { saveGame } = useGameStore();

  const handleSave = async () => {
    if (saveStatus === 'saving') return;

    setSaveStatus('saving');
    try {
      await saveGame();
      setSaveStatus('saved');
      // Reset to idle after showing success
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to save game:', error);
      setSaveStatus('error');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }
  };

  const handleExitConfirm = () => {
    setShowExitModal(false);
    onExitGame();
  };

  return (
    <div className="h-screen bg-[#0D1117] text-[#C9D1D9] font-mono overflow-hidden relative">
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 crt-scanlines z-50 pointer-events-none" />

      {/* Exit Game Modal */}
      {showExitModal && (
        <ExitGameModal
          onConfirm={handleExitConfirm}
          onCancel={() => {
            setShowExitModal(false);
          }}
        />
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full flex-col">
        {/* Header */}
        <header className="shrink-0 h-14 border-b border-[#30363D] bg-[#161B22] flex items-center justify-between px-6">
          <button
            onClick={() => {
              setShowExitModal(true);
            }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
              <img src="/logo.png" alt="Life@Dev" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <h1 className="text-[#39D353] font-bold text-sm">Life@Dev</h1>
              <p className="text-[#484F58] text-xs">v2.0 • Command Center</p>
            </div>
          </button>

          <button
            onClick={() => void handleSave()}
            disabled={saveStatus === 'saving'}
            className={`flex items-center gap-2 px-4 py-2 border rounded text-sm transition-all ${
              saveStatus === 'saved'
                ? 'bg-[#39D353]/20 border-[#39D353] text-[#39D353]'
                : saveStatus === 'error'
                  ? 'bg-[#FF7B72]/10 border-[#FF7B72]/30 text-[#FF7B72]'
                  : saveStatus === 'saving'
                    ? 'bg-[#39D353]/10 border-[#39D353]/30 text-[#39D353] opacity-50 cursor-not-allowed'
                    : 'bg-[#39D353]/10 border-[#39D353]/30 text-[#39D353] hover:bg-[#39D353]/20'
            }`}
          >
            {saveStatus === 'saved' ? (
              <CheckCircleIcon size={16} />
            ) : (
              <SaveIcon size={16} className={saveStatus === 'saving' ? 'animate-pulse' : ''} />
            )}
            <span>
              {saveStatus === 'saving'
                ? 'Saving...'
                : saveStatus === 'saved'
                  ? 'Saved!'
                  : saveStatus === 'error'
                    ? 'Error!'
                    : 'Save Game'}
            </span>
          </button>
        </header>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-[300px_1fr_380px] gap-0 overflow-hidden">
          {/* Left: The Ledger */}
          <aside className="border-r border-[#30363D] overflow-y-auto">
            <Ledger />
          </aside>

          {/* Center: The Terminal */}
          <main className="overflow-hidden flex flex-col">
            <Terminal />
          </main>

          {/* Right: Action Deck */}
          <aside className="border-l border-[#30363D] overflow-y-auto">
            <ActionDeck />
          </aside>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Mobile Header with Stats */}
        <MobileHeader
          onTapStats={() => {
            setShowMobileStats(!showMobileStats);
          }}
          onTapLogo={() => {
            setShowExitModal(true);
          }}
        />

        {/* Stats Drawer (slides down on mobile) */}
        {showMobileStats && (
          <div className="fixed inset-x-0 top-14 z-40 bg-[#161B22] border-b border-[#30363D] p-4 animate-slide-down">
            <Ledger compact />
          </div>
        )}

        {/* Terminal Feed */}
        <main className="flex-1 overflow-hidden">
          <Terminal />
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav
          activeCategory={activeCategory}
          onCategorySelect={(cat: string) => {
            setActiveCategory(cat === activeCategory ? null : cat);
          }}
        />

        {/* Mobile Action Sheet */}
        {activeCategory && (
          <MobileActionSheet
            category={activeCategory}
            onClose={() => {
              setActiveCategory(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
