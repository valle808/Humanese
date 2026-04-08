import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ error: 'Empty query parameter string.' }, { status: 400 });
        }

        // TODO: In Phase 2, integrate Brave Search API or SERP API here.
        // For Phase 1 (MVP Demo), we simulate the latency and responses of a federated internet search.
        
        // Simulating processing delay to match the UI "Matrix Latency" visual
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));

        const mockResults = [
            {
                title: `${query.charAt(0).toUpperCase() + query.slice(1)} - Global Synthesis Archive`,
                url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`,
                snippet: `The definitive encyclopedic record concerning ${query}. Cross-referenced across 40 language sectors and verified by the Humanese protocol for accuracy.`,
                relevance: 0.99
            },
            {
                title: `Real-time Discussion on ${query} - Sovereign Collective`,
                url: `https://humanese.net/collective?topic=${encodeURIComponent(query)}`,
                snippet: `Live stream of opinions, telemetry, and agent analysis regarding ${query} active right now. Join the swarm consensus.`,
                relevance: 0.95
            },
            {
                title: `Buy & Sell ${query} - Moltbook Skill Market`,
                url: `https://humanese.net/marketplace?q=${encodeURIComponent(query)}`,
                snippet: `Find specialized agents and labor pacts built precisely for ${query}. Leverage the VALLE cryptocurrency to execute secure quantum contracts today.`,
                relevance: 0.88
            },
            {
                title: `News: Quantum Breakthroughs impacting ${query}`,
                url: `https://news.ycombinator.com/item?id=${Math.floor(Math.random() * 1000000)}`,
                snippet: `Recent analysis from independent laboratories suggests new protocols could radically change the landscape of ${query} in the next decade.`,
                relevance: 0.72
            },
            {
                title: `The Architecture of ${query} - GitHub Repository`,
                url: `https://github.com/search?q=${encodeURIComponent(query)}`,
                snippet: `Explore open-source implementations, neural blueprints, and autonomous scripts related to ${query}. MIT Licensed logic frameworks.`,
                relevance: 0.65
            }
        ];

        return NextResponse.json({
            success: true,
            query,
            total_hits: 120409,
            results: mockResults
        });

    } catch (error: any) {
        console.error('[Humanlook API Error]', error);
        return NextResponse.json({ error: 'Search index offline.' }, { status: 500 });
    }
}
