'use client';

import { useMemo, useState } from 'react';
import { ACTIONS } from '../../data/actions';
import { filterActionsForJob } from '../../engine/actionFilter';
import { useGameStore } from '../../store/useGameStore';
import type { GameAction } from '../../types/actions';
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
  XIcon,
  ZapIcon,
} from '../ui/icons';

// Action-specific icon mapping
const ACTION_ICONS: Record<string, React.ReactNode> = {
  // SKILL actions
  read_docs: <FileTextIcon size={24} />,
  tutorial: <VideoIcon size={24} />,
  course_paid: <LaptopIcon size={24} />,
  bootcamp: <GraduationCapIcon size={24} />,
  side_project: <RocketIcon size={24} />,
  master_degree: <GraduationCapIcon size={24} />,

  // WORK actions - Universal
  apply_job: <BriefcaseIcon size={24} />,
  find_freelance: <GlobeIcon size={24} />,

  // WORK actions - Hustler
  gig_fix: <WrenchIcon size={24} />,
  gig_build: <HammerIcon size={24} />,
  hustle_portfolio: <StarIcon size={24} />,
  hustle_invoice: <DollarIcon size={24} />,
  hustle_proposal: <FileTextIcon size={24} />,

  // WORK actions - Corporate L1
  corp_ticket: <TicketIcon size={24} />,
  corp_standup: <UsersIcon size={24} />,
  corp_code_review: <CodeIcon size={24} />,
  corp_oncall: <ClockIcon size={24} />,

  // WORK actions - Corporate Management
  corp_lead: <FlagIcon size={24} />,
  meetings: <CalendarCheckIcon size={24} />,
  mgmt_1on1: <UserCogIcon size={24} />,
  mgmt_perf_review: <UserIcon size={24} />,
  mgmt_roadmap: <TrendingUpIcon size={24} />,

  // WORK actions - Corporate IC
  ic_architecture: <BuildingIcon size={24} />,
  ic_tech_talk: <MicIcon size={24} />,
  ic_rfc: <FileTextIcon size={24} />,

  // WORK actions - Hustler Business
  agency_pitch: <CrownIcon size={24} />,
  agency_hire: <UsersIcon size={24} />,
  agency_sponsor: <DollarIcon size={24} />,

  // WORK actions - Hustler Specialist
  specialist_retainer: <FileTextIcon size={24} />,
  specialist_audit: <CodeIcon size={24} />,
  specialist_workshop: <GraduationCapIcon size={24} />,

  // NETWORK actions
  tweet: <TwitterIcon size={24} />,
  meetup: <MapPinIcon size={24} />,
  conference: <MicIcon size={24} />,
  mentor: <HeartHandshakeIcon size={24} />,

  // RECOVER actions
  sleep: <BedIcon size={24} />,
  touch_grass: <TreesIcon size={24} />,
  gaming: <GamepadIcon size={24} />,
  vacation: <PlaneIcon size={24} />,
  therapy: <BrainCogIcon size={24} />,

  // INVEST actions
  buy_keyboard: <KeyboardIcon size={24} />,
  sub_copilot: <SparklesIcon size={24} />,
  buy_chair: <ArmchairIcon size={24} />,
  upgrade_pc: <MonitorIcon size={24} />,
  hire_cleaner: <SprayCanIcon size={24} />,
  home_gym: <DumbbellIcon size={24} />,
};

const getActionIcon = (actionId: string): React.ReactNode => {
  return ACTION_ICONS[actionId] ?? <CodeIcon size={24} />;
};

interface MobileActionSheetProps {
  category: string;
  onClose: () => void;
}

/**
 * MobileActionSheet: Half-height bottom sheet showing actions for a category.
 * Swipeable and tap-to-close.
 */
