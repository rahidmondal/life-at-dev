import { GameActionType } from '@/context/gameReducer';
import { JOBS, getAvailablePromotions } from '@/data/jobs';
import { GameStats, Job } from '@/types/game';

// Year-end review logic
// This is the authoritative promotion/termination system
export function performYearEndReview(
  stats: GameStats,
  _dispatch: React.Dispatch<GameActionType>,
): {
  promoted: boolean;
  newJob?: Job;
  message: string;
} {
  const { currentJob, coding, reputation, money } = stats;

  const availablePromotions = getAvailablePromotions(currentJob, coding, reputation, money);

  if (availablePromotions.length > 0) {
    const newJob = availablePromotions[0];

    return {
      promoted: true,
      newJob,
      message: `Performance review complete! You've been promoted to ${newJob.title}. New salary: $${newJob.yearlyPay.toLocaleString()}/year.`,
    };
  } else {
    const meetsMinimum =
      coding >= currentJob.requirements.coding * 0.7 && reputation >= currentJob.requirements.reputation * 0.7;

    if (!meetsMinimum && currentJob.yearlyPay > 0) {
      const unemployedJob = JOBS.find(job => job.id === 'unemployed') ?? currentJob;

      return {
        promoted: false,
        newJob: unemployedJob,
        message: `Performance review: You've been let go. Skills didn't meet expectations. You're now ${unemployedJob.title}.`,
      };
    }

    return {
      promoted: false,
      message: `Performance review: No promotion this year. You need more experience. Coding: ${String(coding)}/${String(currentJob.requirements.coding + 20)}, Rep: ${String(reputation)}/${String(currentJob.requirements.reputation + 10)}`,
    };
  }
}

// Calculate year-end finances
export function calculateYearEndFinances(stats: GameStats): {
  income: number;
  expenses: number;
  net: number;
  breakdown: string;
} {
  const income = stats.currentJob.yearlyPay;
  const rent = stats.currentJob.rentPerYear;
  return {
    income,
    expenses: rent,
    net: income - rent,
    breakdown: `Salary: $${income.toLocaleString()} | Rent: -$${rent.toLocaleString()} | Net: $${(income - rent).toLocaleString()}`,
  };
}

export function isEligibleForPromotion(stats: GameStats): boolean {
  const availablePromotions = getAvailablePromotions(stats.currentJob, stats.coding, stats.reputation, stats.money);
  return availablePromotions.length > 0;
}

export function getNextJobSuggestion(currentJob: Job): Job | null {
  const currentIndex = JOBS.findIndex(job => job.id === currentJob.id);
  if (currentIndex === -1) return null;

  for (let i = currentIndex + 1; i < JOBS.length; i++) {
    const nextJob = JOBS[i];

    if (nextJob.path === currentJob.path && nextJob.level >= currentJob.level) {
      return nextJob;
    }

    if (currentJob.id === 'senior-dev' && (nextJob.path === 'management' || nextJob.path === 'ic')) {
      return nextJob;
    }

    if (
      currentJob.path === 'hustler' &&
      currentJob.level === 2 &&
      (nextJob.path === 'business' || nextJob.path === 'specialist')
    ) {
      return nextJob;
    }
  }

  return null;
}
