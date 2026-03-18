import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // 1. Load static hierarchy from registry
        // @ts-ignore
        const registry = await import('@/agents/core/registry.js');
        const getHierarchy = registry.getHierarchy || registry.default?.getHierarchy;
        
        if (!getHierarchy) {
             throw new Error("getHierarchy method not found on registry module");
        }

        const staticHierarchy = getHierarchy();
        
        // 2. Fetch real-time stats from Supabase
        const dbAgents = await prisma.agent.findMany();
        const dbStatsMap = new Map();
        dbAgents.forEach(agent => {
            dbStatsMap.set(agent.id, agent);
        });

        // 3. Hydrate static agents with DB metrics
        const hydratedAgents = staticHierarchy.agents.map((agent: any) => {
            const stats = dbStatsMap.get(agent.id);
            if (stats) {
                return {
                    ...agent,
                    balance: stats.balance || 0,
                    earnings: stats.earnings || 0,
                    experience: stats.experience || 0,
                    level: stats.level || 1,
                    status: stats.status || agent.status || 'IDLE',
                    lastPulse: stats.lastPulse
                };
            }
            return agent;
        });

        return NextResponse.json({
            ...staticHierarchy,
            agents: hydratedAgents,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('[API /agents/hierarchy] Error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
