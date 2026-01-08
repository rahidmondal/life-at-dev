import { CareerPath } from '@/types/game';

/**
 * Mad-Libs Fallback Engine - Templates Database
 * This serves as the offline content generator when AI APIs are unavailable.
 */

// Dynamic content fillers organized by category
export const FILLERS = {
  tech_stack: {
    corporate: ['JavaScript', 'TypeScript', 'React', 'Python', 'Java', 'Git', 'Node.js', 'SQL'],
    ic: ['Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'MongoDB', 'AWS', 'GraphQL', 'Microservices'],
    management: ['Jira', 'Confluence', 'Slack', 'Agile', 'Scrum', 'OKRs', 'Sprint Planning', 'Roadmaps'],
    hustler: ['WordPress', 'Shopify', 'Firebase', 'Netlify', 'Stripe', 'No-code tools', 'APIs', 'Landing pages'],
    business: ['Analytics', 'A/B Testing', 'SEO', 'Marketing Funnels', 'CRM', 'Metrics', 'KPIs', 'Growth Hacking'],
    specialist: [
      'Terraform',
      'CI/CD',
      'Security Audits',
      'Performance Optimization',
      'Load Balancers',
      'CDN',
      'Monitoring',
      'Infrastructure as Code',
    ],
  },

  stakeholder: [
    'CTO',
    'Product Manager',
    'Tech Lead',
    'Senior Engineer',
    'QA Team',
    'Client',
    'CEO',
    'Junior Developer',
    'Intern',
    'Designer',
    'DevOps Engineer',
    'Security Team',
  ],

  problem: [
    'memory leak',
    'production crash',
    'critical bug',
    'merge conflict',
    'failed deployment',
    'security vulnerability',
    'performance bottleneck',
    'broken test suite',
    'database migration failure',
    'API rate limit',
    'missing documentation',
    'technical debt',
    'code smell',
    'race condition',
  ],

  benefit: [
    'performance boost',
    'cleaner code',
    'better UX',
    'increased test coverage',
    'improved security',
    'faster load times',
    'reduced bugs',
    'better maintainability',
    'team productivity',
    'customer satisfaction',
    'code reusability',
    'system reliability',
  ],

  timeframe: ['today', 'by EOD', 'this week', 'before sprint ends', 'immediately', 'within 2 hours', 'by Monday'],

  soft_skill_action: [
    'explain the architecture',
    'mentor a junior',
    'present to stakeholders',
    'resolve a conflict',
    'prioritize tasks',
    'estimate complexity',
    'lead a standup',
    'conduct code review',
  ],
};

export interface InterviewTemplate {
  id: string;
  template: string;
  paths: CareerPath[];
  difficulty: number;
}

/**
 * Template collection for procedural question generation
 * Templates use {{placeholder}} syntax for dynamic content injection
 */
export const INTERVIEW_TEMPLATES: InterviewTemplate[] = [
  // ========================================
  // TECHNICAL BUG SCENARIOS
  // ========================================
  {
    id: 'bug-critical-1',
    template:
      'The {{stakeholder}} reports a {{problem}} in the {{tech_stack}} system. It needs to be fixed {{timeframe}}. How do you approach this?',
    paths: ['corporate', 'ic', 'specialist'],
    difficulty: 1,
  },
  {
    id: 'bug-production-2',
    template:
      "Production is down due to a {{problem}}. Users are complaining and the {{stakeholder}} is panicking. What's your first action?",
    paths: ['corporate', 'ic', 'specialist', 'hustler'],
    difficulty: 2,
  },
  {
    id: 'bug-investigation-3',
    template:
      'You discover a {{problem}} in the legacy {{tech_stack}} codebase that could affect thousands of users. The team is split on whether to fix it now or later. What do you do?',
    paths: ['ic', 'management', 'specialist'],
    difficulty: 3,
  },

  // ========================================
  // FEATURE DEVELOPMENT SCENARIOS
  // ========================================
  {
    id: 'feature-request-1',
    template:
      'The {{stakeholder}} wants to add {{tech_stack}} integration to improve {{benefit}}. They need it {{timeframe}}. How do you respond?',
    paths: ['corporate', 'ic', 'hustler'],
    difficulty: 1,
  },
  {
    id: 'feature-scope-2',
    template:
      "Mid-sprint, the {{stakeholder}} requests a major change that would require refactoring the entire {{tech_stack}} module. What's your approach?",
    paths: ['corporate', 'ic', 'management'],
    difficulty: 2,
  },
  {
    id: 'feature-architecture-3',
    template:
      'You need to design a scalable {{tech_stack}} solution that handles 10x current traffic while maintaining {{benefit}}. The {{stakeholder}} wants a technical proposal by EOD. How do you proceed?',
    paths: ['ic', 'specialist', 'management'],
    difficulty: 3,
  },

  // ========================================
  // SOFT SKILLS & COMMUNICATION
  // ========================================
  {
    id: 'soft-mentoring-1',
    template:
      'A junior developer asks you to {{soft_skill_action}} about {{tech_stack}}. You have a deadline {{timeframe}}. What do you do?',
    paths: ['corporate', 'ic', 'management'],
    difficulty: 1,
  },
  {
    id: 'soft-conflict-2',
    template:
      'The {{stakeholder}} disagrees with your technical decision about {{tech_stack}}, claiming it will hurt {{benefit}}. How do you handle this?',
    paths: ['corporate', 'ic', 'management', 'specialist'],
    difficulty: 2,
  },
  {
    id: 'soft-leadership-3',
    template:
      'Two senior engineers are in heated disagreement about whether to use {{tech_stack}} for the new project. Both have valid points. As the decision maker, how do you resolve this?',
    paths: ['management', 'ic', 'specialist'],
    difficulty: 3,
  },

  // ========================================
  // TECHNICAL DEBT & REFACTORING
  // ========================================
  {
    id: 'debt-accumulation-1',
    template:
      'You notice {{problem}} in the {{tech_stack}} code. Fixing it would improve {{benefit}} but delay the feature. What do you do?',
    paths: ['corporate', 'ic', 'hustler'],
    difficulty: 1,
  },
  {
    id: 'debt-strategy-2',
    template:
      'The {{tech_stack}} system has accumulated significant {{problem}}. The {{stakeholder}} wants new features, but the codebase is becoming unmaintainable. How do you balance this?',
    paths: ['corporate', 'ic', 'management', 'specialist'],
    difficulty: 2,
  },
  {
    id: 'debt-migration-3',
    template:
      'The entire {{tech_stack}} infrastructure needs modernization to prevent {{problem}} and improve {{benefit}}. This will take 3 months with zero new features. How do you convince stakeholders?',
    paths: ['ic', 'management', 'specialist'],
    difficulty: 3,
  },

  // ========================================
  // BUSINESS & STRATEGY (for hustler/business paths)
  // ========================================
  {
    id: 'business-mvp-1',
    template:
      'A client needs a working {{tech_stack}} prototype {{timeframe}} to pitch to investors. Quality or speed? What do you prioritize?',
    paths: ['hustler', 'business'],
    difficulty: 1,
  },
  {
    id: 'business-pivot-2',
    template:
      'After 2 months of development on {{tech_stack}}, the {{stakeholder}} wants to pivot to a completely different solution. How do you handle this?',
    paths: ['hustler', 'business', 'management'],
    difficulty: 2,
  },
  {
    id: 'business-scale-3',
    template:
      "Your side project built with {{tech_stack}} suddenly goes viral. Users are flooding in, servers are struggling, and you're getting partnership offers. What's your next move?",
    paths: ['hustler', 'business', 'specialist'],
    difficulty: 3,
  },

  // ========================================
  // TEAM & PROCESS
  // ========================================
  {
    id: 'team-code-review-1',
    template:
      'During code review, you spot a {{problem}} in a PR that implements {{tech_stack}}. The author is the {{stakeholder}}. How do you provide feedback?',
    paths: ['corporate', 'ic', 'management'],
    difficulty: 1,
  },
  {
    id: 'team-onboarding-2',
    template:
      "Three new developers join and need to learn the complex {{tech_stack}} architecture. You're responsible for their onboarding while maintaining {{benefit}}. How do you structure this?",
    paths: ['management', 'ic', 'specialist'],
    difficulty: 2,
  },
  {
    id: 'team-crisis-3',
    template:
      "Two weeks before launch, a key engineer quits. They were the only expert on the {{tech_stack}} system that's critical for {{benefit}}. What's your plan?",
    paths: ['management', 'ic', 'specialist'],
    difficulty: 3,
  },
];
