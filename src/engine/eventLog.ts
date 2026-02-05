import { JOB_REGISTRY } from '../data/tracks';
import type { ActionCategory } from '../types/actions';
import type { EventLogEntry } from '../types/events';
import type { GameState } from '../types/gamestate';

/**
 * Event Log Message Templates.
 *
 * Templates use placeholders:
 * - {action} - Action label
 * - {job} - Current job title
 * - {delta} - Stat changes summary
 * - {money} - Money amount
 * - {skill} - Skill gained
 * - {stress} - Stress level descriptor
 */

/** Template variants for each action category. */
const CATEGORY_TEMPLATES: Record<ActionCategory, string[]> = {
  SKILL: [
    'git commit -m "Learning: {action}" → {delta}',
    '📚 {action} complete. Brain cells: upgraded. {delta}',
    '> npm run learn --topic="{action}" → {delta}',
    '[SKILL] {action} session logged. {delta}',
    '✓ Knowledge acquired: {action}. {delta}',
    '$ study --focus "{action}" && echo "Done" → {delta}',
    'Leveling up... {action} mastered. {delta}',
    '📖 Deep dive into {action}. {delta}',
  ],
  WORK: [
    '⚡ {action} → Task complete. {delta}',
    '[WORK] {action} shipped to prod. {delta}',
    '$ ./execute "{action}" --mode=grind → {delta}',
    'JIRA-{ticket}: {action} - Status: DONE. {delta}',
    '✓ {action} merged. Pipeline green. {delta}',
    '> Running {action}... Build successful. {delta}',
    '🔨 {action} delivered. Manager pleased. {delta}',
    '[{job}] Completed: {action}. {delta}',
  ],
  NETWORK: [
    '🌐 Networking: {action}. Connections++. {delta}',
    '> ping social_network --action="{action}" → {delta}',
    '[SOCIAL] {action} - Engagement received. {delta}',
    '✓ {action} complete. Clout: increasing. {delta}',
    '$ ./grow-network "{action}" → {delta}',
    '📱 {action} posted. Notifications: many. {delta}',
    'Building reputation via {action}... {delta}',
    '🤝 {action} successful. New contacts made. {delta}',
  ],
  RECOVER: [
    '💤 {action} → HP restored. {delta}',
    '> exec rest_protocol --type="{action}" → {delta}',
    '[SELF-CARE] {action} - Batteries recharged. {delta}',
    '✓ {action} complete. Feeling human again. {delta}',
    '$ touch_grass.sh --duration="{action}" → {delta}',
    '🧘 {action} session. Inner peace achieved. {delta}',
    'System recovery via {action}... {delta}',
    '☕ {action} mode activated. {delta}',
  ],
  INVEST: [
    '💰 Investment: {action}. Lifestyle upgraded. {delta}',
    '> apt install "{action}" → {delta}',
    '[UPGRADE] {action} acquired. +1 Quality of Life. {delta}',
    '✓ {action} purchased. Productivity buff active. {delta}',
    '$ brew install --cask "{action}" → {delta}',
    '🛒 {action} obtained. Wallet: {money}. {delta}',
    'New gear unlocked: {action}. {delta}',
    '📦 {action} delivered. Setup complete. {delta}',
  ],
};

/** Context-aware flavor messages based on game state. */
const CONTEXT_FLAVORS = {
  highStress: [
    'Stress levels critical.',
    'Coffee consumption: excessive.',
    'The to-do list grows longer.',
    'Slack notifications: ignored.',
    "You're running on fumes.",
  ],
  lowEnergy: [
    'Energy reserves depleted.',
    'Productivity at minimum.',
    'Consider: sleep?',
    'Brain.exe has stopped responding.',
    'Zombie mode: activated.',
  ],
  lowMoney: [
    'Wallet status: concerning.',
    'Ramen budget: activated.',
    'Bank account: whimpering.',
    "Payday can't come soon enough.",
    'Checking account balance: risky.',
  ],
  highMoney: [
    'Account looking healthy.',
    'Financial anxiety: reduced.',
    "You're doing alright.",
    'Emergency fund: growing.',
    'Stonks.',
  ],
  burnout: [
    '⚠️ BURNOUT WARNING ⚠️',
    'System overload detected.',
    'Mental health: degrading.',
    'Vacation recommended.',
    'Error: human.needs.rest()',
  ],
  flowState: [
    '🔥 FLOW STATE ACHIEVED',
    'In the zone. Unstoppable.',
    'Peak productivity unlocked.',
    'Code is flowing like water.',
    'Maximum efficiency mode.',
  ],
};

