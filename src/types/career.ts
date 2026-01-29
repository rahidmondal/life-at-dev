import type { SkillMap, XPCurrency } from './stats';

/**
 * Career Track Types.
 * L1 = Foundation tracks (shared early game).
 * L2 = Specialization tracks (unlocked at Senior Dev / Digital Nomad).
 */
export type TrackType =
  | 'Corporate_L1'
  | 'Hustler_L1'
  | 'Corp_Management'
  | 'Corp_IC'
  | 'Hustler_Business'
  | 'Hustler_Specialist';

/**
 * Income type for volatile Hustler jobs.
 */
export type IncomeType = 'salary' | 'volatile';

/**
 * JobNode: Static data for a role in the career graph.
 */
export interface JobNode {
  /** Unique identifier (e.g., 'corp_senior', 'hustle_freelancer'). */
  id: string;

  /** Display name shown in UI. */
  title: string;

  /** Role tier. 0-3 = L1 Foundation, 4-6 = L2 Specialization. */
  tier: number;

  /** Which career track this job belongs to. */
  track: TrackType;

  /** Yearly income in dollars. 0 for volatile income jobs. */
  salary: number;

  /** Income stability. 'salary' = fixed, 'volatile' = variable gig income. */
  incomeType: IncomeType;

  /** XP cap before promotion is required. undefined = no cap (terminal role). */
  xpCap?: number;

  /**
   * The "Edge" cost to obtain this job.
   * Maps to skill requirements (coding, politics) and XP requirements (corporate, freelance, reputation).
   */
  requirements: Partial<SkillMap & XPCurrency>;

  /** Notes about the job for UI/debug. */
  notes?: string;
}

/**
 * JobHistoryEntry: A record of employment for the Obituary/Eulogy system.
 */
export interface JobHistoryEntry {
  jobId: string;
  startTick: number;
  endTick: number;
}

/**
 * CareerState: Dynamic player state regarding their career progression.
 */
export interface CareerState {
  /** Current job node ID. */
  currentJobId: string;

  /** Employment history. Used for the Obituary/Eulogy at game end. */
  jobHistory: JobHistoryEntry[];
}
