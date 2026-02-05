import { JOB_REGISTRY } from '../data/tracks';
import type { GameState } from '../types/gamestate';
import { processAnnualDebtPayment } from './debt';
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

  /** Debt payment made. */
  debtPayment: number;

  /** Whether an annual debt payment was missed. */
  missedDebtPayment: boolean;

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
 * Unemployed: 0 (living with parents/friends)
 */
export function calculateYearlyRent(jobId: string): number {
  const job = JOB_REGISTRY[jobId] as (typeof JOB_REGISTRY)[string] | undefined;

  if (!job) {
    return 0;
  }

  // Unemployed pays no rent (living with parents/friends)
  if (job.id === 'unemployed' || (job.salary === 0 && job.tier === 0)) {
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
 * Process year-end finances: salary payment, rent deduction, debt payment, and bankruptcy check.
 *
 * Logic:
 * 1. Add yearly salary to money
 * 2. Deduct yearly rent from money
 * 3. If money goes negative beyond 50% of yearly salary → BANKRUPTCY
 * 4. If money is slightly negative → convert deficit to debt
 * 5. Process annual debt payment (if player has debt)
 * 6. If 3 consecutive missed debt payments → BANKRUPTCY
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
        debtPayment: 0,
        missedDebtPayment: false,
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
  const messages: string[] = [];

  const bankruptcyThreshold = calculateBankruptcyThreshold(salary);

  // Step 1: Check if player can cover expenses
  if (newMoney < -bankruptcyThreshold) {
    // BANKRUPTCY: Money is too far negative
    isBankrupt = true;
    messages.push(`BANKRUPTCY! Deficit of $${Math.abs(newMoney).toLocaleString()} exceeded threshold.`);

    const newState: GameState = {
      ...state,
      resources: {
        ...state.resources,
        money: Math.round(newMoney),
        debt: Math.round(newDebt),
      },
      flags: {
        ...state.flags,
        isBankrupt: true,
      },
      eventLog: [
        ...state.eventLog,
        {
          tick: state.meta.tick,
          eventId: 'year_end_bankruptcy',
          message: `> YEAR END: ${messages.join(' ')}`,
        },
      ],
    };

    return {
      newState,
      isBankrupt: true,
      summary: {
        salaryEarned: salary,
        rentPaid: rent,
        netIncome,
        debtIncurred: 0,
        debtPayment: 0,
        missedDebtPayment: false,
        finalMoney: Math.round(newMoney),
        finalDebt: Math.round(newDebt),
        message: messages.join(' '),
      },
    };
  }

  // Step 2: Convert deficit to debt if within threshold
  if (newMoney < 0) {
    debtIncurred = Math.abs(newMoney);
    newDebt += debtIncurred;
    newMoney = 0;
    messages.push(`Deficit of $${debtIncurred.toLocaleString()} added to debt.`);
  } else if (netIncome > 0) {
    messages.push(`Earned $${salary.toLocaleString()}, paid $${rent.toLocaleString()} rent.`);
  } else if (netIncome < 0) {
    messages.push(`Lost $${Math.abs(netIncome).toLocaleString()} after expenses.`);
  }

  // Step 3: Process annual debt payment
  const debtResult = processAnnualDebtPayment(
    newDebt,
    newMoney,
    state.meta.tick,
    state.meta.startAge,
    state.flags.consecutiveMissedPayments,
    state.flags.totalMissedPayments,
  );

  // Update money and debt based on debt payment result
  newMoney -= debtResult.amountPaid;
  newDebt = debtResult.newDebt;

  if (debtResult.amountPaid > 0) {
    messages.push(`Paid $${debtResult.amountPaid.toLocaleString()} towards debt.`);
  }

  if (debtResult.missedPayment) {
    messages.push(debtResult.message);
  }

  // Check for debt-related bankruptcy
  if (debtResult.isBankrupt) {
    isBankrupt = true;
  }

  const newState: GameState = {
    ...state,
    resources: {
      ...state.resources,
      money: Math.round(newMoney),
      debt: Math.round(newDebt),
    },
    flags: {
      ...state.flags,
      isBankrupt: isBankrupt || state.flags.isBankrupt,
      consecutiveMissedPayments: debtResult.newConsecutiveMissedPayments,
      totalMissedPayments: debtResult.newTotalMissedPayments,
    },
    eventLog: [
      ...state.eventLog,
      {
        tick: state.meta.tick,
        eventId: isBankrupt ? 'year_end_bankruptcy' : 'year_end_review',
        message: `> YEAR END: ${messages.join(' ')}`,
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
      debtPayment: debtResult.amountPaid,
      missedDebtPayment: debtResult.missedPayment,
      finalMoney: Math.round(newMoney),
      finalDebt: Math.round(newDebt),
      message: messages.join(' '),
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
