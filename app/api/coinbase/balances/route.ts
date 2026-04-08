import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { Coinbase } from '@coinbase/coinbase-sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    let valleBalance = 0;
    let coinbaseAssets: any[] = [];

    // 1. Fetch REAL Solana Treasury balance
    try {
        const connection = new Connection('https://api.mainnet-beta.solana.com');
        const pubKey = new PublicKey(solTreasury);
        solBalance = await connection.getBalance(pubKey) / 1e9;
    } catch (e) {
        console.warn('[Solana] Sync failed, balance remains 0');
    }

    // 2. Fetch REAL VALLE balance from database (sum of confirmed mining rewards)
    try {
        const aggregate = await prisma.transaction.aggregate({
            where: { type: 'MINING_REWARD', status: 'CONFIRMED' },
            _sum: { amount: true }
        });
        valleBalance = aggregate._sum.amount || 0;
    } catch (e) {
        console.warn('[VALLE] DB query failed, balance remains 0');
    }

    // 3. Fetch REAL Coinbase Managed Balances (CDP) — NO FALLBACK MOCKS
    try {
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
        }
        // No else — if keys are missing, coinbaseAssets stays empty. Zero simulation.
    } catch (e) {
        console.error('[CDP] Fetch failed:', e);
    }

    return NextResponse.json({
        bank_name: 'SOVEREIGN_CENTRAL_BANK',
        authorized_by: 'GIO_V',
        status: 'OPERATIONAL',
        onChain: {
            sol: { address: solTreasury, balance: solBalance, unit: 'SOL' },
            valle: { balance: valleBalance, unit: 'VALLE' },
            btc: { balance: 0, unit: 'BTC' } // Target vault for Bitcoin storage
        },
        coinbase: coinbaseAssets,
        timestamp: new Date().toISOString()
    });
}
