import { describe, expect, it, vi } from 'vitest';
import { RANDOM_EVENTS } from '../../data/events';
import { INITIAL_GAME_STATE } from '../../store/initialState';
import { triggerRandomEvents } from '../events';

describe('Random Events System', () => {
  it('should not trigger an event if no conditions are met', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1);

    const state = { ...INITIAL_GAME_STATE };
    const newState = triggerRandomEvents(state);

    expect(newState.eventLog.length).toBe(0);
    expect(newState).toEqual(state);

    vi.restoreAllMocks();
  });

  it('should trigger an event if conditions are met and roll succeeds', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const state = {
      ...INITIAL_GAME_STATE,
      meta: { ...INITIAL_GAME_STATE.meta, tick: 10 },
      resources: { ...INITIAL_GAME_STATE.resources, stress: 90 },
    };

    const newState = triggerRandomEvents(state);

    expect(newState.eventLog.length).toBeGreaterThan(0);
    expect(newState.eventLog[0].tick).toBe(10);

    vi.restoreAllMocks();
  });

  it('should apply event effects correctly', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const state = { ...INITIAL_GAME_STATE, resources: { ...INITIAL_GAME_STATE.resources, energy: 50, stress: 0 } };

    const newState = triggerRandomEvents(state);

    const logs = newState.eventLog;
    expect(logs.length).toBe(1);

    const triggeredEvent = RANDOM_EVENTS.find(e => e.id === logs[0].eventId);
    expect(triggeredEvent).toBeDefined();

    if (logs[0].eventId === 'coffee_machine_broke') {
      expect(newState.resources.energy).toBe(state.resources.energy - 15);
      expect(newState.resources.stress).toBe(state.resources.stress + 5);
    }

    vi.restoreAllMocks();
  });

  it('should not trigger events if requirements are not met', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const state = { ...INITIAL_GAME_STATE, resources: { ...INITIAL_GAME_STATE.resources, stress: 20 } };

    const newState = triggerRandomEvents(state);

    const containsBurnout = newState.eventLog.some(log => log.eventId === 'burnout_warning');
    expect(containsBurnout).toBe(false);

    vi.restoreAllMocks();
  });
});
