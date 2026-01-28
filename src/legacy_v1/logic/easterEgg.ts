import { GameStats } from '@/types/game';

// Phase 1.2: Hidden victory path detection
// This module checks for a skill-based Easter Egg win condition
// Requires long-term disciplined play across multiple years

// Easter Egg victory events (hardcoded, Phase 2: replace with AI)
const EASTER_EGG_EVENTS = [
  'Your rich friend offered you a CTO role in his stealth startup.',
  'A billionaire acquired your side-project idea outright.',
  'An open-source tool you built quietly became industry standard.',
  'You were headhunted to architect a once-in-a-decade system.',
  'A long-ignored blog post sparked a global tech movement.',
];

// Standard victory job IDs
const VICTORY_JOB_IDS = ['cto', 'distinguished-fellow', 'tech-mogul', 'industry-architect'];

// Action pattern requirements (last 24 actions) - Phase 1.2.1: Made much easier
interface ActionPattern {
  'side-project': number;
  'network-online': number;
  'grind-leetcode': number;
}

const REQUIRED_PATTERN: ActionPattern = {
  'side-project': 3, // Reduced from 6
  'network-online': 3, // Reduced from 5
  'grind-leetcode': 2, // Reduced from 4
};

/**
 * Check if player has achieved Easter Egg win condition
 * This is a pure function with no side effects
 *
 * Requirements (ALL must be met):
 * 1. Action pattern: Specific distribution over last 24 actions
 * 2. Stat thresholds: High coding, reputation, stability
 * 3. Time gate: At least 6 years played
 * 4. Career gate: Not already in a victory role
 *
 * @param stats Current game stats
 * @returns Easter Egg event message if triggered, null otherwise
 */
export function checkEasterEggWin(stats: GameStats): string | null {
  // DEV ONLY: Force Easter Egg for testing
  if (
    process.env.NODE_ENV === 'development' &&
    'forceEasterEgg' in stats &&
    (stats as GameStats & { forceEasterEgg?: boolean }).forceEasterEgg
  ) {
    return getRandomEasterEggEvent();
  }

  // Gate 1: Time requirement (at least 4 years) - Reduced from 6
  const yearsPlayed = stats.age - 18;
  if (yearsPlayed < 1) {
    return null;
  }

  // Gate 2: Must not already be in victory role
  if (VICTORY_JOB_IDS.includes(stats.currentJob.id)) {
    return null;
  }

  // Gate 3: Stat thresholds - Significantly reduced
  if (stats.coding < 100 || stats.reputation < 100 || stats.stress > 60 || stats.energy < 40 || stats.money < 100) {
    return null;
  }

  // Gate 4: Action pattern analysis
  if (!checkActionPattern(stats.actionHistory)) {
    return null;
  }

  return getRandomEasterEggEvent();
}

/**
 * Analyze action history for the required pattern
 * Checks last 24 meaningful actions for specific distribution
 *
 * @param actionHistory Array of action IDs (last 24)
 * @returns true if pattern matches requirements
 */
function checkActionPattern(actionHistory: string[]): boolean {
  // Need at least 8 actions tracked (minimum needed for pattern: 3+3+2)
  if (actionHistory.length < 8) {
    return false;
  }

  // Count occurrences of key actions
  const counts: Record<string, number> = {};
  const last24 = actionHistory.slice(-24);

  last24.forEach(actionId => {
    counts[actionId] = (counts[actionId] || 0) + 1;
  });

  // Verify each required action meets minimum count
  for (const [actionId, requiredCount] of Object.entries(REQUIRED_PATTERN)) {
    if ((counts[actionId] || 0) < requiredCount) {
      return false;
    }
  }

  return true;
}

/**
 * Get a random Easter Egg victory event
 * @returns Event narrative string
 */
function getRandomEasterEggEvent(): string {
  const index = Math.floor(Math.random() * EASTER_EGG_EVENTS.length);
  return EASTER_EGG_EVENTS[index];
}

/**
 * Check if an action should be tracked in history
 * Coffee Binge, Vacation, and Sleep In are excluded (they're safety valves, not strategy)
 *
 * @param actionId Action identifier
 * @returns true if action should be tracked
 */
export function shouldTrackAction(actionId: string): boolean {
  return actionId !== 'coffee-binge' && actionId !== 'vacation' && actionId !== 'sleep-in';
}

/**
 * Add action to history, maintaining rolling window of 24
 *
 * @param history Current action history
 * @param actionId Action to add
 * @returns Updated history array (max 24 items)
 */
export function addToActionHistory(history: string[], actionId: string): string[] {
  if (!shouldTrackAction(actionId)) {
    return history;
  }

  const newHistory = [...history, actionId];

  // Keep only last 24
  if (newHistory.length > 24) {
    return newHistory.slice(-24);
  }

  return newHistory;
}
