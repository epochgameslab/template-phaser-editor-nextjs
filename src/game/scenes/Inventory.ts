import { AppWallet, BrowserWallet, MeshTxBuilder, BlockfrostProvider } from '@meshsdk/core';
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Inventory extends Phaser.Scene {

	constructor() {
		super("Inventory");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// background
		const background = this.add.image(511, 383, "background");
		background.alpha = 0.5;

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	async create() {

		this.editorCreate();

		const walletData = this.registry.get("walletData");

		if (walletData) {
			console.log("Assets in wallet", walletData.assets);

			const wallet: BrowserWallet = await BrowserWallet.enable(walletData.name);
			const ada = await wallet.getLovelace();
			console.log(ada);


			const provider = new BlockfrostProvider('previewnlOU2CAlXSLV0nKHBWp0hueoT1ppyRoo');

			const assets = await wallet.getAssets();
			const changeAddress = await wallet.getChangeAddress();
			const items = [];

			//  Create 8 cards and push them into an array

			for (var i = 0; i < assets.length; i++) {
				items.push(this.add.sprite(0, 0, 'star'));
			}

			Phaser.Actions.GridAlign(items, {
				width: 4,
				height: (assets.length / 4),
				cellWidth: 150,
				cellHeight: 200,
				x: 100,
				y: 100
			});

			// const txBuilder = new MeshTxBuilder({
			// 	fetcher: provider, // get a provider https://meshjs.dev/providers
			// 	verbose: true,
			// });

			// const unsignedTx = await txBuilder
			// 	.txOut('addr_test1qztnpjxsvwk6yerhxpxedn58wekml5qx0ggwtvewu9rg9er9xq7wq7ege9s48pv5h6at3g0kcscc950j9xkgye3krmuqgr3fx2', [{ unit: "lovelace", quantity: '1000000' }])
			// 	.changeAddress(changeAddress)
			// 	.selectUtxosFrom(utxos)
			// 	.complete();

			// const signedTx = await wallet.signTx(unsignedTx);
			// const txHash = await wallet.submitTx(signedTx);

		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
