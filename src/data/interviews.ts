/**
 * @fileoverview Interview question pools for the v2 job application flow.
 *
 * Each jobId from tracks.ts has a dedicated pool of 10-15 questions
 * at varying difficulty. During an interview, 3 are randomly selected.
 *
 * Questions are inspired by the legacy v1 interview bank but tailored
 * to the specific roles and tracks in the current architecture.
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface InterviewQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUESTION POOLS (keyed by jobId from tracks.ts)
// ═══════════════════════════════════════════════════════════════════════════

const INTERVIEW_POOLS: Record<string, InterviewQuestion[]> = {
  // ─────────────────────────────────────────────────────────────────────────
  // CORPORATE L1
  // ─────────────────────────────────────────────────────────────────────────

  corp_intern: [
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
      explanation: 'A Stack follows LIFO — the last element added is the first to be removed.',
    },
    {
      question: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Home Tool Markup Language',
        'Hyperlink Text Mode Language',
      ],
      correctIndex: 0,
      explanation: 'HTML = Hyper Text Markup Language, the standard markup language for web pages.',
    },
    {
      question: 'What command creates a new Git branch?',
      options: ['git new branch', 'git branch <name>', 'git create branch', 'git make branch'],
      correctIndex: 1,
      explanation: 'git branch <name> creates a new branch. Use git checkout -b <name> to create and switch.',
    },
    {
      question: 'What is a "for loop" used for?',
      options: ['Defining functions', 'Iterating over a sequence', 'Handling errors', 'Importing modules'],
      correctIndex: 1,
      explanation: 'A for loop repeatedly executes code while iterating over a sequence of elements.',
    },
    {
      question: 'In Git, what does "origin" typically refer to?',
      options: ['Local branch', 'Remote repository', 'First commit', 'Main branch'],
      correctIndex: 1,
      explanation: 'Origin is the default name for the remote repository you cloned from.',
    },
    {
      question: 'What is the purpose of a code review?',
      options: [
        'Delete old code',
        'Catch bugs and improve code quality',
        'Rewrite from scratch',
        'Measure typing speed',
      ],
      correctIndex: 1,
      explanation: 'Code reviews help catch bugs, share knowledge, and improve overall code quality.',
    },
    {
      question: 'What does CSS stand for?',
      options: ['Cascading Style Sheets', 'Computer Style Syntax', 'Creative Styling System', 'Central Sheet Styles'],
      correctIndex: 0,
      explanation: 'CSS = Cascading Style Sheets, used to style HTML documents.',
    },
    {
      question: 'What is version control used for?',
      options: [
        'Running tests',
        'Tracking changes to code over time',
        'Deploying to production',
        'Writing documentation',
      ],
      correctIndex: 1,
      explanation: 'Version control systems like Git track every change to code, enabling collaboration and rollback.',
    },
    {
      question: 'What is a "boolean" data type?',
      options: ['A decimal number', 'A true/false value', 'A text string', 'An array'],
      correctIndex: 1,
      explanation: 'Booleans represent exactly two values: true or false.',
    },
    {
      question: 'What is the difference between "==" and "===" in JavaScript?',
      options: ['No difference', '=== checks type too', '== is faster', '=== is deprecated'],
      correctIndex: 1,
      explanation: '=== (strict equality) checks both value AND type, while == only checks value with coercion.',
    },
    {
      question: 'What does an IDE stand for?',
      options: [
        'Internet Data Exchange',
        'Integrated Development Environment',
        'Internal Debug Engine',
        'Interactive Design Editor',
      ],
      correctIndex: 1,
      explanation: 'An IDE provides tools like code editing, debugging, and building in one application.',
    },
  ],

  corp_junior: [
    {
      question: 'What is the time complexity of binary search?',
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      correctIndex: 1,
      explanation: 'Binary search has O(log n) complexity — it halves the search space each iteration.',
    },
    {
      question: 'What is the difference between "==" and "===" in JavaScript?',
      options: ['No difference', '=== checks type too', '== is faster', '=== is deprecated'],
      correctIndex: 1,
      explanation: '=== (strict equality) checks both value AND type, while == only checks value with coercion.',
    },
    {
      question: 'What is "garbage collection" in programming?',
      options: ['Deleting unused files', 'Automatic memory management', 'Code optimization', 'Error logging'],
      correctIndex: 1,
      explanation: 'Garbage collection automatically frees memory occupied by objects no longer in use.',
    },
    {
      question: 'What does REST stand for in API design?',
      options: [
        'Rapid Endpoint Service Technology',
        'Representational State Transfer',
        'Remote Execution Standard Type',
        'Resource Entity State Transfer',
      ],
      correctIndex: 1,
      explanation: 'REST = Representational State Transfer, an architectural style for designing networked APIs.',
    },
    {
      question: 'What is the purpose of an index in a database?',
      options: ['Store backup data', 'Speed up query lookups', 'Encrypt sensitive data', 'Validate data types'],
      correctIndex: 1,
      explanation: 'Indexes create a data structure that speeds up retrieval operations on database tables.',
    },
    {
      question: 'What is a "race condition"?',
      options: [
        'A fast algorithm',
        'When multiple processes access shared data unpredictably',
        'A testing methodology',
        'A type of loop',
      ],
      correctIndex: 1,
      explanation:
        'Race conditions occur when multiple threads/processes access shared resources in an unpredictable order.',
    },
    {
      question: 'What is "memoization"?',
      options: ['Memory allocation', 'Caching function results', 'Memory leak detection', 'Writing notes in code'],
      correctIndex: 1,
      explanation: 'Memoization caches expensive function results to avoid redundant computations.',
    },
    {
      question: 'What design pattern is commonly used in React for sharing logic?',
      options: ['Singleton', 'Custom Hooks', 'Factory', 'Adapter'],
      correctIndex: 1,
      explanation: 'Custom Hooks let you extract and reuse stateful logic between React components.',
    },
    {
      question: 'What is a "pull request"?',
      options: [
        'Downloading code',
        'A request to merge code changes into a branch',
        'Fetching remote data',
        'A server request',
      ],
      correctIndex: 1,
      explanation: 'Pull requests propose merging changes from one branch to another, enabling code review.',
    },
    {
      question: 'What is a "deadlock"?',
      options: [
        'A secure encryption method',
        'When two processes wait forever for each other',
        'A terminated process',
        'A locked file',
      ],
      correctIndex: 1,
      explanation: 'Deadlock occurs when two or more processes are stuck waiting for each other to release resources.',
    },
    {
      question: 'What is "unit testing"?',
      options: [
        'Testing the full application',
        'Testing individual functions in isolation',
        'User acceptance testing',
        'Load testing',
      ],
      correctIndex: 1,
      explanation: 'Unit tests verify individual functions or methods in isolation from the rest of the system.',
    },
    {
      question: 'What is the purpose of the "package.json" file?',
      options: ['Store database config', 'Define project metadata and dependencies', 'Run tests', 'Deploy the app'],
      correctIndex: 1,
      explanation: 'package.json defines project metadata, scripts, and dependency versions for Node.js projects.',
    },
  ],

  corp_mid: [
    {
      question: 'What is the time complexity of quicksort in the average case?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correctIndex: 1,
      explanation: 'Quicksort averages O(n log n), though worst case (already sorted) is O(n²).',
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
      question: 'What is a "hash collision"?',
      options: [
        'When two keys produce the same hash value',
        'A database error',
        'A network failure',
        'A memory overflow',
      ],
      correctIndex: 0,
      explanation: 'Hash collision occurs when two different inputs produce the same hash output.',
    },
    {
      question: 'What is "dynamic programming"?',
      options: [
        'Programming at runtime',
        'Solving problems by breaking them into overlapping subproblems',
        'Using dynamic typing',
        'Rapid prototyping',
      ],
      correctIndex: 1,
      explanation:
        'Dynamic programming solves complex problems by breaking them into overlapping subproblems and caching solutions.',
    },
    {
      question: 'What is the difference between BFS and DFS?',
      options: [
        'BFS uses stack, DFS uses queue',
        'BFS explores level by level, DFS explores depth first',
        'They are identical',
        'DFS is always faster',
      ],
      correctIndex: 1,
      explanation:
        'BFS (Breadth-First) explores neighbors first using a queue. DFS (Depth-First) goes deep using a stack.',
    },
    {
      question: 'What is a "mutex"?',
      options: ['A music codec', 'Mutual exclusion lock for thread safety', 'A math function', 'A type of queue'],
      correctIndex: 1,
      explanation:
        'A mutex (mutual exclusion) prevents multiple threads from accessing shared resources simultaneously.',
    },
    {
      question: 'What is the SOLID principle "S" about?',
      options: ['Single Responsibility', 'Static typing', 'Synchronization', 'Security'],
      correctIndex: 0,
      explanation: 'Single Responsibility Principle: a class should have only one reason to change.',
    },
    {
      question: 'What is "dependency injection"?',
      options: [
        'Installing npm packages',
        'Providing dependencies from outside rather than creating them inside',
        'Injecting code at runtime',
        'A security vulnerability',
      ],
      correctIndex: 1,
      explanation:
        'Dependency injection passes dependencies to a component rather than having it create them internally.',
    },
    {
      question: 'What is a "design pattern"?',
      options: [
        'A CSS framework',
        'A reusable solution to a common software problem',
        'A testing approach',
        'A UI library',
      ],
      correctIndex: 1,
      explanation: 'Design patterns are proven reusable solutions to recurring software engineering problems.',
    },
    {
      question: 'What is "continuous integration" (CI)?',
      options: [
        'Deploying code manually',
        'Automatically building and testing code on every commit',
        'Writing code faster',
        'A coding style',
      ],
      correctIndex: 1,
      explanation: 'CI automatically builds and runs tests on every code change to catch issues early.',
    },
    {
      question: 'What is the Observer pattern?',
      options: [
        'Watching code execute',
        'Objects subscribe to receive notifications of state changes',
        'A debugging tool',
        'A logging framework',
      ],
      correctIndex: 1,
      explanation:
        'The Observer pattern lets multiple objects subscribe to events from a subject and get notified of changes.',
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

  corp_senior: [
    {
      question: 'What is the CAP theorem?',
      options: [
        'Consistency, Availability, Partition tolerance',
        'Code, Architecture, Performance',
        'Caching, API, Persistence',
        'Concurrency, Asynchrony, Parallelism',
      ],
      correctIndex: 0,
      explanation:
        'CAP theorem states distributed systems can only guarantee 2 of 3: Consistency, Availability, Partition tolerance.',
    },
    {
      question: 'What is "database sharding"?',
      options: [
        'Encrypting a database',
        'Splitting data across multiple databases',
        'Backing up data',
        'Creating indexes',
      ],
      correctIndex: 1,
      explanation: 'Sharding partitions data across multiple databases to improve scalability.',
    },
    {
      question: 'What is the "Two-Phase Commit" protocol?',
      options: [
        'A code review process',
        'A distributed transaction protocol ensuring all-or-nothing commits',
        'A deployment strategy',
        'A testing methodology',
      ],
      correctIndex: 1,
      explanation: 'Two-Phase Commit coordinates distributed transactions so all nodes commit or all rollback.',
    },
    {
      question: 'What is "event sourcing"?',
      options: [
        'Logging events',
        'Storing all changes as a sequence of events instead of current state',
        'Event-driven architecture',
        'Source control for events',
      ],
      correctIndex: 1,
      explanation: 'Event sourcing stores every change as an immutable event, enabling full history reconstruction.',
    },
    {
      question: 'What is a "circuit breaker" pattern?',
      options: [
        'Electrical safety',
        'Preventing cascading failures by stopping requests to failing services',
        'A testing pattern',
        'A database pattern',
      ],
      correctIndex: 1,
      explanation: 'Circuit breakers prevent cascading failures by temporarily stopping requests to a failing service.',
    },
    {
      question: 'What is "CQRS"?',
      options: [
        'Command Query Responsibility Segregation',
        'Central Query Response System',
        'Cached Query Result Storage',
        'Concurrent Queue Response Service',
      ],
      correctIndex: 0,
      explanation: 'CQRS separates read and write operations into different models for optimization and scalability.',
    },
    {
      question: 'What is the difference between "vertical" and "horizontal" partitioning?',
      options: [
        'They are identical',
        'Vertical splits columns, horizontal splits rows',
        'Vertical is faster',
        'Horizontal uses more memory',
      ],
      correctIndex: 1,
      explanation: 'Vertical partitioning splits tables by columns. Horizontal partitioning (sharding) splits by rows.',
    },
    {
      question: 'How do you approach mentoring a junior developer?',
      options: [
        'Do their work for them',
        'Pair program and guide them through problems',
        'Ignore them until they learn',
        'Only review their PRs',
      ],
      correctIndex: 1,
      explanation: 'Effective mentoring combines pair programming, guided problem-solving, and regular feedback.',
    },
    {
      question: 'What is a "distributed lock"?',
      options: [
        'Encryption across servers',
        'Mechanism to ensure only one process accesses a resource across nodes',
        'A network firewall',
        'A database constraint',
      ],
      correctIndex: 1,
      explanation: 'Distributed locks ensure mutual exclusion across multiple nodes in a distributed system.',
    },
    {
      question: 'What is "consensus" in distributed systems?',
      options: [
        'Team agreement',
        'Agreement among distributed nodes on data values',
        'Code review approval',
        'Management decision',
      ],
      correctIndex: 1,
      explanation: 'Consensus algorithms (Paxos, Raft) help distributed nodes agree on values despite failures.',
    },
    {
      question: 'What is "load shedding"?',
      options: [
        'Reducing server hardware',
        'Dropping low-priority requests to protect system stability',
        'Removing old data',
        'Decreasing team size',
      ],
      correctIndex: 1,
      explanation:
        'Load shedding intentionally drops lower-priority work to keep the system responsive under extreme load.',
    },
    {
      question: 'What is "idempotency" in API design?',
      options: [
        'Fast response time',
        'Same request gives same result regardless of how many times called',
        'Requires authentication',
        'Uses JSON format',
      ],
      correctIndex: 1,
      explanation: 'Idempotent operations produce the same result no matter how many times you repeat them.',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // HUSTLER L1
  // ─────────────────────────────────────────────────────────────────────────

  hustle_freelancer: [
    {
      question: 'What does "MVP" stand for?',
      options: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Proposition', 'Mobile View Pattern'],
      correctIndex: 1,
      explanation: 'MVP = Minimum Viable Product — the simplest version that solves the core problem.',
    },
    {
      question: 'How do freelancers typically charge clients?',
      options: ['Always monthly retainer', 'Hourly or project-based', 'Stock options only', 'Never upfront'],
      correctIndex: 1,
      explanation: 'Freelancers use hourly rates or fixed project prices, often with upfront deposits.',
    },
    {
      question: 'What is the best way to find freelance clients initially?',
      options: [
        'Wait for them to find you',
        'Cold outreach and platforms like Upwork/Fiverr',
        'Only rely on referrals',
        'Paid advertising only',
      ],
      correctIndex: 1,
      explanation: 'New freelancers should actively reach out and use platforms to build an initial client base.',
    },
    {
      question: 'Why is having a portfolio important for freelancers?',
      options: [
        'Legal requirement',
        'Shows potential clients your skills and past work',
        'Tax purposes',
        'Required for freelance platforms',
      ],
      correctIndex: 1,
      explanation: 'Portfolios demonstrate your capabilities and build credibility with potential clients.',
    },
    {
      question: 'What is "scope" in a project?',
      options: [
        'A telescope accessory',
        'The defined work and deliverables for a project',
        'Code optimization',
        'Testing methodology',
      ],
      correctIndex: 1,
      explanation: 'Scope defines what work is included in a project — clear scope prevents misunderstandings.',
    },
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
      explanation: 'Frameworks and templates let you build fast — perfect for hustlers.',
    },
    {
      question: 'What should you always get from clients before starting work?',
      options: ['Their favorite color', 'A signed contract and deposit', 'Their social media passwords', 'Coffee'],
      correctIndex: 1,
      explanation: 'Always get contracts signed and deposits paid to protect yourself as a freelancer.',
    },
    {
      question: 'What is a "retainer" agreement?',
      options: [
        'A lawyer contract',
        'Client pays monthly for guaranteed availability/hours',
        'Equipment rental',
        'Office lease',
      ],
      correctIndex: 1,
      explanation: 'Retainers guarantee ongoing work/income, and clients get priority access to your services.',
    },
    {
      question: 'What is "scope creep" in freelancing?',
      options: ['A bug type', 'Uncontrolled expansion of project requirements', 'Code refactoring', 'Team growth'],
      correctIndex: 1,
      explanation: 'Scope creep is the uncontrolled expansion of project scope without adjusting time or cost.',
    },
    {
      question: 'What is "time tracking" important for?',
      options: [
        'Impressing clients',
        'Accurate billing and productivity analysis',
        'Legal compliance',
        'Social media content',
      ],
      correctIndex: 1,
      explanation: 'Time tracking ensures accurate billing for hourly work and helps analyze productivity.',
    },
    {
      question: 'What is a good initial hourly rate strategy?',
      options: [
        'Always be the cheapest',
        'Research market rates and price based on skill level',
        'Charge $1000/hr from day one',
        'Work for free to build portfolio',
      ],
      correctIndex: 1,
      explanation: 'Research comparable rates in your market and set pricing that reflects your skill level.',
    },
  ],

  hustle_nomad: [
    {
      question: 'What is "recurring revenue" and why is it valuable?',
      options: [
        'One-time payments',
        'Predictable income from ongoing services/subscriptions',
        'Refunds',
        'Charity donations',
      ],
      correctIndex: 1,
      explanation: 'Recurring revenue provides stable, predictable income — essential for financial stability.',
    },
    {
      question: 'What is the "80/20 rule" for freelancers?',
      options: [
        '80% work, 20% vacation',
        '80% of revenue often comes from 20% of clients',
        '80% planning, 20% execution',
        '80 hours per week minimum',
      ],
      correctIndex: 1,
      explanation: 'The Pareto principle: focus on the 20% of clients/work that generates 80% of your income.',
    },
    {
      question: 'What is "no-code/low-code" development?',
      options: [
        'Writing minimal code',
        'Building apps with visual tools instead of traditional coding',
        'Deleting code',
        'Code obfuscation',
      ],
      correctIndex: 1,
      explanation: 'No-code/low-code platforms let you build apps using visual interfaces, speeding up development.',
    },
    {
      question: 'Why should freelancers build "passive income streams"?',
      options: [
        'Tax avoidance',
        "Income that doesn't require active time-for-money trade",
        'Client requirement',
        'Industry regulation',
      ],
      correctIndex: 1,
      explanation: 'Passive income (courses, templates, SaaS) scales without trading more hours for money.',
    },
    {
      question: 'What is "white-labeling"?',
      options: [
        'Using white backgrounds',
        'Providing services that clients resell under their brand',
        'Label printing',
        'Clean code practices',
      ],
      correctIndex: 1,
      explanation: 'White-label services let agencies resell your work under their own brand.',
    },
    {
      question: 'What is the key to scaling a freelance business?',
      options: ['Working more hours', 'Systemizing, delegating, and productizing', 'Lower prices', 'Fewer clients'],
      correctIndex: 1,
      explanation: 'Scale by creating systems, hiring contractors, or building products — not just working more.',
    },
    {
      question: 'What is a "discovery call" in freelancing?',
      options: [
        'Exploring new technologies',
        'Initial call to understand client needs and qualify the project',
        'Bug discovery session',
        'Team meeting',
      ],
      correctIndex: 1,
      explanation: 'Discovery calls help understand client needs, qualify leads, and scope potential projects.',
    },
    {
      question: 'What is "niche specialization" and why does it help?',
      options: [
        'Being a generalist',
        'Focusing on specific industry/service for expertise and higher rates',
        'Narrow-minded thinking',
        'Working less',
      ],
      correctIndex: 1,
      explanation: 'Specializing in a niche builds expertise, reduces competition, and commands premium rates.',
    },
    {
      question: 'What is the biggest risk of the digital nomad lifestyle?',
      options: [
        'Too much vacation',
        'Inconsistent income and time zone challenges',
        'Too many clients',
        'Perfect work-life balance',
      ],
      correctIndex: 1,
      explanation: 'Nomads face income instability and coordination challenges across time zones.',
    },
    {
      question: 'What is "productized service"?',
      options: [
        'Selling physical products',
        'Standardized service packages with fixed scope and price',
        'Manufacturing software',
        'Product photography',
      ],
      correctIndex: 1,
      explanation: 'Productized services are standardized offerings with clear deliverables and fixed pricing.',
    },
    {
      question: 'What is "value-based pricing"?',
      options: [
        'Charging minimum wage',
        'Pricing based on value delivered to client, not hours worked',
        'Discount pricing',
        'Market average pricing',
      ],
      correctIndex: 1,
      explanation: 'Value-based pricing focuses on the business value you provide, often commanding higher rates.',
    },
    {
      question: 'How do you manage clients across multiple time zones?',
      options: [
        'Only work your local hours',
        'Use async communication and clear scheduling tools',
        'Ignore the time difference',
        'Work 24/7',
      ],
      correctIndex: 1,
      explanation: 'Async communication (Loom, Slack, docs) and shared calendars help bridge time zone gaps.',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // L2: CORPORATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────

  corp_lead: [
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
      question: 'What does "WIP limit" mean in Kanban?',
      options: [
        'Work In Progress limit',
        'Weekly Improvement Plan',
        'Worker Integration Policy',
        'Workflow Inspection Point',
      ],
      correctIndex: 0,
      explanation: 'WIP limits prevent overloading the team by limiting concurrent Work In Progress items.',
    },
    {
      question: 'What is a "standup meeting"?',
      options: [
        'A meeting while standing for exercise',
        'A brief daily sync on progress and blockers',
        'A formal presentation',
        'An end-of-project review',
      ],
      correctIndex: 1,
      explanation: 'Daily standups are short sync meetings where team members share progress, plans, and blockers.',
    },
    {
      question: 'What is "velocity" in Agile?',
      options: ['How fast developers type', 'Amount of work completed per sprint', 'Time to market', 'Bug fix rate'],
      correctIndex: 1,
      explanation: 'Velocity measures the amount of work (story points) a team completes per sprint.',
    },
    {
      question: 'How should a team lead handle conflict between two developers?',
      options: [
        'Ignore it',
        'Fire one of them',
        'Facilitate a private conversation to find common ground',
        'Take sides publicly',
      ],
      correctIndex: 2,
      explanation: 'Address conflicts directly but privately, facilitating dialogue for mutual understanding.',
    },
    {
      question: 'What is a "user story"?',
      options: [
        'A customer testimonial',
        'A requirement written from the user perspective',
        'A bug report',
        'A code comment',
      ],
      correctIndex: 1,
      explanation: 'User stories describe requirements from the end-user perspective: "As a [user], I want [feature]."',
    },
    {
      question: 'What is the best approach for code reviews as a lead?',
      options: [
        'Approve everything quickly',
        'Provide constructive feedback focused on learning',
        'Reject everything',
        'Skip reviews for senior devs',
      ],
      correctIndex: 1,
      explanation: 'Effective code reviews are constructive, educational, and maintain quality standards.',
    },
    {
      question: 'What is "psychological safety" in a team?',
      options: [
        'Physical workspace safety',
        'Feeling safe to take risks and speak up without fear',
        'Job security',
        'Mental health coverage',
      ],
      correctIndex: 1,
      explanation:
        'Psychological safety means team members feel safe to take risks and admit mistakes without punishment.',
    },
    {
      question: 'What is "scope creep"?',
      options: ['A bug type', 'Uncontrolled expansion of project requirements', 'Code refactoring', 'Team growth'],
      correctIndex: 1,
      explanation: 'Scope creep is the uncontrolled expansion of scope without adjusting time, cost, or resources.',
    },
    {
      question: 'What is a "burndown chart"?',
      options: [
        'A stress indicator',
        'A graph showing remaining work over time',
        'A team mood tracker',
        'A performance review',
      ],
      correctIndex: 1,
      explanation: 'Burndown charts visualize work remaining versus time, helping track sprint progress.',
    },
    {
      question: 'How do you balance coding and management responsibilities?',
      options: [
        'Only code',
        'Only manage',
        'Allocate dedicated time for both based on team needs',
        'Let the team decide',
      ],
      correctIndex: 2,
      explanation:
        'Effective leads allocate time intentionally, prioritizing unblocking the team while staying technical.',
    },
  ],

  corp_manager: [
    {
      question: 'What is the difference between "management" and "leadership"?',
      options: [
        'They are identical',
        'Management focuses on processes, leadership on inspiring people',
        'Leadership pays more',
        'Management is outdated',
      ],
      correctIndex: 1,
      explanation: 'Management focuses on processes and efficiency. Leadership inspires vision and motivates people.',
    },
    {
      question: 'How do you handle an underperforming team member?',
      options: [
        'Immediately fire them',
        'Provide feedback, set clear expectations, and offer support',
        'Ignore the problem',
        'Publicly criticize them',
      ],
      correctIndex: 1,
      explanation:
        'Address underperformance with constructive feedback, clear expectations, and coaching before escalation.',
    },
    {
      question: 'What is "situational leadership"?',
      options: [
        'Leading only in emergencies',
        'Adapting leadership style based on team maturity and task',
        'Leadership by committee',
        'Remote leadership',
      ],
      correctIndex: 1,
      explanation:
        'Situational leadership adapts style (directing, coaching, supporting, delegating) based on team needs.',
    },
    {
      question: 'What is the "RACI matrix"?',
      options: [
        'A performance rating',
        'Responsible, Accountable, Consulted, Informed assignment chart',
        'A testing framework',
        'A budget allocation tool',
      ],
      correctIndex: 1,
      explanation: 'RACI clarifies who is Responsible, Accountable, Consulted, and Informed for each task.',
    },
    {
      question: 'What is "stakeholder management"?',
      options: [
        'Managing team salaries',
        'Building relationships and managing expectations of interested parties',
        'Stock management',
        'Resource allocation',
      ],
      correctIndex: 1,
      explanation:
        'Stakeholder management involves identifying, analyzing, and engaging people affected by the project.',
    },
    {
      question: 'What is "OKR" methodology?',
      options: [
        'Objectives and Key Results',
        'Operational Knowledge Review',
        'Organizational Key Roles',
        'Output Quality Rating',
      ],
      correctIndex: 0,
      explanation: 'OKRs set ambitious Objectives with measurable Key Results to track progress toward goals.',
    },
    {
      question: 'What is "change management"?',
      options: [
        'Version control',
        'Systematic approach to transitioning individuals through change',
        'Changing managers frequently',
        'Budget revisions',
      ],
      correctIndex: 1,
      explanation: 'Change management is a structured approach to help people adopt new processes or technologies.',
    },
    {
      question: 'How do you build a culture of continuous improvement?',
      options: [
        'Mandate overtime',
        'Encourage experimentation, retrospectives, and safe failure',
        'Hire only senior devs',
        'Avoid all risk',
      ],
      correctIndex: 1,
      explanation: 'Continuous improvement thrives on psychological safety, experimentation, and regular reflection.',
    },
    {
      question: 'What is the difference between a Product Owner and a Scrum Master?',
      options: [
        'They are the same role',
        'PO manages backlog priorities, SM facilitates process',
        'SM writes code, PO tests',
        'PO manages people, SM manages budget',
      ],
      correctIndex: 1,
      explanation: 'Product Owners manage the product backlog. Scrum Masters facilitate the Scrum process.',
    },
    {
      question: 'What is "headcount planning"?',
      options: [
        'Counting employees',
        'Strategic forecasting of team size based on business needs',
        'Office capacity planning',
        'Attendance tracking',
      ],
      correctIndex: 1,
      explanation: 'Headcount planning aligns team size and hiring with business goals and budget constraints.',
    },
    {
      question: 'What is the most important skill for a people manager?',
      options: ['Coding speed', 'Empathy and active listening', 'Spreadsheet skills', 'Meeting scheduling'],
      correctIndex: 1,
      explanation: 'Empathy and active listening help managers understand, support, and motivate their teams.',
    },
    {
      question: 'How do you manage up effectively?',
      options: [
        'Always agree with your boss',
        'Communicate proactively, set expectations, and provide data-driven updates',
        'Avoid your boss',
        'Only escalate problems',
      ],
      correctIndex: 1,
      explanation: 'Managing up means proactive communication, transparency, and keeping leadership informed.',
    },
  ],

  corp_cto: [
    {
      question: 'What is the primary responsibility of a CTO?',
      options: [
        'Writing all the code',
        'Setting technical vision and aligning technology with business strategy',
        'Managing HR',
        'Sales',
      ],
      correctIndex: 1,
      explanation: 'CTOs align technology strategy with business goals and set the long-term technical vision.',
    },
    {
      question: 'How do you evaluate build vs. buy decisions?',
      options: [
        'Always build',
        'Always buy',
        'Evaluate total cost, strategic value, and time-to-market',
        'Let the team vote',
      ],
      correctIndex: 2,
      explanation: 'Build vs. buy decisions weigh total cost of ownership, strategic differentiation, and speed.',
    },
    {
      question: 'What is "platform engineering"?',
      options: [
        'Building platforms',
        'Creating internal developer platforms to improve productivity',
        'Hardware engineering',
        'Social media platforms',
      ],
      correctIndex: 1,
      explanation: 'Platform engineering builds internal developer platforms that abstract infrastructure complexity.',
    },
    {
      question: 'What is a "technology radar"?',
      options: [
        'A scanning device',
        'A framework for tracking and evaluating emerging technologies',
        'A code scanner',
        'A network monitor',
      ],
      correctIndex: 1,
      explanation:
        'Technology radars help organizations assess, trial, and adopt emerging technologies systematically.',
    },
    {
      question: 'How do you manage technical debt at the executive level?',
      options: [
        'Ignore it',
        'Quantify its business impact and allocate dedicated capacity',
        'Leave it to developers',
        'Rewrite everything',
      ],
      correctIndex: 1,
      explanation: 'CTOs quantify tech debt in business terms and ensure ongoing investment in paying it down.',
    },
    {
      question: 'What is "engineering culture"?',
      options: [
        'Free snacks',
        'Shared values, practices, and norms that shape how engineering teams work',
        'Office decor',
        'Company parties',
      ],
      correctIndex: 1,
      explanation: 'Engineering culture encompasses the values and norms that drive how teams collaborate and build.',
    },
    {
      question: 'What is the role of architecture review boards?',
      options: [
        'Approve timesheets',
        'Govern major technical decisions and ensure consistency',
        'Write code',
        'Hire architects',
      ],
      correctIndex: 1,
      explanation: 'Architecture review boards guide major technical decisions and maintain system consistency.',
    },
    {
      question: 'How do you drive innovation in a large engineering org?',
      options: [
        'Top-down mandates only',
        'Hack weeks, R&D budgets, and empowered teams',
        'Hire consultants',
        'Copy competitors',
      ],
      correctIndex: 1,
      explanation: 'Innovation thrives with dedicated time, R&D investment, and empowered autonomous teams.',
    },
    {
      question: 'What is "due diligence" in M&A from a tech perspective?',
      options: [
        'Code review',
        'Evaluating tech stack, team, debt, and scalability of acquisition targets',
        'Legal paperwork',
        'Hiring process',
      ],
      correctIndex: 1,
      explanation:
        'Technical due diligence assesses tech stack health, talent, and scalability of acquisition targets.',
    },
    {
      question: 'What metrics should a CTO track?',
      options: [
        'Lines of code',
        'Deployment frequency, lead time, MTTR, and change failure rate',
        'Number of meetings',
        'Coffee consumption',
      ],
      correctIndex: 1,
      explanation:
        'DORA metrics (deployment frequency, lead time, MTTR, change failure rate) measure engineering effectiveness.',
    },
    {
      question: 'What is the biggest risk when scaling engineering teams rapidly?',
      options: [
        'Too many ideas',
        'Loss of culture, communication overhead, and quality degradation',
        'Too much money',
        'Too many tools',
      ],
      correctIndex: 1,
      explanation:
        'Rapid scaling can erode culture, increase coordination costs, and lower quality without guardrails.',
    },
    {
      question: 'What is "FinOps" in cloud computing?',
      options: [
        'Financial operations',
        'Practice of bringing financial accountability to cloud spending',
        'Fintech operations',
        'Financial software',
      ],
      correctIndex: 1,
      explanation: 'FinOps brings financial accountability to cloud spending through cross-functional collaboration.',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // L2: CORPORATE IC TRACK
  // ─────────────────────────────────────────────────────────────────────────

  ic_staff: [
    {
      question: 'What is the CAP theorem about?',
      options: [
        'Consistency, Availability, Partition tolerance',
        'Code, Architecture, Performance',
        'Caching, API, Persistence',
        'Concurrency, Asynchrony, Parallelism',
      ],
      correctIndex: 0,
      explanation: 'CAP theorem: distributed systems can only guarantee 2 of 3 properties.',
    },
    {
      question: 'What does "idempotent" mean in API design?',
      options: ['Fast response time', 'Same request gives same result', 'Requires authentication', 'Uses JSON format'],
      correctIndex: 1,
      explanation: 'Idempotent operations produce the same result no matter how many times you repeat them.',
    },
    {
      question: 'What is "horizontal scaling"?',
      options: [
        'Adding more RAM',
        'Adding more servers to handle load',
        'Improving code efficiency',
        'Reducing database size',
      ],
      correctIndex: 1,
      explanation: 'Horizontal scaling (scaling out) adds more machines to handle increased load.',
    },
    {
      question: 'What is the purpose of a load balancer?',
      options: ['Compress data', 'Distribute traffic across servers', 'Store user sessions', 'Encrypt communications'],
      correctIndex: 1,
      explanation: 'Load balancers distribute incoming requests across multiple servers for scalability.',
    },
    {
      question: 'What is "database sharding"?',
      options: [
        'Encrypting database',
        'Splitting data across multiple databases',
        'Backing up data',
        'Indexing tables',
      ],
      correctIndex: 1,
      explanation: 'Sharding partitions data across multiple databases to improve scalability and performance.',
    },
    {
      question: 'What is a "message queue"?',
      options: [
        'An email system',
        'Asynchronous communication between services',
        'A logging system',
        'A database type',
      ],
      correctIndex: 1,
      explanation: 'Message queues enable asynchronous communication, decoupling producers and consumers.',
    },
    {
      question: 'What is "eventual consistency"?',
      options: [
        'Immediate data sync',
        'Data becomes consistent over time, not immediately',
        'Database never syncs',
        'Manual data sync',
      ],
      correctIndex: 1,
      explanation: 'All replicas will converge to the same state eventually, but not immediately after writes.',
    },
    {
      question: 'What is a "reverse proxy"?',
      options: [
        'A backup server',
        'Server that forwards client requests to backend servers',
        'A firewall',
        'A database replica',
      ],
      correctIndex: 1,
      explanation: 'Reverse proxies sit in front of backends, providing caching, load balancing, and security.',
    },
    {
      question: 'What is "rate limiting"?',
      options: [
        'Speeding up requests',
        'Controlling the number of requests a client can make',
        'Measuring response times',
        'Prioritizing requests',
      ],
      correctIndex: 1,
      explanation: 'Rate limiting controls how many requests a client can make in a time period to prevent abuse.',
    },
    {
      question: 'What defines a Staff Engineer role compared to Senior?',
      options: [
        'More coding',
        'Cross-team technical influence and system-level thinking',
        'Better perks',
        'More meetings',
      ],
      correctIndex: 1,
      explanation: 'Staff Engineers operate across teams, influence architecture, and solve system-wide problems.',
    },
    {
      question: 'What is the difference between SQL and NoSQL databases?',
      options: [
        'SQL is faster',
        'SQL uses structured schemas, NoSQL is more flexible',
        'NoSQL is deprecated',
        'They are identical',
      ],
      correctIndex: 1,
      explanation: 'SQL uses structured schemas; NoSQL offers flexible schemas and horizontal scaling.',
    },
    {
      question: 'What is "glue work" in engineering?',
      options: [
        'Using adhesives',
        'Essential but often invisible work that keeps teams and projects running',
        'Copying code',
        'Documentation only',
      ],
      correctIndex: 1,
      explanation: 'Glue work includes onboarding, docs, cross-team coordination — vital but often unrecognized.',
    },
  ],

  ic_principal: [
    {
      question: 'What is the "Two-Phase Commit" protocol?',
      options: [
        'A code review process',
        'A distributed transaction protocol ensuring all-or-nothing commits',
        'A deployment strategy',
        'A testing methodology',
      ],
      correctIndex: 1,
      explanation: 'Two-Phase Commit coordinates distributed transactions so all nodes commit or all rollback.',
    },
    {
      question: 'What is "consensus" in distributed systems?',
      options: [
        'Team agreement',
        'Agreement among distributed nodes on data values',
        'Code review approval',
        'Management decision',
      ],
      correctIndex: 1,
      explanation: 'Consensus algorithms (Paxos, Raft) help distributed nodes agree despite failures.',
    },
    {
      question: 'What is a "circuit breaker" pattern?',
      options: [
        'Electrical safety',
        'Preventing cascading failures by stopping requests to failing services',
        'A testing pattern',
        'A database pattern',
      ],
      correctIndex: 1,
      explanation: 'Circuit breakers prevent cascading failures by temporarily halting requests to failing services.',
    },
    {
      question: 'What is "CQRS"?',
      options: [
        'Command Query Responsibility Segregation',
        'Central Query Response System',
        'Cached Query Result Storage',
        'Concurrent Queue Response Service',
      ],
      correctIndex: 0,
      explanation: 'CQRS separates read and write operations into different models for optimization.',
    },
    {
      question: 'What is "event sourcing"?',
      options: [
        'Logging events',
        'Storing all changes as events instead of current state',
        'Event-driven architecture',
        'Source control for events',
      ],
      correctIndex: 1,
      explanation: 'Event sourcing stores every change as an immutable event for full history reconstruction.',
    },
    {
      question: 'What is the difference between "vertical" and "horizontal" partitioning?',
      options: [
        'They are identical',
        'Vertical splits columns, horizontal splits rows',
        'Vertical is faster',
        'Horizontal uses more memory',
      ],
      correctIndex: 1,
      explanation: 'Vertical partitioning splits by columns. Horizontal partitioning (sharding) splits by rows.',
    },
    {
      question: 'What is a "distributed lock"?',
      options: [
        'Encryption across servers',
        'Mechanism ensuring only one process accesses a resource across nodes',
        'Network firewall',
        'Database constraint',
      ],
      correctIndex: 1,
      explanation: 'Distributed locks ensure mutual exclusion across multiple nodes.',
    },
    {
      question: 'How does a Principal Engineer differ from a Staff Engineer?',
      options: [
        'More coding',
        'Broader organizational influence and multi-year technical strategy',
        'Better office',
        'More direct reports',
      ],
      correctIndex: 1,
      explanation: 'Principals shape multi-year technical direction and influence across the entire engineering org.',
    },
    {
      question: 'What is "cell-based architecture"?',
      options: [
        'Biological computing',
        'Dividing the system into isolated cells for fault tolerance',
        'Spreadsheet design',
        'Mobile architecture',
      ],
      correctIndex: 1,
      explanation: 'Cell architecture isolates failures by partitioning the system into independent cells.',
    },
    {
      question: 'What is "chaos engineering"?',
      options: [
        'Random coding',
        'Deliberately injecting failures to test system resilience',
        'Unstructured development',
        'Breaking things randomly',
      ],
      correctIndex: 1,
      explanation: 'Chaos engineering proactively tests resilience by simulating real-world failures.',
    },
    {
      question: 'What is the "outbox pattern"?',
      options: [
        'Email sending',
        'Ensuring reliable event publishing with a transactional outbox table',
        'File storage',
        'Message queuing',
      ],
      correctIndex: 1,
      explanation: 'The outbox pattern uses a database table to reliably publish events alongside transactions.',
    },
    {
      question: 'What is "data mesh"?',
      options: [
        'Database networking',
        'Decentralized data architecture treating data as a product',
        'Mesh networking',
        'Data visualization',
      ],
      correctIndex: 1,
      explanation: 'Data mesh decentralizes data ownership to domain teams, treating data as a first-class product.',
    },
  ],

  ic_fellow: [
    {
      question: 'What is the role of a Distinguished Fellow?',
      options: [
        'Day-to-day coding',
        'Setting industry-level technical vision and solving unprecedented problems',
        'Managing teams',
        'Writing documentation',
      ],
      correctIndex: 1,
      explanation: 'Fellows set technical direction at an industry level and tackle the hardest unsolved problems.',
    },
    {
      question: 'What is "multi-tenancy" in SaaS architecture?',
      options: [
        'Multiple buildings',
        'Single instance serving multiple customers with data isolation',
        'Team collaboration',
        'Microservices',
      ],
      correctIndex: 1,
      explanation: 'Multi-tenancy serves multiple customers from shared infrastructure while isolating their data.',
    },
    {
      question: 'What is the "actor model" in distributed systems?',
      options: [
        'Hollywood pattern',
        'Concurrency model where actors communicate via messages',
        'User role management',
        'Testing with actors',
      ],
      correctIndex: 1,
      explanation: 'The actor model uses lightweight actors that communicate exclusively through async messages.',
    },
    {
      question: 'How do you evaluate emerging technology for adoption?',
      options: [
        'Follow hype cycles',
        'Assess maturity, fit, risk, and run controlled experiments',
        'Wait for competitors',
        'Ask Twitter',
      ],
      correctIndex: 1,
      explanation: 'Systematic evaluation considers maturity, organizational fit, risk, and proof-of-concept results.',
    },
    {
      question: 'What are "formal methods" in software engineering?',
      options: [
        'Business attire',
        'Mathematically rigorous techniques for system specification and verification',
        'Documentation standards',
        'Code formatting rules',
      ],
      correctIndex: 1,
      explanation: 'Formal methods use math to prove correctness of critical systems (e.g., TLA+, Alloy).',
    },
    {
      question: 'What is "linearizability"?',
      options: [
        'Code formatting',
        'Strongest consistency model where operations appear instantaneous',
        'Linear algebra',
        'Sequential processing',
      ],
      correctIndex: 1,
      explanation: 'Linearizability guarantees that operations appear to execute atomically at some point in time.',
    },
    {
      question: 'What is a "CRDTs" (Conflict-free Replicated Data Type)?',
      options: [
        'A database type',
        'Data structures that can be replicated and merged without conflicts',
        'A testing framework',
        'A caching strategy',
      ],
      correctIndex: 1,
      explanation: 'CRDTs allow concurrent updates on multiple replicas that automatically converge.',
    },
    {
      question: 'What is the difference between "correctness" and "performance"?',
      options: [
        'They are the same',
        'Correctness means right results; performance means timely results',
        'Performance is more important',
        'Correctness is optional',
      ],
      correctIndex: 1,
      explanation:
        'Correctness ensures right output; performance ensures acceptable latency and throughput. Both matter.',
    },
    {
      question: 'What is "Byzantine fault tolerance"?',
      options: [
        'Turkish architecture',
        'System resilience when some nodes behave arbitrarily or maliciously',
        'Database backup',
        'Network security',
      ],
      correctIndex: 1,
      explanation: 'BFT handles the hardest failure mode: nodes that lie, delay, or act maliciously.',
    },
    {
      question: 'How do you influence technical direction without authority?',
      options: [
        'Force your ideas',
        'Build consensus through RFCs, demos, and data-driven proposals',
        'Ignore disagreement',
        'Wait for promotion',
      ],
      correctIndex: 1,
      explanation: 'Fellows influence through technical writing (RFCs), prototypes, data, and building consensus.',
    },
    {
      question: 'What is "mechanical sympathy" in systems design?',
      options: [
        'Being nice to machines',
        'Understanding hardware to write more efficient software',
        'Robot emotions',
        'Physical computing',
      ],
      correctIndex: 1,
      explanation:
        'Mechanical sympathy means designing software with awareness of underlying hardware characteristics.',
    },
    {
      question: "What is the role of open source in a Fellow's work?",
      options: [
        'Free labor',
        'Advancing the field, building industry influence, and attracting talent',
        'Legal risk',
        'Marketing stunt',
      ],
      correctIndex: 1,
      explanation: 'Open source advances the field, builds credibility, and attracts top engineering talent.',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // L2: HUSTLER BUSINESS TRACK
  // ─────────────────────────────────────────────────────────────────────────

  hustle_agency: [
    {
      question: 'What is "Product-Market Fit"?',
      options: [
        'Your product looks good',
        'Your product solves a real problem for customers',
        'Your team is happy',
        'You have funding',
      ],
      correctIndex: 1,
      explanation: 'Product-Market Fit means your product satisfies real market demand.',
    },
    {
      question: 'What does "CAC" mean?',
      options: [
        'Customer Acquisition Cost',
        'Code Analysis Check',
        'Centralized Access Control',
        'Cloud Application Cache',
      ],
      correctIndex: 0,
      explanation: 'CAC = Customer Acquisition Cost — how much you spend to acquire one customer.',
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
      explanation: 'MRR = Monthly Recurring Revenue — predictable subscription income per month.',
    },
    {
      question: 'How do you manage a team of freelancers as an agency owner?',
      options: [
        'Micromanage every task',
        'Set clear expectations, use project management tools, and trust your team',
        'Let everyone do whatever they want',
        'Only hire your friends',
      ],
      correctIndex: 1,
      explanation: 'Effective agency management combines clear processes, good tools, and trust.',
    },
    {
      question: 'What is "churn rate"?',
      options: ['Butter production', 'Percentage of customers who cancel', 'Employee turnover', 'Server downtime'],
      correctIndex: 1,
      explanation: 'Churn rate measures the percentage of customers who stop using your service.',
    },
    {
      question: 'What is the biggest risk of running an agency?',
      options: ['Too much work', 'Cash flow problems from client payment delays', 'Too many employees', 'Office rent'],
      correctIndex: 1,
      explanation: 'Agencies often face cash flow challenges when clients pay late or projects are delayed.',
    },
    {
      question: 'What is a "landing page"?',
      options: ['Airport website', 'A focused webpage designed to convert visitors', 'Homepage only', 'Contact page'],
      correctIndex: 1,
      explanation: 'Landing pages are focused pages designed to convert visitors into leads or customers.',
    },
    {
      question: 'What is "unit economics"?',
      options: [
        'Office supply costs',
        'Profitability analysis per customer/transaction',
        'Real estate costs',
        'Salary calculations',
      ],
      correctIndex: 1,
      explanation: 'Unit economics analyzes revenue and costs per customer to determine business viability.',
    },
    {
      question: 'What is "white-label" service in the agency model?',
      options: [
        'Clean branding',
        'Providing services that other agencies resell under their brand',
        'Minimal design',
        'No logo',
      ],
      correctIndex: 1,
      explanation: 'White-labeling lets you scale by providing services other agencies sell as their own.',
    },
    {
      question: 'What is a "retainer" model for agencies?',
      options: [
        'One-time payment',
        'Client pays recurring fee for ongoing services and priority access',
        'Equity-based payment',
        'Free trial period',
      ],
      correctIndex: 1,
      explanation: 'Retainers provide predictable revenue in exchange for ongoing availability and service.',
    },
    {
      question: 'What is "scope of work" (SOW)?',
      options: [
        'A farming tool',
        'A document defining project deliverables, timeline, and cost',
        'A programming concept',
        'An employment contract',
      ],
      correctIndex: 1,
      explanation: 'SOW is a formal document that defines exactly what will be delivered, when, and for how much.',
    },
    {
      question: 'How do you price agency services?',
      options: [
        'Always hourly',
        'Mix of value-based, project-based, and retainer pricing depending on the engagement',
        'Always the lowest rate',
        'Only equity',
      ],
      correctIndex: 1,
      explanation: 'Effective agencies use varied pricing models matched to different engagement types.',
    },
  ],

  hustle_influencer: [
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
    {
      question: 'What is "LTV" (Lifetime Value)?',
      options: [
        'Long-Term Vision',
        'Total revenue expected from a customer over their lifetime',
        'Legal Term Validation',
        'Lead Time Variance',
      ],
      correctIndex: 1,
      explanation: 'LTV predicts total revenue from a customer — should be higher than CAC for profitability.',
    },
    {
      question: 'What is a "freemium" model?',
      options: [
        'Everything is free',
        'Basic features free, premium features paid',
        'Free trials only',
        'Discounted pricing',
      ],
      correctIndex: 1,
      explanation: 'Freemium offers basic features for free while charging for advanced features.',
    },
    {
      question: 'What is "NPS" (Net Promoter Score)?',
      options: [
        'Network Protocol Standard',
        'Measures customer loyalty via likelihood to recommend',
        'New Product Sales',
        'Non-Profit Status',
      ],
      correctIndex: 1,
      explanation: 'NPS measures customer satisfaction: "How likely are you to recommend us?" (0-10 scale).',
    },
    {
      question: 'What is "product-led growth"?',
      options: [
        'Marketing-driven growth',
        'The product itself drives acquisition and retention',
        'CEO-led growth',
        'Sales-led growth',
      ],
      correctIndex: 1,
      explanation: 'PLG uses the product as the primary driver of acquisition, conversion, and expansion.',
    },
    {
      question: 'How do you monetize an audience as a tech influencer?',
      options: [
        'Only ads',
        'Sponsorships, courses, consulting, and product launches',
        'Donations only',
        'Only affiliate links',
      ],
      correctIndex: 1,
      explanation: 'Diversified monetization — sponsorships, courses, consulting, products — maximizes revenue.',
    },
    {
      question: 'What is "cohort analysis"?',
      options: [
        'Team performance review',
        'Analyzing groups of users who signed up at the same time',
        'Competitor analysis',
        'Code review',
      ],
      correctIndex: 1,
      explanation: 'Cohort analysis tracks behavior of user groups over time to identify patterns.',
    },
    {
      question: 'What is "personal branding"?',
      options: [
        'Getting a tattoo',
        'Building a recognizable professional identity and reputation',
        'Company logo',
        'Domain name',
      ],
      correctIndex: 1,
      explanation: 'Personal branding creates a recognizable identity that attracts opportunities and followers.',
    },
    {
      question: 'What is "content marketing"?',
      options: [
        'Advertising',
        'Creating valuable content to attract and retain an audience',
        'Email spam',
        'Cold calling',
      ],
      correctIndex: 1,
      explanation: 'Content marketing builds trust and audience through valuable, relevant content.',
    },
    {
      question: 'What is "virality coefficient"?',
      options: [
        'Disease spread rate',
        'How many new users each existing user brings',
        'Server uptime',
        'Code quality metric',
      ],
      correctIndex: 1,
      explanation: 'Virality coefficient > 1 means exponential growth — each user brings more than one new user.',
    },
    {
      question: 'What is the "PLG flywheel"?',
      options: [
        'A gym equipment',
        'Self-reinforcing cycle where product usage drives growth',
        'Email marketing',
        'Sales pipeline',
      ],
      correctIndex: 1,
      explanation: 'PLG flywheel: users try product → love it → invite others → more users → more growth.',
    },
    {
      question: 'What is "expansion revenue"?',
      options: [
        'Office expansion costs',
        'Additional revenue from existing customers through upsells and upgrades',
        'New customer revenue',
        'Investment funding',
      ],
      correctIndex: 1,
      explanation: 'Expansion revenue comes from existing customers upgrading, adding seats, or buying add-ons.',
    },
  ],

  hustle_mogul: [
    {
      question: 'What is the "Rule of 40" in SaaS?',
      options: [
        '40 employees minimum',
        'Growth rate + profit margin should equal or exceed 40%',
        '40 hour work week',
        '40% market share',
      ],
      correctIndex: 1,
      explanation: 'Rule of 40: healthy SaaS companies have revenue growth % + profit margin % ≥ 40%.',
    },
    {
      question: 'What is "negative churn"?',
      options: [
        'Losing customers',
        'Revenue from existing customers grows faster than revenue lost from churn',
        'Churning butter backwards',
        'Customer acquisition',
      ],
      correctIndex: 1,
      explanation: 'Negative churn means expansion revenue from existing customers exceeds lost revenue.',
    },
    {
      question: 'What is "burn multiple"?',
      options: [
        'Fire safety metric',
        'Net burn / Net new ARR — measures efficiency of growth spending',
        'CPU usage',
        'Employee burnout rate',
      ],
      correctIndex: 1,
      explanation: "Burn multiple shows how much you're spending to generate each dollar of new ARR.",
    },
    {
      question: 'What is the ideal "LTV:CAC ratio"?',
      options: ['1:1', '3:1 or higher', '1:3', "Doesn't matter"],
      correctIndex: 1,
      explanation: 'LTV:CAC of 3:1 means you make 3x what you spent acquiring a customer.',
    },
    {
      question: 'What is "quick ratio" in SaaS?',
      options: [
        'Speed of payment',
        '(New MRR + Expansion MRR) / (Churned MRR + Contraction MRR)',
        'Current assets ratio',
        'Response time metric',
      ],
      correctIndex: 1,
      explanation: 'Quick ratio measures growth efficiency — a ratio > 4 indicates healthy growth.',
    },
    {
      question: 'How does a Tech Mogul differ from a startup founder?',
      options: [
        'More money',
        'Proven ability to scale multiple ventures and build sustainable empires',
        'Younger',
        'More famous',
      ],
      correctIndex: 1,
      explanation: 'Moguls have scaled multiple ventures and built sustainable, diversified business portfolios.',
    },
    {
      question: 'What is "ARR"?',
      options: ['Pirate noise', 'Annual Recurring Revenue', 'Average Response Rate', 'Application Runtime Ratio'],
      correctIndex: 1,
      explanation: 'ARR = Annual Recurring Revenue = MRR × 12, a key SaaS health metric.',
    },
    {
      question: 'What is a "moat" in business strategy?',
      options: [
        'A water feature',
        'Sustainable competitive advantages that protect market position',
        'A firewall',
        'An office design',
      ],
      correctIndex: 1,
      explanation: 'Business moats (brand, network effects, switching costs) protect against competition.',
    },
    {
      question: 'What is "venture debt"?',
      options: [
        'Personal debt',
        'Non-dilutive financing for venture-backed companies',
        'Credit card debt',
        'Student loans',
      ],
      correctIndex: 1,
      explanation: 'Venture debt provides capital without giving up equity — useful for extending runway.',
    },
    {
      question: 'What is "platform risk"?',
      options: [
        'Software bugs',
        'Depending on a platform that can change rules or access at any time',
        'Server crashes',
        'Code complexity',
      ],
      correctIndex: 1,
      explanation: 'Platform risk means your business depends on another platform that can change the rules.',
    },
    {
      question: 'What is a "secondary sale" in startup equity?',
      options: [
        'Selling products',
        'Existing shareholders selling their shares to new investors',
        'Second product launch',
        'Follow-up sale',
      ],
      correctIndex: 1,
      explanation: 'Secondary sales let early employees and investors get liquidity before an IPO or acquisition.',
    },
    {
      question: 'What is "blitzscaling"?',
      options: [
        'Fast coding',
        'Prioritizing speed over efficiency to rapidly capture market share',
        'Gaming strategy',
        'Aggressive hiring',
      ],
      correctIndex: 1,
      explanation: 'Blitzscaling sacrifices efficiency for speed to dominate a winner-take-all market.',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // L2: HUSTLER SPECIALIST TRACK
  // ─────────────────────────────────────────────────────────────────────────

  hustle_contractor: [
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
      explanation: 'API gateways provide routing, authentication, rate limiting, and monitoring.',
    },
    {
      question: 'What is the main benefit of microservices?',
      options: ['Easier to debug', 'Independent scaling and deployment', 'Less code to write', 'No need for testing'],
      correctIndex: 1,
      explanation: 'Microservices allow teams to scale and deploy services independently.',
    },
    {
      question: 'What is "domain-driven design"?',
      options: [
        'Website design',
        'Designing software around business domains and language',
        'Database design',
        'UI/UX design',
      ],
      correctIndex: 1,
      explanation: 'DDD focuses on modeling software to match the business domain with ubiquitous language.',
    },
    {
      question: 'What is "infrastructure as code"?',
      options: [
        'Writing code on servers',
        'Managing infrastructure through definition files',
        'Hardware documentation',
        'Code comments',
      ],
      correctIndex: 1,
      explanation: 'IaC manages infrastructure using code (Terraform, CloudFormation) for consistency.',
    },
    {
      question: 'What makes a great contractor different from a great employee?',
      options: [
        'Higher hourly rate',
        'Ability to deliver fast value with minimal onboarding',
        'More vacation time',
        'Less accountability',
      ],
      correctIndex: 1,
      explanation: 'Great contractors ramp up fast, deliver independently, and require minimal hand-holding.',
    },
    {
      question: 'What is a "service mesh"?',
      options: [
        'Fishing equipment',
        'Infrastructure layer handling service-to-service communication',
        'Network cables',
        'Database cluster',
      ],
      correctIndex: 1,
      explanation: 'Service meshes handle communication, security, and observability between microservices.',
    },
    {
      question: 'What is "technical architecture"?',
      options: [
        'Building design',
        'High-level structure of software systems',
        'Hardware specifications',
        'Office layout',
      ],
      correctIndex: 1,
      explanation: 'Technical architecture defines how system components are organized and interact.',
    },
    {
      question: 'What is the "strangler fig pattern"?',
      options: [
        'A plant disease',
        'Gradually replacing legacy systems by building new around old',
        'A security vulnerability',
        'A testing method',
      ],
      correctIndex: 1,
      explanation: 'Strangler fig incrementally replaces legacy systems by routing traffic to new implementations.',
    },
    {
      question: 'How do you estimate work accurately as a contractor?',
      options: [
        'Always double the estimate',
        'Break work into small tasks, account for unknowns, and add buffer',
        'Guess and hope',
        'Use AI',
      ],
      correctIndex: 1,
      explanation: 'Accurate estimates come from decomposition, historical data, and accounting for unknowns.',
    },
    {
      question: 'What is "observability" in systems?',
      options: [
        'Code visibility',
        'Understanding system state from external outputs (logs, metrics, traces)',
        'UI monitoring',
        'Code reviews',
      ],
      correctIndex: 1,
      explanation: 'Observability combines logging, metrics, and tracing to understand system behavior.',
    },
    {
      question: 'What is the best way to handle knowledge transfer as a contractor?',
      options: [
        'Keep knowledge to yourself',
        'Document decisions, write clear code, and do handoff sessions',
        'Leave it to the client',
        'Write a novel',
      ],
      correctIndex: 1,
      explanation: 'Good contractors document thoroughly and ensure smooth handoffs for long-term maintainability.',
    },
  ],

  hustle_consultant: [
    {
      question: 'What is a "bounded context" in DDD?',
      options: ['Limited memory', 'Explicit boundary where a domain model applies', 'Restricted access', 'Code scope'],
      correctIndex: 1,
      explanation: 'Bounded contexts define clear boundaries where specific domain models apply.',
    },
    {
      question: 'What is a "saga pattern" in microservices?',
      options: [
        'A long story',
        'Managing distributed transactions through a sequence of local transactions',
        'A logging pattern',
        'A deployment strategy',
      ],
      correctIndex: 1,
      explanation: 'Sagas manage distributed transactions with local transactions and compensating actions.',
    },
    {
      question: 'What is "sidecar pattern"?',
      options: [
        'Motorcycle accessory',
        'Deploying helper containers alongside main containers',
        'A security pattern',
        'A caching strategy',
      ],
      correctIndex: 1,
      explanation: 'Sidecar pattern deploys supporting functionality in a separate container alongside the app.',
    },
    {
      question: 'How does a consultant add value beyond just coding?',
      options: [
        'Work longer hours',
        'Provide strategic insights, identify root causes, and transfer knowledge',
        'Use more frameworks',
        'Write more tests',
      ],
      correctIndex: 1,
      explanation: 'Consultants combine technical skill with strategic thinking and knowledge transfer.',
    },
    {
      question: 'What is "value-based pricing" for consulting?',
      options: [
        'Charging minimum wage',
        'Pricing based on business impact delivered, not hours worked',
        'Discount pricing',
        'Market average pricing',
      ],
      correctIndex: 1,
      explanation: 'Value-based pricing ties fees to business outcomes, often commanding premium rates.',
    },
    {
      question: 'What is "chaos engineering"?',
      options: [
        'Random coding',
        'Deliberately injecting failures to test system resilience',
        'Unstructured development',
        'Breaking things randomly',
      ],
      correctIndex: 1,
      explanation: 'Chaos engineering proactively tests resilience by simulating real-world failures.',
    },
    {
      question: 'What is "cell-based architecture"?',
      options: [
        'Biological computing',
        'Dividing system into isolated cells for fault tolerance',
        'Spreadsheet design',
        'Mobile architecture',
      ],
      correctIndex: 1,
      explanation: 'Cell architecture isolates failures by partitioning the system into independent cells.',
    },
    {
      question: 'What is the "outbox pattern"?',
      options: [
        'Email sending',
        'Ensuring reliable event publishing with transactional outbox table',
        'File storage',
        'Message queuing',
      ],
      correctIndex: 1,
      explanation: 'The outbox pattern uses a database table to reliably publish events alongside transactions.',
    },
    {
      question: 'What is the best way to scope a consulting engagement?',
      options: [
        'Accept everything the client asks',
        'Define clear objectives, deliverables, and success criteria upfront',
        'Keep it vague',
        'Only do what you want',
      ],
      correctIndex: 1,
      explanation: 'Clear scoping prevents scope creep and aligns expectations for successful engagements.',
    },
    {
      question: 'What is "data mesh"?',
      options: [
        'Database networking',
        'Decentralized data architecture treating data as a product',
        'Mesh networking',
        'Data visualization',
      ],
      correctIndex: 1,
      explanation: 'Data mesh decentralizes data ownership to domain teams, treating data as a product.',
    },
    {
      question: 'What is a "platform engineering" engagement?',
      options: [
        'Building a website',
        'Helping organizations build internal developer platforms',
        'Social media management',
        'App store optimization',
      ],
      correctIndex: 1,
      explanation: 'Platform engineering engagements help clients build internal platforms for developer productivity.',
    },
    {
      question: 'What is "thought leadership" in consulting?',
      options: [
        'Mind control',
        'Establishing expertise through content, talks, and innovative ideas',
        'Being bossy',
        'Reading minds',
      ],
      correctIndex: 1,
      explanation: 'Thought leadership builds reputation through sharing expertise, insights, and innovative thinking.',
    },
  ],

  hustle_architect: [
    {
      question: 'What is "multi-tenancy" in SaaS architecture?',
      options: [
        'Multiple buildings',
        'Single instance serving multiple customers with data isolation',
        'Team collaboration',
        'Microservices',
      ],
      correctIndex: 1,
      explanation: 'Multi-tenancy serves multiple customers from shared infrastructure while isolating data.',
    },
    {
      question: 'What is the "actor model" in distributed systems?',
      options: [
        'Hollywood pattern',
        'Concurrency model where actors communicate via messages',
        'User role management',
        'Testing with actors',
      ],
      correctIndex: 1,
      explanation: 'The actor model uses lightweight actors communicating through asynchronous messages.',
    },
    {
      question: 'What are "formal methods" in software engineering?',
      options: [
        'Business attire',
        'Mathematically rigorous techniques for system verification',
        'Documentation standards',
        'Code formatting rules',
      ],
      correctIndex: 1,
      explanation: 'Formal methods use math to prove system correctness (TLA+, Alloy, etc.).',
    },
    {
      question: 'What is "linearizability"?',
      options: [
        'Code formatting',
        'Strongest consistency model where operations appear instantaneous',
        'Linear algebra',
        'Sequential processing',
      ],
      correctIndex: 1,
      explanation: 'Linearizability guarantees operations appear to execute atomically at some point in time.',
    },
    {
      question: 'What is "CRDTs" (Conflict-free Replicated Data Type)?',
      options: [
        'A database type',
        'Data structures that replicate and merge without conflicts',
        'A testing framework',
        'A caching strategy',
      ],
      correctIndex: 1,
      explanation: 'CRDTs allow concurrent updates on multiple replicas that automatically converge.',
    },
    {
      question: 'What is "Byzantine fault tolerance"?',
      options: [
        'Turkish architecture',
        'System resilience when some nodes behave maliciously',
        'Database backup',
        'Network security',
      ],
      correctIndex: 1,
      explanation: 'BFT handles nodes that lie, delay, or act maliciously — the hardest failure mode.',
    },
    {
      question: 'How do you design systems for 10x scale?',
      options: [
        'Hope for the best',
        'Use stateless services, horizontal scaling, and partition data early',
        'Buy bigger servers',
        'Limit users',
      ],
      correctIndex: 1,
      explanation: 'Designing for scale requires stateless services, horizontal scaling, and early data partitioning.',
    },
    {
      question: 'What is "mechanical sympathy" in systems design?',
      options: [
        'Being nice to machines',
        'Understanding hardware to write more efficient software',
        'Robot emotions',
        'Physical computing',
      ],
      correctIndex: 1,
      explanation: 'Mechanical sympathy means designing software aware of underlying hardware characteristics.',
    },
    {
      question: 'What is a "zero-downtime migration"?',
      options: [
        'Never migrating',
        'Migrating systems without any service interruption',
        'Instant migration',
        'Deleting the old system',
      ],
      correctIndex: 1,
      explanation: 'Zero-downtime migrations use techniques like blue-green deployments and dual writes.',
    },
    {
      question: 'What is "event-driven architecture"?',
      options: [
        'Calendar-based coding',
        'Systems that communicate through producing and consuming events',
        'UI event handlers',
        'Log-based debugging',
      ],
      correctIndex: 1,
      explanation:
        'Event-driven architecture decouples services through asynchronous event production and consumption.',
    },
    {
      question: 'What is the "Architect" mindset as a terminal role?',
      options: [
        'Drawing diagrams',
        'Seeing the whole system, balancing tradeoffs, and enabling others to build well',
        'Making all decisions',
        'Writing all the code',
      ],
      correctIndex: 1,
      explanation: 'Architects see entire systems, make principled tradeoffs, and empower teams to build correctly.',
    },
    {
      question: 'What is "back-pressure" in system design?',
      options: [
        'Physical force',
        'Mechanism to slow down producers when consumers are overwhelmed',
        'Database compression',
        'Network latency',
      ],
      correctIndex: 1,
      explanation: "Back-pressure protects systems by signaling producers to slow down when consumers can't keep up.",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Select 3 random, unique questions for a given jobId.
 * Falls back to corp_intern questions if the jobId has no pool.
 */
export function getInterviewSession(jobId: string): InterviewQuestion[] {
  const pool = INTERVIEW_POOLS[jobId] ?? INTERVIEW_POOLS.corp_intern;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

/**
 * Check if a job requires an interview (everything except starting positions).
 */
export function requiresInterview(jobId: string): boolean {
  const noInterviewJobs = ['unemployed'];
  return !noInterviewJobs.includes(jobId);
}
