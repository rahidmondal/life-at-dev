/**
 * Resources: The Ledger - Numbers that fluctuate weekly.
 */

/** Total weeks played. The simulation's heartbeat. */
export type GameTime = number;

/**
 * ActiveBuff: A passive buff currently active from an INVEST action.
 */
export interface ActiveBuff {
  /** ID of the action that granted this buff. */
  sourceActionId: string;
  /** Which stat is modified. */
  stat: 'stress' | 'skill' | 'xp' | 'energy' | 'recovery';
  /** Modifier type: 'multiplier' (e.g., 0.9 = -10%) or 'flat' (e.g., +5). */
  type: 'multiplier' | 'flat';
  /** The modifier value. */
  value: number;
  /** Human-readable description. */
  description: string;
  /** Tick when buff was acquired. */
  acquiredAt: number;
  /** Whether this is a recurring subscription (needs weekly payment). */
  isRecurring: boolean;
  /** Weekly cost if recurring. */
  weeklyCost?: number;
}

export interface Resources {
  /** The Enabler. Buys time and speed. */
  money: number;

  /** The Burden. Negative value representing student loan debt. Interest accrues. */
  debt: number;

  /** The Limiter. 0-50 Safe, 50-80 High Performance, 80-100 Danger Zone. */
  stress: number;

  /** Action Points. The currency of the week. Refreshes weekly. */
  energy: number;

  /** Hidden stat (0-10000). Tracks alignment with self. Required for 'Zen' ending. */
  fulfillment: number;
}

export interface Flags {
  /** Has the player hit 100 Stress? Permanently lowers Stress Resistance. */
  isBurnedOut: boolean;

  /** Is the player bankrupt? Game over condition. */
  isBankrupt: boolean;

  /** Consecutive years of missed debt payments. Triggers bankruptcy at 3. */
  consecutiveMissedPayments: number;

  /** Total lifetime missed debt payments. Affects credit rating. */
  totalMissedPayments: number;

  /** Consecutive weeks of same action category. Triggers Flow State at 3+. */
  streak: number;

  /** Action cooldowns. Maps action ID to tick when cooldown expires. */
  cooldowns: Record<string, number>;

  /** Whether this player's path accumulates debt during university years. */
  accumulatesDebt: boolean;

  /** The player's selected starting path. */
  startingPath: 'scholar' | 'funded' | 'dropout' | null;

  /** Whether the player is currently in college (scholar path). */
  isScholar: boolean;

  /** Remaining years of college for scholar path. 0 means graduated or not a scholar. */
  scholarYearsRemaining: number;

  /** Whether the player has completed their degree (scholar/funded paths). */
  hasGraduated: boolean;

  /** Set of investment action IDs that have been purchased (non-recurring). */
  purchasedInvestments: string[];

  /** Currently active passive buffs from INVEST actions. */
  activeBuffs: ActiveBuff[];
}
