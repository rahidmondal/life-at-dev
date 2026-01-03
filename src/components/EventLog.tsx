'use client';

import { useGame } from '@/context/GameContext';
import { LogEntry } from '@/types/game';
import { useEffect, useRef } from 'react';

export function EventLog() {
  const { state } = useGame();
  const { eventLog } = state;
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '!';
      case 'event':
        return '🎲';
      default:
        return '>';
    }
  };

  return (
    <div className="flex h-full flex-col border-t border-gray-800 bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-sm font-bold text-emerald-400">⚡ EVENT LOG [{eventLog.length} entries]</h3>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-xs text-gray-500">live</span>
          </div>
        </div>
      </div>

      {/* Log Content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
        {eventLog.length === 0 ? (
          <p className="text-gray-600">Waiting for events...</p>
        ) : (
          <div className="space-y-1">
            {eventLog.map(log => (
              <div key={log.id} className="flex items-start gap-2">
                <span className={`${getLogColor(log.type)} shrink-0`}>{getLogIcon(log.type)}</span>
                <span className={`${getLogColor(log.type)} flex-1`}>{log.message}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
