import { describe, expect, it } from 'vitest';
import type { ActiveBuff } from '../../types/resources';
import {
  applyEnergyBuffs,
  applyRecoveryBuffs,
  applySkillBuffs,
  applyStressBuffs,
  applyXPBuffs,
  calculateRecurringBuffCosts,
  countBuffsByCategory,
  getBuffSummary,
  getBuffsForStat,
  getCombinedFlatBonus,
  getCombinedMultiplier,
  hasAlreadyPurchased,
  removeUnaffordableRecurringBuffs,
} from '../buffs';

const createBuff = (overrides: Partial<ActiveBuff> = {}): ActiveBuff => ({
  sourceActionId: 'test_buff',
  stat: 'skill',
  type: 'multiplier',
  value: 1.1,
  description: 'Test buff',
  acquiredAt: 0,
  isRecurring: false,
  ...overrides,
});

describe('getBuffsForStat', () => {
  it('should filter buffs by stat', () => {
    const buffs: ActiveBuff[] = [
      createBuff({ stat: 'skill' }),
      createBuff({ stat: 'stress' }),
      createBuff({ stat: 'skill' }),
    ];

    const skillBuffs = getBuffsForStat(buffs, 'skill');
    expect(skillBuffs).toHaveLength(2);
  });

  it('should return empty array when no matching buffs', () => {
    const buffs: ActiveBuff[] = [createBuff({ stat: 'skill' })];

    const stressBuffs = getBuffsForStat(buffs, 'stress');
    expect(stressBuffs).toHaveLength(0);
  });
});

describe('getCombinedMultiplier', () => {
  it('should multiply all multiplier buffs together', () => {
    const buffs: ActiveBuff[] = [
      createBuff({ stat: 'skill', type: 'multiplier', value: 1.1 }),
      createBuff({ stat: 'skill', type: 'multiplier', value: 1.2 }),
    ];

    const result = getCombinedMultiplier(buffs, 'skill');
    expect(result).toBeCloseTo(1.32); // 1.1 * 1.2
  });

  it('should return 1.0 when no multiplier buffs', () => {
    const buffs: ActiveBuff[] = [createBuff({ stat: 'skill', type: 'flat', value: 5 })];

    const result = getCombinedMultiplier(buffs, 'skill');
    expect(result).toBe(1.0);
  });

  it('should ignore buffs for other stats', () => {
    const buffs: ActiveBuff[] = [
      createBuff({ stat: 'stress', type: 'multiplier', value: 0.9 }),
      createBuff({ stat: 'skill', type: 'multiplier', value: 1.15 }),
    ];

    const result = getCombinedMultiplier(buffs, 'skill');
    expect(result).toBe(1.15);
  });
});

describe('getCombinedFlatBonus', () => {
  it('should sum all flat bonuses', () => {
    const buffs: ActiveBuff[] = [
      createBuff({ stat: 'skill', type: 'flat', value: 5 }),
      createBuff({ stat: 'skill', type: 'flat', value: 10 }),
    ];

    const result = getCombinedFlatBonus(buffs, 'skill');
    expect(result).toBe(15);
  });

  it('should return 0 when no flat buffs', () => {
    const buffs: ActiveBuff[] = [createBuff({ stat: 'skill', type: 'multiplier', value: 1.1 })];

    const result = getCombinedFlatBonus(buffs, 'skill');
    expect(result).toBe(0);
  });
});

describe('applySkillBuffs', () => {
  it('should apply multiplier and flat bonuses', () => {
    const buffs: ActiveBuff[] = [
      createBuff({ stat: 'skill', type: 'multiplier', value: 1.5 }),
      createBuff({ stat: 'skill', type: 'flat', value: 10 }),
    ];

    // (100 * 1.5) + 10 = 160
    const result = applySkillBuffs(buffs, 100);
    expect(result).toBe(160);
  });

  it('should return base gain when no buffs', () => {
    const result = applySkillBuffs([], 100);
    expect(result).toBe(100);
  });
});

describe('applyStressBuffs', () => {
  it('should reduce stress gain with multiplier < 1', () => {
    const buffs: ActiveBuff[] = [createBuff({ stat: 'stress', type: 'multiplier', value: 0.8 })];

    // 20 stress * 0.8 = 16 stress
    const result = applyStressBuffs(buffs, 20);
    expect(result).toBe(16);
  });

  it('should not modify stress reduction (negative values)', () => {
    const buffs: ActiveBuff[] = [createBuff({ stat: 'stress', type: 'multiplier', value: 0.5 })];

    // Negative stress (recovery) should not be modified
    const result = applyStressBuffs(buffs, -10);
    expect(result).toBe(-10);
  });

  it('should not go below 0', () => {
    const buffs: ActiveBuff[] = [createBuff({ stat: 'stress', type: 'flat', value: -50 })];

    const result = applyStressBuffs(buffs, 10);
    expect(result).toBe(0);
  });
});

