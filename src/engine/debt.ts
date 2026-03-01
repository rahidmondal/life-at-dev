import type { GameState } from '../types/gamestate';

// ═══════════════════════════════════════════════════════════════════════════
// DEBT SYSTEM CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/** Amount of debt accumulated per year during university (funded path). */
const YEARLY_DEBT_ACCUMULATION = 10000;

/** Maximum total student debt that can be accumulated (hard cap). */
const MAXIMUM_STUDENT_DEBT = 40000;

/** Base annual interest rate (5%). */
const ANNUAL_INTEREST_RATE = 0.05;

/** Penalty interest rate for missed payments (8%). */
const PENALTY_INTEREST_RATE = 0.08;

/** Weekly interest rate derived from annual rate. */
const WEEKLY_INTEREST_RATE = ANNUAL_INTEREST_RATE / 52;

/** Weekly penalty interest rate for those with missed payments. */
const WEEKLY_PENALTY_INTEREST_RATE = PENALTY_INTEREST_RATE / 52;

/** Minimum payment rate (2% of debt per week). */
const MINIMUM_PAYMENT_RATE = 0.02;

/** Annual minimum payment rate (10% of debt per year). */
const ANNUAL_MINIMUM_PAYMENT_RATE = 0.1;

/** Age when university ends and debt repayment begins. */
const UNIVERSITY_END_AGE = 22;

/** Stress multiplier per $10,000 of debt. */
const DEBT_STRESS_MULTIPLIER = 0.5;

/** Additional stress per missed payment in history. */
const MISSED_PAYMENT_STRESS_PENALTY = 2;

/** Number of consecutive missed annual payments before bankruptcy. */
const BANKRUPTCY_MISSED_PAYMENT_THRESHOLD = 3;

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function getCurrentAge(tick: number, startAge: number): number {
  const yearsElapsed = Math.floor(tick / 52);
  return startAge + yearsElapsed;
}

export function isInUniversityPeriod(tick: number, startAge: number): boolean {
  const currentAge = getCurrentAge(tick, startAge);
  return currentAge < UNIVERSITY_END_AGE;
}

export function calculateWeeklyDebtAccumulation(
  tick: number,
  startAge: number,
  accumulatesDebt: boolean,
  currentDebt = 0,
): number {
  if (!accumulatesDebt) {
    return 0;
  }

  if (!isInUniversityPeriod(tick, startAge)) {
    return 0;
  }

  // Enforce hard cap on student debt accumulation
  if (currentDebt >= MAXIMUM_STUDENT_DEBT) {
    return 0;
  }

  const weeklyAmount = YEARLY_DEBT_ACCUMULATION / 52;
  // Don't exceed the cap
  return Math.min(weeklyAmount, MAXIMUM_STUDENT_DEBT - currentDebt);
}

export function calculateDebtInterest(debt: number, tick: number, startAge: number, hasMissedPayments = false): number {
  if (isInUniversityPeriod(tick, startAge)) {
    return 0;
  }

  if (debt <= 0) {
    return 0;
  }

  // Apply penalty rate if player has missed payments
  const weeklyRate = hasMissedPayments ? WEEKLY_PENALTY_INTEREST_RATE : WEEKLY_INTEREST_RATE;
  return debt * weeklyRate;
}

export function calculateMinimumDebtPayment(debt: number, tick: number, startAge: number): number {
  if (isInUniversityPeriod(tick, startAge)) {
    return 0;
  }

  if (debt <= 0) {
    return 0;
  }

  return Math.max(50, debt * MINIMUM_PAYMENT_RATE);
}

/**
 * Calculate the annual minimum debt payment required at year-end.
 * This is 10% of total debt, minimum $500.
 */
export function calculateAnnualMinimumPayment(debt: number, tick: number, startAge: number): number {
  if (isInUniversityPeriod(tick, startAge)) {
    return 0;
  }

  if (debt <= 0) {
    return 0;
  }

  return Math.max(500, debt * ANNUAL_MINIMUM_PAYMENT_RATE);
}

export function calculateDebtStressPenalty(debt: number, totalMissedPayments = 0): number {
  if (debt <= 0 && totalMissedPayments === 0) {
    return 0;
  }

  const debtStress = (debt / 10000) * DEBT_STRESS_MULTIPLIER;
  const missedPaymentStress = totalMissedPayments * MISSED_PAYMENT_STRESS_PENALTY;

  return debtStress + missedPaymentStress;
}

export function processWeeklyDebt(state: GameState): {
  newDebt: number;
  debtPayment: number;
  interestAccrued: number;
  stressPenalty: number;
} {
  const { tick, startAge } = state.meta;
  const { accumulatesDebt, totalMissedPayments } = state.flags;
  let debt = state.resources.debt;

  const accumulation = calculateWeeklyDebtAccumulation(tick, startAge, accumulatesDebt, debt);
  debt += accumulation;

  // Apply penalty interest rate if player has missed payments
  const hasMissedPaymentsFlag = totalMissedPayments > 0;
  const interestAccrued = calculateDebtInterest(debt, tick, startAge, hasMissedPaymentsFlag);
  debt += interestAccrued;

  const minimumPayment = calculateMinimumDebtPayment(debt, tick, startAge);

  const stressPenalty = calculateDebtStressPenalty(debt, totalMissedPayments);

  return {
    newDebt: debt,
    debtPayment: minimumPayment,
    interestAccrued,
    stressPenalty,
  };
}

