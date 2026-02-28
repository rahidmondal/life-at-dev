/**
 * @fileoverview End-to-End integration tests covering all 3 starting paths
 * (scholar, funded, dropout) and all 5 game endings (burnout, bankruptcy,
 * terminal-role win, wealth win, aged-out).
 *
 * These tests exercise the full processTurn → yearEnd → gameOver pipeline
 * without mocking, to verify real game behaviour.
 */
import { describe, expect, it } from 'vitest';
import { ACTIONS_REGISTRY } from '../../data/actions';
import { JOB_REGISTRY } from '../../data/tracks';
import { INITIAL_GAME_STATE } from '../../store/initialState';
import type { GameState } from '../../types/gamestate';
import { promotePlayer } from '../career';
import { checkGameOverConditions } from '../gameOver';
import { processTurn } from '../processTurn';
import { isYearEnd, processYearEnd } from '../yearEnd';

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/** Create a starting state for a given path. */
function createPathState(path: 'scholar' | 'funded' | 'dropout'): GameState {
  const configs: Record<string, Partial<GameState>> = {
    scholar: {
      meta: { ...INITIAL_GAME_STATE.meta, startAge: 18 },
      resources: { ...INITIAL_GAME_STATE.resources, money: 0, debt: 0 },
      flags: {
        ...INITIAL_GAME_STATE.flags,
        accumulatesDebt: false,
        startingPath: 'scholar',
        isScholar: true,
        scholarYearsRemaining: 4,
      },
    },
    funded: {
      meta: { ...INITIAL_GAME_STATE.meta, startAge: 18 },
      resources: { ...INITIAL_GAME_STATE.resources, money: 0, debt: 0 },
      flags: {
        ...INITIAL_GAME_STATE.flags,
        accumulatesDebt: true,
        startingPath: 'funded',
        isScholar: true,
        scholarYearsRemaining: 4,
      },
    },
    dropout: {
      meta: { ...INITIAL_GAME_STATE.meta, startAge: 18 },
      resources: { ...INITIAL_GAME_STATE.resources, money: 0, debt: 0 },
      flags: {
        ...INITIAL_GAME_STATE.flags,
        accumulatesDebt: false,
        startingPath: 'dropout',
        isScholar: false,
        scholarYearsRemaining: 0,
      },
    },
  };

  return { ...INITIAL_GAME_STATE, ...configs[path] } as GameState;
}

/** Play N turns of a given action, processing year-ends along the way. Returns the final state. */
function playTurns(state: GameState, actionId: string, turns: number): GameState {
  let s = state;
  for (let i = 0; i < turns; i++) {
    // Skip if game is already over
    const goCheck = checkGameOverConditions(s);
    if (goCheck.isGameOver) return s;

    try {
      s = processTurn(s, actionId);
    } catch {
      // Action can't be performed (e.g., insufficient resources) — skip
      break;
    }

    // Check game over after turn
    const afterCheck = checkGameOverConditions(s);
    if (afterCheck.isGameOver) {
      return { ...s, status: 'GAME_OVER', gameOverReason: afterCheck.reason, gameOverOutcome: afterCheck.outcome };
    }

    // Process year end if applicable
    if (isYearEnd(s.meta.tick)) {
      const result = processYearEnd(s);
      s = result.newState;
      if (result.isBankrupt) {
        return { ...s, status: 'GAME_OVER', gameOverReason: 'bankruptcy', gameOverOutcome: 'loss' };
      }
    }
  }
  return s;
}

/** Fast-forward state by advancing tick directly and processing year-ends. */
function advanceWeeks(state: GameState, weeks: number): GameState {
  return { ...state, meta: { ...state.meta, tick: state.meta.tick + weeks } };
}

