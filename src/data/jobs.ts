import { Job } from '@/types/game';

export const JOBS: Job[] = [
  // ========================================
  // PATH A: CORPORATE LADDER - Level 1 (Entry)
  // ========================================
  {
    id: 'cs-student',
    title: 'CS Student',
    path: 'corporate',
    level: 1,
    requirements: {
      coding: 0,
      reputation: 0,
    },
    yearlyPay: -10000, // Tuition cost
    rentPerYear: 4000, // Dorm or shared apartment
    isGameEnd: false,
  },
  {
    id: 'cs-student-easy',
    title: 'CS Student (Family Supported)',
    path: 'corporate',
    level: 1,
    requirements: {
      coding: 0,
      reputation: 0,
    },
    yearlyPay: 0, // Family pays tuition
    rentPerYear: 0, // Family pays rent
    isGameEnd: false,
  },
  {
    id: 'intern',
    title: 'Intern',
    path: 'corporate',
    level: 1,
    requirements: {
      coding: 100,
      reputation: 0,
    },
    yearlyPay: 20000,
    rentPerYear: 9000, // Cheap studio
    isGameEnd: false,
  },

  // ========================================
  // PATH A: CORPORATE LADDER - Level 2 (Professional)
  // ========================================
  {
    id: 'junior-dev',
    title: 'Junior Developer',
    path: 'corporate',
    level: 2,
    requirements: {
      coding: 250,
      reputation: 50,
    },
    yearlyPay: 60000,
    rentPerYear: 15000, // Decent 1BR apartment
    isGameEnd: false,
  },
  {
    id: 'mid-dev',
    title: 'Mid-Level Developer',
    path: 'corporate',
    level: 2,
    requirements: {
      coding: 450,
      reputation: 150,
    },
    yearlyPay: 95000,
    rentPerYear: 20000, // Nice 1BR or 2BR
    isGameEnd: false,
    isIntermediate: true,
  },

  // ========================================
  // PATH A: CORPORATE LADDER - Level 3 (Senior)
  // ========================================
  {
    id: 'senior-dev',
    title: 'Senior Developer',
    path: 'corporate',
    level: 3,
    requirements: {
      coding: 650,
      reputation: 280,
    },
    yearlyPay: 140000,
    rentPerYear: 30000, // Premium apartment or mortgage
    isGameEnd: false,
  },

  // ========================================
  // PATH B: MANAGEMENT TRACK - Level 4
  // ========================================
  {
    id: 'team-lead',
    title: 'Team Lead',
    path: 'management',
    level: 4,
    requirements: {
      coding: 550,
      reputation: 450,
    },
    yearlyPay: 160000,
    rentPerYear: 35000, // Urban apartment
    isGameEnd: false,
    isIntermediate: true,
  },
  {
    id: 'engineering-manager',
    title: 'Engineering Manager',
    path: 'management',
    level: 4,
    requirements: {
      coding: 580,
      reputation: 650,
    },
    yearlyPay: 190000,
    rentPerYear: 42000, // Nice house or condo
    isGameEnd: false,
  },
  {
    id: 'cto',
    title: 'CTO',
    path: 'management',
    level: 4,
    requirements: {
      coding: 750,
      reputation: 900,
    },
    yearlyPay: 300000,
    rentPerYear: 60000, // Luxury property
    isGameEnd: true,
  },

  // ========================================
  // PATH C: IC TRACK - Level 4
  // ========================================
  {
    id: 'staff-engineer',
    title: 'Staff Engineer',
    path: 'ic',
    level: 4,
    requirements: {
      coding: 800,
      reputation: 450,
    },
    yearlyPay: 200000,
    rentPerYear: 40000, // Upscale living
    isGameEnd: false,
  },
  {
    id: 'principal-engineer',
    title: 'Principal Engineer',
    path: 'ic',
    level: 4,
    requirements: {
      coding: 900,
      reputation: 650,
    },
    yearlyPay: 250000,
    rentPerYear: 50000, // Premium property
    isGameEnd: false,
    isIntermediate: true,
  },
  {
    id: 'distinguished-fellow',
    title: 'Distinguished Fellow',
    path: 'ic',
    level: 4,
    requirements: {
      coding: 950,
      reputation: 850,
    },
    yearlyPay: 400000,
    rentPerYear: 75000, // Elite housing
    isGameEnd: true,
  },

  // ========================================
  // PATH D: HUSTLER - Level 1 (Beginning)
  // ========================================
  {
    id: 'unemployed',
    title: 'Unemployed',
    path: 'hustler',
    level: 1,
    requirements: {
      coding: 0,
      reputation: 0,
    },
    yearlyPay: 0,
    rentPerYear: 6000, // Mom's basement or roommates
    isGameEnd: false,
  },
  {
    id: 'script-kiddie',
    title: 'Script Kiddie',
    path: 'hustler',
    level: 1,
    requirements: {
      coding: 50,
      reputation: 0,
    },
    yearlyPay: 5000,
    rentPerYear: 7200, // Shared room
    isGameEnd: false,
    isIntermediate: true,
  },

  // ========================================
  // PATH D: HUSTLER - Level 2 (Freelance)
  // ========================================
  {
    id: 'freelancer',
    title: 'Freelancer',
    path: 'hustler',
    level: 2,
    requirements: {
      coding: 200,
      reputation: 0,
      money: 1500, // Need laptop
    },
    yearlyPay: 65000,
    rentPerYear: 18000, // Flexible living
    isGameEnd: false,
  },
  {
    id: 'digital-nomad',
    title: 'Digital Nomad',
    path: 'hustler',
    level: 2,
    requirements: {
      coding: 400,
      reputation: 200,
      money: 5000,
    },
    yearlyPay: 75000,
    rentPerYear: 24000, // Airbnbs and travel
    isGameEnd: false,
    isIntermediate: true,
  },

  // ========================================
  // PATH E: BUSINESS TRACK - Level 3
  // ========================================
  {
    id: 'agency-owner',
    title: 'Agency Owner',
    path: 'business',
    level: 3,
    requirements: {
      coding: 300,
      reputation: 550,
      money: 20000,
    },
    yearlyPay: 120000,
    rentPerYear: 28000, // Office + living space
    isGameEnd: false,
  },
  {
    id: 'tech-influencer',
    title: 'Tech Influencer',
    path: 'business',
    level: 3,
    requirements: {
      coding: 300,
      reputation: 750,
    },
    yearlyPay: 150000,
    rentPerYear: 36000, // Content studio + home
    isGameEnd: false,
    isIntermediate: true,
  },
  {
    id: 'tech-mogul',
    title: 'Tech Mogul',
    path: 'business',
    level: 3,
    requirements: {
      coding: 480,
      reputation: 900,
      money: 500000,
    },
    yearlyPay: 1000000,
    rentPerYear: 120000, // Penthouse
    isGameEnd: true,
  },

  // ========================================
  // PATH F: SPECIALIST TRACK - Level 3
  // ========================================
  {
    id: 'contractor',
    title: 'Contractor',
    path: 'specialist',
    level: 3,
    requirements: {
      coding: 650,
      reputation: 280,
    },
    yearlyPay: 180000, // $150/hr equivalent
    rentPerYear: 32000, // Flexible short-term
    isGameEnd: false,
    isIntermediate: true,
  },
  {
    id: 'consultant',
    title: 'Consultant',
    path: 'specialist',
    level: 3,
    requirements: {
      coding: 800,
      reputation: 550,
    },
    yearlyPay: 360000, // $300/hr equivalent
    rentPerYear: 48000, // Premium flexibility
    isGameEnd: false,
  },
  {
    id: 'industry-architect',
    title: 'Industry Architect',
    path: 'specialist',
    level: 3,
    requirements: {
      coding: 950,
      reputation: 850,
    },
    yearlyPay: 2000000, // $10k/day equivalent
    rentPerYear: 150000, // World-class living
    isGameEnd: true,
  },
];

