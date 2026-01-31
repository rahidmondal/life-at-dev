import type { Resources } from './resources';
import type { SkillMap, XPCurrency } from './stats';

export type EventCategory = 'WORK' | 'NETWORK' | 'LIFE' | 'OPPORTUNITY' | 'HARDSHIP';

export interface EventEffect {
  resources?: Partial<Resources>;
  skills?: Partial<SkillMap>;
  xp?: Partial<XPCurrency>;
  message: string;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;

  baseProbability: number;

  requirements?: {
    minStress?: number;
    maxStress?: number;
    minEnergy?: number;
    minMoney?: number;
    minSkill?: number;
    track?: string;
    jobTier?: number;
  };

  effect: EventEffect;
}

export interface EventLogEntry {
  tick: number;
  eventId: string;
  message: string;
}
