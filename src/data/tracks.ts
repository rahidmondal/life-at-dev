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
    rentRate: 0,
    energyCost: 0,
    roleDisplacement: 0,
    weeklyGains: {
      coding: 0,
      freelance: 1,
      reputation: 0,
    },
    notes: 'Starting state. No income. Living with parents or friends.',
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
    rentRate: 0.5,
    energyCost: 25,
    roleDisplacement: 0.2,
    weeklyGains: {
      coding: 3,
      politics: 1,
      corporate: 5,
    },
    notes: 'High energy cost. Cheap shared housing.',
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
    rentRate: 0.35,
    energyCost: 20,
    roleDisplacement: 0.3,
    weeklyGains: {
      coding: 5,
      politics: 2,
      corporate: 8,
    },
    notes: '"The First Job" hurdle. Decent studio apartment.',
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
    rentRate: 0.3,
    energyCost: 18,
    roleDisplacement: 0.4,
    weeklyGains: {
      coding: 8,
      politics: 3,
      corporate: 12,
    },
    notes: 'The "Grind" phase. Nice 1BR apartment.',
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
    rentRate: 0.28,
    energyCost: 15,
    roleDisplacement: 0.6,
    weeklyGains: {
      coding: 10,
      politics: 5,
      corporate: 15,
    },
    notes: 'Unlock Point: L2 Tracks (Management or IC). Premium apartment.',
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
    rentRate: 0,
    energyCost: 22,
    roleDisplacement: 0.25,
    weeklyGains: {
      coding: 4,
      freelance: 10,
      reputation: 3,
    },
    notes: 'Gigs unlock. High income volatility. Rent paid from gig money.',
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
    rentRate: 0,
    energyCost: 18,
    roleDisplacement: 0.35,
    weeklyGains: {
      coding: 6,
      freelance: 15,
      reputation: 5,
    },
    notes: 'Unlock Point: L2 Tracks (Business or Specialist). Rent paid from gig money.',
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
    rentRate: 0.25,
    energyCost: 20,
    roleDisplacement: 0.3,
    weeklyGains: {
      coding: 8,
      politics: 8,
      corporate: 20,
    },
    notes: 'Balancing code & meetings. Urban apartment.',
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
    rentRate: 0.22,
    energyCost: 22,
    roleDisplacement: 0.2,
    weeklyGains: {
      coding: 1,
      politics: 12,
      corporate: 25,
    },
    notes: 'Skill decay accelerates here. Nice house or condo.',
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
    rentRate: 0.2,
    energyCost: 25,
    roleDisplacement: 0.1,
    weeklyGains: {
      coding: 0,
      politics: 15,
      corporate: 30,
    },
    notes: 'Requires "Boss Interview" event. Terminal role. Luxury property.',
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
    rentRate: 0.26,
    energyCost: 18,
    roleDisplacement: 0.5,
    weeklyGains: {
      coding: 12,
      politics: 3,
      corporate: 15,
    },
    notes: '"Glue" work required. Upscale living.',
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
    rentRate: 0.24,
    energyCost: 15,
    roleDisplacement: 0.6,
    weeklyGains: {
      coding: 10,
      politics: 4,
      corporate: 18,
      reputation: 2,
    },
    notes: 'Harder to get than Manager. Premium property.',
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
    rentRate: 0.22,
    energyCost: 12,
    roleDisplacement: 0.7,
    weeklyGains: {
      coding: 12,
      politics: 5,
      corporate: 22,
      reputation: 5,
    },
    notes: '"Legendary" status. Terminal role. Elite housing.',
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
    rentRate: 0,
    energyCost: 25,
    roleDisplacement: 0.15,
    weeklyGains: {
      coding: 8,
      freelance: 18,
      reputation: 8,
    },
    notes: 'Requires hiring employees. High upside. Rent paid from gig money.',
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
    rentRate: 0,
    energyCost: 20,
    roleDisplacement: 0.1,
    weeklyGains: {
      coding: 1,
      freelance: 20,
      reputation: 15,
    },
    notes: 'Monetize "Reputation". Extreme volatility. Rent paid from gig money.',
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
    rentRate: 0,
    energyCost: 28,
    roleDisplacement: 0.05,
    weeklyGains: {
      coding: 0,
      freelance: 25,
      reputation: 20,
    },
    notes: 'The "Unicorn" ending. Terminal role. Rent paid from gig money.',
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
    rentRate: 0,
    energyCost: 20,
    roleDisplacement: 0.4,
    weeklyGains: {
      coding: 10,
      freelance: 12,
      reputation: 4,
    },
    notes: 'Mercenary work. High stable income. Rent paid from gig money.',
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
    rentRate: 0,
    energyCost: 18,
    roleDisplacement: 0.5,
    weeklyGains: {
      coding: 12,
      freelance: 15,
      reputation: 6,
    },
    notes: 'Fixes "Impossible" bugs. Very high income. Rent paid from gig money.',
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
    rentRate: 0,
    energyCost: 15,
    roleDisplacement: 0.55,
    weeklyGains: {
      coding: 15,
      freelance: 18,
      reputation: 8,
    },
    notes: 'The "Oracle" role. Retainer-based. Terminal role. Rent paid from gig money.',
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
