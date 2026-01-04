import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

import { Job } from '@/types/game';

interface InterviewQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Difficulty mapping based on job level
function getDifficultyLabel(level: number): string {
  switch (level) {
    case 1:
      return 'entry-level (easy)';
    case 2:
      return 'junior (moderate)';
    case 3:
      return 'senior (hard)';
    case 4:
      return 'principal/staff (very hard)';
    default:
      return 'moderate';
  }
}

// Path-specific context for better questions
function getPathContext(path: string): string {
  switch (path) {
    case 'corporate':
      return 'general software development, algorithms, data structures, and version control';
    case 'ic':
      return 'backend systems, databases, APIs, distributed systems, and system design';
    case 'management':
      return 'project management, team leadership, Agile/Scrum, stakeholder communication, and conflict resolution';
    case 'hustler':
      return 'startup culture, rapid prototyping, MVP development, scrappy problem-solving, and wearing multiple hats';
    case 'business':
      return 'business strategy, market analysis, product management, stakeholder management, and strategic thinking';
    case 'specialist':
      return 'deep technical expertise, security, DevOps, cloud architecture, performance optimization, and specialized tooling';
    default:
      return 'general software development';
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key exists before proceeding
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY environment variable is not configured' },
        { status: 500 }
      );
    }

    // Initialize Gemini client after validation
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Parse request body
    const body = await request.json();
    const job = body.job as Job;

    if (
      !job ||
      !job.title ||
      !job.path ||
      !job.level ||
      !job.requirements ||
      typeof job.requirements !== 'object'
    ) {
      return NextResponse.json({ error: 'Invalid job data' }, { status: 400 });
    }

    const difficulty = getDifficultyLabel(job.level);
    const context = getPathContext(job.path);

    // Construct the prompt
    const prompt = `You are a technical interviewer for a tech company. Generate exactly 3 unique multiple-choice interview questions for a "${job.title}" position.

Job Details:
- Title: ${job.title}
- Career Path: ${job.path}
- Level: ${job.level}/4 (${difficulty})
- Focus Areas: ${context}

Requirements:
1. Generate exactly 3 questions appropriate for the ${difficulty} difficulty level
2. Each question must have exactly 4 options
3. Questions should be practical and relevant to real tech interviews
4. Include a mix of conceptual and scenario-based questions
5. Explanations should be concise but educational

You MUST respond with ONLY a valid JSON array in this exact format, no markdown or other text:
[
  {
    "question": "What is...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation..."
  },
  {
    "question": "How would you...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 2,
    "explanation": "Brief explanation..."
  },
  {
    "question": "Which approach...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 1,
    "explanation": "Brief explanation..."
  }
]`;

    // Call Gemini API with timeout
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    let timeoutId: NodeJS.Timeout | null = null;

    try {
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Timeout')), 15000);
        }),
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse and validate the response
      // Clean up potential markdown code blocks
      let cleanedText = text.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.slice(7);
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(0, -3);
      }
      cleanedText = cleanedText.trim();

      const questions: InterviewQuestion[] = JSON.parse(cleanedText);

      // Validate the structure
      if (!Array.isArray(questions) || questions.length !== 3) {
        throw new Error('Invalid response: expected exactly 3 questions');
      }

      for (const q of questions) {
        if (
          typeof q.question !== 'string' ||
          !Array.isArray(q.options) ||
          q.options.length !== 4 ||
          typeof q.correctIndex !== 'number' ||
          q.correctIndex < 0 ||
          q.correctIndex > 3 ||
          typeof q.explanation !== 'string'
        ) {
          throw new Error('Invalid question structure');
        }
      }

      return NextResponse.json({ questions, source: 'gemini' });
    } finally {
      // Clean up timeout to prevent memory leak
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate questions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
