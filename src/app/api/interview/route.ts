import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';
import { z } from 'zod';

import { createAdminClient } from '@/lib/server/appwrite';
import { generateContextHash } from '@/lib/utils';
import { generateOfflineInterviewSet } from '@/logic/madLibs';
import { Job } from '@/types/game';

// Zod schema for interview question validation
const InterviewQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().min(0).max(3),
  explanation: z.string(),
});

const InterviewResponseSchema = z.array(InterviewQuestionSchema).length(3);

interface InterviewQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface RequestBody {
  job: Job;
  stats?: {
    energy?: number;
    eventCount?: number;
  };
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

/**
 * TIER 3: Offline Fallback (Mad-Libs Engine)
 * Used when both cache and API fail
 */
function generateFallbackQuestions(job: Job): InterviewQuestion[] {
  console.info('🔧 [TIER 3] Using offline Mad-Libs engine');
  return generateOfflineInterviewSet(job.path, job.level, 3);
}

/**
 * TIER 2: Gemini API Call with Zod Validation
 * Used when cache miss occurs
 * @param userApiKey - Optional user-provided API key (BYOK)
 */
async function generateQuestionsFromAI(
  job: Job,
  contextHash: string,
  userApiKey?: string,
): Promise<InterviewQuestion[] | null> {
  // Use user API key if provided, otherwise use server key
  const apiKey = userApiKey ?? process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('No API key available (neither user-provided nor server-configured)');
    return null;
  }

