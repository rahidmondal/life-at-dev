/**
 * buffs.ts - Passive Buff System
 *
 * Manages the acquisition and application of passive buffs from INVEST actions.
 * Buffs provide permanent (or recurring) modifiers to various game stats.
 *
 * Buff Types:
 * - skill: Modifies skill gain rate
 * - stress: Modifies stress accumulation from work
 * - energy: Modifies max/restore energy
 * - recovery: Modifies recovery action efficiency
 * - xp: Modifies XP gain rate
 */

import type { ActiveBuff } from '../types/resources';

/**
 * Buff modifier targets for categorizing which calculations to affect.
 */
export type BuffTarget = 'skill' | 'stress' | 'energy' | 'recovery' | 'xp';

/**
 * Get all active buffs for a specific stat.
 */
export function getBuffsForStat(activeBuffs: ActiveBuff[] | undefined, stat: BuffTarget): ActiveBuff[] {
  if (!activeBuffs || activeBuffs.length === 0) return [];
  return activeBuffs.filter(buff => buff.stat === stat);
}

/**
 * Calculate the combined multiplier for a stat from all active buffs.
 * Multipliers are multiplicative (0.9 * 1.1 = 0.99).
 * Returns 1.0 if no multiplier buffs are active.
 */
export function getCombinedMultiplier(activeBuffs: ActiveBuff[] | undefined, stat: BuffTarget): number {
  if (!activeBuffs || activeBuffs.length === 0) return 1.0;
  const multiplierBuffs = activeBuffs.filter(buff => buff.stat === stat && buff.type === 'multiplier');

  if (multiplierBuffs.length === 0) return 1.0;

  return multiplierBuffs.reduce((acc, buff) => acc * buff.value, 1.0);
}

/**
 * Calculate the combined flat bonus for a stat from all active buffs.
 * Flat bonuses are additive (+5 + +3 = +8).
 * Returns 0 if no flat buffs are active.
 */
export function getCombinedFlatBonus(activeBuffs: ActiveBuff[] | undefined, stat: BuffTarget): number {
  if (!activeBuffs || activeBuffs.length === 0) return 0;
  const flatBuffs = activeBuffs.filter(buff => buff.stat === stat && buff.type === 'flat');

  if (flatBuffs.length === 0) return 0;

  return flatBuffs.reduce((acc, buff) => acc + buff.value, 0);
}

/**
 * Apply skill buffs to a base skill gain value.
 * Formula: (baseGain * multiplier) + flatBonus
 */
export function applySkillBuffs(activeBuffs: ActiveBuff[] | undefined, baseGain: number): number {
  const multiplier = getCombinedMultiplier(activeBuffs, 'skill');
  const flatBonus = getCombinedFlatBonus(activeBuffs, 'skill');

  return baseGain * multiplier + flatBonus;
}

/**
 * Apply stress buffs to a base stress change value.
 * For stress reduction buffs (multiplier < 1), this reduces stress gain from work.
 * Formula: baseStress * multiplier + flatBonus
 */
export function applyStressBuffs(activeBuffs: ActiveBuff[] | undefined, baseStress: number): number {
  // Only apply reduction buffs to positive stress (stress gain)
  if (baseStress <= 0) return baseStress;

  const multiplier = getCombinedMultiplier(activeBuffs, 'stress');
  const flatBonus = getCombinedFlatBonus(activeBuffs, 'stress');

  return Math.max(0, baseStress * multiplier + flatBonus);
}

/**
 * Apply energy buffs to get bonus energy per week.
 * This adds to the weekly energy restoration.
 */
export function applyEnergyBuffs(activeBuffs: ActiveBuff[] | undefined): number {
  // Energy buffs only provide flat bonuses (extra energy per week)
  return getCombinedFlatBonus(activeBuffs, 'energy');
}

/**
 * Apply recovery buffs to a base recovery value.
 * Formula: baseRecovery * multiplier + flatBonus
 */
export function applyRecoveryBuffs(activeBuffs: ActiveBuff[] | undefined, baseRecovery: number): number {
  const multiplier = getCombinedMultiplier(activeBuffs, 'recovery');
  const flatBonus = getCombinedFlatBonus(activeBuffs, 'recovery');

  return baseRecovery * multiplier + flatBonus;
}

/**
 * Apply XP buffs to a base XP gain value.
 * Formula: (baseXP * multiplier) + flatBonus
 */
export function applyXPBuffs(activeBuffs: ActiveBuff[] | undefined, baseXP: number): number {
  const multiplier = getCombinedMultiplier(activeBuffs, 'xp');
  const flatBonus = getCombinedFlatBonus(activeBuffs, 'xp');

  return baseXP * multiplier + flatBonus;
}

/**
 * Calculate total weekly cost of all recurring buffs.
 */
export function calculateRecurringBuffCosts(activeBuffs: ActiveBuff[] | undefined): number {
  if (!activeBuffs || activeBuffs.length === 0) return 0;
  return activeBuffs.filter(buff => buff.isRecurring).reduce((total, buff) => total + (buff.weeklyCost ?? 0), 0);
}

/**
 * Remove recurring buffs that can no longer be afforded.
 * Returns the updated buff list and total cost that was saved.
 */
export function removeUnaffordableRecurringBuffs(
  activeBuffs: ActiveBuff[] | undefined,
  availableMoney: number,
): { buffs: ActiveBuff[]; savedCost: number } {
  if (!activeBuffs || activeBuffs.length === 0) return { buffs: [], savedCost: 0 };

  const recurringBuffs = activeBuffs.filter(buff => buff.isRecurring);
  const nonRecurringBuffs = activeBuffs.filter(buff => !buff.isRecurring);

  let remainingMoney = availableMoney;
  const affordableRecurring: ActiveBuff[] = [];
  let savedCost = 0;

  // Sort by cost (cheapest first to maximize kept buffs)
  const sortedRecurring = [...recurringBuffs].sort((a, b) => (a.weeklyCost ?? 0) - (b.weeklyCost ?? 0));

  for (const buff of sortedRecurring) {
    const cost = buff.weeklyCost ?? 0;
    if (remainingMoney >= cost) {
      remainingMoney -= cost;
      affordableRecurring.push(buff);
    } else {
      savedCost += cost;
    }
  }

  return {
    buffs: [...nonRecurringBuffs, ...affordableRecurring],
    savedCost,
  };
}

/**
 * Check if a one-time investment has already been purchased.
 */
export function hasAlreadyPurchased(purchasedInvestments: string[] | undefined, actionId: string): boolean {
  if (!purchasedInvestments) return false;
  return purchasedInvestments.includes(actionId);
}

/**
 * Get a human-readable summary of all active buffs.
 */
export function getBuffSummary(activeBuffs: ActiveBuff[] | undefined): string[] {
  if (!activeBuffs || activeBuffs.length === 0) return [];
  return activeBuffs.map(buff => {
    const prefix = buff.isRecurring ? '🔄 ' : '✓ ';
    return `${prefix}${buff.description}`;
  });
}

/**
 * Count buffs by category for UI display.
 */
export function countBuffsByCategory(activeBuffs: ActiveBuff[] | undefined): Record<BuffTarget, number> {
  const counts: Record<BuffTarget, number> = {
    skill: 0,
    stress: 0,
    energy: 0,
    recovery: 0,
    xp: 0,
  };

  if (!activeBuffs) return counts;

  for (const buff of activeBuffs) {
    counts[buff.stat]++;
  }

  return counts;
}
