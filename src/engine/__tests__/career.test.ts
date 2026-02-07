import type { JobNode } from '@/types/career';
import { describe, expect, it } from 'vitest';
import { JOB_REGISTRY } from '../../data/tracks';
import type { GameState, PlayerStats } from '../../types/gamestate';
import { checkJobRequirements, detectTrackSwitch, getEligibleJobs, promotePlayer } from '../career';

describe('checkJobRequirements', () => {
  const mockStats: PlayerStats = {
    skills: {
      coding: 1000,
      politics: 500,
    },
    xp: {
      corporate: 200,
      freelance: 100,
      reputation: 50,
    },
  };

  it('should return true when player exceeds all requirements', () => {
    const job: JobNode = {
      id: 'test-job',
      title: 'Test Job',
      track: 'Corp_IC',
      tier: 1,
      salary: 50000,
      incomeType: 'salary',
      requirements: {
        coding: 500,
        politics: 200,
        corporate: 100,
      },
    };

    expect(checkJobRequirements(job, mockStats)).toBe(true);
  });

  it('should return false when player fails coding requirement', () => {
    const job: JobNode = {
      id: 'test-job',
      title: 'Test Job',
      track: 'Corp_IC',
      tier: 3,
      salary: 80000,
      incomeType: 'salary',
      requirements: {
        coding: 2000,
      },
    };

    expect(checkJobRequirements(job, mockStats)).toBe(false);
  });

  it('should return false when player fails politics requirement', () => {
    const job: JobNode = {
      id: 'test-job',
      title: 'Test Job',
      track: 'Corp_Management',
      tier: 3,
      salary: 90000,
      incomeType: 'salary',
      requirements: {
        politics: 1000,
      },
    };

    expect(checkJobRequirements(job, mockStats)).toBe(false);
  });

  it('should return false when player fails XP requirement', () => {
    const job: JobNode = {
      id: 'test-job',
      title: 'Test Job',
      track: 'Corp_IC',
      tier: 2,
      salary: 70000,
      incomeType: 'salary',
      requirements: {
        corporate: 500,
      },
    };

    expect(checkJobRequirements(job, mockStats)).toBe(false);
  });

  it('should return true when requirements are undefined (treated as 0)', () => {
    const job: JobNode = {
      id: 'entry-job',
      title: 'Entry Job',
      track: 'Corp_IC',
      tier: 0,
      salary: 30000,
      incomeType: 'salary',
      requirements: {},
    };

    expect(checkJobRequirements(job, mockStats)).toBe(true);
  });

  it('should handle mixed requirements (skill + XP)', () => {
    const job: JobNode = {
      id: 'hybrid-job',
      title: 'Hybrid Job',
      track: 'Corp_IC',
      tier: 2,
      salary: 65000,
      incomeType: 'salary',
      requirements: {
        coding: 800,
        corporate: 150,
        reputation: 30,
      },
    };

    expect(checkJobRequirements(job, mockStats)).toBe(true);
  });

  it('should return false when failing only one of multiple requirements', () => {
    const job: JobNode = {
      id: 'strict-job',
      title: 'Strict Job',
      track: 'Corp_IC',
      tier: 3,
      salary: 85000,
      incomeType: 'salary',
      requirements: {
        coding: 900,
        politics: 400,
        reputation: 100,
      },
    };

    expect(checkJobRequirements(job, mockStats)).toBe(false);
  });
});

