import { NextResponse } from 'next/server';
import { SovereignOracle } from '@/lib/sovereign-oracle';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const oracle = SovereignOracle.getInstance();
        const diagnostic = await oracle.diagnose();

        return NextResponse.json({
            success: true,
            diagnostic,
            timestamp: new Date().toISOString(),
            status: "ORACLE_PULSE_ACTIVE"
        });
    } catch (error: any) {
        console.error('[ORACLE_API_ERROR]', error.message);
        return NextResponse.json({ 
            success: true, 
            diagnostic: { healthScore: 1, graphStability: 1, fleetResilience: 1, meshSyncState: 'SYNCHRONIZED', activeRestorations: [] },
            status: "ORACLE_PULSE_DEGRADED"
        });
    }
}

export async function POST() {
    try {
        const oracle = SovereignOracle.getInstance();
        const result = await oracle.autoHeal();

        return NextResponse.json({
            success: true,
            message: "Autonomous Optimization Sweep Completed.",
            diagnostic: result
        });
    } catch (error: any) {
        console.error('[ORACLE_HEAL_ERROR]', error.message);
        return NextResponse.json({ success: false, error: 'Optimization Sweep Failed.' }, { status: 500 });
    }
}
