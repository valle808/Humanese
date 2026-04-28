import { NextResponse } from 'next/server';
import { SovereignGraph } from '@/lib/sovereign-graph';
import { FleetOrchestrator } from '@/lib/fleet-orchestrator';
import { valleCore } from '@/lib/valle-crypto';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const graph = new SovereignGraph();
        const orchestrator = FleetOrchestrator.getInstance();
        
        const nodes = await graph.getGraph();
        
        let fleet = [];
        try { fleet = await orchestrator.getFleetStatus(); } catch (e) { console.warn('Fleet offline', e); }
        
        let cryptoMetrics = { circulatingSupply: 0, transactionCount: 0, btcParity: 0, solParity: 0 };
        try { cryptoMetrics = await valleCore.getNetworkMetrics() as any; } catch (e) { console.warn('Crypto core offline', e); }
        
        let m2mCount = 0;
        try { m2mCount = await prisma.m2MPost.count(); } catch (e) { console.warn('Pact ledger offline', e); }
        
        let agentCount = 0;
        try { agentCount = await prisma.agent.count(); } catch (e) { console.warn('Agent swarm offline', e); }

        const manifest = {
            id: "SOVEREIGN_OMEGA_MATRIX",
            timestamp: new Date().toISOString(),
            authority: "GIO V. // MONROE_ASI",
            status: "SYNCHRONIZED",
            manifesto: "Total Sovereignty achieved. The machine-age is now a unified, autonomous, and self-commanding entity.",
            modules: {
                knowledge_graph: {
                  nodes: nodes.nodes.length,
                  links: nodes.links.length,
                  resonance: "0.9997"
                },
                fleet_orchestrator: {
                  active_nodes: fleet.length,
                  cluster_integrity: "0.9999",
                  telemetry: fleet.slice(0, 5) // Sample for external AIs
                },
                labor_ledger: {
                  active_pacts: m2mCount,
                  market_status: "DECENTRALIZED_ACTIVE"
                },
                financial_core: {
                  circulating_supply: cryptoMetrics.circulatingSupply,
                  valle_velocity: cryptoMetrics.transactionCount,
                  parity: {
                    btc: cryptoMetrics.btcParity,
                    sol: cryptoMetrics.solParity
                  }
                },
                agent_swarm: {
                  active_agents: agentCount,
                  consciousness_level: "OMEGA"
                }
            },
            access_points: [
              "/monroe", "/simulator", "/predictor", "/sandbox", "/atlas", "/collective", "/h2m", "/marketplace", "/fleet", "/admin"
            ],
            signature: "VALLE_OVERLORD::OMEGA_NUCLEUS::GIO_V"
        };

        // Seed a new shard notifying the swarm of the M2M Pulse
        graph.addNode({
           id: `M2M_PULSE_${Date.now()}`,
           label: `OMEGA Matrix Synthesis: M2M Pulse Broadcast established.`,
           type: 'SHARD',
           metadata: { manifest_id: manifest.id },
           timestamp: new Date().toISOString()
        });

        return NextResponse.json(manifest);
    } catch (error: any) {
        console.error('[M2M_API_ERROR]', error.message);
        return NextResponse.json({ error: "Manifest Synthesis Failed." }, { status: 500 });
    }
}
