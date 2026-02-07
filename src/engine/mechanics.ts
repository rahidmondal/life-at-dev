const SKILL_CAP = 10000;
const BASE_DECAY_RATE = 0.02;
const BURNOUT_STRESS_THRESHOLD = 95;
const BURNOUT_ENERGY_THRESHOLD = 10;

export function calculateDiminishingGrowth(currentSkill: number, gain: number): number {
  const actualGain = gain * (SKILL_CAP / (SKILL_CAP + currentSkill));

  if (currentSkill + actualGain > SKILL_CAP) {
    return SKILL_CAP - currentSkill;
  }

  return actualGain;
}

export function calculateDecay(coreSkill: number, roleDisplacement: number): number {
  return coreSkill * BASE_DECAY_RATE * roleDisplacement;
}

export function calculateBurnoutRisk(stress: number, energy: number): boolean {
  return stress > BURNOUT_STRESS_THRESHOLD && energy < BURNOUT_ENERGY_THRESHOLD;
}

/**
 * Calculates the projected weekly skill change based on current skill, job displacement, and job gains.
 * This is used for UI feedback to show the player if they are gaining or losing skill.
 */
export function calculateProjectedSkillChange(
  currentSkill: number,
  roleDisplacement: number,
  weeklyJobGain: number,
): number {
  const decay = calculateDecay(currentSkill, roleDisplacement);
  const gain = calculateDiminishingGrowth(currentSkill, weeklyJobGain);
  return gain - decay;
}
