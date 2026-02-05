import { describe, it, expect } from 'vitest';
import { isActionAvailableForJob, filterActionsForJob, getAvailableWorkActions } from '../actionFilter';
import type { GameAction } from '../../types/actions';
import type { CareerState } from '../../types/career';

/**
 * Test helper: Creates a minimal CareerState object for testing.
 */
function createMockCareer(overrides: Partial<CareerState> = {}): CareerState {
  const base: CareerState = {
    currentJobId: 'unemployed',
    jobStartTick: 0,
    jobHistory: [],
  };
  return { ...base, ...overrides };
}

/**
 * Test helper: Creates a minimal WORK action for testing.
 */
function createMockWorkAction(overrides: Partial<GameAction> = {}): GameAction {
  const base: GameAction = {
    id: 'test_action',
    label: 'Test Action',
    category: 'WORK',
    energyCost: 20,
    moneyCost: 0,
    rewards: { xp: 10 },
  };
  return { ...base, ...overrides };
}

describe('actionFilter', () => {
  describe('isActionAvailableForJob', () => {
    it('should allow non-WORK actions regardless of job', () => {
      const action: GameAction = {
        id: 'read_docs',
        label: 'Read Documentation',
        category: 'SKILL',
        energyCost: 10,
        moneyCost: 0,
        rewards: { skill: 5 },
      };

      const career = createMockCareer({ currentJobId: 'unemployed' });
      expect(isActionAvailableForJob(action, career)).toBe(true);
    });

    it('should allow universal actions for all jobs', () => {
      const action = createMockWorkAction({
        id: 'apply_job',
        jobRequirements: { universal: true },
      });

      // Test with unemployed
      expect(isActionAvailableForJob(action, createMockCareer({ currentJobId: 'unemployed' }))).toBe(true);

      // Test with corporate job
      expect(isActionAvailableForJob(action, createMockCareer({ currentJobId: 'corp_junior' }))).toBe(true);

      // Test with freelancer
      expect(isActionAvailableForJob(action, createMockCareer({ currentJobId: 'hustle_freelancer' }))).toBe(true);
    });

    it('should allow unemployed-specific actions only for unemployed players', () => {
      const action = createMockWorkAction({
        id: 'gig_fix',
        jobRequirements: { unemployed: true, tracks: ['Hustler_L1'] },
      });

      // Unemployed should have access
      expect(isActionAvailableForJob(action, createMockCareer({ currentJobId: 'unemployed' }))).toBe(true);

      // Corporate job should not have access (not unemployed, not on Hustler track)
      expect(isActionAvailableForJob(action, createMockCareer({ currentJobId: 'corp_junior' }))).toBe(false);
    });

    it('should filter by track correctly', () => {
      const corpAction = createMockWorkAction({
        id: 'corp_ticket',
        jobRequirements: { tracks: ['Corporate_L1', 'Corp_IC'] },
      });

      // Corporate L1 job should have access
      expect(isActionAvailableForJob(corpAction, createMockCareer({ currentJobId: 'corp_junior' }))).toBe(true);

      // Hustler job should not have access
      expect(isActionAvailableForJob(corpAction, createMockCareer({ currentJobId: 'hustle_freelancer' }))).toBe(false);
    });

    it('should respect minTier requirement', () => {
      const seniorAction = createMockWorkAction({
        id: 'corp_lead',
        jobRequirements: { tracks: ['Corporate_L1', 'Corp_Management'], minTier: 3 },
      });

      // Junior (tier 1) should not have access
      expect(isActionAvailableForJob(seniorAction, createMockCareer({ currentJobId: 'corp_junior' }))).toBe(false);

      // Senior (tier 3) should have access
      expect(isActionAvailableForJob(seniorAction, createMockCareer({ currentJobId: 'corp_senior' }))).toBe(true);
    });

    it('should respect maxTier requirement', () => {
      const juniorAction = createMockWorkAction({
        id: 'intern_task',
        jobRequirements: { tracks: ['Corporate_L1'], maxTier: 1 },
      });

      // Intern (tier 0) should have access
      expect(isActionAvailableForJob(juniorAction, createMockCareer({ currentJobId: 'corp_intern' }))).toBe(true);

      // Junior (tier 1) should have access
      expect(isActionAvailableForJob(juniorAction, createMockCareer({ currentJobId: 'corp_junior' }))).toBe(true);

      // Mid (tier 2) should not have access
      expect(isActionAvailableForJob(juniorAction, createMockCareer({ currentJobId: 'corp_mid' }))).toBe(false);
    });

    it('should allow actions without jobRequirements for all jobs (legacy behavior)', () => {
      const legacyAction = createMockWorkAction({
        id: 'legacy_work',
        // No jobRequirements defined
      });

      expect(isActionAvailableForJob(legacyAction, createMockCareer({ currentJobId: 'unemployed' }))).toBe(true);
      expect(isActionAvailableForJob(legacyAction, createMockCareer({ currentJobId: 'corp_senior' }))).toBe(true);
    });
  });

  describe('filterActionsForJob', () => {
    it('should filter WORK actions based on job', () => {
      const actions: GameAction[] = [
        createMockWorkAction({ id: 'universal', jobRequirements: { universal: true } }),
        createMockWorkAction({ id: 'corp_only', jobRequirements: { tracks: ['Corporate_L1'] } }),
        createMockWorkAction({ id: 'hustle_only', jobRequirements: { tracks: ['Hustler_L1'] } }),
        { id: 'skill_action', label: 'Skill', category: 'SKILL', energyCost: 10, moneyCost: 0, rewards: { skill: 5 } },
      ];

      const corpCareer = createMockCareer({ currentJobId: 'corp_junior' });
      const filtered: GameAction[] = filterActionsForJob(actions, corpCareer);

      expect(filtered).toHaveLength(3); // universal + corp_only + skill_action
      expect(filtered.map(a => a.id)).toContain('universal');
      expect(filtered.map(a => a.id)).toContain('corp_only');
      expect(filtered.map(a => a.id)).toContain('skill_action');
      expect(filtered.map(a => a.id)).not.toContain('hustle_only');
    });
  });

  describe('getAvailableWorkActions', () => {
    it('should return only WORK actions available for the job', () => {
      const actions: GameAction[] = [
        createMockWorkAction({ id: 'universal', jobRequirements: { universal: true } }),
        createMockWorkAction({ id: 'corp_only', jobRequirements: { tracks: ['Corporate_L1'] } }),
        { id: 'skill_action', label: 'Skill', category: 'SKILL', energyCost: 10, moneyCost: 0, rewards: { skill: 5 } },
      ];

      const corpCareer = createMockCareer({ currentJobId: 'corp_junior' });
      const workActions: GameAction[] = getAvailableWorkActions(actions, corpCareer);

      expect(workActions).toHaveLength(2); // universal + corp_only (not skill_action)
      expect(workActions.every(a => a.category === 'WORK')).toBe(true);
    });
  });
});
