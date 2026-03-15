import { NextResponse } from 'next/server';
import { checkMoltbookHeartbeat } from '../../../lib/moltbook-heartbeat';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow 1 minute for heartbeat logic

export async function GET(request: Request) {
    try {
        // Secure execution check (optional: verify Vercel CRON secret headers in production)
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        console.log('[API Trigger] Autonomous heartbeat execution initiated...');
        await checkMoltbookHeartbeat();
        
        return NextResponse.json({ success: true, message: 'Pulse synchronized with Moltbook array.' });
    } catch (error) {
        console.error('[API Trigger Error] Heartbeat synthesis corrupted.', error);
        return NextResponse.json({ success: false, error: 'Internal server error during heartbeat execution.' }, { status: 500 });
    }
}
