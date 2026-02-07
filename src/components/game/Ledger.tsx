'use client';

import { JOB_REGISTRY } from '../../data/tracks';
import { calculateYearlyRent } from '../../engine/yearEnd';
import { useGameStore } from '../../store/useGameStore';
import {
  BriefcaseIcon,
  CodeIcon,
  CrownIcon,
  DollarIcon,
  GlobeIcon,
  GraduationCapIcon,
  HeartPulseIcon,
  RocketIcon,
  StarIcon,
  TerminalIcon,
  TrendingIcon,
  UserCogIcon,
  UserIcon,
  ZapIcon,
} from '../ui/icons';

const JOB_ICONS: Record<string, React.ReactNode> = {
  unemployed: <UserIcon size={32} className="text-[#8B949E]" />,
  corp_intern: <GraduationCapIcon size={32} className="text-[#58A6FF]" />,
  corp_junior: <CodeIcon size={32} className="text-[#39D353]" />,
  corp_mid: <TerminalIcon size={32} className="text-[#A371F7]" />,
  corp_senior: <StarIcon size={32} className="text-[#F0883E]" />,
  corp_lead: <TrendingIcon size={32} className="text-[#39D353]" />,
  corp_manager: <UserCogIcon size={32} className="text-[#58A6FF]" />,
  corp_cto: <CrownIcon size={32} className="text-[#D2A8FF]" />,
  hustle_freelancer: <RocketIcon size={32} className="text-[#F0883E]" />,
  hustle_nomad: <GlobeIcon size={32} className="text-[#58A6FF]" />,
  ic_staff: <StarIcon size={32} className="text-[#D2A8FF]" />,
  ic_principal: <CrownIcon size={32} className="text-[#FFD700]" />,
};

const getJobIcon = (jobId: string | null): React.ReactNode => {
  if (!jobId) return JOB_ICONS.unemployed;
  return JOB_ICONS[jobId] ?? <CodeIcon size={32} className="text-[#39D353]" />;
};

interface LedgerProps {
  compact?: boolean;
}

const PATH_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  scholar: { label: 'Scholar', color: '#39D353', emoji: '🎓' },
  funded: { label: 'Debtor', color: '#FF7B72', emoji: '💸' },
  dropout: { label: 'Dropout', color: '#A371F7', emoji: '🚀' },
};

