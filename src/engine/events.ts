import { RANDOM_EVENTS } from '../data/events';
import { JOB_REGISTRY } from '../data/tracks';
import type { EventLogEntry, RandomEvent } from '../types/events';
import type { GameState } from '../types/gamestate';

export function triggerRandomEvents(state: GameState): GameState {
  const eligibleEvents = RANDOM_EVENTS.filter(event => {
    if (event.requirements) {
      const { minStress, maxStress, minEnergy, minMoney, minSkill, track, jobTier } = event.requirements;
      const currentJob = JOB_REGISTRY[state.career.currentJobId];

      if (minStress !== undefined && state.resources.stress < minStress) return false;
      if (maxStress !== undefined && state.resources.stress > maxStress) return false;
      if (minEnergy !== undefined && state.resources.energy < minEnergy) return false;
      if (minMoney !== undefined && state.resources.money < minMoney) return false;
      if (minSkill !== undefined && state.stats.skills.coding < minSkill) return false;
      if (track !== undefined && currentJob.track !== track) return false;
      if (jobTier !== undefined && currentJob.tier < jobTier) return false;
    }
    return true;
  });

  if (eligibleEvents.length === 0) return state;

  const triggeredEvent = eligibleEvents.find(event => Math.random() < event.baseProbability);

  if (!triggeredEvent) return state;

  return applyEventEffect(state, triggeredEvent);
}

function applyEventEffect(state: GameState, event: RandomEvent): GameState {
  const { effect } = event;
  const newResources = { ...state.resources };
  const newSkills = { ...state.stats.skills };
  const newXP = { ...state.stats.xp };

  if (effect.resources) {
    if (effect.resources.money) newResources.money += effect.resources.money;
    if (effect.resources.stress)
      newResources.stress = Math.max(0, Math.min(100, newResources.stress + effect.resources.stress));
    if (effect.resources.energy)
      newResources.energy = Math.max(0, Math.min(100, newResources.energy + effect.resources.energy));
    if (effect.resources.fulfillment)
      newResources.fulfillment = Math.max(0, Math.min(10000, newResources.fulfillment + effect.resources.fulfillment));
  }

  if (effect.skills) {
    if (effect.skills.coding) newSkills.coding = Math.max(0, Math.min(10000, newSkills.coding + effect.skills.coding));
    if (effect.skills.politics)
      newSkills.politics = Math.max(0, Math.min(10000, newSkills.politics + effect.skills.politics));
  }

  if (effect.xp) {
    if (effect.xp.corporate) newXP.corporate = Math.max(0, newXP.corporate + effect.xp.corporate);
    if (effect.xp.freelance) newXP.freelance = Math.max(0, newXP.freelance + effect.xp.freelance);
    if (effect.xp.reputation) newXP.reputation = Math.max(0, Math.min(10000, newXP.reputation + effect.xp.reputation));
  }

  const logEntry: EventLogEntry = {
    tick: state.meta.tick,
    eventId: event.id,
    message: effect.message,
  };

  return {
    ...state,
    resources: newResources,
    stats: {
      skills: newSkills,
      xp: newXP,
    },
    eventLog: [logEntry, ...state.eventLog].slice(0, 50),
  };
}
