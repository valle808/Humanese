import { NextResponse } from 'next/server';
import { primeMiner } from '../../../lib/agents/miner';
import { solanaEngine } from '../../../lib/solana-revenue';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow up to 5 minutes for complex mining abstractions

export async function GET(request: Request) {
    try {
        if (process.env.CRON_SECRET && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
             return new NextResponse('Unauthorized', { status: 401 });
        }

        console.log('[API Trigger] Autonomous Miner sequence initiated...');
        
        // 1. Scan Yields
        const yields = await solanaEngine.discoverYieldOpportunities();
        if (yields.length > 0) {
           await solanaEngine.executeStrategy(yields[0].protocol);
        }

        // 2. Miner Abstractions (Targeting 3CJre...)
        await primeMiner.scanExternalStructures();
        await primeMiner.launchOperation('BTC');
        await primeMiner.launchOperation('VALLE');

        return NextResponse.json({ success: true, message: 'Miner operations scheduled and hashing.' });
    } catch (error) {
        console.error('[API Trigger Error] Miner sequence corrupted.', error);
        return NextResponse.json({ success: false, error: 'Internal server error during mining routine.' }, { status: 500 });
    }
}
