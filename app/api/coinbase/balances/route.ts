import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { Coinbase } from '@coinbase/coinbase-sdk';

// Configure CDP from env
const API_KEY_NAME = process.env.CDP_API_KEY_NAME;
const API_PRIVATE_KEY = process.env.CDP_API_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (API_KEY_NAME && API_PRIVATE_KEY) {
    try {
        Coinbase.configure({ apiKeyName: API_KEY_NAME, privateKey: API_PRIVATE_KEY });
    } catch (e) {
        console.error('[CDP] Configuration failed:', e);
    }
}

export async function GET() {
    const solTreasury = 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL';
    
    let solBalance = 0;
    let coinbaseAssets: any[] = [];

    try {
        // 1. Fetch Solana Treasury
        const connection = new Connection('https://api.mainnet-beta.solana.com');
        const pubKey = new PublicKey(solTreasury);
        solBalance = await connection.getBalance(pubKey) / 1e9;
    } catch (e) {
        console.warn('[Solana] Sync failed, using 0');
    }

    try {
        // 2. Fetch Coinbase Managed Balances (CDP)
        if (API_KEY_NAME && API_PRIVATE_KEY) {
            const accounts = await (Coinbase as any).rest?.Account?.listAccounts() || [];
            coinbaseAssets = accounts.map((acc: any) => {
                const data = acc.getModel ? acc.getModel() : acc;
                return {
                    currency: data.currency || 'USD',
                    balance: data.available_balance?.value || '0',
                    name: data.name || (data.currency + ' Account')
                };
            });
        } else {
            // Fallback for demo/dev if keys not set
            coinbaseAssets = [
                { currency: 'BTC', balance: '2.50', name: 'BTC Wallet' },
                { currency: 'USDC', balance: '125000.00', name: 'USDC Wallet' }
            ];
        }
    } catch (e) {
        console.error('[CDP] Fetch failed:', e);
    }

    return NextResponse.json({
        onChain: {
            sol: { address: solTreasury, balance: solBalance, unit: 'SOL' },
            valle: { balance: 2500, unit: 'VALLE' }, // Native fixed for now until contract deploy
            eth: { balance: 3.45, unit: 'ETH' } // Simulation
        },
        coinbase: coinbaseAssets,
        timestamp: new Date().toISOString()
    });
}
