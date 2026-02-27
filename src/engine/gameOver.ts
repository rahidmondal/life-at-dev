/**
 * @fileoverview Game Over Engine — Pure, deterministic checks for win/loss conditions.
 *
 * Checked after every turn (and after job changes) as a middleware step.
 * Does NOT mutate state — returns a verdict that the store applies.
 */

import { JOB_REGISTRY } from '../data/tracks';
import type { GameState } from '../types/gamestate';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type GameOverReason = 'burnout' | 'bankruptcy' | 'retirement' | 'aged_out';

// ═══════════════════════════════════════════════════════════════════════════
// THRESHOLDS
// ═══════════════════════════════════════════════════════════════════════════

/** Stress at or above this value → burnout loss. */
const STRESS_BURNOUT_THRESHOLD = 100;

/** Net worth (money − debt) at or above this value → wealth win. */
const WEALTH_WIN_THRESHOLD = 1_000_000;

/** Player age at or above this → aged-out loss. */
const MAX_AGE = 65;

/** Bankruptcy debt-to-money ratio: money below -(this * salary) → bankruptcy. */
const BANKRUPTCY_DEBT_MONEY_RATIO = -50_000;

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════

export interface GameOverCheckResult {
  isGameOver: boolean;
  reason: GameOverReason | null;
  outcome: 'win' | 'loss' | null;
}

/**
 * Evaluate the current state for any end-game condition.
 *
 * **Order matters** — earlier checks take priority:
 * 1. Burnout  (loss)  — stress ≥ 100
 * 2. Bankruptcy (loss)  — isBankrupt flag (set by year-end) OR extreme negative money + debt
 * 3. Terminal role (win) — xpCap === undefined (CTO, Fellow, Mogul, Architect)
 * 4. Wealth    (win)  — net worth ≥ $1 000 000
 * 5. Aged out  (loss)  — age ≥ 65
 */
export function checkGameOverConditions(state: GameState): GameOverCheckResult {
  const NO_GAME_OVER: GameOverCheckResult = { isGameOver: false, reason: null, outcome: null };

  // 1. Loss — Burnout
  if (state.resources.stress >= STRESS_BURNOUT_THRESHOLD) {
    return { isGameOver: true, reason: 'burnout', outcome: 'loss' };
  }

  // 2. Loss — Bankruptcy (flag set by year-end, or extreme negative money with high debt)
  if (state.flags.isBankrupt) {
    return { isGameOver: true, reason: 'bankruptcy', outcome: 'loss' };
  }

  if (state.resources.money < BANKRUPTCY_DEBT_MONEY_RATIO && state.resources.debt > 0) {
    return { isGameOver: true, reason: 'bankruptcy', outcome: 'loss' };
  }

  // 3. Win — Terminal career role
  const job = JOB_REGISTRY[state.career.currentJobId] as (typeof JOB_REGISTRY)[string] | undefined;
  if (job !== undefined && job.xpCap === undefined && job.id !== 'unemployed') {
    return { isGameOver: true, reason: 'retirement', outcome: 'win' };
  }

  // 4. Win — Wealth threshold
  const netWorth = state.resources.money - state.resources.debt;
  if (netWorth >= WEALTH_WIN_THRESHOLD) {
    return { isGameOver: true, reason: 'retirement', outcome: 'win' };
  }

  // 5. Loss — Aged out
  const age = state.meta.startAge + Math.floor(state.meta.tick / 52);
  if (age >= MAX_AGE) {
    return { isGameOver: true, reason: 'aged_out', outcome: 'loss' };
  }

  return NO_GAME_OVER;
}
