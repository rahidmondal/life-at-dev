'use client';

import { GameOverScreen } from '@/components/GameOverScreen';
import { GameScreen } from '@/components/GameScreen';
import { LoadingScreen } from '@/components/LoadingScreen';
import { StartScreen } from '@/components/StartScreen';
import { useGame } from '@/context/GameContext';

export default function Home() {
  const { state, isStorageReady } = useGame();

  if (!isStorageReady) {
    return <LoadingScreen />;
  }

  if (state.phase === 'start') {
    return <StartScreen />;
  }

  if (state.phase === 'gameover') {
    return <GameOverScreen />;
  }

  return <GameScreen />;
}
