import { describe, expect, it } from 'vitest';
import { JOB_REGISTRY, UNEMPLOYED_JOB_ID } from '../data/tracks';
import { INITIAL_GAME_STATE } from '../store/initialState';
import type { TrackType } from './career';
import type { GameState } from './gamestate';

/**
 * Phase 5: Verification Test Suite
 * Validates static data integrity and initial state configuration.
 */

const MAX_SKILL_CAP = 10_000;
const VALID_TRACKS: TrackType[] = ['IC', 'Management', 'Hustler'];

describe('JOB_REGISTRY Integrity', () => {
  const jobEntries = Object.entries(JOB_REGISTRY);
  const jobIds = Object.keys(JOB_REGISTRY);

  it('should have no duplicate job IDs', () => {
    const uniqueIds = new Set(jobIds);
    expect(uniqueIds.size).toBe(jobIds.length);
  });

  it('should have matching key and id for each job', () => {
    for (const [key, job] of jobEntries) {
      expect(job.id).toBe(key);
    }
  });

  it('should have valid track type for every job', () => {
    for (const [_id, job] of jobEntries) {
      expect(VALID_TRACKS).toContain(job.track);
    }
  });

  it('should have non-negative salary for every job', () => {
    for (const [_id, job] of jobEntries) {
      expect(job.salary).toBeGreaterThanOrEqual(0);
    }
  });

  it('should have tier between 0 and 6 for every job', () => {
    for (const [_id, job] of jobEntries) {
      expect(job.tier).toBeGreaterThanOrEqual(0);
      expect(job.tier).toBeLessThanOrEqual(6);
    }
  });

  it('should have valid requirements (no negative values)', () => {
    for (const [_id, job] of jobEntries) {
      const reqs = job.requirements;
      if (reqs.coding !== undefined) expect(reqs.coding).toBeGreaterThanOrEqual(0);
      if (reqs.politics !== undefined) expect(reqs.politics).toBeGreaterThanOrEqual(0);
      if (reqs.corporate !== undefined) expect(reqs.corporate).toBeGreaterThanOrEqual(0);
      if (reqs.freelance !== undefined) expect(reqs.freelance).toBeGreaterThanOrEqual(0);
      if (reqs.reputation !== undefined) expect(reqs.reputation).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('Gameplay Logic & Reachability', () => {
  describe('CTO Hard Cap Validation', () => {
    const cto = JOB_REGISTRY.corp_cto;

    it('should have CTO job defined', () => {
      expect(cto).toBeDefined();
    });

    it('should have CTO skill requirement <= 10,000 (achievable)', () => {
      expect(cto.requirements.coding).toBeLessThanOrEqual(MAX_SKILL_CAP);
    });

    it('should have CTO politics requirement <= 10,000 (achievable)', () => {
      expect(cto.requirements.politics).toBeLessThanOrEqual(MAX_SKILL_CAP);
    });

    it('should have CTO at tier 6 (highest corporate tier)', () => {
      expect(cto.tier).toBe(6);
    });
  });

  describe('Senior Dev Politics Gate', () => {
    const senior = JOB_REGISTRY.corp_senior;

    it('should have Senior Dev job defined', () => {
      expect(senior).toBeDefined();
    });

    it('should require politics > 0 (politics becomes relevant at Senior+)', () => {
      expect(senior.requirements.politics).toBeGreaterThan(0);
    });

    it('should be tier 3', () => {
      expect(senior.tier).toBe(3);
    });
  });

  describe('Tech Mogul Reachability (Hustler Track)', () => {
    const mogul = JOB_REGISTRY.hustle_mogul;

    it('should have Tech Mogul job defined', () => {
      expect(mogul).toBeDefined();
    });

    it('should have skill requirement <= 10,000 (achievable)', () => {
      expect(mogul.requirements.coding).toBeLessThanOrEqual(MAX_SKILL_CAP);
    });

    it('should have reputation requirement <= 10,000 (achievable)', () => {
      expect(mogul.requirements.reputation).toBeLessThanOrEqual(MAX_SKILL_CAP);
    });
  });

  describe('Career Progression Logic', () => {
    it('should have higher tier jobs require more skill', () => {
      const managementJobs = Object.values(JOB_REGISTRY)
        .filter(job => job.track === 'Management')
        .sort((a, b) => a.tier - b.tier);

      for (let i = 1; i < managementJobs.length; i++) {
        const prev = managementJobs[i - 1];
        const curr = managementJobs[i];
        const prevSkill = prev.requirements.coding ?? 0;
        const currSkill = curr.requirements.coding ?? 0;
        expect(currSkill).toBeGreaterThanOrEqual(prevSkill);
      }
    });

    it('should have higher tier corporate jobs require more corporate XP', () => {
      const managementJobs = Object.values(JOB_REGISTRY)
        .filter(job => job.track === 'Management' && job.tier > 0)
        .sort((a, b) => a.tier - b.tier);

      for (let i = 1; i < managementJobs.length; i++) {
        const prev = managementJobs[i - 1];
        const curr = managementJobs[i];
        const prevXp = prev.requirements.corporate ?? 0;
        const currXp = curr.requirements.corporate ?? 0;
        expect(currXp).toBeGreaterThanOrEqual(prevXp);
      }
    });
  });
});

describe('INITIAL_GAME_STATE Validity', () => {
  const state: GameState = INITIAL_GAME_STATE;

  describe('Meta Properties', () => {
    it('should have tick at 0', () => {
      expect(state.meta.tick).toBe(0);
    });

    it('should have startAge at 18', () => {
      expect(state.meta.startAge).toBe(18);
    });

    it('should have version string', () => {
      expect(state.meta.version).toBeDefined();
      expect(typeof state.meta.version).toBe('string');
    });
  });

  describe('Resources Baseline', () => {
    it('should have stress at 0', () => {
      expect(state.resources.stress).toBe(0);
    });

    it('should have energy at 100 (full capacity)', () => {
      expect(state.resources.energy).toBe(100);
    });

    it('should have money at 0', () => {
      expect(state.resources.money).toBe(0);
    });

    it('should have fulfillment at 0', () => {
      expect(state.resources.fulfillment).toBe(0);
    });
  });

  describe('Stats Baseline', () => {
    it('should have coding skill at 0', () => {
      expect(state.stats.skills.coding).toBe(0);
    });

    it('should have politics skill at 0', () => {
      expect(state.stats.skills.politics).toBe(0);
    });

    it('should have all XP types at 0', () => {
      expect(state.stats.xp.corporate).toBe(0);
      expect(state.stats.xp.freelance).toBe(0);
      expect(state.stats.xp.reputation).toBe(0);
    });
  });

  describe('Career Baseline', () => {
    it('should start unemployed', () => {
      expect(state.career.currentJobId).toBe(UNEMPLOYED_JOB_ID);
    });

    it('should have empty job history', () => {
      expect(state.career.jobHistory).toEqual([]);
    });

    it('should have unemployed job in registry', () => {
      expect(JOB_REGISTRY[UNEMPLOYED_JOB_ID]).toBeDefined();
    });
  });

  describe('Flags Baseline', () => {
    it('should not be burned out', () => {
      expect(state.flags.isBurnedOut).toBe(false);
    });

    it('should not have met co-founder', () => {
      expect(state.flags.hasMetCoFounder).toBe(false);
    });

    it('should have streak at 0', () => {
      expect(state.flags.streak).toBe(0);
    });

    it('should have empty cooldowns', () => {
      expect(state.flags.cooldowns).toEqual({});
    });
  });
});