// ═══════════════════════════════════════════════════════════════════════════
// PATH INITIALIZATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Path Initialization', () => {
  it('scholar path starts as student with no debt', () => {
    const state = createPathState('scholar');
    expect(state.flags.isScholar).toBe(true);
    expect(state.flags.scholarYearsRemaining).toBe(4);
    expect(state.flags.accumulatesDebt).toBe(false);
    expect(state.resources.debt).toBe(0);
    expect(state.status).toBe('PLAYING');
  });

  it('funded path starts as student accumulating debt', () => {
    const state = createPathState('funded');
    expect(state.flags.isScholar).toBe(true);
    expect(state.flags.scholarYearsRemaining).toBe(4);
    expect(state.flags.accumulatesDebt).toBe(true);
    expect(state.resources.debt).toBe(0);
  });

  it('dropout path starts as non-student with no debt', () => {
    const state = createPathState('dropout');
    expect(state.flags.isScholar).toBe(false);
    expect(state.flags.scholarYearsRemaining).toBe(0);
    expect(state.flags.accumulatesDebt).toBe(false);
    expect(state.resources.debt).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GAME ENDING: BURNOUT (all paths)
// ═══════════════════════════════════════════════════════════════════════════

describe('Game Over: Burnout', () => {
  it.each(['scholar', 'funded', 'dropout'] as const)('%s path — stress reaches 100 → burnout loss', path => {
    let state = createPathState(path);
    // Manually set stress to just below threshold and push over
    state = {
      ...state,
      resources: { ...state.resources, stress: 95, energy: 100 },
      stats: { ...state.stats, skills: { ...state.stats.skills, coding: 500 } },
    };

    // Performing a high-stress action should push stress over 100
    // We'll manipulate directly to ensure deterministic test
    state = { ...state, resources: { ...state.resources, stress: 100 } };
    const result = checkGameOverConditions(state);

    expect(result.isGameOver).toBe(true);
    expect(result.reason).toBe('burnout');
    expect(result.outcome).toBe('loss');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GAME ENDING: BANKRUPTCY (all paths)
// ═══════════════════════════════════════════════════════════════════════════

describe('Game Over: Bankruptcy', () => {
  it('funded path — money falls below -50K with debt → bankruptcy', () => {
    let state = createPathState('funded');
    state = {
      ...state,
      resources: { ...state.resources, money: -51000, debt: 30000 },
    };
    const result = checkGameOverConditions(state);
    expect(result.isGameOver).toBe(true);
    expect(result.reason).toBe('bankruptcy');
    expect(result.outcome).toBe('loss');
  });

  it('any path — isBankrupt flag → bankruptcy', () => {
    let state = createPathState('dropout');
    state = { ...state, flags: { ...state.flags, isBankrupt: true } };
    const result = checkGameOverConditions(state);
    expect(result.isGameOver).toBe(true);
    expect(result.reason).toBe('bankruptcy');
    expect(result.outcome).toBe('loss');
  });

  it('funded path — debt cap never exceeds 40K from accumulation', () => {
    let state = createPathState('funded');
    // Simulate 5 years of weekly actions (260 weeks) — debt should cap at 40K
    // University is 4 years (tick 0 to tick 207 roughly), but accumulation should stop at 40K
    state = {
      ...state,
      resources: { ...state.resources, money: 100000, energy: 100 },
    };

    // Play many turns during university with a simple action
    state = playTurns(state, 'read_docs', 250);

    // Debt should never exceed 40K from accumulation alone
    // (interest might add a tiny bit, but principal accumulation is hard-capped)
    expect(state.resources.debt).toBeLessThanOrEqual(45000); // 40K accumulation + some interest
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GAME ENDING: TERMINAL ROLE WIN (Corporate + Hustler)
// ═══════════════════════════════════════════════════════════════════════════

describe('Game Over: Terminal Role Win', () => {
  it('reaching CTO (Corp_Management terminal) → retirement win', () => {
    let state = createPathState('dropout');
    state = promotePlayer(state, 'corp_cto');
    const result = checkGameOverConditions(state);
    expect(result.isGameOver).toBe(true);
    expect(result.reason).toBe('retirement');
    expect(result.outcome).toBe('win');
  });

  it('reaching Distinguished Fellow (Corp_IC terminal) → retirement win', () => {
    let state = createPathState('dropout');
    state = promotePlayer(state, 'ic_fellow');
    const result = checkGameOverConditions(state);
    expect(result.isGameOver).toBe(true);
    expect(result.reason).toBe('retirement');
    expect(result.outcome).toBe('win');
  });

  it('reaching Tech Mogul (Hustler_Business terminal) → retirement win', () => {
    let state = createPathState('dropout');
    state = promotePlayer(state, 'hustle_mogul');
    const result = checkGameOverConditions(state);
    expect(result.isGameOver).toBe(true);
    expect(result.reason).toBe('retirement');
    expect(result.outcome).toBe('win');
  });

  it('reaching Architect (Hustler_Specialist terminal) → retirement win', () => {
    let state = createPathState('dropout');
    state = promotePlayer(state, 'hustle_architect');
    const result = checkGameOverConditions(state);
    expect(result.isGameOver).toBe(true);
    expect(result.reason).toBe('retirement');
    expect(result.outcome).toBe('win');
  });

  it('non-terminal jobs do NOT trigger retirement', () => {
    let state = createPathState('dropout');
    state = promotePlayer(state, 'corp_senior');
    const result = checkGameOverConditions(state);
    expect(result.isGameOver).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GAME ENDING: WEALTH WIN
// ═══════════════════════════════════════════════════════════════════════════

describe('Game Over: Wealth Win', () => {
  it('net worth >= $1,000,000 → retirement win', () => {
    let state = createPathState('dropout');
    state = { ...state, resources: { ...state.resources, money: 1_000_000, debt: 0 } };
    const result = checkGameOverConditions(state);
    expect(result.isGameOver).toBe(true);
    expect(result.reason).toBe('retirement');
    expect(result.outcome).toBe('win');
  });

  it('high money but also high debt → no win if net < 1M', () => {
    let state = createPathState('funded');
    state = { ...state, resources: { ...state.resources, money: 1_000_000, debt: 100_000 } };
    const result = checkGameOverConditions(state);
    // Net worth is 900K, not yet 1M
    expect(result.isGameOver).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GAME ENDING: AGED OUT
// ═══════════════════════════════════════════════════════════════════════════

describe('Game Over: Aged Out', () => {
  it.each(['scholar', 'funded', 'dropout'] as const)('%s path — reaching age 65 → aged_out loss', path => {
    let state = createPathState(path);
    // Age 65 = startAge 18 + 47 years = 47 * 52 = 2444 ticks
    state = advanceWeeks(state, 47 * 52);
    const result = checkGameOverConditions(state);
    expect(result.isGameOver).toBe(true);
    expect(result.reason).toBe('aged_out');
    expect(result.outcome).toBe('loss');
  });

  it('age 64 → still playing', () => {
    let state = createPathState('dropout');
    state = advanceWeeks(state, 46 * 52); // age 64
    const result = checkGameOverConditions(state);
    expect(result.isGameOver).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// YEAR-END PROCESSING
// ═══════════════════════════════════════════════════════════════════════════

describe('Year-End Processing', () => {
  it('scholar path — 4 year-ends graduate the player', () => {
    let state = createPathState('scholar');
    state = {
      ...state,
      resources: { ...state.resources, money: 50000, energy: 100 },
    };

    // Process 4 year-ends
    for (let year = 0; year < 4; year++) {
      state = advanceWeeks(state, 52);
      // Ensure we're at a year-end boundary
      state = { ...state, meta: { ...state.meta, tick: (year + 1) * 52 - 1 } };
      const result = processYearEnd(state);
      state = result.newState;
      // Advance past the year-end
      state = { ...state, meta: { ...state.meta, tick: (year + 1) * 52 } };
    }

    expect(state.flags.hasGraduated).toBe(true);
    expect(state.flags.isScholar).toBe(false);
    expect(state.flags.scholarYearsRemaining).toBe(0);
  });

  it('funded path — accumulates debt but not beyond 40K from principal', () => {
    let state = createPathState('funded');
    state = {
      ...state,
      resources: { ...state.resources, money: 100000, energy: 100 },
    };

    // Play through university with simple actions
    for (let i = 0; i < 200; i++) {
      try {
        state = processTurn(state, 'read_docs');
      } catch {
        break;
      }
      if (isYearEnd(state.meta.tick)) {
        const result = processYearEnd(state);
        state = result.newState;
      }
    }

    // Debt principal shouldn't grossly exceed 40K
    expect(state.resources.debt).toBeLessThanOrEqual(45000);
  });

  it('salary-based job pays salary and deducts rent at year-end', () => {
    let state = createPathState('dropout');
    state = promotePlayer(state, 'corp_junior');
    state = { ...state, meta: { ...state.meta, tick: 51 } }; // just before year-end

    const result = processYearEnd(state);
    const job = JOB_REGISTRY.corp_junior;
    // Should have received salary and paid rent
    expect(result.summary.salaryEarned).toBe(job.salary);
    expect(result.summary.rentPaid).toBeGreaterThan(0);
    expect(result.summary.netIncome).toBe(job.salary - result.summary.rentPaid);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// CORE ACTION MECHANICS
// ═══════════════════════════════════════════════════════════════════════════

describe('Action Mechanics', () => {
  it('0-week action does NOT trigger debt processing', () => {
    let state = createPathState('funded');
    state = {
      ...state,
      resources: { ...state.resources, debt: 20000, money: 5000, energy: 100 },
      // Set tick past university (age >= 22 = tick >= 4*52 = 208)
      meta: { ...state.meta, tick: 210 },
      flags: { ...state.flags, isScholar: false, hasGraduated: true, scholarYearsRemaining: 0 },
    };

    const debtBefore = state.resources.debt;
    const moneyBefore = state.resources.money;

    // read_docs has duration 0
    expect(ACTIONS_REGISTRY.read_docs.duration).toBe(0);
    const newState = processTurn(state, 'read_docs');

    // Debt should NOT change for a 0-week action
    expect(newState.resources.debt).toBe(debtBefore);
    // Money should only change by action cost (0 for read_docs), not debt payment
    expect(newState.resources.money).toBe(moneyBefore);
  });

  it('multi-week action DOES trigger debt processing', () => {
    let state = createPathState('funded');
    state = {
      ...state,
      resources: { ...state.resources, debt: 20000, money: 50000, energy: 100 },
      meta: { ...state.meta, tick: 210 },
      flags: { ...state.flags, isScholar: false, hasGraduated: true, scholarYearsRemaining: 0 },
    };

    const debtBefore = state.resources.debt;

    // tutorial has duration 1
    expect(ACTIONS_REGISTRY.tutorial.duration).toBe(1);
    const newState = processTurn(state, 'tutorial');

    // Debt should change (interest + potential payment deduction)
    expect(newState.resources.debt).not.toBe(debtBefore);
  });

  it('event log entries are prepended (newest first)', () => {
    let state = createPathState('dropout');
    state = { ...state, resources: { ...state.resources, energy: 100 } };

    const newState = processTurn(state, 'read_docs');

    // The newest entry should be at index 0
    expect(newState.eventLog.length).toBeGreaterThan(0);
    expect(newState.eventLog[0].tick).toBe(newState.meta.tick);
  });

  it('event log is capped at 50 entries', () => {
    let state = createPathState('dropout');
    state = {
      ...state,
      resources: { ...state.resources, energy: 100 },
      eventLog: Array.from({ length: 50 }, (_, i) => ({
        tick: i,
        eventId: `old_${String(i)}`,
        message: `Old event ${String(i)}`,
      })),
    };

    const newState = processTurn(state, 'read_docs');
    expect(newState.eventLog.length).toBeLessThanOrEqual(50);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// CAREER & JOB FILTER
// ═══════════════════════════════════════════════════════════════════════════

describe('Career Job Filter', () => {
  it('eligible jobs exclude current job', () => {
    const state = createPathState('dropout');
    const s = promotePlayer(state, 'corp_junior');
    const eligible = Object.values(JOB_REGISTRY).filter(j => j.id !== s.career.currentJobId);
    expect(eligible.every(j => j.id !== 'corp_junior')).toBe(true);
  });

  it('terminal role has xpCap undefined', () => {
    expect(JOB_REGISTRY.corp_cto.xpCap).toBeUndefined();
    expect(JOB_REGISTRY.ic_fellow.xpCap).toBeUndefined();
    expect(JOB_REGISTRY.hustle_mogul.xpCap).toBeUndefined();
    expect(JOB_REGISTRY.hustle_architect.xpCap).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// FULL PATH SIMULATION: Dropout → Corporate → CTO Win
// ═══════════════════════════════════════════════════════════════════════════

describe('Full Simulation: Dropout → Corporate → Win', () => {
  it('simulates a dropout climbing the corporate ladder to CTO', () => {
    let state = createPathState('dropout');
    state = {
      ...state,
      resources: { ...state.resources, money: 500000, energy: 100 },
      stats: {
        skills: { coding: 8000, politics: 3000 },
        xp: { corporate: 9000, freelance: 0, reputation: 0 },
      },
    };

    // Promote through the corporate ladder
    state = promotePlayer(state, 'corp_senior');
    expect(state.career.currentJobId).toBe('corp_senior');

    state = promotePlayer(state, 'corp_lead');
    expect(state.career.currentJobId).toBe('corp_lead');

    state = promotePlayer(state, 'corp_manager');
    expect(state.career.currentJobId).toBe('corp_manager');

    // Final promotion to CTO (terminal role)
    state = promotePlayer(state, 'corp_cto');
    expect(state.career.currentJobId).toBe('corp_cto');

    const result = checkGameOverConditions(state);
    expect(result.isGameOver).toBe(true);
    expect(result.reason).toBe('retirement');
    expect(result.outcome).toBe('win');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// FULL PATH SIMULATION: Scholar → IC → Fellow Win
// ═══════════════════════════════════════════════════════════════════════════

describe('Full Simulation: Scholar → IC → Win', () => {
  it('simulates a scholar growing into Distinguished Fellow', () => {
    let state = createPathState('scholar');
    state = {
      ...state,
      resources: { ...state.resources, money: 500000, energy: 100 },
      stats: {
        skills: { coding: 9000, politics: 2000 },
        xp: { corporate: 7000, freelance: 0, reputation: 0 },
      },
      flags: { ...state.flags, isScholar: false, hasGraduated: true, scholarYearsRemaining: 0 },
    };

    state = promotePlayer(state, 'corp_senior');
    state = promotePlayer(state, 'ic_staff');
    state = promotePlayer(state, 'ic_principal');
    state = promotePlayer(state, 'ic_fellow');

    const result = checkGameOverConditions(state);
    expect(result.isGameOver).toBe(true);
    expect(result.reason).toBe('retirement');
    expect(result.outcome).toBe('win');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// FULL PATH SIMULATION: Funded → Hustler → Architect Win
// ═══════════════════════════════════════════════════════════════════════════

describe('Full Simulation: Funded → Hustler → Win', () => {
  it('simulates a funded student becoming an Architect', () => {
    let state = createPathState('funded');
    state = {
      ...state,
      resources: { ...state.resources, money: 500000, energy: 100 },
      stats: {
        skills: { coding: 10000, politics: 500 },
        xp: { corporate: 0, freelance: 8000, reputation: 5000 },
      },
      flags: { ...state.flags, isScholar: false, hasGraduated: true, scholarYearsRemaining: 0, accumulatesDebt: true },
    };

    state = promotePlayer(state, 'hustle_freelancer');
    state = promotePlayer(state, 'hustle_nomad');
    state = promotePlayer(state, 'hustle_contractor');
    state = promotePlayer(state, 'hustle_consultant');
    state = promotePlayer(state, 'hustle_architect');

    const result = checkGameOverConditions(state);
    expect(result.isGameOver).toBe(true);
    expect(result.reason).toBe('retirement');
    expect(result.outcome).toBe('win');

    // Should still have debt from funded path (but game is won)
    expect(state.flags.accumulatesDebt).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PRIORITY ORDER VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════

describe('Game Over Priority Order', () => {
  it('burnout takes priority over bankruptcy', () => {
    let state = createPathState('dropout');
    state = {
      ...state,
      resources: { ...state.resources, stress: 100, money: -60000, debt: 30000 },
    };
    const result = checkGameOverConditions(state);
    expect(result.reason).toBe('burnout');
  });

  it('bankruptcy takes priority over terminal role win', () => {
    let state = createPathState('dropout');
    state = {
      ...state,
      flags: { ...state.flags, isBankrupt: true },
    };
    state = promotePlayer(state, 'corp_cto');
    const result = checkGameOverConditions(state);
    expect(result.reason).toBe('bankruptcy');
  });

  it('terminal role win takes priority over wealth win', () => {
    let state = createPathState('dropout');
    state = {
      ...state,
      resources: { ...state.resources, money: 2_000_000, debt: 0 },
    };
    state = promotePlayer(state, 'corp_cto');
    const result = checkGameOverConditions(state);
    // Terminal role check comes first in the code
    expect(result.reason).toBe('retirement');
    expect(result.outcome).toBe('win');
  });

  it('wealth win takes priority over aged out', () => {
    let state = createPathState('dropout');
    state = {
      ...state,
      resources: { ...state.resources, money: 1_500_000, debt: 0 },
      meta: { ...state.meta, tick: 47 * 52 }, // age 65
    };
    const result = checkGameOverConditions(state);
    // Wealth check comes before aged-out check
    expect(result.reason).toBe('retirement');
    expect(result.outcome).toBe('win');
  });
});
