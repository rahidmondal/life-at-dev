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
  return Object.values(JOB_REGISTRY).filter(job => {
    // Can't apply to current job
    if (job.id === currentJobId) return false;
    // Can't "apply" to unemployed
    if (job.id === 'unemployed') return false;
    return checkJobRequirements(job, stats);
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
