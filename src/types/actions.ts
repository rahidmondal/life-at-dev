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
  corporate?: number;
  freelance?: number;
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
 * JobRequirements: Conditions for filtering work actions by job context.
 * All conditions are OR-based (action shows if ANY condition matches).
 */
export interface JobRequirements {
  /** List of specific job IDs this action is available for. */
  jobIds?: string[];
  /** List of track names this action is available for (e.g., 'Corporate_L1'). */
  tracks?: string[];
  /** Minimum job tier required. */
  minTier?: number;
  /** Maximum job tier allowed. */
  maxTier?: number;
  /** Show for unemployed players. */
  unemployed?: boolean;
  /** Show for all jobs (universal action). */
  universal?: boolean;
  /** Show only for students (isScholar === true). */
  studentOnly?: boolean;
}

/**
 * PassiveBuff: Permanent modifier from INVEST actions.
 */
export interface PassiveBuff {
  /** Which stat is modified. */
  stat: 'stress' | 'skill' | 'xp' | 'energy' | 'recovery';
  /** Modifier type: 'multiplier' (e.g., 0.9 = -10%) or 'flat' (e.g., +5). */
  type: 'multiplier' | 'flat';
  /** The modifier value. */
  value: number;
  /** Human-readable description. */
  description: string;
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

  /** Job-based filtering for WORK actions. Defines which jobs can use this action. */
  jobRequirements?: JobRequirements;

  /** Duration in weeks. 0 = instant, 1+ = multi-week commitment. */
  duration?: number;

  /** Energy restored (for RECOVER actions). Mutually exclusive with energyCost > 0. */
  energyGain?: number;

  /** Passive buff granted permanently (for INVEST actions). */
  passiveBuff?: PassiveBuff;

  /** Whether this is a recurring cost (e.g., hire_cleaner at $250/week). */
  isRecurring?: boolean;
}
