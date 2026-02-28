import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getInterviewSession, type InterviewQuestion } from '../data/interviews';
import { JOB_REGISTRY } from '../data/tracks';
import { getEligibleJobsForApplication, promotePlayer } from '../engine/career';
import {
  generateGameOverMessage,
  generateJobChangeMessage,
  generatePerformanceReviewMessage,
} from '../engine/eventLog';
import { checkGameOverConditions } from '../engine/gameOver';
import { calculateProjectedSkillChange } from '../engine/mechanics';
import { processTurn } from '../engine/processTurn';
import { isYearEnd, processYearEnd } from '../engine/yearEnd';
import { createSave, loadSave, updateSave } from '../storage/gameStorage';
import type { JobNode } from '../types/career';
import type { GameState } from '../types/gamestate';
import type { Resources } from '../types/resources';
import type { SkillMap, XPCurrency } from '../types/stats';
import { INITIAL_GAME_STATE } from './initialState';

interface PathConfig {
  startAge: number;
  resources: Partial<Resources>;
  skills: Partial<SkillMap>;
  xp: Partial<XPCurrency>;
  accumulatesDebt: boolean;
}

const PATH_CONFIGS: Record<string, PathConfig> = {
  scholar: {
    startAge: 18,
    resources: { money: 0, debt: 0 },
    skills: { coding: 0, politics: 0 },
    xp: { corporate: 0, freelance: 0, reputation: 0 },
    accumulatesDebt: false,
  },
  funded: {
    startAge: 18,
    resources: { money: 0, debt: 0 },
    skills: { coding: 0, politics: 0 },
    xp: { corporate: 0, freelance: 0, reputation: 0 },
    accumulatesDebt: true,
  },
  dropout: {
    startAge: 18,
    resources: { money: 0, debt: 0 },
    skills: { coding: 0, politics: 0 },
    xp: { corporate: 0, freelance: 0, reputation: 0 },
    accumulatesDebt: false,
  },
};

function getPathInitialState(path?: string): PathConfig {
  if (path && path in PATH_CONFIGS) {
    return PATH_CONFIGS[path];
  }
  return PATH_CONFIGS.dropout;
}

interface GameActions {
  tick: () => void;
  setJob: (jobId: string) => void;
  updateResources: (delta: Partial<Resources>) => void;
  updateStats: (delta: Partial<SkillMap & XPCurrency>) => void;
  resetGame: () => void;

  performAction: (actionId: string) => void;
  advanceWeek: () => void;
  triggerYearEnd: () => boolean;

  // Job application flow
  openJobApplication: () => void;
  closeJobApplication: () => void;
  applyForJob: (jobId: string) => void;
  getAvailableJobs: () => JobNode[];

  // Interview flow
  startInterview: (jobId: string) => void;
  submitInterviewAnswer: (optionIndex: number) => void;
  advanceInterviewQuestion: () => void;
  completeInterview: () => void;
  closeInterview: () => void;

  // Graduation flow
  acknowledgeGraduation: () => void;

  startNewGame: (path?: string, playerName?: string) => Promise<void>;
  loadGame: (saveId: string) => Promise<void>;
  saveGame: () => Promise<void>;

  resetState: () => void;

  // Selectors/Computed
  getProjectedSkillChange: () => number;
}

interface InterviewState {
  isInterviewOpen: boolean;
  currentInterviewJobId: string | null;
  interviewQuestions: InterviewQuestion[];
  currentQuestionIndex: number;
  correctAnswersCount: number;
  interviewAnswers: { selectedOption: number; correct: boolean }[];
  showInterviewFeedback: boolean;
  interviewPhase: 'question' | 'results';
}

interface UIState {
  showJobApplicationModal: boolean;
  showGraduationModal: boolean;
}

type GameStore = GameState & { currentSaveId: string | null } & UIState & InterviewState & GameActions;

