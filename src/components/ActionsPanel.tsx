'use client';

import { useGame } from '@/context/GameContext';
import { getActionsByCategory, getUnavailabilityReason, isActionAvailable } from '@/data/actions';
import { getAvailablePromotions, shouldShowGraduationCeremony } from '@/data/jobs';
import { executeAction } from '@/logic/actions';
import { generateRandomEvent } from '@/logic/events';
import { Job } from '@/types/game';
import { useEffect, useState } from 'react';
import GraduationModal from './GraduationModal';
import InterviewModal from './InterviewModal';

type Tab = 'work' | 'shop' | 'invest';

interface ActionsPanelProps {
  mode?: 'desktop' | 'mobile';
  defaultTab?: Tab;
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
  onActionPerformed?: () => void;
}

// Helper: Check if job requires interview (intermediate jobs skip interviews)
function requiresInterview(job: Job): boolean {
  return !job.isIntermediate;
}

// Helper: Check if candidate meets job requirements
function meetsJobRequirements(
  job: Job,
  coding: number,
  reputation: number,
  money: number,
): { meets: boolean; failureReasons: string[] } {
  const reasons: string[] = [];

  if (coding < job.requirements.coding) {
    reasons.push(`Need ${String(job.requirements.coding)} coding skill (you have ${String(coding)})`);
  }

  if (reputation < job.requirements.reputation) {
    reasons.push(`Need ${String(job.requirements.reputation)} reputation (you have ${String(reputation)})`);
  }

  if (job.requirements.money && money < job.requirements.money) {
    reasons.push(`Need $${job.requirements.money.toLocaleString()} (you have $${money.toLocaleString()})`);
  }

  return {
    meets: reasons.length === 0,
    failureReasons: reasons,
  };
}

// Action icon mapping
const ACTION_ICONS: Record<string, string> = {
  work: '💼',
  study: '📚',
  leetcode: '🧩',
  freelance: '💻',
  'side-project': '🚀',
  'job-hunt': '🔍',
  network: '🤝',
  coffee: '☕',
  sleep: '😴',
  vacation: '🏖️',
  gym: '💪',
  therapy: '🧘',
  'energy-drink': '⚡',
  bootcamp: '🎓',
  conference: '🎤',
  course: '📖',
  mentor: '👨‍🏫',
  stocks: '📈',
  crypto: '₿',
  startup: '🦄',
  'real-estate': '🏠',
  default: '▶️',
};

function getActionIcon(actionId: string): string {
  // Try exact match first
  if (ACTION_ICONS[actionId]) return ACTION_ICONS[actionId];

  // Try partial match
  for (const [key, icon] of Object.entries(ACTION_ICONS)) {
    if (actionId.includes(key)) return icon;
  }

  return ACTION_ICONS.default;
}

