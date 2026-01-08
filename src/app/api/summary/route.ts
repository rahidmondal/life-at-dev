import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';
import { z } from 'zod';

import { createAdminClient } from '@/lib/server/appwrite';
import { generateSummaryHash } from '@/lib/utils';
import { generateOfflineSummary } from '@/logic/madLibs';
import { GameOver, GameStats } from '@/types/game';

// Zod schema for summary validation
const SummaryResponseSchema = z.object({
  summary: z.string().min(10),
});

interface SummaryRequestBody {
  stats: GameStats;
  gameOver: GameOver;
}

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

  // Construct a concise prompt
  const prompt = `You are a retro game narrator for "Life at Dev", a terminal-style career simulation game.

Write a short, witty career retrospective for a ${stats.currentJob.path} developer who reached level ${String(stats.currentJob.level)}.

Game Stats:
- Role: ${stats.currentJob.title}
- Weeks Survived: ${stats.weeks}
- Final Energy: ${stats.energy}%
- Final Stress: ${stats.stress}%
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
    const validated = SummaryResponseSchema.parse(parsed);

    console.info('✅ [TIER 2] Gemini API success');

    // Cache the result
    console.info('💾 [TIER 2] Caching summary...');
    cacheSummaryToAppwrite(contextHash, validated.summary).catch((err: unknown) => {
      console.error('⚠️ Failed to cache summary:', err);
    });

    // Convert to array format (split by newlines)
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
    const { databases } = createAdminClient();

    await databases.createDocument({
      databaseId,
      collectionId: 'ai_cache_summaries',
      documentId: 'unique()',
      data: {
        context_hash: contextHash,
        summary_text: summaryText,
        usage_count: 1,
      },
    });

    console.info('💾 [CACHE] Summary stored to Appwrite');
  } catch (error) {
    // Ignore duplicate key errors (race condition)
    if (error && typeof error === 'object' && 'code' in error && error.code === 409) {
      console.info('💾 [CACHE] Summary already exists (race condition)');
    } else {
      throw error;
    }
  }
}

/**
 * Async increment usage count
 */
async function incrementSummaryUsageCount(documentId: string): Promise<void> {
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  if (!databaseId) return;

  try {
    const { databases } = createAdminClient();
    const doc = await databases.getDocument({
      databaseId,
      collectionId: 'ai_cache_summaries',
      documentId,
    });

    const currentCount = typeof doc.usage_count === 'number' ? doc.usage_count : 1;
    await databases.updateDocument({
      databaseId,
      collectionId: 'ai_cache_summaries',
      documentId,
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
    console.info('🔍 [TIER 1] Checking Appwrite summary cache...');
    const { databases } = createAdminClient();

    const response = await databases.listDocuments({
      databaseId,
      collectionId: 'ai_cache_summaries',
      queries: [Query.equal('context_hash', contextHash), Query.limit(1)],
    });

    if (response.documents.length > 0) {
      const doc = response.documents[0];
      console.info('✅ [TIER 1] Cache HIT!');

      const summaryText = doc.summary_text as string;

      // Async increment usage count (don't await)
      incrementSummaryUsageCount(doc.$id).catch(() => {
        // Silently fail
      });

      return summaryText;
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
    const body = (await request.json()) as SummaryRequestBody;
    const { stats, gameOver } = body;

    // Runtime validation
    if (!stats || typeof stats !== 'object' || !gameOver || typeof gameOver !== 'object') {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    if (!stats.currentJob?.path || !stats.currentJob.level) {
      return NextResponse.json({ error: 'Invalid job data in stats' }, { status: 400 });
    }

    // Generate context hash for cache lookup
    const totalWeeks = stats.weeks || 0;
    const contextHash = generateSummaryHash(stats.currentJob.path, stats.currentJob.level, totalWeeks);

    console.info(`📊 Summary Context Hash: ${contextHash}`);

    // TIER 1: Check cache
    const cachedSummary = await checkSummaryCache(contextHash);
    if (cachedSummary) {
      // Convert to array format if needed
      const narrative = cachedSummary.split('\n').filter(line => line.trim().length > 0);
      return NextResponse.json({ narrative, source: 'cache' });
    }

    // TIER 2: Try Gemini API
    const aiSummary = await generateSummaryFromAI(stats, gameOver, contextHash);
    if (aiSummary) {
      const narrative = aiSummary.split('\n').filter(line => line.trim().length > 0);
      return NextResponse.json({ narrative, source: 'gemini' });
    }

    // TIER 3: Offline fallback
    const fallbackNarrative = generateFallbackSummary(stats);
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
