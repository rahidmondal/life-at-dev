import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { ID, Query } from 'node-appwrite';

import { createAdminClient } from '@/lib/server/appwrite';
import { generateSummaryHash } from '@/lib/utils';
import { generateOfflineSummary } from '@/logic/fallbackEngine';
import { GameOver, GameStats } from '@/types/game';

const CareerPathSchema = z.enum(['corporate', 'ic', 'management', 'hustler', 'business', 'specialist']);
const GameOverReasonSchema = z.enum(['burnout', 'bankruptcy', 'victory']);

const SummaryResponseSchema = z.object({
  summary: z.string().min(10),
});

const JobSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9\s\-/()'&.]+$/, 'Invalid characters in title'),
  path: CareerPathSchema,
  level: z.number().int().min(1).max(4),
  requirements: z.object({
    coding: z.number(),
    reputation: z.number(),
    money: z.number().optional(),
  }),
  yearlyPay: z.number(),
  rentPerYear: z.number(),
  isGameEnd: z.boolean(),
  isIntermediate: z.boolean().optional(),
});

const GameStatsSchema = z.object({
  weeks: z.number().int().min(0).max(10000),
  stress: z.number().int().min(0).max(100),
  energy: z.number().int().min(0).max(100),
  money: z.number().int(),
  coding: z.number().int().min(0),
  reputation: z.number().int().min(0),
  currentJob: JobSchema,
  age: z.number().int().min(18),
  yearsWorked: z.number().int().min(0),
  totalEarned: z.number().int(),
  actionHistory: z.array(z.string()),
  familySupportYearsLeft: z.number().int().optional(),
  jobChanges: z.number().int().optional(),
  startingJobId: z.string().optional(),
});

const SummaryRequestSchema = z.object({
  stats: GameStatsSchema,
  gameOver: z.object({
    reason: GameOverReasonSchema,
    message: z.string().optional(),
    isEasterEggWin: z.boolean().optional(),
    easterEggEvent: z.string().optional(),
  }),
  eventLog: z
    .array(
      z.object({
        id: z.string(),
        timestamp: z.number(),
        message: z.string(),
        type: z.enum(['info', 'success', 'warning', 'error', 'event']),
      }),
    )
    .optional(),
});

/**
 * TIER 3: Offline Fallback (Mad-Libs Summary)
 * Used when both cache and API fail
 */
function generateFallbackSummary(stats: GameStats): string[] {
  console.info('🔧 [TIER 3] Using offline Mad-Libs summary');
  const totalWeeks = stats.weeks || 0;
  return generateOfflineSummary(stats.currentJob.path, stats.currentJob.level, totalWeeks);
}

/**
 * TIER 2: Gemini API Call with Zod Validation
 * Used when cache miss occurs
 */