export function getNextJob(currentJob: Job): Job | null {
  const currentIndex = JOBS.findIndex(job => job.id === currentJob.id);
  if (currentIndex === -1) return null;

  for (let i = currentIndex + 1; i < JOBS.length; i++) {
    const nextJob = JOBS[i];

    if (nextJob.path === currentJob.path && nextJob.level >= currentJob.level) {
      return nextJob;
    }

    if (currentJob.id === 'senior-dev') {
      if (nextJob.path === 'management' || nextJob.path === 'ic') {
        return nextJob;
      }
    }

    if (currentJob.path === 'hustler' && currentJob.level === 2) {
      if (nextJob.path === 'business' || nextJob.path === 'specialist') {
        return nextJob;
      }
    }
  }

  return null;
}

export function getAvailablePromotions(currentJob: Job, coding: number, reputation: number, money: number): Job[] {
  const availableJobs: Job[] = [];
  const isStudent = currentJob.id === 'cs-student' || currentJob.id === 'cs-student-easy';

  JOBS.forEach(job => {
    if (job.id === currentJob.id || job.level < currentJob.level) {
      return;
    }

    if (
      (currentJob.id === 'cs-student-easy' && job.id === 'cs-student') ||
      (currentJob.id === 'cs-student' && job.id === 'cs-student-easy')
    ) {
      return;
    }

    if (job.level === currentJob.level && job.yearlyPay <= currentJob.yearlyPay) {
      return;
    }

    const meetsRequirements =
      coding >= job.requirements.coding &&
      reputation >= job.requirements.reputation &&
      (job.requirements.money === undefined || money >= job.requirements.money);

    if (meetsRequirements) {
      if (isStudent) {
        const isValidGraduationPath = job.path === 'corporate' || job.path === 'hustler';
        if (isValidGraduationPath) {
          availableJobs.push(job);
        }
      } else {
        const isCompatible =
          job.path === currentJob.path ||
          (currentJob.id === 'senior-dev' && (job.path === 'management' || job.path === 'ic')) ||
          (currentJob.path === 'hustler' &&
            currentJob.level === 2 &&
            (job.path === 'business' || job.path === 'specialist'));

        if (isCompatible) {
          availableJobs.push(job);
        }
      }
    }
  });

  return availableJobs;
}

export function shouldShowGraduationCeremony(currentJob: Job, targetJob: Job): boolean {
  const isStudent = currentJob.id === 'cs-student' || currentJob.id === 'cs-student-easy';
  const isRealJob = targetJob.id !== 'intern' && targetJob.level >= 2;
  return isStudent && isRealJob;
}

export function getStartingJob(): Job {
  return JOBS.find(job => job.id === 'unemployed') ?? JOBS[0];
}
