import type { GameState } from '../types/gamestate';

const YEARLY_DEBT_ACCUMULATION = 10000;

const ANNUAL_INTEREST_RATE = 0.05;

const WEEKLY_INTEREST_RATE = ANNUAL_INTEREST_RATE / 52;

const MINIMUM_PAYMENT_RATE = 0.02;

const UNIVERSITY_END_AGE = 22;

const DEBT_STRESS_MULTIPLIER = 0.5;

export function getCurrentAge(tick: number, startAge: number): number {
  const yearsElapsed = Math.floor(tick / 52);
  return startAge + yearsElapsed;
}

export function isInUniversityPeriod(tick: number, startAge: number): boolean {
  const currentAge = getCurrentAge(tick, startAge);
  return currentAge < UNIVERSITY_END_AGE;
}

export function calculateWeeklyDebtAccumulation(tick: number, startAge: number, accumulatesDebt: boolean): number {
  if (!accumulatesDebt) {
    return 0;
  }

  if (!isInUniversityPeriod(tick, startAge)) {
    return 0;
  }

  return YEARLY_DEBT_ACCUMULATION / 52;
}

export function calculateDebtInterest(debt: number, tick: number, startAge: number): number {
  if (isInUniversityPeriod(tick, startAge)) {
    return 0;
  }

  if (debt <= 0) {
    return 0;
  }

  return debt * WEEKLY_INTEREST_RATE;
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

export function calculateDebtStressPenalty(debt: number): number {
  if (debt <= 0) {
    return 0;
  }

  return (debt / 10000) * DEBT_STRESS_MULTIPLIER;
}

export function processWeeklyDebt(state: GameState): {
  newDebt: number;
  debtPayment: number;
  interestAccrued: number;
  stressPenalty: number;
} {
  const { tick, startAge } = state.meta;
  const { accumulatesDebt } = state.flags;
  let debt = state.resources.debt;

  const accumulation = calculateWeeklyDebtAccumulation(tick, startAge, accumulatesDebt);
  debt += accumulation;

  const interestAccrued = calculateDebtInterest(debt, tick, startAge);
  debt += interestAccrued;

  const minimumPayment = calculateMinimumDebtPayment(debt, tick, startAge);

  const stressPenalty = calculateDebtStressPenalty(debt);

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
