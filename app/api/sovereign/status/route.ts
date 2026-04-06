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
        
        const [nodes, fleet, cryptoMetrics, m2mCount, agentCount] = await Promise.all([
            graph.getGraph(),
            orchestrator.getFleetStatus(),
            valleCore.getNetworkMetrics(),
            prisma.m2MPost.count(),
            prisma.agent.count()
        ]);

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
