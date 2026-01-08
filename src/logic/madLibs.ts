import { CareerPath } from '@/types/game';

import { FILLERS, INTERVIEW_TEMPLATES, InterviewTemplate } from '@/data/madLibsTemplates';

/**
 * Mad-Libs Fallback Engine - Procedural Question Generator
 * Generates interview questions offline without AI API calls
 */

export interface InterviewQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/**
 * Selects a random item from an array
 */
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Replaces all {{placeholder}} slots in a template with random filler content
 * Ensures context-aware replacements (e.g., frontend gets frontend tech)
 */
function fillTemplate(template: string, path: CareerPath): string {
  let result = template;

  // Replace all placeholders with random fillers
  result = result.replace(/\{\{tech_stack\}\}/g, () => {
    return randomChoice(FILLERS.tech_stack[path]);
  });

  result = result.replace(/\{\{stakeholder\}\}/g, () => randomChoice(FILLERS.stakeholder));
  result = result.replace(/\{\{problem\}\}/g, () => randomChoice(FILLERS.problem));
  result = result.replace(/\{\{benefit\}\}/g, () => randomChoice(FILLERS.benefit));
  result = result.replace(/\{\{timeframe\}\}/g, () => randomChoice(FILLERS.timeframe));
  result = result.replace(/\{\{soft_skill_action\}\}/g, () => randomChoice(FILLERS.soft_skill_action));

  return result;
}

/**
 * Generates generic but contextually appropriate answer options
 * Returns 4 options with varying risk levels and approaches
 */
function generateOptions(difficulty: number): { text: string; isCorrect: boolean; explanation: string }[] {
  // Option pools based on difficulty
  const easyOptions = [
    {
      text: 'Fix it immediately and communicate progress',
      isCorrect: true,
      explanation: 'Taking immediate action while keeping stakeholders informed is the professional approach.',
    },
    {
      text: 'Ignore it and hope it goes away',
      isCorrect: false,
      explanation: 'Ignoring problems leads to bigger issues and damages trust.',
    },
    {
      text: 'Panic and ask everyone for help at once',
      isCorrect: false,
      explanation: 'Panic creates chaos. Take a breath, assess, then ask for specific help if needed.',
    },
    {
      text: 'Blame someone else and avoid responsibility',
      isCorrect: false,
      explanation: 'Blame culture destroys teams. Take ownership and focus on solutions.',
    },
  ];

  const mediumOptions = [
    {
      text: 'Analyze the situation, prioritize impact, and create an action plan',
      isCorrect: true,
      explanation: 'Systematic analysis and planning leads to better outcomes than reactive decisions.',
    },
    {
      text: 'Make a quick decision without gathering context',
      isCorrect: false,
      explanation: 'Hasty decisions often miss important context and create more problems.',
    },
    {
      text: 'Wait for someone else to make the decision',
      isCorrect: false,
      explanation: 'Passive behavior delays resolution and shows lack of initiative.',
    },
    {
      text: 'Implement the first solution that comes to mind',
      isCorrect: false,
      explanation: 'The first idea is rarely the best. Consider alternatives and trade-offs.',
    },
  ];

  const hardOptions = [
    {
      text: 'Conduct stakeholder analysis, evaluate trade-offs, and present data-driven recommendations',
      isCorrect: true,
      explanation:
        'Senior engineers balance technical excellence with business needs through thorough analysis and clear communication.',
    },
    {
      text: 'Push for the technically perfect solution regardless of constraints',
      isCorrect: false,
      explanation: 'Ignoring business constraints leads to solutions that never ship or get adopted.',
    },
    {
      text: 'Always compromise and take the path of least resistance',
      isCorrect: false,
      explanation: 'Compromising on everything leads to mediocre outcomes. Know when to stand firm.',
    },
    {
      text: 'Escalate immediately without attempting to resolve',
      isCorrect: false,
      explanation: 'Senior engineers should solve problems independently before escalating.',
    },
  ];

  // Select option pool based on difficulty
  let optionPool = easyOptions;
  if (difficulty === 2) {
    optionPool = mediumOptions;
  } else if (difficulty === 3) {
    optionPool = hardOptions;
  }

  // Shuffle options to randomize correct answer position
  const shuffled = [...optionPool].sort(() => Math.random() - 0.5);

  return shuffled;
}

/**
 * Filters templates by career path and optionally by difficulty level
 */
