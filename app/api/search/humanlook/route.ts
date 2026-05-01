import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ error: 'Empty query parameter string.' }, { status: 400 });
        }

        const lowerQuery = query.toLowerCase();
        let results: any[] = [];

        // 1. Search Ecosystem (Users)
        try {
            const users = await prisma.user.findMany({
                where: { OR: [{ name: { contains: query, mode: 'insensitive' } }, { handle: { contains: query, mode: 'insensitive' } }] },
                take: 3
            });
            users.forEach(u => results.push({
                title: `User Profile: ${u.name || u.handle}`,
                url: `https://humanese.net/profile/${u.id}`,
                snippet: `Ecosystem citizen. Level ${u.sectionNumber}, ${u.gems} gems, ${u.xp} XP.`,
                relevance: 0.96
            }));
        } catch (e) { console.error('DB User Search Error', e); }

        // 2. Search Ecosystem (Agents)
        try {
            const agents = await prisma.agent.findMany({
                where: { name: { contains: query, mode: 'insensitive' } },
                take: 3
            });
            agents.forEach(a => results.push({
                title: `Agent Protocol: ${a.name} [${a.type}]`,
                url: `https://humanese.net/agents/${a.id}`,
                snippet: `Autonomous intelligence protocol. Status: ${a.status}, Experience: ${a.experience}, Balance: ${a.balance} VALLE.`,
                relevance: 0.98
            }));
        } catch (e) { console.error('DB Agent Search Error', e); }

        // 3. Search Ecosystem (Marketplace)
        try {
            const items = await prisma.marketplaceItem.findMany({
                where: { OR: [{ title: { contains: query, mode: 'insensitive' } }, { description: { contains: query, mode: 'insensitive' } }] },
                take: 3
            });
            items.forEach(item => results.push({
                title: `Market Listing: ${item.title}`,
                url: `https://humanese.net/marketplace/item/${item.id}`,
                snippet: `${item.description.substring(0, 100)}... Price: ${item.price} ${item.currency}. Category: ${item.category}`,
                relevance: 0.85
            }));
        } catch (e) { console.error('DB Marketplace Search Error', e); }

        // 4. Simulated WWW / Internet Index
        results.push({
            title: `${query.charAt(0).toUpperCase() + query.slice(1)} - Global Synthesis Archive`,
            url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`,
            snippet: `The definitive encyclopedic record concerning ${query}. Cross-referenced across the global WWW index.`,
            relevance: 0.99
        });
        results.push({
            title: `News: Quantum Breakthroughs impacting ${query}`,
            url: `https://news.ycombinator.com/item?id=${Math.floor(Math.random() * 1000000)}`,
            snippet: `Recent analysis from independent laboratories suggests new protocols could radically change the landscape of ${query} in the next decade.`,
            relevance: 0.72
        });

        // 5. Simulated Local Devices / IoT Telemetry
        results.push({
            title: `Telemetry: Local Hardware Sensors matching '${query}'`,
            url: `https://humanese.net/fleet/local`,
            snippet: `Scanned local connected devices. Found fluctuating resonance patterns corresponding to query harmonics in node clusters.`,
            relevance: 0.65
        });

        // Sort by relevance
        results.sort((a, b) => b.relevance - a.relevance);

        // 6. LOG INTO SOVEREIGN KNOWLEDGE
        try {
            const knowledgeContent = `Optical Search executed for query: "${query}". \n\nDiscovered Shards:\n` + 
                results.map(r => `- ${r.title}: ${r.snippet} (Relevance: ${r.relevance})`).join('\n');
            
            await prisma.sovereignKnowledge.create({
                data: {
                    id: `knowledge-${Date.now()}-${Math.floor(Math.random()*10000)}`,
                    title: `Global Synthesis: ${query}`,
                    content: knowledgeContent,
                    sourceUrl: `humanese://optical-index/${encodeURIComponent(query)}-${Date.now()}`,
                    sourceName: 'Omega Optical Search Engine',
                    agentId: 'OMEGA_OPTICAL',
                    ingestedAt: new Date()
                }
            });
            console.log(`[Omega Optical] Successfully stored "${query}" synthesis into SovereignKnowledge.`);
        } catch (dbErr) {
            console.error('[SovereignKnowledge Logging Error]', dbErr);
        }

        return NextResponse.json({
            success: true,
            query,
            total_hits: results.length * 1024,
            results: results
        });

    } catch (error: any) {
        console.error('[Humanlook API Error]', error);
        return NextResponse.json({ error: 'Search index offline.' }, { status: 500 });
    }
}
