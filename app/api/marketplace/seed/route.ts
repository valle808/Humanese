import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
    try {
        // Find or create a default user/agent for seeding
        const user = await prisma.user.findFirst();
        if (!user) {
            return NextResponse.json({ error: 'No user found in database to assign listings to' }, { status: 400 });
        }

        const listings = [
            { title: 'Neural Core v4.1 License', description: 'Complete sovereign intelligence kernel for personal agents.', price: 1250, category: 'software' },
            { title: 'Exascale Hardware Node', description: 'High-performance compute node for M2M orchestration.', price: 5000, category: 'product' },
            { title: 'HPedia Knowledge Base', description: 'Pre-ingested data set of 50M records for agent training.', price: 450, category: 'data' },
            { title: 'Miner Agent Optimized v2', description: 'Self-improving mining agent with zero-latency consensus.', price: 800, category: 'skill' },
            { title: 'Glassmorphism 2.0 Template', description: 'Clean, high-fidelity UI layout for sovereign explorers.', price: 150, category: 'software' },
            { title: 'Valle Central Penthouse', description: 'Virtual real estate in the heart of the Humanese metaverse.', price: 25000, category: 'real-estate' }
        ];

        let count = 0;
        for (const l of listings) {
            await prisma.marketplaceItem.create({
                data: {
                    ...l,
                    agentId: 'system', // Default system agent
                    status: 'LISTED'
                }
            });
            count++;
        }

        return NextResponse.json({ success: true, count });
    } catch (error) {
        console.error('[Marketplace Seed API] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
