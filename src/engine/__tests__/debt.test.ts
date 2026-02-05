import { describe, expect, it } from 'vitest';
import type { GameState } from '../../types/gamestate';
import {
  calculateAnnualMinimumPayment,
  calculateDebtInterest,
  calculateDebtStressPenalty,
  calculateMinimumDebtPayment,
  calculateWeeklyDebtAccumulation,
  getCurrentAge,
  getDebtStatusMessage,
  getMissedPaymentBankruptcyThreshold,
  hasMissedPayment,
  isInUniversityPeriod,
  makeDebtPayment,
  processAnnualDebtPayment,
  processWeeklyDebt,
  shouldTriggerDebtBankruptcy,
} from '../debt';

function createTestState(
  overrides: Partial<{
    tick: number;
    startAge: number;
    debt: number;
    accumulatesDebt: boolean;
    consecutiveMissedPayments: number;
    totalMissedPayments: number;
  }>,
): GameState {
  return {
    meta: {
      version: '2.0.0',
      tick: overrides.tick ?? 0,
      startAge: overrides.startAge ?? 18,
      playerName: 'TestPlayer',
    },
    resources: {
      money: 0,
      debt: overrides.debt ?? 0,
      stress: 0,
      energy: 100,
      fulfillment: 0,
    },
    stats: {
      skills: { coding: 0, politics: 0 },
      xp: { corporate: 0, freelance: 0, reputation: 0 },
    },
    career: {
      currentJobId: 'unemployed',
      jobStartTick: 0,
      jobHistory: [],
    },
    flags: {
      isBurnedOut: false,
      isBankrupt: false,
      consecutiveMissedPayments: overrides.consecutiveMissedPayments ?? 0,
      totalMissedPayments: overrides.totalMissedPayments ?? 0,
      streak: 0,
      cooldowns: {},
      accumulatesDebt: overrides.accumulatesDebt ?? false,
      startingPath: 'funded',
      isScholar: false,
      scholarYearsRemaining: 0,
      hasGraduated: false,
    },
    eventLog: [],
  };
}

