import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './game/main';
import { EventBus } from './game/EventBus';

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface IProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
  walletData?: { changeAddress: string; usedAddresses: string[] };
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame(
  { currentActiveScene, walletData },
  ref
) {
  const gameRef = useRef<Phaser.Game | null>(null);

  // Initialize Phaser Game
  useLayoutEffect(() => {
    if (!gameRef.current) {
      gameRef.current = StartGame('game-container', walletData);

      if (typeof ref === 'function') {
        ref({ game: gameRef.current, scene: null });
      } else if (ref) {
        ref.current = { game: gameRef.current, scene: null };
      }
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [ref, walletData]);

  // Handle current scene ready event
  useEffect(() => {
    const handler = (scene_instance: Phaser.Scene) => {
      if (currentActiveScene) currentActiveScene(scene_instance);

      if (typeof ref === 'function') {
        ref({ game: gameRef.current, scene: scene_instance });
      } else if (ref) {
        ref.current = { game: gameRef.current, scene: scene_instance };
      }
    };

    EventBus.on('current-scene-ready', handler);

    return () => {
      EventBus.off('current-scene-ready', handler);
    };
  }, [currentActiveScene, ref]);

  return <div id="game-container"></div>;
});
