/**
 * Action System Types.
 */

/** The five strategic intents for player actions. */
export type ActionCategory = 'SKILL' | 'WORK' | 'NETWORK' | 'RECOVER' | 'INVEST';

/**
 * ActionRewards: Delta changes applied when an action completes.
 * Positive = gain, Negative = reduce (e.g., stress: -10 heals stress).
 */
export interface ActionRewards {
  skill?: number;
  xp?: number;
  stress?: number;
  reputation?: number;
  fulfillment?: number;
  politics?: number;
  money?: number;
}

/**
 * ActionRequirements: Preconditions that must be met to perform the action.
 */
export interface ActionRequirements {
  money?: number;
  skill?: number;
  jobTier?: number;
}

/**
 * GameAction: Static definition for a player action ("Button").
 */
export interface GameAction {
  /** Unique identifier (e.g., 'read_docs', 'bootcamp'). */
  id: string;

  /** Display label shown in UI. */
  label: string;

  /** Strategic category this action belongs to. */
  category: ActionCategory;

  /** Energy cost to perform. 0 means free (e.g., sleep). */
  energyCost: number;

  /** Money cost in dollars. 0 means free. */
  moneyCost: number;

  /** Stat changes applied on completion. */
  rewards: ActionRewards;

  /** Optional preconditions. Action is locked if not met. */
  requirements?: ActionRequirements;

  /** Duration in weeks. 0 = instant, 1+ = multi-week commitment. */
  duration?: number;
}
