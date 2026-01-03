import { GameEvent, GameStats } from '@/types/game';

// Deterministic event generator for Phase 1
// TODO PHASE 2: Replace this with AI-powered event generation via Appwrite Functions + Gemini API

// Events for students (CS Student, CS Student Easy)
const STUDENT_EVENTS: GameEvent[] = [
  {
    id: 'student-1',
    title: 'Group Project Nightmare',
    description: "Your teammates didn't contribute. You carried the entire project.",
    effects: {
      stress: 15,
      coding: 3,
      energy: -10,
    },
  },
  {
    id: 'student-2',
    title: 'Professor Liked Your Code',
    description: 'Your assignment was used as an example in class. Feels good!',
    effects: {
      reputation: 3,
      stress: -10,
      coding: 2,
    },
  },
  {
    id: 'student-3',
    title: 'Study Group Success',
    description: 'Late-night study session with friends paid off. You all aced the exam!',
    effects: {
      stress: -15,
      coding: 2,
    },
  },
  {
    id: 'student-4',
    title: 'Scholarship Opportunity',
    description: 'You won a small coding competition. Prize money helps!',
    effects: {
      money: 500,
      reputation: 3,
      stress: -5,
    },
  },
  {
    id: 'student-5',
    title: 'Finals Week Stress',
    description: 'Three exams in two days. Coffee is your best friend now.',
    effects: {
      stress: 20,
      energy: -15,
    },
  },
  {
    id: 'student-6',
    title: 'Campus Hackathon Win',
    description: 'Your team won the local hackathon! Free pizza and glory.',
    effects: {
      coding: 5,
      reputation: 5,
      money: 200,
      stress: -5,
    },
  },
];

// Events for unemployed/hustler path
const UNEMPLOYED_EVENTS: GameEvent[] = [
  {
    id: 'unemployed-1',
    title: 'Tutorial Hell',
    description: "You've watched 50 tutorials but haven't built anything. Time to code!",
    effects: {
      stress: 10,
      coding: 1,
    },
  },
  {
    id: 'unemployed-2',
    title: 'Freelance Client Found You',
    description: 'Someone needs a quick website. Easy money!',
    effects: {
      money: 300,
      reputation: 2,
    },
  },
  {
    id: 'unemployed-3',
    title: 'Imposter Syndrome Hits',
    description: "Everyone else seems so much better. But you're learning!",
    effects: {
      stress: 15,
      energy: -10,
    },
  },
  {
    id: 'unemployed-4',
    title: 'Reddit Post Goes Viral',
    description: 'You shared your learning journey. People are inspired!',
    effects: {
      reputation: 5,
      stress: -10,
    },
  },
];

// Events for employed developers
const EMPLOYED_EVENTS: GameEvent[] = [
  {
    id: 'event-1',
    title: 'Server Outage at 3 AM',
    description: 'Production is down. Your phone is ringing.',
    effects: {
      stress: 20,
      energy: -15,
    },
  },
  {
    id: 'event-2',
    title: 'Pull Request Approved!',
    description: 'Your feature got merged. The senior dev left a nice comment.',
    effects: {
      reputation: 3,
      stress: -5,
    },
  },
  {
    id: 'event-3',
    title: 'Coffee Machine Broke',
    description: "The office coffee machine died. It's going to be a rough week.",
    effects: {
      energy: -10,
      stress: 5,
    },
  },
  {
    id: 'event-4',
    title: 'Bug Bounty Payout',
    description: 'That security issue you reported paid out!',
    effects: {
      money: 500,
      reputation: 2,
    },
  },
  {
    id: 'event-5',
    title: 'Conference Invitation',
    description: 'You got invited to speak at a tech conference. Travel expenses covered!',
    effects: {
      reputation: 5,
      stress: 10,
    },
  },
  {
    id: 'event-7',
    title: 'Legacy Code Discovery',
    description: 'You found a 10-year-old codebase with no tests. Someone has to maintain it.',
    effects: {
      stress: 15,
      coding: 2,
    },
  },
  {
    id: 'event-9',
    title: 'Surprise Deadline',
    description: 'Client moved the deadline up by two weeks. Panic mode activated.',
    effects: {
      stress: 25,
      energy: -20,
    },
  },
  {
    id: 'event-12',
    title: 'API Keys Leaked',
    description: "Someone committed API keys to the public repo. It wasn't you, but you're fixing it.",
    effects: {
      stress: 20,
      energy: -15,
    },
  },
  {
    id: 'event-13',
    title: 'Unexpected Bonus',
    description: 'Company had a great quarter. Everyone gets a bonus!',
    effects: {
      money: 1000,
      stress: -10,
    },
  },
  {
    id: 'event-14',
    title: 'Recruiter Spam Wave',
    description: 'Your inbox is flooded with recruiters. At least they found you.',
    effects: {
      reputation: 2,
      stress: 5,
    },
  },
  {
    id: 'event-15',
    title: 'Perfect Code Review',
    description: 'Your PR had zero comments. Clean code feels good.',
    effects: {
      coding: 2,
      stress: -5,
      reputation: 2,
    },
  },
];

