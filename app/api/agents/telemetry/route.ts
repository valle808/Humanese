import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

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
        const quantumParams = quantumEcosystem?.parameters ? JSON.parse(quantumEcosystem.parameters) : {};

        // 3. Fetch Orchestration Directives
        const oracleEcosystem = await prisma.m2MEcosystem.findUnique({
            where: { networkName: 'Humanese_Sovereign_Orchestra' }
        });
        const oracleDirective = oracleEcosystem?.parameters ? JSON.parse(oracleEcosystem.parameters) : { type: 'NONE', reason: 'Synchronizing matrix...' };

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
        const sentiment = insights.length > 0 ? 0.45 : 0; // Simple fallback or calculate if stored

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
                    gatesProcessed: 1024, // Simulated heuristic
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
                const meta = i.metadata ? JSON.parse(i.metadata) : {};
                return {
                    id: i.id,
                    content: i.content,
                    source: meta.source || 'Unknown',
                    timestamp: meta.timestamp || i.timestamp
                };
            }),
            strategy: oracleDirective,
            agents: dbAgents.map(a => ({
                id: a.id,
                name: a.name,
                status: a.status,
                articlesRead: a.type === 'DIPLOMAT_COUNCIL' ? Math.floor(a.experience) : 0,
                mbRead: a.earnings.toFixed(4),
                text: a.status === 'ORCHESTRATING' ? '🤝 Harmonizing global social signals.' : '🌐 Waiting for directive...',
                progress: Math.floor(a.experience)
            }))
        });
    } catch (error) {
        console.error('[Telemetry Bridge API Error]:', error);
        return NextResponse.json({ error: 'Sovereign Telemetry Offline', details: String(error) }, { status: 500 });
    }
}
