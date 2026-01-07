import { Job } from '@/types/game';

export interface InterviewQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const INTERVIEW_QUESTIONS: Record<string, InterviewQuestion[]> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // CORPORATE PATH - General CS, Algorithms, Git (20 questions)
  // ═══════════════════════════════════════════════════════════════════════════
  corporate: [
    // Easy (Level 1-2)
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
    // Medium (Level 3)
    {
      question: 'What is the difference between "==" and "===" in JavaScript?',
      options: ['No difference', '=== checks type too', '== is faster', '=== is deprecated'],
      correctIndex: 1,
      explanation: '=== (strict equality) checks both value AND type, while == only checks value with coercion.',
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
      question: 'What is the purpose of an index in a database?',
      options: ['Store backup data', 'Speed up query lookups', 'Encrypt sensitive data', 'Validate data types'],
      correctIndex: 1,
      explanation: 'Indexes create a data structure that speeds up retrieval operations on database tables.',
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
      explanation:
        'REST = Representational State Transfer, an architectural style for designing networked applications.',
    },
    {
      question: 'What is "garbage collection" in programming?',
      options: ['Deleting unused files', 'Automatic memory management', 'Code optimization', 'Error logging'],
      correctIndex: 1,
      explanation: 'Garbage collection automatically frees memory occupied by objects no longer in use.',
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
    // Hard (Level 4)
    {
      question: 'What is the time complexity of quicksort in the average case?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correctIndex: 1,
      explanation: 'Quicksort averages O(n log n), though worst case (already sorted) is O(n²).',
    },
    {
      question: 'What is "memoization"?',
      options: ['Memory allocation', 'Caching function results', 'Memory leak detection', 'Writing notes in code'],
      correctIndex: 1,
      explanation: 'Memoization caches expensive function results to avoid redundant computations.',
    },
    {
      question: 'What is a "mutex"?',
      options: ['A music codec', 'Mutual exclusion lock for thread safety', 'A math function', 'A type of queue'],
      correctIndex: 1,
      explanation:
        'A mutex (mutual exclusion) prevents multiple threads from accessing shared resources simultaneously.',
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
        'Dynamic programming solves complex problems by breaking them into simpler overlapping subproblems and storing solutions.',
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
        'BFS (Breadth-First) explores neighbors first using a queue. DFS (Depth-First) explores as deep as possible using a stack.',
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
      explanation:
        'Hash collision occurs when two different inputs produce the same hash output, requiring resolution strategies like chaining.',
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // MANAGEMENT PATH - Agile, Leadership, Conflict Resolution (20 questions)
  // ═══════════════════════════════════════════════════════════════════════════
  management: [
    // Easy (Level 1-2)
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
      question: 'What does "Scrum Master" primarily do?',
      options: [
        'Write code',
        'Facilitate Scrum ceremonies and remove impediments',
        'Approve all designs',
        'Hire new team members',
      ],
      correctIndex: 1,
      explanation: 'Scrum Masters facilitate the Scrum process, protect the team, and help remove impediments.',
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
      explanation:
        'User stories describe requirements from the end-user perspective: "As a [user], I want [feature] so that [benefit]."',
    },
    // Medium (Level 3)
    {
      question: 'What is "velocity" in Agile?',
      options: ['How fast developers type', 'Amount of work completed per sprint', 'Time to market', 'Bug fix rate'],
      correctIndex: 1,
      explanation: 'Velocity measures the amount of work (in story points) a team completes per sprint.',
    },
    {
      question: 'How should you handle conflict between two team members?',
      options: [
        'Ignore it',
        'Fire one of them',
        'Facilitate a private conversation to find common ground',
        'Take sides publicly',
      ],
      correctIndex: 2,
      explanation: 'Address conflicts directly but privately, facilitating dialogue to find mutual understanding.',
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
        'Psychological safety means team members feel safe to take risks, share ideas, and admit mistakes without punishment.',
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
      explanation:
        'Product Owners manage the product backlog and priorities. Scrum Masters facilitate the Scrum process.',
    },
    {
      question: 'What is "scope creep"?',
      options: ['A bug type', 'Uncontrolled expansion of project requirements', 'Code refactoring', 'Team growth'],
      correctIndex: 1,
      explanation:
        'Scope creep is the uncontrolled expansion of project scope without adjusting time, cost, or resources.',
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
    // Hard (Level 4)
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
        'Address underperformance with constructive feedback, clear expectations, coaching, and support before escalation.',
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
        'Situational leadership adapts leadership style (directing, coaching, supporting, delegating) based on team needs.',
    },
    {
      question: 'What is the "RACI matrix"?',
      options: [
        'A performance rating',
        'Responsible, Accountable, Consulted, Informed - a responsibility assignment chart',
        'A testing framework',
        'A budget allocation tool',
      ],
      correctIndex: 1,
      explanation: 'RACI clarifies roles: who is Responsible, Accountable, Consulted, and Informed for each task.',
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
        'Stakeholder management involves identifying, analyzing, and engaging people affected by or affecting the project.',
    },
    {
      question: 'What is "OKR" methodology?',
      options: [
        'Objectives and Key Results - a goal-setting framework',
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
        'Systematic approach to transitioning individuals and organizations through change',
        'Changing managers frequently',
        'Budget revisions',
      ],
      correctIndex: 1,
      explanation:
        'Change management is a structured approach to help people adopt new processes, technologies, or organizational changes.',
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // IC PATH - System Design, Deep Backend, Scalability (20 questions)
  // ═══════════════════════════════════════════════════════════════════════════
  ic: [
    // Easy (Level 1-2)
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
    {
      question: 'What is a "cache hit"?',
      options: ['A server error', 'When requested data is found in cache', 'A security attack', 'A database query'],
      correctIndex: 1,
      explanation: 'A cache hit occurs when the requested data is found in the cache, avoiding a slower lookup.',
    },
    {
      question: 'What is "horizontal scaling"?',
      options: [
        'Adding more RAM to a server',
        'Adding more servers to handle load',
        'Improving code efficiency',
        'Reducing database size',
      ],
      correctIndex: 1,
      explanation: 'Horizontal scaling (scaling out) adds more machines to handle increased load.',
    },
    {
      question: 'What is a "CDN"?',
      options: [
        'Content Delivery Network - distributed servers for faster content delivery',
        'Central Database Node',
        'Code Deployment Network',
        'Customer Data Network',
      ],
      correctIndex: 0,
      explanation: 'CDNs distribute content across geographically dispersed servers to reduce latency.',
    },
    {
      question: 'What is "latency"?',
      options: [
        'Server memory usage',
        'Time delay between request and response',
        'Network bandwidth',
        'CPU utilization',
      ],
      correctIndex: 1,
      explanation: 'Latency is the time delay between a request being sent and the response being received.',
    },
    // Medium (Level 3)
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
      question: 'What is the difference between SQL and NoSQL databases?',
      options: [
        'SQL is faster',
        'SQL uses structured schemas, NoSQL is more flexible',
        'NoSQL is deprecated',
        'They are identical',
      ],
      correctIndex: 1,
      explanation:
        'SQL databases use structured schemas and relationships. NoSQL offers flexible schemas and horizontal scaling.',
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
      explanation: 'Message queues enable asynchronous communication, decoupling producers and consumers of messages.',
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
      explanation:
        'Eventual consistency means all replicas will converge to the same state, but not immediately after writes.',
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
      explanation:
        'Reverse proxies sit in front of backend servers, forwarding client requests and providing caching, load balancing, and security.',
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
    // Hard (Level 4)
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
      explanation: 'Consensus algorithms (like Paxos, Raft) help distributed nodes agree on values despite failures.',
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
        'Command Query Responsibility Segregation - separating read and write models',
        'Central Query Response System',
        'Cached Query Result Storage',
        'Concurrent Queue Response Service',
      ],
      correctIndex: 0,
      explanation: 'CQRS separates read and write operations into different models for optimization and scalability.',
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
      explanation:
        'Event sourcing stores every change as an immutable event, allowing complete history reconstruction.',
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
      question: 'What is a "distributed lock"?',
      options: [
        'Encryption across servers',
        'Mechanism to ensure only one process accesses a resource across nodes',
        'Network firewall',
        'Database constraint',
      ],
      correctIndex: 1,
      explanation: 'Distributed locks ensure mutual exclusion across multiple nodes in a distributed system.',
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // HUSTLER PATH - Freelancing, MVP, Speed-coding (20 questions)
  // ═══════════════════════════════════════════════════════════════════════════
  hustler: [
    // Easy (Level 1-2)
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
    {
      question: 'What is the best way to find freelance clients initially?',
      options: [
        'Wait for them to find you',
        'Cold outreach and platforms like Upwork/Fiverr',
        'Only rely on referrals',
        'Paid advertising only',
      ],
      correctIndex: 1,
      explanation: 'New freelancers should actively reach out and use platforms to build initial client base.',
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
      explanation: 'Portfolios demonstrate your capabilities to potential clients and build credibility.',
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
      explanation: 'Scope defines what work is included in a project - clear scope prevents misunderstandings.',
    },
    // Medium (Level 3)
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
      question: 'What should you always get from clients before starting work?',
      options: ['Their favorite color', 'A signed contract and deposit', 'Their social media passwords', 'Coffee'],
      correctIndex: 1,
      explanation: 'Always get contracts signed and deposits paid to protect yourself as a freelancer.',
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
      question: 'What is "recurring revenue" and why is it valuable?',
      options: [
        'One-time payments',
        'Predictable income from ongoing services/subscriptions',
        'Refunds',
        'Charity donations',
      ],
      correctIndex: 1,
      explanation:
        'Recurring revenue provides stable, predictable income - essential for freelancer financial stability.',
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
      explanation: 'Retainers guarantee you ongoing work/income, and clients get priority access to your services.',
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
    // Hard (Level 4)
    {
      question: 'What is "productized service"?',
      options: [
        'Selling physical products',
        'Standardized service packages with fixed scope and price',
        'Manufacturing software',
        'Product photography',
      ],
      correctIndex: 1,
      explanation:
        'Productized services are standardized offerings with clear deliverables and fixed pricing, easier to sell and scale.',
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
      options: ['Working more hours', 'Systemizing, delegating, and/or productizing', 'Lower prices', 'Fewer clients'],
      correctIndex: 1,
      explanation: 'Scale by creating systems, hiring contractors, or building products - not just working more hours.',
    },
    {
      question: 'What is "discovery call" in freelancing?',
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
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // BUSINESS PATH - SaaS Metrics, Product Market Fit, Marketing (20 questions)
  // ═══════════════════════════════════════════════════════════════════════════
  business: [
    // Easy (Level 1-2)
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
    {
      question: 'What is "ARR"?',
      options: ['Pirate noise', 'Annual Recurring Revenue', 'Average Response Rate', 'Application Runtime Ratio'],
      correctIndex: 1,
      explanation: 'ARR = Annual Recurring Revenue = MRR × 12, a key SaaS health metric.',
    },
    {
      question: 'What is a "landing page"?',
      options: ['Airport website', 'A focused webpage designed to convert visitors', 'Homepage only', 'Contact page'],
      correctIndex: 1,
      explanation: 'Landing pages are focused pages designed to convert visitors into leads or customers.',
    },
    {
      question: 'What is "churn rate"?',
      options: ['Butter production', 'Percentage of customers who cancel', 'Employee turnover', 'Server downtime'],
      correctIndex: 1,
      explanation: 'Churn rate measures the percentage of customers who stop using your product.',
    },
    // Medium (Level 3)
    {
      question: 'What is "LTV" (Lifetime Value)?',
      options: [
        'Long-Term Vision',
        'Total revenue expected from a customer over their lifetime',
        'Legal Term Validation',
        'Lead Time Variance',
      ],
      correctIndex: 1,
      explanation: 'LTV predicts total revenue from a customer - should be higher than CAC for profitability.',
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
      explanation: 'PLG uses the product as the primary driver of customer acquisition, conversion, and expansion.',
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
      explanation: 'Cohort analysis tracks behavior of user groups over time to identify patterns and trends.',
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
    // Hard (Level 4)
    {
      question: 'What is the "Rule of 40" in SaaS?',
      options: [
        '40 employees minimum',
        'Growth rate + profit margin should equal or exceed 40%',
        '40 hour work week',
        '40% market share',
      ],
      correctIndex: 1,
      explanation: 'Rule of 40: healthy SaaS companies should have revenue growth % + profit margin % ≥ 40%.',
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
      explanation:
        'Negative churn means expansion revenue from existing customers exceeds lost revenue from churned customers.',
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
      explanation: 'Quick ratio measures growth efficiency - a ratio > 4 indicates healthy, sustainable growth.',
    },
    {
      question: 'What is "burn multiple"?',
      options: [
        'Fire safety metric',
        'Net burn / Net new ARR - measures efficiency of growth spending',
        'CPU usage',
        'Employee burnout rate',
      ],
      correctIndex: 1,
      explanation: "Burn multiple shows how much you're spending to generate each dollar of new ARR.",
    },
    {
      question: 'What is "PLG flywheel"?',
      options: [
        'A gym equipment',
        'Self-reinforcing cycle where product usage drives growth',
        'Email marketing',
        'Sales pipeline',
      ],
      correctIndex: 1,
      explanation: 'PLG flywheel: users try product → love it → invite others → more users → more word-of-mouth.',
    },
    {
      question: 'What is "expansion revenue"?',
      options: [
        'Office expansion costs',
        'Additional revenue from existing customers (upsells, upgrades)',
        'New customer revenue',
        'Investment funding',
      ],
      correctIndex: 1,
      explanation: 'Expansion revenue comes from existing customers upgrading, adding seats, or buying add-ons.',
    },
    {
      question: 'What is the ideal "LTV:CAC ratio"?',
      options: ['1:1', '3:1 or higher', '1:3', "Doesn't matter"],
      correctIndex: 1,
      explanation: 'LTV:CAC of 3:1 means you make 3x what you spent acquiring a customer - a healthy ratio.',
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // SPECIALIST PATH - Architecture, Microservices, Consulting (20 questions)
  // ═══════════════════════════════════════════════════════════════════════════
  specialist: [
    // Easy (Level 1-2)
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
    {
      question: 'What is "technical architecture"?',
      options: [
        'Building design',
        'High-level structure of software systems and their interactions',
        'Hardware specifications',
        'Office layout',
      ],
      correctIndex: 1,
      explanation: 'Technical architecture defines how system components are organized and interact.',
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
      question: 'What is "domain-driven design"?',
      options: [
        'Website design',
        'Designing software around business domains and language',
        'Database design',
        'UI/UX design',
      ],
      correctIndex: 1,
      explanation: 'DDD focuses on modeling software to match the business domain and using ubiquitous language.',
    },
    // Medium (Level 3)
    {
      question: 'What is a "bounded context" in DDD?',
      options: ['Limited memory', 'Explicit boundary where a domain model applies', 'Restricted access', 'Code scope'],
      correctIndex: 1,
      explanation: 'Bounded contexts define clear boundaries where specific domain models and terminology apply.',
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
      explanation:
        'Strangler fig pattern incrementally replaces legacy systems by routing traffic to new implementations.',
    },
    {
      question: 'What is "infrastructure as code"?',
      options: [
        'Writing code on servers',
        'Managing infrastructure through machine-readable definition files',
        'Hardware documentation',
        'Code comments',
      ],
      correctIndex: 1,
      explanation:
        'IaC manages infrastructure using code (Terraform, CloudFormation) for consistency and version control.',
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
      explanation:
        'Sagas manage distributed transactions by breaking them into local transactions with compensating actions.',
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
      explanation:
        'Sidecar pattern deploys supporting functionality in a separate container alongside the main application.',
    },
    {
      question: 'What is "observability" in systems?',
      options: [
        'Code visibility',
        'Ability to understand system state from external outputs (logs, metrics, traces)',
        'UI monitoring',
        'Code reviews',
      ],
      correctIndex: 1,
      explanation:
        'Observability combines logging, metrics, and tracing to understand system behavior and debug issues.',
    },
    // Hard (Level 4)
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
      explanation: 'Outbox pattern uses a database table to reliably publish events alongside local transactions.',
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
      explanation: 'Chaos engineering proactively tests system resilience by simulating real-world failures.',
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
      question: 'What is "actor model" in distributed systems?',
      options: [
        'Hollywood pattern',
        'Concurrency model where actors communicate via messages',
        'User role management',
        'Testing with actors',
      ],
      correctIndex: 1,
      explanation: 'Actor model uses lightweight actors that communicate exclusively through asynchronous messages.',
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
  ],
};

/**
 * Get a single random interview question for a job (legacy support)
 */
export function getInterviewQuestion(job: Job): InterviewQuestion {
  const pathQuestions = INTERVIEW_QUESTIONS[job.path] ?? INTERVIEW_QUESTIONS.corporate;
  const randomIndex = Math.floor(Math.random() * pathQuestions.length);
  return pathQuestions[randomIndex];
}

/**
 * Get an interview session of 3 random, unique questions for a job
 */
export function getInterviewSession(job: Job): InterviewQuestion[] {
  const pathQuestions = INTERVIEW_QUESTIONS[job.path] ?? INTERVIEW_QUESTIONS.corporate;

  // Shuffle and pick 3 unique questions
  const shuffled = [...pathQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

/**
 * Check if a job requires an interview
 */
export function requiresInterview(job: Job): boolean {
  const noInterviewJobs = ['unemployed', 'cs-student', 'script-kiddie', 'cs-student-easy'];
  return !noInterviewJobs.includes(job.id);
}

/**
 * Get interview difficulty based on job level
 */
export function getInterviewDifficulty(job: Job): 'easy' | 'medium' | 'hard' {
  if (job.level <= 2) return 'easy';
  if (job.level === 3) return 'medium';
  return 'hard';
}

/**
 * Check if player meets job requirements
 */
export function meetsJobRequirements(
  job: Job,
  coding: number,
  reputation: number,
  money: number,
): { meets: boolean; failureReasons: string[] } {
  const failureReasons: string[] = [];

  if (coding < job.requirements.coding) {
    failureReasons.push(`Coding ${coding}/${job.requirements.coding}`);
  }
  if (reputation < job.requirements.reputation) {
    failureReasons.push(`Reputation ${reputation}/${job.requirements.reputation}`);
  }
  if (job.requirements.money && money < job.requirements.money) {
    failureReasons.push(`Money $${money}/$${job.requirements.money}`);
  }

  return {
    meets: failureReasons.length === 0,
    failureReasons,
  };
}
