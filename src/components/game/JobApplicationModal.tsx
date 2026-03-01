'use client';

import { useMemo } from 'react';
import { JOB_REGISTRY } from '../../data/tracks';
import { getRequirementDetails, type RequirementDetail } from '../../engine/career';
import type { JobNode } from '../../types/career';
import type { PlayerStats } from '../../types/gamestate';
import { BriefcaseIcon, CheckIcon, CodeIcon, FlagIcon, GlobeIcon, LockIcon, UsersIcon, XIcon } from '../ui/icons';

interface JobApplicationModalProps {
  currentJobId: string;
  stats: PlayerStats;
  isStudent: boolean;
  availableJobs: JobNode[];
  nextJobs: JobNode[];
  onSelectJob: (jobId: string) => void;
  onClose: () => void;
}

const TRACK_META: Record<string, { label: string; color: string; emoji: string }> = {
  Corporate_L1: { label: 'Corporate', color: '#58A6FF', emoji: '🏢' },
  Hustler_L1: { label: 'Freelance', color: '#A371F7', emoji: '🌐' },
  Corp_Management: { label: 'Management', color: '#F0883E', emoji: '👔' },
  Corp_IC: { label: 'IC Track', color: '#58A6FF', emoji: '⚙️' },
  Hustler_Business: { label: 'Business', color: '#F0883E', emoji: '🚀' },
  Hustler_Specialist: { label: 'Specialist', color: '#39D353', emoji: '🎯' },
};

const STAT_ICONS: Record<string, React.ReactNode> = {
  coding: <CodeIcon size={14} />,
  politics: <FlagIcon size={14} />,
  corporate: <BriefcaseIcon size={14} />,
  freelance: <GlobeIcon size={14} />,
  reputation: <UsersIcon size={14} />,
};

/**
 * Calculate overall readiness % across all requirements.
 */
function calcReadiness(requirements: RequirementDetail[]): number {
  if (requirements.length === 0) return 100;
  const total = requirements.reduce((sum, r) => {
    const pct = r.required > 0 ? Math.min(r.current / r.required, 1) : 1;
    return sum + pct;
  }, 0);
  return Math.round((total / requirements.length) * 100);
}

/**
 * JobApplicationModal: Shows all positions the player is eligible to apply for,
 * with a detailed stat comparison (current vs required).
 */