export function ActionsPanel({
  mode = 'desktop',
  defaultTab = 'work',
  activeTab: controlledActiveTab,
  onTabChange,
  onActionPerformed,
}: ActionsPanelProps) {
  const { state, dispatch } = useGame();
  const { stats, pendingYearEndInterview, pendingJobSelection } = state;

  // Use controlled tab if provided (from parent), otherwise use internal state
  const [internalActiveTab, setInternalActiveTab] = useState<Tab>(defaultTab);
  const activeTab = controlledActiveTab ?? internalActiveTab;

  const setActiveTab = (tab: Tab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  const [showJobSelectionModal, setShowJobSelectionModal] = useState(false);
  const [availableJobsList, setAvailableJobsList] = useState<Job[]>([]);
  const [isGraduation, setIsGraduation] = useState(false);

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewTargetJob, setInterviewTargetJob] = useState<Job | null>(null);
  const [isYearEndInterview, setIsYearEndInterview] = useState(false);

  const [showRejectionPopup, setShowRejectionPopup] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);

  useEffect(() => {
    if (pendingJobSelection && pendingJobSelection.length > 0) {
      setAvailableJobsList(pendingJobSelection);
      setIsGraduation(false);
      setShowJobSelectionModal(true);
    }
  }, [pendingJobSelection]);

  useEffect(() => {
    if (pendingYearEndInterview && !showInterviewModal) {
      setInterviewTargetJob(pendingYearEndInterview);
      setIsYearEndInterview(true);
      setShowInterviewModal(true);
    }
  }, [pendingYearEndInterview, showInterviewModal]);

  const actions = getActionsByCategory(activeTab);

  const handleAction = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (!action) return;

    if (!isActionAvailable(action, stats.energy, stats.money, stats.reputation)) {
      return;
    }

    if (actionId === 'job-hunt') {
      console.log('[DEBUG] Job Hunt clicked', {
        currentJob: stats.currentJob.id,
        coding: stats.coding,
        reputation: stats.reputation,
      });
      const availableJobs = getAvailablePromotions(stats.currentJob, stats.coding, stats.reputation, stats.money);
      console.log(
        '[DEBUG] Available jobs:',
        availableJobs.map(j => j.id),
      );

      if (availableJobs.length === 0) {
        executeAction(action, stats, dispatch);
        window.alert('No jobs found matching your current skills. Keep building your coding and reputation!');
        return;
      }

      const hasGraduationJob = availableJobs.some(job => shouldShowGraduationCeremony(stats.currentJob, job));
      console.log('[DEBUG] Has graduation job:', hasGraduationJob);

      // SET MODAL STATES FIRST, BEFORE executeAction!
      if (hasGraduationJob) {
        const graduationJobsList = availableJobs.filter(job => job.id !== 'intern');
        if (graduationJobsList.length > 0) {
          console.log('[DEBUG] Showing graduation modal');
          setAvailableJobsList(graduationJobsList);
          setIsGraduation(true);
          setShowJobSelectionModal(true);
          executeAction(action, stats, dispatch);
          return;
        }
      }

      if (availableJobs.length === 1) {
        const singleJob = availableJobs[0];
        console.log('[DEBUG] Single job:', singleJob.id, 'requires interview:', requiresInterview(singleJob));

        if (requiresInterview(singleJob)) {
          const requirementCheck = meetsJobRequirements(singleJob, stats.coding, stats.reputation, stats.money);
          console.log('[DEBUG] Requirement check:', requirementCheck);

          if (!requirementCheck.meets) {
            console.log('[DEBUG] Showing rejection popup');
            setRejectionReasons(requirementCheck.failureReasons);
            setShowRejectionPopup(true);
            executeAction(action, stats, dispatch);
            return;
          }

          console.log('[DEBUG] Setting interview modal state');
          setInterviewTargetJob(singleJob);
          setIsYearEndInterview(false);
          setShowInterviewModal(true);
          console.log('[DEBUG] Interview modal should be showing now');
          executeAction(action, stats, dispatch);
        } else {
          console.log('[DEBUG] Auto-promoting (no interview needed)');
          executeAction(action, stats, dispatch);
          setTimeout(() => {
            dispatch({
              type: 'ANSWER_INTERVIEW',
              payload: {
                correct: true,
                newJob: singleJob,
              },
            });
          }, 500);
        }
      } else {
        console.log('[DEBUG] Multiple jobs, showing selection modal');
        setAvailableJobsList(availableJobs);
        setIsGraduation(false);
        setShowJobSelectionModal(true);
        executeAction(action, stats, dispatch);
      }
      return;
    }

    executeAction(action, stats, dispatch);

    // Notify parent that action was performed (for mobile navigation back to home)
    if (mode === 'mobile' && onActionPerformed) {
      onActionPerformed();
    }

    if (Math.random() < 0.3) {
      const event = generateRandomEvent(stats);
      setTimeout(() => {
        dispatch({
          type: 'APPLY_EVENT',
          payload: {
            effects: event.effects ?? {},
            message: `${event.title}: ${event.description}`,
          },
        });
      }, 500);
    }
  };

  const handleNextYear = () => {
    dispatch({ type: 'YEAR_END_REVIEW' });

    setTimeout(() => {
      const event = generateRandomEvent(stats);
      dispatch({
        type: 'APPLY_EVENT',
        payload: {
          effects: event.effects ?? {},
          message: `${event.title}: ${event.description}`,
        },
      });
    }, 1000);
  };

  const handleJobSelect = (job: Job) => {
    console.log('[DEBUG] Job selected:', job.id);
    if (pendingJobSelection) {
      dispatch({ type: 'CLEAR_PENDING_JOB_SELECTION' });
    }

    setShowJobSelectionModal(false);

    if (!requiresInterview(job)) {
      console.log('[DEBUG] Job does not require interview, auto-promoting');
      dispatch({
        type: 'ANSWER_INTERVIEW',
        payload: {
          correct: true,
          newJob: job,
        },
      });
      return;
    }

    console.log('[DEBUG] Job requires interview');
    const requirementCheck = meetsJobRequirements(job, stats.coding, stats.reputation, stats.money);
    console.log('[DEBUG] Requirement check:', requirementCheck);

    if (!requirementCheck.meets) {
      console.log('[DEBUG] Requirements not met, showing rejection');
      setRejectionReasons(requirementCheck.failureReasons);
      setShowRejectionPopup(true);
      return;
    }

    console.log('[DEBUG] Setting interview modal for job:', job.id);
    setInterviewTargetJob(job);
    setIsYearEndInterview(false);
    setShowInterviewModal(true);
    console.log('[DEBUG] Interview modal state set');
  };

  const handleInterviewComplete = (passed: boolean) => {
    setShowInterviewModal(false);

    if (isYearEndInterview && interviewTargetJob) {
      dispatch({
        type: 'YEAR_END_INTERVIEW_RESULT',
        payload: {
          passed,
          job: interviewTargetJob,
        },
      });
    } else if (passed && interviewTargetJob) {
      dispatch({
        type: 'ANSWER_INTERVIEW',
        payload: {
          correct: true,
          newJob: interviewTargetJob,
        },
      });
    } else {
      dispatch({
        type: 'ANSWER_INTERVIEW',
        payload: {
          correct: false,
        },
      });
    }

    setInterviewTargetJob(null);
    setIsYearEndInterview(false);
  };

  const handleInterviewCancel = () => {
    setShowInterviewModal(false);
    setInterviewTargetJob(null);

    if (isYearEndInterview) {
      dispatch({ type: 'CLEAR_PENDING_INTERVIEW' });
      dispatch({
        type: 'APPLY_EVENT',
        payload: {
          effects: { stress: 5 },
          message: 'Declined performance review interview. (+5 stress)',
        },
      });
    }

    setIsYearEndInterview(false);
  };

  const handleJobSelectionCancel = () => {
    setShowJobSelectionModal(false);
    if (pendingJobSelection) {
      dispatch({ type: 'CLEAR_PENDING_JOB_SELECTION' });
    }
  };

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-emerald-500/20 bg-gray-900/50 backdrop-blur-md">
        {/* Desktop: Tabs inside panel / Mobile: No tabs (controlled by bottom nav) */}
        {mode === 'desktop' && (
          <div className="flex shrink-0 border-b border-gray-800 bg-gray-950/50">
            <button
              onClick={() => {
                setActiveTab('work');
              }}
              className={`flex-1 px-4 py-3 font-mono text-xs font-bold transition-colors ${
                activeTab === 'work'
                  ? 'border-b-2 border-emerald-400 bg-emerald-950/50 text-emerald-400'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
              }`}
            >
              💼 Work
            </button>
            <button
              onClick={() => {
                setActiveTab('shop');
              }}
              className={`flex-1 px-4 py-3 font-mono text-xs font-bold transition-colors ${
                activeTab === 'shop'
                  ? 'border-b-2 border-emerald-400 bg-emerald-950/50 text-emerald-400'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
              }`}
            >
              🛒 Shop
            </button>
            <button
              onClick={() => {
                setActiveTab('invest');
              }}
              className={`flex-1 px-4 py-3 font-mono text-xs font-bold transition-colors ${
                activeTab === 'invest'
                  ? 'border-b-2 border-emerald-400 bg-emerald-950/50 text-emerald-400'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
              }`}
            >
              📈 Invest
            </button>
          </div>
        )}

        {/* Tab Header */}
        <div className="shrink-0 border-b border-gray-800/50 bg-gray-950/30 px-4 py-2">
          <h3 className="font-mono text-xs font-bold text-emerald-400">
            ⚡ {activeTab === 'work' ? 'DAILY GRIND' : activeTab === 'shop' ? 'RECOVERY & GEAR' : 'CAREER ADVANCEMENT'}
          </h3>
        </div>

        {/* Actions Grid - Squared Buttons */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className={`grid gap-2 ${mode === 'desktop' ? 'grid-cols-2' : 'grid-cols-2'}`}>
            {actions.map(action => {
              const available = isActionAvailable(action, stats.energy, stats.money, stats.reputation);
              const reason = getUnavailabilityReason(action, stats.energy, stats.money, stats.reputation);
              const icon = getActionIcon(action.id);

              return (
                <button
                  key={action.id}
                  onClick={() => {
                    handleAction(action.id);
                  }}
                  disabled={!available}
                  className={`group relative flex flex-col items-start gap-1 overflow-hidden rounded-xl border-2 p-3 text-left transition-all ${
                    available
                      ? action.id === 'side-project'
                        ? 'border-pink-500/50 bg-pink-950/30 hover:border-pink-400 hover:bg-pink-900/50 hover:shadow-lg hover:shadow-pink-500/20 active:scale-[0.98]'
                        : 'border-gray-700/50 bg-gray-900/50 hover:border-emerald-500/50 hover:bg-gray-800/50 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98]'
                      : 'cursor-not-allowed border-gray-800/30 bg-gray-950/30 opacity-40'
                  }`}
                >
                  {/* Header Row: Icon + Title + Week Badge */}
                  <div className="flex w-full items-center gap-2">
                    <span className={`text-xl transition-transform ${available ? 'group-hover:scale-110' : ''}`}>
                      {icon}
                    </span>
                    <span
                      className={`flex-1 font-mono text-xs font-bold leading-tight ${
                        available
                          ? action.id === 'side-project'
                            ? 'text-pink-400'
                            : 'text-emerald-400'
                          : 'text-gray-600'
                      }`}
                    >
                      {action.name}
                    </span>
                    <div
                      className={`shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[8px] font-bold ${
                        available ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-600'
                      }`}
                    >
                      {action.cost.weeks}w
                    </div>
                  </div>

                  {/* Description - Always visible, truncated */}
                  <p
                    className={`line-clamp-2 font-mono text-[10px] leading-tight ${
                      available ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {action.description}
                  </p>

                  {/* Cost/Reward Badges Row */}
                  <div className="mt-auto flex flex-wrap gap-1 pt-1">
                    {action.cost.energy > 0 && (
                      <span
                        className={`rounded px-1 py-0.5 font-mono text-[8px] font-bold ${
                          available ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-600'
                        }`}
                      >
                        -{action.cost.energy}⚡
                      </span>
                    )}
                    {action.cost.stress > 0 && (
                      <span
                        className={`rounded px-1 py-0.5 font-mono text-[8px] font-bold ${
                          available ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-800 text-gray-600'
                        }`}
                      >
                        +{action.cost.stress}😰
                      </span>
                    )}
                    {action.cost.money > 0 && (
                      <span
                        className={`rounded px-1 py-0.5 font-mono text-[8px] font-bold ${
                          available ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-600'
                        }`}
                      >
                        -${action.cost.money}
                      </span>
                    )}
                    {action.reward.coding > 0 && (
                      <span
                        className={`rounded px-1 py-0.5 font-mono text-[8px] font-bold ${
                          available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-600'
                        }`}
                      >
                        +{action.reward.coding}💻
                      </span>
                    )}
                    {action.reward.reputation > 0 && (
                      <span
                        className={`rounded px-1 py-0.5 font-mono text-[8px] font-bold ${
                          available ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-600'
                        }`}
                      >
                        +{action.reward.reputation}⭐
                      </span>
                    )}
                    {action.reward.money > 0 && (
                      <span
                        className={`rounded px-1 py-0.5 font-mono text-[8px] font-bold ${
                          available ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-600'
                        }`}
                      >
                        +${action.reward.money}
                      </span>
                    )}
                  </div>

                  {/* Unavailable overlay with tooltip */}
                  {!available && reason && (
                    <div className="group/locked absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                      <span className="text-2xl">🔒</span>
                      <div className="absolute inset-x-0 bottom-0 hidden max-h-0 overflow-hidden bg-black/90 px-2 py-1 text-center opacity-0 transition-all group-hover/locked:block group-hover/locked:max-h-20 group-hover/locked:opacity-100">
                        <p className="font-mono text-[9px] leading-tight text-red-400">{reason}</p>
                      </div>
                    </div>
                  )}

                  {/* Shimmer effect */}
                  {available && (
                    <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next Year Button */}
        <div className="shrink-0 border-t border-gray-800/50 bg-gray-950/50 p-3">
          <button
            onClick={handleNextYear}
            disabled={stats.weeks > 0}
            className={`group relative w-full overflow-hidden rounded-xl py-3 font-mono text-sm font-bold transition-all ${
              stats.weeks <= 0
                ? 'bg-linear-to-r from-emerald-600 to-emerald-500 text-black shadow-lg shadow-emerald-500/30 hover:from-emerald-500 hover:to-emerald-400'
                : 'cursor-not-allowed bg-gray-800/50 text-gray-600'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              ⏭️ Next Year
              {stats.weeks > 0 && <span className="text-xs opacity-70">({stats.weeks}w left)</span>}
            </span>
            {stats.weeks <= 0 && (
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            )}
          </button>
        </div>
      </div>

      {/* Job Selection Modal (Graduation or Regular Promotion) */}
      {(() => {
        console.log('[DEBUG] Job Selection Modal Render Check:', {
          showJobSelectionModal,
          availableJobsCount: availableJobsList.length,
          jobs: availableJobsList.map(j => j.id),
        });
        return null;
      })()}
      {showJobSelectionModal && (
        <GraduationModal
          availableJobs={availableJobsList}
          onSelectJob={handleJobSelect}
          onCancel={handleJobSelectionCancel}
          isGraduation={isGraduation}
        />
      )}

      {/* Interview Modal */}
      {(() => {
        console.log('[DEBUG] Interview Modal Render Check:', {
          showInterviewModal,
          interviewTargetJob: interviewTargetJob?.id,
        });
        return null;
      })()}
      {showInterviewModal && interviewTargetJob && (
        <InterviewModal
          targetJob={interviewTargetJob}
          onComplete={handleInterviewComplete}
          onCancel={handleInterviewCancel}
        />
      )}

      {/* Rejection Popup */}
      {showRejectionPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded border-2 border-red-500 bg-black p-6 shadow-xl shadow-red-500/20">
            <div className="mb-4 text-center">
              <div className="mb-3 text-5xl">📋❌</div>
              <h3 className="font-mono text-xl font-bold text-red-500">RESUME REJECTED</h3>
            </div>

            <div className="mb-6 rounded border border-red-500/30 bg-red-500/5 p-4">
              <p className="mb-3 font-mono text-sm text-gray-300">
                Your application was rejected. Skillset does not match job requirements:
              </p>
              <ul className="space-y-1">
                {rejectionReasons.map((reason, index) => (
                  <li key={index} className="font-mono text-sm text-red-400">
                    • {reason}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                setShowRejectionPopup(false);
              }}
              className="w-full rounded border-2 border-gray-500 bg-gray-500/10 px-4 py-2 font-mono text-sm font-bold text-gray-400 transition-all hover:bg-gray-500 hover:text-black"
            >
              &gt;&gt; CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
