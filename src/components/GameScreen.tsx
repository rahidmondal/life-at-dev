'use client';

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
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-emerald-500 bg-emerald-950">
            <span className="font-mono text-xl text-emerald-400">&lt;/&gt;</span>
          </div>
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
