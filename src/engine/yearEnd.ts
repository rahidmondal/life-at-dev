import { JOB_REGISTRY } from '../data/tracks';
import type { GameState, PlayerStats } from '../types/gamestate';
import type { Flags } from '../types/resources';
import { processAnnualDebtPayment } from './debt';
import { generateBankruptcyWarning, generateGraduationMessage, generateYearEndMessage } from './eventLog';
import { isReadyForPromotion } from './promotion';
import { getDateFromTick, isYearEnd } from './time';

/**
 * Scholar skill bonus per year of college.
 */
const SCHOLAR_YEARLY_SKILL_BONUS = 50;
const SCHOLAR_YEARLY_POLITICS_BONUS = 15;

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

/** Bonus rates keyed by performance rating. */
const BONUS_RATES: Record<PerformanceRating, number> = {
  exceptional: 0.2,
  good: 0.1,
  average: 0.05,
  poor: 0,
};

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type PerformanceRating = 'exceptional' | 'good' | 'average' | 'poor';

/** Annual performance review produced at year-end. */
export interface PerformanceReview {
  rating: PerformanceRating;
  bonus: number;
  skillLevel: number;
  stressLevel: number;
  reputationLevel: number;
  isEligibleForPromotion: boolean;
}

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

  /** Annual performance review. */
  performanceReview: PerformanceReview;
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
 * Process scholar year progression.
 * Decrements scholar years remaining and applies skill bonuses during college.
 * Returns updated stats and flags.
 */
function processScholarProgress(state: GameState): {
  stats: PlayerStats;
  flags: Partial<Flags>;
  isGraduating: boolean;
} {
  const { flags, stats } = state;

  // Not a scholar or already graduated
  if (!flags.isScholar || flags.scholarYearsRemaining <= 0) {
    return { stats, flags: {}, isGraduating: false };
  }

  // Decrement years remaining
  const newYearsRemaining = flags.scholarYearsRemaining - 1;
  const isGraduating = newYearsRemaining === 0;

  // Apply yearly skill bonuses from college education
  const newStats: PlayerStats = {
    ...stats,
    skills: {
      coding: stats.skills.coding + SCHOLAR_YEARLY_SKILL_BONUS,
      politics: stats.skills.politics + SCHOLAR_YEARLY_POLITICS_BONUS,
    },
  };

  return {
    stats: newStats,
    flags: {
      scholarYearsRemaining: newYearsRemaining,
      isScholar: !isGraduating,
      hasGraduated: isGraduating ? true : undefined,
    },
    isGraduating,
  };
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
      performanceReview: {
        rating: 'average',
        bonus: 0,
        skillLevel: state.stats.skills.coding,
        stressLevel: state.resources.stress,
        reputationLevel: state.stats.xp.reputation,
        isEligibleForPromotion: false,
      },
    };
  }

  const salary = job.salary;
  const rent = calculateYearlyRent(state.career.currentJobId);
  const netIncome = salary - rent;
  const { year: currentYear } = getDateFromTick(state.meta.tick);
  const jobTitle = job.title;

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

    // Generate procedural year-end message
    const yearEndEntry = generateYearEndMessage(currentYear, salary, rent, netIncome, jobTitle);
    const bankruptcyEntry = generateBankruptcyWarning(newDebt, bankruptcyThreshold);

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
        { ...yearEndEntry, tick: state.meta.tick },
        { ...bankruptcyEntry, tick: state.meta.tick, eventId: 'year_end_bankruptcy' },
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
      performanceReview: {
        rating: 'poor',
        bonus: 0,
        skillLevel: state.stats.skills.coding,
        stressLevel: state.resources.stress,
        reputationLevel: state.stats.xp.reputation,
        isEligibleForPromotion: false,
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

  // Generate procedural year-end message
  const yearEndEntry = generateYearEndMessage(currentYear, salary, rent, netIncome, jobTitle);

  // Add debt warning if applicable
  const eventLogEntries = [{ ...yearEndEntry, tick: state.meta.tick }];
  if (newDebt > 0) {
    const debtWarning = generateBankruptcyWarning(newDebt, bankruptcyThreshold);
    eventLogEntries.push({
      ...debtWarning,
      tick: state.meta.tick,
      eventId: isBankrupt ? 'year_end_bankruptcy' : 'debt_status',
    });
  }

  // Process scholar progress (graduation check)
  const scholarResult = processScholarProgress(state);

  // Add graduation event if graduating
  if (scholarResult.isGraduating) {
    const graduationEntry = generateGraduationMessage(state.flags.startingPath, 4);
    eventLogEntries.push({
      ...graduationEntry,
      tick: state.meta.tick,
    });
  }

  // Performance review & annual bonus
  const performanceReview = calculatePerformanceReview(state, salary);
  const bonusAmount = performanceReview.bonus;
  newMoney += bonusAmount;
  if (bonusAmount > 0) {
    messages.push(`Annual bonus: +$${bonusAmount.toLocaleString()}.`);
  }

  const newState: GameState = {
    ...state,
    resources: {
      ...state.resources,
      money: Math.round(newMoney),
      debt: Math.round(newDebt),
    },
    stats: scholarResult.stats,
    flags: {
      ...state.flags,
      ...scholarResult.flags,
      isBankrupt: isBankrupt || state.flags.isBankrupt,
      consecutiveMissedPayments: debtResult.newConsecutiveMissedPayments,
      totalMissedPayments: debtResult.newTotalMissedPayments,
    },
    eventLog: [...state.eventLog, ...eventLogEntries],
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
    performanceReview,
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

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE REVIEW
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate annual performance review.
 * Rating is based on skill level relative to job tier expectations,
 * stress management, and reputation growth.
 * Bonus is a percentage of salary based on the rating.
 */
export function calculatePerformanceReview(state: GameState, salary: number): PerformanceReview {
  const { stats, resources } = state;
  const job = JOB_REGISTRY[state.career.currentJobId];
  const tier = job?.tier ?? 0;

  // Expected skill for the tier (rough ladder: tier 0→500, tier 6→8000)
  const expectedSkill = 500 + tier * 1250;
  const skillRatio = stats.skills.coding / Math.max(1, expectedSkill);

  // Stress penalty: high stress hurts rating
  const stressPenalty = resources.stress > 80 ? -1 : resources.stress > 60 ? -0.5 : 0;

  // Reputation bonus
  const repBonus = stats.xp.reputation > 3000 ? 0.5 : stats.xp.reputation > 1000 ? 0.25 : 0;

  const score = skillRatio + repBonus + stressPenalty;

  let rating: PerformanceRating;
  if (score >= 1.5) {
    rating = 'exceptional';
  } else if (score >= 1.0) {
    rating = 'good';
  } else if (score >= 0.6) {
    rating = 'average';
  } else {
    rating = 'poor';
  }

  const bonus = Math.round(salary * BONUS_RATES[rating]);
  const eligible = isReadyForPromotion(state);

  return {
    rating,
    bonus,
    skillLevel: stats.skills.coding,
    stressLevel: resources.stress,
    reputationLevel: stats.xp.reputation,
    isEligibleForPromotion: eligible,
  };
}
