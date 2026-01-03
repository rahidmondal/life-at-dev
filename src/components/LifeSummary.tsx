import { GameOver, GameStats } from '@/types/game';

interface LifeSummaryProps {
  stats: GameStats;
  gameOver: GameOver;
}

export default function LifeSummary({ stats, gameOver }: LifeSummaryProps) {
  // Generate narrative based on ending type and stats
  const generateNarrative = (): string[] => {
    const { age, currentJob, coding, reputation, money } = stats;
    const yearsPlayed = age - 18;

    if (gameOver.reason === 'burnout') {
      return [
        `After ${String(yearsPlayed)} years in tech, the grind finally caught up with you.`,
        `You reached ${currentJob.title}, but at what cost?`,
        coding >= 700
          ? `Your technical skills (${String(coding)}/1000) were impressive, but you pushed too hard.`
          : `Your coding skills (${String(coding)}/1000) weren't the issue - it was the relentless pace.`,
        reputation >= 500
          ? `You built a solid reputation (${String(reputation)}/1000) in the industry.`
          : `Your reputation (${String(reputation)}/1000) was still growing when stress took over.`,
        money > 50000
          ? `You left with $${money.toLocaleString()} saved - proof that success isn't everything.`
          : `Financial struggles ($${money.toLocaleString()}) added to your stress levels.`,
        `Remember: No job is worth your mental health. Rest isn't weakness.`,
      ];
    }

    if (gameOver.reason === 'bankruptcy') {
      return [
        `After ${String(yearsPlayed)} years of hustling, you ran out of money.`,
        `You were working as ${currentJob.title} when the funds dried up.`,
        coding >= 500
          ? `Your skills (${String(coding)}/1000 coding) were solid, but life got expensive.`
          : `Your coding skills (${String(coding)}/1000) needed more development to earn higher pay.`,
        reputation >= 400
          ? `You had decent industry presence (${String(reputation)}/1000 rep), but money was tight.`
          : `Low reputation (${String(reputation)}/1000) limited your earning opportunities.`,
        `Rent, expenses, and tough choices led to this moment.`,
        `Remember: Financial planning matters. Build emergency funds. Side gigs help.`,
      ];
    }

    // Victory narratives
    return [
      `After ${String(yearsPlayed)} years of dedication, you made it to ${currentJob.title}!`,
      `You're now earning $${currentJob.yearlyPay.toLocaleString()} per year - you've made it.`,
      `Your journey from Unemployed to the top is complete.`,
      coding >= 900
        ? `Your technical mastery (${String(coding)}/1000) is world-class.`
        : `Your coding skills (${String(coding)}/1000) got you here through perseverance.`,
      reputation >= 800
        ? `Your industry reputation (${String(reputation)}/1000) opens every door.`
        : `Your reputation (${String(reputation)}/1000) continues to grow with your new role.`,
      money > 500000
        ? `With $${money.toLocaleString()} in the bank, you have financial freedom.`
        : `You're sitting on $${money.toLocaleString()} - comfortable and secure.`,
      `You survived the grind. You climbed the ladder. You won.`,
    ];
  };

  const narrative = generateNarrative();

  return (
    <div className="space-y-4">
      <h3 className="border-b border-emerald-500/30 pb-2 font-mono text-lg font-bold text-emerald-500">
        // LIFE SUMMARY
      </h3>
      <div className="space-y-3 font-mono text-sm leading-relaxed text-white/90">
        {narrative.map((line, index) => (
          <p key={index} className={index === narrative.length - 1 ? 'text-emerald-500 font-bold' : ''}>
            {line}
          </p>
        ))}
      </div>

      {/* Stats Card */}
      <div className="mt-6 rounded border-2 border-emerald-500/30 bg-emerald-500/5 p-4">
        <div className="mb-2 font-mono text-xs font-bold text-emerald-500">FINAL STATS</div>
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div>
            <span className="text-gray-400">Age:</span> <span className="text-white">{stats.age}</span>
          </div>
          <div>
            <span className="text-gray-400">Position:</span>{' '}
            <span className="text-emerald-400">{stats.currentJob.title}</span>
          </div>
          <div>
            <span className="text-gray-400">Coding:</span>{' '}
            <span className={stats.coding >= 700 ? 'text-emerald-400' : 'text-yellow-500'}>{stats.coding}/1000</span>
          </div>
          <div>
            <span className="text-gray-400">Reputation:</span>{' '}
            <span className={stats.reputation >= 700 ? 'text-emerald-400' : 'text-yellow-500'}>
              {stats.reputation}/1000
            </span>
          </div>
          <div>
            <span className="text-gray-400">Salary:</span>{' '}
            <span className="text-emerald-400">${stats.currentJob.yearlyPay.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Savings:</span>{' '}
            <span className={stats.money > 100000 ? 'text-emerald-400' : 'text-yellow-500'}>
              ${stats.money.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
