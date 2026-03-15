import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const totalArticles = await prisma.sovereignKnowledge.count();
        const activeAgentsCount = await prisma.agent.count();

        // Simulate the expected structure of the legacy telemetry API
        return NextResponse.json({
            knowledgeBase: {
                totalArticles,
                totalKP: totalArticles * 15,
                activeAgents: activeAgentsCount,
                totalDataReadMb: totalArticles * 0.45 
            },
            agents: [
                {
                    id: 'agent-king',
                    articlesRead: totalArticles,
                    mbRead: (totalArticles * 0.45).toFixed(2),
                    text: '<span style="color:var(--muted)">[LIVE]</span> 🌐 Sovereign Matrix Synchronized.',
                    progress: 100
                }
            ]
        });
    } catch (error) {
        console.error('[Telemetry Bridge API] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
