import 'fake-indexeddb/auto';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../db/db';
import type { GameState } from '../../types/gamestate';
import { createSave, deleteSave, generatePreview, listSaves, loadSave, updateSave } from '../gameStorage';

const createMockGameState = (overrides?: Partial<GameState>): GameState => ({
  meta: {
    version: '1.0.0',
    tick: 52,
    startAge: 18,
    playerName: 'TestPlayer',
  },
  resources: {
    money: 5000,
    debt: 0,
    stress: 45,
    energy: 10,
    fulfillment: 500,
  },
  stats: {
    skills: {
      coding: 100,
      politics: 50,
    },
    xp: {
      corporate: 0,
      freelance: 0,
      reputation: 0,
    },
  },
  career: {
    currentJobId: 'corp_junior',
    jobStartTick: 0,
    jobHistory: [],
  },
  flags: {
    isBurnedOut: false,
    streak: 0,
    cooldowns: {},
    accumulatesDebt: false,
    startingPath: null,
  },
  eventLog: [],
  ...overrides,
});

describe('gameStorage', () => {
  beforeEach(async () => {
    await db.saves.clear();
  });

  afterEach(async () => {
    await db.saves.clear();
  });

  describe('generatePreview', () => {
    it('should extract job title from JOB_REGISTRY', () => {
      const state = createMockGameState({ career: { currentJobId: 'corp_junior', jobStartTick: 0, jobHistory: [] } });
      const preview = generatePreview(state);
      expect(preview.jobTitle).toBe('Junior Dev');
    });

    it('should return "Unknown" for invalid job ID', () => {
      const state = createMockGameState({ career: { currentJobId: 'invalid_job', jobStartTick: 0, jobHistory: [] } });
      const preview = generatePreview(state);
      expect(preview.jobTitle).toBe('Unknown');
    });

    it('should calculate year and week from tick', () => {
      const state = createMockGameState({ meta: { version: '1.0.0', tick: 104, startAge: 18 } });
      const preview = generatePreview(state);
      expect(preview.year).toBe(3);
      expect(preview.week).toBe(1);
    });

    it('should extract money and stress from resources', () => {
      const state = createMockGameState({ resources: { money: 10000, stress: 75, energy: 10, fulfillment: 500 } });
      const preview = generatePreview(state);
      expect(preview.money).toBe(10000);
      expect(preview.stress).toBe(75);
    });
  });

  describe('createSave', () => {
    it('should return a valid UUID', async () => {
      const state = createMockGameState();
      const id = await createSave(state, false);
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should store the save in the database', async () => {
      const state = createMockGameState();
      const id = await createSave(state, false);

      const saved = await db.saves.get(id);
      expect(saved).toBeDefined();
      expect(saved?.data).toEqual(state);
    });

    it('should set isAutoSave correctly', async () => {
      const state = createMockGameState();

      const manualId = await createSave(state, false);
      const autoId = await createSave(state, true);

      const manual = await db.saves.get(manualId);
      const auto = await db.saves.get(autoId);

      expect(manual?.isAutoSave).toBe(false);
      expect(auto?.isAutoSave).toBe(true);
    });

    it('should set createdAt and updatedAt to the same value', async () => {
      const state = createMockGameState();
      const id = await createSave(state, false);

      const saved = await db.saves.get(id);
      expect(saved?.createdAt).toBe(saved?.updatedAt);
    });
  });

  describe('updateSave', () => {
    it('should update the save data', async () => {
      const state = createMockGameState();
      const id = await createSave(state, false);

      const updatedState = createMockGameState({
        resources: { money: 99999, stress: 10, energy: 10, fulfillment: 500 },
      });
      await updateSave(id, updatedState);

      const saved = await db.saves.get(id);
      expect(saved?.data.resources.money).toBe(99999);
    });

    it('should update updatedAt timestamp', async () => {
      const state = createMockGameState();
      const id = await createSave(state, false);

      const original = await db.saves.get(id);
      if (!original) throw new Error('Save should exist');
      const originalUpdatedAt = original.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 10));

      await updateSave(id, state);

      const updated = await db.saves.get(id);
      expect(updated?.updatedAt).toBeGreaterThan(originalUpdatedAt);
    });

    it('should preserve createdAt timestamp', async () => {
      const state = createMockGameState();
      const id = await createSave(state, false);

      const original = await db.saves.get(id);
      const originalCreatedAt = original?.createdAt;

      await updateSave(id, state);

      const updated = await db.saves.get(id);
      expect(updated?.createdAt).toBe(originalCreatedAt);
    });

    it('should throw error for non-existent save', async () => {
      const state = createMockGameState();
      await expect(updateSave('non-existent-id', state)).rejects.toThrow('Save not found');
    });
  });

  describe('loadSave', () => {
    it('should return the save by ID', async () => {
      const state = createMockGameState();
      const id = await createSave(state, false);

      const loaded = await loadSave(id);
      expect(loaded).toBeDefined();
      expect(loaded?.id).toBe(id);
    });

    it('should return undefined for non-existent ID', async () => {
      const loaded = await loadSave('non-existent-id');
      expect(loaded).toBeUndefined();
    });
  });

  describe('listSaves', () => {
    it('should return all saves sorted by updatedAt descending', async () => {
      const state = createMockGameState();

      const id1 = await createSave(state, false);
      await new Promise(resolve => setTimeout(resolve, 10));
      const id2 = await createSave(state, false);
      await new Promise(resolve => setTimeout(resolve, 10));
      const id3 = await createSave(state, false);

      const saves = await listSaves();

      expect(saves.length).toBe(3);
      expect(saves[0].id).toBe(id3);
      expect(saves[1].id).toBe(id2);
      expect(saves[2].id).toBe(id1);
    });

    it('should return empty array when no saves exist', async () => {
      const saves = await listSaves();
      expect(saves).toEqual([]);
    });
  });

  describe('deleteSave', () => {
    it('should remove the save from database', async () => {
      const state = createMockGameState();
      const id = await createSave(state, false);

      await deleteSave(id);

      const loaded = await loadSave(id);
      expect(loaded).toBeUndefined();
    });

    it('should not throw for non-existent ID', async () => {
      await expect(deleteSave('non-existent-id')).resolves.not.toThrow();
    });
  });
});
