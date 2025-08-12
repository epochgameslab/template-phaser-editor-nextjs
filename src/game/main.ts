import Boot from './scenes/Boot';
import GameOver from './scenes/GameOver';
import MainGame from './scenes/Game';
import MainMenu from './scenes/MainMenu';
import Preloader from './scenes/Preloader';
import { AUTO, Game } from 'phaser';
import Inventory from './scenes/Inventory';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        Inventory,
    ]
};

const StartGame = (parent: string, walletData?: any) => {

    return new Game({
        ...config, callbacks: {
            postBoot: (game) => {
                if (walletData) {
                    game.registry.set("walletData", walletData);
                }
            }
        },
        parent
    });
}

export default StartGame;
