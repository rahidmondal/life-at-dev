import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateContextHash(role: string, level: number, health: number, eventCount: number): string {
  const healthBucket = Math.round(health / 25) * 25;

  const eventBucket = Math.floor(eventCount / 5) * 5;

  return `${role}-lvl${level.toString()}-hp${healthBucket.toString()}-evt${eventBucket.toString()}`;
}

export function generateSummaryHash(
  path: string,
  level: number,
  score: number,
  reason?: string,
  isEasterEggWin?: boolean,
): string {
  const scoreBucket = Math.floor(score / 50) * 50;
  const outcome = isEasterEggWin ? 'easter' : (reason ?? 'unknown');

  return `summary-${path}-lvl${level.toString()}-score${scoreBucket.toString()}-${outcome}`;
}
