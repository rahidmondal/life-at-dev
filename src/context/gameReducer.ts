import { getAvailablePromotions, getStartingJob, JOBS } from '@/data/jobs';
import { addToActionHistory, checkEasterEggWin } from '@/logic/easterEgg';
import { GameAction, GameOver, GamePhase, GameStats, Job, LogEntry } from '@/types/game';

export type GameActionType =
  | { type: 'START_GAME'; payload?: { path?: 'student' | 'student-easy' | 'self-taught' } }
  | { type: 'PERFORM_ACTION'; payload: { action: GameAction; randomizedReward?: Partial<GameStats> } }
  | { type: 'ANSWER_INTERVIEW'; payload: { correct: boolean; newJob?: Job } }
  | { type: 'YEAR_END_REVIEW' }
  | { type: 'APPLY_EVENT'; payload: { effects: Partial<GameStats>; message: string } }
  | { type: 'ADVANCE_WEEK' }
  | { type: 'GAME_OVER'; payload: GameOver }
  | { type: 'RESET_GAME' }
  | { type: 'ADD_LOG'; payload: LogEntry }
  | { type: 'PROMOTE'; payload: { newJob: Job } };

export interface GameState {
  phase: GamePhase;
  stats: GameStats;
  eventLog: LogEntry[];
  gameOver: GameOver | null;
}

export function createInitialState(): GameState {
  return {
    phase: 'start',
    stats: {
      weeks: 52,
      stress: 0,
      energy: 100,
      money: 1000,
      coding: 50,
      reputation: 0,
      currentJob: getStartingJob(),
      age: 18,
      yearsWorked: 0,
      totalEarned: 0,
      actionHistory: [],
    },
    eventLog: [],
    gameOver: null,
  };
}

export function checkGameOver(stats: GameStats): GameOver | null {
  if (stats.stress >= 100) {
    return {
      reason: 'burnout',
      finalStats: stats,
      message: 'You burned out. The grind consumed you. Maybe touch grass next time?',
    };
  }

  if (stats.currentJob.isGameEnd) {
    return {
      reason: 'victory',
      finalStats: stats,
      message: `You made it! ${stats.currentJob.title} achieved. Total earned: $${stats.totalEarned.toLocaleString()}`,
    };
  }

  return null;
}

export function checkBankruptcy(stats: GameStats): GameOver | null {
  if (stats.money < 0) {
    return {
      reason: 'bankruptcy',
      finalStats: stats,
      message: "You're broke. Can't pay rent. Game over. Should've freelanced more.",
    };
  }
  return null;
}

export function applyStatChanges(stats: GameStats, changes: Partial<GameStats>): GameStats {
  const newStats = { ...stats };

  if (changes.weeks !== undefined) newStats.weeks = changes.weeks;
  if (changes.stress !== undefined) newStats.stress = Math.max(0, Math.min(100, stats.stress + changes.stress));
  if (changes.energy !== undefined) newStats.energy = Math.max(0, Math.min(100, stats.energy + changes.energy));
  if (changes.money !== undefined) newStats.money = stats.money + changes.money;
  if (changes.coding !== undefined) newStats.coding = Math.max(0, Math.min(1000, stats.coding + changes.coding));
  if (changes.reputation !== undefined)
    newStats.reputation = Math.max(0, Math.min(1000, stats.reputation + changes.reputation));

  return newStats;
}

let logIdCounter = 0;
function generateLogId(): string {
  return `log-${String(Date.now())}-${String(logIdCounter++)}`;
}

