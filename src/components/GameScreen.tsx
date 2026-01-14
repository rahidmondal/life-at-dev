'use client';

import { LeaveGameModal } from '@/components/LeaveGameModal';
import { useGame } from '@/context/GameContext';
import Image from 'next/image';
import { useState } from 'react';
import { ActionsPanel } from './ActionsPanel';
import { EventLog } from './EventLog';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileHeader } from './MobileHeader';
import { MobileMenuSheet } from './MobileMenuSheet';
import { MobileStatsDrawer } from './MobileStatsDrawer';
import { StatsPanel } from './StatsPanel';

type MobileTab = 'home' | 'work' | 'shop' | 'invest' | 'menu';
type DesktopActionTab = 'work' | 'shop' | 'invest';

export function GameScreen() {
  const [mobileTab, setMobileTab] = useState<MobileTab>('home');
  const [desktopActionTab, setDesktopActionTab] = useState<DesktopActionTab>('work');
  const { saveGameManually, isStorageReady, goToHomeScreen } = useGame();
  const [isSaving, setIsSaving] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showStatsDrawer, setShowStatsDrawer] = useState(false);
  const [showMenuSheet, setShowMenuSheet] = useState(false);

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

  const handleMobileTabChange = (tab: MobileTab) => {
    if (tab === 'menu') {
      setShowMenuSheet(true);
    } else {
      setMobileTab(tab);
    }
  };

  // Callback for when an action is performed on mobile - navigate back to home (Event Log)
  const handleMobileActionPerformed = () => {
    setMobileTab('home');
  };

  // Desktop Layout (≥1024px) - 3 Column Command Center
  const DesktopLayout = () => (
    <div className="hidden h-screen flex-col bg-black lg:flex">
      {/* Desktop Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-gray-800 bg-gray-950/50 px-6 py-4 backdrop-blur-sm">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-4 transition-opacity hover:opacity-80 active:opacity-60"
          aria-label="Go to home screen"
        >
          <Image
            src="/logo.png"
            alt="Life @ Dev"
            width={60}
            height={60}
            className="h-14 w-14 rounded-lg"
          />
          <div>
            <h1 className="font-mono text-xl font-bold text-emerald-400">Life@Dev</h1>
            <p className="font-mono text-xs text-gray-500">Survive the grind. Climb the ladder.</p>
          </div>
        </button>

        {/* Desktop Save Button */}
        {isStorageReady && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`rounded-lg border-2 px-6 py-2 font-mono text-sm font-bold transition-all ${
              isSaving
                ? 'animate-pulse border-emerald-400 bg-emerald-500 text-black'
                : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black'
            }`}
          >
            {isSaving ? '💾 Saving...' : '💾 Save Game'}
          </button>
        )}
      </header>

      {/* 3-Column Dashboard Layout */}
      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        {/* Left Panel - Profile & Vitals (Glass Card) */}
        <div className="w-80 shrink-0">
          <StatsPanel mode="desktop" />
        </div>

        {/* Center Panel - Event Log (The Terminal/Main Monitor) */}
        <div className="flex flex-1 flex-col">
          <EventLog mode="desktop" />
        </div>

        {/* Right Panel - Actions (The Control Deck) */}
        <div className="w-96 shrink-0">
          <ActionsPanel mode="desktop" activeTab={desktopActionTab} onTabChange={setDesktopActionTab} />
        </div>
      </div>
    </div>
  );

  // Mobile Layout (<1024px) - App-like with Bottom Nav
  const MobileLayout = () => (
    <div className="flex h-screen flex-col bg-black lg:hidden">
      {/* Mobile HUD Header */}
      <MobileHeader onProfileClick={() => { setShowStatsDrawer(true); }} />

      {/* Main Content Area - Changes based on Bottom Nav */}
      <main className="flex-1 overflow-hidden pb-16">
        {mobileTab === 'home' && <EventLog mode="mobile" />}
        {mobileTab === 'work' && <ActionsPanel mode="mobile" defaultTab="work" onActionPerformed={handleMobileActionPerformed} />}
        {mobileTab === 'shop' && <ActionsPanel mode="mobile" defaultTab="shop" onActionPerformed={handleMobileActionPerformed} />}
        {mobileTab === 'invest' && <ActionsPanel mode="mobile" defaultTab="invest" onActionPerformed={handleMobileActionPerformed} />}
      </main>

      {/* Bottom Navigation */}
      <MobileBottomNav activeTab={mobileTab} onTabChange={handleMobileTabChange} />

      {/* Stats Drawer */}
      <MobileStatsDrawer isOpen={showStatsDrawer} onClose={() => { setShowStatsDrawer(false); }} />

      {/* Menu Sheet */}
      <MobileMenuSheet
        isOpen={showMenuSheet}
        onClose={() => { setShowMenuSheet(false); }}
        onSave={handleSave}
        onGoHome={handleGoHome}
        isSaving={isSaving}
        isStorageReady={isStorageReady}
      />
    </div>
  );

  return (
    <>
      <DesktopLayout />
      <MobileLayout />

      {/* Leave Game Modal */}
      {showLeaveModal && <LeaveGameModal onGoHome={handleGoHome} onCancel={handleCancelLeave} />}
    </>
  );
}