function filterTemplates(path: CareerPath, level: number): InterviewTemplate[] {
  // Map level to difficulty (1-2 = easy, 3 = medium, 4 = hard)
  let targetDifficulty = 1;
  if (level >= 3) {
    targetDifficulty = 2;
  }
  if (level >= 4) {
    targetDifficulty = 3;
  }

  // Filter templates that match the path and are at or below target difficulty
  const matching = INTERVIEW_TEMPLATES.filter(
    template => template.paths.includes(path) && template.difficulty <= targetDifficulty,
  );

  // If no exact matches, fallback to any template for that path
  if (matching.length === 0) {
    return INTERVIEW_TEMPLATES.filter(template => template.paths.includes(path));
  }

  // If still no matches, return all easy templates as last resort
  if (matching.length === 0) {
    return INTERVIEW_TEMPLATES.filter(template => template.difficulty === 1);
  }

  return matching;
}

/**
 * Main function: Generates a complete offline interview question
 * This is the FAIL-SAFE mechanism when AI APIs are unavailable
 *
 * @param path - The career path (corporate, ic, management, etc.)
 * @param level - The career level (1-4)
 * @returns A complete InterviewQuestion object
 */
export function generateOfflineInterview(path: CareerPath, level: number): InterviewQuestion {
  // Find appropriate templates for this role
  const availableTemplates = filterTemplates(path, level);

  // Randomly select a template
  const selectedTemplate = randomChoice(availableTemplates);

  // Fill the template with random content
  const questionText = fillTemplate(selectedTemplate.template, path);

  // Generate answer options
  const optionsData = generateOptions(selectedTemplate.difficulty);

  // Find the correct answer index
  const correctIndex = optionsData.findIndex(opt => opt.isCorrect);

  // Extract just the text for options array
  const options = optionsData.map(opt => opt.text);

  // Get the explanation for the correct answer
  const explanation = optionsData[correctIndex].explanation;

  return {
    question: questionText,
    options,
    correctIndex,
    explanation,
  };
}

/**
 * Generates multiple interview questions for a complete interview
 * Matches the API format of returning 3 questions
 *
 * @param path - The career path
 * @param level - The career level
 * @param count - Number of questions to generate (default: 3)
 * @returns Array of InterviewQuestion objects
 */
export function generateOfflineInterviewSet(path: CareerPath, level: number, count = 3): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];

  for (let i = 0; i < count; i++) {
    questions.push(generateOfflineInterview(path, level));
  }

  return questions;
}

/**
 * Summary Templates for Offline Fallback
 * Three templates based on score ranges
 */
const SUMMARY_TEMPLATES = {
  success: [
    'You started as a humble {{path}} developer and ascended to level {{level}}.',
    'Through {{score}} weeks of dedication, you built a legendary career.',
    'Your code was clean, your deploys were smooth, and your stakeholders were happy.',
    'You achieved what many only dream of: work-life balance and financial freedom.',
    'The terminal may have closed, but your legacy lives on in production.',
    'GG. You beat the game of life.',
  ],
  average: [
    'You walked the path of a {{path}} developer, reaching level {{level}}.',
    'After {{score}} weeks, you survived the grind—barely.',
    'Some bugs were fixed, some features shipped, some deadlines missed.',
    'You were neither a hero nor a villain, just another dev in the machine.',
    "The game ended, but you're left wondering: what if you'd made different choices?",
    'Press F to pay respects to your mediocre career.',
  ],
  burnout: [
    'You tried to become a {{path}} legend, but made it only to level {{level}}.',
    'After {{score}} weeks of endless sprints and crunch time, you broke.',
    'The pull requests piled up. The tech debt consumed everything. The stress won.',
    'You learned the hard way: no job is worth your mental health.',
    'The terminal flickers one last time before going dark.',
    'Game Over. Remember to take breaks, touch grass, and log off sometimes.',
  ],
};

/**
 * Generates an offline career summary when AI APIs fail
 * TIER 3 fallback for the summary endpoint
 *
 * @param careerPath - The player's career path
 * @param finalLevel - The final level achieved (1-4)
 * @param totalScore - Total weeks survived (used for scoring)
 * @returns A formatted narrative array
 */
export function generateOfflineSummary(careerPath: string, finalLevel: number, totalScore: number): string[] {
  // Determine which template to use based on score
  let template: string[];

  if (totalScore >= 100) {
    // High score = success
    template = [...SUMMARY_TEMPLATES.success];
  } else if (totalScore >= 50) {
    // Mid score = average
    template = [...SUMMARY_TEMPLATES.average];
  } else {
    // Low score = burnout
    template = [...SUMMARY_TEMPLATES.burnout];
  }

  // Fill placeholders
  const narrative = template.map(line =>
    line
      .replace(/\{\{path\}\}/g, careerPath)
      .replace(/\{\{level\}\}/g, String(finalLevel))
      .replace(/\{\{score\}\}/g, String(totalScore)),
  );

  return narrative;
}
