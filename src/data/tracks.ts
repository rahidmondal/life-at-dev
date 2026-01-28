import type { JobNode } from '../types/career';

/**
 * JOB_REGISTRY: Static definitions for all career graph nodes.
 */
export const JOB_REGISTRY: Record<string, JobNode> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // TRACK A: Corporate Ladder - Management Track
  // Currency: Corporate XP + Politics
  // ═══════════════════════════════════════════════════════════════════════════

  corp_intern: {
    id: 'corp_intern',
    title: 'Intern',
    tier: 0,
    track: 'Management',
    salary: 5200,
    requirements: { coding: 100 },
  },

  corp_junior: {
    id: 'corp_junior',
    title: 'Junior Dev',
    tier: 1,
    track: 'Management',
    salary: 41600,
    requirements: { coding: 500, corporate: 100 },
  },

  corp_mid: {
    id: 'corp_mid',
    title: 'Mid-Level Dev',
    tier: 2,
    track: 'Management',
    salary: 78000,
    requirements: { coding: 1500, corporate: 1000 },
  },

  corp_senior: {
    id: 'corp_senior',
    title: 'Senior Dev',
    tier: 3,
    track: 'Management',
    salary: 250000,
    requirements: { coding: 3000, corporate: 2500, politics: 100 },
  },

  corp_lead: {
    id: 'corp_lead',
    title: 'Team Lead',
    tier: 4,
    track: 'Management',
    salary: 325000,
    requirements: { coding: 4500, corporate: 3500, politics: 250 },
  },

  corp_manager: {
    id: 'corp_manager',
    title: 'Manager',
    tier: 5,
    track: 'Management',
    salary: 400000,
    requirements: { coding: 5000, corporate: 5000, politics: 500 },
  },

  corp_cto: {
    id: 'corp_cto',
    title: 'CTO',
    tier: 6,
    track: 'Management',
    salary: 600000,
    requirements: { coding: 7500, corporate: 8000, politics: 2000 },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TRACK B: Hustler's Path - Business Track
  // Currency: Freelance XP + Reputation
  // ═══════════════════════════════════════════════════════════════════════════

  hustle_script_kiddie: {
    id: 'hustle_script_kiddie',
    title: 'Script Kiddie',
    tier: 0,
    track: 'Hustler',
    salary: 0,
    requirements: { coding: 50 },
  },

  hustle_freelancer: {
    id: 'hustle_freelancer',
    title: 'Freelancer',
    tier: 1,
    track: 'Hustler',
    salary: 0,
    requirements: { coding: 600, freelance: 200, reputation: 50 },
  },

  hustle_consultant: {
    id: 'hustle_consultant',
    title: 'Consultant',
    tier: 2,
    track: 'Hustler',
    salary: 0,
    requirements: { coding: 2000, freelance: 1500, reputation: 500 },
  },

  hustle_agency: {
    id: 'hustle_agency',
    title: 'Agency Owner',
    tier: 3,
    track: 'Hustler',
    salary: 0,
    requirements: { coding: 4000, freelance: 4000, reputation: 2000 },
  },

  hustle_founder: {
    id: 'hustle_founder',
    title: 'Indie Founder',
    tier: 4,
    track: 'Hustler',
    salary: 0,
    requirements: { coding: 6000, freelance: 5000, reputation: 4000 },
  },

  hustle_mogul: {
    id: 'hustle_mogul',
    title: 'Tech Mogul',
    tier: 5,
    track: 'Hustler',
    salary: 0,
    requirements: { coding: 7500, freelance: 6500, reputation: 6000 },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TRACK C: Corporate Ladder - IC Track
  // Currency: Corporate XP + Politics
  // ═══════════════════════════════════════════════════════════════════════════

  ic_intern: {
    id: 'ic_intern',
    title: 'Intern',
    tier: 0,
    track: 'IC',
    salary: 5200,
    requirements: { coding: 100 },
  },

  ic_junior: {
    id: 'ic_junior',
    title: 'Junior Dev',
    tier: 1,
    track: 'IC',
    salary: 41600,
    requirements: { coding: 500, corporate: 100 },
  },

  ic_mid: {
    id: 'ic_mid',
    title: 'Mid-Level Dev',
    tier: 2,
    track: 'IC',
    salary: 78000,
    requirements: { coding: 1500, corporate: 1000 },
  },

  ic_senior: {
    id: 'ic_senior',
    title: 'Senior Dev',
    tier: 3,
    track: 'IC',
    salary: 250000,
    requirements: { coding: 3000, corporate: 2500, politics: 100 },
  },

  ic_staff: {
    id: 'ic_staff',
    title: 'Staff',
    tier: 4,
    track: 'IC',
    salary: 300000,
    requirements: { coding: 4000, corporate: 3000, politics: 200 },
  },

  ic_principal: {
    id: 'ic_principal',
    title: 'Principal',
    tier: 5,
    track: 'IC',
    salary: 400000,
    requirements: { coding: 5500, corporate: 4250, politics: 500 },
  },

  ic_fellow: {
    id: 'ic_fellow',
    title: 'Distinguished Fellow',
    tier: 6,
    track: 'IC',
    salary: 550000,
    requirements: { coding: 7500, corporate: 6000, politics: 1000 },
  },
};

/** Unemployed state - no job held. */
export const UNEMPLOYED_JOB_ID = 'unemployed';
