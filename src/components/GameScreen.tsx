'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ActionsPanel } from './ActionsPanel';
import { EventLog } from './EventLog';
import { ProTipsPanel } from './ProTipsPanel';
import { StatsPanel } from './StatsPanel';

export function GameScreen() {
  const [mobileTab, setMobileTab] = useState<'stats' | 'events' | 'tips'>('stats');

  return (
    <div className="flex h-screen flex-col bg-black">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-black px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
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
        </div>
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
    </div>
  );
}
