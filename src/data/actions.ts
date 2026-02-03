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
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'gig_fix',
    label: 'Quick Fix Gig',
    category: 'WORK',
    energyCost: 20,
    moneyCost: 0,
    rewards: { xp: 10, money: 100, stress: 10 },
    duration: 1,
  },

  {
    id: 'gig_build',
    label: 'Build Project Gig',
    category: 'WORK',
    energyCost: 40,
    moneyCost: 0,
    rewards: { xp: 50, money: 500, stress: 25 },
    duration: 3,
  },

  {
    id: 'corp_ticket',
    label: 'Fix Jira Ticket',
    category: 'WORK',
    energyCost: 30,
    moneyCost: 0,
    rewards: { xp: 20, stress: 15 },
    duration: 1,
  },

  {
    id: 'corp_lead',
    label: 'Lead Initiative',
    category: 'WORK',
    energyCost: 50,
    moneyCost: 0,
    rewards: { xp: 40, stress: 30 },
    duration: 4,
  },

  {
    id: 'meetings',
    label: 'Attend Meetings',
    category: 'WORK',
    energyCost: 20,
    moneyCost: 0,
    rewards: { xp: 5, politics: 10, stress: 25 },
    duration: 3,
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
];

/** Lookup map for O(1) action retrieval by ID. */
export const ACTIONS_REGISTRY: Record<string, GameAction> = Object.fromEntries(
  ACTIONS.map(action => [action.id, action]),
);
