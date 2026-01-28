import type { SkillMap, XPCurrency } from './stats';

/**
 * Career Track Types.
 * IC = Individual Contributor (Staff/Principal path).
 * Management = Corporate Ladder (Lead/Manager/CTO path).
 * Hustler = Startup/Freelance (Freedom & Risk path).
 */
export type TrackType = 'IC' | 'Management' | 'Hustler';

/**
 * JobNode: Static data for a role in the career graph.
 */
export interface JobNode {
  /** Unique identifier (e.g., 'corp_senior_dev', 'hustler_freelancer'). */
  id: string;

  /** Display name shown in UI. */
  title: string;

  /** Role tier. 0 = Intern/Script Kiddie, 6 = CTO/Tech Mogul. */
  tier: number;

  /** Which career track this job belongs to. */
  track: TrackType;

  /** Weekly income in dollars. */
  salary: number;

  /**
   * The "Edge" cost to obtain this job.
   * Partial because not all jobs require all stats (e.g., Intern needs no XP).
   */
  requirements: Partial<SkillMap & XPCurrency>;
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
