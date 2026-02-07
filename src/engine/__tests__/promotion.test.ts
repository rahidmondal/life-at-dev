import { describe, expect, it } from 'vitest';
import { JOB_REGISTRY } from '../../data/tracks';
import type { JobNode } from '../../types/career';
import type { GameState, PlayerStats } from '../../types/gamestate';
import {
  calculateInterviewSuccessChance,
  calculateTrackSwitchPenalty,
  getAvailablePromotions,
  getJobTierLabel,
  getL2TrackOptions,
  getNextTierJobs,
  isAtCrossroads,
  isReadyForPromotion,
  requiresInterview,
} from '../promotion';

/**
 * Helper to create a minimal game state for testing.
 */
function createMockState(overrides: {
  currentJobId?: string;
  tick?: number;
  coding?: number;
  politics?: number;
  corporate?: number;
  freelance?: number;
  reputation?: number;
}): GameState {
  return {
    meta: {
      version: '1.0.0',
      tick: overrides.tick ?? 0,
      startAge: 18,
      playerName: 'TestPlayer',
    },
    career: {
      currentJobId: overrides.currentJobId ?? 'unemployed',
      jobStartTick: 0,
      jobHistory: [],
    },
    stats: {
      skills: {
        coding: overrides.coding ?? 0,
        politics: overrides.politics ?? 0,
      },
      xp: {
        corporate: overrides.corporate ?? 0,
        freelance: overrides.freelance ?? 0,
        reputation: overrides.reputation ?? 0,
      },
    },
    resources: {
      money: 0,
      energy: 100,
      stress: 0,
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
  };
}

describe('getNextTierJobs', () => {
  it('returns jobs one tier higher within the same track', () => {
    const corpJunior = JOB_REGISTRY.corp_junior;
    const nextJobs = getNextTierJobs(corpJunior);

    expect(nextJobs.length).toBeGreaterThan(0);
    expect(nextJobs.every(j => j.tier === corpJunior.tier + 1)).toBe(true);
    expect(nextJobs.every(j => j.track === corpJunior.track)).toBe(true);
  });

  it('returns empty array for terminal jobs (xpCap undefined)', () => {
    const cto = JOB_REGISTRY.corp_cto;
    const nextJobs = getNextTierJobs(cto);

    expect(nextJobs).toEqual([]);
  });

  it('returns correct next tier for corp_intern (tier 0 → tier 1)', () => {
    const intern = JOB_REGISTRY.corp_intern;
    const nextJobs = getNextTierJobs(intern);

    expect(nextJobs.length).toBe(1);
    expect(nextJobs[0].id).toBe('corp_junior');
  });
});

describe('getL2TrackOptions', () => {
  it('returns all L2 entry points for corp_senior', () => {
    const l2Options = getL2TrackOptions('corp_senior');

    // Returns all 4 L2 entry points (player can choose any track)
    expect(l2Options.length).toBe(4);
    const ids = l2Options.map(j => j.id);
    expect(ids).toContain('corp_lead');
    expect(ids).toContain('ic_staff');
    expect(ids).toContain('hustle_agency');
    expect(ids).toContain('hustle_contractor');
  });

  it('returns all L2 entry points for hustle_nomad', () => {
    const l2Options = getL2TrackOptions('hustle_nomad');

    // Returns all 4 L2 entry points (player can choose any track)
    expect(l2Options.length).toBe(4);
    const ids = l2Options.map(j => j.id);
    expect(ids).toContain('corp_lead');
    expect(ids).toContain('ic_staff');
    expect(ids).toContain('hustle_agency');
    expect(ids).toContain('hustle_contractor');
  });

  it('returns empty array for non-unlock jobs', () => {
    expect(getL2TrackOptions('corp_junior')).toEqual([]);
    expect(getL2TrackOptions('corp_mid')).toEqual([]);
    expect(getL2TrackOptions('hustle_freelancer')).toEqual([]);
  });
});

describe('requiresInterview', () => {
  it('requires interview for L1 to L2 transition', () => {
    const corpSenior = JOB_REGISTRY.corp_senior;
    const corpLead = JOB_REGISTRY.corp_lead;

    expect(requiresInterview(corpSenior, corpLead)).toBe(true);
  });

  it('requires interview for terminal jobs', () => {
    const manager = JOB_REGISTRY.corp_manager;
    const cto = JOB_REGISTRY.corp_cto;

    expect(requiresInterview(manager, cto)).toBe(true);
  });

  it('does not require interview for same-track tier progression', () => {
    const junior = JOB_REGISTRY.corp_junior;
    const mid = JOB_REGISTRY.corp_mid;

    expect(requiresInterview(junior, mid)).toBe(false);
  });
});

describe('getAvailablePromotions', () => {
  it('returns no promotions for unemployed with no stats', () => {
    const state = createMockState({ currentJobId: 'unemployed' });
    const promotions = getAvailablePromotions(state);

    // Unemployed might have some low-tier jobs available depending on requirements
    // but with 0 coding, shouldn't qualify for corp_intern
    const hasCorpIntern = promotions.some(j => j.id === 'corp_intern');
    expect(hasCorpIntern).toBe(false);
  });

  it('returns corp_junior when meeting requirements from corp_intern', () => {
    const state = createMockState({
      currentJobId: 'corp_intern',
      coding: 600,
      corporate: 200,
    });
    const promotions = getAvailablePromotions(state);

    const hasCorpJunior = promotions.some(j => j.id === 'corp_junior');
    expect(hasCorpJunior).toBe(true);
  });

  it('returns L2 options when at corp_senior with sufficient stats', () => {
    const state = createMockState({
      currentJobId: 'corp_senior',
      coding: 5000,
      politics: 500,
      corporate: 4000,
    });
    const promotions = getAvailablePromotions(state);

    const hasCorpLead = promotions.some(j => j.id === 'corp_lead');
    const hasIcStaff = promotions.some(j => j.id === 'ic_staff');
    expect(hasCorpLead).toBe(true);
    expect(hasIcStaff).toBe(true);
  });
});

describe('calculateTrackSwitchPenalty', () => {
  it('returns same value when staying in same track', () => {
    const result = calculateTrackSwitchPenalty(1000, 'Corporate_L1', 'Corporate_L1');
    expect(result).toBe(1000);
  });

  it('applies 50% penalty when switching tracks', () => {
    const result = calculateTrackSwitchPenalty(1000, 'Corporate_L1', 'Corp_Management');
    expect(result).toBe(500);
  });

  it('floors the result for odd numbers', () => {
    const result = calculateTrackSwitchPenalty(101, 'Corporate_L1', 'Corp_IC');
    expect(result).toBe(50);
  });
});

describe('isReadyForPromotion', () => {
  it('returns false for terminal jobs', () => {
    const state = createMockState({
      currentJobId: 'corp_cto',
      corporate: 10000,
    });

    expect(isReadyForPromotion(state)).toBe(false);
  });

  it('returns true when corporate XP exceeds xpCap for corporate jobs', () => {
    const job = JOB_REGISTRY.corp_junior;
    const xpCap = job.xpCap ?? 0;
    const state = createMockState({
      currentJobId: 'corp_junior',
      corporate: xpCap + 100,
    });

    expect(isReadyForPromotion(state)).toBe(true);
  });

  it('returns false when XP is below xpCap', () => {
    const job = JOB_REGISTRY.corp_junior;
    const xpCap = job.xpCap ?? 0;
    const state = createMockState({
      currentJobId: 'corp_junior',
      corporate: xpCap - 100,
    });

    expect(isReadyForPromotion(state)).toBe(false);
  });

  it('uses combined freelance + reputation for hustler jobs', () => {
    const job = JOB_REGISTRY.hustle_freelancer;
    const xpCap = job.xpCap ?? 0;
    const state = createMockState({
      currentJobId: 'hustle_freelancer',
      freelance: xpCap / 2 + 100,
      reputation: xpCap / 2 + 100,
    });

    expect(isReadyForPromotion(state)).toBe(true);
  });
});

describe('calculateInterviewSuccessChance', () => {
  it('returns 1 for jobs with no requirements', () => {
    const job: JobNode = {
      id: 'test',
      title: 'Test',
      tier: 0,
      track: 'Corporate_L1',
      salary: 0,
      incomeType: 'salary',
      requirements: {},
    };
    const stats: PlayerStats = {
      skills: { coding: 0, politics: 0 },
      xp: { corporate: 0, freelance: 0, reputation: 0 },
    };

    expect(calculateInterviewSuccessChance(stats, job)).toBe(1);
  });

  it('returns base 50% when exactly meeting requirements', () => {
    const job: JobNode = {
      id: 'test',
      title: 'Test',
      tier: 1,
      track: 'Corporate_L1',
      salary: 50000,
      incomeType: 'salary',
      requirements: { coding: 1000 },
    };
    const stats: PlayerStats = {
      skills: { coding: 1000, politics: 0 },
      xp: { corporate: 0, freelance: 0, reputation: 0 },
    };

    expect(calculateInterviewSuccessChance(stats, job)).toBe(0.5);
  });

  it('caps at 95% for very high overshoot', () => {
    const job: JobNode = {
      id: 'test',
      title: 'Test',
      tier: 1,
      track: 'Corporate_L1',
      salary: 50000,
      incomeType: 'salary',
      requirements: { coding: 100 },
    };
    const stats: PlayerStats = {
      skills: { coding: 10000, politics: 0 },
      xp: { corporate: 0, freelance: 0, reputation: 0 },
    };

    expect(calculateInterviewSuccessChance(stats, job)).toBe(0.95);
  });
});

describe('getJobTierLabel', () => {
  it('returns correct labels for each tier', () => {
    expect(getJobTierLabel(0)).toBe('Entry');
    expect(getJobTierLabel(1)).toBe('Junior');
    expect(getJobTierLabel(2)).toBe('Mid-Level');
    expect(getJobTierLabel(3)).toBe('Senior');
    expect(getJobTierLabel(4)).toBe('Lead');
    expect(getJobTierLabel(5)).toBe('Principal');
    expect(getJobTierLabel(6)).toBe('Executive');
  });

  it('returns Unknown for invalid tier', () => {
    expect(getJobTierLabel(99)).toBe('Unknown');
  });
});

describe('isAtCrossroads', () => {
  it('returns true for corp_senior', () => {
    expect(isAtCrossroads('corp_senior')).toBe(true);
  });

  it('returns true for hustle_nomad', () => {
    expect(isAtCrossroads('hustle_nomad')).toBe(true);
  });

  it('returns false for other jobs', () => {
    expect(isAtCrossroads('corp_junior')).toBe(false);
    expect(isAtCrossroads('corp_mid')).toBe(false);
    expect(isAtCrossroads('corp_lead')).toBe(false);
    expect(isAtCrossroads('hustle_freelancer')).toBe(false);
  });
});
