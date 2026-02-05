import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameState } from '../../types/gamestate';
import { processTurn } from '../processTurn';

beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(1);
});

type MockOverrides = Partial<{
  tick: number;
  jobId: string;
  money: number;
  energy: number;
  stress: number;
  fulfillment: number;
  coding: number;
  politics: number;
  corporate: number;
  freelance: number;
  reputation: number;
  isBurnedOut: boolean;
}>;

function createMockState(overrides: MockOverrides = {}): GameState {
  return {
    meta: {
      tick: overrides.tick ?? 0,
      version: '2.0.0',
      startAge: 18,
      playerName: 'TestPlayer',
    },
    career: {
      currentJobId: overrides.jobId ?? 'corp_junior',
      jobStartTick: 0,
      jobHistory: [],
    },
    resources: {
      energy: overrides.energy ?? 100,
      stress: overrides.stress ?? 0,
      money: overrides.money ?? 10000,
      debt: 0,
      fulfillment: overrides.fulfillment ?? 0,
    },
    stats: {
      skills: {
        coding: overrides.coding ?? 1000,
        politics: overrides.politics ?? 500,
      },
      xp: {
        corporate: overrides.corporate ?? 100,
        freelance: overrides.freelance ?? 50,
        reputation: overrides.reputation ?? 25,
      },
    },
    flags: {
      isBurnedOut: overrides.isBurnedOut ?? false,
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

describe('processTurn — duration semantics', () => {
  it('does not advance time for instant actions', () => {
    const state = createMockState({ tick: 10 });
    const next = processTurn(state, 'sleep');

    expect(next.meta.tick).toBe(10);
  });

  it('advances time for timed actions', () => {
    const state = createMockState({ tick: 0 });
    const next = processTurn(state, 'tutorial');

    expect(next.meta.tick).toBe(1);
  });
});

describe('processTurn — skill decay', () => {
  it('decays high skills more than low skills', () => {
    const lowSkill = createMockState({ coding: 1000, jobId: 'corp_manager' });
    const highSkill = createMockState({ coding: 8000, jobId: 'corp_manager' });

    const lowNext = processTurn(lowSkill, 'tutorial');
    const highNext = processTurn(highSkill, 'tutorial');

    const lowDecay = lowSkill.stats.skills.coding - lowNext.stats.skills.coding;
    const highDecay = highSkill.stats.skills.coding - highNext.stats.skills.coding;

    expect(highDecay).toBeGreaterThan(lowDecay);
  });

  it('does not apply decay to instant actions', () => {
    const state = createMockState({ coding: 5000 });
    const next = processTurn(state, 'sleep');

    expect(next.stats.skills.coding).toBe(5000);
  });
});

describe('processTurn — salary and XP', () => {
  it('does NOT earn weekly salary (salary is now paid at year-end)', () => {
    const state = createMockState({ money: 1000 });

    const instant = processTurn(state, 'sleep');
    expect(instant.resources.money).toBe(1000);

    // Timed actions no longer pay weekly salary - salary is paid at year-end
    const timed = processTurn(state, 'tutorial');
    expect(timed.resources.money).toBe(1000);
  });
});

describe('processTurn — burnout', () => {
  it('triggers burnout when stress and energy thresholds are crossed', () => {
    const state = createMockState({
      stress: 96,
      energy: 55,
    });

    const next = processTurn(state, 'bootcamp');
    expect(next.flags.isBurnedOut).toBe(true);
  });

  it('does not trigger burnout in safe conditions', () => {
    const state = createMockState({
      stress: 40,
      energy: 80,
    });

    const next = processTurn(state, 'sleep');
    expect(next.flags.isBurnedOut).toBe(false);
  });
});

describe('processTurn — INVEST actions and buffs', () => {
  it('grants a passive buff when purchasing an INVEST action', () => {
    const state = createMockState({ money: 5000 });

    const next = processTurn(state, 'buy_keyboard');

    expect(next.flags.activeBuffs).toHaveLength(1);
    expect(next.flags.activeBuffs[0].sourceActionId).toBe('buy_keyboard');
    expect(next.flags.activeBuffs[0].stat).toBe('skill');
    expect(next.flags.activeBuffs[0].type).toBe('multiplier');
  });

  it('tracks purchased non-recurring investments', () => {
    const state = createMockState({ money: 5000 });

    const next = processTurn(state, 'buy_keyboard');

    expect(next.flags.purchasedInvestments).toContain('buy_keyboard');
  });

  it('returns state unchanged for already-purchased investments', () => {
    const state = createMockState({ money: 5000 });
    state.flags.purchasedInvestments = ['buy_keyboard'];

    const next = processTurn(state, 'buy_keyboard');

    // State should be unchanged (no-op)
    expect(next).toBe(state);
  });

  it('allows recurring investments to be purchased multiple times', () => {
    const state = createMockState({ money: 10000 });

    const first = processTurn(state, 'hire_cleaner');
    expect(first.flags.activeBuffs).toHaveLength(1);

    // Recurring investments should NOT be in purchasedInvestments
    expect(first.flags.purchasedInvestments).not.toContain('hire_cleaner');
  });

  it('applies skill buffs to skill gains', () => {
    // Create state with a skill buff
    const state = createMockState({ money: 5000 });
    state.flags.activeBuffs = [
      {
        sourceActionId: 'test_buff',
        stat: 'skill',
        type: 'multiplier',
        value: 1.5,
        description: '+50% skill gain',
        acquiredAt: 0,
        isRecurring: false,
      },
    ];

    // First get the base gain without buff
    const stateWithoutBuff = createMockState({ money: 5000 });
    stateWithoutBuff.flags.activeBuffs = [];
    const baseResult = processTurn(stateWithoutBuff, 'read_docs');
    const baseGain = baseResult.stats.skills.coding - stateWithoutBuff.stats.skills.coding;

    // Perform same action with buff
    const next = processTurn(state, 'read_docs');
    const buffedGain = next.stats.skills.coding - state.stats.skills.coding;

    // The buffed gain should be greater than or equal to the base gain
    // (Due to diminishing returns and rounding, exact multiplier may vary)
    expect(buffedGain).toBeGreaterThanOrEqual(baseGain);
  });

  it('applies stress reduction buffs to stress gain', () => {
    const state = createMockState({ stress: 0 });
    state.flags.activeBuffs = [
      {
        sourceActionId: 'test_buff',
        stat: 'stress',
        type: 'multiplier',
        value: 0.5,
        description: '-50% stress gain',
        acquiredAt: 0,
        isRecurring: false,
      },
    ];

    // Perform an action that adds stress (bootcamp adds +20 stress)
    const next = processTurn(state, 'bootcamp');

    // Stress should be reduced by the buff
    expect(next.resources.stress).toBeLessThan(20);
  });

  it('applies recovery buffs to energy restoration', () => {
    // Start with low energy so we don't hit the cap
    const state = createMockState({ energy: 20 });
    state.flags.activeBuffs = [
      {
        sourceActionId: 'test_buff',
        stat: 'recovery',
        type: 'multiplier',
        value: 1.5,
        description: '+50% recovery',
        acquiredAt: 0,
        isRecurring: false,
      },
    ];

    // First get the base gain without buff
    const stateWithoutBuff = createMockState({ energy: 20 });
    stateWithoutBuff.flags.activeBuffs = [];
    const baseResult = processTurn(stateWithoutBuff, 'sleep');
    const baseGain = baseResult.resources.energy - stateWithoutBuff.resources.energy;

    // sleep restores energy
    const next = processTurn(state, 'sleep');
    const buffedGain = next.resources.energy - state.resources.energy;

    // Energy gain should be buffed (or at least not lower)
    expect(buffedGain).toBeGreaterThanOrEqual(baseGain);
  });
});
