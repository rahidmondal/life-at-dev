'use client';

import { Job } from '@/types/game';
import { useState } from 'react';

interface GraduationModalProps {
  availableJobs: Job[];
  onSelectJob: (job: Job) => void;
  onCancel: () => void;
  isGraduation?: boolean;
}

export default function GraduationModal({
  availableJobs,
  onSelectJob,
  onCancel,
  isGraduation = true,
}: GraduationModalProps) {
  console.log('[DEBUG] GraduationModal rendering', { availableJobs: availableJobs.map(j => j.id), isGraduation });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const jobsByPath: Record<string, Job[]> = {};
  availableJobs.forEach(job => {
    const existing = jobsByPath[job.path] ?? [];
    jobsByPath[job.path] = [...existing, job];
  });

  const pathInfo: Record<string, { title: string; description: string; icon: string }> = {
    corporate: {
      title: 'Corporate Ladder',
      description: 'Stable salary, benefits, structured growth. Climb from Junior Dev to CTO.',
      icon: '🏢',
    },
    hustler: {
      title: 'Freelance / Hustler',
      description: 'Freedom and flexibility. Build your reputation, work on your terms.',
      icon: '🚀',
    },
    management: {
      title: 'Management Track',
      description: 'Lead teams, shape culture. Requires senior-level experience first.',
      icon: '👔',
    },
    ic: {
      title: 'Individual Contributor',
      description: 'Deep technical expertise. Principal Engineer, Distinguished Fellow.',
      icon: '🔬',
    },
  };

  const handleConfirm = () => {
    if (selectedJob) {
      onSelectJob(selectedJob);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-3 sm:p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded border-2 border-emerald-500 bg-black p-4 shadow-xl shadow-emerald-500/30 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-4 border-b-2 border-emerald-500/30 pb-4 text-center sm:mb-6 sm:pb-6 lg:mb-8">
          <div className="mb-3 text-4xl sm:text-5xl lg:mb-4 lg:text-6xl">{isGraduation ? '🎓' : '💼'}</div>
          <h2 className="mb-2 font-mono text-xl font-bold text-emerald-500 sm:text-2xl lg:mb-3 lg:text-3xl">
            {isGraduation ? '// GRADUATION CEREMONY' : '// CAREER OPPORTUNITY'}
          </h2>
          <p className="font-mono text-sm text-emerald-400 sm:text-base lg:text-lg">
            {isGraduation ? "Congratulations! You've completed your studies." : 'Choose your next career move'}
          </p>
          <p className="mt-1 font-mono text-xs text-gray-400 sm:mt-2 sm:text-sm">
            {isGraduation ? 'Now choose your career path...' : 'Multiple opportunities available...'}
          </p>
        </div>

        {/* Career Paths */}
        <div className="mb-4 space-y-3 sm:mb-6 sm:space-y-4">
          {Object.entries(jobsByPath).map(([path, jobs]) => {
            const info = pathInfo[path] ?? {
              title: 'Other',
              description: 'Other career opportunities',
              icon: '💼',
            };

            return (
              <div key={path} className="rounded-lg border-2 border-gray-700 bg-gray-900 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-3xl">{info.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-mono text-lg font-bold text-emerald-400">{info.title}</h3>
                    <p className="font-mono text-xs text-gray-400">{info.description}</p>
                  </div>
                </div>

                {/* Jobs in this path */}
                <div className="grid gap-3 md:grid-cols-2">
                  {jobs.map(job => (
                    <button
                      key={job.id}
                      onClick={() => {
                        setSelectedJob(job);
                      }}
                      className={`rounded border-2 p-3 text-left transition-all ${
                        selectedJob?.id === job.id
                          ? 'border-emerald-500 bg-emerald-950 shadow-lg shadow-emerald-500/20'
                          : 'border-gray-600 bg-gray-800 hover:border-emerald-500/50 hover:bg-gray-750'
                      }`}
                    >
                      <div className="mb-2 font-mono text-sm font-bold text-white">{job.title}</div>
                      <div className="space-y-1 font-mono text-xs text-gray-400">
                        <div>💰 ${(job.yearlyPay / 1000).toFixed(0)}k/year</div>
                        <div>
                          📋 Needs: Coding {job.requirements.coding}, Rep {job.requirements.reputation}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 border-t-2 border-emerald-500/30 pt-6">
          <button
            onClick={onCancel}
            className="rounded border-2 border-gray-600 bg-gray-800 px-6 py-2 font-mono text-sm text-gray-300 transition-colors hover:border-gray-500 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedJob}
            className={`rounded border-2 px-6 py-2 font-mono text-sm font-bold transition-all ${
              selectedJob
                ? 'border-emerald-500 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 hover:shadow-lg hover:shadow-emerald-500/20'
                : 'cursor-not-allowed border-gray-700 bg-gray-800 text-gray-500'
            }`}
          >
            {selectedJob ? `Start Career as ${selectedJob.title}` : 'Select a Job'}
          </button>
        </div>
      </div>
    </div>
  );
}
