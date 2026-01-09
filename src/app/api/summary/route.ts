import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { Query } from 'node-appwrite';

import { createAdminClient } from '@/lib/server/appwrite';
import { generateSummaryHash } from '@/lib/utils';
import { generateOfflineSummary } from '@/logic/fallbackEngine';
import { GameOver, GameStats } from '@/types/game';

const SummaryResponseSchema = z.object({
  summary: z.string().min(10),
});

const SummaryRequestSchema = z.object({
  stats: z.object({
    currentJob: z.object({
      title: z.string(),
      path: z.string(),
      level: z.number(),
    }),
    weeks: z.number(),
    energy: z.number(),
    stress: z.number(),
    money: z.number(),
    totalEarned: z.number(),
  }),
  gameOver: z.object({
    reason: z.string(),
  }),
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

  const prompt = `You are a retro game narrator for "Life at Dev", a terminal-style career simulation game.

Write a short, witty career retrospective for a ${stats.currentJob.path} developer who reached level ${String(stats.currentJob.level)}.

Game Stats:
- Role: ${stats.currentJob.title}
- Weeks Survived: ${String(stats.weeks)}
- Final Energy: ${String(stats.energy)}%
- Final Stress: ${String(stats.stress)}%
- Money: $${stats.money.toLocaleString()}
- Total Earned: $${stats.totalEarned.toLocaleString()}
- Outcome: ${gameOver.reason}

Write 5-7 lines that:
1. Reference their career path and achievements
2. Comment on their final outcome (${gameOver.reason === 'victory' ? 'victorious' : gameOver.reason === 'burnout' ? 'burned out' : 'broke'})
3. Include one piece of wisdom
4. End with a memorable line

Tone: Nostalgic, slightly melancholic, wise. Like an old sage reflecting on life choices.

You MUST respond with valid JSON matching this schema:
{
  "summary": "Multi-line summary text here.\\nUse \\\\n for line breaks.\\nKeep it 5-7 lines."
}`;

  try {
    console.info('🤖 [TIER 2] Calling Gemini API for summary...');

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
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
      const result = await tablesDB.updateRow({
        databaseId,
        tableId: 'ai_cache_summaries',
        rowId: existing.rows[0].$id,
        data: {
          usage_count: (existing.rows[0].usage_count as number) + 1,
        },
      });
      console.info(`💾 [CACHE] Updated existing summary (ID: ${result.$id})`);
    } else {
      const result = await tablesDB.createRow({
        databaseId,
        tableId: 'ai_cache_summaries',
        rowId: 'unique()',
        data: {
          context_hash: contextHash,
          summary_text: summaryText,
          usage_count: 1,
        },
        permissions: [],
      });
      console.info(`💾 [CACHE] Created new summary (ID: ${result.$id}, hash: ${contextHash})`);
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
 */
export async function POST(request: NextRequest) {
  try {
    const parseResult = SummaryRequestSchema.safeParse(await request.json());
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid request data', issues: parseResult.error.issues }, { status: 400 });
    }

    const { stats, gameOver } = parseResult.data;

    const gameStats = stats as unknown as GameStats;
    const gameOverData = gameOver as unknown as GameOver;

    const totalWeeks = gameStats.weeks || 0;
    const contextHash = generateSummaryHash(gameStats.currentJob.path, gameStats.currentJob.level, totalWeeks);

    console.info(`📊 Summary Context Hash: ${contextHash}`);

    // TIER 1: Check cache
    const cachedSummary = await checkSummaryCache(contextHash);
    if (cachedSummary) {
      const narrative = cachedSummary.split('\n').filter(line => line.trim().length > 0);
      return NextResponse.json({ narrative, source: 'cache' });
    }

    // TIER 2: Try Gemini API
    const aiSummary = await generateSummaryFromAI(gameStats, gameOverData, contextHash);
    if (aiSummary) {
      const narrative = aiSummary.split('\n').filter(line => line.trim().length > 0);
      return NextResponse.json({ narrative, source: 'gemini' });
    }

    // TIER 3: Offline fallback
    const fallbackNarrative = generateFallbackSummary(gameStats);
    return NextResponse.json({ narrative: fallbackNarrative, source: 'offline' });
  } catch (error) {
    console.error('❌ Summary API error:', error);

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