export function JobApplicationModal({
  currentJobId,
  stats,
  isStudent,
  availableJobs,
  nextJobs,
  onSelectJob,
  onClose,
}: JobApplicationModalProps) {
  const currentJob = JOB_REGISTRY[currentJobId];

  // Use the provided availableJobs list (already filtered by eligibility)
  const eligibleJobs = useMemo(() => {
    if (isStudent) {
      return availableJobs.filter(j => j.id === 'corp_intern' || j.id === 'hustle_freelancer');
    }
    return availableJobs;
  }, [availableJobs, isStudent]);

  // Terminal = job with no xpCap (top of track), but not unemployed special case
  const isTerminal = currentJob.xpCap === undefined && currentJobId !== 'unemployed';
  const showCrossroads = eligibleJobs.length > 1 && currentJobId !== 'unemployed';

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 max-h-[85vh] bg-[#161B22] border-2 border-[#58A6FF] rounded-lg shadow-[0_0_40px_rgba(88,166,255,0.3)] overflow-hidden flex flex-col">
        {/* ── Header ── */}
        <div className="bg-[#58A6FF]/10 border-b border-[#58A6FF]/30 px-6 py-4 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#58A6FF]/20 flex items-center justify-center">
            <BriefcaseIcon size={24} className="text-[#58A6FF]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[#58A6FF] font-bold text-lg">
              {showCrossroads ? 'Career Crossroads' : 'Next Position'}
            </h2>
            <p className="text-[#8B949E] text-xs truncate">
              Current: <span className="text-[#C9D1D9] font-medium">{currentJob.title}</span>
              {currentJob.salary > 0 ? ` · $${currentJob.salary.toLocaleString()}/yr` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#30363D] flex items-center justify-center text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#484F58] transition-colors shrink-0"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isTerminal ? (
            <TerminalState jobTitle={currentJob.title} />
          ) : eligibleJobs.length === 0 ? (
            <UpcomingPositionsState
              nextJobs={nextJobs}
              stats={stats}
              currentJobTitle={currentJob.title}
              isStudent={isStudent}
            />
          ) : (
            <div className="space-y-5">
              {showCrossroads && (
                <div className="rounded-lg border border-[#58A6FF]/30 bg-[#58A6FF]/5 px-4 py-3 text-center">
                  <p className="text-[#58A6FF] text-sm font-bold mb-0.5">🔀 Specialization Paths</p>
                  <p className="text-[#8B949E] text-xs">
                    You&apos;ve reached a crossroads. Choose your next career path below.
                  </p>
                </div>
              )}

              {eligibleJobs.map(job => (
                <NextPositionCard
                  key={job.id}
                  job={job}
                  stats={stats}
                  currentJobTitle={currentJob.title}
                  onApply={() => {
                    onSelectJob(job.id);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 bg-[#0D1117] border-t border-[#30363D] shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#30363D]/50 border border-[#30363D] rounded-lg text-[#8B949E] font-medium text-sm hover:text-[#C9D1D9] hover:border-[#484F58] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Position Card — shows one unlockable position with full stat comparison
// ═══════════════════════════════════════════════════════════════════════════

function NextPositionCard({
  job,
  stats,
  currentJobTitle,
  onApply,
}: {
  job: JobNode;
  stats: PlayerStats;
  currentJobTitle: string;
  onApply: () => void;
}) {
  const requirements = getRequirementDetails(stats, job);
  const allMet = requirements.length === 0 || requirements.every(r => r.met);
  const readiness = calcReadiness(requirements);
  const track = TRACK_META[job.track] ?? { label: job.track, color: '#8B949E', emoji: '💼' };

  return (
    <div
      className={`rounded-lg border-2 bg-[#0D1117] transition-all ${
        allMet ? 'border-[#39D353]/60 shadow-[0_0_15px_rgba(57,211,83,0.08)]' : 'border-[#30363D]'
      }`}
    >
      {/* ── Path Arrow ── */}
      <div className="px-4 pt-3 flex items-center gap-2 text-xs text-[#484F58]">
        <span className="truncate">{currentJobTitle}</span>
        <span className="text-[#39D353] shrink-0">→</span>
        <span className="text-[#C9D1D9] font-bold truncate">{job.title}</span>
      </div>

      {/* ── Job Header ── */}
      <div className="px-4 pt-2 pb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[#C9D1D9] font-bold text-lg leading-tight">{job.title}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span
              className="text-xs px-2 py-0.5 rounded-full border font-medium"
              style={{ color: track.color, borderColor: `${track.color}40` }}
            >
              {track.emoji} {track.label}
            </span>
            <span className="text-[#484F58] text-xs">Tier {job.tier}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[#39D353] font-bold text-xl">
            {job.salary > 0 ? `$${job.salary.toLocaleString()}` : 'Volatile'}
          </p>
          <p className="text-[#8B949E] text-[10px]">{job.salary > 0 ? '/year' : 'income'}</p>
        </div>
      </div>

      {/* ── Stat Comparison ── */}
      {requirements.length > 0 && (
        <div className="mx-4 mb-3 rounded-lg border border-[#30363D] bg-[#161B22] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_70px_70px_28px] gap-1 px-3 py-1.5 bg-[#21262D] text-[10px] font-semibold uppercase tracking-wider text-[#484F58]">
            <span>Stat</span>
            <span className="text-right">Yours</span>
            <span className="text-right">Need</span>
            <span />
          </div>
          {/* Rows */}
          {requirements.map(req => (
            <StatRow key={req.stat} requirement={req} />
          ))}
          {/* Overall readiness */}
          <div className="px-3 py-2 border-t border-[#30363D] flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8B949E]">Readiness</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-[#21262D] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    readiness >= 100 ? 'bg-[#39D353]' : readiness >= 60 ? 'bg-[#FFA657]' : 'bg-[#FF7B72]'
                  }`}
                  style={{ width: `${String(readiness)}%` }}
                />
              </div>
              <span
                className={`text-xs font-bold font-mono ${
                  readiness >= 100 ? 'text-[#39D353]' : readiness >= 60 ? 'text-[#FFA657]' : 'text-[#FF7B72]'
                }`}
              >
                {readiness}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── No requirements case ── */}
      {requirements.length === 0 && (
        <div className="mx-4 mb-3 rounded-lg border border-[#39D353]/30 bg-[#39D353]/5 px-3 py-2">
          <p className="text-[#39D353] text-xs font-medium">✓ No stat requirements — ready to apply!</p>
        </div>
      )}

      {/* ── Apply / Locked Button ── */}
      <div className="px-4 pb-4">
        {allMet ? (
          <button
            onClick={onApply}
            className="w-full py-3 rounded-lg font-bold text-sm transition-all bg-[#39D353]/20 border-2 border-[#39D353] text-[#39D353] hover:bg-[#39D353]/30 hover:shadow-[0_0_20px_rgba(57,211,83,0.25)]"
          >
            Apply Now — Interview Required
          </button>
        ) : (
          <div className="w-full py-3 rounded-lg text-center bg-[#30363D]/30 border border-[#30363D]">
            <p className="text-[#484F58] font-bold text-sm">Requirements Not Met</p>
            <p className="text-[#484F58] text-[10px] mt-0.5">
              {requirements
                .filter(r => !r.met)
                .map(r => r.label)
                .join(', ')}{' '}
              still needed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Stat row inside the comparison table
// ═══════════════════════════════════════════════════════════════════════════

function StatRow({ requirement }: { requirement: RequirementDetail }) {
  const { stat, label, current, required, met } = requirement;
  const icon = STAT_ICONS[stat] ?? null;
  const progress = required > 0 ? Math.min((current / required) * 100, 100) : 100;

  return (
    <div className="grid grid-cols-[1fr_70px_70px_28px] gap-1 items-center px-3 py-2 border-t border-[#30363D]/50">
      {/* Stat name + progress bar */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className={`shrink-0 ${met ? 'text-[#39D353]' : 'text-[#FF7B72]'}`}>{icon}</span>
          <span className="text-[#C9D1D9] text-xs font-medium truncate">{label}</span>
        </div>
        <div className="h-1 bg-[#21262D] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${met ? 'bg-[#39D353]' : 'bg-[#FF7B72]'}`}
            style={{ width: `${String(progress)}%` }}
          />
        </div>
      </div>

      {/* Current value */}
      <span className={`text-right font-mono text-xs font-bold ${met ? 'text-[#39D353]' : 'text-[#C9D1D9]'}`}>
        {Math.floor(current).toLocaleString()}
      </span>

      {/* Required value */}
      <span className="text-right font-mono text-xs text-[#8B949E]">{required.toLocaleString()}</span>

      {/* Status icon */}
      <div className="flex justify-center">
        {met ? <CheckIcon size={14} className="text-[#39D353]" /> : <LockIcon size={14} className="text-[#FF7B72]" />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Empty / terminal states
// ═══════════════════════════════════════════════════════════════════════════

function TerminalState({ jobTitle }: { jobTitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-5xl mb-4">👑</div>
      <h3 className="text-[#39D353] font-bold text-lg mb-2">Peak Position Reached</h3>
      <p className="text-[#8B949E] text-sm max-w-sm">
        As <span className="text-[#C9D1D9] font-medium">{jobTitle}</span>, you&apos;ve reached the top of your career
        track. There are no further promotions available.
      </p>
    </div>
  );
}

function NoPositionsState({ isStudent }: { isStudent: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-5xl mb-4">📭</div>
      <h3 className="text-[#F85149] font-bold text-lg mb-2">No Positions Available</h3>
      <p className="text-[#8B949E] text-sm max-w-sm">
        {isStudent
          ? "You don't meet the requirements for any internships yet. Keep studying and building your skills!"
          : 'No progression path found. Keep building your skills and experience.'}
      </p>
      <div className="mt-6 bg-[#0D1117] border border-[#30363D] rounded-lg p-4 text-left max-w-sm">
        <p className="text-[#8B949E] text-xs mb-2">💡 Tips to advance:</p>
        <ul className="text-[#C9D1D9] text-xs space-y-1">
          <li>• Increase your coding skill</li>
          <li>• Build corporate or freelance XP</li>
          <li>• Network to gain reputation</li>
        </ul>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

/**
 * Shows upcoming positions that the player is working toward, with readiness progress.
 * Displayed when no positions are currently eligible but next-tier jobs exist.
 */
function UpcomingPositionsState({
  nextJobs,
  stats,
  currentJobTitle,
  isStudent,
}: {
  nextJobs: JobNode[];
  stats: PlayerStats;
  currentJobTitle: string;
  isStudent: boolean;
}) {
  if (nextJobs.length === 0) {
    return <NoPositionsState isStudent={isStudent} />;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-[#FFA657]/30 bg-[#FFA657]/5 px-4 py-3 text-center">
        <p className="text-[#FFA657] text-sm font-bold mb-0.5">📋 Upcoming Positions</p>
        <p className="text-[#8B949E] text-xs">Keep building your skills to unlock these roles.</p>
      </div>

      {nextJobs.map(job => (
        <NextPositionCard key={job.id} job={job} stats={stats} currentJobTitle={currentJobTitle} onApply={noop} />
      ))}
    </div>
  );
}
