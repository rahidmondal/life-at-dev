import { JOB_REGISTRY, UNEMPLOYED_JOB_ID } from '../data/tracks';
import type { GameAction } from '../types/actions';
import type { CareerState, JobNode } from '../types/career';

/**
 * Checks if a work action is available for the player's current job.
 *
 * @param action - The action to check
 * @param career - The player's current career state
 * @returns true if the action should be shown for this job
 */
export function isActionAvailableForJob(action: GameAction, career: CareerState): boolean {
  // Non-WORK actions are always available (no job filtering)
  if (action.category !== 'WORK') {
    return true;
  }

  const jobReqs = action.jobRequirements;

  // If no job requirements defined, action is available to all (legacy behavior)
  if (!jobReqs) {
    return true;
  }

  // Universal actions are always available
  if (jobReqs.universal) {
    return true;
  }

  const currentJobId: string = career.currentJobId;
  const currentJob: JobNode | undefined = JOB_REGISTRY[currentJobId];
  const isUnemployed = currentJobId === UNEMPLOYED_JOB_ID;

  // Check if action is for unemployed players
  if (isUnemployed) {
    return jobReqs.unemployed === true;
  }

  // Get job info - currentJob is guaranteed to exist for employed players
  const currentTrack = currentJob.track;
  const currentTier = currentJob.tier;

  // Check job requirements (OR logic - any match grants access)
  let hasMatch = false;

  // Check specific job IDs
  if (jobReqs.jobIds?.includes(currentJobId)) {
    hasMatch = true;
  }

  // Check track match
  if (jobReqs.tracks?.includes(currentTrack)) {
    hasMatch = true;
  }

  // If no track or job ID matched, deny access
  if (!hasMatch && (jobReqs.tracks ?? jobReqs.jobIds)) {
    return false;
  }

  // Check tier requirements
  if (jobReqs.minTier !== undefined && currentTier < jobReqs.minTier) {
    return false;
  }

  if (jobReqs.maxTier !== undefined && currentTier > jobReqs.maxTier) {
    return false;
  }

  // All checks passed (or no specific requirements beyond tracks)
  return hasMatch || (!jobReqs.tracks && !jobReqs.jobIds);
}

/**
 * Filters an array of actions based on job availability.
 *
 * @param actions - Array of all actions
 * @param career - The player's current career state
 * @returns Filtered array of available actions
 */
export function filterActionsForJob(actions: GameAction[], career: CareerState): GameAction[] {
  return actions.filter(action => isActionAvailableForJob(action, career));
}

/**
 * Gets all WORK actions available for a specific job.
 *
 * @param actions - Array of all actions
 * @param career - The player's current career state
 * @returns Array of available WORK actions
 */
export function getAvailableWorkActions(actions: GameAction[], career: CareerState): GameAction[] {
  return actions.filter(action => action.category === 'WORK' && isActionAvailableForJob(action, career));
}
