import { GameAction } from '@/types/game';

export const ACTIONS: GameAction[] = [
  // ========================================
  // WORK TAB - Daily Grind Actions
  // ========================================
  {
    id: 'grind-leetcode',
    name: 'Grind LeetCode',
    description: 'Practice algorithms and data structures. The eternal grind.',
    category: 'work',
    cost: {
      weeks: 1,
      energy: 15,
      stress: 10,
      money: 0,
    },
    reward: {
      coding: 5,
      reputation: 0,
      money: 0,
      energy: 0,
      stress: 0,
    },
    requirements: {
      minEnergy: 15,
    },
  },
  {
    id: 'side-project',
    name: 'Build Side Project',
    description: 'Create something cool. A solid 3-week investment.',
    category: 'work',
    cost: {
      weeks: 3,
      energy: 30,
      stress: 10,
      money: 0,
    },
    reward: {
      coding: 8,
      reputation: 5,
      money: 0,
      energy: 0,
      stress: 0,
    },
    requirements: {
      minEnergy: 30,
    },
    isMultiWeek: true,
  },
  {
    id: 'freelance-gig',
    name: 'Freelance Gig',
    description: 'Full client project. Income scales with Coding & Reputation.',
    category: 'work',
    cost: {
      weeks: 4,
      energy: 25,
      stress: 10,
      money: 0,
    },
    reward: {
      coding: 10,
      reputation: 2,
      money: 550,
      energy: 0,
      stress: 0,
    },
    requirements: {
      minEnergy: 25,
    },
  },
  {
    id: 'hackathon',
    name: 'Attend Hackathon',
    description: 'Intense weekend event plus recovery time.',
    category: 'work',
    cost: {
      weeks: 2,
      energy: 40,
      stress: 25,
      money: 0,
    },
    reward: {
      coding: 20,
      reputation: 5,
      money: 0,
      energy: 0,
      stress: 0,
    },
    requirements: {
      minEnergy: 40,
    },
  },
  {
    id: 'network-online',
    name: 'Network Online',
    description: 'LinkedIn premium, Twitter engagement, conference tickets.',
    category: 'invest',
    cost: {
      weeks: 1,
      energy: 5,
      stress: 0,
      money: 100,
    },
    reward: {
      coding: 0,
      reputation: 10,
      money: 0,
      energy: 0,
      stress: 0,
    },
    requirements: {
      minEnergy: 5,
      minMoney: 100,
    },
  },

  // ========================================
  // SHOP TAB - Recovery Actions
  // ========================================
  {
    id: 'sleep-in',
    name: 'Sleep In',
    description: 'Take a week off to rest and recharge.',
    category: 'shop',
    cost: {
      weeks: 1,
      energy: 0,
      stress: 0,
      money: 0,
    },
    reward: {
      coding: 0,
      reputation: 0,
      money: 0,
      energy: 50,
      stress: -10,
    },
  },
  {
    id: 'coffee-binge',
    name: 'Coffee Binge',
    description: 'Instant energy boost. No time cost, but increases stress.',
    category: 'shop',
    cost: {
      weeks: 0,
      energy: 0,
      stress: 10,
      money: 15,
    },
    reward: {
      coding: 0,
      reputation: 0,
      money: 0,
      energy: 25,
      stress: 0,
    },
    requirements: {
      minMoney: 15,
    },
  },
  {
    id: 'vacation',
    name: 'Touch Grass (Vacation)',
    description: 'Take 3 weeks off to truly reset. Expensive but worth it.',
    category: 'shop',
    cost: {
      weeks: 3,
      energy: 0,
      stress: 0,
      money: 1000,
    },
    reward: {
      coding: 0,
      reputation: 0,
      money: 0,
      energy: 100,
      stress: -50,
    },
    requirements: {
      minMoney: 1000,
    },
    isMultiWeek: true,
  },

  // ========================================
  // INVEST TAB - Advanced Actions
  // ========================================
  {
    id: 'job-hunt',
    name: 'Job Hunt / Apply',
    description: 'Apply to jobs and take interviews. Stressful but necessary.',
    category: 'invest',
    cost: {
      weeks: 1,
      energy: 10,
      stress: 20,
      money: 0,
    },
    reward: {
      coding: 0,
      reputation: 0,
      money: 0,
      energy: 0,
      stress: 0,
    },
    requirements: {
      minEnergy: 10,
    },
  },
  {
    id: 'consult-mentor',
    name: 'Consult/Mentor',
    description: 'Share your expertise for pay. Requires high reputation.',
    category: 'invest',
    cost: {
      weeks: 1,
      energy: 20,
      stress: 0,
      money: 0,
    },
    reward: {
      coding: 0,
      reputation: 0,
      money: 1500,
      energy: 0,
      stress: 0,
    },
    requirements: {
      minEnergy: 20,
      minReputation: 600,
    },
  },
];

export function isActionAvailable(action: GameAction, energy: number, money: number, reputation: number): boolean {
  if (action.requirements?.minEnergy && energy < action.requirements.minEnergy) {
    return false;
  }
  if (action.requirements?.minMoney && money < action.requirements.minMoney) {
    return false;
  }
  if (action.requirements?.minReputation && reputation < action.requirements.minReputation) {
    return false;
  }
  return true;
}

export function getActionsByCategory(category: 'work' | 'shop' | 'invest'): GameAction[] {
  return ACTIONS.filter(action => action.category === category);
}

export function getUnavailabilityReason(
  action: GameAction,
  energy: number,
  money: number,
  reputation: number,
): string | null {
  if (action.requirements?.minEnergy && energy < action.requirements.minEnergy) {
    return `Need ${String(action.requirements.minEnergy)} energy (have ${String(energy)})`;
  }
  if (action.requirements?.minMoney && money < action.requirements.minMoney) {
    return `Need $${String(action.requirements.minMoney)} (have $${String(money)})`;
  }
  if (action.requirements?.minReputation && reputation < action.requirements.minReputation) {
    return `Need ${String(action.requirements.minReputation)} reputation (have ${String(reputation)})`;
  }
  return null;
}
