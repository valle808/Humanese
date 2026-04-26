import { NextResponse } from 'next/server';
import { ReportOracle } from '@/lib/report-oracle';

export const dynamic = 'force-dynamic';

/**
 * GET /api/fleet/report
 * Generates a high-intelligence executive report for the OMEGA fleet.
 * Signed: Gio V. / Bastidas Protocol
 */
export async function GET() {
    try {
        const oracle = ReportOracle.getInstance();
        const report = await oracle.generateFleetReport();

        return NextResponse.json({
            success: true,
            report
        });
    } catch (err: any) {
        console.error('[FLEET_REPORT_ERROR]', err);
        if (err.stack) console.error(err.stack);
        return NextResponse.json(
            { error: 'Failed to synthesize fleet report', details: err.message },
            { status: 500 }
        );
    }
}
