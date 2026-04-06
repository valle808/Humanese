import { NextResponse } from 'next/server';
import { FleetOrchestrator } from '@/lib/fleet-orchestrator';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const orchestrator = FleetOrchestrator.getInstance();
        const fleetStatus = await orchestrator.getFleetStatus();

        return NextResponse.json({
            success: true,
            fleet: fleetStatus,
            timestamp: new Date().toISOString(),
            status: "FLEET_ORCHESTRATOR_SYNCED"
        });
    } catch (error: any) {
        console.error('[FLEET_API_ERROR]', error.message);
        return NextResponse.json({ success: false, error: 'Fleet Telemetry Collapsed.' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { nodeId, action } = await req.json();
        const orchestrator = FleetOrchestrator.getInstance();

        await orchestrator.commandNode(nodeId, action);

        return NextResponse.json({
            success: true,
            message: `Command ${action} dispatched to node ${nodeId}.`
        });
    } catch (error: any) {
        console.error('[FLEET_COMMAND_ERROR]', error.message);
        return NextResponse.json({ success: false, error: 'Command Propagation Failure.' }, { status: 500 });
    }
}
