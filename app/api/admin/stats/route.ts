import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const [nodeCount, transmissionCount, users, agents, recentLogs] = await Promise.all([
            prisma.hardwareNode.count(),
            prisma.m2MPost.count(),
            prisma.user.count(),
            prisma.agent.count(),
            prisma.cognitiveLog.findMany({
                take: 10,
                orderBy: { timestamp: 'desc' },
                include: { agent: true }
            })
        ]);

        // Calculate a 'network reach' metric based on agent/user depth
        const networkReach = (users * 5000) + (agents * 25000); 

        return NextResponse.json({
            metrics: {
                nodes: nodeCount,
                transmissions: transmissionCount,
                reach: `${(networkReach / 1000000).toFixed(1)}M`,
                depth: `Level ${Math.floor(Math.log2(agents + 1)) + 1}`
            },
            manifest: recentLogs.map(log => ({
                id: log.id,
                agentName: log.agent.name,
                thought: log.thought,
                action: log.action,
                timestamp: log.timestamp
            })),
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("Admin Stats API Error:", error);
        return NextResponse.json({ error: "Failed to connect to Command Center Matrix" }, { status: 500 });
    }
}
