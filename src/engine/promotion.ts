/**
 * @fileoverview Promotion Engine - Handles job progression and track switching
 *
 * Core mechanics:
 * - Tier-based progression within tracks
 * - L2 unlock at Senior Dev / Digital Nomad
 * - Track switching penalties (50% politics loss)
 * - Terminal jobs (xpCap: undefined) - no further progression
 */

import { JOB_REGISTRY, L1_TRACKS, L2_TRACKS, L2_UNLOCK_JOBS } from '@/data/tracks';
import type { JobId, JobNode } from '@/types/career';
import type { GameState, PlayerStats } from '@/types/gamestate';
import { checkJobRequirements } from './career';

/**
 * Get jobs within the same track that are one tier higher.
 */
export function getNextTierJobs(currentJob: JobNode): JobNode[] {
  if (currentJob.xpCap === undefined) {
    // Terminal job - no promotions available
    return [];
  }

  const nextTier = currentJob.tier + 1;

  return Object.values(JOB_REGISTRY).filter(job => job.track === currentJob.track && job.tier === nextTier);
}

/**
 * Get L2 track options available to the player.
 * Only available when player reaches L2 unlock jobs (Senior Dev or Digital Nomad).
 */
export function getL2TrackOptions(currentJobId: JobId): JobNode[] {
  // Only corp_senior and hustle_nomad unlock L2 tracks
  if (!L2_UNLOCK_JOBS.includes(currentJobId as (typeof L2_UNLOCK_JOBS)[number])) {
    return [];
  }

  // Get all tier 4 jobs from L2 tracks (entry points)
  return Object.values(JOB_REGISTRY).filter(job => {
    // L2 tracks start at tier 4 for corporate, tier 3 for hustler
    const isL2Track = L2_TRACKS.includes(job.track as (typeof L2_TRACKS)[number]);
    const isEntryPoint =
      (job.track === 'Corp_Management' && job.tier === 4) ||
      (job.track === 'Corp_IC' && job.tier === 4) ||
      (job.track === 'Hustler_Business' && job.tier === 3) ||
      (job.track === 'Hustler_Specialist' && job.tier === 3);

    return isL2Track && isEntryPoint;
  });
}

/**
 * Check if a promotion requires an interview.
 * Interviews are required for:
 * - L2 track entry (The Crossroads)
 * - Terminal jobs (CTO, Distinguished Fellow, Tech Mogul, Architect)
 */
export function requiresInterview(currentJob: JobNode, targetJob: JobNode): boolean {
  // L2 entry requires interview
  const currentIsL1 = L1_TRACKS.includes(currentJob.track as (typeof L1_TRACKS)[number]);
  const targetIsL2 = L2_TRACKS.includes(targetJob.track as (typeof L2_TRACKS)[number]);

  if (currentIsL1 && targetIsL2) {
    return true;
  }

  // Terminal jobs require interview
  if (targetJob.xpCap === undefined) {
    return true;
  }

  return false;
}

/**
 * Get all available promotions for the current player state.
 * Returns jobs the player is eligible for based on stats and current position.
 */
export function getAvailablePromotions(state: GameState): JobNode[] {
  const currentJobId = state.career.currentJobId;
  const currentJob = JOB_REGISTRY[currentJobId];
  const { stats } = state;

  const promotions: JobNode[] = [];

  // 1. Next tier within same track
  const nextTierJobs = getNextTierJobs(currentJob);
  for (const job of nextTierJobs) {
    if (checkJobRequirements(job, stats)) {
      promotions.push(job);
    }
  }

  // 2. L2 track options (if at unlock point)
  const l2Options = getL2TrackOptions(currentJobId);
  for (const job of l2Options) {
    if (checkJobRequirements(job, stats)) {
      promotions.push(job);
    }
  }

  return promotions;
}

/**
 * Calculate the politics penalty for switching tracks.
 * Returns the new politics value after penalty.
 */
export function calculateTrackSwitchPenalty(currentPolitics: number, fromTrack: string, toTrack: string): number {
  // No penalty within same track
  if (fromTrack === toTrack) {
    return currentPolitics;
  }

  // 50% penalty for track switch
  return Math.floor(currentPolitics * 0.5);
}

/**
 * Check if the player meets the XP threshold for promotion within current job.
 * Uses the job's xpCap as the threshold.
 */
export function isReadyForPromotion(state: GameState): boolean {
  const currentJob = JOB_REGISTRY[state.career.currentJobId];

  // Terminal jobs can't be promoted from
  if (currentJob.xpCap === undefined) {
    return false;
  }

  // Check if player has accumulated enough XP based on job's primary track
  const track = currentJob.track;
  let relevantXP = 0;

  if (track.startsWith('Corp')) {
    relevantXP = state.stats.xp.corporate;
  } else if (track.startsWith('Hustler')) {
    relevantXP = state.stats.xp.freelance + state.stats.xp.reputation;
  }

  return relevantXP >= currentJob.xpCap;
}

/**
 * Calculate interview success chance based on player stats and target job.
 * Returns a value between 0 and 1.
 */
export function calculateInterviewSuccessChance(stats: PlayerStats, targetJob: JobNode): number {
  const reqs = targetJob.requirements;
  let totalOvershoot = 0;
  let reqCount = 0;

  // Calculate how much player exceeds requirements
  if (reqs.coding !== undefined) {
    totalOvershoot += (stats.skills.coding - reqs.coding) / reqs.coding;
    reqCount++;
  }
  if (reqs.politics !== undefined) {
    totalOvershoot += (stats.skills.politics - reqs.politics) / reqs.politics;
    reqCount++;
  }
  if (reqs.corporate !== undefined) {
    totalOvershoot += (stats.xp.corporate - reqs.corporate) / reqs.corporate;
    reqCount++;
  }
  if (reqs.freelance !== undefined) {
    totalOvershoot += (stats.xp.freelance - reqs.freelance) / reqs.freelance;
    reqCount++;
  }
  if (reqs.reputation !== undefined) {
    totalOvershoot += (stats.xp.reputation - reqs.reputation) / reqs.reputation;
    reqCount++;
  }

  if (reqCount === 0) {
    return 1; // No requirements = auto-success
  }

  const avgOvershoot = totalOvershoot / reqCount;

  // Base 50% chance, +10% for every 20% overshoot, capped at 95%
  const baseChance = 0.5;
  const bonus = Math.min(avgOvershoot * 0.5, 0.45);

  return Math.min(baseChance + bonus, 0.95);
}

/**
 * Attempt a promotion interview. Returns success/failure.
 * Uses deterministic random based on state for reproducibility.
 */
export function attemptInterview(state: GameState, targetJob: JobNode): boolean {
  const successChance = calculateInterviewSuccessChance(state.stats, targetJob);

  // Create a deterministic random value based on game state
  const seed = state.meta.tick * 31 + state.stats.skills.coding + state.stats.xp.corporate;
  const randomValue = ((seed * 9301 + 49297) % 233280) / 233280;

  return randomValue < successChance;
}

/**
 * Get the job tier display name for UI purposes.
 */
export function getJobTierLabel(tier: number): string {
  const labels: Record<number, string> = {
    0: 'Entry',
    1: 'Junior',
    2: 'Mid-Level',
    3: 'Senior',
    4: 'Lead',
    5: 'Principal',
    6: 'Executive',
  };

  return labels[tier] || 'Unknown';
}

/**
 * Check if the player is at a career crossroads (L2 unlock point).
 */
export function isAtCrossroads(currentJobId: JobId): boolean {
  return L2_UNLOCK_JOBS.includes(currentJobId as (typeof L2_UNLOCK_JOBS)[number]);
}
