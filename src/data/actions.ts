import type { GameAction } from '../types/actions';

/**
 * ACTIONS: Static definitions for all player actions.
 */
export const ACTIONS: GameAction[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY: SKILL (The School)
  // Focus: Gain Skill, Lose Energy. Grants 0 XP.
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'read_docs',
    label: 'Read Documentation',
    category: 'SKILL',
    energyCost: 10,
    moneyCost: 0,
    rewards: { skill: 5, stress: 2 },
    duration: 0,
  },

  {
    id: 'tutorial',
    label: 'Watch Tutorial',
    category: 'SKILL',
    energyCost: 20,
    moneyCost: 0,
    rewards: { skill: 12, stress: 5 },
    duration: 1,
  },

  {
    id: 'course_paid',
    label: 'Buy Udemy Course',
    category: 'SKILL',
    energyCost: 25,
    moneyCost: 50,
    rewards: { skill: 35, stress: 5 },
    requirements: { money: 50 },
    duration: 3,
  },

  {
    id: 'bootcamp',
    label: 'Weekend Bootcamp',
    category: 'SKILL',
    energyCost: 50,
    moneyCost: 500,
    rewards: { skill: 100, stress: 20 },
    requirements: { money: 500 },
    duration: 1,
  },

  {
    id: 'side_project',
    label: 'Build Side Project',
    category: 'SKILL',
    energyCost: 40,
    moneyCost: 0,
    rewards: { skill: 50, xp: 5, stress: 15 },
    requirements: { skill: 500 },
    duration: 3,
  },

  {
    id: 'master_degree',
    label: "Night School (Master's)",
    category: 'SKILL',
    energyCost: 60,
    moneyCost: 2000,
    rewards: { skill: 300, stress: 40 },
    requirements: { money: 2000, skill: 3000 },
    duration: 8,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY: WORK (The Job)
  // Focus: Gain XP & Money, Gain Stress. Context-sensitive to Job Title.
  // Actions filtered by jobRequirements based on player's current job.
  // ═══════════════════════════════════════════════════════════════════════════

  // ───────────────────────────────────────────────────────────────────────────
  // UNIVERSAL ACTIONS (Always Available)
  // ───────────────────────────────────────────────────────────────────────────

  {
    id: 'apply_job',
    label: 'Apply for Job',
    category: 'WORK',
    energyCost: 15,
    moneyCost: 0,
    rewards: { stress: 10 },
    jobRequirements: { universal: true },
    duration: 0,
  },

  {
    id: 'find_freelance',
    label: 'Find Freelance Gig',
    category: 'WORK',
    energyCost: 10,
    moneyCost: 0,
    rewards: { freelance: 5, stress: 5 },
    jobRequirements: { universal: true },
    duration: 0,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // UNEMPLOYED ACTIONS (Tier 0 / No Job)
  // ───────────────────────────────────────────────────────────────────────────

  {
    id: 'gig_fix',
    label: 'Quick Fix Gig',
    category: 'WORK',
    energyCost: 20,
    moneyCost: 0,
    rewards: { xp: 10, money: 100, freelance: 8, stress: 10 },
    jobRequirements: { unemployed: true, tracks: ['Hustler_L1', 'Hustler_Business', 'Hustler_Specialist'] },
    duration: 1,
  },

  {
    id: 'gig_build',
    label: 'Build Project Gig',
    category: 'WORK',
    energyCost: 40,
    moneyCost: 0,
    rewards: { xp: 50, money: 500, freelance: 20, stress: 25 },
    jobRequirements: { unemployed: true, tracks: ['Hustler_L1', 'Hustler_Business', 'Hustler_Specialist'] },
    duration: 3,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // STUDENT ACTIONS (Scholar/Funded paths only)
  // ───────────────────────────────────────────────────────────────────────────

  {
    id: 'attend_lecture',
    label: 'Attend Lecture',
    category: 'SKILL',
    energyCost: 15,
    moneyCost: 0,
    rewards: { skill: 15, stress: 5 },
    jobRequirements: { studentOnly: true },
    duration: 1,
  },

  {
    id: 'study_session',
    label: 'Study Session',
    category: 'SKILL',
    energyCost: 25,
    moneyCost: 0,
    rewards: { skill: 25, stress: 10 },
    jobRequirements: { studentOnly: true },
    duration: 2,
  },

  {
    id: 'group_project',
    label: 'Group Project',
    category: 'WORK',
    energyCost: 35,
    moneyCost: 0,
    rewards: { skill: 20, politics: 5, stress: 15 },
    jobRequirements: { studentOnly: true },
    duration: 3,
  },

  {
    id: 'office_hours',
    label: 'Visit Office Hours',
    category: 'SKILL',
    energyCost: 10,
    moneyCost: 0,
    rewards: { skill: 10, stress: -5 },
    jobRequirements: { studentOnly: true },
    duration: 0,
  },

  {
    id: 'campus_networking',
    label: 'Campus Networking',
    category: 'NETWORK',
    energyCost: 20,
    moneyCost: 0,
    rewards: { reputation: 10, politics: 5 },
    jobRequirements: { studentOnly: true },
    duration: 1,
  },

  {
    id: 'internship_prep',
    label: 'Prep for Internship',
    category: 'SKILL',
    energyCost: 30,
    moneyCost: 0,
    rewards: { skill: 30, corporate: 10, stress: 10 },
    jobRequirements: { studentOnly: true },
    duration: 2,
  },

  {
    id: 'part_time_job',
    label: 'Part-Time Job',
    category: 'WORK',
    energyCost: 25,
    moneyCost: 0,
    rewards: { money: 200, stress: 5, freelance: 5 },
    jobRequirements: { studentOnly: true },
    duration: 1,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CORPORATE L1 ACTIONS (Intern → Senior Dev)
  // ───────────────────────────────────────────────────────────────────────────

  {
    id: 'corp_ticket',
    label: 'Fix Jira Ticket',
    category: 'WORK',
    energyCost: 30,
    moneyCost: 0,
    rewards: { xp: 20, corporate: 10, stress: 15 },
    jobRequirements: { tracks: ['Corporate_L1', 'Corp_IC'] },
    duration: 1,
  },

  {
    id: 'corp_standup',
    label: 'Daily Standup',
    category: 'WORK',
    energyCost: 5,
    moneyCost: 0,
    rewards: { xp: 2, corporate: 3, politics: 2, stress: 5 },
    jobRequirements: { tracks: ['Corporate_L1', 'Corp_IC', 'Corp_Management'] },
    duration: 0,
  },

  {
    id: 'corp_code_review',
    label: 'Code Review',
    category: 'WORK',
    energyCost: 20,
    moneyCost: 0,
    rewards: { xp: 15, corporate: 8, skill: 10, stress: 10 },
    jobRequirements: { tracks: ['Corporate_L1', 'Corp_IC'], minTier: 1 },
    duration: 1,
  },

  {
    id: 'corp_oncall',
    label: 'On-Call Duty',
    category: 'WORK',
    energyCost: 40,
    moneyCost: 0,
    rewards: { xp: 30, corporate: 15, stress: 35 },
    jobRequirements: { tracks: ['Corporate_L1', 'Corp_IC'], minTier: 2 },
    duration: 1,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CORPORATE MANAGEMENT ACTIONS (Team Lead → CTO)
  // ───────────────────────────────────────────────────────────────────────────

  {
    id: 'corp_lead',
    label: 'Lead Initiative',
    category: 'WORK',
    energyCost: 50,
    moneyCost: 0,
    rewards: { xp: 40, corporate: 25, politics: 15, stress: 30 },
    jobRequirements: { tracks: ['Corp_Management', 'Corp_IC'], minTier: 3 },
    duration: 4,
  },

  {
    id: 'meetings',
    label: 'Attend Meetings',
    category: 'WORK',
    energyCost: 20,
    moneyCost: 0,
    rewards: { xp: 5, politics: 10, corporate: 5, stress: 25 },
    jobRequirements: { tracks: ['Corporate_L1', 'Corp_Management', 'Corp_IC'], minTier: 1 },
    duration: 0,
  },

  {
    id: 'mgmt_1on1',
    label: '1-on-1 Meetings',
    category: 'WORK',
    energyCost: 25,
    moneyCost: 0,
    rewards: { xp: 10, politics: 15, corporate: 10, stress: 15 },
    jobRequirements: { tracks: ['Corp_Management'], minTier: 4 },
    duration: 1,
  },

  {
    id: 'mgmt_perf_review',
    label: 'Performance Reviews',
    category: 'WORK',
    energyCost: 35,
    moneyCost: 0,
    rewards: { xp: 20, politics: 25, corporate: 20, stress: 30 },
    jobRequirements: { tracks: ['Corp_Management'], minTier: 5 },
    duration: 2,
  },

  {
    id: 'mgmt_roadmap',
    label: 'Quarterly Roadmap',
    category: 'WORK',
    energyCost: 45,
    moneyCost: 0,
    rewards: { xp: 35, politics: 30, corporate: 30, stress: 40 },
    jobRequirements: { tracks: ['Corp_Management'], minTier: 5 },
    duration: 3,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CORPORATE IC ACTIONS (Staff → Fellow)
  // ───────────────────────────────────────────────────────────────────────────

  {
    id: 'ic_architecture',
    label: 'Architecture Review',
    category: 'WORK',
    energyCost: 40,
    moneyCost: 0,
    rewards: { xp: 35, corporate: 20, skill: 25, stress: 20 },
    jobRequirements: { tracks: ['Corp_IC'], minTier: 4 },
    duration: 2,
  },

  {
    id: 'ic_tech_talk',
    label: 'Internal Tech Talk',
    category: 'WORK',
    energyCost: 30,
    moneyCost: 0,
    rewards: { xp: 25, reputation: 10, skill: 15, stress: 15 },
    jobRequirements: { tracks: ['Corp_IC'], minTier: 4 },
    duration: 1,
  },

  {
    id: 'ic_rfc',
    label: 'Write RFC',
    category: 'WORK',
    energyCost: 35,
    moneyCost: 0,
    rewards: { xp: 30, corporate: 25, skill: 20, stress: 25 },
    jobRequirements: { tracks: ['Corp_IC'], minTier: 5 },
    duration: 2,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // HUSTLER FREELANCER ACTIONS (Freelancer → Digital Nomad)
  // ───────────────────────────────────────────────────────────────────────────

  {
    id: 'hustle_portfolio',
    label: 'Update Portfolio',
    category: 'WORK',
    energyCost: 15,
    moneyCost: 0,
    rewards: { reputation: 8, freelance: 10, stress: 5 },
    jobRequirements: { tracks: ['Hustler_L1', 'Hustler_Business', 'Hustler_Specialist'] },
    duration: 1,
  },

  {
    id: 'hustle_invoice',
    label: 'Invoice Clients',
    category: 'WORK',
    energyCost: 10,
    moneyCost: 0,
    rewards: { money: 50, freelance: 5, stress: 8 },
    jobRequirements: { tracks: ['Hustler_L1', 'Hustler_Business', 'Hustler_Specialist'], minTier: 1 },
    duration: 0,
  },

  {
    id: 'hustle_proposal',
    label: 'Write Proposal',
    category: 'WORK',
    energyCost: 25,
    moneyCost: 0,
    rewards: { freelance: 15, reputation: 5, stress: 12 },
    jobRequirements: { tracks: ['Hustler_L1', 'Hustler_Specialist'], minTier: 1 },
    duration: 1,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // HUSTLER BUSINESS ACTIONS (Agency → Mogul)
  // ───────────────────────────────────────────────────────────────────────────

  {
    id: 'agency_pitch',
    label: 'Client Pitch',
    category: 'WORK',
    energyCost: 35,
    moneyCost: 0,
    rewards: { money: 200, freelance: 25, reputation: 15, stress: 20 },
    jobRequirements: { tracks: ['Hustler_Business'], minTier: 3 },
    duration: 1,
  },

  {
    id: 'agency_hire',
    label: 'Hire Contractor',
    category: 'WORK',
    energyCost: 20,
    moneyCost: 500,
    rewards: { freelance: 30, stress: 15 },
    requirements: { money: 500 },
    jobRequirements: { tracks: ['Hustler_Business'], minTier: 3 },
    duration: 1,
  },

  {
    id: 'agency_sponsor',
    label: 'Land Sponsorship',
    category: 'WORK',
    energyCost: 40,
    moneyCost: 0,
    rewards: { money: 1000, reputation: 30, stress: 25 },
    jobRequirements: { tracks: ['Hustler_Business'], minTier: 4 },
    duration: 2,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // HUSTLER SPECIALIST ACTIONS (Contractor → Architect)
  // ───────────────────────────────────────────────────────────────────────────

  {
    id: 'specialist_retainer',
    label: 'Retainer Contract',
    category: 'WORK',
    energyCost: 30,
    moneyCost: 0,
    rewards: { money: 800, freelance: 20, stress: 15 },
    jobRequirements: { tracks: ['Hustler_Specialist'], minTier: 3 },
    duration: 2,
  },

  {
    id: 'specialist_audit',
    label: 'Code Audit',
    category: 'WORK',
    energyCost: 35,
    moneyCost: 0,
    rewards: { money: 600, skill: 20, freelance: 15, stress: 20 },
    jobRequirements: { tracks: ['Hustler_Specialist'], minTier: 4 },
    duration: 1,
  },

  {
    id: 'specialist_workshop',
    label: 'Paid Workshop',
    category: 'WORK',
    energyCost: 45,
    moneyCost: 0,
    rewards: { money: 1500, reputation: 25, skill: 15, stress: 25 },
    jobRequirements: { tracks: ['Hustler_Specialist'], minTier: 5 },
    duration: 2,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY: NETWORK (The Career)
  // Focus: Gain Reputation & Opportunities. Crucial for Senior+ roles.
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'tweet',
    label: 'Post Hot Take',
    category: 'NETWORK',
    energyCost: 5,
    moneyCost: 0,
    rewards: { reputation: 1, stress: 2 },
    duration: 0,
  },

  {
    id: 'meetup',
    label: 'Attend Local Meetup',
    category: 'NETWORK',
    energyCost: 30,
    moneyCost: 20,
    rewards: { reputation: 15, stress: 10 },
    duration: 2,
  },

  {
    id: 'conference',
    label: 'Tech Conference',
    category: 'NETWORK',
    energyCost: 80,
    moneyCost: 500,
    rewards: { reputation: 100, stress: 20 },
    requirements: { money: 500 },
    duration: 3,
  },

  {
    id: 'mentor',
    label: 'Mentor Junior',
    category: 'NETWORK',
    energyCost: 20,
    moneyCost: 0,
    rewards: { reputation: 10, stress: -5, fulfillment: 10 },
    duration: 1,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY: RECOVER (The Health)
  // Focus: Lose Stress, Regain Energy. Essential for survival.
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'sleep',
    label: 'Sleep 8 Hours',
    category: 'RECOVER',
    energyCost: 0,
    moneyCost: 0,
    energyGain: 20,
    rewards: { stress: -10 },
    duration: 0,
  },

  {
    id: 'touch_grass',
    label: 'Walk Outside',
    category: 'RECOVER',
    energyCost: 0,
    moneyCost: 0,
    energyGain: 10,
    rewards: { stress: -15, fulfillment: 5 },
    duration: 0,
  },

  {
    id: 'gaming',
    label: 'Binge Video Games',
    category: 'RECOVER',
    energyCost: 0,
    moneyCost: 60,
    energyGain: 40,
    rewards: { stress: -40, fulfillment: 2 },
    duration: 1,
  },

  {
    id: 'vacation',
    label: 'Weekend Trip',
    category: 'RECOVER',
    energyCost: 0,
    moneyCost: 500,
    energyGain: 100,
    rewards: { stress: -80, fulfillment: 50 },
    requirements: { money: 500 },
    duration: 3,
  },

  {
    id: 'therapy',
    label: 'Therapy Session',
    category: 'RECOVER',
    energyCost: 0,
    moneyCost: 350,
    energyGain: 20,
    rewards: { stress: -25 },
    requirements: { money: 350 },
    duration: 5,
  },

  {
    id: 'skip_week',
    label: 'Skip Week',
    category: 'RECOVER',
    energyCost: 0,
    moneyCost: 0,
    energyGain: 50,
    rewards: { stress: 0 },
    duration: 1,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY: INVEST (The Future)
  // Focus: Convert Money into Passive Buffs. One-time or recurring purchases.
  // Bible Reference: Appendix I, Section E
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'buy_keyboard',
    label: 'Mechanical Keyboard',
    category: 'INVEST',
    energyCost: 10,
    moneyCost: 150,
    rewards: { stress: -5 },
    duration: 0,
    passiveBuff: {
      stat: 'skill',
      type: 'multiplier',
      value: 1.02,
      description: '+2% Skill Gain (Tactile feedback)',
    },
  },

  {
    id: 'sub_copilot',
    label: 'AI Assistant License',
    category: 'INVEST',
    energyCost: 5,
    moneyCost: 200,
    rewards: {},
    requirements: { skill: 1000 },
    duration: 0,
    passiveBuff: {
      stat: 'skill',
      type: 'flat',
      value: 5,
      description: '+5 Skill/Week (Passive learning)',
    },
  },

  {
    id: 'buy_chair',
    label: 'Ergonomic Chair',
    category: 'INVEST',
    energyCost: 20,
    moneyCost: 1200,
    rewards: { stress: -5 },
    requirements: { money: 1200 },
    duration: 1,
    passiveBuff: {
      stat: 'stress',
      type: 'multiplier',
      value: 0.9,
      description: '-10% Stress from Work (Back support)',
    },
  },

  {
    id: 'upgrade_pc',
    label: 'Ultimate Workstation',
    category: 'INVEST',
    energyCost: 40,
    moneyCost: 4000,
    rewards: { stress: -10 },
    requirements: { money: 4000 },
    duration: 1,
    passiveBuff: {
      stat: 'skill',
      type: 'multiplier',
      value: 1.15,
      description: '+15% Skill Gain (Compile speed)',
    },
  },

  {
    id: 'hire_cleaner',
    label: 'Outsource Chores',
    category: 'INVEST',
    energyCost: 10,
    moneyCost: 250,
    rewards: { stress: -5 },
    requirements: { money: 5000 },
    duration: 0,
    isRecurring: true,
    passiveBuff: {
      stat: 'energy',
      type: 'flat',
      value: 15,
      description: '+15 Max Energy (Time saved)',
    },
  },

  {
    id: 'home_gym',
    label: 'Home Gym Setup',
    category: 'INVEST',
    energyCost: 50,
    moneyCost: 2500,
    rewards: { stress: 10 },
    requirements: { money: 2500 },
    duration: 2,
    passiveBuff: {
      stat: 'recovery',
      type: 'multiplier',
      value: 1.2,
      description: '+20% Recovery Efficiency (Health)',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INVEST: Learning & Skills (Tier 1-3)
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'online_course_basic',
    label: 'Online Course (Basic)',
    category: 'INVEST',
    energyCost: 15,
    moneyCost: 50,
    rewards: { skill: 20 },
    duration: 0,
    passiveBuff: {
      stat: 'skill',
      type: 'flat',
      value: 2,
      description: '+2 Skill/Week (Fundamentals)',
    },
  },

  {
    id: 'online_course_advanced',
    label: 'Online Course (Advanced)',
    category: 'INVEST',
    energyCost: 25,
    moneyCost: 300,
    rewards: { skill: 50 },
    requirements: { skill: 500 },
    duration: 1,
    passiveBuff: {
      stat: 'skill',
      type: 'flat',
      value: 8,
      description: '+8 Skill/Week (Deep dive)',
    },
  },

  {
    id: 'bootcamp_intensive',
    label: 'Coding Bootcamp',
    category: 'INVEST',
    energyCost: 60,
    moneyCost: 5000,
    rewards: { skill: 200, stress: 20 },
    requirements: { money: 5000 },
    duration: 4,
    passiveBuff: {
      stat: 'skill',
      type: 'multiplier',
      value: 1.25,
      description: '+25% Skill Gain (Intensive training)',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INVEST: Subscriptions (Recurring)
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'sub_learning_platform',
    label: 'Learning Platform Sub',
    category: 'INVEST',
    energyCost: 5,
    moneyCost: 30,
    rewards: {},
    duration: 0,
    isRecurring: true,
    passiveBuff: {
      stat: 'xp',
      type: 'flat',
      value: 10,
      description: '+10 XP/Week (Tutorials)',
    },
  },

  {
    id: 'sub_gym_membership',
    label: 'Gym Membership',
    category: 'INVEST',
    energyCost: 10,
    moneyCost: 50,
    rewards: { stress: -5 },
    duration: 0,
    isRecurring: true,
    passiveBuff: {
      stat: 'stress',
      type: 'multiplier',
      value: 0.85,
      description: '-15% Stress Gain (Exercise)',
    },
  },

  {
    id: 'sub_meal_prep',
    label: 'Meal Prep Service',
    category: 'INVEST',
    energyCost: 5,
    moneyCost: 100,
    rewards: {},
    requirements: { money: 2000 },
    duration: 0,
    isRecurring: true,
    passiveBuff: {
      stat: 'energy',
      type: 'flat',
      value: 10,
      description: '+10 Energy/Week (No cooking)',
    },
  },

  {
    id: 'sub_coworking',
    label: 'Coworking Space',
    category: 'INVEST',
    energyCost: 10,
    moneyCost: 200,
    rewards: { fulfillment: 10 },
    requirements: { money: 3000 },
    duration: 0,
    isRecurring: true,
    passiveBuff: {
      stat: 'skill',
      type: 'multiplier',
      value: 1.1,
      description: '+10% Skill Gain (Focus zone)',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INVEST: Equipment (One-time, Tiered)
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'monitor_ultrawide',
    label: 'Ultrawide Monitor',
    category: 'INVEST',
    energyCost: 15,
    moneyCost: 800,
    rewards: { stress: -5 },
    requirements: { money: 800 },
    duration: 0,
    passiveBuff: {
      stat: 'skill',
      type: 'multiplier',
      value: 1.05,
      description: '+5% Skill Gain (Screen real estate)',
    },
  },

  {
    id: 'standing_desk',
    label: 'Standing Desk',
    category: 'INVEST',
    energyCost: 30,
    moneyCost: 600,
    rewards: { stress: -3 },
    requirements: { money: 600 },
    duration: 1,
    passiveBuff: {
      stat: 'stress',
      type: 'multiplier',
      value: 0.95,
      description: '-5% Stress from Work (Posture)',
    },
  },

  {
    id: 'noise_cancel_headphones',
    label: 'Noise-Cancel Headphones',
    category: 'INVEST',
    energyCost: 10,
    moneyCost: 350,
    rewards: { stress: -5 },
    duration: 0,
    passiveBuff: {
      stat: 'recovery',
      type: 'multiplier',
      value: 1.1,
      description: '+10% Recovery (Focus mode)',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INVEST: Lifestyle (High-tier)
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: 'hire_personal_trainer',
    label: 'Personal Trainer',
    category: 'INVEST',
    energyCost: 20,
    moneyCost: 400,
    rewards: { stress: -10 },
    requirements: { money: 10000 },
    duration: 0,
    isRecurring: true,
    passiveBuff: {
      stat: 'recovery',
      type: 'multiplier',
      value: 1.3,
      description: '+30% Recovery (Optimized workouts)',
    },
  },

  {
    id: 'apartment_upgrade',
    label: 'Better Apartment',
    category: 'INVEST',
    energyCost: 50,
    moneyCost: 10000,
    rewards: { stress: -15, fulfillment: 100 },
    requirements: { money: 15000 },
    duration: 2,
    passiveBuff: {
      stat: 'stress',
      type: 'multiplier',
      value: 0.8,
      description: '-20% Stress Gain (Comfortable living)',
    },
  },

  {
    id: 'hire_virtual_assistant',
    label: 'Virtual Assistant',
    category: 'INVEST',
    energyCost: 10,
    moneyCost: 500,
    rewards: {},
    requirements: { money: 20000 },
    duration: 0,
    isRecurring: true,
    passiveBuff: {
      stat: 'energy',
      type: 'flat',
      value: 25,
      description: '+25 Energy/Week (Delegated tasks)',
    },
  },
];

/** Lookup map for O(1) action retrieval by ID. */
export const ACTIONS_REGISTRY: Record<string, GameAction> = Object.fromEntries(
  ACTIONS.map(action => [action.id, action]),
);