export function gameReducer(state: GameState, action: GameActionType): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const initialState = createInitialState();
      const path = action.payload?.path ?? 'self-taught';

      if (path === 'student') {
        const studentJob = JOBS.find(job => job.id === 'cs-student') ?? initialState.stats.currentJob;
        initialState.stats.currentJob = studentJob;
        initialState.stats.money = 0;
        initialState.stats.coding = 100;
        initialState.stats.reputation = 20;

        return {
          ...initialState,
          phase: 'playing',
          eventLog: [
            {
              id: generateLogId(),
              timestamp: Date.now(),
              message: '> You enrolled in a CS program. Time is tight, but foundations are strong.',
              type: 'info',
            },
            {
              id: generateLogId(),
              timestamp: Date.now(),
              message: '> Journey started. You have 52 weeks per year. Plan wisely!',
              type: 'info',
            },
          ],
        };
      } else if (path === 'student-easy') {
        const studentEasyJob = JOBS.find(job => job.id === 'cs-student-easy') ?? initialState.stats.currentJob;
        initialState.stats.currentJob = studentEasyJob;
        initialState.stats.money = 500;
        initialState.stats.coding = 100;
        initialState.stats.reputation = 20;
        initialState.stats.familySupportYearsLeft = 4;

        return {
          ...initialState,
          phase: 'playing',
          eventLog: [
            {
              id: generateLogId(),
              timestamp: Date.now(),
              message: '> You enrolled in a CS program with family support. Rent covered for 4 years!',
              type: 'success',
            },
            {
              id: generateLogId(),
              timestamp: Date.now(),
              message: '> Journey started. You have 52 weeks per year. Plan wisely!',
              type: 'info',
            },
          ],
        };
      } else {
        return {
          ...initialState,
          phase: 'playing',
          eventLog: [
            {
              id: generateLogId(),
              timestamp: Date.now(),
              message: '> No degree. No safety net. Just you and the grind.',
              type: 'warning',
            },
            {
              id: generateLogId(),
              timestamp: Date.now(),
              message: '> Journey started. You have 52 weeks per year. Plan wisely!',
              type: 'info',
            },
          ],
        };
      }
    }

    case 'PERFORM_ACTION': {
      const { action: gameAction, randomizedReward } = action.payload;
      const newStats = { ...state.stats };

      newStats.weeks -= gameAction.cost.weeks;
      newStats.energy -= gameAction.cost.energy;
      newStats.stress += gameAction.cost.stress;
      newStats.money -= gameAction.cost.money;

      const reward = randomizedReward ?? gameAction.reward;
      newStats.coding += reward.coding ?? 0;
      newStats.reputation += reward.reputation ?? 0;
      newStats.money += reward.money ?? 0;
      newStats.energy += reward.energy ?? 0;
      newStats.stress += reward.stress ?? 0;

      newStats.actionHistory = addToActionHistory(state.stats.actionHistory, gameAction.id);

      newStats.stress = Math.max(0, Math.min(100, newStats.stress));
      newStats.energy = Math.max(0, Math.min(100, newStats.energy));
      newStats.coding = Math.max(0, Math.min(1000, newStats.coding));
      newStats.reputation = Math.max(0, Math.min(1000, newStats.reputation));

      const rewardMoney = reward.money ?? 0;
      const logEntry: LogEntry = {
        id: generateLogId(),
        timestamp: Date.now(),
        message: `> ${gameAction.name}: -${String(gameAction.cost.weeks)}w, -${String(gameAction.cost.energy)}e, ${rewardMoney > 0 ? `+$${String(rewardMoney)}` : ''}`,
        type: 'success',
      };

      const newEventLog = [...state.eventLog, logEntry];

      const gameOver = checkGameOver(newStats);
      if (gameOver) {
        return {
          ...state,
          phase: 'gameover',
          stats: newStats,
          eventLog: [
            ...newEventLog,
            {
              id: generateLogId(),
              timestamp: Date.now(),
              message: `> GAME OVER: ${gameOver.message}`,
              type: 'error',
            },
          ],
          gameOver,
        };
      }

      if (newStats.weeks <= 0) {
        return {
          ...state,
          stats: newStats,
          eventLog: [
            ...newEventLog,
            {
              id: generateLogId(),
              timestamp: Date.now(),
              message: '> YEAR END: Performance review triggered!',
              type: 'warning',
            },
          ],
        };
      }

      return {
        ...state,
        stats: newStats,
        eventLog: newEventLog,
      };
    }

    case 'YEAR_END_REVIEW': {
      const newStats = { ...state.stats };

      const yearlyIncome = newStats.currentJob.yearlyPay;
      newStats.money += yearlyIncome;
      newStats.totalEarned += yearlyIncome;
      newStats.age += 1;
      newStats.yearsWorked += 1;

      const logMessages: LogEntry[] = [];

      const yearlyRent = newStats.currentJob.rentPerYear;
      newStats.money -= yearlyRent;

      const bankruptcyCheck = checkBankruptcy(newStats);
      if (bankruptcyCheck) {
        return {
          ...state,
          phase: 'gameover',
          stats: newStats,
          eventLog: [
            ...state.eventLog,
            {
              id: generateLogId(),
              timestamp: Date.now(),
              message: `> Year ${String(newStats.yearsWorked)} complete. Income: +$${yearlyIncome.toLocaleString()}, Rent: -$${yearlyRent.toLocaleString()}`,
              type: 'info',
            },
            {
              id: generateLogId(),
              timestamp: Date.now(),
              message: `> GAME OVER: ${bankruptcyCheck.message}`,
              type: 'error',
            },
          ],
          gameOver: bankruptcyCheck,
        };
      }

      newStats.weeks = 52;

      const availablePromotions = getAvailablePromotions(
        newStats.currentJob,
        newStats.coding,
        newStats.reputation,
        newStats.money,
      );

      // Note: Senior Developer and above never auto-promote (player chooses career path)
      const isSeniorOrAbove = newStats.currentJob.level >= 3;
      const shouldAutoPromote = availablePromotions.length === 1 && !isSeniorOrAbove;

      if (shouldAutoPromote) {
        // If on cs-student-easy with family support, allow promotion but clear support
        if (newStats.currentJob.id === 'cs-student-easy' && newStats.familySupportYearsLeft) {
          const promotion = availablePromotions[0];
          newStats.currentJob = promotion;
          newStats.familySupportYearsLeft = 0;

          logMessages.push({
            id: generateLogId(),
            timestamp: Date.now(),
            message: `> 🎉 PROMOTED to ${promotion.title}! New salary: $${promotion.yearlyPay.toLocaleString()}/year`,
            type: 'success',
          });
        } else if (newStats.currentJob.id !== 'cs-student-easy') {
          const promotion = availablePromotions[0];
          newStats.currentJob = promotion;

          logMessages.push({
            id: generateLogId(),
            timestamp: Date.now(),
            message: `> 🎉 PROMOTED to ${promotion.title}! New salary: $${promotion.yearlyPay.toLocaleString()}/year`,
            type: 'success',
          });
        }
      } else if (availablePromotions.length > 0 && (isSeniorOrAbove || availablePromotions.length > 1)) {
        logMessages.push({
          id: generateLogId(),
          timestamp: Date.now(),
          message: `> 💼 ${isSeniorOrAbove ? 'Promotion available!' : 'Multiple career opportunities available!'} Use Job Hunt when ready to advance.`,
          type: 'info',
        });
      }

      if (newStats.familySupportYearsLeft && newStats.familySupportYearsLeft > 0) {
        newStats.familySupportYearsLeft -= 1;

        if (newStats.familySupportYearsLeft === 0 && newStats.currentJob.id === 'cs-student-easy') {
          logMessages.push({
            id: generateLogId(),
            timestamp: Date.now(),
            message: '> 🎓 GRADUATION! You completed your degree. Use Job Hunt to start your career!',
            type: 'success',
          });
        }
      }

      logMessages.push({
        id: generateLogId(),
        timestamp: Date.now(),
        message: `> Year ${String(newStats.yearsWorked)} complete. Income: +$${yearlyIncome.toLocaleString()}, Rent: -$${yearlyRent.toLocaleString()}${newStats.familySupportYearsLeft && newStats.familySupportYearsLeft > 0 ? ` (family support: ${String(newStats.familySupportYearsLeft)} years left)` : ''}`,
        type: 'info',
      });

      if (
        availablePromotions.length === 0 ||
        (newStats.currentJob.id === 'cs-student-easy' &&
          newStats.familySupportYearsLeft &&
          newStats.familySupportYearsLeft > 0)
      ) {
        logMessages.push({
          id: generateLogId(),
          timestamp: Date.now(),
          message: `> Performance review: No promotion available yet. Keep building skills!`,
          type: 'warning',
        });
      }

      const easterEggEvent = checkEasterEggWin(newStats);
      if (easterEggEvent) {
        const easterEggWin: GameOver = {
          reason: 'victory',
          finalStats: newStats,
          message: easterEggEvent,
          isEasterEggWin: true,
          easterEggEvent,
        };

        return {
          ...state,
          phase: 'gameover',
          stats: newStats,
          eventLog: [
            ...state.eventLog,
            ...logMessages,
            {
              id: generateLogId(),
              timestamp: Date.now(),
              message: `> 🎉 EASTER EGG VICTORY: ${easterEggEvent}`,
              type: 'success',
            },
          ],
          gameOver: easterEggWin,
        };
      }

      const gameOver = checkGameOver(newStats);
      if (gameOver) {
        return {
          ...state,
          phase: 'gameover',
          stats: newStats,
          eventLog: [
            ...state.eventLog,
            ...logMessages,
            {
              id: generateLogId(),
              timestamp: Date.now(),
              message: `> GAME OVER: ${gameOver.message}`,
              type: 'error',
            },
          ],
          gameOver,
        };
      }

      return {
        ...state,
        stats: newStats,
        eventLog: [...state.eventLog, ...logMessages],
      };
    }

    case 'APPLY_EVENT': {
      const { effects, message } = action.payload;
      const newStats = applyStatChanges(state.stats, effects);

      const logEntry: LogEntry = {
        id: generateLogId(),
        timestamp: Date.now(),
        message: `> EVENT: ${message}`,
        type: 'event',
      };

      const gameOver = checkGameOver(newStats);
      if (gameOver) {
        return {
          ...state,
          phase: 'gameover',
          stats: newStats,
          eventLog: [...state.eventLog, logEntry],
          gameOver,
        };
      }

      return {
        ...state,
        stats: newStats,
        eventLog: [...state.eventLog, logEntry],
      };
    }

    case 'ANSWER_INTERVIEW': {
      const { correct, newJob } = action.payload;

      if (correct && newJob) {
        const newStats = { ...state.stats, currentJob: newJob };

        return {
          ...state,
          stats: newStats,
          eventLog: [
            ...state.eventLog,
            {
              id: generateLogId(),
              timestamp: Date.now(),
              message: `> 🎉 Interview SUCCESS! New role: ${newJob.title}`,
              type: 'success',
            },
          ],
        };
      } else {
        const newStats = applyStatChanges(state.stats, { stress: 10 });

        return {
          ...state,
          stats: newStats,
          eventLog: [
            ...state.eventLog,
            {
              id: generateLogId(),
              timestamp: Date.now(),
              message: '> ❌ Interview FAILED. Better luck next time.',
              type: 'error',
            },
          ],
        };
      }
    }

    case 'PROMOTE': {
      const { newJob } = action.payload;
      const newStats = { ...state.stats, currentJob: newJob };

      return {
        ...state,
        stats: newStats,
        eventLog: [
          ...state.eventLog,
          {
            id: generateLogId(),
            timestamp: Date.now(),
            message: `> 🎉 PROMOTED to ${newJob.title}!`,
            type: 'success',
          },
        ],
      };
    }

    case 'ADD_LOG': {
      return {
        ...state,
        eventLog: [...state.eventLog, action.payload],
      };
    }

    case 'GAME_OVER': {
      return {
        ...state,
        phase: 'gameover',
        gameOver: action.payload,
      };
    }

    case 'RESET_GAME': {
      return createInitialState();
    }

    default:
      return state;
  }
}
