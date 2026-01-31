import type { RandomEvent } from '../types/events';

export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 'viral_tweet',
    title: 'Viral Tweet',
    description: 'You posted a hot take that actually resonated with the community. RIP notifications.',
    category: 'NETWORK',
    baseProbability: 0.05,
    effect: {
      xp: { reputation: 50 },
      resources: { fulfillment: 10 },
      message: 'Your clout increases significantly!',
    },
  },
  {
    id: 'shadowbanned',
    title: 'Shadowbanned',
    description: 'The algorithm decided your latest post was too "controversial".',
    category: 'NETWORK',
    baseProbability: 0.03,
    effect: {
      xp: { reputation: -10 },
      resources: { stress: 5 },
      message: 'Engagement drops. It feels a bit lonely.',
    },
  },
  {
    id: 'legacy_bug',
    title: 'Ghost of Legacy Past',
    description: 'A bug you "fixed" three months ago just took down production.',
    category: 'WORK',
    baseProbability: 0.08,
    requirements: { jobTier: 1 },
    effect: {
      resources: { stress: 20, energy: -10 },
      skills: { coding: 5 },
      message: 'You spent half the week on a post-mortem.',
    },
  },
  {
    id: 'headhunter_call',
    title: 'Unsolicited LinkedIn DM',
    description: 'A headhunter from a big tech firm reached out. "Your profile is impressive!"',
    category: 'OPPORTUNITY',
    baseProbability: 0.04,
    requirements: { minSkill: 2000 },
    effect: {
      resources: { fulfillment: 5 },
      message: 'Validation feels good, even if it is just a template.',
    },
  },
  {
    id: 'burnout_warning',
    title: 'The Wall',
    description: 'You find yourself staring at a blank IDE for four hours straight.',
    category: 'HARDSHIP',
    baseProbability: 0.1,
    requirements: { minStress: 80 },
    effect: {
      resources: { energy: -20, fulfillment: -10 },
      message: 'Productivity has ground to a halt.',
    },
  },
  {
    id: 'imposter_syndrome',
    title: 'Imposter Syndrome',
    description: "You read a 19-year-old's blog post about writing a compiler in CSS.",
    category: 'HARDSHIP',
    baseProbability: 0.07,
    effect: {
      resources: { stress: 15, fulfillment: -5 },
      message: '"Am I even a developer?"',
    },
  },
  {
    id: 'coffee_machine_broke',
    title: 'The Disaster',
    description: 'The office coffee machine is broken. There is only herbal tea left.',
    category: 'LIFE',
    baseProbability: 0.02,
    effect: {
      resources: { energy: -15, stress: 5 },
      message: 'Morale is at an all-time low.',
    },
  },
];

export const EVENTS_REGISTRY: Record<string, RandomEvent> = Object.fromEntries(
  RANDOM_EVENTS.map(event => [event.id, event]),
);
