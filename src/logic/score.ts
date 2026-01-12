import type { CareerLevel, GameOverReason, GameStats } from '@/types/game';

export interface ScoreBreakdown {
  basePoints: number;
  jobLevelBonus: number;
  wealthBonus: number;
  codingBonus: number;
  reputationBonus: number;
  efficiencyBonus: number;
  outcomeMultiplier: number;
  totalScore: number;
}

interface CalculateScoreParams {
  finalStats: GameStats;
  reason: GameOverReason;
  isEasterEggWin?: boolean;
}

/**
 * Calculate the final score based on game outcome and stats.
 * Returns both the total score and a breakdown of how it was calculated.
 */
export function calculateScore({ finalStats, reason, isEasterEggWin = false }: CalculateScoreParams): ScoreBreakdown {
  // Base points for completing a run
  const basePoints = 100;

  // Job Level Bonus (levels 1-4, significant weight)
  // Level 1 = 50, Level 2 = 150, Level 3 = 300, Level 4 = 500
  const jobLevel = finalStats.currentJob.level;
  const jobLevelBonusMap: Record<CareerLevel, number> = {
    1: 50,
    2: 150,
    3: 300,
    4: 500,
  };
  const jobLevelBonus = jobLevelBonusMap[jobLevel];

  // Wealth Bonus (scaled logarithmically to prevent it from dominating)
  // Uses log scale: money of $100k = ~166 points, $1M = ~200 points
  const money = Math.max(0, finalStats.money);
  const wealthBonus = money > 0 ? Math.floor(Math.log10(money + 1) * 40) : 0;

  // Skill Mastery Bonuses
  const codingBonus = Math.floor(finalStats.coding * 1.5);
  const reputationBonus = Math.floor(finalStats.reputation * 2);

  // Efficiency Bonus (based on age and outcome)
  const yearsPlayed = finalStats.age - 18;
  let efficiencyBonus = 0;

  if (reason === 'victory') {
    // Victory efficiency: bonus for achieving it faster (younger age)
    // Max bonus at age 22 (4 years), decreasing as age increases
    const maxEfficiencyBonus = 200;
    const optimalYears = 4;
    if (yearsPlayed <= optimalYears) {
      efficiencyBonus = maxEfficiencyBonus;
    } else {
      // Decrease by 10 points per year beyond optimal, min 0
      efficiencyBonus = Math.max(0, maxEfficiencyBonus - (yearsPlayed - optimalYears) * 10);
    }
  } else {
    // Burnout/Bankruptcy: small "longevity" bonus for surviving longer
    // 5 points per year survived, max 100
    efficiencyBonus = Math.min(100, yearsPlayed * 5);
  }

  // Calculate subtotal before multiplier
  const subtotal = basePoints + jobLevelBonus + wealthBonus + codingBonus + reputationBonus + efficiencyBonus;

  // Outcome Multiplier
  let outcomeMultiplier: number;
  if (reason === 'victory') {
    if (isEasterEggWin) {
      // Easter Egg Victory: highest multiplier
      outcomeMultiplier = 2.5;
    } else {
      // Standard Victory: high multiplier
      outcomeMultiplier = 2.0;
    }
  } else if (reason === 'burnout') {
    // Burnout: penalty multiplier
    outcomeMultiplier = 0.5;
  } else {
    // Bankruptcy: lowest multiplier
    outcomeMultiplier = 0.3;
  }

  // Calculate final score
  const totalScore = Math.floor(subtotal * outcomeMultiplier);

  return {
    basePoints,
    jobLevelBonus,
    wealthBonus,
    codingBonus,
    reputationBonus,
    efficiencyBonus,
    outcomeMultiplier,
    totalScore,
  };
}

/**
 * Get a human-readable summary of the score breakdown
 */
export function getScoreBreakdownText(breakdown: ScoreBreakdown): string {
  const parts = [
    `Base: ${String(breakdown.basePoints)}`,
    `Job Level: +${String(breakdown.jobLevelBonus)}`,
    `Wealth: +${String(breakdown.wealthBonus)}`,
    `Coding: +${String(breakdown.codingBonus)}`,
    `Reputation: +${String(breakdown.reputationBonus)}`,
    `Efficiency: +${String(breakdown.efficiencyBonus)}`,
    `× ${String(breakdown.outcomeMultiplier)} (outcome)`,
  ];
  return parts.join(' | ');
}
