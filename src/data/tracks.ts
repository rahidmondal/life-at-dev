import type { JobNode } from '../types/career';

/**
 * JOB_REGISTRY: Static definitions for all career graph nodes.
 */
export const JOB_REGISTRY: Record<string, JobNode> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // UNEMPLOYED STATE
  // ═══════════════════════════════════════════════════════════════════════════

  unemployed: {
    id: 'unemployed',
    title: 'Unemployed',
    tier: 0,
    track: 'Hustler_L1',
    salary: 0,
    incomeType: 'volatile',
    xpCap: 300,
    requirements: {},
    notes: 'Starting state. No income.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // L1: CORPORATE LADDER (Foundation)
  // Currency: Corporate XP + Politics
  // Linear path: Intern → Junior Dev → Mid Level Dev → Senior Dev
  // ═══════════════════════════════════════════════════════════════════════════

  corp_intern: {
    id: 'corp_intern',
    title: 'Intern',
    tier: 0,
    track: 'Corporate_L1',
    salary: 5200,
    incomeType: 'salary',
    xpCap: 200,
    requirements: { coding: 100 },
    notes: 'High energy cost.',
  },

  corp_junior: {
    id: 'corp_junior',
    title: 'Junior Dev',
    tier: 1,
    track: 'Corporate_L1',
    salary: 41600,
    incomeType: 'salary',
    xpCap: 1500,
    requirements: { coding: 500, corporate: 100 },
    notes: '"The First Job" hurdle.',
  },

  corp_mid: {
    id: 'corp_mid',
    title: 'Mid-Level Dev',
    tier: 2,
    track: 'Corporate_L1',
    salary: 78000,
    incomeType: 'salary',
    xpCap: 3000,
    requirements: { coding: 1500, corporate: 1000 },
    notes: 'The "Grind" phase.',
  },

  corp_senior: {
    id: 'corp_senior',
    title: 'Senior Dev',
    tier: 3,
    track: 'Corporate_L1',
    salary: 130000,
    incomeType: 'salary',
    xpCap: 4250,
    requirements: { coding: 3000, corporate: 2500, politics: 100 },
    notes: 'Unlock Point: L2 Tracks (Management or IC).',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // L1: HUSTLER PATH (Foundation)
  // Currency: Freelance XP + Reputation
  // Linear path: Unemployed → Freelancer → Digital Nomad
  // ═══════════════════════════════════════════════════════════════════════════

  hustle_freelancer: {
    id: 'hustle_freelancer',
    title: 'Freelancer',
    tier: 1,
    track: 'Hustler_L1',
    salary: 0,
    incomeType: 'volatile',
    xpCap: 2000,
    requirements: { coding: 600, freelance: 200, reputation: 50 },
    notes: 'Gigs unlock. High income volatility.',
  },

  hustle_nomad: {
    id: 'hustle_nomad',
    title: 'Digital Nomad',
    tier: 2,
    track: 'Hustler_L1',
    salary: 0,
    incomeType: 'volatile',
    xpCap: 3750,
    requirements: { coding: 2000, freelance: 1500, reputation: 500 },
    notes: 'Unlock Point: L2 Tracks (Business or Specialist).',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // L2: CORPORATE MANAGEMENT TRACK
  // Currency: Corporate XP + Politics
  // Focus: People, Power, and Budgets. Coding skill matters less.
  // Path: Team Lead → Manager → CTO
  // ═══════════════════════════════════════════════════════════════════════════

  corp_lead: {
    id: 'corp_lead',
    title: 'Team Lead',
    tier: 4,
    track: 'Corp_Management',
    salary: 169000,
    incomeType: 'salary',
    xpCap: 6250,
    requirements: { coding: 4500, corporate: 3500, politics: 250 },
    notes: 'Balancing code & meetings.',
  },

  corp_manager: {
    id: 'corp_manager',
    title: 'Manager',
    tier: 5,
    track: 'Corp_Management',
    salary: 208000,
    incomeType: 'salary',
    xpCap: 8500,
    requirements: { coding: 5000, corporate: 5000, politics: 500 },
    notes: 'Skill decay accelerates here.',
  },

  corp_cto: {
    id: 'corp_cto',
    title: 'CTO',
    tier: 6,
    track: 'Corp_Management',
    salary: 312000,
    incomeType: 'salary',
    xpCap: undefined,
    requirements: { coding: 7500, corporate: 8000, politics: 2000 },
    notes: 'Requires "Boss Interview" event. Terminal role.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // L2: CORPORATE IC TRACK (Individual Contributor)
  // Currency: Corporate XP + Skill (High Requirement)
  // Focus: Deep Tech, Architecture, and Legacy. Minimal politics.
  // Path: Staff Eng → Principal Eng → Distinguished Fellow
  // ═══════════════════════════════════════════════════════════════════════════

  ic_staff: {
    id: 'ic_staff',
    title: 'Staff Engineer',
    tier: 4,
    track: 'Corp_IC',
    salary: 156000,
    incomeType: 'salary',
    xpCap: 5500,
    requirements: { coding: 4000, corporate: 3000, politics: 200 },
    notes: '"Glue" work required.',
  },

  ic_principal: {
    id: 'ic_principal',
    title: 'Principal Engineer',
    tier: 5,
    track: 'Corp_IC',
    salary: 208000,
    incomeType: 'salary',
    xpCap: 6750,
    requirements: { coding: 5500, corporate: 4250, politics: 500 },
    notes: 'Harder to get than Manager.',
  },

  ic_fellow: {
    id: 'ic_fellow',
    title: 'Distinguished Fellow',
    tier: 6,
    track: 'Corp_IC',
    salary: 286000,
    incomeType: 'salary',
    xpCap: undefined,
    requirements: { coding: 7500, corporate: 6000, politics: 1000 },
    notes: '"Legendary" status. Terminal role.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // L2: HUSTLER BUSINESS TRACK
  // Currency: Reputation + Money (Asset Requirement)
  // Focus: Scale, Equity, and "The Exit". High risk of bankruptcy.
  // Path: Agency Owner → Influencer → Tech Mogul
  // ═══════════════════════════════════════════════════════════════════════════

  hustle_agency: {
    id: 'hustle_agency',
    title: 'Agency Owner',
    tier: 3,
    track: 'Hustler_Business',
    salary: 0,
    incomeType: 'volatile',
    xpCap: 6000,
    requirements: { coding: 4000, freelance: 4000, reputation: 2000 },
    notes: 'Requires hiring employees. High upside.',
  },

  hustle_influencer: {
    id: 'hustle_influencer',
    title: 'Influencer',
    tier: 4,
    track: 'Hustler_Business',
    salary: 0,
    incomeType: 'volatile',
    xpCap: 6750,
    requirements: { coding: 4500, freelance: 5000, reputation: 5000 },
    notes: 'Monetize "Reputation". Extreme volatility.',
  },

  hustle_mogul: {
    id: 'hustle_mogul',
    title: 'Tech Mogul',
    tier: 5,
    track: 'Hustler_Business',
    salary: 0,
    incomeType: 'volatile',
    xpCap: undefined,
    requirements: { coding: 7500, freelance: 6500, reputation: 6000 },
    notes: 'The "Unicorn" ending. Terminal role.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // L2: HUSTLER SPECIALIST TRACK
  // Currency: Skill + Niche XP (Specialized)
  // Focus: Niche expertise, High Hourly Rates, Low Overhead.
  // Path: Contractor → Consultant → Architect
  // ═══════════════════════════════════════════════════════════════════════════

  hustle_contractor: {
    id: 'hustle_contractor',
    title: 'Contractor',
    tier: 3,
    track: 'Hustler_Specialist',
    salary: 0,
    incomeType: 'volatile',
    xpCap: 5750,
    requirements: { coding: 4500, freelance: 3000, reputation: 1000 },
    notes: 'Mercenary work. High stable income.',
  },

  hustle_consultant: {
    id: 'hustle_consultant',
    title: 'Consultant',
    tier: 4,
    track: 'Hustler_Specialist',
    salary: 0,
    incomeType: 'volatile',
    xpCap: 7250,
    requirements: { coding: 6000, freelance: 5000, reputation: 2500 },
    notes: 'Fixes "Impossible" bugs. Very high income.',
  },

  hustle_architect: {
    id: 'hustle_architect',
    title: 'Architect',
    tier: 5,
    track: 'Hustler_Specialist',
    salary: 0,
    incomeType: 'volatile',
    xpCap: undefined,
    requirements: { coding: 9000, freelance: 7000, reputation: 4000 },
    notes: 'The "Oracle" role. Retainer-based. Terminal role.',
  },
};

/** Unemployed state - no job held. */
export const UNEMPLOYED_JOB_ID = 'unemployed';

/** L1 Foundation tracks - shared early game progression. */
export const L1_TRACKS = ['Corporate_L1', 'Hustler_L1'] as const;

/** L2 Specialization tracks - unlocked after reaching Senior Dev / Digital Nomad. */
export const L2_TRACKS = ['Corp_Management', 'Corp_IC', 'Hustler_Business', 'Hustler_Specialist'] as const;

/** Jobs that unlock L2 track selection ("The Crossroads" event). */
export const L2_UNLOCK_JOBS = ['corp_senior', 'hustle_nomad'] as const;
