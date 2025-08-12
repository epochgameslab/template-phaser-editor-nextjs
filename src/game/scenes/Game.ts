/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { EventBus } from '../EventBus';
import { txSendAssets } from '@/utils/txs';
/* END-USER-IMPORTS */

export default class Game extends Phaser.Scene {
	constructor() {
		super("Game");

		/* START-USER-CTR-CODE */
		// Write your code here.

		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {
		// background
		const background = this.add.image(511, 384, "background");
		background.alpha = 0.5;

		this.events.emit("scene-awake");

	}

	/* START-USER-CODE */

	// Write your code here

	create() {
		this.editorCreate();

		this.cameras.main.setBackgroundColor(0x00ff00);
		const walletData = this.registry.get("walletData");
		const registry = this.registry;
		registry.set('sendAddress', 'addr_test1qztnpjxsvwk6yerhxpxedn58wekml5qx0ggwtvewu9rg9er9xq7wq7ege9s48pv5h6at3g0kcscc950j9xkgye3krmuqgr3fx2');

		const input = document.createElement('input');
		input.type = 'text';
		input.placeholder = 'Enter your address';
		input.style.position = 'absolute';
		input.style.color = 'black'
		input.style.left = '100px';
		input.style.top = '100px';
		document.body.appendChild(input);




		// Listen for enter key or blur
		input.addEventListener('change', () => {
			EventBus.emit('update-address', input.value);
		});

		EventBus.on('update-address', async function (address: string) {
			registry.set('sendAddress', address);
		});

		EventBus.on('mint', async function (data: string) {
			if (walletData) {
				const txHash = await txSendAssets(walletData, registry.get('sendAddress'), [{ unit: "lovelace", quantity: '5000000' }]);
				console.log(`Tx Hash: ${txHash}`);
			}
		});

		EventBus.emit('current-scene-ready', this);
	}

	changeScene() {
		this.scene.start('GameOver');
	}

	/* END-USER-CODE */
}
/* END OF COMPILED CODE */

// You can write more code here
