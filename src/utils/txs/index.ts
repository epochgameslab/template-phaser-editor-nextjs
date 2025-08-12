import { Asset, BlockfrostProvider, BrowserWallet, MeshTxBuilder } from "@meshsdk/core";

export async function txSendAssets(
    walletData: any,
    address: string = 'addr_test1qztnpjxsvwk6yerhxpxedn58wekml5qx0ggwtvewu9rg9er9xq7wq7ege9s48pv5h6at3g0kcscc950j9xkgye3krmuqgr3fx2',
    assets: Asset[] = [{ unit: "lovelace", quantity: '1000000' }],
) {
    console.log('sending assets!');
    if (walletData) {
        console.log('wallet data');
        const wallet: BrowserWallet = await BrowserWallet.enable(walletData.name);
        const provider = new BlockfrostProvider('previewnlOU2CAlXSLV0nKHBWp0hueoT1ppyRoo');

        const utxos = await wallet.getUtxos();
        const changeAddress = await wallet.getChangeAddress();

        const txBuilder = new MeshTxBuilder({
            fetcher: provider, // get a provider https://meshjs.dev/providers
            verbose: true,
        });

        const unsignedTx = await txBuilder
            .txOut(
                address,                
                assets)
            .changeAddress(changeAddress)
            .selectUtxosFrom(utxos)
            .complete();

        try {
            const signedTx = await wallet.signTx(unsignedTx);
            return await wallet.submitTx(signedTx);
        }catch {
            console.log('transaction canceled');
        }
    }
}