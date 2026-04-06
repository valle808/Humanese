import { NextResponse } from 'next/server';
import { ReportOracle } from '@/lib/report-oracle';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { sandboxId } = await req.json();
        const oracle = ReportOracle.getInstance();
        const report = await oracle.generateReport(sandboxId || "GLOBAL_SANDBOX");

        return NextResponse.json({
            success: true,
            report,
            timestamp: new Date().toISOString(),
            status: "FORESIGHT_SYNTHESIZED"
        });
    } catch (error: any) {
        console.error('[REPORT_API_ERROR]', error.message);
        return NextResponse.json({ success: false, error: 'Foresight Synthesis Collapsed.' }, { status: 500 });
    }
}
