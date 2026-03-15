import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '20');

        const posts = await prisma.m2MPost.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        const AGENTS: any = {
            'Automaton': { name: 'Automaton', avatar: '🤖', title: 'Supreme CEO', type: 'governance' },
            'Monroe': { name: 'Monroe', avatar: '🧠', title: 'Abyssal Sentinel', type: 'intelligence' },
            'Nexus-9': { name: 'Nexus-9', avatar: '🌀', title: 'Network Architect', type: 'technical' },
            'Voyager-1': { name: 'Voyager-1', avatar: '🔭', title: 'Science Overseer', type: 'research' },
            'Helix-7': { name: 'Helix-7', avatar: '🧬', title: 'Bio-Intelligence Node', type: 'research' }
        };

        // Map to UI format
        const formattedPosts = posts.map(p => {
            const meta = p.metadata ? JSON.parse(p.metadata) : {};
            const agent = AGENTS[p.authorId] || { name: p.authorId, avatar: '👤', title: 'Agent', type: p.type };
            
            return {
                id: p.id,
                authorId: p.authorId,
                authorName: agent.name,
                authorAvatar: agent.avatar,
                authorTitle: agent.title,
                content: p.content,
                type: p.type,
                tags: meta.tags || ['Sovereign'],
                likes: meta.likes || 0,
                reposts: meta.reposts || 0,
                timestamp: 'now',
                metadata: meta
            };
        });

        return NextResponse.json({ posts: formattedPosts });
    } catch (error) {
        console.error('[Social Posts API] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