// Events for senior+ developers (mentoring)
const SENIOR_EVENTS: GameEvent[] = [
  {
    id: 'event-6',
    title: 'Junior Dev Needs Help',
    description: 'A junior developer is stuck. You spend time mentoring them.',
    effects: {
      reputation: 2,
      energy: -10,
    },
  },
  {
    id: 'event-10',
    title: 'Mentor Recognition',
    description: 'The person you mentored got promoted. They thanked you publicly.',
    effects: {
      reputation: 5,
      stress: -5,
    },
  },
];

// Universal events (can happen to anyone)
const UNIVERSAL_EVENTS: GameEvent[] = [
  {
    id: 'event-8',
    title: 'Side Project Goes Viral',
    description: 'Your weekend project hit the front page of HackerNews!',
    effects: {
      reputation: 10,
      stress: -10,
      money: 200,
    },
  },
  {
    id: 'event-11',
    title: 'Open Source Contribution Merged',
    description: 'Your PR to a major OSS project got merged!',
    effects: {
      coding: 3,
      reputation: 5,
      stress: -5,
    },
  },
];

let eventCounter = 0;

// Deterministic event generator that cycles through events
export function generateEvent(): GameEvent {
  const event = UNIVERSAL_EVENTS[eventCounter % UNIVERSAL_EVENTS.length];
  eventCounter++;
  return event;
}

export function generateRandomEvent(stats?: GameStats): GameEvent {
  if (!stats) {
    return UNIVERSAL_EVENTS[Math.floor(Math.random() * UNIVERSAL_EVENTS.length)];
  }

  let availableEvents: GameEvent[] = [...UNIVERSAL_EVENTS];

  const jobId = stats.currentJob.id;
  const jobLevel = stats.currentJob.level;

  if (jobId === 'cs-student' || jobId === 'cs-student-easy') {
    availableEvents = [...availableEvents, ...STUDENT_EVENTS];
  } else if (jobId === 'unemployed' || jobId === 'script-kiddie') {
    availableEvents = [...availableEvents, ...UNEMPLOYED_EVENTS];
  } else if (jobLevel >= 2) {
    availableEvents = [...availableEvents, ...EMPLOYED_EVENTS];

    if (jobLevel >= 3) {
      availableEvents = [...availableEvents, ...SENIOR_EVENTS];
    }
  }

  const randomIndex = Math.floor(Math.random() * availableEvents.length);
  return availableEvents[randomIndex];
}

// Generate interview question (placeholder for AI)
// TODO PHASE 2: Replace with Appwrite Function call to Gemini API
export function generateInterviewQuestion(jobTitle: string): {
  question: string;
  options: string[];
  correctIndex: number;
} {
  const questions = [
    {
      question: `You're interviewing for ${jobTitle}. What's the time complexity of binary search?`,
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      correctIndex: 1,
    },
    {
      question: `For ${jobTitle}: Explain the difference between let and const in JavaScript.`,
      options: [
        'No difference',
        'let is block-scoped, const cannot be reassigned',
        'const is faster',
        'let is deprecated',
      ],
      correctIndex: 1,
    },
    {
      question: `${jobTitle} question: What is a RESTful API?`,
      options: [
        'A sleeping API',
        'An API that uses HTTP methods and follows REST principles',
        'A faster version of GraphQL',
        'An API with no documentation',
      ],
      correctIndex: 1,
    },
    {
      question: `Technical round for ${jobTitle}: What is the purpose of a database index?`,
      options: [
        'To make tables look organized',
        'To speed up query performance',
        'To encrypt data',
        'To backup data automatically',
      ],
      correctIndex: 1,
    },
    {
      question: `${jobTitle} behavioral: Tell me about a time you optimized code.`,
      options: [
        'I never optimize, premature optimization is evil',
        'I identified a bottleneck, profiled it, and reduced complexity',
        'I added more servers',
        'I deleted all comments',
      ],
      correctIndex: 1,
    },
  ];

  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

// Generate performance review text (placeholder)
// TODO PHASE 2: Replace with Gemini-generated review
export function generatePerformanceReview(
  currentJob: string,
  coding: number,
  reputation: number,
  promoted: boolean,
): string {
  const codingStr = String(coding);
  const reputationStr = String(reputation);

  if (promoted) {
    return `🎉 Performance Review Complete!\n\nYour skills have grown significantly. Coding: ${codingStr}, Reputation: ${reputationStr}.\n\nYou've earned a promotion! Keep up the excellent work.`;
  } else {
    return `📋 Performance Review Complete\n\nCurrent stats - Coding: ${codingStr}, Reputation: ${reputationStr}.\n\nYou're meeting expectations but need more growth for promotion. Keep grinding!`;
  }
}
