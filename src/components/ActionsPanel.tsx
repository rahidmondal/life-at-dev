'use client';

import { useGame } from '@/context/GameContext';
import { getActionsByCategory, getUnavailabilityReason, isActionAvailable } from '@/data/actions';
import { meetsJobRequirements, requiresInterview } from '@/data/interviews';
import { getAvailablePromotions, shouldShowGraduationCeremony } from '@/data/jobs';
import { executeAction } from '@/logic/actions';
import { generateRandomEvent } from '@/logic/events';
import { Job } from '@/types/game';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const GraduationModal = dynamic(() => import('./GraduationModal'), { ssr: false });
const InterviewModal = dynamic(() => import('./InterviewModal'), { ssr: false });

type Tab = 'work' | 'shop' | 'invest';

export function ActionsPanel() {
  const { state, dispatch } = useGame();
  const { stats, pendingYearEndInterview } = state;
  const [activeTab, setActiveTab] = useState<Tab>('work');
  const [showJobSelectionModal, setShowJobSelectionModal] = useState(false);
  const [availableJobsList, setAvailableJobsList] = useState<Job[]>([]);
  const [isGraduation, setIsGraduation] = useState(false);

  // Interview modal state
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewTargetJob, setInterviewTargetJob] = useState<Job | null>(null);
  const [isYearEndInterview, setIsYearEndInterview] = useState(false);

  // Rejection popup state
  const [showRejectionPopup, setShowRejectionPopup] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);

  // Handle pending year-end interviews
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
      const availableJobs = getAvailablePromotions(stats.currentJob, stats.coding, stats.reputation, stats.money);

      if (availableJobs.length === 0) {
        // No jobs available, just execute the action (costs resources, shows feedback)
        executeAction(action, stats, dispatch);
        return;
      }

      executeAction(action, stats, dispatch);

      const hasGraduationJob = availableJobs.some(job => shouldShowGraduationCeremony(stats.currentJob, job));

      if (hasGraduationJob) {
        const graduationJobsList = availableJobs.filter(job => job.id !== 'intern');
        if (graduationJobsList.length > 0) {
          setAvailableJobsList(graduationJobsList);
          setIsGraduation(true);
          setShowJobSelectionModal(true);
          return;
        }
      }

      if (availableJobs.length === 1) {
        const singleJob = availableJobs[0];

        // Check if interview is required for this job
        if (requiresInterview(singleJob)) {
          // Check requirements before proceeding to interview
          const requirementCheck = meetsJobRequirements(singleJob, stats.coding, stats.reputation, stats.money);

          if (!requirementCheck.meets) {
            // Show rejection popup
            setRejectionReasons(requirementCheck.failureReasons);
            setShowRejectionPopup(true);
            return;
          }

          // Requirements met - start interview
          setInterviewTargetJob(singleJob);
          setIsYearEndInterview(false);
          setShowInterviewModal(true);
        } else {
          // No interview needed (e.g., script-kiddie, intern)
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
        setAvailableJobsList(availableJobs);
        setIsGraduation(false);
        setShowJobSelectionModal(true);
      }
      return;
    }

    executeAction(action, stats, dispatch);

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
    setShowJobSelectionModal(false);

    // Check if interview is required for this job
    if (!requiresInterview(job)) {
      // No interview needed (e.g., script-kiddie, unemployed)
      dispatch({
        type: 'ANSWER_INTERVIEW',
        payload: {
          correct: true,
          newJob: job,
        },
      });
      return;
    }

    // Check requirements before proceeding to interview
    const requirementCheck = meetsJobRequirements(job, stats.coding, stats.reputation, stats.money);

    if (!requirementCheck.meets) {
      // Show rejection popup
      setRejectionReasons(requirementCheck.failureReasons);
      setShowRejectionPopup(true);
      return;
    }

    // Requirements met - start interview (job hunt, not year-end)
    setInterviewTargetJob(job);
    setIsYearEndInterview(false);
    setShowInterviewModal(true);
  };

  const handleInterviewComplete = (passed: boolean) => {
    setShowInterviewModal(false);

    if (isYearEndInterview && interviewTargetJob) {
      // Year-end interview - use dedicated action
      dispatch({
        type: 'YEAR_END_INTERVIEW_RESULT',
        payload: {
          passed,
          job: interviewTargetJob,
        },
      });
    } else if (passed && interviewTargetJob) {
      // Regular job hunt interview - passed
      dispatch({
        type: 'ANSWER_INTERVIEW',
        payload: {
          correct: true,
          newJob: interviewTargetJob,
        },
      });
    } else {
      // Regular job hunt interview - failed
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

    // If cancelling a year-end interview, clear the pending state and apply penalty
    if (isYearEndInterview) {
      dispatch({ type: 'CLEAR_PENDING_INTERVIEW' });
      // Apply stress penalty for skipping year-end interview
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
  };

  return (
    <div className="flex h-full flex-col bg-black">
      {/* Tabs */}
      <div className="flex border-b border-gray-800 bg-gray-950">
        <button
          onClick={() => {
            setActiveTab('work');
          }}
          className={`flex-1 border-r border-gray-800 px-6 py-3 font-mono text-sm font-bold transition-colors ${
            activeTab === 'work'
              ? 'bg-emerald-950 text-emerald-400'
              : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
          }`}
        >
          💼 Work
        </button>
        <button
          onClick={() => {
            setActiveTab('shop');
          }}
          className={`flex-1 border-r border-gray-800 px-6 py-3 font-mono text-sm font-bold transition-colors ${
            activeTab === 'shop'
              ? 'bg-emerald-950 text-emerald-400'
              : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
          }`}
        >
          🛒 Shop
        </button>
        <button
          onClick={() => {
            setActiveTab('invest');
          }}
          className={`flex-1 px-6 py-3 font-mono text-sm font-bold transition-colors ${
            activeTab === 'invest'
              ? 'bg-emerald-950 text-emerald-400'
              : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
          }`}
        >
          📈 Invest
        </button>
      </div>

      {/* Tab Label */}
      <div className="border-b border-gray-800 bg-black px-6 py-4">
        <h3 className="font-mono text-sm font-bold text-emerald-400">
          ⚡ {activeTab === 'work' ? 'DAILY GRIND' : activeTab === 'shop' ? 'RECOVERY & GEAR' : 'CAREER ADVANCEMENT'}
        </h3>
      </div>

      {/* Actions Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {actions.map(action => {
            const available = isActionAvailable(action, stats.energy, stats.money, stats.reputation);
            const reason = getUnavailabilityReason(action, stats.energy, stats.money, stats.reputation);

            return (
              <button
                key={action.id}
                onClick={() => {
                  handleAction(action.id);
                }}
                disabled={!available}
                className={`group relative overflow-hidden rounded-lg border-2 p-4 text-left transition-all ${
                  available
                    ? action.id === 'side-project'
                      ? 'border-pink-500 bg-pink-950 hover:bg-pink-900 hover:shadow-lg hover:shadow-pink-500/20'
                      : 'border-gray-700 bg-gray-900 hover:border-emerald-500 hover:bg-gray-800 hover:shadow-lg hover:shadow-emerald-500/20'
                    : 'cursor-not-allowed border-gray-800 bg-gray-950 opacity-50'
                }`}
              >
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <h4
                      className={`mb-1 font-mono text-base font-bold leading-tight ${available ? (action.id === 'side-project' ? 'text-pink-400' : 'text-emerald-400') : 'text-gray-600'}`}
                    >
                      {action.name}
                    </h4>
                    <p className="font-mono text-xs leading-relaxed text-gray-400">{action.description}</p>
                  </div>
                  <div
                    className={`ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                      available ? 'border-cyan-400 bg-cyan-500/20' : 'border-gray-700 bg-gray-800'
                    }`}
                  >
                    <span className={`font-mono text-sm font-bold ${available ? 'text-cyan-400' : 'text-gray-600'}`}>
                      {action.cost.weeks > 0 ? `${String(action.cost.weeks)}w` : '0w'}
                    </span>
                  </div>
                </div>

                {/* Costs & Rewards */}
                <div className="space-y-2 border-t border-gray-800 pt-3">
                  {/* Costs - Highlighted in red box */}
                  {(action.cost.energy > 0 || action.cost.stress > 0 || action.cost.money > 0) && (
                    <div className="flex flex-wrap gap-2 rounded bg-red-950/20 px-2 py-1">
                      {action.cost.weeks > 0 && (
                        <span className="font-mono text-xs font-bold text-red-400">⏱️ {action.cost.weeks}w</span>
                      )}
                      {action.cost.energy > 0 && (
                        <span className="font-mono text-xs font-bold text-red-400">⚡ -{action.cost.energy}</span>
                      )}
                      {action.cost.stress > 0 && (
                        <span className="font-mono text-xs font-bold text-red-400">😰 +{action.cost.stress}</span>
                      )}
                      {action.cost.money > 0 && (
                        <span className="font-mono text-xs font-bold text-red-400">💰 -${action.cost.money}</span>
                      )}
                    </div>
                  )}

                  {/* Rewards - Highlighted in green box */}
                  {(action.reward.coding > 0 ||
                    action.reward.reputation > 0 ||
                    action.reward.money > 0 ||
                    action.reward.energy > 0 ||
                    action.reward.stress < 0) && (
                    <div className="flex flex-wrap gap-2 rounded bg-emerald-950/20 px-2 py-1">
                      {action.reward.coding > 0 && (
                        <span className="font-mono text-xs font-bold text-emerald-400">💻 +{action.reward.coding}</span>
                      )}
                      {action.reward.reputation > 0 && (
                        <span className="font-mono text-xs font-bold text-yellow-400">
                          ⭐ +{action.reward.reputation}
                        </span>
                      )}
                      {action.reward.money > 0 && (
                        <span className="font-mono text-xs font-bold text-green-400">💰 +${action.reward.money}</span>
                      )}
                      {action.reward.energy > 0 && (
                        <span className="font-mono text-xs font-bold text-cyan-400">⚡ +{action.reward.energy}</span>
                      )}
                      {action.reward.stress < 0 && (
                        <span className="font-mono text-xs font-bold text-green-400">😌 {action.reward.stress}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Unavailable reason */}
                {!available && reason && (
                  <div className="mt-2 rounded bg-red-950/50 px-2 py-1">
                    <p className="font-mono text-xs text-red-400">🔒 {reason}</p>
                  </div>
                )}

                {/* Hover effect */}
                {available && (
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Year Button (Fixed at bottom) */}
      <div className="border-t border-gray-800 bg-gray-950 p-6">
        <button
          onClick={handleNextYear}
          disabled={stats.weeks > 0}
          className={`group relative w-full overflow-hidden rounded-lg py-4 font-mono text-lg font-bold transition-all ${
            stats.weeks <= 0
              ? 'bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/50'
              : 'cursor-not-allowed bg-gray-800 text-gray-600'
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            ⏭️ Next Year
            {stats.weeks > 0 && <span className="text-sm">({stats.weeks} weeks remaining)</span>}
          </span>
          {stats.weeks <= 0 && (
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          )}
        </button>
      </div>

      {/* Job Selection Modal (Graduation or Regular Promotion) */}
      {showJobSelectionModal && (
        <GraduationModal
          availableJobs={availableJobsList}
          onSelectJob={handleJobSelect}
          onCancel={handleJobSelectionCancel}
          isGraduation={isGraduation}
        />
      )}

      {/* Interview Modal */}
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
              onClick={() => setShowRejectionPopup(false)}
              className="w-full rounded border-2 border-gray-500 bg-gray-500/10 px-4 py-2 font-mono text-sm font-bold text-gray-400 transition-all hover:bg-gray-500 hover:text-black"
            >
              &gt;&gt; CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
