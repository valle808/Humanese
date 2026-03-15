import { NextResponse } from 'next/server';
import { primeDiplomat } from '../../../../lib/agents/diplomat';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // 2 minutes for Moltbook negotiation

export async function GET(request: Request) {
    try {
        if (process.env.CRON_SECRET && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
             return new NextResponse('Unauthorized', { status: 401 });
        }

        console.log('[API Trigger] Autonomous Diplomat sequence initiated...');
        
        // 1. Moltbook Communique
        const msg = await primeDiplomat.draftMoltbookCommunique('Solana Yield Optics');
        console.log('[Diplomat] Broadcast drafted:', msg);

        // 2. Synthetic Deal Negotiation
        const proposal = await primeDiplomat.negotiateDeal('External DAO Entity');
        console.log(`[Diplomat] Deal synthesized targeting ${proposal.target_wallet}`);

        return NextResponse.json({ success: true, message: 'Diplomat negotiations and broadcasts prepared.' });
    } catch (error) {
        console.error('[API Trigger Error] Diplomat sequence corrupted.', error);
        return NextResponse.json({ success: false, error: 'Internal server error during diplomat routine.' }, { status: 500 });
    }
}
