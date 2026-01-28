export type CareerPath = 'corporate' | 'ic' | 'management' | 'hustler' | 'business' | 'specialist';

export type CareerLevel = 1 | 2 | 3 | 4;

export interface Job {
  id: string;
  title: string;
  path: CareerPath;
  level: CareerLevel;
  requirements: {
    coding: number;
    reputation: number;
    money?: number;
  };
  yearlyPay: number;
  rentPerYear: number;
  isGameEnd: boolean;
  isIntermediate?: boolean;
}

export interface GameStats {
  weeks: number;
  stress: number;
  energy: number;
  money: number;
  coding: number;
  reputation: number;
  currentJob: Job;
  age: number;
  yearsWorked: number;
  totalEarned: number;
  actionHistory: string[];
  familySupportYearsLeft?: number;
  jobChanges?: number;
  startingJobId?: string;
}

// Player tag for game over screen
export interface PlayerTag {
  label: string;
  emoji: string;
  description: string;
  color: string;
}

export interface ActionCost {
  weeks: number;
  energy: number;
  stress: number;
  money: number;
}

export interface ActionReward {
  coding: number;
  reputation: number;
  money: number;
  energy: number;
  stress: number;
}

export interface GameAction {
  id: string;
  name: string;
  description: string;
  category: 'work' | 'shop' | 'invest';
  cost: ActionCost;
  reward: ActionReward;
  requirements?: {
    minEnergy?: number;
    minReputation?: number;
    minMoney?: number;
  };
  isMultiWeek?: boolean;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  effects?: Partial<Omit<GameStats, 'currentJob' | 'age' | 'yearsWorked' | 'totalEarned'>>;
  choices?: {
    text: string;
    effects: Partial<Omit<GameStats, 'currentJob' | 'age' | 'yearsWorked' | 'totalEarned'>>;
  }[];
}

export type GameOverReason = 'burnout' | 'bankruptcy' | 'victory';

export interface GameOver {
  reason: GameOverReason;
  finalStats: GameStats;
  message: string;
  isEasterEggWin?: boolean;
  easterEggEvent?: string;
}

export type GamePhase = 'start' | 'playing' | 'gameover';

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'event';
}
