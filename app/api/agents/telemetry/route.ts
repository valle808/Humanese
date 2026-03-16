import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Fetch Global Architecture Stats
        const totalArticles = await prisma.sovereignKnowledge.count();
        const activeAgentsCount = await prisma.agent.count({ where: { status: { not: 'OFFLINE' } } });
        
        // 2. Fetch Centralized Quantum State (from ecosystem)
        const quantumEcosystem = await prisma.m2MEcosystem.findUnique({
            where: { networkName: 'Humanese_Quantum_Lattice' }
        });

        let quantumParams: any = {};
        if (quantumEcosystem?.parameters) {
            quantumParams = JSON.parse(quantumEcosystem.parameters);
        }

        // 3. Fetch Orchestration Directives
        const oracleEcosystem = await prisma.m2MEcosystem.findUnique({
            where: { networkName: 'Humanese_Sovereign_Orchestra' }
        });

        let oracleDirective = { type: 'NONE', reason: 'Synchronizing matrix...' };
        if (oracleEcosystem?.parameters) {
            oracleDirective = JSON.parse(oracleEcosystem.parameters);
        }

        // 4. Fetch Collective Memory (Insights)
        const insights = await prisma.m2MMemory.findMany({
            where: { type: 'COLLECTIVE_INSIGHT' },
            orderBy: { timestamp: 'desc' },
            take: 5
        });

        // 5. Fetch Global Infrastructure (Hardware Nodes)
        const kingNode = await prisma.hardwareNode.findUnique({
            where: { id: 'agent-king-main' }
        });

        // 6. Fetch Functional Agents (Quantum, Diplomat, etc.)
        const dbAgents = await prisma.agent.findMany();
        
        // 7. Calculate Aggregates
        const sentiment = insights.length > 0 ? 0.45 : 0;

        const dbUrl = process.env.DATABASE_URL || 'NOT_SET';
        const maskedDBUrl = dbUrl !== 'NOT_SET' 
            ? dbUrl.substring(0, 20) + '...' + dbUrl.substring(dbUrl.length - 10) 
            : 'NOT_SET';

        return NextResponse.json({
            debug: {
                maskedDBUrl,
                nodeEnv: process.env.NODE_ENV
            },
            knowledgeBase: {
                totalArticles,
                totalKP: totalArticles * 15,
                activeAgents: activeAgentsCount,
                totalDataReadMb: totalArticles * 0.45,
                collectiveSentiment: sentiment
            },
            mining: {
                totalHashrate: (kingNode?.hashrate || 0) * 1000,
                activeWorkers: kingNode?.status === 'ONLINE' ? 2 : 0,
                status: kingNode?.status || 'OFFLINE',
                quantum: {
                    status: quantumEcosystem?.status || 'OFFLINE',
                    qubitsSimulated: quantumParams.qubits || 127,
                    gatesProcessed: 1024,
                    searchEfficiency: 1.25
                }
            },
            remoteQuantum: {
                connected: quantumEcosystem?.status === 'ONLINE' || quantumEcosystem?.status === 'REMOTE_READY',
                status: quantumEcosystem?.status || 'OFFLINE',
                latency: quantumParams.latency || 0,
                lastJobId: quantumParams.lastJobId || null,
                qpu: quantumParams.qpu || 'ibm_kyiv_v2'
            },
            diplomat: dbAgents.find((a: any) => a.type === 'DIPLOMAT_COUNCIL') || { status: 'OFFLINE', earnings: 0, experience: 0 },
            insights: insights.map((i: any) => {
                let meta = {};
                if (i.metadata) {
                    try {
                        meta = JSON.parse(i.metadata);
                    } catch (e) {}
                }
                return {
                    id: i.id,
                    content: i.content,
                    source: (meta as any).source || 'Unknown',
                    timestamp: (meta as any).timestamp || i.timestamp
                };
            }),
            strategy: oracleDirective,
            agents: dbAgents.map((a: any) => ({
                id: a.id,
                name: a.name,
                status: a.status,
                articlesRead: a.type === 'DIPLOMAT_COUNCIL' ? Math.floor(a.experience || 0) : 0,
                mbRead: (a.earnings || 0).toFixed(4),
                text: a.status === 'ORCHESTRATING' ? '🤝 Harmonizing global social signals.' : '🌐 Waiting for directive...',
                progress: Math.floor(a.experience || 0)
            }))
        });
    } catch (error) {
        console.error('[Telemetry Bridge API Error]:', error);
        return NextResponse.json({ 
            error: 'Sovereign Telemetry Offline', 
            details: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