async function generateSummaryFromAI(
  stats: GameStats,
  gameOver: GameOver,
  contextHash: string,
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('No API key available (GEMINI_API_KEY not configured)');
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const isEasterEgg = gameOver.isEasterEggWin === true;
  const outcomeDescription = isEasterEgg
    ? 'achieved a legendary easter egg victory through unconventional means'
    : gameOver.reason === 'victory'
      ? 'victorious'
      : gameOver.reason === 'burnout'
        ? 'burned out'
        : 'broke';

  const prompt = `You are a retro game narrator for "Life at Dev", a terminal-style career simulation game.

Write a short, witty career retrospective for a ${stats.currentJob.path} developer who reached level ${String(stats.currentJob.level)}.

Game Stats:
- Role: ${stats.currentJob.title}
- Career Path: ${stats.currentJob.path}
- Years in Industry: ${String(stats.yearsWorked)}
- Age: ${String(stats.age)}
- Weeks Survived: ${String(stats.weeks)}
- Coding Skill: ${String(stats.coding)}
- Reputation: ${String(stats.reputation)}
- Final Energy: ${String(stats.energy)}%
- Final Stress: ${String(stats.stress)}%
- Money: $${stats.money.toLocaleString()}
- Total Earned: $${stats.totalEarned.toLocaleString()}
- Job Changes: ${String(stats.jobChanges ?? 0)}
- Outcome: ${outcomeDescription}${isEasterEgg ? `\n- Easter Egg Event: ${gameOver.easterEggEvent ?? 'A hidden path revealed itself'}` : ''}

Write 5-7 lines that:
1. Reference their career path and achievements without mentioning specific stats
2. Comment on their final outcome (${outcomeDescription})
3. Include one piece of wisdom
4. End with a memorable line${isEasterEgg ? '\n5. Celebrate their discovery of the hidden path!' : ''}

Tone: ${isEasterEgg ? 'Celebratory, mysterious, legendary. Like discovering a secret ending in a classic game.' : 'Nostalgic, slightly melancholic, wise. Like an old sage reflecting on life choices.'}

You MUST respond with valid JSON matching this schema:
{
  "summary": "Multi-line summary text here.\\nUse \\\\n for line breaks.\\nKeep it 5-7 lines."
}`;

  try {
    console.info('🤖 [TIER 2] Calling Gemini API for summary...');

    const modelId = process.env.GEMINI_MODEL_ID;
    if (!modelId) {
      throw new Error('GEMINI_MODEL_ID is not configured');
    }
    const model = genAI.getGenerativeModel({
      model: modelId,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

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

    const parsed = JSON.parse(text) as unknown;
    const validated = SummaryResponseSchema.parse(parsed);

    console.info('✅ [TIER 2] Gemini API success');

    console.info('💾 [TIER 2] Caching summary...');
    cacheSummaryToAppwrite(contextHash, validated.summary).catch((err: unknown) => {
      console.error('⚠️ Failed to cache summary:', err);
    });

    const narrative = validated.summary.split('\n').filter(line => line.trim().length > 0);

    return narrative.join('\n');
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[SECURITY] [TIER 2] AI response validation failed');
    } else {
      console.error('[SECURITY] [TIER 2] Gemini API error:', error instanceof Error ? error.message : 'Unknown error');
    }
    return null;
  }
}

/**
 * Async cache write to Appwrite
 */
async function cacheSummaryToAppwrite(contextHash: string, summaryText: string): Promise<void> {
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  if (!databaseId) {
    console.error('APPWRITE_DATABASE_ID not configured');
    return;
  }

  try {
    const { tablesDB } = createAdminClient();

    const existing = await tablesDB.listRows({
      databaseId,
      tableId: 'ai_cache_summaries',
      queries: [Query.equal('context_hash', contextHash)],
    });

    if (existing.total > 0 && existing.rows.length > 0) {
      await tablesDB.updateRow({
        databaseId,
        tableId: 'ai_cache_summaries',
        rowId: existing.rows[0].$id,
        data: {
          usage_count: (existing.rows[0].usage_count as number) + 1,
        },
      });
      console.info('[CACHE] Updated existing summary');
    } else {
      await tablesDB.createRow({
        databaseId,
        tableId: 'ai_cache_summaries',
        rowId: ID.unique(),
        data: {
          context_hash: contextHash,
          summary_text: summaryText,
          usage_count: 1,
        },
        permissions: [],
      });
      console.info('[CACHE] Created new summary entry');
    }
  } catch (error) {
    console.error('⚠️ [CACHE] Failed to store summary:', error);
  }
}

/**
 * Async increment usage count
 */
async function incrementSummaryUsageCount(rowId: string): Promise<void> {
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  if (!databaseId) return;

  try {
    const { tablesDB } = createAdminClient();
    const row = await tablesDB.getRow({
      databaseId,
      tableId: 'ai_cache_summaries',
      rowId,
    });

    const currentCount = typeof row.usage_count === 'number' ? row.usage_count : 1;
    await tablesDB.updateRow({
      databaseId,
      tableId: 'ai_cache_summaries',
      rowId,
      data: {
        usage_count: currentCount + 1,
      },
    });
  } catch (error) {
    console.error('⚠️ Failed to increment summary usage count:', error);
  }
}

/**
 * TIER 1: Cache Check in Appwrite
 */
async function checkSummaryCache(contextHash: string): Promise<string | null> {
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  if (!databaseId) {
    console.info('⚠️ [TIER 1] APPWRITE_DATABASE_ID not configured, skipping cache');
    return null;
  }

  try {
    console.info(`🔍 [TIER 1] Checking Appwrite summary cache for context_hash: ${contextHash}`);
    const { tablesDB } = createAdminClient();

    const response = await tablesDB.listRows({
      databaseId,
      tableId: 'ai_cache_summaries',
      queries: [Query.equal('context_hash', contextHash)],
    });

    if (response.total === 0 || response.rows.length === 0) {
      console.info(`❌ [TIER 1] Cache MISS - no rows found for context_hash: ${contextHash}`);
      return null;
    }

    const row = response.rows[0];
    console.info(`✅ [TIER 1] Cache HIT! Found document ID: ${row.$id}`);
    const summaryText = row.summary_text as string;

    incrementSummaryUsageCount(row.$id).catch(() => {
      console.error('⚠️ Failed to increment summary usage count');
    });

    return summaryText;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.info(`❌ [TIER 1] Cache MISS - Error: ${errorMsg}`);
    return null;
  }
}

/**
 * Main POST handler - Tiered Defense Architecture
 * Security: Strict Zod input validation to prevent prompt injection
 */
export async function POST(request: NextRequest) {
  try {
    const parseResult = SummaryRequestSchema.safeParse(await request.json());
    if (!parseResult.success) {
      console.error('[SECURITY] Validation failed:', JSON.stringify(parseResult.error.issues));
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const { stats, gameOver } = parseResult.data;

    const totalWeeks = stats.weeks || 0;
    const contextHash = generateSummaryHash(
      stats.currentJob.path,
      stats.currentJob.level,
      totalWeeks,
      gameOver.reason,
      gameOver.isEasterEggWin,
    );

    console.info(`📊 Summary Context Hash: ${contextHash}`);

    // TIER 1: Check cache
    const cachedSummary = await checkSummaryCache(contextHash);
    if (cachedSummary) {
      const narrative = cachedSummary.split('\n').filter(line => line.trim().length > 0);
      return NextResponse.json({ narrative, source: 'cache' });
    }

    // TIER 2: Try Gemini API
    const aiSummary = await generateSummaryFromAI(stats as GameStats, gameOver as GameOver, contextHash);
    if (aiSummary) {
      const narrative = aiSummary.split('\n').filter(line => line.trim().length > 0);
      return NextResponse.json({ narrative, source: 'gemini' });
    }

    // TIER 3: Offline fallback
    const fallbackNarrative = generateFallbackSummary(stats as GameStats);
    return NextResponse.json({ narrative: fallbackNarrative, source: 'offline' });
  } catch (error) {
    console.error('[SECURITY] Summary API error:', error instanceof Error ? error.message : 'Unknown error');

    // Emergency fallback - always return something
    const emergencyNarrative = [
      'The game has ended.',
      'Your journey as a developer was... interesting.',
      'Sometimes the best code is the code that ships.',
      'GG.',
    ];

    return NextResponse.json({ narrative: emergencyNarrative, source: 'offline' });
  }
}
