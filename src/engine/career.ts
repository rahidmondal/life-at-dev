import type { JobHistoryEntry, JobNode } from '@/types/career';
import { JOB_REGISTRY } from '../data/tracks';
import type { GameState, PlayerStats } from '../types/gamestate';
import type { Flags } from '../types/resources';

/** Job IDs that are available to students (internships). */
const STUDENT_ELIGIBLE_JOBS = ['corp_intern', 'hustle_freelancer'];

export function checkJobRequirements(job: JobNode, stats: PlayerStats): boolean {
  const reqs = job.requirements;

  if (reqs.coding !== undefined && stats.skills.coding < reqs.coding) {
    return false;
  }
  if (reqs.politics !== undefined && stats.skills.politics < reqs.politics) {
    return false;
  }

  if (reqs.corporate !== undefined && stats.xp.corporate < reqs.corporate) {
    return false;
  }
  if (reqs.freelance !== undefined && stats.xp.freelance < reqs.freelance) {
    return false;
  }
  if (reqs.reputation !== undefined && stats.xp.reputation < reqs.reputation) {
    return false;
  }

  return true;
}

export function getEligibleJobs(state: GameState): JobNode[] {
  const currentJobId = state.career.currentJobId;

  return Object.values(JOB_REGISTRY).filter(job => {
    if (job.id === currentJobId) {
      return false;
    }

    return checkJobRequirements(job, state.stats);
  });
}

/**
 * Get eligible jobs for job application, considering student status.
 * Students can only apply to internships.
 * Graduated/non-students can apply to any job they qualify for.
 */
export function getEligibleJobsForApplication(state: GameState): JobNode[] {
  const { flags, career, stats } = state;
  const currentJobId = career.currentJobId;

  // Students can only apply to specific jobs (internships/entry level)
  if (flags.isScholar) {
    return STUDENT_ELIGIBLE_JOBS.filter(jobId => {
      if (jobId === currentJobId) return false;
      const job = JOB_REGISTRY[jobId];
      return checkJobRequirements(job, stats);
    }).map(jobId => JOB_REGISTRY[jobId]);
  }

  // Non-students/graduates can apply to any eligible job
  const currentJob = JOB_REGISTRY[currentJobId];
  return Object.values(JOB_REGISTRY).filter(job => {
    // Can't apply to current job
    if (job.id === currentJobId) return false;
    // Can't "apply" to unemployed
    if (job.id === 'unemployed') return false;
    // Can't apply to lower or equal tier jobs in the same track
    if (job.track === currentJob.track && job.tier <= currentJob.tier) return false;
    // Can't apply to jobs already held
    if (career.jobHistory.some(h => h.jobId === job.id)) return false;
    return checkJobRequirements(job, stats);
  });
}

/**
 * Get the next logical jobs for the modal preview, WITHOUT filtering by requirements.
 * This lets the UI show "upcoming" positions with readiness progress,
 * even when the player doesn't yet qualify for any of them.
 */
export function getNextJobsForApplication(state: GameState): JobNode[] {
  const { flags, career } = state;
  const currentJobId = career.currentJobId;

  // Students: always show the two entry-level jobs
  if (flags.isScholar) {
    return STUDENT_ELIGIBLE_JOBS.filter(jobId => jobId !== currentJobId).map(jobId => JOB_REGISTRY[jobId]);
  }

  // Non-students/graduates: same filtering as getEligibleJobsForApplication but skip checkJobRequirements
  const currentJob = JOB_REGISTRY[currentJobId];
  return Object.values(JOB_REGISTRY).filter(job => {
    if (job.id === currentJobId) return false;
    if (job.id === 'unemployed') return false;
    if (job.track === currentJob.track && job.tier <= currentJob.tier) return false;
    if (career.jobHistory.some(h => h.jobId === job.id)) return false;
    return true;
  });
}

/**
 * Check if the player is a student (can use student actions, limited job options).
 */
export function isStudent(flags: Partial<Flags>): boolean {
  return flags.isScholar === true;
}

/**
 * Check if the player has graduated from college.
 */
export function hasGraduated(flags: Partial<Flags>): boolean {
  return flags.hasGraduated === true;
}

export function detectTrackSwitch(currentJob: JobNode, newJob: JobNode): boolean {
  if (currentJob.id === 'unemployed' || newJob.id === 'unemployed') {
    return false;
  }

  return currentJob.track !== newJob.track;
}

/**
 * Detailed comparison of a player stat against a job requirement.
 */
export interface RequirementDetail {
  stat: string;
  label: string;
  current: number;
  required: number;
  met: boolean;
}

/**
 * Get a per-stat comparison of player stats against a job's requirements.
 * Returns an array of requirement details with current vs required values.
 */
export function getRequirementDetails(stats: PlayerStats, job: JobNode): RequirementDetail[] {
  const details: RequirementDetail[] = [];
  const reqs = job.requirements;

  if (reqs.coding !== undefined) {
    details.push({
      stat: 'coding',
      label: 'Coding',
      current: stats.skills.coding,
      required: reqs.coding,
      met: stats.skills.coding >= reqs.coding,
    });
  }
  if (reqs.politics !== undefined) {
    details.push({
      stat: 'politics',
      label: 'Politics',
      current: stats.skills.politics,
      required: reqs.politics,
      met: stats.skills.politics >= reqs.politics,
    });
  }
  if (reqs.corporate !== undefined) {
    details.push({
      stat: 'corporate',
      label: 'Corporate XP',
      current: stats.xp.corporate,
      required: reqs.corporate,
      met: stats.xp.corporate >= reqs.corporate,
    });
  }
  if (reqs.freelance !== undefined) {
    details.push({
      stat: 'freelance',
      label: 'Freelance XP',
      current: stats.xp.freelance,
      required: reqs.freelance,
      met: stats.xp.freelance >= reqs.freelance,
    });
  }
  if (reqs.reputation !== undefined) {
    details.push({
      stat: 'reputation',
      label: 'Reputation',
      current: stats.xp.reputation,
      required: reqs.reputation,
      met: stats.xp.reputation >= reqs.reputation,
    });
  }

  return details;
}

export function promotePlayer(state: GameState, newJobId: string): GameState {
  if (!(newJobId in JOB_REGISTRY)) {
    throw new Error(`Job with ID "${newJobId}" not found in JOB_REGISTRY`);
  }

  const newJob = JOB_REGISTRY[newJobId];
  const currentJob = JOB_REGISTRY[state.career.currentJobId];

  const historyEntry: JobHistoryEntry = {
    jobId: state.career.currentJobId,
    startTick: state.career.jobStartTick,
    endTick: state.meta.tick,
  };

  const isTrackSwitch = detectTrackSwitch(currentJob, newJob);
  const newPolitics = isTrackSwitch ? Math.floor(state.stats.skills.politics * 0.5) : state.stats.skills.politics;

  return {
    ...state,
    career: {
      ...state.career,
      currentJobId: newJobId,
      jobStartTick: state.meta.tick,
      jobHistory: [...state.career.jobHistory, historyEntry],
    },
    stats: {
      ...state.stats,
      skills: {
        ...state.stats.skills,
        politics: newPolitics,
      },
    },
  };
}
