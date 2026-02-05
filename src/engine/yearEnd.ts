import { JOB_REGISTRY } from '../data/tracks';
import type { GameState } from '../types/gamestate';
import { isYearEnd } from './time';

/**
 * Default rent rate if job doesn't specify one.
 */
const DEFAULT_RENT_RATE = 0.3;

/**
 * Fixed yearly rent for volatile income jobs (hustlers).
 * They pay rent from their gig money, not salary-based.
 */
const HUSTLER_FIXED_RENT = 12000;

/**
 * Bankruptcy threshold: if money goes below -(salary * this), bankruptcy is triggered.
 * At 50% of yearly salary negative, you're bankrupt.
 */
const BANKRUPTCY_THRESHOLD_RATE = 0.5;

/**
 * Result of year-end financial processing.
 */
export interface YearEndResult {
  /** Updated game state after year-end processing. */
  newState: GameState;

  /** Whether the player went bankrupt. */
  isBankrupt: boolean;

  /** Detailed breakdown of year-end finances. */
  summary: YearEndSummary;
}

export interface YearEndSummary {
  /** Yearly salary earned. */
  salaryEarned: number;

  /** Yearly rent paid. */
  rentPaid: number;

  /** Net income (salary - rent). */
  netIncome: number;

  /** Amount converted to debt (if money went negative). */
  debtIncurred: number;

  /** Final money after processing. */
  finalMoney: number;

  /** Final debt after processing. */
  finalDebt: number;

  /** Message describing the year-end result. */
  message: string;
}

/**
 * Calculate yearly rent based on job and salary.
 * Corporate jobs: rentRate * salary
 * Hustler jobs: fixed yearly rent (they handle rent from gig money)
 */
export function calculateYearlyRent(jobId: string): number {
  const job = JOB_REGISTRY[jobId] as (typeof JOB_REGISTRY)[string] | undefined;

  if (!job) {
    return 0;
  }

  // Volatile income jobs have fixed rent (or 0 if they handle it themselves)
  if (job.incomeType === 'volatile') {
    // For hustlers, if rentRate is 0, they pay from gig money (already deducted)
    // Otherwise, use a fixed rate
    return job.rentRate === 0 ? HUSTLER_FIXED_RENT : 0;
  }

  // Salary-based jobs: rent is percentage of salary
  const rentRate = job.rentRate ?? DEFAULT_RENT_RATE;
  return Math.round(job.salary * rentRate);
}

/**
 * Calculate the bankruptcy threshold for a given salary.
 * If money goes below -threshold, player is bankrupt.
 */
export function calculateBankruptcyThreshold(salary: number): number {
  // Minimum threshold of $5000 for unemployed/low-income players
  const minThreshold = 5000;
  return Math.max(minThreshold, salary * BANKRUPTCY_THRESHOLD_RATE);
}

/**
 * Process year-end finances: salary payment, rent deduction, and bankruptcy check.
 *
 * Logic:
 * 1. Add yearly salary to money
 * 2. Deduct yearly rent from money
 * 3. If money goes negative beyond 50% of yearly salary → BANKRUPTCY
 * 4. If money is slightly negative → convert deficit to debt
 * 5. Otherwise → player keeps the money
 */
export function processYearEnd(state: GameState): YearEndResult {
  const job = JOB_REGISTRY[state.career.currentJobId] as (typeof JOB_REGISTRY)[string] | undefined;

  if (!job) {
    // No job found - should not happen, but handle gracefully
    return {
      newState: state,
      isBankrupt: false,
      summary: {
        salaryEarned: 0,
        rentPaid: 0,
        netIncome: 0,
        debtIncurred: 0,
        finalMoney: state.resources.money,
        finalDebt: state.resources.debt,
        message: 'Year ended. No changes.',
      },
    };
  }

  const salary = job.salary;
  const rent = calculateYearlyRent(state.career.currentJobId);
  const netIncome = salary - rent;

  let newMoney = state.resources.money + netIncome;
  let newDebt = state.resources.debt;
  let debtIncurred = 0;
  let isBankrupt = false;
  let message = '';

  const bankruptcyThreshold = calculateBankruptcyThreshold(salary);

  if (newMoney < -bankruptcyThreshold) {
    // BANKRUPTCY: Money is too far negative
    isBankrupt = true;
    message = `BANKRUPTCY! Debt exceeded ${bankruptcyThreshold.toLocaleString()}. You couldn't cover your expenses.`;
  } else if (newMoney < 0) {
    // Money is negative but within threshold - convert to debt
    debtIncurred = Math.abs(newMoney);
    newDebt += debtIncurred;
    newMoney = 0;
    message = `Year ended with deficit. $${debtIncurred.toLocaleString()} added to debt.`;
  } else {
    // Positive balance
    if (netIncome > 0) {
      message = `Year ended. Earned $${salary.toLocaleString()}, paid $${rent.toLocaleString()} rent. Net: +$${netIncome.toLocaleString()}.`;
    } else if (netIncome < 0) {
      message = `Year ended. Lost $${Math.abs(netIncome).toLocaleString()} after expenses.`;
    } else {
      message = 'Year ended. Broke even on finances.';
    }
  }

  const newState: GameState = {
    ...state,
    resources: {
      ...state.resources,
      money: Math.round(newMoney),
      debt: Math.round(newDebt),
    },
    eventLog: [
      ...state.eventLog,
      {
        tick: state.meta.tick,
        eventId: 'year_end_review',
        message: `> YEAR END: ${message}`,
      },
    ],
  };

  return {
    newState,
    isBankrupt,
    summary: {
      salaryEarned: salary,
      rentPaid: rent,
      netIncome,
      debtIncurred,
      finalMoney: Math.round(newMoney),
      finalDebt: Math.round(newDebt),
      message,
    },
  };
}

/**
 * Check if current tick is a year-end boundary.
 * Reexported from time.ts for convenience.
 */
export { isYearEnd };

/**
 * Get the current year number from tick.
 */
export function getCurrentYear(tick: number): number {
  return Math.floor(tick / 52) + 1;
}
