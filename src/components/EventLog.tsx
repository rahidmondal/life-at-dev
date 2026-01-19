'use client';

import { useGame } from '@/context/GameContext';
import { LogEntry } from '@/types/game';
import { useEffect, useRef } from 'react';

interface EventLogProps {
  mode?: 'desktop' | 'mobile';
}

export function EventLog({ mode = 'desktop' }: EventLogProps) {
  const { state } = useGame();
  const { eventLog } = state;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [eventLog]);

  const getLogColor = (type: LogEntry['type']): string => {
    switch (type) {
      case 'success':
        return 'text-emerald-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'event':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const getLogIcon = (type: LogEntry['type']): string => {
    switch (type) {
      case 'success':
        return '[SUCCESS]';
      case 'error':
        return '[ERROR]';
      case 'warning':
        return '[WARN]';
      case 'event':
        return '[EVENT]';
      default:
        return '[INFO]';
    }
  };

  const getLogBgColor = (type: LogEntry['type']): string => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/5 border-l-emerald-500/50';
      case 'error':
        return 'bg-red-500/5 border-l-red-500/50';
      case 'warning':
        return 'bg-yellow-500/5 border-l-yellow-500/50';
      case 'event':
        return 'bg-purple-500/5 border-l-purple-500/50';
      default:
        return 'bg-gray-500/5 border-l-gray-500/50';
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-emerald-500/20 bg-gray-950/80 backdrop-blur-md">
      {/* Terminal Header - CRT Monitor Style */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900/80 px-4 py-2">
        <div className="flex items-center gap-3">
          {/* Terminal dots */}
          {/* <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div> */}
          <h3 className="font-mono text-xs font-bold text-emerald-400">TERMINAL — EVENT LOG [{eventLog.length}]</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
          <span className="font-mono text-[10px] text-gray-500">LIVE</span>
        </div>
      </div>

      {/* Terminal Content - Scanline effect */}
      <div ref={scrollContainerRef} className="relative flex-1 overflow-y-auto">
        {/* CRT Scanline overlay */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-emerald-500/2 to-transparent bg-size-[100%_4px]" />

        {/* Log Content */}
        <div className="space-y-1 p-3 font-mono text-xs">
          {eventLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-600">
              <span className="mb-2 text-3xl">📺</span>
              <p>Waiting for events...</p>
              <p className="mt-1 text-[10px] text-gray-700">$ _</p>
            </div>
          ) : (
            <>
              {eventLog.map((log, index) => (
                <div
                  key={log.id}
                  className={`rounded border-l-2 px-3 py-1.5 ${getLogBgColor(log.type)} transition-all`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`shrink-0 font-bold ${getLogColor(log.type)}`}>{getLogIcon(log.type)}</span>
                    <span className={`flex-1 wrap-break-word leading-relaxed ${getLogColor(log.type)}`}>
                      {log.message}
                    </span>
                  </div>
                </div>
              ))}

              {/* Blinking cursor */}
              <div className="flex items-center gap-1 px-3 py-1 text-emerald-500">
                <span>$</span>
                <span className="animate-pulse">_</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="shrink-0 border-t border-gray-800/50 bg-gray-900/50 px-4 py-1.5">
        <div className="flex items-center justify-between font-mono text-[10px] text-gray-600">
          <span>life@dev:~$</span>
          <span>{eventLog.length} entries</span>
        </div>
      </div>
    </div>
  );
}
