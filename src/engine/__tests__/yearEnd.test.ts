import { describe, expect, it } from 'vitest';
import { INITIAL_GAME_STATE } from '../../store/initialState';
import type { GameState } from '../../types/gamestate';
import {
  calculateBankruptcyThreshold,
  calculateYearlyRent,
  getCurrentYear,
  isYearEnd,
  processYearEnd,
} from '../yearEnd';

function createMockState(
  overrides: Partial<{
    money: number;
    debt: number;
    jobId: string;
    tick: number;
  }>,
): GameState {
  return {
    ...INITIAL_GAME_STATE,
    meta: {
      ...INITIAL_GAME_STATE.meta,
      tick: overrides.tick ?? 51, // Just before year-end
    },
    resources: {
      ...INITIAL_GAME_STATE.resources,
      money: overrides.money ?? 0,
      debt: overrides.debt ?? 0,
    },
    career: {
      ...INITIAL_GAME_STATE.career,
      currentJobId: overrides.jobId ?? 'corp_junior',
    },
  };
}

describe('calculateYearlyRent', () => {
  it('returns 0 for unemployed', () => {
    expect(calculateYearlyRent('unemployed')).toBe(0);
  });

  it('calculates rent as percentage of salary for corporate jobs', () => {
    // corp_junior has salary 41600 and rentRate 0.35
    const rent = calculateYearlyRent('corp_junior');
    expect(rent).toBe(Math.round(41600 * 0.35));
  });

  it('returns fixed rent for hustler jobs', () => {
    // hustle_freelancer has rentRate 0, so should return fixed rent
    const rent = calculateYearlyRent('hustle_freelancer');
    expect(rent).toBe(12000); // HUSTLER_FIXED_RENT
  });

  it('returns 0 for unknown job', () => {
    expect(calculateYearlyRent('nonexistent_job')).toBe(0);
  });
});

describe('calculateBankruptcyThreshold', () => {
  it('returns minimum threshold for low salaries', () => {
    expect(calculateBankruptcyThreshold(0)).toBe(5000);
    expect(calculateBankruptcyThreshold(5000)).toBe(5000);
  });

  it('returns 50% of salary for higher salaries', () => {
    expect(calculateBankruptcyThreshold(100000)).toBe(50000);
    expect(calculateBankruptcyThreshold(200000)).toBe(100000);
  });
});

describe('processYearEnd', () => {
  it('adds salary and deducts rent', () => {
    const state = createMockState({ money: 1000, jobId: 'corp_junior' });
    const result = processYearEnd(state);

    // corp_junior: salary 41600, rentRate 0.35 -> rent 14560
    const expectedSalary = 41600;
    const expectedRent = Math.round(41600 * 0.35);
    const expectedNet = expectedSalary - expectedRent;

    expect(result.summary.salaryEarned).toBe(expectedSalary);
    expect(result.summary.rentPaid).toBe(expectedRent);
    expect(result.summary.netIncome).toBe(expectedNet);
    expect(result.newState.resources.money).toBe(1000 + expectedNet);
    expect(result.isBankrupt).toBe(false);
  });

  it('converts deficit to debt when money goes slightly negative', () => {
    // Start with a bit negative but within threshold
    const negativeState = createMockState({ money: -1000, jobId: 'corp_intern' });
    // corp_intern: salary 5200, rentRate 0.50 -> rent 2600
    // Net: 5200 - 2600 = 2600
    // Final: -1000 + 2600 = 1600 (positive)
    const result = processYearEnd(negativeState);

    expect(result.newState.resources.money).toBe(1600);
    expect(result.isBankrupt).toBe(false);
  });

  it('triggers bankruptcy when money goes too negative', () => {
    // Start very negative to trigger bankruptcy
    const state = createMockState({ money: -10000, jobId: 'corp_intern' });
    // corp_intern: salary 5200, rentRate 0.50 -> rent 2600
    // Net: 5200 - 2600 = 2600
    // Final money: -10000 + 2600 = -7400
    // Threshold: max(5000, 5200 * 0.5) = 5000
    // -7400 < -5000 -> BANKRUPTCY

    const result = processYearEnd(state);
    expect(result.isBankrupt).toBe(true);
    expect(result.summary.message).toContain('BANKRUPTCY');
  });

  it('handles hustler jobs with fixed rent', () => {
    const state = createMockState({ money: 5000, jobId: 'hustle_freelancer' });
    // hustle_freelancer: salary 0, fixed rent 12000
    // Net: 0 - 12000 = -12000
    // Final money: 5000 - 12000 = -7000

    const result = processYearEnd(state);
    // Threshold for salary 0 is 5000
    // -7000 < -5000 -> BANKRUPTCY
    expect(result.isBankrupt).toBe(true);
  });

  it('converts deficit to debt when within threshold', () => {
    const state = createMockState({ money: 10000, jobId: 'hustle_freelancer' });
    // hustle_freelancer: salary 0, fixed rent 12000
    // Net: 0 - 12000 = -12000
    // Final money: 10000 - 12000 = -2000
    // Threshold: 5000
    // -2000 > -5000 -> Convert 2000 to debt

    const result = processYearEnd(state);
    expect(result.isBankrupt).toBe(false);
    expect(result.summary.debtIncurred).toBe(2000);
    expect(result.newState.resources.money).toBe(0);
    expect(result.newState.resources.debt).toBe(2000);
  });
});

describe('getCurrentYear', () => {
  it('calculates year from tick', () => {
    expect(getCurrentYear(0)).toBe(1);
    expect(getCurrentYear(51)).toBe(1);
    expect(getCurrentYear(52)).toBe(2);
    expect(getCurrentYear(103)).toBe(2);
    expect(getCurrentYear(104)).toBe(3);
  });
});

describe('isYearEnd', () => {
  it('returns true for year-end ticks', () => {
    expect(isYearEnd(51)).toBe(true); // End of year 1
    expect(isYearEnd(103)).toBe(true); // End of year 2
    expect(isYearEnd(155)).toBe(true); // End of year 3
  });

  it('returns false for non-year-end ticks', () => {
    expect(isYearEnd(0)).toBe(false);
    expect(isYearEnd(50)).toBe(false);
    expect(isYearEnd(52)).toBe(false);
    expect(isYearEnd(100)).toBe(false);
  });
});