  const isUserKey = Boolean(userApiKey);
  if (isUserKey) {
    console.info('🔑 [TIER 2] Using user-provided API key (BYOK)');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const difficulty = getDifficultyLabel(job.level);
  const context = getPathContext(job.path);

  // Construct the prompt
  const prompt = `You are a technical interviewer for a tech company. Generate exactly 3 unique multiple-choice interview questions for a "${job.title}" position.

Job Details:
- Title: ${job.title}
- Career Path: ${job.path}
- Level: ${String(job.level)}/4 (${difficulty})
- Focus Areas: ${context}

Requirements:
1. Generate exactly 3 questions appropriate for the ${difficulty} difficulty level
2. Each question must have exactly 4 options
3. Questions should be practical and relevant to real tech interviews
4. Include a mix of conceptual and scenario-based questions
5. Explanations should be concise but educational

You MUST respond with valid JSON array matching this schema:
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

  try {
    console.info('🤖 [TIER 2] Calling Gemini API...');

    // Initialize model with JSON response mode
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    // Call API with timeout
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('API Timeout'));
        }, 15000);
      }),
    ]);

    const response = result.response;
    const text = response.text();

    // Parse and validate with Zod
    const parsed = JSON.parse(text) as unknown;
    const validated = InterviewResponseSchema.parse(parsed);

    console.info('✅ [TIER 2] Gemini API success');

    // Only cache if using server API key (privacy: don't cache user key responses)
    if (!isUserKey) {
      console.info('💾 [TIER 2] Caching result...');
      cacheQuestionsToAppwrite(contextHash, validated, job.path).catch((err: unknown) => {
        console.error('⚠️ Failed to cache to Appwrite:', err);
      });
    } else {
      console.info('🔒 [TIER 2] Skipping cache (user key used)');
    }

    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ [TIER 2] Zod validation failed:', error.issues);
    } else {
      console.error('❌ [TIER 2] Gemini API error:', error instanceof Error ? error.message : error);
    }
    return null;
  }
}

/**
 * Async cache write to Appwrite
 */
async function cacheQuestionsToAppwrite(
  contextHash: string,
  questions: InterviewQuestion[],
  rolePath: string,
): Promise<void> {
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  if (!databaseId) {
    console.error('APPWRITE_DATABASE_ID not configured');
    return;
  }

  try {
    const { databases } = createAdminClient();

    // Store as separate documents (one per question) or as a single document
    // For simplicity, we'll store all 3 as a JSON string in a single doc
    await databases.createDocument({
      databaseId,
      collectionId: 'ai_cache_interviews',
      documentId: 'unique()',
      data: {
        context_hash: contextHash,
        question_text: questions.map(q => q.question).join(' | '),
        options_json: JSON.stringify(questions),
        role_tag: rolePath,
        usage_count: 1,
      },
    });

    console.info('💾 [CACHE] Stored to Appwrite');
  } catch (error) {
    // Ignore duplicate key errors (race condition)
    if (error && typeof error === 'object' && 'code' in error && error.code === 409) {
      console.info('💾 [CACHE] Already exists (race condition)');
    } else {
      throw error;
    }
  }
}

/**
 * Async increment usage count
 */
async function incrementUsageCount(documentId: string): Promise<void> {
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  if (!databaseId) return;

  try {
    const { databases } = createAdminClient();
    const doc = await databases.getDocument({
      databaseId,
      collectionId: 'ai_cache_interviews',
      documentId,
    });

    const currentCount = typeof doc.usage_count === 'number' ? doc.usage_count : 1;
    await databases.updateDocument({
      databaseId,
      collectionId: 'ai_cache_interviews',
      documentId,
      data: {
        usage_count: currentCount + 1,
      },
    });
  } catch (error) {
    console.error('⚠️ Failed to increment usage count:', error);
  }
}

/**
 * TIER 1: Cache Check in Appwrite
 */
async function checkCache(contextHash: string): Promise<InterviewQuestion[] | null> {
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  if (!databaseId) {
    console.info('⚠️ [TIER 1] APPWRITE_DATABASE_ID not configured, skipping cache');
    return null;
  }

  try {
    console.info('🔍 [TIER 1] Checking Appwrite cache...');
    const { databases } = createAdminClient();

    const response = await databases.listDocuments({
      databaseId,
      collectionId: 'ai_cache_interviews',
      queries: [Query.equal('context_hash', contextHash), Query.limit(1)],
    });

    if (response.documents.length > 0) {
      const doc = response.documents[0];
      console.info('✅ [TIER 1] Cache HIT!');

      // Parse the cached questions
      const questions = JSON.parse(doc.options_json as string) as InterviewQuestion[];

      // Async increment usage count (don't await)
      incrementUsageCount(doc.$id).catch(() => {
        // Silently fail
      });

      return questions;
    }

    console.info('❌ [TIER 1] Cache MISS');
    return null;
  } catch (error) {
    console.error('⚠️ [TIER 1] Cache check failed:', error);
    return null;
  }
}

/**
 * Main POST handler - Tiered Defense Architecture
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate input
    const body = (await request.json()) as RequestBody;
    const { job } = body;

    // Runtime validation (JSON could be malformed)
    if (!job || typeof job !== 'object' || !job.title || !job.path || !job.level) {
      return NextResponse.json({ error: 'Invalid job data' }, { status: 400 });
    }

    // Generate context hash for cache lookup
    const energy = body.stats?.energy ?? 100;
    const eventCount = body.stats?.eventCount ?? 0;
    const contextHash = generateContextHash(job.path, job.level, energy, eventCount);

    console.info(`📊 Context Hash: ${contextHash}`);

    // Extract user API key from header (BYOK support)
    const userApiKey = request.headers.get('x-user-gemini-key') ?? undefined;

    // TIER 1: Check cache (skip if using user key for privacy)
    if (!userApiKey) {
      const cachedQuestions = await checkCache(contextHash);
      if (cachedQuestions) {
        return NextResponse.json({ questions: cachedQuestions, source: 'cache' });
      }
    } else {
      console.info('🔑 [BYOK] User API key detected, skipping cache check');
    }

    // TIER 2: Try Gemini API
    const aiQuestions = await generateQuestionsFromAI(job, contextHash, userApiKey);
    if (aiQuestions) {
      return NextResponse.json({ questions: aiQuestions, source: 'gemini' });
    }

    // TIER 3: Fallback to offline generation
    const offlineQuestions = generateFallbackQuestions(job);
    return NextResponse.json({ questions: offlineQuestions, source: 'offline' });
  } catch (error) {
    console.error('❌ Fatal error in interview route:', error);

    // Last resort: return generic error with fallback
    return NextResponse.json(
      {
        error: 'Service temporarily unavailable',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