describe('applyEnergyBuffs', () => {
  it('should return total flat energy bonus', () => {
    const buffs: ActiveBuff[] = [
      createBuff({ stat: 'energy', type: 'flat', value: 15 }),
      createBuff({ stat: 'energy', type: 'flat', value: 10 }),
    ];

    const result = applyEnergyBuffs(buffs);
    expect(result).toBe(25);
  });
});

describe('applyRecoveryBuffs', () => {
  it('should boost recovery with multiplier', () => {
    const buffs: ActiveBuff[] = [createBuff({ stat: 'recovery', type: 'multiplier', value: 1.2 })];

    // 50 base recovery * 1.2 = 60
    const result = applyRecoveryBuffs(buffs, 50);
    expect(result).toBe(60);
  });
});

describe('applyXPBuffs', () => {
  it('should apply XP multiplier and flat bonus', () => {
    const buffs: ActiveBuff[] = [
      createBuff({ stat: 'xp', type: 'multiplier', value: 1.25 }),
      createBuff({ stat: 'xp', type: 'flat', value: 5 }),
    ];

    // (20 * 1.25) + 5 = 30
    const result = applyXPBuffs(buffs, 20);
    expect(result).toBe(30);
  });
});

describe('calculateRecurringBuffCosts', () => {
  it('should sum recurring buff costs', () => {
    const buffs: ActiveBuff[] = [
      createBuff({ isRecurring: true, weeklyCost: 50 }),
      createBuff({ isRecurring: true, weeklyCost: 100 }),
      createBuff({ isRecurring: false }),
    ];

    const result = calculateRecurringBuffCosts(buffs);
    expect(result).toBe(150);
  });
});

describe('removeUnaffordableRecurringBuffs', () => {
  it('should remove buffs when money is insufficient', () => {
    const buffs: ActiveBuff[] = [
      createBuff({ sourceActionId: 'cheap', isRecurring: true, weeklyCost: 50 }),
      createBuff({ sourceActionId: 'expensive', isRecurring: true, weeklyCost: 200 }),
    ];

    const result = removeUnaffordableRecurringBuffs(buffs, 100);

    expect(result.buffs).toHaveLength(1);
    expect(result.buffs[0].sourceActionId).toBe('cheap');
    expect(result.savedCost).toBe(200);
  });

  it('should keep all non-recurring buffs', () => {
    const buffs: ActiveBuff[] = [
      createBuff({ isRecurring: false }),
      createBuff({ isRecurring: true, weeklyCost: 1000 }),
    ];

    const result = removeUnaffordableRecurringBuffs(buffs, 0);

    expect(result.buffs).toHaveLength(1);
    expect(result.buffs[0].isRecurring).toBe(false);
  });
});

describe('hasAlreadyPurchased', () => {
  it('should return true if action is in purchased list', () => {
    const purchased = ['buy_keyboard', 'buy_chair'];

    expect(hasAlreadyPurchased(purchased, 'buy_keyboard')).toBe(true);
  });

  it('should return false if action is not purchased', () => {
    const purchased = ['buy_keyboard'];

    expect(hasAlreadyPurchased(purchased, 'upgrade_pc')).toBe(false);
  });
});

describe('getBuffSummary', () => {
  it('should format buff descriptions with icons', () => {
    const buffs: ActiveBuff[] = [
      createBuff({ description: 'Test buff 1', isRecurring: false }),
      createBuff({ description: 'Test buff 2', isRecurring: true }),
    ];

    const summary = getBuffSummary(buffs);

    expect(summary[0]).toBe('✓ Test buff 1');
    expect(summary[1]).toBe('🔄 Test buff 2');
  });
});

describe('countBuffsByCategory', () => {
  it('should count buffs by stat category', () => {
    const buffs: ActiveBuff[] = [
      createBuff({ stat: 'skill' }),
      createBuff({ stat: 'skill' }),
      createBuff({ stat: 'stress' }),
      createBuff({ stat: 'energy' }),
    ];

    const counts = countBuffsByCategory(buffs);

    expect(counts.skill).toBe(2);
    expect(counts.stress).toBe(1);
    expect(counts.energy).toBe(1);
    expect(counts.recovery).toBe(0);
    expect(counts.xp).toBe(0);
  });
});