export function makeDebtPayment(currentDebt: number, payment: number): number {
  const newDebt = Math.max(0, currentDebt - payment);
  return newDebt;
}

export function hasMissedPayment(money: number, minimumPayment: number): boolean {
  return money < minimumPayment && minimumPayment > 0;
}

export function getDebtStatusMessage(debt: number, tick: number, startAge: number): string {
  if (debt <= 0) {
    return 'DEBT FREE';
  }

  const isUniversity = isInUniversityPeriod(tick, startAge);

  if (isUniversity) {
    const yearsRemaining = UNIVERSITY_END_AGE - getCurrentAge(tick, startAge);
    return `Accumulating debt: $${debt.toLocaleString()} (${String(yearsRemaining)} years until repayment)`;
  }

  const minimumPayment = calculateMinimumDebtPayment(debt, tick, startAge);
  return `Debt: $${debt.toLocaleString()} | Min payment: $${minimumPayment.toFixed(0)}/week`;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANNUAL DEBT PROCESSING (Year-End)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Result of annual debt payment processing.
 */
export interface AnnualDebtResult {
  /** Updated debt after processing. */
  newDebt: number;

  /** Amount paid towards debt. */
  amountPaid: number;

  /** Whether the payment was missed. */
  missedPayment: boolean;

  /** Updated consecutive missed payment count. */
  newConsecutiveMissedPayments: number;

  /** Updated total missed payment count. */
  newTotalMissedPayments: number;

  /** Whether player is bankrupt due to missed payments. */
  isBankrupt: boolean;

  /** Message describing the result. */
  message: string;
}

/**
 * Process annual debt payment at year-end.
 * If player can afford the annual minimum payment, pay it.
 * If not, increment missed payment counters.
 * If 3 consecutive missed payments, trigger bankruptcy.
 */
export function processAnnualDebtPayment(
  debt: number,
  money: number,
  tick: number,
  startAge: number,
  consecutiveMissedPayments: number,
  totalMissedPayments: number,
): AnnualDebtResult {
  // No debt = no payment needed
  if (debt <= 0) {
    return {
      newDebt: 0,
      amountPaid: 0,
      missedPayment: false,
      newConsecutiveMissedPayments: 0,
      newTotalMissedPayments: totalMissedPayments,
      isBankrupt: false,
      message: 'No debt to pay.',
    };
  }

  // Still in university = no payment required
  if (isInUniversityPeriod(tick, startAge)) {
    return {
      newDebt: debt,
      amountPaid: 0,
      missedPayment: false,
      newConsecutiveMissedPayments: consecutiveMissedPayments,
      newTotalMissedPayments: totalMissedPayments,
      isBankrupt: false,
      message: 'Debt payments deferred during university.',
    };
  }

  const annualMinimum = calculateAnnualMinimumPayment(debt, tick, startAge);

  // Can player afford the payment?
  if (money >= annualMinimum) {
    // Payment made successfully
    const newDebt = makeDebtPayment(debt, annualMinimum);
    return {
      newDebt,
      amountPaid: annualMinimum,
      missedPayment: false,
      newConsecutiveMissedPayments: 0, // Reset consecutive counter on successful payment
      newTotalMissedPayments: totalMissedPayments,
      isBankrupt: false,
      message: `Paid $${annualMinimum.toLocaleString()} towards debt. Remaining: $${newDebt.toLocaleString()}.`,
    };
  }

  // Payment missed
  const newConsecutive = consecutiveMissedPayments + 1;
  const newTotal = totalMissedPayments + 1;

  // Check for bankruptcy (3 consecutive missed payments)
  if (newConsecutive >= BANKRUPTCY_MISSED_PAYMENT_THRESHOLD) {
    return {
      newDebt: debt,
      amountPaid: 0,
      missedPayment: true,
      newConsecutiveMissedPayments: newConsecutive,
      newTotalMissedPayments: newTotal,
      isBankrupt: true,
      message: `BANKRUPTCY! Missed ${String(newConsecutive)} consecutive annual debt payments. Collectors have come for everything.`,
    };
  }

  // Payment missed but not bankrupt yet
  const warningLevel = newConsecutive === 2 ? 'FINAL WARNING: ' : '';
  return {
    newDebt: debt,
    amountPaid: 0,
    missedPayment: true,
    newConsecutiveMissedPayments: newConsecutive,
    newTotalMissedPayments: newTotal,
    isBankrupt: false,
    message: `${warningLevel}Missed annual debt payment of $${annualMinimum.toLocaleString()}. (${String(newConsecutive)}/${String(BANKRUPTCY_MISSED_PAYMENT_THRESHOLD)} strikes)`,
  };
}

/**
 * Check if player should go bankrupt due to missed payments.
 */
export function shouldTriggerDebtBankruptcy(consecutiveMissedPayments: number): boolean {
  return consecutiveMissedPayments >= BANKRUPTCY_MISSED_PAYMENT_THRESHOLD;
}

/**
 * Get the bankruptcy threshold for missed payments.
 */
export function getMissedPaymentBankruptcyThreshold(): number {
  return BANKRUPTCY_MISSED_PAYMENT_THRESHOLD;
}
