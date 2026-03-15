import { NextResponse } from 'next/server';

/**
 * GET /api/coinbase/balances
 * Fetches real-time account balances from Coinbase CDP SDK
 */
export async function GET() {
    try {
        // Dynamic import to avoid build-time SDK issues if keys are missing
        const { getCoinbaseBalances } = await import('@/agents/finance/coinbase-accounts.js');
        const balances = await getCoinbaseBalances();
        
        return NextResponse.json({ success: true, balances });
    } catch (err) {
        console.error('[Coinbase API Route Error]', err);
        return NextResponse.json(
            { success: false, error: err instanceof Error ? err.message : String(err) },
            { status: 500 }
        );
    }
}
