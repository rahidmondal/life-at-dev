/**
 * Resources: The Ledger - Numbers that fluctuate weekly.

/** Total weeks played. The simulation's heartbeat. */
export type GameTime = number;

export interface Resources {
  /** The Enabler. Buys time and speed. */
  money: number;

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

  /** Consecutive weeks of same action category. Triggers Flow State at 3+. */
  streak: number;

  /** Action cooldowns. Maps action ID to tick when cooldown expires. */
  cooldowns: Record<string, number>;
}
