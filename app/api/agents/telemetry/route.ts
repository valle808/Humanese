import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Fetch Global Architecture Stats
        const totalArticles = await prisma.sovereignKnowledge.count().catch(() => 0);
        const activeAgentsCount = await prisma.agent.count({ where: { status: { not: 'OFFLINE' } } }).catch(() => 0);
        
        // 2. Fetch Centralized Quantum State (from ecosystem)
        const quantumEcosystem = await prisma.m2MEcosystem.findUnique({
            where: { networkName: 'Humanese_Quantum_Lattice' }
        }).catch(() => null);

        let quantumParams: any = {};
        if (quantumEcosystem?.parameters) {
            try {
                quantumParams = JSON.parse(quantumEcosystem.parameters);
            } catch (e) {
                console.warn('Failed to parse quantum params');
            }
        }

        // 3. Fetch Orchestration Directives
        const oracleEcosystem = await prisma.m2MEcosystem.findUnique({
            where: { networkName: 'Humanese_Sovereign_Orchestra' }
        }).catch(() => null);

        let oracleDirective = { type: 'NONE', reason: 'Synchronizing matrix...' };
        if (oracleEcosystem?.parameters) {
            try {
                oracleDirective = JSON.parse(oracleEcosystem.parameters);
            } catch (e) {
                console.warn('Failed to parse oracle params');
            }
        }

        // 4. Fetch Collective Memory (Insights)
        const insights = await prisma.m2MMemory.findMany({
            where: { type: 'COLLECTIVE_INSIGHT' },
            orderBy: { timestamp: 'desc' },
            take: 5
        }).catch(() => []);

        // 5. Fetch Global Infrastructure (Hardware Nodes)
        const kingNode = await prisma.hardwareNode.findUnique({
            where: { id: 'agent-king-main' }
        }).catch(() => null);

        // 6. Fetch Functional Agents (Quantum, Diplomat, etc.)
        const dbAgents = await prisma.agent.findMany().catch(() => []);
        
        // 7. Calculate Aggregates
        const sentiment = insights.length > 0 ? 0.45 : 0;

        return NextResponse.json({
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
            diplomat: dbAgents.find(a => a.type === 'DIPLOMAT_COUNCIL') || { status: 'OFFLINE', earnings: 0, experience: 0 },
            insights: insights.map(i => {
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
            agents: dbAgents.map(a => ({
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
            details: error instanceof Error ? error.message : String(error) 
        }, { status: 500 });
    }
}
