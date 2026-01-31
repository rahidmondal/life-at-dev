import type { GameMeta } from '../types/gamestate';

const WEEKS_PER_YEAR = 52;
const STARTING_YEAR = 1;

export function advanceTime(meta: GameMeta, weeks: number): GameMeta {
  if (weeks < 0) {
    throw new Error('Cannot advance time by negative weeks');
  }

  return {
    ...meta,
    tick: meta.tick + weeks,
  };
}

export function getDateFromTick(tick: number): { year: number; week: number } {
  const year = Math.floor(tick / WEEKS_PER_YEAR) + STARTING_YEAR;
  const week = (tick % WEEKS_PER_YEAR) + 1;

  return { year, week };
}

export function isYearEnd(tick: number): boolean {
  return tick % WEEKS_PER_YEAR === WEEKS_PER_YEAR - 1;
}

export function calculateResourceDelta(current: number, delta: number, min: number, max: number): number {
  const next = current + delta;
  return Math.max(min, Math.min(max, next));
}
