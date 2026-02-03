import { ACTIONS_REGISTRY } from '../data/actions';
import { JOB_REGISTRY } from '../data/tracks';
import type { GameState } from '../types/gamestate';
import { hasMissedPayment, makeDebtPayment, processWeeklyDebt } from './debt';
import { triggerRandomEvents } from './events';
import { calculateBurnoutRisk, calculateDecay, calculateDiminishingGrowth } from './mechanics';
import { advanceTime, calculateResourceDelta } from './time';

const ROLE_DISPLACEMENT: Record<number, number> = {
  0: 0.2,
  1: 0.3,
  2: 0.4,
  3: 0.6,
  4: 0.75,
  5: 0.9,
  6: 1.0,
};

const RESOURCE_BOUNDS = {
  energy: { min: 0, max: 100 },
  stress: { min: 0, max: 100 },
  fulfillment: { min: 0, max: 10000 },
} as const;

export function processTurn(state: GameState, actionId: string): GameState {
  if (!(actionId in ACTIONS_REGISTRY)) {
    throw new Error(`Action with ID "${actionId}" not found in ACTIONS_REGISTRY`);
  }

  const action = ACTIONS_REGISTRY[actionId];

  if (state.resources.money < action.moneyCost) {
    throw new Error('Insufficient money');
  }

  if (state.resources.energy < action.energyCost) {
    throw new Error('Insufficient energy');
  }

  const currentJob = JOB_REGISTRY[state.career.currentJobId];
  const weeks = Math.max(0, action.duration ?? 0);

  let money = state.resources.money - action.moneyCost;
  let energy = calculateResourceDelta(
    state.resources.energy,
    -action.energyCost,
    RESOURCE_BOUNDS.energy.min,
    RESOURCE_BOUNDS.energy.max,
  );

  if (action.energyGain) {
    energy = calculateResourceDelta(energy, action.energyGain, RESOURCE_BOUNDS.energy.min, RESOURCE_BOUNDS.energy.max);
  }

  const stress = calculateResourceDelta(
    state.resources.stress,
    action.rewards.stress ?? 0,
    RESOURCE_BOUNDS.stress.min,
    RESOURCE_BOUNDS.stress.max,
  );

  const fulfillment = calculateResourceDelta(
    state.resources.fulfillment,
    action.rewards.fulfillment ?? 0,
    RESOURCE_BOUNDS.fulfillment.min,
    RESOURCE_BOUNDS.fulfillment.max,
  );

  let coding = state.stats.skills.coding;
  let politics = state.stats.skills.politics;
  let corporate = state.stats.xp.corporate;
  let freelance = state.stats.xp.freelance;
  let reputation = state.stats.xp.reputation;

  if (weeks > 0) {
    const roleDisplacement = currentJob.roleDisplacement ?? ROLE_DISPLACEMENT[currentJob.tier];

    coding = Math.max(0, coding - calculateDecay(coding, roleDisplacement) * weeks);
    politics = Math.max(0, politics - calculateDecay(politics, roleDisplacement) * weeks);

    if (currentJob.weeklyGains) {
      if (currentJob.weeklyGains.coding) {
        coding += calculateDiminishingGrowth(coding, currentJob.weeklyGains.coding * weeks);
      }

      if (currentJob.weeklyGains.politics) {
        politics += calculateDiminishingGrowth(politics, currentJob.weeklyGains.politics * weeks);
      }

      corporate += (currentJob.weeklyGains.corporate ?? 0) * weeks;
      freelance += (currentJob.weeklyGains.freelance ?? 0) * weeks;
      reputation += (currentJob.weeklyGains.reputation ?? 0) * weeks;
    }

    money += (currentJob.salary / 52) * weeks;
  }

  if (action.rewards.skill) {
    coding += calculateDiminishingGrowth(coding, action.rewards.skill);
  }

  if (action.rewards.politics) {
    politics += calculateDiminishingGrowth(politics, action.rewards.politics);
  }

  if (action.rewards.corporate) {
    corporate += action.rewards.corporate;
  }

  if (action.rewards.freelance) {
    freelance += action.rewards.freelance;
  }

  if (action.rewards.reputation) {
    reputation += action.rewards.reputation;
  }

  if (action.rewards.money) {
    money += action.rewards.money;
  }

  const debtResult = processWeeklyDebt({
    ...state,
    meta: advanceTime(state.meta, weeks),
  });

  let finalDebt = debtResult.newDebt;
  let debtStressPenalty = debtResult.stressPenalty;

  if (debtResult.debtPayment > 0) {
    if (hasMissedPayment(money, debtResult.debtPayment)) {
      debtStressPenalty += 5;
    } else {
      money -= debtResult.debtPayment;
      finalDebt = makeDebtPayment(finalDebt, debtResult.debtPayment);
    }
  }

  const meta = advanceTime(state.meta, weeks);
  const isBurnedOut = calculateBurnoutRisk(stress + debtStressPenalty, energy);

  const finalEnergy = Math.round(energy);
  const finalStress = Math.round(
    calculateResourceDelta(stress + debtStressPenalty, 0, RESOURCE_BOUNDS.stress.min, RESOURCE_BOUNDS.stress.max),
  );
  const finalMoney = money;
  const finalCoding = Math.floor(coding);

  const deltaEnergy = finalEnergy - state.resources.energy;
  const deltaStress = finalStress - state.resources.stress;
  const deltaMoney = finalMoney - state.resources.money;
  const deltaSkill = finalCoding - state.stats.skills.coding;

  const deltaFragments: string[] = [];
  if (deltaSkill !== 0) {
    deltaFragments.push(`${deltaSkill >= 0 ? '+' : ''}${deltaSkill.toString()} Skill`);
  }
  if (deltaEnergy !== 0) {
    deltaFragments.push(`${deltaEnergy >= 0 ? '+' : ''}${deltaEnergy.toString()} Energy`);
  }
  if (deltaStress !== 0) {
    deltaFragments.push(`${deltaStress >= 0 ? '+' : ''}${deltaStress.toString()} Stress`);
  }
  if (deltaMoney !== 0) {
    deltaFragments.push(`${deltaMoney >= 0 ? '+' : ''}$${Math.abs(Math.round(deltaMoney)).toString()}`);
  }

  const deltaSummary = deltaFragments.length > 0 ? deltaFragments.join(', ') : 'No changes';

  const eventIdSuffix = action.category === 'WORK' ? 'work' : 'success';
  const actionLogEntry = {
    tick: state.meta.tick,
    eventId: `action_${actionId}_${eventIdSuffix}`,
    message: `Executing ${action.label}... COMPLETE. ${deltaSummary}.`,
  };

  const newState = {
    ...state,
    meta,
    resources: {
      energy: finalEnergy,
      stress: finalStress,
      money: finalMoney,
      debt: finalDebt,
      fulfillment: Math.round(fulfillment),
    },
    stats: {
      skills: {
        coding: finalCoding,
        politics: Math.floor(politics),
      },
      xp: {
        corporate: Math.floor(corporate),
        freelance: Math.floor(freelance),
        reputation: Math.floor(reputation),
      },
    },
    flags: {
      ...state.flags,
      isBurnedOut,
    },
    eventLog: [...state.eventLog, actionLogEntry],
  };

  return triggerRandomEvents(newState);
}