/** Action-specific flavor text for common actions. */
const ACTION_FLAVORS: Record<string, string[]> = {
  // SKILL actions
  read_docs: [
    'RTFM complete.',
    'Documentation actually helped.',
    'Stack Overflow avoided this time.',
    'The docs were... actually good?',
  ],
  tutorial: [
    'Tutorial completed. Time to forget everything.',
    'Another tutorial in the collection.',
    'Video watched at 2x speed.',
    "Now you're an expert (not really).",
  ],
  course_paid: [
    'Course purchased. Will you finish it?',
    'Udemy sale victim.',
    'Learning investment made.',
    'Certificate incoming (maybe).',
  ],
  bootcamp: [
    'Weekend? Never heard of it.',
    'Intensive learning session complete.',
    'Brain: melted. Skills: gained.',
    'Coffee consumed: unlimited.',
  ],
  side_project: [
    'Side project progressed. Unlike the others.',
    'Personal project actually updated.',
    'Portfolio piece enhanced.',
    'Maybe this one will be finished?',
  ],

  // WORK actions
  apply_job: [
    'Application submitted. Now we wait.',
    'Resume launched into the void.',
    "Fingers crossed. Let's see.",
    'Job hunt continues...',
  ],
  find_freelance: [
    'Freelance opportunity scouted.',
    'Gig economy: engaged.',
    'Client hunting mode: active.',
    'Side hustle potential identified.',
  ],
  gig_fix: [
    'Quick fix deployed. Client happy.',
    'Bug squashed. Invoice sent.',
    'Another satisfied customer.',
    '"Simple" fix completed in 4 hours.',
  ],
  gig_build: [
    'Project milestone reached.',
    'Scope creep: successfully resisted.',
    'Client revision #47 implemented.',
    'Feature shipped. Money incoming.',
  ],
  corp_ticket: [
    'Ticket closed. Sprint burndown: +1.',
    'JIRA updated. Manager notified.',
    'Another ticket bites the dust.',
    'Story points: earned.',
  ],
  corp_standup: [
    'Same update as yesterday.',
    '"Just reviewing PRs today."',
    'Standup: survived.',
    '15 min meeting, 3 min content.',
  ],
  corp_code_review: [
    'PRs reviewed. Nitpicks deployed.',
    'LGTM with suggestions.',
    'Approved with minor comments.',
    'Code quality: defended.',
  ],
  meetings: [
    'Meeting survived. Notes: vague.',
    'Could have been an email.',
    'Agenda: unclear. Action items: none.',
    'Calendar: blocked. Productivity: questionable.',
  ],

  // NETWORK actions
  tweet: [
    'Hot take deployed. Awaiting ratio.',
    'Tweeted. Immediately second-guessed it.',
    "Posted. Let's see how this ages.",
    'Opinion shared. Discourse incoming.',
  ],
  meetup: [
    'Networking complete. Business cards: none.',
    'Free pizza consumed. Contacts made.',
    'Talked to real humans. Exhausting.',
    'Learned about exciting startups.',
  ],
  conference: [
    'Conference badge acquired.',
    'Swag bag: maximum capacity.',
    'Talked to vendors. Emails incoming.',
    'Keynote: inspiring. Snacks: good.',
  ],

  // RECOVER actions
  sleep: [
    'Finally got some rest.',
    '8 hours. Revolutionary.',
    'Sleep debt: partially paid.',
    'Woke up feeling... adequate.',
  ],
  touch_grass: [
    'Grass: touched. Nature: experienced.',
    'Sunlight encountered. Vitamin D: +1.',
    'Outside is... actually nice?',
    'Fresh air acquired.',
  ],
  gaming: [
    'Rank: unchanged. Fun: had.',
    'Just one more game... or ten.',
    'Leisure time well spent.',
    "It's called work-life balance.",
  ],
  vacation: [
    'OOO message deployed.',
    'Laptop left at home (mostly).',
    'Touch grass: international edition.',
    'Memories made. Emails ignored.',
  ],
  therapy: [
    'Mental health: prioritized.',
    'Feelings: processed.',
    'Coping strategies: updated.',
    'Self-care level: expert.',
  ],
  skip_week: ['Time passes...', 'Another week in the books.', 'Life continues.', 'Week survived.'],

  // INVEST actions
  buy_keyboard: [
    'Clack clack clack.',
    'RGB productivity boost active.',
    'Mechanical therapy acquired.',
    'Keys: satisfying.',
  ],
  sub_copilot: [
    'AI assistant activated.',
    'Pair programming with robots.',
    'Autocomplete: enhanced.',
    'Who wrote this code? Not sure anymore.',
  ],
  buy_chair: ['Lumbar support: maximum.', 'Ergonomics: considered.', 'Back pain: reduced.', 'Herman Miller energy.'],
  upgrade_pc: [
    'FPS: unlimited. Compile times: reduced.',
    'More RAM = more better.',
    'New hardware smell acquired.',
    'Dev machine: upgraded.',
  ],
  hire_cleaner: [
    'Domestic tasks: outsourced.',
    'Living space: optimized.',
    'Adulting: automated.',
    'Clean apartment = clear mind.',
  ],
  home_gym: [
    'Gains available at home.',
    'No gym membership needed. Discipline: still needed.',
    'Equipment acquired. Now to use it...',
    'Health investment made.',
  ],
};

