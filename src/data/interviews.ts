import { Job } from '@/types/game';

export interface InterviewQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const INTERVIEW_QUESTIONS: Record<string, InterviewQuestion[]> = {
  // Corporate path questions (general software engineering)
  corporate: [
    {
      question: 'What does "DRY" stand for in software development?',
      options: ["Don't Repeat Yourself", 'Do Run Yearly', 'Data Ready Yield', 'Declare Return Yes'],
      correctIndex: 0,
      explanation: "DRY = Don't Repeat Yourself. It's a core principle to avoid code duplication.",
    },
    {
      question: 'Which data structure uses LIFO (Last In, First Out)?',
      options: ['Queue', 'Stack', 'Heap', 'Tree'],
      correctIndex: 1,
      explanation: 'A Stack follows LIFO - the last element added is the first to be removed.',
    },
    {
      question: 'What is the time complexity of binary search?',
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      correctIndex: 1,
      explanation: 'Binary search has O(log n) complexity - it halves the search space each iteration.',
    },
    {
      question: 'In Git, what does "origin" typically refer to?',
      options: ['Local branch', 'Remote repository', 'First commit', 'Main branch'],
      correctIndex: 1,
      explanation: 'Origin is the default name for the remote repository you cloned from.',
    },
  ],

  // Management path questions (people & process)
  management: [
    {
      question: 'What is the primary goal of a sprint retrospective?',
      options: [
        'Assign tasks for next sprint',
        'Demo completed work',
        'Reflect and improve team processes',
        'Review code quality',
      ],
      correctIndex: 2,
      explanation: 'Retrospectives focus on continuous improvement of team processes and dynamics.',
    },
    {
      question: 'What does "WIP limit" mean in Kanban?',
      options: [
        'Work In Progress limit',
        'Weekly Improvement Plan',
        'Worker Integration Policy',
        'Workflow Inspection Point',
      ],
      correctIndex: 0,
      explanation: 'WIP limits prevent overloading the team by limiting Work In Progress.',
    },
    {
      question: 'What is a key principle of servant leadership?',
      options: [
        'Micromanage every task',
        'Remove blockers for the team',
        'Make all technical decisions',
        'Avoid team conflicts',
      ],
      correctIndex: 1,
      explanation: 'Servant leaders empower teams by removing obstacles and supporting their success.',
    },
    {
      question: 'What is "technical debt"?',
      options: [
        'Money owed to contractors',
        'Future cost of shortcuts taken today',
        'Team training budget',
        'Infrastructure expenses',
      ],
      correctIndex: 1,
      explanation: 'Technical debt is the implied cost of rework caused by choosing quick solutions now.',
    },
  ],

  // IC (Individual Contributor) path questions (deep technical)
  ic: [
    {
      question: 'What is the CAP theorem about?',
      options: [
        'Consistency, Availability, Partition tolerance',
        'Code, Architecture, Performance',
        'Caching, API, Persistence',
        'Concurrency, Asynchrony, Parallelism',
      ],
      correctIndex: 0,
      explanation:
        'CAP theorem: distributed systems can only guarantee 2 of 3 - Consistency, Availability, Partition tolerance.',
    },
    {
      question: 'What is "Big O" notation used for?',
      options: [
        'Measuring code quality',
        'Describing algorithm efficiency',
        'Defining API contracts',
        'Testing complexity',
      ],
      correctIndex: 1,
      explanation: 'Big O describes the worst-case time or space complexity of algorithms.',
    },
    {
      question: 'What does idempotent mean in API design?',
      options: ['Fast response time', 'Same request gives same result', 'Requires authentication', 'Uses JSON format'],
      correctIndex: 1,
      explanation: 'Idempotent operations produce the same result no matter how many times you repeat them.',
    },
    {
      question: 'What is the purpose of a load balancer?',
      options: ['Compress data', 'Distribute traffic across servers', 'Store user sessions', 'Encrypt communications'],
      correctIndex: 1,
      explanation: 'Load balancers distribute incoming requests across multiple servers for scalability.',
    },
  ],

