'use client';

import Image from 'next/image';
import { ActionsPanel } from './ActionsPanel';
import { EventLog } from './EventLog';
import { ProTipsPanel } from './ProTipsPanel';
import { StatsPanel } from './StatsPanel';

export function GameScreen() {
  return (
    <div className="flex h-screen flex-col bg-black">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-black px-6 py-4">
        <div className="flex items-center gap-4">
          <Image src="/logo-sm.png" alt="Life @ Dev" width={100} height={100} className="rounded-lg" />
          <div>
            <h1 className="font-mono text-2xl font-bold text-emerald-400">Life@Dev</h1>
            <p className="font-mono text-xs text-gray-400">Survive the grind. Climb the ladder.</p>
          </div>
        </div>

        {/* TODO Phase 3: Add user menu and settings */}
        {/*
        <div className="flex items-center gap-4">
          <button className="font-mono text-sm text-gray-400 hover:text-emerald-400">
            Settings
          </button>
        </div>
        */}
      </header>

      {/* Main Game Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Stats */}
        <div className="w-80 shrink-0">
          <StatsPanel />
        </div>

        {/* Center Panel - Actions */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-hidden">
            <ActionsPanel />
          </div>

          {/* Event Log at Bottom */}
          <div className="h-48 shrink-0">
            <EventLog />
          </div>
        </div>

        {/* Right Sidebar - Pro Tips */}
        <div className="w-80 shrink-0">
          <ProTipsPanel />
        </div>
      </div>
    </div>
  );
}
