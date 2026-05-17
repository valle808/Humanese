import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Load static hierarchy from registry
    let staticHierarchy: any = { agents: [], tiers: [], metadata: {} };
    try {
      // @ts-ignore
      const registry = await import('@/agents/core/registry.js');
      const getHierarchy = registry.getHierarchy || registry.default?.getHierarchy;
      if (getHierarchy) staticHierarchy = getHierarchy();
    } catch (regErr) {
      console.warn('[hierarchy] Registry import failed, using DB only:', regErr);
    }

    // 2. Fetch real-time stats from DB
    let dbAgents: any[] = [];
    try {
      dbAgents = await prisma.agent.findMany({
        select: {
          id: true,
          name: true,
          type: true,
          role: true,
          status: true,
          balance: true,
          earnings: true,
          experience: true,
          level: true,
          lastPulse: true,
        }
      });
    } catch (dbErr) {
      console.warn('[hierarchy] DB agent query failed:', dbErr);
    }

    const dbStatsMap = new Map(dbAgents.map(a => [a.id, a]));

    // 3. If registry returned agents, hydrate them; otherwise use DB agents directly
    let finalAgents: any[];
    if (staticHierarchy.agents?.length > 0) {
      finalAgents = staticHierarchy.agents.map((agent: any) => {
        const stats = dbStatsMap.get(agent.id);
        if (stats) {
          return { ...agent, ...stats };
        }
        return agent;
      });
    } else {
      // Build hierarchy from DB agents directly
      finalAgents = dbAgents.map(a => ({
        id: a.id,
        name: a.name,
        type: a.type || 'INVESTIGATOR',
        role: a.role || 'agent',
        status: a.status || 'IDLE',
        balance: a.balance || 0,
        earnings: a.earnings || 0,
        experience: a.experience || 0,
        level: a.level || 1,
        lastPulse: a.lastPulse,
      }));
    }

    // 4. Compute aggregate stats
    const activeCount = finalAgents.filter(a => a.status === 'ACTIVE').length;
    const totalEarnings = finalAgents.reduce((s, a) => s + (a.earnings || 0), 0);
    const consensusScore = finalAgents.length > 0
      ? Math.round((activeCount / finalAgents.length) * 100)
      : 0;

    return NextResponse.json({
      ...staticHierarchy,
      agents: finalAgents,
      stats: {
        totalAgents: finalAgents.length,
        activeAgents: activeCount,
        totalEarnings,
        consensusScore,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[API /agents/hierarchy] Error:', error);
    // Return safe fallback
    return NextResponse.json({
      agents: [],
      stats: { totalAgents: 0, activeAgents: 0, totalEarnings: 0, consensusScore: 0 },
      timestamp: new Date().toISOString()
    });
  }
}
