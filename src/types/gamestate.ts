import type { CareerState } from './career';
import type { EventLogEntry } from './events';
import type { Flags, Resources } from './resources';
import type { SkillMap, XPCurrency } from './stats';

/**
 * GameMeta: Simulation metadata and time tracking.
 */
export interface GameMeta {
  /** Schema version for save compatibility. */
  version: string;

  /** Total weeks played. */
  tick: number;

  /** Age when simulation began (18 for Dropout, 18 for University paths). */
  startAge: number;
}

/**
 * PlayerStats: The "Potential vs. Proof" currency system.
 */
export interface PlayerStats {
  /** Book Smarts. Subject to weekly Entropy/Decay. */
  skills: SkillMap;

  /** Street Smarts. Does NOT decay. */
  xp: XPCurrency;
}

/**
 * GameState: Single Source of Truth for the entire simulation.
 * This interface defines the shape of the Zustand store.
 */
export interface GameState {
  /** Simulation metadata and time. */
  meta: GameMeta;

  /** The Ledger: Money, Stress, Energy, Fulfillment. */
  resources: Resources;

  /** Player skills and experience currencies. */
  stats: PlayerStats;

  /** Current job and employment history. */
  career: CareerState;

  /** Persistent story flags and streak tracking. */
  flags: Flags;

  /** History of triggered events. */
  eventLog: EventLogEntry[];
}