/**
 * Generate a random ticket number for work messages.
 */
function generateTicketNumber(): string {
  return String(Math.floor(Math.random() * 9000) + 1000);
}

/**
 * Get a random item from an array.
 * Handles edge case where Math.random() returns exactly 1.
 */
function pickRandom<T>(arr: readonly T[]): T {
  const index = Math.min(Math.floor(Math.random() * arr.length), arr.length - 1);
  return arr[index];
}

/**
 * Get stress level descriptor.
 */
function getStressDescriptor(stress: number): string {
  if (stress >= 90) return 'critical';
  if (stress >= 70) return 'high';
  if (stress >= 50) return 'moderate';
  if (stress >= 30) return 'manageable';
  return 'zen';
}

/**
 * Generate context flavor based on game state.
 */
function getContextFlavor(state: GameState): string | null {
  // Check for special states (20% chance to add flavor)
  if (Math.random() > 0.2) return null;

  const { resources, flags } = state;

  if (flags.isBurnedOut) {
    return pickRandom(CONTEXT_FLAVORS.burnout);
  }
  if (resources.stress >= 80) {
    return pickRandom(CONTEXT_FLAVORS.highStress);
  }
  if (resources.energy <= 20) {
    return pickRandom(CONTEXT_FLAVORS.lowEnergy);
  }
  if (resources.money <= 500) {
    return pickRandom(CONTEXT_FLAVORS.lowMoney);
  }
  if (resources.money >= 50000) {
    return pickRandom(CONTEXT_FLAVORS.highMoney);
  }

  // Flow state: high energy, low stress
  if (resources.energy >= 80 && resources.stress <= 20) {
    return pickRandom(CONTEXT_FLAVORS.flowState);
  }

  return null;
}

/**
 * Format delta summary into a compact string.
 */
function formatDeltaSummary(deltas: {
  skill?: number;
  energy?: number;
  stress?: number;
  money?: number;
  xp?: number;
  reputation?: number;
}): string {
  const parts: string[] = [];

  if (deltas.skill && deltas.skill !== 0) {
    parts.push(`${deltas.skill > 0 ? '+' : ''}${String(deltas.skill)} Skill`);
  }
  if (deltas.xp && deltas.xp !== 0) {
    parts.push(`${deltas.xp > 0 ? '+' : ''}${String(deltas.xp)} XP`);
  }
  if (deltas.energy && deltas.energy !== 0) {
    parts.push(`${deltas.energy > 0 ? '+' : ''}${String(deltas.energy)} ⚡`);
  }
  if (deltas.stress && deltas.stress !== 0) {
    parts.push(`${deltas.stress > 0 ? '+' : ''}${String(deltas.stress)} 💢`);
  }
  if (deltas.money && deltas.money !== 0) {
    parts.push(`${deltas.money > 0 ? '+' : '-'}$${String(Math.abs(deltas.money))}`);
  }
  if (deltas.reputation && deltas.reputation !== 0) {
    parts.push(`${deltas.reputation > 0 ? '+' : ''}${String(deltas.reputation)} Rep`);
  }

  return parts.length > 0 ? parts.join(' | ') : 'No changes';
}

/**
 * Generate a procedural event log message for an action.
 */
export function generateActionMessage(
  actionId: string,
  actionLabel: string,
  category: ActionCategory,
  state: GameState,
  deltas: {
    skill?: number;
    energy?: number;
    stress?: number;
    money?: number;
    xp?: number;
    reputation?: number;
  },
): string {
  // Get the job title
  const job = JOB_REGISTRY[state.career.currentJobId];
  const jobTitle = job.title;

  // Pick a random template for the category
  const template = pickRandom(CATEGORY_TEMPLATES[category]);

  // Format delta summary
  const delta = formatDeltaSummary(deltas);

  // Build the message from template
  let message = template
    .replace('{action}', actionLabel)
    .replace('{job}', jobTitle)
    .replace('{delta}', delta)
    .replace('{money}', `$${String(state.resources.money)}`)
    .replace('{skill}', String(state.stats.skills.coding))
    .replace('{stress}', getStressDescriptor(state.resources.stress))
    .replace('{ticket}', generateTicketNumber());

  // Add action-specific flavor (50% chance)
  if (actionId in ACTION_FLAVORS && Math.random() > 0.5) {
    const actionFlavors = ACTION_FLAVORS[actionId];
    message += ` ${pickRandom(actionFlavors)}`;
  }

  // Add context flavor based on game state
  const contextFlavor = getContextFlavor(state);
  if (contextFlavor) {
    message += ` ${contextFlavor}`;
  }

  return message;
}

