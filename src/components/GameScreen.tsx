'use client';

import { LeaveGameModal } from '@/components/LeaveGameModal';
import { useGame } from '@/context/GameContext';
import { Job } from '@/types/game';
import Image from 'next/image';
import { useState } from 'react';
import { ActionsPanel, meetsJobRequirements, requiresInterview } from './ActionsPanel';
import { EventLog } from './EventLog';
import GraduationModal from './GraduationModal';
import InterviewModal from './InterviewModal';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileHeader } from './MobileHeader';
import { MobileMenuSheet } from './MobileMenuSheet';
import { MobileStatsDrawer } from './MobileStatsDrawer';
import { StatsPanel } from './StatsPanel';

type MobileTab = 'home' | 'work' | 'shop' | 'invest' | 'menu';
type DesktopActionTab = 'work' | 'shop' | 'invest';

export function GameScreen() {
  const [mobileTab, setMobileTab] = useState<MobileTab>('home');
  const [desktopActionTab, setDesktopActionTab] = useState<DesktopActionTab>('work');
  const { saveGameManually, isStorageReady, goToHomeScreen, state, dispatch, jobHuntModal, setJobHuntModal } =
    useGame();
  const { stats, pendingJobSelection } = state;
  const [isSaving, setIsSaving] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showStatsDrawer, setShowStatsDrawer] = useState(false);
  const [showMenuSheet, setShowMenuSheet] = useState(false);

  // Destructure modal state for cleaner access
  const {
    showJobSelectionModal,
    availableJobsList,
    isGraduation,
    showInterviewModal,
    interviewTargetJob,
    isYearEndInterview,
    showRejectionPopup,
    rejectionReasons,
  } = jobHuntModal;

  // Handler: Job selected from GraduationModal
  const handleJobSelect = (job: Job) => {
    console.info('[DEBUG] Job selected from modal:', job.id);

    // Clear pending job selection if it exists
    if (pendingJobSelection) {
      dispatch({ type: 'CLEAR_PENDING_JOB_SELECTION' });
    }

    // Close the job selection modal
    setJobHuntModal(prev => ({
      ...prev,
      showJobSelectionModal: false,
    }));

    // Step 4: The Gatekeeper - Check requirements
    const requirementCheck = meetsJobRequirements(job, stats.coding, stats.reputation, stats.money);
    console.info('[DEBUG] Requirement check for selected job:', requirementCheck);

    if (!requirementCheck.meets) {
      console.info('[DEBUG] Requirements not met, showing rejection');
      setJobHuntModal(prev => ({
        ...prev,
        rejectionReasons: requirementCheck.failureReasons,
        showRejectionPopup: true,
      }));
      return;
    }

    // Step 5: Interview Type Check
    if (!requiresInterview(job)) {
      console.info('[DEBUG] Job does not require interview, auto-promoting');
      dispatch({
        type: 'ANSWER_INTERVIEW',
        payload: {
          correct: true,
          newJob: job,
        },
      });
      return;
    }

    // Major role - requires interview
    console.info('[DEBUG] Job requires interview, showing interview modal');
    setJobHuntModal(prev => ({
      ...prev,
      interviewTargetJob: job,
      isYearEndInterview: false,
      showInterviewModal: true,
    }));
  };

  // Handler: Interview completed
  const handleInterviewComplete = (passed: boolean) => {
    console.info('[DEBUG] Interview completed, passed:', passed);

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

    // Reset modal state
    setJobHuntModal(prev => ({
      ...prev,
      showInterviewModal: false,
      interviewTargetJob: null,
      isYearEndInterview: false,
    }));
  };

  // Handler: Interview cancelled
  const handleInterviewCancel = () => {
    console.info('[DEBUG] Interview cancelled');

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

    // Reset modal state
    setJobHuntModal(prev => ({
      ...prev,
      showInterviewModal: false,
      interviewTargetJob: null,
      isYearEndInterview: false,
    }));
  };

  // Handler: Job selection cancelled
  const handleJobSelectionCancel = () => {
    console.info('[DEBUG] Job selection cancelled');

    if (pendingJobSelection) {
      dispatch({ type: 'CLEAR_PENDING_JOB_SELECTION' });
    }

    setJobHuntModal(prev => ({
      ...prev,
      showJobSelectionModal: false,
      availableJobsList: [],
    }));
  };

  // Handler: Rejection popup closed
  const handleRejectionClose = () => {
    setJobHuntModal(prev => ({
      ...prev,
      showRejectionPopup: false,
      rejectionReasons: [],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveGameManually();
    setTimeout(() => {
      setIsSaving(false);
    }, 300);
  };

  const handleLogoClick = () => {
    setShowLeaveModal(true);
  };

  const handleGoHome = () => {
    setShowLeaveModal(false);
    goToHomeScreen();
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
  };

  const handleMobileTabChange = (tab: MobileTab) => {
    if (tab === 'menu') {
      setShowMenuSheet(true);
    } else {
      setMobileTab(tab);
    }
  };

  // Callback for when an action is performed on mobile - navigate back to home (Event Log)
  const handleMobileActionPerformed = () => {
    setMobileTab('home');
  };

  // Desktop Layout (≥1024px) - 3 Column Command Center
  const DesktopLayout = () => (
    <div className="hidden h-screen flex-col bg-black lg:flex">
      {/* Desktop Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-gray-800 bg-gray-950/50 px-6 py-4 backdrop-blur-sm">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-4 transition-opacity hover:opacity-80 active:opacity-60"
          aria-label="Go to home screen"
        >
          <Image src="/logo.png" alt="Life @ Dev" width={60} height={60} className="h-14 w-14 rounded-lg" />
          <div>
            <h1 className="font-mono text-xl font-bold text-emerald-400">Life@Dev</h1>
            <p className="font-mono text-xs text-gray-500">Survive the grind. Climb the ladder.</p>
          </div>
        </button>

        {/* Desktop Save Button */}
        {isStorageReady && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`rounded-lg border-2 px-6 py-2 font-mono text-sm font-bold transition-all ${
              isSaving
                ? 'animate-pulse border-emerald-400 bg-emerald-500 text-black'
                : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black'
            }`}
          >
            {isSaving ? '💾 Saving...' : '💾 Save Game'}
          </button>
        )}
      </header>

      {/* 3-Column Dashboard Layout */}
      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        {/* Left Panel - Profile & Vitals (Glass Card) */}
        <div className="w-80 shrink-0">
          <StatsPanel mode="desktop" />
        </div>

        {/* Center Panel - Event Log (The Terminal/Main Monitor) */}
        <div className="flex flex-1 flex-col">
          <EventLog mode="desktop" />
        </div>

        {/* Right Panel - Actions (The Control Deck) */}
        <div className="w-96 shrink-0">
          <ActionsPanel mode="desktop" activeTab={desktopActionTab} onTabChange={setDesktopActionTab} />
        </div>
      </div>
    </div>
  );

  // Mobile Layout (<1024px) - App-like with Bottom Nav
  const MobileLayout = () => (
    <div className="flex h-screen flex-col bg-black lg:hidden">
      {/* Mobile HUD Header */}
      <MobileHeader
        onProfileClick={() => {
          setShowStatsDrawer(true);
        }}
      />

      {/* Main Content Area - Changes based on Bottom Nav */}
      <main className="flex-1 overflow-hidden pb-16">
        {mobileTab === 'home' && <EventLog mode="mobile" />}
        {mobileTab === 'work' && (
          <ActionsPanel mode="mobile" defaultTab="work" onActionPerformed={handleMobileActionPerformed} />
        )}
        {mobileTab === 'shop' && (
          <ActionsPanel mode="mobile" defaultTab="shop" onActionPerformed={handleMobileActionPerformed} />
        )}
        {mobileTab === 'invest' && (
          <ActionsPanel mode="mobile" defaultTab="invest" onActionPerformed={handleMobileActionPerformed} />
        )}
      </main>

      {/* Bottom Navigation */}
      <MobileBottomNav activeTab={mobileTab} onTabChange={handleMobileTabChange} />

      {/* Stats Drawer */}
      <MobileStatsDrawer
        isOpen={showStatsDrawer}
        onClose={() => {
          setShowStatsDrawer(false);
        }}
      />

      {/* Menu Sheet */}
      <MobileMenuSheet
        isOpen={showMenuSheet}
        onClose={() => {
          setShowMenuSheet(false);
        }}
        onSave={handleSave}
        onGoHome={handleGoHome}
        isSaving={isSaving}
        isStorageReady={isStorageReady}
      />
    </div>
  );

  return (
    <>
      <DesktopLayout />
      <MobileLayout />

      {/* Leave Game Modal */}
      {showLeaveModal && <LeaveGameModal onGoHome={handleGoHome} onCancel={handleCancelLeave} />}

      {/* ===== Job Hunt Modals (Root Level for z-index persistence) ===== */}

      {/* Job Selection Modal (Graduation or Regular Promotion) */}
      {showJobSelectionModal && availableJobsList.length > 0 && (
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
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4">
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
              onClick={handleRejectionClose}
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
