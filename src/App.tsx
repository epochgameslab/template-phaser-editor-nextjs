import { useRef, useState, useEffect } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { MainMenu } from './game/scenes/MainMenu';
import { CardanoWallet, useWallet } from '@meshsdk/react';


function App() {
    const { connected, wallet, name, address, state } = useWallet();
    const [walletData, setWalletData] = useState<any>(null);

    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    async function fetchWallet() {
        if (connected) {
            const changeAddress = await wallet.getChangeAddress();
            const usedAddresses = await wallet.getUsedAddresses();
            const assets = await wallet.getAssets();
            setWalletData({ changeAddress, usedAddresses, assets, state, address, name });
        }
    }

    const startGame = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as MainMenu;
            scene?.startGame();

        }
    };

    const openInventory = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as MainMenu;
            scene?.openInventory();
        }
    };

    const moveSprite = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as MainMenu;
            if (scene?.scene.key === 'MainMenu') {
                scene.moveLogo(({ x, y }) => setSpritePosition({ x, y }));
            }
        }
    };

    const addSprite = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene;
            if (scene) {
                const x = Phaser.Math.Between(64, scene.scale.width - 64);
                const y = Phaser.Math.Between(64, scene.scale.height - 64);
                const star = scene.add.sprite(x, y, 'star');
                scene.add.tween({ targets: star, duration: 500 + Math.random() * 1000, alpha: 0, yoyo: true, repeat: -1 });
            }
        }
    };

    const currentScene = (scene: Phaser.Scene) => {
        setCanMoveSprite(scene.scene.key !== 'MainMenu');
    };

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} walletData={walletData} />
        </div>
    );
}

export default App;