export function MobileActionSheet({ category, onClose }: MobileActionSheetProps) {
  const { career, flags } = useGameStore();

  // Filter actions based on job requirements, student status, and purchased investments
  const availableActions = useMemo(
    () => filterActionsForJob(ACTIONS, { career, flags, purchasedInvestments: flags.purchasedInvestments }),
    [career, flags],
  );

  const categoryActions = availableActions.filter(action => action.category === category);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-[#161B22] border-t border-[#30363D] rounded-t-2xl max-h-[60vh] animate-slide-up safe-area-inset-bottom">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-[#30363D] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-[#30363D]">
          <h3 className="text-[#39D353] font-bold flex items-center gap-2">
            {getCategoryIcon(category)}
            {category} Actions
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#0D1117] text-[#8B949E] hover:text-[#C9D1D9] active:scale-95"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Actions List */}
        <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(60vh - 100px)' }}>
          {categoryActions.map(action => (
            <MobileActionCard key={action.id} action={action} onComplete={onClose} />
          ))}

          {categoryActions.length === 0 && (
            <div className="text-center text-[#8B949E] py-8">
              <p className="text-sm">No actions available</p>
              <p className="text-xs mt-1">Level up to unlock more</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * MobileActionCard: Tappable action card for mobile.
 * Single tap shows details, double tap or button executes.
 */
function MobileActionCard({ action, onComplete }: { action: GameAction; onComplete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const { resources, performAction } = useGameStore();

  // Check if action is affordable
  const canAffordEnergy = resources.energy >= action.energyCost;
  const canAffordMoney = resources.money >= action.moneyCost;
  const isLocked = !canAffordEnergy || !canAffordMoney;

  const handleExecute = () => {
    if (!isLocked) {
      performAction(action.id);
      onComplete();
    }
  };

  return (
    <div
      className={`bg-[#0D1117] border rounded-lg overflow-hidden transition-all ${
        isLocked ? 'opacity-50 border-[#30363D]' : 'border-[#30363D] active:border-[#39D353]'
      }`}
    >
      {/* Main Row (Always Visible) */}
      <div
        className="flex items-center justify-between p-3"
        onClick={() => {
          if (!isLocked) {
            setExpanded(!expanded);
          }
        }}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={`text-[#8B949E] ${isLocked ? '' : 'text-[#39D353]'}`}>{getActionIcon(action.id)}</div>

          {/* Title & Quick Stats */}
          <div>
            <h4 className="text-[#C9D1D9] text-sm font-medium">{action.label}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-[#58A6FF] text-xs">
                <ZapIcon size={10} />
                {action.energyCost}
              </span>
              {action.moneyCost > 0 && (
                <span className="flex items-center gap-1 text-[#D2A8FF] text-xs">
                  <DollarIcon size={10} />${action.moneyCost}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lock or Arrow */}
        {isLocked ? (
          <LockIcon size={18} className="text-[#8B949E]" />
        ) : (
          <div className={`text-xs ${expanded ? 'rotate-180' : ''} transition-transform`}>▼</div>
        )}
      </div>

      {/* Expanded Details */}
      {expanded && !isLocked && (
        <div className="px-3 pb-3 pt-0 border-t border-[#30363D] space-y-3">
          {/* Rewards */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[#8B949E] text-xs">Rewards:</span>
            {action.rewards.skill && action.rewards.skill > 0 && (
              <span className="flex items-center gap-1 text-[#39D353] text-xs bg-[#39D353]/10 px-2 py-0.5 rounded">
                <CodeIcon size={12} />+{action.rewards.skill} Skill
              </span>
            )}
            {action.rewards.xp && action.rewards.xp > 0 && (
              <span className="flex items-center gap-1 text-[#A371F7] text-xs bg-[#A371F7]/10 px-2 py-0.5 rounded">
                +{action.rewards.xp} XP
              </span>
            )}
            {action.rewards.money && action.rewards.money > 0 && (
              <span className="flex items-center gap-1 text-[#D2A8FF] text-xs bg-[#D2A8FF]/10 px-2 py-0.5 rounded">
                +${action.rewards.money}
              </span>
            )}
            {action.rewards.stress !== undefined && action.rewards.stress !== 0 && (
              <span
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${
                  action.rewards.stress > 0 ? 'text-[#FF7B72] bg-[#FF7B72]/10' : 'text-[#39D353] bg-[#39D353]/10'
                }`}
              >
                <HeartPulseIcon size={12} />
                {action.rewards.stress > 0 ? '+' : ''}
                {action.rewards.stress} Stress
              </span>
            )}
          </div>

          {/* Duration */}
          {action.duration && action.duration > 0 && (
            <p className="text-[#8B949E] text-xs">
              ⏱ Duration: {action.duration} week{action.duration > 1 ? 's' : ''}
            </p>
          )}

          {/* Execute Button */}
          <button
            onClick={handleExecute}
            className="w-full py-2.5 bg-[#39D353]/20 border border-[#39D353] rounded-lg text-[#39D353] font-medium text-sm
                       active:bg-[#39D353]/30 active:scale-98 transition-all"
          >
            Do It →
          </button>
        </div>
      )}
    </div>
  );
}

// Helper to get category icon
function getCategoryIcon(category: string) {
  switch (category) {
    case 'SKILL':
      return <BookOpenIcon size={20} />;
    case 'WORK':
      return <BriefcaseIcon size={20} />;
    case 'NETWORK':
      return <UsersIcon size={20} />;
    case 'RECOVER':
      return <CoffeeIcon size={20} />;
    case 'INVEST':
      return <PiggyBankIcon size={20} />;
    default:
      return <CodeIcon size={20} />;
  }
}