function extractGameState(store: GameStore): GameState {
  return {
    status: store.status,
    meta: store.meta,
    resources: store.resources,
    stats: store.stats,
    career: store.career,
    flags: store.flags,
    eventLog: store.eventLog,
    gameOverReason: store.gameOverReason,
    gameOverOutcome: store.gameOverOutcome,
  };
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      ...INITIAL_GAME_STATE,
      currentSaveId: null,
      showJobApplicationModal: false,
      showGraduationModal: false,

      // Interview state
      isInterviewOpen: false,
      currentInterviewJobId: null,
      interviewQuestions: [],
      currentQuestionIndex: 0,
      correctAnswersCount: 0,
      interviewAnswers: [],
      showInterviewFeedback: false,
      interviewPhase: 'question' as const,

      tick: () => {
        set(
          state => ({
            meta: { ...state.meta, tick: state.meta.tick + 1 },
          }),
          false,
          'tick',
        );
      },

      setJob: (jobId: string) => {
        set(
          state => ({
            career: { ...state.career, currentJobId: jobId },
          }),
          false,
          'setJob',
        );
      },

      updateResources: (delta: Partial<Resources>) => {
        set(
          state => {
            const updated = { ...state.resources };

            if (delta.money !== undefined) {
              updated.money = state.resources.money + delta.money;
            }
            if (delta.debt !== undefined) {
              updated.debt = Math.max(0, state.resources.debt + delta.debt);
            }
            if (delta.stress !== undefined) {
              updated.stress = Math.max(0, Math.min(100, state.resources.stress + delta.stress));
            }
            if (delta.energy !== undefined) {
              updated.energy = Math.max(0, Math.min(100, state.resources.energy + delta.energy));
            }
            if (delta.fulfillment !== undefined) {
              updated.fulfillment = Math.max(0, Math.min(10000, state.resources.fulfillment + delta.fulfillment));
            }

            return { resources: updated };
          },
          false,
          'updateResources',
        );
      },

      updateStats: (delta: Partial<SkillMap & XPCurrency>) => {
        set(
          state => {
            const skills = { ...state.stats.skills };
            const xp = { ...state.stats.xp };

            if (delta.coding !== undefined) {
              skills.coding = Math.max(0, Math.min(10000, skills.coding + delta.coding));
            }
            if (delta.politics !== undefined) {
              skills.politics = Math.max(0, Math.min(10000, skills.politics + delta.politics));
            }
            if (delta.corporate !== undefined) {
              xp.corporate = Math.max(0, xp.corporate + delta.corporate);
            }
            if (delta.freelance !== undefined) {
              xp.freelance = Math.max(0, xp.freelance + delta.freelance);
            }
            if (delta.reputation !== undefined) {
              xp.reputation = Math.max(0, Math.min(10000, xp.reputation + delta.reputation));
            }

            return { stats: { skills, xp } };
          },
          false,
          'updateStats',
        );
      },

      resetGame: () => {
        set(
          {
            ...INITIAL_GAME_STATE,
            currentSaveId: null,
            showJobApplicationModal: false,
            showGraduationModal: false,
            isInterviewOpen: false,
            currentInterviewJobId: null,
            interviewQuestions: [],
            currentQuestionIndex: 0,
            correctAnswersCount: 0,
            interviewAnswers: [],
            showInterviewFeedback: false,
            interviewPhase: 'question' as const,
          },
          false,
          'resetGame',
        );
      },

      performAction: (actionId: string) => {
        // Special handling for apply_job - open modal instead of processing
        if (actionId === 'apply_job') {
          get().openJobApplication();
          return;
        }

        const currentState = extractGameState(get());

        // Don't process turns if game is over
        if (currentState.status === 'GAME_OVER') {
          return;
        }

        let newState: GameState;
        try {
          newState = processTurn(currentState, actionId);
        } catch {
          // Action cannot be performed (insufficient resources or invalid action)
          return;
        }

        // ── Game-over check (pre year-end) ──
        const gameOverCheck = checkGameOverConditions(newState);
        if (gameOverCheck.isGameOver && gameOverCheck.reason && gameOverCheck.outcome) {
          const reason = gameOverCheck.reason;
          const outcome = gameOverCheck.outcome;
          const entry = generateGameOverMessage(reason, outcome, newState.meta.tick);
          set(
            {
              ...newState,
              status: 'GAME_OVER',
              gameOverReason: reason,
              gameOverOutcome: outcome,
              eventLog: [entry, ...newState.eventLog].slice(0, 50),
            },
            false,
            `gameOver:${reason}`,
          );
          return;
        }

        // ── Year-end interceptor ──
        if (isYearEnd(newState.meta.tick)) {
          const wasGraduated = newState.flags.hasGraduated;
          const result = processYearEnd(newState);

          // Check bankruptcy from year-end
          if (result.isBankrupt) {
            const entry = generateGameOverMessage('bankruptcy', 'loss', newState.meta.tick);
            set(
              {
                ...result.newState,
                status: 'GAME_OVER',
                gameOverReason: 'bankruptcy',
                gameOverOutcome: 'loss',
                eventLog: [entry, ...result.newState.eventLog].slice(0, 50),
              },
              false,
              'gameOver:bankruptcy',
            );
            return;
          }

          const justGraduated = !wasGraduated && result.newState.flags.hasGraduated;
          const yearNumber = Math.floor(newState.meta.tick / 52) + 1;

          // Log performance review to event log
          const reviewEntry = generatePerformanceReviewMessage(
            yearNumber,
            result.performanceReview.rating,
            result.performanceReview.bonus,
            result.performanceReview.isEligibleForPromotion,
            newState.meta.tick,
          );

          set(
            {
              ...result.newState,
              eventLog: [reviewEntry, ...result.newState.eventLog].slice(0, 50),
              showGraduationModal: justGraduated,
            },
            false,
            'yearEnd:processed',
          );
          void get().saveGame();
          return;
        }

        // ── Normal state update ──
        set({ ...newState }, false, `performAction:${actionId}`);
      },

      // Job application flow
      openJobApplication: () => {
        set({ showJobApplicationModal: true }, false, 'openJobApplication');
      },

      closeJobApplication: () => {
        set({ showJobApplicationModal: false }, false, 'closeJobApplication');
      },

      getAvailableJobs: () => {
        const currentState = extractGameState(get());
        return getEligibleJobsForApplication(currentState);
      },

      applyForJob: (jobId: string) => {
        const currentState = extractGameState(get());
        const oldJobId = currentState.career.currentJobId;
        const oldJob = JOB_REGISTRY[oldJobId];
        const newJob = JOB_REGISTRY[jobId];

        // Use promotePlayer to handle the job change
        const newState = promotePlayer(currentState, jobId);

        // Generate job change event
        const oldJobTitle = oldJob.title;
        const jobChangeEntry = generateJobChangeMessage(oldJobTitle, newJob.title, newJob.salary);

        const stateWithEvent: GameState = {
          ...newState,
          eventLog: [{ ...jobChangeEntry, tick: newState.meta.tick }, ...newState.eventLog].slice(0, 50),
        };

        // Check game-over after job change (e.g. reached terminal role → win)
        const gameOverCheck = checkGameOverConditions(stateWithEvent);
        if (gameOverCheck.isGameOver && gameOverCheck.reason && gameOverCheck.outcome) {
          const reason = gameOverCheck.reason;
          const outcome = gameOverCheck.outcome;
          const goEntry = generateGameOverMessage(reason, outcome, stateWithEvent.meta.tick);
          set(
            {
              ...stateWithEvent,
              status: 'GAME_OVER',
              gameOverReason: reason,
              gameOverOutcome: outcome,
              eventLog: [goEntry, ...stateWithEvent.eventLog].slice(0, 50),
              showJobApplicationModal: false,
            },
            false,
            `gameOver:${reason}`,
          );
          void get().saveGame();
          return;
        }

        // Merge the event into state
        set(
          {
            ...stateWithEvent,
            showJobApplicationModal: false,
          },
          false,
          `applyForJob:${jobId}`,
        );
      },

      // ── Interview flow ──────────────────────────────────────────────
      startInterview: (jobId: string) => {
        const questions = getInterviewSession(jobId);
        set(
          {
            isInterviewOpen: true,
            showJobApplicationModal: false,
            currentInterviewJobId: jobId,
            interviewQuestions: questions,
            currentQuestionIndex: 0,
            correctAnswersCount: 0,
            interviewAnswers: [],
            showInterviewFeedback: false,
            interviewPhase: 'question',
          },
          false,
          `startInterview:${jobId}`,
        );
      },

      submitInterviewAnswer: (optionIndex: number) => {
        const { interviewQuestions, currentQuestionIndex, correctAnswersCount, interviewAnswers } = get();
        const currentQ = interviewQuestions[currentQuestionIndex];
        const isCorrect = optionIndex === currentQ.correctIndex;
        set(
          {
            correctAnswersCount: isCorrect ? correctAnswersCount + 1 : correctAnswersCount,
            interviewAnswers: [...interviewAnswers, { selectedOption: optionIndex, correct: isCorrect }],
            showInterviewFeedback: true,
          },
          false,
          'submitInterviewAnswer',
        );
      },

      advanceInterviewQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex < 2) {
          set(
            {
              currentQuestionIndex: currentQuestionIndex + 1,
              showInterviewFeedback: false,
            },
            false,
            'advanceInterviewQuestion',
          );
        } else {
          set({ interviewPhase: 'results', showInterviewFeedback: false }, false, 'interviewResults');
        }
      },

      completeInterview: () => {
        const { correctAnswersCount, currentInterviewJobId } = get();
        const passed = correctAnswersCount >= 2;

        if (passed && currentInterviewJobId) {
          // Trigger actual promotion via applyForJob
          set(
            {
              isInterviewOpen: false,
              currentInterviewJobId: null,
              interviewQuestions: [],
              currentQuestionIndex: 0,
              correctAnswersCount: 0,
              interviewAnswers: [],
              showInterviewFeedback: false,
              interviewPhase: 'question',
            },
            false,
            'interviewPassed',
          );
          get().applyForJob(currentInterviewJobId);
        } else {
          // Failed — just close
          set(
            {
              isInterviewOpen: false,
              currentInterviewJobId: null,
              interviewQuestions: [],
              currentQuestionIndex: 0,
              correctAnswersCount: 0,
              interviewAnswers: [],
              showInterviewFeedback: false,
              interviewPhase: 'question',
            },
            false,
            'interviewFailed',
          );
        }
      },

      closeInterview: () => {
        set(
          {
            isInterviewOpen: false,
            currentInterviewJobId: null,
            interviewQuestions: [],
            currentQuestionIndex: 0,
            correctAnswersCount: 0,
            interviewAnswers: [],
            showInterviewFeedback: false,
            interviewPhase: 'question',
          },
          false,
          'closeInterview',
        );
      },

      // Graduation flow
      acknowledgeGraduation: () => {
        set({ showGraduationModal: false }, false, 'acknowledgeGraduation');
      },

      advanceWeek: () => {
        set(
          state => ({
            meta: { ...state.meta, tick: state.meta.tick + 1 },
            resources: {
              ...state.resources,
              energy: Math.min(100, state.resources.energy + 50),
            },
          }),
          false,
          'advanceWeek',
        );
      },

      triggerYearEnd: () => {
        const currentState = extractGameState(get());
        const wasGraduated = currentState.flags.hasGraduated;
        const result = processYearEnd(currentState);

        if (result.isBankrupt) {
          const entry = generateGameOverMessage('bankruptcy', 'loss', currentState.meta.tick);
          set(
            {
              ...result.newState,
              status: 'GAME_OVER',
              gameOverReason: 'bankruptcy',
              gameOverOutcome: 'loss',
              eventLog: [entry, ...result.newState.eventLog].slice(0, 50),
            },
            false,
            'yearEnd:bankruptcy',
          );
          return true;
        }

        const justGraduated = !wasGraduated && result.newState.flags.hasGraduated;
        const yearNumber = Math.floor(currentState.meta.tick / 52) + 1;

        // Log performance review to event log
        const reviewEntry = generatePerformanceReviewMessage(
          yearNumber,
          result.performanceReview.rating,
          result.performanceReview.bonus,
          result.performanceReview.isEligibleForPromotion,
          currentState.meta.tick,
        );

        set(
          {
            ...result.newState,
            eventLog: [reviewEntry, ...result.newState.eventLog].slice(0, 50),
            showGraduationModal: justGraduated,
          },
          false,
          'yearEnd:processed',
        );
        return false;
      },

      startNewGame: async (path?: string, playerName?: string) => {
        const pathConfig = getPathInitialState(path);
        const startingPath = path as 'scholar' | 'funded' | 'dropout';
        const isScholar = startingPath === 'scholar';
        const initialState: GameState = {
          ...INITIAL_GAME_STATE,
          meta: {
            ...INITIAL_GAME_STATE.meta,
            startAge: pathConfig.startAge,
            playerName: playerName ?? 'Developer',
          },
          resources: {
            ...INITIAL_GAME_STATE.resources,
            ...pathConfig.resources,
          },
          stats: {
            skills: {
              ...INITIAL_GAME_STATE.stats.skills,
              ...pathConfig.skills,
            },
            xp: {
              ...INITIAL_GAME_STATE.stats.xp,
              ...pathConfig.xp,
            },
          },
          flags: {
            ...INITIAL_GAME_STATE.flags,
            accumulatesDebt: pathConfig.accumulatesDebt,
            startingPath,
            isScholar,
            scholarYearsRemaining: isScholar ? 4 : 0,
          },
        };

        const newId = await createSave(initialState, true);
        set({ ...initialState, currentSaveId: newId }, false, 'startNewGame');
      },

      loadGame: async (saveId: string) => {
        const save = await loadSave(saveId);
        if (!save) {
          console.error(`Save not found: ${saveId}`);
          return;
        }
        set({ ...save.data, currentSaveId: saveId }, false, 'loadGame');
      },

      saveGame: async () => {
        const { currentSaveId } = get();
        if (!currentSaveId) {
          console.warn('No current save ID, creating new save');
          const newId = await createSave(extractGameState(get()), false);
          set({ currentSaveId: newId }, false, 'saveGame:created');
          return;
        }
        await updateSave(currentSaveId, extractGameState(get()));
      },

      resetState: () => {
        set(
          {
            ...INITIAL_GAME_STATE,
            currentSaveId: null,
            showJobApplicationModal: false,
            showGraduationModal: false,
            isInterviewOpen: false,
            currentInterviewJobId: null,
            interviewQuestions: [],
            currentQuestionIndex: 0,
            correctAnswersCount: 0,
            interviewAnswers: [],
            showInterviewFeedback: false,
            interviewPhase: 'question' as const,
          },
          false,
          'resetState',
        );
      },

      getProjectedSkillChange: () => {
        const state = get();
        const currentJob = JOB_REGISTRY[state.career.currentJobId];
        const displacement = currentJob.roleDisplacement ?? 0;
        const weeklyGain = currentJob.weeklyGains?.coding ?? 0;

        return calculateProjectedSkillChange(state.stats.skills.coding, displacement, weeklyGain);
      },
    }),
    { name: 'LifeAtDev' },
  ),
);
