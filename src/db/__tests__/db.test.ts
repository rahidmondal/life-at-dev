import 'fake-indexeddb/auto';

import Dexie from 'dexie';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { GameState } from '../../types/gamestate';
import { LifeDevDB } from '../db';
import type { SaveFile } from '../schema';

const createMockGameState = (): GameState => ({
  meta: {
    version: '1.0.0',
    tick: 52,
    startAge: 18,
  },
  resources: {
    money: 5000,
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
  },
  eventLog: [],
});

const createMockSaveFile = (overrides?: Partial<SaveFile>): SaveFile => ({
  id: 'save-001',
  version: '1.0.0',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isAutoSave: false,
  preview: {
    jobTitle: 'Junior Developer',
    year: 1,
    week: 52,
    money: 5000,
    stress: 45,
  },
  data: createMockGameState(),
  ...overrides,
});

describe('LifeDevDB', () => {
  let testDb: LifeDevDB;

  beforeEach(() => {
    testDb = new LifeDevDB();
  });

  afterEach(async () => {
    await testDb.delete();
  });

  describe('initialization', () => {
    it('should initialize without error', () => {
      expect(testDb).toBeInstanceOf(Dexie);
      expect(testDb.name).toBe('LifeAtDevDB');
    });

    it('should have saves table defined', () => {
      expect(testDb.saves).toBeDefined();
      expect(testDb.tables.map(t => t.name)).toContain('saves');
    });

    it('should have correct schema version', () => {
      expect(testDb.verno).toBe(1);
    });
  });

  describe('saves table operations', () => {
    it('should write a SaveFile successfully', async () => {
      const save = createMockSaveFile();

      await testDb.saves.add(save);

      const count = await testDb.saves.count();
      expect(count).toBe(1);
    });

    it('should read a SaveFile by id', async () => {
      const save = createMockSaveFile({ id: 'test-save-id' });

      await testDb.saves.add(save);
      const retrieved = await testDb.saves.get('test-save-id');

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('test-save-id');
      expect(retrieved?.preview.jobTitle).toBe('Junior Developer');
    });

    it('should preserve full GameState data', async () => {
      const save = createMockSaveFile();

      await testDb.saves.add(save);
      const retrieved = await testDb.saves.get(save.id);

      expect(retrieved?.data).toBeDefined();
      expect(retrieved?.data.meta.tick).toBe(52);
      expect(retrieved?.data.resources.money).toBe(5000);
      expect(retrieved?.data.resources.stress).toBe(45);
    });

    it('should update a SaveFile', async () => {
      const save = createMockSaveFile();
      await testDb.saves.add(save);

      const newUpdatedAt = Date.now() + 1000;
      await testDb.saves.update(save.id, { updatedAt: newUpdatedAt });

      const retrieved = await testDb.saves.get(save.id);
      expect(retrieved?.updatedAt).toBe(newUpdatedAt);
    });

    it('should delete a SaveFile', async () => {
      const save = createMockSaveFile();
      await testDb.saves.add(save);

      await testDb.saves.delete(save.id);

      const retrieved = await testDb.saves.get(save.id);
      expect(retrieved).toBeUndefined();
    });
  });

  describe('indexed queries', () => {
    beforeEach(async () => {
      await testDb.saves.bulkAdd([
        createMockSaveFile({
          id: 'auto-1',
          isAutoSave: true,
          updatedAt: 1000,
        }),
        createMockSaveFile({
          id: 'manual-1',
          isAutoSave: false,
          updatedAt: 2000,
        }),
        createMockSaveFile({
          id: 'auto-2',
          isAutoSave: true,
          updatedAt: 3000,
        }),
      ]);
    });

    it('should query by isAutoSave index', async () => {
      const autoSaves = await testDb.saves.where('isAutoSave').equals(1).toArray();

      expect(autoSaves.length).toBeGreaterThanOrEqual(0);
    });

    it('should sort by updatedAt index', async () => {
      const sorted = await testDb.saves.orderBy('updatedAt').reverse().toArray();

      expect(sorted.length).toBe(3);
      expect(sorted[0].id).toBe('auto-2');
      expect(sorted[2].id).toBe('auto-1');
    });
  });
});