describe('getEligibleJobs', () => {
  const createMockState = (currentJobId: string, stats: Partial<PlayerStats> = {}): GameState => ({
    meta: {
      tick: 0,
      version: '2.0.0',
      startAge: 18,
      playerName: 'TestPlayer',
    },
    career: {
      currentJobId,
      jobStartTick: 0,
      jobHistory: [],
    },
    stats: {
      skills: {
        coding: 0,
        politics: 0,
        ...stats.skills,
      },
      xp: {
        corporate: 0,
        freelance: 0,
        reputation: 0,
        ...stats.xp,
      },
    },
    resources: {
      energy: 100,
      stress: 0,
      money: 0,
      debt: 0,
      fulfillment: 0,
    },
    flags: {
      isBurnedOut: false,
      isBankrupt: false,
      consecutiveMissedPayments: 0,
      totalMissedPayments: 0,
      streak: 0,
      cooldowns: {},
      accumulatesDebt: false,
      startingPath: null,
      isScholar: false,
      scholarYearsRemaining: 0,
      hasGraduated: false,
      purchasedInvestments: [],
      activeBuffs: [],
    },
    eventLog: [],
  });

  it('should exclude current job from eligible jobs', () => {
    const state = createMockState('unemployed', {
      skills: { coding: 5000, politics: 5000 },
      xp: { corporate: 1000, freelance: 1000, reputation: 500 },
    });

    const eligibleJobs = getEligibleJobs(state);
    const currentJobInList = eligibleJobs.find(job => job.id === 'unemployed');

    expect(currentJobInList).toBeUndefined();
  });

  it('should return only jobs that meet requirements', () => {
    const state = createMockState('unemployed', {
      skills: { coding: 1000, politics: 200 },
      xp: { corporate: 100, freelance: 50, reputation: 20 },
    });

    const eligibleJobs = getEligibleJobs(state);

    eligibleJobs.forEach(job => {
      expect(checkJobRequirements(job, state.stats)).toBe(true);
    });
  });

  it('should return empty array when player meets no requirements', () => {
    const state = createMockState('unemployed', {
      skills: { coding: 0, politics: 0 },
      xp: { corporate: 0, freelance: 0, reputation: 0 },
    });

    const eligibleJobs = getEligibleJobs(state);

    eligibleJobs.forEach(job => {
      const hasRequirements =
        job.requirements.coding ??
        job.requirements.politics ??
        job.requirements.corporate ??
        job.requirements.freelance ??
        job.requirements.reputation;
      expect(hasRequirements).toBeFalsy();
    });
  });

  it('should work with real job registry data', () => {
    const internJob = Object.values(JOB_REGISTRY).find(job => job.tier === 0);
    expect(internJob).toBeDefined();

    const state = createMockState('unemployed', {
      skills: { coding: 500, politics: 100 },
      xp: { corporate: 50, freelance: 0, reputation: 10 },
    });

    const eligibleJobs = getEligibleJobs(state);

    expect(eligibleJobs.length).toBeGreaterThan(0);
  });

  it('should handle progression scenario (Intern can see Junior Dev)', () => {
    const state = createMockState('corp_intern', {
      skills: { coding: 1500, politics: 300 },
      xp: { corporate: 200, freelance: 0, reputation: 50 },
    });

    const eligibleJobs = getEligibleJobs(state);

    const juniorJobs = eligibleJobs.filter(job => job.tier === 1);
    expect(juniorJobs.length).toBeGreaterThan(0);

    const currentJob = eligibleJobs.find(job => job.id === 'corp_intern');
    expect(currentJob).toBeUndefined();
  });
});

describe('detectTrackSwitch', () => {
  const icJob: JobNode = {
    id: 'corp_junior',
    title: 'Junior Developer',
    track: 'Corp_IC',
    tier: 1,
    salary: 60000,
    incomeType: 'salary',
    requirements: {},
  };

  const managementJob: JobNode = {
    id: 'corp_lead',
    title: 'Engineering Manager',
    track: 'Corp_Management',
    tier: 4,
    salary: 80000,
    incomeType: 'salary',
    requirements: {},
  };

  const unemployedJob: JobNode = {
    id: 'unemployed',
    title: 'Unemployed',
    track: 'Hustler_L1',
    tier: 0,
    salary: 0,
    incomeType: 'volatile',
    requirements: {},
  };

  it('should return true when switching from IC to Management', () => {
    expect(detectTrackSwitch(icJob, managementJob)).toBe(true);
  });

  it('should return true when switching from Management to IC', () => {
    expect(detectTrackSwitch(managementJob, icJob)).toBe(true);
  });

  it('should return false when staying within same track', () => {
    const seniorIcJob: JobNode = {
      ...icJob,
      id: 'ic-senior',
      title: 'Senior Developer',
      tier: 3,
    };

    expect(detectTrackSwitch(icJob, seniorIcJob)).toBe(false);
  });

  it('should return false when current job is unemployed', () => {
    expect(detectTrackSwitch(unemployedJob, icJob)).toBe(false);
  });

  it('should return false when new job is unemployed', () => {
    expect(detectTrackSwitch(icJob, unemployedJob)).toBe(false);
  });

  it('should return false when both jobs are unemployed', () => {
    expect(detectTrackSwitch(unemployedJob, unemployedJob)).toBe(false);
  });
});

