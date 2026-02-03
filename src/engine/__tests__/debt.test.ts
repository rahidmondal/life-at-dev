import { describe, expect, it } from 'vitest';
import type { GameState } from '../../types/gamestate';
import {
  calculateDebtInterest,
  calculateDebtStressPenalty,
  calculateMinimumDebtPayment,
  calculateWeeklyDebtAccumulation,
  getCurrentAge,
  getDebtStatusMessage,
  hasMissedPayment,
  isInUniversityPeriod,
  makeDebtPayment,
  processWeeklyDebt,
} from '../debt';

function createTestState(
  overrides: Partial<{
    tick: number;
    startAge: number;
    debt: number;
    accumulatesDebt: boolean;
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
      streak: 0,
      cooldowns: {},
      accumulatesDebt: overrides.accumulatesDebt ?? false,
      startingPath: 'funded',
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
});
