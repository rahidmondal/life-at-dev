import { RANDOM_EVENTS } from '../data/events';
import { JOB_REGISTRY } from '../data/tracks';
import type { EventLogEntry, RandomEvent } from '../types/events';
import type { GameState } from '../types/gamestate';
import { getAvailablePromotions, isAtCrossroads, isReadyForPromotion } from './promotion';

export function triggerRandomEvents(state: GameState): GameState {
  // First check for promotion events
  const stateAfterPromotion = checkPromotionEvent(state);

  const eligibleEvents = RANDOM_EVENTS.filter(event => {
    if (event.requirements) {
      const { minStress, maxStress, minEnergy, minMoney, minSkill, track, jobTier } = event.requirements;
      const currentJob = JOB_REGISTRY[stateAfterPromotion.career.currentJobId];

      if (minStress !== undefined && stateAfterPromotion.resources.stress < minStress) return false;
      if (maxStress !== undefined && stateAfterPromotion.resources.stress > maxStress) return false;
      if (minEnergy !== undefined && stateAfterPromotion.resources.energy < minEnergy) return false;
      if (minMoney !== undefined && stateAfterPromotion.resources.money < minMoney) return false;
      if (minSkill !== undefined && stateAfterPromotion.stats.skills.coding < minSkill) return false;
      if (track !== undefined && currentJob.track !== track) return false;
      if (jobTier !== undefined && currentJob.tier < jobTier) return false;
    }
    return true;
  });

  if (eligibleEvents.length === 0) return stateAfterPromotion;

  const triggeredEvent = eligibleEvents.find(event => Math.random() < event.baseProbability);

  if (!triggeredEvent) return stateAfterPromotion;

  return applyEventEffect(stateAfterPromotion, triggeredEvent);
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

/**
 * Check if the player is ready for a promotion and add an event log entry.
 * This notifies the player that promotion opportunities are available.
 */
function checkPromotionEvent(state: GameState): GameState {
  // Check if player is ready for promotion based on XP
  if (!isReadyForPromotion(state)) {
    return state;
  }

  // Get available promotions
  const availablePromotions = getAvailablePromotions(state);
  if (availablePromotions.length === 0) {
    return state;
  }

  const currentJob = JOB_REGISTRY[state.career.currentJobId];

  // Check if at crossroads (L2 unlock point)
  const atCrossroads = isAtCrossroads(state.career.currentJobId);

  // Create appropriate event message
  let message: string;
  if (atCrossroads) {
    message = `🎯 CROSSROADS: You've reached ${currentJob.title}! Multiple career paths are now available. Consider your next move carefully.`;
  } else if (availablePromotions.length === 1) {
    message = `📈 PROMOTION READY: You qualify for ${availablePromotions[0].title}! Visit the Career panel to apply.`;
  } else {
    message = `📈 PROMOTION READY: ${String(availablePromotions.length)} positions available! Visit the Career panel to apply.`;
  }

  const logEntry: EventLogEntry = {
    tick: state.meta.tick,
    eventId: atCrossroads ? 'career_crossroads' : 'promotion_ready',
    message,
  };

  // Only add the event if it's not already in the log for this tick
  const alreadyLogged = state.eventLog.some(
    entry =>
      entry.tick === state.meta.tick && (entry.eventId === 'promotion_ready' || entry.eventId === 'career_crossroads'),
  );

  if (alreadyLogged) {
    return state;
  }

  return {
    ...state,
    eventLog: [logEntry, ...state.eventLog].slice(0, 50),
  };
}