/**
 * Generate a procedural event log entry.
 */
export function generateEventLogEntry(
  actionId: string,
  actionLabel: string,
  category: ActionCategory,
  state: GameState,
  deltas: {
    skill?: number;
    energy?: number;
    stress?: number;
    money?: number;
    xp?: number;
    reputation?: number;
  },
): EventLogEntry {
  // Determine event ID suffix based on category and outcome
  let eventIdSuffix = 'complete';
  if (category === 'WORK') eventIdSuffix = 'work';
  if (category === 'RECOVER') eventIdSuffix = 'recover';
  if (deltas.money && deltas.money < -1000) eventIdSuffix = 'broke';
  if (state.resources.energy >= 90 && state.resources.stress <= 15) eventIdSuffix = 'flow';

  return {
    tick: state.meta.tick,
    eventId: `action_${actionId}_${eventIdSuffix}`,
    message: generateActionMessage(actionId, actionLabel, category, state, deltas),
  };
}

/**
 * Generate a year-end event log entry.
 */
export function generateYearEndMessage(
  year: number,
  salary: number,
  rent: number,
  netIncome: number,
  jobTitle: string,
): EventLogEntry {
  const yearMessages = [
    `📅 YEAR ${String(year)} COMPLETE — Annual Review`,
    `🗓️ END OF YEAR ${String(year)} — Financial Summary`,
    `📊 YEAR ${String(year)} RETROSPECTIVE`,
    `💼 FISCAL YEAR ${String(year)} CLOSED`,
  ];

  const incomeStatus =
    netIncome >= 0
      ? `Net income: +$${netIncome.toLocaleString()}. Living within means.`
      : `Net loss: -$${Math.abs(netIncome).toLocaleString()}. Budget review recommended.`;

  const message =
    `${pickRandom(yearMessages)}\n` +
    `  💰 Salary: $${salary.toLocaleString()}/yr (as ${jobTitle})\n` +
    `  🏠 Rent: -$${rent.toLocaleString()}/yr\n` +
    `  📈 ${incomeStatus}`;

  return {
    tick: year * 52,
    eventId: 'year_end_summary',
    message,
  };
}

/**
 * Generate a random event message.
 */
export function generateRandomEventMessage(
  eventId: string,
  eventTitle: string,
  eventDescription: string,
  effectMessage: string,
): EventLogEntry {
  const prefixes = ['⚡ RANDOM EVENT:', '🎲 LIFE HAPPENS:', '📣 BREAKING:', '❗ EVENT:'];

  return {
    tick: 0, // Will be set by caller
    eventId: `random_${eventId}`,
    message: `${pickRandom(prefixes)} ${eventTitle} — ${eventDescription} ${effectMessage}`,
  };
}

/**
 * Generate a bankruptcy warning message.
 */
export function generateBankruptcyWarning(debt: number, debtLimit: number): EventLogEntry {
  const warningLevel = debt / debtLimit;

  let severity: string;
  let message: string;

  if (warningLevel >= 0.9) {
    severity = '🚨 CRITICAL';
    message = `Debt at ${String(Math.round(warningLevel * 100))}% of limit. Bankruptcy imminent!`;
  } else if (warningLevel >= 0.75) {
    severity = '⚠️ WARNING';
    message = `Debt at ${String(Math.round(warningLevel * 100))}% of limit. Financial intervention required.`;
  } else if (warningLevel >= 0.5) {
    severity = '📉 NOTICE';
    message = `Debt at ${String(Math.round(warningLevel * 100))}% of limit. Consider debt repayment.`;
  } else {
    severity = '💳 INFO';
    message = `Current debt: $${debt.toLocaleString()}. Manageable.`;
  }

  return {
    tick: 0,
    eventId: 'debt_warning',
    message: `${severity}: ${message}`,
  };
}

/**
 * Generate a promotion/job change message.
 */
export function generateJobChangeMessage(oldJobTitle: string, newJobTitle: string, newSalary: number): EventLogEntry {
  const messages = [
    `🎉 PROMOTED! ${oldJobTitle} → ${newJobTitle}. New salary: $${newSalary.toLocaleString()}/yr`,
    `📈 CAREER ADVANCEMENT: From ${oldJobTitle} to ${newJobTitle}! Salary bump to $${newSalary.toLocaleString()}/yr`,
    `✨ LEVEL UP: ${oldJobTitle} → ${newJobTitle} unlocked! Earning $${newSalary.toLocaleString()}/yr`,
    `🚀 NEW ROLE: Goodbye ${oldJobTitle}, hello ${newJobTitle}. Compensation: $${newSalary.toLocaleString()}/yr`,
  ];

  return {
    tick: 0,
    eventId: 'job_change_success',
    message: pickRandom(messages),
  };
}
