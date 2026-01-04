import { GameStats, PlayerTag } from '@/types/game';

/**
 * Calculates player tags ("Gamer Tags") based on final game stats
 * These are displayed on the Game Over screen to describe the player's playstyle
 */
export function getPlayerTags(stats: GameStats): PlayerTag[] {
  const tags: PlayerTag[] = [];
  const {
    coding,
    reputation,
    money,
    stress,
    yearsWorked,
    currentJob,
    actionHistory,
    jobChanges = 0,
    startingJobId,
  } = stats;

  // Defensive check - return empty tags if critical data is missing
  if (!currentJob || !actionHistory) {
    return tags;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SKILL VS FAME TAGS
  // ═══════════════════════════════════════════════════════════════════════════

  // The Ghost - High skill, low visibility
  if (coding > 800 && reputation < 300) {
    tags.push({
      label: 'The Ghost',
      emoji: '👻',
      description: 'Massive skills but nobody knows who you are',
      color: 'text-gray-400',
    });
  }

  // LinkedIn Influencer - All talk, no code
  if (coding < 400 && reputation > 700) {
    tags.push({
      label: 'LinkedIn Influencer',
      emoji: '📢',
      description: 'Famous for talking about code, not writing it',
      color: 'text-blue-400',
    });
  }

  // 10x Engineer - The unicorn
  if (coding > 850 && reputation > 850) {
    tags.push({
      label: '10x Engineer',
      emoji: '🦄',
      description: 'The mythical developer everyone wants to hire',
      color: 'text-purple-400',
    });
  }

  // Script Kiddie - Just starting out
  if (coding < 200 && reputation < 200) {
    tags.push({
      label: 'Script Kiddie',
      emoji: '👶',
      description: 'Still learning the basics',
      color: 'text-yellow-400',
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FINANCIAL STATUS TAGS
  // ═══════════════════════════════════════════════════════════════════════════

  // F.I.R.E. Achieved - Financially Independent
  if (money > 1000000) {
    tags.push({
      label: 'F.I.R.E. Achieved',
      emoji: '🔥',
      description: 'Financially Independent, Retire Early',
      color: 'text-orange-400',
    });
  }

  // Golden Handcuffs - High salary, no savings
  if (currentJob.yearlyPay > 150000 && money < 10000) {
    tags.push({
      label: 'Golden Handcuffs',
      emoji: '🔒',
      description: 'Big salary but lifestyle inflation got you',
      color: 'text-yellow-500',
    });
  }

  // Ramen Profitable - Surviving on little
  if (currentJob.yearlyPay < 40000 && yearsWorked > 5) {
    tags.push({
      label: 'Ramen Profitable',
      emoji: '🍜',
      description: 'Making ends meet through sheer willpower',
      color: 'text-red-400',
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MENTAL STATE TAGS
  // ═══════════════════════════════════════════════════════════════════════════

  // Zen Master - Low stress, long career
  if (stress < 20 && yearsWorked > 10) {
    tags.push({
      label: 'Zen Master',
      emoji: '🧘',
      description: 'Found work-life balance in tech',
      color: 'text-cyan-400',
    });
  }

  // Caffeine IV - High stress, high output
  if (stress > 90 && coding > 700) {
    tags.push({
      label: 'Caffeine IV',
      emoji: '☕',
      description: 'Running on coffee and deadlines',
      color: 'text-amber-400',
    });
  }

  // Burnout Speedrun - Fast burnout
  if (stress > 95 && yearsWorked < 3) {
    tags.push({
      label: 'Burnout Speedrun',
      emoji: '🚑',
      description: 'Burned out in record time',
      color: 'text-red-500',
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CAREER PATH TAGS
  // ═══════════════════════════════════════════════════════════════════════════

  switch (currentJob.path) {
    case 'corporate':
      tags.push({
        label: 'Corporate Drone',
        emoji: '🏢',
        description: 'Climbed the corporate ladder',
        color: 'text-gray-400',
      });
      break;
    case 'management':
      tags.push({
        label: 'The Suit',
        emoji: '👔',
        description: 'Traded coding for meetings',
        color: 'text-indigo-400',
      });
      break;
    case 'hustler':
      tags.push({
        label: 'Lone Wolf',
        emoji: '🐺',
        description: 'Did it your own way',
        color: 'text-emerald-400',
      });
      break;
    case 'specialist':
    case 'ic':
      tags.push({
        label: 'Architect',
        emoji: '📐',
        description: 'Master of technical excellence',
        color: 'text-blue-400',
      });
      break;
    case 'business':
      tags.push({
        label: 'Visionary',
        emoji: '🚀',
        description: 'Built something bigger than code',
        color: 'text-pink-400',
      });
      break;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SPECIAL TAGS
  // ═══════════════════════════════════════════════════════════════════════════

  // Job Hopper - Changed jobs a lot
  if (jobChanges > 5) {
    tags.push({
      label: 'Job Hopper',
      emoji: '🦘',
      description: 'Never stayed anywhere long',
      color: 'text-orange-400',
    });
  }

  // Eternal Student - Stayed in student roles too long
  const isStillStudent = currentJob.id.includes('student');
  if (yearsWorked > 6 && isStillStudent) {
    tags.push({
      label: 'Eternal Student',
      emoji: '🎓',
      description: 'Still in school after all these years',
      color: 'text-violet-400',
    });
  }

  // Nepo Baby - Started with family support
  if (startingJobId === 'cs-student-easy') {
    tags.push({
      label: 'Nepo Baby',
      emoji: '🍼',
      description: 'Started with a safety net',
      color: 'text-pink-300',
    });
  }

  // Coffee Addict - Drank too much coffee
  const coffeeCount = actionHistory.filter(a => a === 'coffee-binge').length;
  if (coffeeCount > 50) {
    tags.push({
      label: 'Coffee Addict',
      emoji: '🤪',
      description: `Consumed ${coffeeCount}+ coffee binges`,
      color: 'text-amber-500',
    });
  }

  return tags;
}
