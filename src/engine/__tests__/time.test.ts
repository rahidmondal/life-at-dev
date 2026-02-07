import { describe, expect, it } from 'vitest';
import type { GameMeta } from '../../types/gamestate';
import { advanceTime, calculateResourceDelta, getDateFromTick, isYearEnd } from '../time';

describe('advanceTime', () => {
  const baseMeta: GameMeta = {
    tick: 0,
    version: '2.0.0',
    startAge: 18,
    playerName: 'TestPlayer',
  };

  it('should advance time by the specified number of weeks', () => {
    const result = advanceTime(baseMeta, 5);
    expect(result.tick).toBe(5);
  });

  it('should not mutate the original meta object', () => {
    const original = { ...baseMeta, tick: 10 };
    const result = advanceTime(original, 3);

    expect(original.tick).toBe(10);
    expect(result.tick).toBe(13);
    expect(result).not.toBe(original);
  });

  it('should handle advancing by zero weeks', () => {
    const result = advanceTime(baseMeta, 0);
    expect(result.tick).toBe(0);
  });

  it('should handle advancing multiple times', () => {
    let meta = baseMeta;
    meta = advanceTime(meta, 10);
    meta = advanceTime(meta, 20);
    meta = advanceTime(meta, 5);
    expect(meta.tick).toBe(35);
  });

  it('should throw error when weeks is negative', () => {
    expect(() => advanceTime(baseMeta, -5)).toThrow('Cannot advance time by negative weeks');
  });

  it('should preserve other meta properties', () => {
    const result = advanceTime(baseMeta, 1);
    expect(result.version).toBe('2.0.0');
  });
});

describe('getDateFromTick', () => {
  it('should return Year 1, Week 1 for tick 0', () => {
    const result = getDateFromTick(0);
    expect(result).toEqual({ year: 1, week: 1 });
  });

  it('should return Year 1, Week 52 for tick 51', () => {
    const result = getDateFromTick(51);
    expect(result).toEqual({ year: 1, week: 52 });
  });

  it('should return Year 2, Week 1 for tick 52', () => {
    const result = getDateFromTick(52);
    expect(result).toEqual({ year: 2, week: 1 });
  });

  it('should return Year 2, Week 52 for tick 103', () => {
    const result = getDateFromTick(103);
    expect(result).toEqual({ year: 2, week: 52 });
  });

  it('should return Year 3, Week 1 for tick 104', () => {
    const result = getDateFromTick(104);
    expect(result).toEqual({ year: 3, week: 1 });
  });

  it('should handle mid-year correctly', () => {
    const result = getDateFromTick(25);
    expect(result).toEqual({ year: 1, week: 26 });
  });

  it('should handle large tick values correctly', () => {
    const result = getDateFromTick(520);
    expect(result).toEqual({ year: 11, week: 1 });
  });

  it('should handle Year 5, Week 30 correctly', () => {
    const tick = 4 * 52 + 29;
    const result = getDateFromTick(tick);
    expect(result).toEqual({ year: 5, week: 30 });
  });
});

describe('isYearEnd', () => {
  it('should return false for Week 50 (tick 49)', () => {
    expect(isYearEnd(49)).toBe(false);
  });

  it('should return false for Week 51 (tick 50)', () => {
    expect(isYearEnd(50)).toBe(false);
  });

  it('should return true for Week 52 (tick 51)', () => {
    expect(isYearEnd(51)).toBe(true);
  });

  it('should return true for Year 2, Week 52 (tick 103)', () => {
    expect(isYearEnd(103)).toBe(true);
  });

  it('should return false for Year 2, Week 1 (tick 52)', () => {
    expect(isYearEnd(52)).toBe(false);
  });

  it('should return false for Week 1 (tick 0)', () => {
    expect(isYearEnd(0)).toBe(false);
  });

  it('should return true for Year 10, Week 52 (tick 519)', () => {
    expect(isYearEnd(519)).toBe(true);
  });

  it('should work correctly across multiple years', () => {
    expect(isYearEnd(51)).toBe(true); // Y1 W52
    expect(isYearEnd(103)).toBe(true); // Y2 W52
    expect(isYearEnd(155)).toBe(true); // Y3 W52
    expect(isYearEnd(207)).toBe(true); // Y4 W52
  });
});

describe('calculateResourceDelta', () => {
  it('should add positive delta correctly', () => {
    const result = calculateResourceDelta(50, 20, 0, 100);
    expect(result).toBe(70);
  });

  it('should subtract negative delta correctly', () => {
    const result = calculateResourceDelta(50, -20, 0, 100);
    expect(result).toBe(30);
  });

  it('should clamp at maximum value', () => {
    const result = calculateResourceDelta(90, 20, 0, 100);
    expect(result).toBe(100);
  });

  it('should clamp at minimum value', () => {
    const result = calculateResourceDelta(10, -20, 0, 100);
    expect(result).toBe(0);
  });

  it('should handle zero delta', () => {
    const result = calculateResourceDelta(50, 0, 0, 100);
    expect(result).toBe(50);
  });

  it('should handle starting at maximum', () => {
    const result = calculateResourceDelta(100, 10, 0, 100);
    expect(result).toBe(100);
  });

  it('should handle starting at minimum', () => {
    const result = calculateResourceDelta(0, -10, 0, 100);
    expect(result).toBe(0);
  });

  it('should work with custom ranges', () => {
    const result = calculateResourceDelta(50, 10, 0, 80);
    expect(result).toBe(60);
  });

  it('should clamp at custom maximum', () => {
    const result = calculateResourceDelta(75, 20, 0, 80);
    expect(result).toBe(80);
  });

  it('should clamp at custom minimum', () => {
    const result = calculateResourceDelta(15, -20, 10, 100);
    expect(result).toBe(10);
  });

  it('should handle energy recovery scenario (20 -> 70)', () => {
    const result = calculateResourceDelta(20, 50, 0, 100);
    expect(result).toBe(70);
  });

  it('should handle stress increase scenario (30 -> 60)', () => {
    const result = calculateResourceDelta(30, 30, 0, 100);
    expect(result).toBe(60);
  });

  it('should handle extreme depletion clamping', () => {
    const result = calculateResourceDelta(5, -100, 0, 100);
    expect(result).toBe(0);
  });

  it('should handle extreme overflow clamping', () => {
    const result = calculateResourceDelta(95, 100, 0, 100);
    expect(result).toBe(100);
  });
});
