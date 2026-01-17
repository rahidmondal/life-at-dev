'use client';

import { useGame } from '@/context/GameContext';
import { getActionsByCategory, getUnavailabilityReason, isActionAvailable } from '@/data/actions';
import { getAvailablePromotions, shouldShowGraduationCeremony } from '@/data/jobs';
import { executeAction } from '@/logic/actions';
import { generateRandomEvent } from '@/logic/events';
import { GameAction, Job } from '@/types/game';
import { useEffect, useState } from 'react';

type Tab = 'work' | 'shop' | 'invest';

interface ActionsPanelProps {
  mode?: 'desktop' | 'mobile';
  defaultTab?: Tab;
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
  onActionPerformed?: () => void;
}

// Helper: Check if job requires interview (intermediate jobs skip interviews)
export function requiresInterview(job: Job): boolean {
  return !job.isIntermediate;
}

// Helper: Check if candidate meets job requirements
export function meetsJobRequirements(
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
  const { state, dispatch, jobHuntModal, setJobHuntModal } = useGame();
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

  // Handle pending job selection from reducer (year-end promotions)
  useEffect(() => {
    if (pendingJobSelection && pendingJobSelection.length > 0) {
      setJobHuntModal(prev => ({
        ...prev,
        availableJobsList: pendingJobSelection,
        isGraduation: false,
        showJobSelectionModal: true,
      }));
    }
  }, [pendingJobSelection, setJobHuntModal]);

  // Handle pending year-end interview from reducer
  useEffect(() => {
    if (pendingYearEndInterview && !jobHuntModal.showInterviewModal) {
      setJobHuntModal(prev => ({
        ...prev,
        interviewTargetJob: pendingYearEndInterview,
        isYearEndInterview: true,
        showInterviewModal: true,
      }));
    }
  }, [pendingYearEndInterview, jobHuntModal.showInterviewModal, setJobHuntModal]);

  const actions = getActionsByCategory(activeTab);

  const handleAction = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (!action) return;

    // Step 1: Initiation & Cost Check
    if (!isActionAvailable(action, stats.energy, stats.money, stats.reputation)) {
      return;
    }

    if (actionId === 'job-hunt') {
      console.info('[DEBUG] Job Hunt clicked', {
        currentJob: stats.currentJob.id,
        coding: stats.coding,
        reputation: stats.reputation,
      });

      // Step 2: Determining Available Roles
      const availableJobs = getAvailablePromotions(stats.currentJob, stats.coding, stats.reputation, stats.money);
      console.info(
        '[DEBUG] Available jobs:',
        availableJobs.map(j => j.id),
      );

      // Step 3: Branching Scenarios

      // Scenario A: No Jobs Available
      if (availableJobs.length === 0) {
        // Deduct resources (time spent searching with no results)
        executeAction(action, stats, dispatch);
        // Show rejection popup instead of browser alert
        setJobHuntModal(prev => ({
          ...prev,
          rejectionReasons: [
            'No positions match your current qualifications.',
            'Keep building your coding skills and reputation!',
          ],
          showRejectionPopup: true,
        }));
        return;
      }

      // Check for graduation scenario (transitioning from student)
      const hasGraduationJob = availableJobs.some(job => shouldShowGraduationCeremony(stats.currentJob, job));
      console.info('[DEBUG] Has graduation job:', hasGraduationJob);

      // Scenario B: Graduation / Multiple Jobs - Show Selection Modal
      if (hasGraduationJob) {
        const graduationJobsList = availableJobs.filter(job => job.id !== 'intern');
        if (graduationJobsList.length > 0) {
          console.info('[DEBUG] Showing graduation modal');
          // Do NOT deduct resources yet - wait until job is selected and committed
          setJobHuntModal(prev => ({
            ...prev,
            availableJobsList: graduationJobsList,
            isGraduation: true,
            showJobSelectionModal: true,
          }));
          return;
        }
      }

      // Scenario C: Single Job - Proceed to Gatekeeper
      if (availableJobs.length === 1) {
        const singleJob = availableJobs[0];
        console.info('[DEBUG] Single job:', singleJob.id, 'requires interview:', requiresInterview(singleJob));
        // Process single job through gatekeeper flow
        processJobApplication(singleJob, action);
        return;
      }

      // Multiple jobs available - show selection modal
      console.info('[DEBUG] Multiple jobs, showing selection modal');
      // Do NOT deduct resources yet - wait until job is selected
      setJobHuntModal(prev => ({
        ...prev,
        availableJobsList: availableJobs,
        isGraduation: false,
        showJobSelectionModal: true,
      }));
      return;
    }

    // Non job-hunt actions: execute immediately
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

  // Step 4 & 5: The Gatekeeper - Resume Screen & Interview Type Check
  const processJobApplication = (job: Job, action?: GameAction) => {
    console.info('[DEBUG] Processing job application for:', job.id);

    // Step 4: Check if candidate meets job requirements
    const requirementCheck = meetsJobRequirements(job, stats.coding, stats.reputation, stats.money);
    console.info('[DEBUG] Requirement check:', requirementCheck);

    if (!requirementCheck.meets) {
      console.info('[DEBUG] Requirements not met, showing rejection');
      // Deduct resources (time wasted on failed application)
      if (action) {
        executeAction(action, stats, dispatch);
      }
      setJobHuntModal(prev => ({
        ...prev,
        rejectionReasons: requirementCheck.failureReasons,
        showRejectionPopup: true,
      }));
      return;
    }

    // Step 5: Interview Type Check
    if (requiresInterview(job)) {
      console.info('[DEBUG] Job requires interview, showing interview modal');
      // Deduct resources (time spent on interview process)
      if (action) {
        executeAction(action, stats, dispatch);
      }
      setJobHuntModal(prev => ({
        ...prev,
        interviewTargetJob: job,
        isYearEndInterview: false,
        showInterviewModal: true,
      }));
    } else {
      // Intermediate role - auto-promote without interview
      console.info('[DEBUG] Auto-promoting (no interview needed for intermediate role)');
      // Deduct resources
      if (action) {
        executeAction(action, stats, dispatch);
      }
      setTimeout(() => {
        dispatch({
          type: 'ANSWER_INTERVIEW',
          payload: {
            correct: true,
            newJob: job,
          },
        });
      }, 300);
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
                  ? 'border-b-2 border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]'
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
                  ? 'border-b-2 border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]'
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
                  ? 'border-b-2 border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
              }`}
            >
              📈 Invest
            </button>
          </div>
        )}

        {/* Tab Header */}
        <div className="shrink-0 border-b border-gray-800/50 bg-gray-950/30 px-4 py-2">
          <h3 className="font-mono text-xs font-bold text-[#00ff88]">
            ⚡ {activeTab === 'work' ? 'DAILY GRIND' : activeTab === 'shop' ? 'RECOVERY & GEAR' : 'CAREER ADVANCEMENT'}
          </h3>
        </div>

        {/* Actions Grid - Cyberpunk Square Cards */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-3">
            {actions.map(action => {
              const available = isActionAvailable(action, stats.energy, stats.money, stats.reputation);
              const reason = getUnavailabilityReason(action, stats.energy, stats.money, stats.reputation);
              const icon = getActionIcon(action.id);

              // Desktop: Square aspect ratio cards with hover tooltip
              if (mode === 'desktop') {
                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      handleAction(action.id);
                    }}
                    disabled={!available}
                    className={`group relative flex aspect-square flex-col items-center justify-between overflow-hidden rounded-xl border-2 p-4 text-center transition-all duration-300 ${
                      available
                        ? 'border-[#00ff88]/50 bg-linear-to-br from-[#00ff88]/10 to-cyan-500/10 hover:scale-105 hover:border-[#00ff88] hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] active:scale-95'
                        : 'cursor-not-allowed border-gray-700 bg-gray-900/30 opacity-50'
                    }`}
                  >
                    {/* Main Content */}
                    <div className="flex flex-1 flex-col items-center justify-center gap-2">
                      {/* Large Icon */}
                      <span
                        className={`text-4xl transition-transform duration-300 ${available ? 'group-hover:scale-110' : ''}`}
                      >
                        {icon}
                      </span>

                      {/* Action Name */}
                      <span className="font-mono text-sm font-bold leading-tight text-white">{action.name}</span>
                    </div>

                    {/* Quick Stats Row - Bottom */}
                    <div className="flex w-full items-center justify-center gap-3 border-t border-gray-700/50 pt-2">
                      {/* Weeks */}
                      <div className="flex items-center gap-1">
                        <span className="text-xs">⏱️</span>
                        <span className="font-mono text-[10px] text-cyan-400">{action.cost.weeks}w</span>
                      </div>
                      {/* Energy - only show if non-zero */}
                      {(action.cost.energy > 0 || action.reward.energy > 0) && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs">⚡</span>
                          <span
                            className={`font-mono text-[10px] ${action.cost.energy > 0 ? 'text-red-400' : 'text-green-400'}`}
                          >
                            {action.cost.energy > 0
                              ? `-${String(action.cost.energy)}`
                              : `+${String(action.reward.energy)}`}
                          </span>
                        </div>
                      )}
                      {/* Stress - only show if non-zero */}
                      {(action.cost.stress > 0 || action.reward.stress < 0) && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs">🧠</span>
                          <span
                            className={`font-mono text-[10px] ${action.cost.stress > 0 ? 'text-orange-400' : 'text-green-400'}`}
                          >
                            {action.cost.stress > 0 ? `+${String(action.cost.stress)}` : String(action.reward.stress)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Hover Tooltip Overlay - Desktop Only */}
                    {available && (
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <p className="mb-2 text-center font-mono text-xs leading-relaxed text-gray-300">
                          {action.description}
                        </p>
                        <div className="w-full space-y-1 border-t border-gray-700 pt-2">
                          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#00ff88]">
                            Costs & Rewards
                          </p>
                          <div className="flex flex-wrap justify-center gap-1">
                            {action.cost.weeks > 0 && (
                              <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[9px] text-cyan-400">
                                -{action.cost.weeks} weeks
                              </span>
                            )}
                            {action.cost.energy > 0 && (
                              <span className="rounded bg-red-500/20 px-1.5 py-0.5 font-mono text-[9px] text-red-400">
                                -{action.cost.energy} energy
                              </span>
                            )}
                            {action.cost.stress > 0 && (
                              <span className="rounded bg-orange-500/20 px-1.5 py-0.5 font-mono text-[9px] text-orange-400">
                                +{action.cost.stress} stress
                              </span>
                            )}
                            {action.cost.money > 0 && (
                              <span className="rounded bg-red-500/20 px-1.5 py-0.5 font-mono text-[9px] text-red-400">
                                -${action.cost.money}
                              </span>
                            )}
                            {action.reward.coding > 0 && (
                              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] text-emerald-400">
                                +{action.reward.coding} coding
                              </span>
                            )}
                            {action.reward.reputation > 0 && (
                              <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 font-mono text-[9px] text-yellow-400">
                                +{action.reward.reputation} rep
                              </span>
                            )}
                            {action.reward.money > 0 && (
                              <span className="rounded bg-green-500/20 px-1.5 py-0.5 font-mono text-[9px] text-green-400">
                                +${action.reward.money}
                              </span>
                            )}
                            {action.reward.energy > 0 && (
                              <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[9px] text-cyan-400">
                                +{action.reward.energy} energy
                              </span>
                            )}
                            {action.reward.stress < 0 && (
                              <span className="rounded bg-green-500/20 px-1.5 py-0.5 font-mono text-[9px] text-green-400">
                                {action.reward.stress} stress
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Locked Overlay - Desktop */}
                    {!available && (
                      <div className="group/locked absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                        <span className="text-3xl">🔒</span>
                        <div className="absolute inset-x-2 bottom-2 max-h-0 overflow-hidden rounded bg-black/90 px-2 py-0 opacity-0 transition-all duration-300 group-hover/locked:max-h-20 group-hover/locked:py-2 group-hover/locked:opacity-100">
                          <p className="text-center font-mono text-[9px] leading-tight text-red-400">{reason}</p>
                        </div>
                      </div>
                    )}
                  </button>
                );
              }

              // Mobile: Touch-friendly cards with visible info
              return (
                <button
                  key={action.id}
                  onClick={() => {
                    handleAction(action.id);
                  }}
                  disabled={!available}
                  className={`group relative flex min-h-20 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 p-3 text-center transition-all duration-200 ${
                    available
                      ? 'border-[#00ff88]/50 bg-linear-to-br from-[#00ff88]/10 to-cyan-500/10 active:scale-95 active:border-[#00ff88]'
                      : 'cursor-not-allowed border-gray-700 bg-gray-900/30 opacity-50'
                  }`}
                >
                  {/* Icon + Name */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{icon}</span>
                    <span className="font-mono text-xs font-bold leading-tight text-white">{action.name}</span>
                  </div>

                  {/* Quick Stats - Always visible on mobile */}
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[8px] text-cyan-400">
                      {action.cost.weeks}w
                    </span>
                    {action.cost.energy > 0 && (
                      <span className="rounded bg-red-500/20 px-1.5 py-0.5 font-mono text-[8px] text-red-400">
                        -{action.cost.energy}⚡
                      </span>
                    )}
                    {action.cost.stress > 0 && (
                      <span className="rounded bg-orange-500/20 px-1.5 py-0.5 font-mono text-[8px] text-orange-400">
                        +{action.cost.stress}😰
                      </span>
                    )}
                  </div>

                  {/* Locked Overlay - Mobile */}
                  {!available && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                      <span className="text-2xl">🔒</span>
                      <p className="mt-1 px-2 text-center font-mono text-[8px] leading-tight text-red-400">{reason}</p>
                    </div>
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
                ? 'bg-linear-to-r from-[#00ff88] to-cyan-500 text-black shadow-lg shadow-[#00ff88]/30 hover:shadow-[#00ff88]/50'
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
    </>
  );
}
