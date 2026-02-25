'use client';

import { useMemo, useState } from 'react';
import { ACTIONS } from '../../data/actions';
import { filterActionsForJob } from '../../engine/actionFilter';
import { useGameStore } from '../../store/useGameStore';
import type { ActionCategory, GameAction } from '../../types/actions';
import {
  ArmchairIcon,
  BedIcon,
  BookOpenIcon,
  BrainCogIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarCheckIcon,
  ClockIcon,
  CodeIcon,
  CoffeeIcon,
  CrownIcon,
  DollarIcon,
  DumbbellIcon,
  FileTextIcon,
  FlagIcon,
  GamepadIcon,
  GlobeIcon,
  GraduationCapIcon,
  HammerIcon,
  HeartHandshakeIcon,
  HeartPulseIcon,
  KeyboardIcon,
  LaptopIcon,
  LockIcon,
  MapPinIcon,
  MicIcon,
  MonitorIcon,
  PiggyBankIcon,
  PlaneIcon,
  RocketIcon,
  SparklesIcon,
  SprayCanIcon,
  StarIcon,
  TicketIcon,
  TreesIcon,
  TrendingUpIcon,
  TwitterIcon,
  UserCogIcon,
  UserIcon,
  UsersIcon,
  VideoIcon,
  WrenchIcon,
  ZapIcon,
} from '../ui/icons';

const CATEGORIES: { id: ActionCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'SKILL', label: 'Skill', icon: <BookOpenIcon size={20} /> },
  { id: 'WORK', label: 'Work', icon: <BriefcaseIcon size={20} /> },
  { id: 'NETWORK', label: 'Network', icon: <UsersIcon size={20} /> },
  { id: 'RECOVER', label: 'Recover', icon: <CoffeeIcon size={20} /> },
  { id: 'INVEST', label: 'Invest', icon: <PiggyBankIcon size={20} /> },
];

const ACTION_ICONS: Record<string, React.ReactNode> = {
  // SKILL actions
  read_docs: <FileTextIcon size={32} />,
  tutorial: <VideoIcon size={32} />,
  course_paid: <LaptopIcon size={32} />,
  bootcamp: <GraduationCapIcon size={32} />,
  side_project: <RocketIcon size={32} />,
  master_degree: <GraduationCapIcon size={32} />,

  // WORK actions - Universal
  apply_job: <BriefcaseIcon size={32} />,
  find_freelance: <GlobeIcon size={32} />,

  // WORK actions - Hustler
  gig_fix: <WrenchIcon size={32} />,
  gig_build: <HammerIcon size={32} />,
  hustle_portfolio: <StarIcon size={32} />,
  hustle_invoice: <DollarIcon size={32} />,
  hustle_proposal: <FileTextIcon size={32} />,

  // WORK actions - Corporate L1
  corp_ticket: <TicketIcon size={32} />,
  corp_standup: <UsersIcon size={32} />,
  corp_code_review: <CodeIcon size={32} />,
  corp_oncall: <ClockIcon size={32} />,

  // WORK actions - Corporate Management
  corp_lead: <FlagIcon size={32} />,
  meetings: <CalendarCheckIcon size={32} />,
  mgmt_1on1: <UserCogIcon size={32} />,
  mgmt_perf_review: <UserIcon size={32} />,
  mgmt_roadmap: <TrendingUpIcon size={32} />,

  // WORK actions - Corporate IC
  ic_architecture: <BuildingIcon size={32} />,
  ic_tech_talk: <MicIcon size={32} />,
  ic_rfc: <FileTextIcon size={32} />,

  // WORK actions - Hustler Business
  agency_pitch: <CrownIcon size={32} />,
  agency_hire: <UsersIcon size={32} />,
  agency_sponsor: <DollarIcon size={32} />,

  // WORK actions - Hustler Specialist
  specialist_retainer: <FileTextIcon size={32} />,
  specialist_audit: <CodeIcon size={32} />,
  specialist_workshop: <GraduationCapIcon size={32} />,

  // NETWORK actions
  tweet: <TwitterIcon size={32} />,
  meetup: <MapPinIcon size={32} />,
  conference: <MicIcon size={32} />,
  mentor: <HeartHandshakeIcon size={32} />,

  // RECOVER actions
  sleep: <BedIcon size={32} />,
  touch_grass: <TreesIcon size={32} />,
  gaming: <GamepadIcon size={32} />,
  vacation: <PlaneIcon size={32} />,
  therapy: <BrainCogIcon size={32} />,

  // INVEST actions
  buy_keyboard: <KeyboardIcon size={32} />,
  sub_copilot: <SparklesIcon size={32} />,
  buy_chair: <ArmchairIcon size={32} />,
  upgrade_pc: <MonitorIcon size={32} />,
  hire_cleaner: <SprayCanIcon size={32} />,
  home_gym: <DumbbellIcon size={32} />,
};

