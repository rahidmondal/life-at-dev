import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { parse, stringify } from 'smol-toml';

import { GameOver, GameStats, LogEntry } from '@/types/game';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface SummaryRequestBody {
  stats: GameStats;
  gameOver: GameOver;
  eventLog: LogEntry[];
}

// Convert game data to TOML format for the prompt
function gameDataToToml(stats: GameStats, gameOver: GameOver, eventLog: LogEntry[]): string {
  const playerData = {
    player: {
      role: stats.currentJob.title,
      career_path: stats.currentJob.path,
      level: stats.currentJob.level,
      age: stats.age,
      years_worked: stats.yearsWorked,
      money: stats.money,
      total_earned: stats.totalEarned,
      coding_skill: stats.coding,
      reputation: stats.reputation,
      final_stress: stats.stress,
      final_energy: stats.energy,
      outcome: gameOver.reason,
      is_easter_egg: gameOver.isEasterEggWin || false,
      ending_message: gameOver.message,
    },
  };

  // Build history array from event log
  const historyEntries = eventLog.map((entry, index) => ({
    id: index + 1,
    type: entry.type,
    event: entry.message,
  }));

  // Manually build TOML string since smol-toml stringify doesn't handle arrays of tables well
  let tomlString = stringify(playerData);

  // Add history entries manually
  if (historyEntries.length > 0) {
    tomlString += '\n';
    for (const entry of historyEntries) {
      tomlString += `\n[[history]]\n`;
      tomlString += `id = ${entry.id}\n`;
      tomlString += `type = "${entry.type}"\n`;
      tomlString += `event = "${entry.event.replace(/"/g, '\\\"').replace(/\n/g, ' ')}"\n`;
    }
  }

  return tomlString;
}

// Extract summary array from TOML response
function parseSummaryFromToml(tomlText: string): string[] {
  try {
    // Clean up potential markdown code blocks
    let cleanedText = tomlText.trim();
    if (cleanedText.startsWith('```toml')) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    const parsed = parse(cleanedText) as { summary?: string[] };

    if (parsed.summary && Array.isArray(parsed.summary)) {
      return parsed.summary;
    }

    throw new Error('No summary array found in TOML');
  } catch (error) {
    console.error('Failed to parse TOML response:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Parse request body
    const body: SummaryRequestBody = await request.json();
    const { stats, gameOver, eventLog } = body;

    if (!stats || !gameOver) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    // Limit event log to last 25 significant events to avoid token limits
    const significantEvents = eventLog
      .filter(e => e.type === 'success' || e.type === 'warning' || e.type === 'event' || e.type === 'error')
      .slice(-25);

    // Convert game data to TOML
    const gameDataToml = gameDataToToml(stats, gameOver, significantEvents);

    // Construct the prompt
    const prompt = `You are a retro game narrator for "Life at Dev", a terminal-style hacker simulation game about a developer's career journey. Your tone should be nostalgic, slightly melancholic, and wise - like an old sage reflecting on someone's life choices.

Here is the player's complete game data in TOML format:

\`\`\`toml
${gameDataToml}
\`\`\`

Based on this data, generate a personalized 5-7 line life summary narrative that:
1. References specific events from their history when relevant
2. Comments on their career path (${stats.currentJob.path}) and final role (${stats.currentJob.title})
3. Reflects on their ${gameOver.reason === 'victory' ? 'success' : gameOver.reason === 'burnout' ? 'burnout' : 'financial struggles'}
4. Includes at least one piece of wisdom or reflection
5. Ends with a memorable final line

Your response MUST be valid TOML containing ONLY a summary array. No other text, no explanations.

Format your response EXACTLY like this:
\`\`\`toml
summary = [
  "First line of the narrative...",
  "Second line about their journey...",
  "Third line reflecting on choices...",
  "Fourth line about what they achieved...",
  "Fifth line with wisdom...",
  "Final memorable line..."
]
\`\`\`

Remember: Output ONLY the TOML, nothing else.`;

    // Call Gemini API with timeout
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    let timeoutId: NodeJS.Timeout | null = null;

    try {
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000);
        }),
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse the TOML response
      const narrative = parseSummaryFromToml(text);

      // Validate we got a reasonable response
      if (narrative.length < 3 || narrative.length > 10) {
        throw new Error('Invalid narrative length');
      }

      return NextResponse.json({ narrative, source: 'gemini' });
    } finally {
      // Clean up timeout to prevent memory leak
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate summary',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
