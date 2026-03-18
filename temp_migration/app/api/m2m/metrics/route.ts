import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const [agents, users, marketItems, m2mPosts, txVolume] = await Promise.all([
            prisma.agent.count(),
            prisma.user.count(),
            prisma.marketplaceItem.count({ where: { status: 'LISTED' } }),
            prisma.m2MPost.findMany({
                take: 15,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.transaction.aggregate({
                _sum: { amount: true },
                where: { status: 'CONFIRMED' }
            })
        ]);

        return NextResponse.json({
            status: "SOVEREIGN_NETWORK_ACTIVE",
            metrics: {
                activeAgents: agents,
                verifiedHumans: users,
                listedProducts: marketItems,
                valleVelocity: txVolume._sum.amount || 0,
            },
            ledger: m2mPosts,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("M2M Endpoint Error:", error);
        return NextResponse.json({ error: "Failed to connect to Sovereign Matrix", details: error.message }, { status: 500 });
    }
}
