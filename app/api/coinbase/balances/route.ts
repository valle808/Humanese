import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

export async function GET() {
    const solTreasury = 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL';
    const btcTreasury = '3CJreF7LD8Heu8zh9MsigedRuNq4y6eujh'; // Simulation for BTC

    try {
        const connection = new Connection('https://api.mainnet-beta.solana.com');
        const pubKey = new PublicKey(solTreasury);
        const balance = await connection.getBalance(pubKey);
        
        return NextResponse.json({
            sol: {
                address: solTreasury,
                balance: balance / 1e9, // Lamports to SOL
                unit: 'SOL'
            },
            btc: {
                address: btcTreasury,
                balance: 0.0042, // Simulated BTC balance for now
                unit: 'BTC'
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[API /api/coinbase/balances] On-Chain Sync Failed:', error);
        return NextResponse.json({ error: 'On-Chain Link Offline' }, { status: 500 });
    }
}
