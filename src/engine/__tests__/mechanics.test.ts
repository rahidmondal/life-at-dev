import { describe, expect, it } from 'vitest';
import {
  calculateBurnoutRisk,
  calculateDecay,
  calculateDiminishingGrowth,
  calculateProjectedSkillChange,
} from '../mechanics';

describe('calculateDiminishingGrowth', () => {
  it('should return full gain when starting from zero skill', () => {
    const result = calculateDiminishingGrowth(0, 100);
    expect(result).toBe(100);
  });

  it('should apply diminishing returns at mid-skill', () => {
    const result = calculateDiminishingGrowth(5000, 100);
    expect(result).toBeCloseTo(66.67, 1);
  });

  it('should apply heavy diminishing returns near cap', () => {
    const result = calculateDiminishingGrowth(9000, 100);
    expect(result).toBeCloseTo(52.63, 1);
  });

  it('should cap growth close to 10000', () => {
    const result = calculateDiminishingGrowth(9950, 100);
    expect(result).toBe(50);
  });

  it('should return 0 when already at cap', () => {
    const result = calculateDiminishingGrowth(10000, 100);
    expect(result).toBe(0);
  });

  it('should handle small gains correctly', () => {
    const result = calculateDiminishingGrowth(1000, 10);
    expect(result).toBeCloseTo(9.09, 1);
  });

  it('should handle large gains correctly', () => {
    const result = calculateDiminishingGrowth(100, 500);
    expect(result).toBeCloseTo(495.05, 1);
  });

  it('should show growth rate decreases as skill increases', () => {
    const gain = 100;
    const skill0 = calculateDiminishingGrowth(0, gain);
    const skill2500 = calculateDiminishingGrowth(2500, gain);
    const skill5000 = calculateDiminishingGrowth(5000, gain);
    const skill7500 = calculateDiminishingGrowth(7500, gain);

    expect(skill0).toBeGreaterThan(skill2500);
    expect(skill2500).toBeGreaterThan(skill5000);
    expect(skill5000).toBeGreaterThan(skill7500);
  });
});

describe('calculateDecay', () => {
  it('should apply no decay when role displacement is zero (fully hands-on)', () => {
    const result = calculateDecay(1000, 0);
    expect(result).toBe(0);
  });

  it('should apply partial decay with moderate role displacement', () => {
    const result = calculateDecay(1000, 0.5);
    expect(result).toBe(3.75);
  });

  it('should apply higher decay for senior roles', () => {
    const result = calculateDecay(1000, 0.75);
    expect(result).toBe(5.625);
  });

  it('should apply maximum decay at full role displacement', () => {
    const result = calculateDecay(1000, 1);
    expect(result).toBe(7.5);
  });

  it('should scale linearly with core skill', () => {
    const lowSkill = calculateDecay(1000, 1);
    const highSkill = calculateDecay(5000, 1);

    expect(highSkill).toBe(37.5);
    expect(highSkill).toBe(lowSkill * 5);
  });

  it('should return zero decay when core skill is zero', () => {
    const result = calculateDecay(0, 1);
    expect(result).toBe(0);
  });

  it('should show that higher roles lose skill faster', () => {
    const junior = calculateDecay(2000, 0.2);
    const senior = calculateDecay(2000, 0.8);

    expect(senior).toBeGreaterThan(junior);
  });
});

describe('calculateBurnoutRisk', () => {
  it('should return false when stress is high but below burnout threshold', () => {
    expect(calculateBurnoutRisk(95, 5)).toBe(false);
  });

  it('should return false when energy is low but stress is insufficient', () => {
    expect(calculateBurnoutRisk(80, 5)).toBe(false);
  });

  it('should return false when energy is exactly at threshold', () => {
    expect(calculateBurnoutRisk(96, 10)).toBe(false);
  });

  it('should return false when stress is exactly at threshold', () => {
    expect(calculateBurnoutRisk(95, 5)).toBe(false);
  });

  it('should return true when stress exceeds 95 and energy is below 10', () => {
    expect(calculateBurnoutRisk(96, 9)).toBe(true);
  });

  it('should return true at extreme burnout conditions', () => {
    expect(calculateBurnoutRisk(100, 0)).toBe(true);
  });

  it('should return false in safe conditions', () => {
    expect(calculateBurnoutRisk(50, 50)).toBe(false);
  });

  it('should correctly evaluate boundary combinations', () => {
    expect(calculateBurnoutRisk(96, 10)).toBe(false);
    expect(calculateBurnoutRisk(95, 9)).toBe(false);
    expect(calculateBurnoutRisk(96, 9)).toBe(true);
  });
});

describe('calculateProjectedSkillChange', () => {
  it('returns positive change when gain > decay', () => {
    // Skill 500, Gain 5, Decay ~1.125. Net > 0.
    // Gain: 5 * (10000/10500) = 4.76
    // Decay: 500 * 0.0075 * 0.3 = 1.125
    // Net: 3.64
    const change = calculateProjectedSkillChange(500, 0.3, 5);
    expect(change).toBeGreaterThan(0);
    expect(change).toBeCloseTo(3.64, 1);
  });

  it('returns negative change when decay > gain', () => {
    // Skill 5000, Gain 5, Decay 11.25. Net < 0.
    // Gain: 5 * (10000/15000) = 3.33
    // Decay: 5000 * 0.0075 * 0.3 = 11.25
    // Net: -7.92
    const change = calculateProjectedSkillChange(5000, 0.3, 5);
    expect(change).toBeLessThan(0);
    expect(change).toBeGreaterThan(-8);
    expect(change).toBeLessThan(-7.9);
  });
});
