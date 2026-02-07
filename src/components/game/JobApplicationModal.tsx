'use client';

import { useState } from 'react';
import type { JobNode } from '../../types/career';
import { BriefcaseIcon, CheckIcon, XIcon } from '../ui/icons';

interface JobApplicationModalProps {
  availableJobs: JobNode[];
  isStudent: boolean;
  onSelectJob: (jobId: string) => void;
  onClose: () => void;
}

const TRACK_INFO: Record<string, { title: string; icon: string; color: string }> = {
  Corporate_L1: { title: 'Corporate', icon: '🏢', color: '#58A6FF' },
  Hustler_L1: { title: 'Freelance', icon: '🚀', color: '#A371F7' },
  Hustler_Business: { title: 'Business', icon: '💼', color: '#F0883E' },
  Hustler_Specialist: { title: 'Specialist', icon: '⚡', color: '#39D353' },
  Corp_Management: { title: 'Management', icon: '👔', color: '#F0883E' },
  Corp_IC: { title: 'IC Track', icon: '🔬', color: '#58A6FF' },
};

/**
 * JobApplicationModal: Shows available jobs when player clicks "Apply for Job".
 * Filters based on student status and job requirements.
 */
export function JobApplicationModal({ availableJobs, isStudent, onSelectJob, onClose }: JobApplicationModalProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Group jobs by track
  const jobsByTrack = new Map<string, JobNode[]>();
  availableJobs.forEach(job => {
    const track = job.track;
    const existing = jobsByTrack.get(track) ?? [];
    existing.push(job);
    jobsByTrack.set(track, existing);
  });

  const handleConfirm = () => {
    if (selectedJobId) {
      onSelectJob(selectedJobId);
    }
  };

  const noJobsAvailable = availableJobs.length === 0;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl mx-4 max-h-[85vh] bg-[#161B22] border-2 border-[#58A6FF] rounded-lg shadow-[0_0_40px_rgba(88,166,255,0.3)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#58A6FF]/10 border-b border-[#58A6FF]/30 px-6 py-4 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#58A6FF]/20 flex items-center justify-center">
            <BriefcaseIcon size={24} className="text-[#58A6FF]" />
          </div>
          <div className="flex-1">
            <h2 className="text-[#58A6FF] font-bold text-lg">
              {isStudent ? 'Internship Applications' : 'Job Applications'}
            </h2>
            <p className="text-[#8B949E] text-xs">
              {isStudent ? 'Available positions for students' : 'Positions matching your qualifications'}
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
          {noJobsAvailable ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-[#F85149] font-bold text-lg mb-2">No Positions Available</h3>
              <p className="text-[#8B949E] text-sm max-w-sm">
                {isStudent
                  ? "You don't meet the requirements for any internships yet. Keep studying and building your skills!"
                  : 'No jobs match your current qualifications. Try gaining more skills, XP, or reputation.'}
              </p>
              <div className="mt-6 bg-[#0D1117] border border-[#30363D] rounded-lg p-4 text-left max-w-sm">
                <p className="text-[#8B949E] text-xs mb-2">💡 Tips to unlock more jobs:</p>
                <ul className="text-[#C9D1D9] text-xs space-y-1">
                  <li>• Increase your coding skill</li>
                  <li>• Build corporate or freelance XP</li>
                  <li>• Network to gain reputation</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from(jobsByTrack.entries()).map(([track, jobs]) => {
                const trackInfo = TRACK_INFO[track] ?? { title: track, icon: '💼', color: '#8B949E' };

                return (
                  <div key={track} className="space-y-2">
                    {/* Track Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{trackInfo.icon}</span>
                      <span className="text-sm font-medium" style={{ color: trackInfo.color }}>
                        {trackInfo.title}
                      </span>
                    </div>

                    {/* Jobs in Track */}
                    <div className="grid gap-2">
                      {jobs.map(job => (
                        <button
                          key={job.id}
                          onClick={() => {
                            setSelectedJobId(job.id);
                          }}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selectedJobId === job.id
                              ? 'bg-[#58A6FF]/10 border-[#58A6FF]'
                              : 'bg-[#0D1117] border-[#30363D] hover:border-[#484F58]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p
                                className={`font-bold ${selectedJobId === job.id ? 'text-[#58A6FF]' : 'text-[#C9D1D9]'}`}
                              >
                                {job.title}
                              </p>
                              <p className="text-[#8B949E] text-xs mt-1">
                                Tier {job.tier} • {job.track}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[#39D353] font-bold">${job.salary.toLocaleString()}/yr</p>
                              <p className="text-[#8B949E] text-xs">
                                {job.incomeType === 'salary' ? 'Salary' : 'Volatile'}
                              </p>
                            </div>
                          </div>
                          {job.notes && <p className="text-[#6E7681] text-xs mt-2 italic">{job.notes}</p>}

                          {/* Selected indicator */}
                          {selectedJobId === job.id && (
                            <div className="mt-3 flex items-center gap-2 text-[#58A6FF] text-xs">
                              <CheckIcon size={14} />
                              <span>Selected</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-[#0D1117] border-t border-[#30363D] flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#30363D]/50 border border-[#30363D] rounded-lg text-[#8B949E] font-medium text-sm hover:text-[#C9D1D9] hover:border-[#484F58] transition-colors"
          >
            Cancel
          </button>
          {!noJobsAvailable && (
            <button
              onClick={handleConfirm}
              disabled={!selectedJobId}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-colors ${
                selectedJobId
                  ? 'bg-[#58A6FF]/20 border-2 border-[#58A6FF] text-[#58A6FF] hover:bg-[#58A6FF]/30'
                  : 'bg-[#30363D]/30 border border-[#30363D] text-[#484F58] cursor-not-allowed'
              }`}
            >
              Apply for Position
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
