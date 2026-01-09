import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a context hash for caching AI responses
 * Buckets similar game states together to increase cache hit rates
 *
 * @param role - Career path (corporate, ic, management, etc.)
 * @param level - Career level (1-4)
 * @param health - Current energy level (0-100)
 * @param eventCount - Number of events experienced
 * @returns Hash string for cache lookup
 */
export function generateContextHash(role: string, level: number, health: number, eventCount: number): string {
  // Bucket health to nearest 25 (0, 25, 50, 75, 100)
  const healthBucket = Math.round(health / 25) * 25;

  // Bucket event count to groups of 5 (0-5, 6-10, 11-15, etc.)
  const eventBucket = Math.floor(eventCount / 5) * 5;

  // Create a deterministic hash that groups similar game states
  return `${role}-lvl${level.toString()}-hp${healthBucket.toString()}-evt${eventBucket.toString()}`;
}

/**
 * Generates a context hash for caching summary responses
 * Groups similar end-game states for efficient cache hits
 *
 * @param path - Career path (corporate, ic, management, etc.)
 * @param level - Final career level achieved (1-4)
 * @param score - Total weeks survived
 * @returns Hash string for cache lookup
 */
export function generateSummaryHash(path: string, level: number, score: number): string {
  // Bucket score into ranges (0-49, 50-99, 100-149, 150+)
  const scoreBucket = Math.floor(score / 50) * 50;

  // Create deterministic hash for summary caching
  return `summary-${path}-lvl${level.toString()}-score${scoreBucket.toString()}`;
}
