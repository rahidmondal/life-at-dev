import { describe, expect, it } from 'vitest';
import type { GameState } from '../../types/gamestate';
import {
  generateActionMessage,
  generateBankruptcyWarning,
  generateEventLogEntry,
  generateJobChangeMessage,
  generateYearEndMessage,
} from '../eventLog';

/**
 * Test helper: Creates a minimal GameState for testing.
 */
function createMockState(overrides: Partial<GameState> = {}): GameState {
  return {
    meta: { tick: 52, startAge: 22, version: '1.0.0', playerName: 'TestPlayer' },
    resources: { energy: 70, stress: 30, money: 5000, debt: 0, fulfillment: 100 },
    stats: {
      skills: { coding: 500, politics: 50 },
      xp: { corporate: 100, freelance: 50, reputation: 25 },
    },
    career: { currentJobId: 'corp_junior', jobStartTick: 0, jobHistory: [] },
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
    status: 'PLAYING',
    gameOverReason: null,
    gameOverOutcome: null,
    ...overrides,
  };
}

describe('eventLog', () => {
  describe('generateActionMessage', () => {
    it('should generate a message for SKILL actions', () => {
      const state = createMockState();
      const message = generateActionMessage('read_docs', 'Read Documentation', 'SKILL', state, {
        skill: 5,
        energy: -10,
        stress: 2,
      });

      expect(message).toBeDefined();
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(10);
    });

    it('should generate a message for WORK actions', () => {
      const state = createMockState();
      const message = generateActionMessage('corp_ticket', 'Fix Jira Ticket', 'WORK', state, {
        xp: 20,
        energy: -30,
        stress: 15,
      });

      expect(message).toBeDefined();
      expect(typeof message).toBe('string');
    });

    it('should generate a message for RECOVER actions', () => {
      const state = createMockState();
      const message = generateActionMessage('sleep', 'Rest', 'RECOVER', state, {
        energy: 30,
        stress: -10,
      });

      expect(message).toBeDefined();
      expect(typeof message).toBe('string');
    });

    it('should include delta information in the message', () => {
      const state = createMockState();
      const message = generateActionMessage('course_paid', 'Buy Udemy Course', 'SKILL', state, {
        skill: 35,
        money: -50,
      });

      // Message should contain some indication of changes
      expect(message).toBeDefined();
    });
  });

  describe('generateEventLogEntry', () => {
    it('should return an EventLogEntry with tick, eventId, and message', () => {
      const state = createMockState({ meta: { tick: 10, startAge: 22, version: '1.0.0', playerName: 'TestPlayer' } });
      const entry = generateEventLogEntry('gig_fix', 'Quick Fix Gig', 'WORK', state, {
        xp: 10,
        money: 100,
      });

      expect(entry).toHaveProperty('tick', 10);
      expect(entry).toHaveProperty('eventId');
      expect(entry.eventId).toContain('action_gig_fix');
      expect(entry).toHaveProperty('message');
      expect(entry.message.length).toBeGreaterThan(0);
    });

    it('should set work suffix for WORK category', () => {
      const state = createMockState();
      const entry = generateEventLogEntry('corp_ticket', 'Fix Jira Ticket', 'WORK', state, {});

      expect(entry.eventId).toContain('_work');
    });

    it('should set recover suffix for RECOVER category', () => {
      const state = createMockState();
      const entry = generateEventLogEntry('sleep', 'Rest', 'RECOVER', state, {});

      expect(entry.eventId).toContain('_recover');
    });

    it('should set flow suffix when in flow state', () => {
      const state = createMockState({
        resources: { energy: 95, stress: 10, money: 5000, debt: 0, fulfillment: 100 },
      });
      const entry = generateEventLogEntry('read_docs', 'Read Documentation', 'SKILL', state, {});

      expect(entry.eventId).toContain('_flow');
    });

    it('should set broke suffix for large money loss', () => {
      const state = createMockState();
      const entry = generateEventLogEntry('vacation', 'Take Vacation', 'RECOVER', state, {
        money: -2000,
      });

      expect(entry.eventId).toContain('_broke');
    });
  });

  describe('generateYearEndMessage', () => {
    it('should generate a year-end summary with salary, rent, and net income', () => {
      const entry = generateYearEndMessage(2024, 50000, 15000, 35000, 'Junior Dev');

      expect(entry.tick).toBe(2024 * 52);
      expect(entry.eventId).toBe('year_end_summary');
      expect(entry.message).toContain('2024');
      expect(entry.message).toContain('50,000');
      expect(entry.message).toContain('15,000');
      expect(entry.message).toContain('Junior Dev');
    });

    it('should handle negative net income', () => {
      const entry = generateYearEndMessage(2024, 30000, 40000, -10000, 'Freelancer');

      expect(entry.message).toContain('Net loss');
      expect(entry.message).toContain('10,000');
    });
  });

  describe('generateBankruptcyWarning', () => {
    it('should generate critical warning at 90%+ debt', () => {
      const entry = generateBankruptcyWarning(45000, 50000);

      expect(entry.eventId).toBe('debt_warning');
      expect(entry.message).toContain('CRITICAL');
      expect(entry.message).toContain('90%');
    });

    it('should generate warning at 75-90% debt', () => {
      const entry = generateBankruptcyWarning(40000, 50000);

      expect(entry.message).toContain('WARNING');
      expect(entry.message).toContain('80%');
    });

    it('should generate notice at 50-75% debt', () => {
      const entry = generateBankruptcyWarning(30000, 50000);

      expect(entry.message).toContain('NOTICE');
      expect(entry.message).toContain('60%');
    });

    it('should generate info at low debt levels', () => {
      const entry = generateBankruptcyWarning(10000, 50000);

      expect(entry.message).toContain('INFO');
      expect(entry.message).toContain('Manageable');
    });
  });

  describe('generateJobChangeMessage', () => {
    it('should generate a promotion message', () => {
      const entry = generateJobChangeMessage('Junior Dev', 'Mid-Level Dev', 78000);

      expect(entry.eventId).toBe('job_change_success');
      expect(entry.message).toContain('Junior Dev');
      expect(entry.message).toContain('Mid-Level Dev');
      expect(entry.message).toContain('78,000');
    });
  });
});
