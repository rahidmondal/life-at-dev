import { GameActionType } from '@/context/gameReducer';
import { ACTIONS } from '@/data/actions';
import { GameAction, GameStats } from '@/types/game';

export function executeAction(
  action: GameAction,
  currentStats: GameStats,
  dispatch: React.Dispatch<GameActionType>,
): void {
  const randomizedReward = { ...action.reward };

  if (action.id === 'freelance-gig') {
    const base = 500;
    const skillFactor = currentStats.coding * 0.4 + currentStats.reputation * 0.6;
    const variance = 0.85 + Math.random() * 0.3;
    const payout = Math.floor((base + skillFactor) * variance);
    randomizedReward.money = Math.max(400, payout);
  }

  if (action.id === 'coffee-binge' && currentStats.energy < 30) {
    randomizedReward.energy = action.reward.energy + 5;
  }

  dispatch({
    type: 'PERFORM_ACTION',
    payload: {
      action,
      randomizedReward,
    },
  });

  if (currentStats.weeks - action.cost.weeks <= 0) {
    setTimeout(() => {
      dispatch({ type: 'YEAR_END_REVIEW' });
    }, 100);
  }
}

export function getActionById(id: string): GameAction | undefined {
  return ACTIONS.find(action => action.id === id);
}

export function getActionsByCategory(category: 'work' | 'shop' | 'invest'): GameAction[] {
  return ACTIONS.filter(action => action.category === category);
}