const getActionIcon = (actionId: string): React.ReactNode => {
  return ACTION_ICONS[actionId] ?? <CodeIcon size={32} />;
};

export function ActionDeck() {
  const [activeCategory, setActiveCategory] = useState<ActionCategory>('SKILL');
  const { career, flags } = useGameStore();

  // Filter actions based on job requirements, student status, and purchased investments
  const availableActions = useMemo(
    () => filterActionsForJob(ACTIONS, { career, flags, purchasedInvestments: flags.purchasedInvestments }),
    [career, flags],
  );

  const categoryActions = availableActions.filter(action => action.category === activeCategory);

  return (
    <div className="flex flex-col h-full bg-[#0D1117]">
      <div className="shrink-0 flex border-b border-[#30363D]">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
            }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 text-xs font-medium transition-colors ${
              activeCategory === cat.id
                ? 'text-[#39D353] border-b-2 border-[#39D353] bg-[#39D353]/5'
                : 'text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="shrink-0 px-4 py-3 bg-[#161B22]">
        <h3 className="text-[#39D353] text-xs font-bold uppercase flex items-center gap-2">
          ⚡ {activeCategory} ACTIONS
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {categoryActions.map(action => (
            <ActionCard key={action.id} action={action} />
          ))}
        </div>

        {categoryActions.length === 0 && (
          <div className="text-center text-[#8B949E] py-8">
            <p className="text-sm">No actions available</p>
            <p className="text-xs mt-1">Level up to unlock more</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionCard({ action }: { action: GameAction }) {
  const [isHovered, setIsHovered] = useState(false);
  const { resources, performAction } = useGameStore();

  const canAffordEnergy = resources.energy >= action.energyCost;
  const canAffordMoney = resources.money >= action.moneyCost;
  const isLocked = !canAffordEnergy || !canAffordMoney;

  const handleClick = () => {
    if (isLocked) return;
    performAction(action.id);
  };

  // Build categorized cost/gain effects for the hover tooltip
  const { costs, gains } = useMemo(() => {
    const costs: { icon: React.ReactNode; text: string }[] = [];
    const gains: { icon: React.ReactNode; text: string; color: string }[] = [];
    const r = action.rewards;

    // --- Costs: resources spent + negative effects ---
    if (action.energyCost > 0) costs.push({ icon: <ZapIcon size={11} />, text: `-${action.energyCost}` });
    if (action.moneyCost > 0) costs.push({ icon: <DollarIcon size={11} />, text: `-$${action.moneyCost}` });
    if (r.stress && r.stress > 0) costs.push({ icon: <HeartPulseIcon size={11} />, text: `+${r.stress}` });

    // --- Gains: resources earned + positive effects ---
    if (action.energyGain && action.energyGain > 0)
      gains.push({ icon: <ZapIcon size={11} />, text: `+${action.energyGain}`, color: 'text-[#39D353]' });
    if (r.skill && r.skill > 0)
      gains.push({ icon: <CodeIcon size={11} />, text: `+${r.skill}`, color: 'text-[#39D353]' });
    if (r.xp && r.xp > 0) gains.push({ icon: <StarIcon size={11} />, text: `+${r.xp}`, color: 'text-[#A371F7]' });
    if (r.money && r.money > 0)
      gains.push({ icon: <DollarIcon size={11} />, text: `+$${r.money}`, color: 'text-[#FFA657]' });
    if (r.reputation && r.reputation > 0)
      gains.push({ icon: <UsersIcon size={11} />, text: `+${r.reputation}`, color: 'text-[#58A6FF]' });
    if (r.corporate && r.corporate > 0)
      gains.push({ icon: <BriefcaseIcon size={11} />, text: `+${r.corporate}`, color: 'text-[#58A6FF]' });
    if (r.freelance && r.freelance > 0)
      gains.push({ icon: <GlobeIcon size={11} />, text: `+${r.freelance}`, color: 'text-[#58A6FF]' });
    if (r.politics && r.politics > 0)
      gains.push({ icon: <FlagIcon size={11} />, text: `+${r.politics}`, color: 'text-[#8B949E]' });
    if (r.fulfillment && r.fulfillment > 0)
      gains.push({ icon: <HeartHandshakeIcon size={11} />, text: `+${r.fulfillment}`, color: 'text-[#F778BA]' });
    if (r.stress && r.stress < 0)
      gains.push({ icon: <HeartPulseIcon size={11} />, text: `${r.stress}`, color: 'text-[#39D353]' });

    return { costs, gains };
  }, [action]);

  const hasDuration = action.duration !== undefined;
  const hasBuff = !!action.passiveBuff;

  return (
    <div
      className={`relative rounded-lg overflow-hidden transition-all duration-300 cursor-pointer
        ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}
        ${isHovered && !isLocked ? 'scale-105 shadow-[0_0_25px_rgba(57,211,83,0.3)]' : ''}
      `}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onClick={handleClick}
    >
      <div
        className={`relative bg-[#161B22] border rounded-lg p-4 h-32 flex flex-col items-center justify-center gap-2 transition-all duration-300
          ${isHovered && !isLocked ? 'border-[#39D353]' : 'border-[#30363D]'}
        `}
      >
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0D1117]/60 z-10">
            <LockIcon size={24} className="text-[#8B949E]" />
          </div>
        )}

        <div className={`text-[#8B949E] transition-colors ${isHovered && !isLocked ? 'text-[#39D353]' : ''}`}>
          {getActionIcon(action.id)}
        </div>

        <span className="text-xs font-medium text-center text-[#C9D1D9] line-clamp-2">{action.label}</span>
      </div>

      {isHovered && !isLocked && (
        <div className="absolute inset-0 bg-[#0D1117]/95 backdrop-blur-sm rounded-lg p-2.5 flex flex-col animate-fade-in border border-[#39D353]">
          <h4 className="text-[#39D353] text-[11px] font-bold truncate">{action.label}</h4>

          <div className="mt-auto space-y-1.5">
            {(costs.length > 0 || gains.length > 0) && (
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                {costs.map((c, i) => (
                  <span key={`c${i}`} className="flex items-center gap-0.5 text-[11px] text-[#FF7B72]">
                    {c.icon}
                    {c.text}
                  </span>
                ))}
                {gains.map((g, i) => (
                  <span key={`g${i}`} className={`flex items-center gap-0.5 text-[11px] ${g.color}`}>
                    {g.icon}
                    {g.text}
                  </span>
                ))}
              </div>
            )}

            {/* Footer: Duration + Passive Buff */}
            {(hasDuration || hasBuff) && (
              <div className="flex items-center gap-2 pt-1 border-t border-[#30363D]/50">
                {hasDuration && (
                  <span className="flex items-center gap-0.5 text-[10px] text-[#8B949E]">
                    <ClockIcon size={10} />
                    {action.duration}w
                  </span>
                )}
                {hasBuff && (
                  <span
                    className="flex items-center gap-0.5 text-[10px] text-[#58A6FF] truncate"
                    title={action.passiveBuff!.description}
                  >
                    <SparklesIcon size={10} />
                    {action.passiveBuff!.description}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getFlavorText(action: GameAction): string {
  const flavorTexts: Record<string, string> = {
    read_docs: 'RTFM. The timeless wisdom of developers.',
    tutorial: 'Learn by watching others do it first.',
    course_paid: 'Will you actually finish it this time?',
    bootcamp: 'Two days of caffeine-fueled enlightenment.',
    side_project: 'The project that will definitely be finished.',
    master_degree: "Because a Bachelor's wasn't enough debt.",
    gig_fix: 'Quick bug fix for beer money.',
    gig_build: 'A "simple" project that\'s never simple.',
    sleep: 'The most underrated productivity hack.',
    coffee: 'Liquid motivation in a cup.',
    meetup: 'Network with fellow keyboard warriors.',
    invest: 'Plant seeds for future gains.',
  };

  return flavorTexts[action.id] || `Execute ${action.label.toLowerCase()} action.`;
}