  // Hustler path questions (scrappy practical knowledge)
  hustler: [
    {
      question: 'What is the fastest way to host a static website for free?',
      options: ['AWS EC2', 'GitHub Pages', 'Private server', 'Kubernetes'],
      correctIndex: 1,
      explanation: 'GitHub Pages offers free static site hosting with great performance.',
    },
    {
      question: 'Which is best for quick prototypes?',
      options: ['Write everything from scratch', 'Use frameworks and templates', 'Hire a team', 'Avoid JavaScript'],
      correctIndex: 1,
      explanation: 'Frameworks and templates let you build fast - perfect for hustlers.',
    },
    {
      question: 'What does "MVP" stand for?',
      options: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Proposition', 'Mobile View Pattern'],
      correctIndex: 1,
      explanation: 'MVP = Minimum Viable Product - the simplest version that solves the core problem.',
    },
    {
      question: 'How do freelancers typically charge clients?',
      options: ['Always monthly retainer', 'Hourly or project-based', 'Stock options only', 'Never upfront'],
      correctIndex: 1,
      explanation: 'Freelancers use hourly rates or fixed project prices, often with upfront deposits.',
    },
  ],

  // Business path questions (entrepreneurship & growth)
  business: [
    {
      question: 'What is "Product-Market Fit"?',
      options: [
        'Your product solves a real problem for customers',
        'Your product looks good',
        'Your team is happy',
        'You have funding',
      ],
      correctIndex: 0,
      explanation: 'Product-Market Fit means your product satisfies real market demand.',
    },
    {
      question: 'What does "CAC" mean in SaaS?',
      options: [
        'Customer Acquisition Cost',
        'Code Analysis Check',
        'Centralized Access Control',
        'Cloud Application Cache',
      ],
      correctIndex: 0,
      explanation: 'CAC = Customer Acquisition Cost - how much you spend to get one customer.',
    },
    {
      question: 'What is "MRR" in subscription businesses?',
      options: [
        'Maximum Revenue Rate',
        'Monthly Recurring Revenue',
        'Marketing Response Ratio',
        'Minimum Required Resources',
      ],
      correctIndex: 1,
      explanation: 'MRR = Monthly Recurring Revenue - predictable subscription income per month.',
    },
    {
      question: 'What is a "pivot" in startup terminology?',
      options: [
        'Rotating office chairs',
        'Changing business direction based on learning',
        'Firing employees',
        'Moving to a new office',
      ],
      correctIndex: 1,
      explanation: "A pivot is a strategic change in direction when your initial approach isn't working.",
    },
  ],

  // Specialist path questions (consulting & architecture)
  specialist: [
    {
      question: 'What is "Conway\'s Law"?',
      options: [
        'Systems mirror org structure',
        'Code must have comments',
        'Tests run before deployment',
        'APIs need versioning',
      ],
      correctIndex: 0,
      explanation: "Conway's Law: organizations design systems that mirror their communication structure.",
    },
    {
      question: 'What is the purpose of an API gateway?',
      options: [
        'Store API documentation',
        'Single entry point for API requests',
        'Generate API keys',
        'Test API endpoints',
      ],
      correctIndex: 1,
      explanation: 'API gateways provide routing, authentication, rate limiting, and monitoring for microservices.',
    },
    {
      question: 'What does "eventual consistency" mean?',
      options: [
        'Data will be consistent immediately',
        'Data will be consistent given enough time',
        'Data is never consistent',
        'Data requires manual sync',
      ],
      correctIndex: 1,
      explanation: 'Eventual consistency means all replicas will eventually have the same data, but not instantly.',
    },
    {
      question: 'What is the main benefit of microservices?',
      options: ['Easier to debug', 'Independent scaling and deployment', 'Less code to write', 'No need for testing'],
      correctIndex: 1,
      explanation: 'Microservices allow teams to scale and deploy services independently.',
    },
  ],
};

export function getInterviewQuestion(job: Job): InterviewQuestion {
  const pathQuestions = INTERVIEW_QUESTIONS[job.path] ?? INTERVIEW_QUESTIONS.corporate;

  const randomIndex = Math.floor(Math.random() * pathQuestions.length);
  return pathQuestions[randomIndex];
}

export function requiresInterview(job: Job): boolean {
  const noInterviewJobs = ['unemployed', 'cs-student', 'script-kiddie'];
  return !noInterviewJobs.includes(job.id);
}

export function getInterviewDifficulty(job: Job): 'easy' | 'medium' | 'hard' {
  if (job.level <= 2) return 'easy';
  if (job.level === 3) return 'medium';
  return 'hard';
}