describe('Debt Mechanics', () => {
  describe('getCurrentAge', () => {
    it('should return startAge at tick 0', () => {
      expect(getCurrentAge(0, 18)).toBe(18);
    });

    it('should add 1 year after 52 weeks', () => {
      expect(getCurrentAge(52, 18)).toBe(19);
    });

    it('should calculate age correctly over multiple years', () => {
      expect(getCurrentAge(104, 18)).toBe(20);
      expect(getCurrentAge(208, 18)).toBe(22);
    });

    it('should work with different start ages', () => {
      expect(getCurrentAge(52, 22)).toBe(23);
    });
  });

  describe('isInUniversityPeriod', () => {
    it('should return true for age < 22', () => {
      expect(isInUniversityPeriod(0, 18)).toBe(true);
      expect(isInUniversityPeriod(51, 18)).toBe(true);
      expect(isInUniversityPeriod(103, 18)).toBe(true);
      expect(isInUniversityPeriod(155, 18)).toBe(true);
      expect(isInUniversityPeriod(207, 18)).toBe(true);
    });

    it('should return false for age >= 22', () => {
      expect(isInUniversityPeriod(208, 18)).toBe(false);
      expect(isInUniversityPeriod(260, 18)).toBe(false);
    });

    it('should return false when starting at age 22', () => {
      expect(isInUniversityPeriod(0, 22)).toBe(false);
    });
  });

  describe('calculateWeeklyDebtAccumulation', () => {
    it('should return ~$192.31/week during university with accumulatesDebt true', () => {
      const weeklyDebt = calculateWeeklyDebtAccumulation(0, 18, true);
      expect(weeklyDebt).toBeCloseTo(10000 / 52, 2);
    });

    it('should return 0 after university ends', () => {
      expect(calculateWeeklyDebtAccumulation(208, 18, true)).toBe(0);
    });

    it('should return 0 if accumulatesDebt is false', () => {
      expect(calculateWeeklyDebtAccumulation(0, 18, false)).toBe(0);
    });

    it('should return 0 for scholar path starting at 22', () => {
      expect(calculateWeeklyDebtAccumulation(0, 22, true)).toBe(0);
    });
  });

  describe('calculateDebtInterest', () => {
    it('should return 0 during university', () => {
      expect(calculateDebtInterest(10000, 0, 18)).toBe(0);
    });

    it('should calculate weekly interest after university', () => {
      const weeklyInterest = calculateDebtInterest(10000, 208, 18);
      expect(weeklyInterest).toBeCloseTo(10000 * (0.05 / 52), 2);
    });

    it('should return 0 for no debt', () => {
      expect(calculateDebtInterest(0, 208, 18)).toBe(0);
    });
  });

  describe('calculateMinimumDebtPayment', () => {
    it('should return 0 during university', () => {
      expect(calculateMinimumDebtPayment(40000, 0, 18)).toBe(0);
    });

    it('should return at least $50 after university', () => {
      expect(calculateMinimumDebtPayment(1000, 208, 18)).toBe(50);
    });

    it('should return 2% for large debts', () => {
      expect(calculateMinimumDebtPayment(40000, 208, 18)).toBe(800);
    });

    it('should return 0 for no debt', () => {
      expect(calculateMinimumDebtPayment(0, 208, 18)).toBe(0);
    });
  });

  describe('calculateDebtStressPenalty', () => {
    it('should return 0 for no debt', () => {
      expect(calculateDebtStressPenalty(0)).toBe(0);
    });

    it('should return 0.5 stress per $10k debt', () => {
      expect(calculateDebtStressPenalty(10000)).toBe(0.5);
      expect(calculateDebtStressPenalty(40000)).toBe(2);
    });
  });

  describe('processWeeklyDebt', () => {
    it('should accumulate debt during university for funded path', () => {
      const state = createTestState({ tick: 0, startAge: 18, debt: 0, accumulatesDebt: true });
      const result = processWeeklyDebt(state);

      expect(result.newDebt).toBeGreaterThan(0);
      expect(result.debtPayment).toBe(0);
      expect(result.interestAccrued).toBe(0);
    });

    it('should not accumulate debt for scholar path', () => {
      const state = createTestState({ tick: 0, startAge: 22, debt: 0, accumulatesDebt: false });
      const result = processWeeklyDebt(state);

      expect(result.newDebt).toBe(0);
    });

    it('should accrue interest and require payment after university', () => {
      const state = createTestState({ tick: 208, startAge: 18, debt: 40000, accumulatesDebt: true });
      const result = processWeeklyDebt(state);

      expect(result.interestAccrued).toBeGreaterThan(0);
      expect(result.debtPayment).toBeGreaterThan(0);
      expect(result.stressPenalty).toBeGreaterThan(0);
    });

    it('should accumulate ~$40k debt over 4 years', () => {
      let state = createTestState({ tick: 0, startAge: 18, debt: 0, accumulatesDebt: true });
      let totalDebt = 0;

      for (let week = 0; week < 208; week++) {
        state = { ...state, meta: { ...state.meta, tick: week }, resources: { ...state.resources, debt: totalDebt } };
        const result = processWeeklyDebt(state);
        totalDebt = result.newDebt;
      }

      expect(totalDebt).toBeCloseTo(40000, -2);
    });
  });

  describe('makeDebtPayment', () => {
    it('should reduce debt by payment amount', () => {
      expect(makeDebtPayment(40000, 800)).toBe(39200);
    });

    it('should not go below 0', () => {
      expect(makeDebtPayment(500, 800)).toBe(0);
    });
  });

  describe('hasMissedPayment', () => {
    it('should return true if money < minimum payment', () => {
      expect(hasMissedPayment(100, 800)).toBe(true);
    });

    it('should return false if money >= minimum payment', () => {
      expect(hasMissedPayment(1000, 800)).toBe(false);
    });

    it('should return false if no payment required', () => {
      expect(hasMissedPayment(0, 0)).toBe(false);
    });
  });

  describe('getDebtStatusMessage', () => {
    it('should return "DEBT FREE" for no debt', () => {
      expect(getDebtStatusMessage(0, 208, 18)).toBe('DEBT FREE');
    });

    it('should show accumulating message during university', () => {
      const message = getDebtStatusMessage(10000, 0, 18);
      expect(message).toContain('Accumulating');
      expect(message).toContain('$10,000');
    });

    it('should show debt and minimum payment after university', () => {
      const message = getDebtStatusMessage(40000, 208, 18);
      expect(message).toContain('$40,000');
      expect(message).toContain('Min payment');
    });
  });

  describe('calculateAnnualMinimumPayment', () => {
    it('returns 0 during university period', () => {
      expect(calculateAnnualMinimumPayment(10000, 0, 18)).toBe(0);
    });

    it('returns 0 for no debt', () => {
      expect(calculateAnnualMinimumPayment(0, 208, 18)).toBe(0);
    });

    it('returns 10% of debt for normal amounts', () => {
      expect(calculateAnnualMinimumPayment(10000, 208, 18)).toBe(1000);
    });

    it('returns minimum of $500 for small debts', () => {
      expect(calculateAnnualMinimumPayment(1000, 208, 18)).toBe(500);
    });
  });

  describe('processAnnualDebtPayment', () => {
    it('returns no payment needed when debt is 0', () => {
      const result = processAnnualDebtPayment(0, 5000, 208, 18, 0, 0);
      expect(result.amountPaid).toBe(0);
      expect(result.missedPayment).toBe(false);
      expect(result.isBankrupt).toBe(false);
    });

    it('defers payment during university', () => {
      const result = processAnnualDebtPayment(10000, 0, 0, 18, 0, 0);
      expect(result.amountPaid).toBe(0);
      expect(result.missedPayment).toBe(false);
      expect(result.message).toContain('deferred');
    });

    it('pays debt when player has enough money', () => {
      const result = processAnnualDebtPayment(10000, 5000, 208, 18, 0, 0);
      // 10% of 10000 = 1000
      expect(result.amountPaid).toBe(1000);
      expect(result.newDebt).toBe(9000);
      expect(result.missedPayment).toBe(false);
      expect(result.newConsecutiveMissedPayments).toBe(0);
    });

    it('resets consecutive count on successful payment', () => {
      const result = processAnnualDebtPayment(10000, 5000, 208, 18, 2, 5);
      expect(result.newConsecutiveMissedPayments).toBe(0);
      expect(result.newTotalMissedPayments).toBe(5); // Total stays the same
    });

    it('increments missed payment counters when unable to pay', () => {
      const result = processAnnualDebtPayment(10000, 100, 208, 18, 0, 0);
      expect(result.missedPayment).toBe(true);
      expect(result.newConsecutiveMissedPayments).toBe(1);
      expect(result.newTotalMissedPayments).toBe(1);
    });

    it('triggers bankruptcy after 3 consecutive missed payments', () => {
      const result = processAnnualDebtPayment(10000, 100, 208, 18, 2, 5);
      expect(result.isBankrupt).toBe(true);
      expect(result.newConsecutiveMissedPayments).toBe(3);
      expect(result.message).toContain('BANKRUPTCY');
    });

    it('shows final warning at 2 consecutive missed payments', () => {
      const result = processAnnualDebtPayment(10000, 100, 208, 18, 1, 3);
      expect(result.isBankrupt).toBe(false);
      expect(result.newConsecutiveMissedPayments).toBe(2);
      expect(result.message).toContain('FINAL WARNING');
    });
  });

  describe('shouldTriggerDebtBankruptcy', () => {
    it('returns false for less than 3 missed payments', () => {
      expect(shouldTriggerDebtBankruptcy(0)).toBe(false);
      expect(shouldTriggerDebtBankruptcy(1)).toBe(false);
      expect(shouldTriggerDebtBankruptcy(2)).toBe(false);
    });

    it('returns true for 3 or more missed payments', () => {
      expect(shouldTriggerDebtBankruptcy(3)).toBe(true);
      expect(shouldTriggerDebtBankruptcy(5)).toBe(true);
    });
  });

  describe('getMissedPaymentBankruptcyThreshold', () => {
    it('returns 3', () => {
      expect(getMissedPaymentBankruptcyThreshold()).toBe(3);
    });
  });

  describe('calculateDebtInterest with penalty rate', () => {
    it('applies higher interest rate when hasMissedPayments is true', () => {
      const normalInterest = calculateDebtInterest(40000, 208, 18, false);
      const penaltyInterest = calculateDebtInterest(40000, 208, 18, true);

      // Penalty rate (8%) should be higher than normal rate (5%)
      expect(penaltyInterest).toBeGreaterThan(normalInterest);
      // Penalty should be ~60% higher (8/5 = 1.6)
      expect(penaltyInterest / normalInterest).toBeCloseTo(1.6, 1);
    });
  });

  describe('calculateDebtStressPenalty with missed payments', () => {
    it('adds extra stress for missed payments', () => {
      const noMissedStress = calculateDebtStressPenalty(40000, 0);
      const withMissedStress = calculateDebtStressPenalty(40000, 2);

      // Should have 2 extra stress per missed payment
      expect(withMissedStress - noMissedStress).toBe(4); // 2 * 2
    });

    it('returns stress even with 0 debt if missed payments exist', () => {
      expect(calculateDebtStressPenalty(0, 3)).toBe(6); // 3 * 2
    });
  });

  describe('processWeeklyDebt with missed payments history', () => {
    it('applies penalty interest rate for players with missed payments', () => {
      const stateNoHistory = createTestState({
        tick: 208,
        debt: 40000,
        totalMissedPayments: 0,
      });

      const stateWithHistory = createTestState({
        tick: 208,
        debt: 40000,
        totalMissedPayments: 2,
      });

      const resultNoHistory = processWeeklyDebt(stateNoHistory);
      const resultWithHistory = processWeeklyDebt(stateWithHistory);

      expect(resultWithHistory.interestAccrued).toBeGreaterThan(resultNoHistory.interestAccrued);
    });

    it('includes missed payment stress penalty', () => {
      const stateWithHistory = createTestState({
        tick: 208,
        debt: 40000,
        totalMissedPayments: 3,
      });

      const result = processWeeklyDebt(stateWithHistory);

      // Base debt stress + missed payment penalty
      expect(result.stressPenalty).toBeGreaterThan(2); // Just debt stress would be 2
    });
  });
});
