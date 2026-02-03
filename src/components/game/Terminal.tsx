'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { PlayIcon, TerminalIcon } from '../ui/icons';

/**
 * Terminal: The center feed showing game events and narrative.
 * Styled like VS Code terminal or Git log output.
 */
export function Terminal() {
  const { meta, eventLog, performAction } = useGameStore();
  const terminalRef = useRef<HTMLDivElement>(null);

  const weekInYear = meta.tick % 52;
  const entries = eventLog;

  // Auto-scroll to bottom when new events added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="flex flex-col h-full bg-[#0D1117]">
      {/* Terminal Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-[#161B22] border-b border-[#30363D]">
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} className="text-[#39D353]" />
          <span className="text-[#8B949E] text-sm font-mono">TERMINAL — EVENT LOG [{entries.length}]</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#39D353] animate-pulse" />
          <span className="text-[#39D353] text-xs">LIVE</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-3">
        {entries.length === 0 ? (
          <WelcomeMessage />
        ) : (
          entries.map((entry, index) => <TerminalEntry key={`${String(entry.tick)}-${String(index)}`} entry={entry} />)
        )}

        {/* Blinking Cursor */}
        <div className="flex items-center gap-2 text-[#39D353]">
          <span className="text-[#8B949E]">$</span>
          <span className="animate-blink">_</span>
        </div>
      </div>

      {/* Process Turn Button */}
      <div className="shrink-0 p-4 border-t border-[#30363D] bg-[#161B22]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#8B949E] text-xs font-mono">life@dev:~$</span>
          <span className="text-[#8B949E] text-xs">{entries.length} entries</span>
        </div>
        <button
          onClick={() => {
            performAction('skip_week');
          }}
          className="w-full py-3 px-4 bg-linear-to-r from-[#39D353]/20 to-[#39D353]/10
                     border border-[#39D353] rounded-lg text-[#39D353] font-bold
                     hover:from-[#39D353]/30 hover:to-[#39D353]/20 hover:shadow-[0_0_20px_rgba(57,211,83,0.3)]
                     transition-all duration-300 flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayIcon size={18} />
          Next Week ({52 - weekInYear}w left)
        </button>
      </div>
    </div>
  );
}

// Welcome message for new games
function WelcomeMessage() {
  return (
    <div className="space-y-2 text-[#8B949E]">
      <p className="text-[#39D353]">&gt; System initialized...</p>
      <p>&gt; Loading developer simulation...</p>
      <p>&gt; Connecting to career_engine.sys...</p>
      <p className="text-[#58A6FF]">[INFO] Welcome to Life@Dev v2.0</p>
      <p className="text-[#F0883E]">[WARN] student_loans.sys detected</p>
      <p>&gt; Ready. Make your first move.</p>
    </div>
  );
}

// Individual terminal entry
interface TerminalEntryProps {
  entry: {
    tick: number;
    eventId: string;
    message: string;
  };
}

function TerminalEntry({ entry }: TerminalEntryProps) {
  // Parse entry for special tags and effects
  const { tag, type } = parseEventType(entry.eventId);

  const tagColors: Record<string, string> = {
    SUCCESS: '#39D353',
    ERROR: '#FF7B72',
    WARN: '#F0883E',
    INFO: '#58A6FF',
    EVENT: '#A371F7',
    WORK: '#D2A8FF',
    BROKE: '#FF7B72',
    FLOW: '#39D353',
  };

  const color = tagColors[type] || '#8B949E';

  return (
    <div className="border-l-2 pl-3 py-1" style={{ borderColor: color }}>
      {/* Header */}
      <div className="flex items-center gap-2 text-xs mb-1">
        <span className="text-[#484F58]">[WEEK {entry.tick}]</span>
        {tag && (
          <span
            className="px-1.5 py-0.5 rounded text-xs font-bold"
            style={{
              backgroundColor: `${color}20`,
              color: color,
            }}
          >
            {tag}
          </span>
        )}
      </div>

      {/* Message */}
      <p className="text-[#C9D1D9]">&gt; {entry.message}</p>

      {/* Effects (if parsed from message) */}
      {parseEffects(entry.message).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {parseEffects(entry.message).map((effect, i) => (
            <span
              key={i}
              className={`text-xs font-mono ${effect.startsWith('+') ? 'text-[#39D353]' : 'text-[#FF7B72]'}`}
            >
              {effect.startsWith('+') ? '++' : '--'} {effect}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper to parse event type from ID
function parseEventType(eventId: string): { tag: string; type: string } {
  if (eventId.includes('success') || eventId.includes('complete')) {
    return { tag: 'SUCCESS', type: 'SUCCESS' };
  }
  if (eventId.includes('error') || eventId.includes('fail')) {
    return { tag: 'ERROR', type: 'ERROR' };
  }
  if (eventId.includes('warn')) {
    return { tag: 'WARNING', type: 'WARN' };
  }
  if (eventId.includes('work') || eventId.includes('job')) {
    return { tag: 'WORK', type: 'WORK' };
  }
  if (eventId.includes('broke')) {
    return { tag: 'BROKE', type: 'BROKE' };
  }
  if (eventId.includes('flow')) {
    return { tag: 'FLOW_STATE', type: 'FLOW' };
  }
  return { tag: 'EVENT', type: 'EVENT' };
}

// Helper to parse stat effects from message
function parseEffects(message: string): string[] {
  const effects: string[] = [];
  const patterns = [
    /\+\d+ Skill/gi,
    /-\d+ Skill/gi,
    /\+\d+ XP/gi,
    /-\d+ XP/gi,
    /\+\$\d+/gi,
    /-\$\d+/gi,
    /\+\d+ Energy/gi,
    /-\d+ Energy/gi,
    /\+\d+ Stress/gi,
    /-\d+ Stress/gi,
  ];

  patterns.forEach(pattern => {
    const matches = message.match(pattern);
    if (matches) {
      effects.push(...matches);
    }
  });

  return effects;
}
