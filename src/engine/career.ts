import type { JobHistoryEntry, JobNode } from '@/types/career';
import { JOB_REGISTRY } from '../data/tracks';
import type { GameState, PlayerStats } from '../types/gamestate';

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
