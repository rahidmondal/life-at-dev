import { describe, expect, it } from 'vitest';
import type { GameAction } from '../../types/actions';
import type { CareerState } from '../../types/career';
import type { Flags } from '../../types/resources';
import {
  type ActionFilterContext,
  filterActionsForJob,
  getAvailableWorkActions,
  isActionAvailableForJob,
} from '../actionFilter';

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
 * Test helper: Creates a minimal Flags object for testing.
 */
function createMockFlags(overrides: Partial<Flags> = {}): Partial<Flags> {
  return {
    isScholar: false,
    hasGraduated: false,
    ...overrides,
  };
}

/**
 * Test helper: Creates an ActionFilterContext for testing.
 */
function createContext(
  careerOverrides: Partial<CareerState> = {},
  flagsOverrides: Partial<Flags> = {},
): ActionFilterContext {
  return {
    career: createMockCareer(careerOverrides),
    flags: createMockFlags(flagsOverrides),
  };
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

      expect(isActionAvailableForJob(action, createContext({ currentJobId: 'unemployed' }))).toBe(true);
    });

    it('should allow universal actions for all jobs', () => {
      const action = createMockWorkAction({
        id: 'apply_job',
        jobRequirements: { universal: true },
      });

      // Test with unemployed
      expect(isActionAvailableForJob(action, createContext({ currentJobId: 'unemployed' }))).toBe(true);

      // Test with corporate job
      expect(isActionAvailableForJob(action, createContext({ currentJobId: 'corp_junior' }))).toBe(true);

      // Test with freelancer
      expect(isActionAvailableForJob(action, createContext({ currentJobId: 'hustle_freelancer' }))).toBe(true);
    });

    it('should allow unemployed-specific actions only for unemployed players', () => {
      const action = createMockWorkAction({
        id: 'gig_fix',
        jobRequirements: { unemployed: true, tracks: ['Hustler_L1'] },
      });

      // Unemployed should have access
      expect(isActionAvailableForJob(action, createContext({ currentJobId: 'unemployed' }))).toBe(true);

      // Corporate job should not have access (not unemployed, not on Hustler track)
      expect(isActionAvailableForJob(action, createContext({ currentJobId: 'corp_junior' }))).toBe(false);
    });

    it('should filter by track correctly', () => {
      const corpAction = createMockWorkAction({
        id: 'corp_ticket',
        jobRequirements: { tracks: ['Corporate_L1', 'Corp_IC'] },
      });

      // Corporate L1 job should have access
      expect(isActionAvailableForJob(corpAction, createContext({ currentJobId: 'corp_junior' }))).toBe(true);

      // Hustler job should not have access
      expect(isActionAvailableForJob(corpAction, createContext({ currentJobId: 'hustle_freelancer' }))).toBe(false);
    });

    it('should respect minTier requirement', () => {
      const seniorAction = createMockWorkAction({
        id: 'corp_lead',
        jobRequirements: { tracks: ['Corporate_L1', 'Corp_Management'], minTier: 3 },
      });

      // Junior (tier 1) should not have access
      expect(isActionAvailableForJob(seniorAction, createContext({ currentJobId: 'corp_junior' }))).toBe(false);

      // Senior (tier 3) should have access
      expect(isActionAvailableForJob(seniorAction, createContext({ currentJobId: 'corp_senior' }))).toBe(true);
    });

    it('should respect maxTier requirement', () => {
      const juniorAction = createMockWorkAction({
        id: 'intern_task',
        jobRequirements: { tracks: ['Corporate_L1'], maxTier: 1 },
      });

      // Intern (tier 0) should have access
      expect(isActionAvailableForJob(juniorAction, createContext({ currentJobId: 'corp_intern' }))).toBe(true);

      // Junior (tier 1) should have access
      expect(isActionAvailableForJob(juniorAction, createContext({ currentJobId: 'corp_junior' }))).toBe(true);

      // Mid (tier 2) should not have access
      expect(isActionAvailableForJob(juniorAction, createContext({ currentJobId: 'corp_mid' }))).toBe(false);
    });

    it('should allow actions without jobRequirements for all jobs (legacy behavior)', () => {
      const legacyAction = createMockWorkAction({
        id: 'legacy_work',
        // No jobRequirements defined
      });

      expect(isActionAvailableForJob(legacyAction, createContext({ currentJobId: 'unemployed' }))).toBe(true);
      expect(isActionAvailableForJob(legacyAction, createContext({ currentJobId: 'corp_senior' }))).toBe(true);
    });

    it('should allow studentOnly actions only for students', () => {
      const studentAction = createMockWorkAction({
        id: 'attend_lecture',
        category: 'SKILL',
        jobRequirements: { studentOnly: true },
      });

      // Non-student should not have access
      expect(isActionAvailableForJob(studentAction, createContext({}, { isScholar: false }))).toBe(false);

      // Student should have access
      expect(isActionAvailableForJob(studentAction, createContext({}, { isScholar: true }))).toBe(true);
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

      const filtered: GameAction[] = filterActionsForJob(actions, createContext({ currentJobId: 'corp_junior' }));

      expect(filtered).toHaveLength(3); // universal + corp_only + skill_action
      expect(filtered.map(a => a.id)).toContain('universal');
      expect(filtered.map(a => a.id)).toContain('corp_only');
      expect(filtered.map(a => a.id)).toContain('skill_action');
      expect(filtered.map(a => a.id)).not.toContain('hustle_only');
    });

    it('should include student actions for students', () => {
      const actions: GameAction[] = [
        createMockWorkAction({ id: 'universal', jobRequirements: { universal: true } }),
        createMockWorkAction({ id: 'attend_lecture', category: 'SKILL', jobRequirements: { studentOnly: true } }),
        { id: 'skill_action', label: 'Skill', category: 'SKILL', energyCost: 10, moneyCost: 0, rewards: { skill: 5 } },
      ];

      // Non-student should not see student actions
      const nonStudentFiltered = filterActionsForJob(actions, createContext({}, { isScholar: false }));
      expect(nonStudentFiltered.map(a => a.id)).not.toContain('attend_lecture');

      // Student should see student actions
      const studentFiltered = filterActionsForJob(actions, createContext({}, { isScholar: true }));
      expect(studentFiltered.map(a => a.id)).toContain('attend_lecture');
    });
  });

  describe('getAvailableWorkActions', () => {
    it('should return only WORK actions available for the job', () => {
      const actions: GameAction[] = [
        createMockWorkAction({ id: 'universal', jobRequirements: { universal: true } }),
        createMockWorkAction({ id: 'corp_only', jobRequirements: { tracks: ['Corporate_L1'] } }),
        { id: 'skill_action', label: 'Skill', category: 'SKILL', energyCost: 10, moneyCost: 0, rewards: { skill: 5 } },
      ];

      const workActions: GameAction[] = getAvailableWorkActions(
        actions,
        createContext({ currentJobId: 'corp_junior' }),
      );

      expect(workActions).toHaveLength(2); // universal + corp_only (not skill_action)
      expect(workActions.every(a => a.category === 'WORK')).toBe(true);
    });
  });

  describe('purchased investments filtering', () => {
    it('should filter out already-purchased non-recurring INVEST actions', () => {
      const actions: GameAction[] = [
        {
          id: 'buy_keyboard',
          label: 'Keyboard',
          category: 'INVEST',
          energyCost: 10,
          moneyCost: 150,
          rewards: {},
          passiveBuff: { stat: 'skill', type: 'multiplier', value: 1.02, description: 'test' },
        },
        {
          id: 'buy_chair',
          label: 'Chair',
          category: 'INVEST',
          energyCost: 10,
          moneyCost: 1200,
          rewards: {},
          passiveBuff: { stat: 'stress', type: 'multiplier', value: 0.9, description: 'test' },
        },
        { id: 'skill_action', label: 'Skill', category: 'SKILL', energyCost: 10, moneyCost: 0, rewards: { skill: 5 } },
      ];

      // With keyboard already purchased
      const filtered = filterActionsForJob(actions, {
        career: { currentJobId: 'corp_junior', jobStartTick: 0, jobHistory: [] },
        flags: {},
        purchasedInvestments: ['buy_keyboard'],
      });

      expect(filtered.map(a => a.id)).not.toContain('buy_keyboard');
      expect(filtered.map(a => a.id)).toContain('buy_chair');
      expect(filtered.map(a => a.id)).toContain('skill_action');
    });

    it('should NOT filter recurring INVEST actions', () => {
      const actions: GameAction[] = [
        {
          id: 'hire_cleaner',
          label: 'Cleaner',
          category: 'INVEST',
          energyCost: 10,
          moneyCost: 250,
          rewards: {},
          isRecurring: true,
          passiveBuff: { stat: 'energy', type: 'flat', value: 15, description: 'test' },
        },
      ];

      // Even if somehow in purchasedInvestments, recurring should still appear
      const filtered = filterActionsForJob(actions, {
        career: { currentJobId: 'corp_junior', jobStartTick: 0, jobHistory: [] },
        flags: {},
        purchasedInvestments: ['hire_cleaner'],
      });

      expect(filtered.map(a => a.id)).toContain('hire_cleaner');
    });

    it('should show all INVEST actions when nothing purchased', () => {
      const actions: GameAction[] = [
        {
          id: 'buy_keyboard',
          label: 'Keyboard',
          category: 'INVEST',
          energyCost: 10,
          moneyCost: 150,
          rewards: {},
          passiveBuff: { stat: 'skill', type: 'multiplier', value: 1.02, description: 'test' },
        },
        {
          id: 'buy_chair',
          label: 'Chair',
          category: 'INVEST',
          energyCost: 10,
          moneyCost: 1200,
          rewards: {},
          passiveBuff: { stat: 'stress', type: 'multiplier', value: 0.9, description: 'test' },
        },
      ];

      const filtered = filterActionsForJob(actions, {
        career: { currentJobId: 'corp_junior', jobStartTick: 0, jobHistory: [] },
        flags: {},
        purchasedInvestments: [],
      });

      expect(filtered).toHaveLength(2);
    });
  });
});
