/**
 * Stats: Potential (Skill) vs. Proof (XP)

/**
 * SkillMap: "Book Smarts" - Allows you to pass the interview.
 * Subject to weekly Entropy/Decay.
 */
export interface SkillMap {
  /** Technical ability (0-10000). Decays faster at higher levels. */
  coding: number;

  /** Office navigation ability (0-10000). Required for Senior+ Corporate roles. */
  politics: number;
}

/**
 * XPCurrency: "Street Smarts" - Allows you to get the promotion.
 * Does NOT decay.
 */
export interface XPCurrency {
  /** Accumulated by working Corporate jobs. */
  corporate: number;

  /** Accumulated by working Gigs/Contracts. */
  freelance: number;

  /** Global fame/Clout. Required for Lateral Moves and 'Legend' ending. */
  reputation: number;
}
