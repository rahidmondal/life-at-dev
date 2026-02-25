'use client';

import { useMemo } from 'react';
import { JOB_REGISTRY } from '../../data/tracks';
import { getRequirementDetails, type RequirementDetail } from '../../engine/career';
import { getNextPositions } from '../../engine/promotion';
import type { JobNode } from '../../types/career';
import type { PlayerStats } from '../../types/gamestate';
import { BriefcaseIcon, CheckIcon, CodeIcon, FlagIcon, GlobeIcon, LockIcon, UsersIcon, XIcon } from '../ui/icons';

interface JobApplicationModalProps {
  currentJobId: string;
  stats: PlayerStats;
  isStudent: boolean;
  onSelectJob: (jobId: string) => void;
  onClose: () => void;
}

const TRACK_LABELS: Record<string, { label: string; color: string }> = {
  Corporate_L1: { label: 'Corporate', color: '#58A6FF' },
  Hustler_L1: { label: 'Freelance', color: '#A371F7' },
  Corp_Management: { label: 'Management', color: '#F0883E' },
  Corp_IC: { label: 'IC Track', color: '#58A6FF' },
  Hustler_Business: { label: 'Business', color: '#F0883E' },
  Hustler_Specialist: { label: 'Specialist', color: '#39D353' },
};

const STAT_ICONS: Record<string, React.ReactNode> = {
  coding: <CodeIcon size={14} />,
  politics: <FlagIcon size={14} />,
  corporate: <BriefcaseIcon size={14} />,
  freelance: <GlobeIcon size={14} />,
  reputation: <UsersIcon size={14} />,
};

/**
 * JobApplicationModal: Shows the next position(s) in the player's career track
 * with a clear requirements comparison (current stats vs required).
 */
export function JobApplicationModal({
  currentJobId,
  stats,
  isStudent,
  onSelectJob,
  onClose,
}: JobApplicationModalProps) {
  const currentJob = JOB_REGISTRY[currentJobId];

  const nextPositions = useMemo(() => {
    const positions = getNextPositions(currentJobId);
    if (isStudent) {
      return positions.filter(j => j.id === 'corp_intern' || j.id === 'hustle_freelancer');
    }
    return positions;
  }, [currentJobId, isStudent]);

  const isTerminal = currentJob?.xpCap === undefined && currentJobId !== 'unemployed';
  const showCrossroads = nextPositions.length > 1 && currentJobId !== 'unemployed';

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 max-h-[85vh] bg-[#161B22] border-2 border-[#58A6FF] rounded-lg shadow-[0_0_40px_rgba(88,166,255,0.3)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#58A6FF]/10 border-b border-[#58A6FF]/30 px-6 py-4 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#58A6FF]/20 flex items-center justify-center">
            <BriefcaseIcon size={24} className="text-[#58A6FF]" />
          </div>
          <div className="flex-1">
            <h2 className="text-[#58A6FF] font-bold text-lg">
              {showCrossroads ? 'Career Crossroads' : 'Job Application'}
            </h2>
            <p className="text-[#8B949E] text-xs">
              Current: <span className="text-[#C9D1D9] font-medium">{currentJob?.title ?? 'Unknown'}</span>
              {currentJob?.salary ? ` • $${currentJob.salary.toLocaleString()}/yr` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#30363D] flex items-center justify-center text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#484F58] transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isTerminal ? (
            <TerminalState jobTitle={currentJob.title} />
          ) : nextPositions.length === 0 ? (
            <NoPositionsState isStudent={isStudent} />
          ) : (
            <div className="space-y-4">
              {showCrossroads && (
                <p className="text-[#8B949E] text-sm text-center mb-2">Choose your specialization path:</p>
              )}
              {nextPositions.map(job => (
                <NextPositionCard
                  key={job.id}
                  job={job}
                  stats={stats}
                  onApply={() => {
                    onSelectJob(job.id);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
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

function NextPositionCard({ job, stats, onApply }: { job: JobNode; stats: PlayerStats; onApply: () => void }) {
  const requirements = getRequirementDetails(stats, job);
  const allMet = requirements.length === 0 || requirements.every(r => r.met);
  const trackInfo = TRACK_LABELS[job.track] ?? { label: job.track, color: '#8B949E' };

  return (
    <div
      className={`rounded-lg border-2 bg-[#0D1117] transition-all ${
        allMet ? 'border-[#39D353]/50' : 'border-[#30363D]'
      }`}
    >
      {/* Job Header */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between">
        <div>
          <h3 className="text-[#C9D1D9] font-bold text-base">{job.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{ color: trackInfo.color, borderColor: `${trackInfo.color}40` }}
            >
              {trackInfo.label}
            </span>
            <span className="text-[#8B949E] text-xs">Tier {job.tier}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[#39D353] font-bold text-lg">
            {job.salary > 0 ? `$${job.salary.toLocaleString()}` : 'Volatile'}
          </p>
          <p className="text-[#8B949E] text-[10px]">{job.salary > 0 ? '/year' : 'income'}</p>
        </div>
      </div>

      {/* Requirements */}
      {requirements.length > 0 && (
        <div className="px-4 pb-3 space-y-2">
          <p className="text-[#8B949E] text-[10px] font-semibold uppercase tracking-wider">Requirements</p>
          {requirements.map(req => (
            <RequirementRow key={req.stat} requirement={req} />
          ))}
        </div>
      )}

      {/* Apply Button */}
      <div className="px-4 pb-4">
        <button
          onClick={onApply}
          disabled={!allMet}
          className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
            allMet
              ? 'bg-[#39D353]/20 border-2 border-[#39D353] text-[#39D353] hover:bg-[#39D353]/30 hover:shadow-[0_0_15px_rgba(57,211,83,0.2)]'
              : 'bg-[#30363D]/30 border border-[#30363D] text-[#484F58] cursor-not-allowed'
          }`}
        >
          {allMet ? 'Apply Now' : 'Requirements Not Met'}
        </button>
      </div>
    </div>
  );
}

function RequirementRow({ requirement }: { requirement: RequirementDetail }) {
  const { stat, label, current, required, met } = requirement;
  const progress = Math.min((current / required) * 100, 100);
  const icon = STAT_ICONS[stat] ?? null;

  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 shrink-0 ${met ? 'text-[#39D353]' : 'text-[#FF7B72]'}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-[11px] mb-0.5">
          <span className="text-[#8B949E]">{label}</span>
          <span className={met ? 'text-[#39D353]' : 'text-[#FF7B72]'}>
            {Math.floor(current).toLocaleString()} / {required.toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 bg-[#21262D] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${met ? 'bg-[#39D353]' : 'bg-[#FF7B72]'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="w-4 shrink-0">
        {met ? <CheckIcon size={14} className="text-[#39D353]" /> : <LockIcon size={14} className="text-[#FF7B72]" />}
      </div>
    </div>
  );
}

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