export function Ledger({ compact = false }: LedgerProps) {
  const { meta, resources, stats, career, flags, getProjectedSkillChange } = useGameStore();

  const age = meta.startAge + Math.floor(meta.tick / 52);
  const weekInYear = meta.tick % 52;
  const totalXP = stats.xp.corporate + stats.xp.freelance;
  const maxXP = 10000;

  const getStressColor = (stress: number) => {
    if (stress < 50) return '#39D353';
    if (stress < 80) return '#F0883E';
    return '#FF7B72';
  };

  const stressColor = getStressColor(resources.stress);
  const isDanger = resources.stress >= 80;

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <StatMini label="Energy" value={resources.energy} max={100} color="#58A6FF" icon={<ZapIcon size={14} />} />
          <StatMini
            label="Stress"
            value={resources.stress}
            max={100}
            color={stressColor}
            icon={<HeartPulseIcon size={14} />}
          />
          <StatMini
            label="Skill"
            value={stats.skills.coding}
            max={10000}
            color="#39D353"
            icon={<CodeIcon size={14} />}
          />
          <StatMini label="Money" value={resources.money} isMoney color="#D2A8FF" icon={<DollarIcon size={14} />} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DualBar label="Skill" value={stats.skills.coding} max={10000} color="#39D353" />
          <DualBar label="XP" value={totalXP} max={maxXP} color="#A371F7" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Profile Card */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
        {/* Avatar & Basic Info */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#39D353]/20 to-[#161B22] border-2 border-[#39D353]/50 flex items-center justify-center">
              {getJobIcon(career.currentJobId)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#39D353] flex items-center justify-center text-[#0D1117] text-xs font-bold border-2 border-[#0D1117]">
              {age}
            </div>
          </div>
          <h2 className="text-[#39D353] font-bold">{meta.playerName || 'Developer'}</h2>
          <p className="text-[#8B949E] text-sm">
            {flags.isScholar
              ? `Student (Year ${String(4 - flags.scholarYearsRemaining + 1)}/4)`
              : JOB_REGISTRY[career.currentJobId].title}
          </p>
          {flags.startingPath && (
            <div
              className="mt-1 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
              style={{
                backgroundColor: `${PATH_LABELS[flags.startingPath].color}20`,
                color: PATH_LABELS[flags.startingPath].color,
              }}
            >
              <span>{PATH_LABELS[flags.startingPath].emoji}</span>
              <span>
                {flags.isScholar
                  ? `College (${String(flags.scholarYearsRemaining)} yrs left)`
                  : PATH_LABELS[flags.startingPath].label}
              </span>
              {flags.startingPath === 'funded' && resources.debt > 0 && (
                <span className="text-[#FF7B72]"> • ${resources.debt.toLocaleString()} debt</span>
              )}
            </div>
          )}
        </div>

        {/* Salary & Rent */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-[#0D1117] rounded p-2">
            <p className="text-[#484F58] text-xs">Salary</p>
            <p className="text-[#39D353] font-mono text-sm">
              ${JOB_REGISTRY[career.currentJobId].salary.toLocaleString()}/yr
            </p>
          </div>
          <div className="bg-[#0D1117] rounded p-2">
            <p className="text-[#484F58] text-xs">Rent</p>
            <p className="text-[#FF7B72] font-mono text-sm">
              -${calculateYearlyRent(career.currentJobId).toLocaleString()}/yr
            </p>
          </div>
        </div>
      </div>

      {/* Year Progress */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#39D353] text-xs font-bold flex items-center gap-2">📅 YEAR PROGRESS</span>
          <span className="text-[#8B949E] text-xs font-mono">Week {weekInYear}/52</span>
        </div>
        <div className="h-2 bg-[#0D1117] rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-[#39D353] to-[#39D353]/50 transition-all duration-300"
            style={{ width: `${String((weekInYear / 52) * 100)}%` }}
          />
        </div>
        <p className="text-center text-[#39D353] font-mono text-2xl mt-2">
          {52 - weekInYear} <span className="text-sm text-[#8B949E]">weeks left</span>
        </p>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 space-y-4">
        <h3 className="text-[#58A6FF] text-xs font-bold flex items-center gap-2">⚡ VITALS</h3>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1">
              <ZapIcon size={12} className="text-[#58A6FF]" />
              Energy
            </span>
            <span className="text-[#58A6FF] font-mono">{resources.energy}/100</span>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`h-3 flex-1 rounded-sm transition-colors ${
                  resources.energy > i * 10 ? 'bg-[#58A6FF]' : 'bg-[#0D1117]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stress Bar (Gradient) */}
        <div className={isDanger ? 'animate-pulse' : ''}>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1">
              <span style={{ color: stressColor }}>
                <HeartPulseIcon size={12} />
              </span>
              Stress
            </span>
            <span className="font-mono" style={{ color: stressColor }}>
              {resources.stress}/100
            </span>
          </div>
          <div className="h-3 bg-[#0D1117] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{
                width: `${String(resources.stress)}%`,
                background: `linear-gradient(90deg, ${stressColor}, ${stressColor}88)`,
                boxShadow: isDanger ? `0 0 10px ${stressColor}` : 'none',
              }}
            />
          </div>
          {isDanger && <p className="text-[#FF7B72] text-xs mt-1 animate-pulse">⚠️ BURNOUT WARNING</p>}
        </div>
      </div>

      {/* Balance */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
        <h3 className="text-[#D2A8FF] text-xs font-bold flex items-center gap-2 mb-3">💰 BALANCE</h3>
        <p className="text-[#D2A8FF] font-mono text-3xl text-center">${resources.money.toLocaleString()}</p>
      </div>

      {/* Skills & Experience */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 space-y-4">
        <h3 className="text-[#8B949E] text-xs font-bold">SKILLS & EXPERIENCE</h3>

        {/* Skill (Potential) */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-[#39D353] flex items-center gap-1">
              <CodeIcon size={12} />
              Skill (Coding)
            </span>
            <span className="text-[#8B949E] flex items-center gap-1">
              {(() => {
                // Use the store selector for projection
                // This respects the architecture: Engine -> Store -> UI
                const netChange = getProjectedSkillChange();
                const netChangeRounded = Math.round(netChange * 10) / 10;

                if (netChangeRounded > 0) {
                  return <span className="text-[#39D353]">+{netChangeRounded}/wk</span>;
                } else if (netChangeRounded < 0) {
                  return <span className="text-[#FF7B72]">{netChangeRounded}/wk</span>;
                }
                return <span className="text-[#8B949E]">Stable</span>;
              })()}
            </span>
          </div>
          <div className="h-4 bg-[#0D1117] rounded overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#39D353] to-[#39D353]/60 transition-all duration-300"
              style={{ width: `${String((stats.skills.coding / 10000) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 text-[#484F58]">
            <span>0</span>
            <span className="text-[#39D353] font-mono">{stats.skills.coding.toLocaleString()}</span>
            <span>10,000</span>
          </div>
        </div>

        {/* Politics */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-[#D2A8FF] flex items-center gap-1">
              <UserCogIcon size={12} />
              Politics
            </span>
          </div>
          <div className="h-4 bg-[#0D1117] rounded overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#D2A8FF] to-[#D2A8FF]/60 transition-all duration-300"
              style={{ width: `${String((stats.skills.politics / 10000) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 text-[#484F58]">
            <span>0</span>
            <span className="text-[#D2A8FF] font-mono">{stats.skills.politics.toLocaleString()}</span>
            <span>10,000</span>
          </div>
        </div>

        {/* XP & Reputation Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#30363D]">
          {/* Corporate XP */}
          <div className="bg-[#0D1117] rounded p-2">
            <div className="flex items-center gap-1 text-[#484F58] text-xs mb-1">
              <BriefcaseIcon size={12} className="text-[#A371F7]" />
              <span>Corp XP</span>
            </div>
            <p className="text-[#A371F7] font-mono text-sm">{stats.xp.corporate.toLocaleString()}</p>
          </div>

          {/* Freelance XP */}
          <div className="bg-[#0D1117] rounded p-2">
            <div className="flex items-center gap-1 text-[#484F58] text-xs mb-1">
              <RocketIcon size={12} className="text-[#F0883E]" />
              <span>Free XP</span>
            </div>
            <p className="text-[#F0883E] font-mono text-sm">{stats.xp.freelance.toLocaleString()}</p>
          </div>

          {/* Reputation */}
          <div className="bg-[#0D1117] rounded p-2 col-span-2">
            <div className="flex items-center gap-1 text-[#484F58] text-xs mb-1">
              <CrownIcon size={12} className="text-[#FFD700]" />
              <span>Reputation</span>
            </div>
            <p className="text-[#FFD700] font-mono text-sm">{stats.xp.reputation.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatMini({
  label,
  value,
  max,
  color,
  icon,
  isMoney,
}: {
  label: string;
  value: number;
  max?: number;
  color: string;
  icon: React.ReactNode;
  isMoney?: boolean;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-xs mb-1" style={{ color }}>
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-mono text-sm" style={{ color }}>
        {isMoney ? `$${value.toLocaleString()}` : max ? `${String(value)}/${String(max)}` : value}
      </p>
    </div>
  );
}

function DualBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color }}>{label}</span>
        <span className="text-[#8B949E] font-mono">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-[#0D1117] rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${String((value / max) * 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