describe('promotePlayer', () => {
  const createMockState = (currentJobId: string, tick = 0): GameState => ({
    meta: {
      tick,
      version: '2.0.0',
      startAge: 18,
      playerName: 'TestPlayer',
    },
    career: {
      currentJobId,
      jobStartTick: 0,
      jobHistory: [],
    },
    stats: {
      skills: {
        coding: 2000,
        politics: 1000,
      },
      xp: {
        corporate: 500,
        freelance: 200,
        reputation: 100,
      },
    },
    resources: {
      energy: 100,
      stress: 0,
      money: 50000,
      debt: 0,
      fulfillment: 0,
    },
    flags: {
      isBurnedOut: false,
      isBankrupt: false,
      consecutiveMissedPayments: 0,
      totalMissedPayments: 0,
      streak: 0,
      cooldowns: {},
      accumulatesDebt: false,
      startingPath: null,
      isScholar: false,
      scholarYearsRemaining: 0,
      hasGraduated: false,
      purchasedInvestments: [],
      activeBuffs: [],
    },
    eventLog: [],
  });

  it('should update currentJobId to new job', () => {
    const state = createMockState('unemployed');
    const newState = promotePlayer(state, 'corp_intern');

    expect(newState.career.currentJobId).toBe('corp_intern');
  });

  it('should add entry to job history', () => {
    const state = createMockState('unemployed', 10);
    const newState = promotePlayer(state, 'corp_intern');

    expect(newState.career.jobHistory.length).toBe(1);
    expect(newState.career.jobHistory[0]).toEqual({
      jobId: 'unemployed',
      startTick: 0,
      endTick: 10,
    });
  });

  it('should update jobStartTick to current tick', () => {
    const state = createMockState('unemployed', 25);
    const newState = promotePlayer(state, 'corp_intern');

    expect(newState.career.jobStartTick).toBe(25);
  });

  it('should not mutate original state', () => {
    const state = createMockState('unemployed');
    const originalJobId = state.career.currentJobId;
    const originalHistoryLength = state.career.jobHistory.length;

    promotePlayer(state, 'corp_intern');

    expect(state.career.currentJobId).toBe(originalJobId);
    expect(state.career.jobHistory.length).toBe(originalHistoryLength);
  });

  it('should apply 50% politics penalty when switching from IC to Management', () => {
    const state = createMockState('corp_junior');
    state.stats.skills.politics = 1000;

    const newState = promotePlayer(state, 'corp_lead');

    expect(newState.stats.skills.politics).toBe(500);
  });

  it('should apply 50% politics penalty when switching from Management to IC', () => {
    const state = createMockState('corp_lead');
    state.stats.skills.politics = 2000;

    const newState = promotePlayer(state, 'corp_junior');

    expect(newState.stats.skills.politics).toBe(1000);
  });

  it('should NOT apply penalty when promoting within same track (Junior -> Senior IC)', () => {
    const state = createMockState('corp_junior');
    state.stats.skills.politics = 1000;

    const newState = promotePlayer(state, 'corp_mid');

    expect(newState.stats.skills.politics).toBe(1000);
  });

  it('should NOT apply penalty when promoting within Management track', () => {
    const state = createMockState('corp_lead');
    state.stats.skills.politics = 1500;

    const newState = promotePlayer(state, 'corp_manager');

    expect(newState.stats.skills.politics).toBe(1500);
  });

  it('should floor the politics penalty (no decimals)', () => {
    const state = createMockState('corp_junior');
    state.stats.skills.politics = 1001;

    const newState = promotePlayer(state, 'corp_lead');

    expect(newState.stats.skills.politics).toBe(500);
  });

  it('should throw error if new job ID is not found', () => {
    const state = createMockState('unemployed');

    expect(() => promotePlayer(state, 'nonexistent-job')).toThrow(
      'Job with ID "nonexistent-job" not found in JOB_REGISTRY',
    );
  });

  it('should handle multiple promotions correctly', () => {
    let state = createMockState('unemployed', 0);

    state = promotePlayer(state, 'corp_intern');
    expect(state.career.currentJobId).toBe('corp_intern');
    expect(state.career.jobHistory.length).toBe(1);

    state = { ...state, meta: { ...state.meta, tick: 52 } };

    state = promotePlayer(state, 'corp_junior');
    expect(state.career.currentJobId).toBe('corp_junior');
    expect(state.career.jobHistory.length).toBe(2);
    expect(state.career.jobHistory[1]).toEqual({
      jobId: 'corp_intern',
      startTick: 0,
      endTick: 52,
    });
  });

  it('should preserve other stats when applying penalty', () => {
    const state = createMockState('corp_junior');
    const originalCoding = state.stats.skills.coding;
    const originalXp = state.stats.xp;

    const newState = promotePlayer(state, 'corp_lead');

    expect(newState.stats.skills.coding).toBe(originalCoding);
    expect(newState.stats.xp).toEqual(originalXp);
  });
});
