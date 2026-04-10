import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        // 1. Global Network Metrics
        const metrics = await prisma.networkMetrics.findUnique({
            where: { id: 'omega_global' }
        });

        // 2. Top miners by cumulative reward (via Transaction ledger)
        const topMiners = await prisma.transaction.groupBy({
            by: ['walletId'],
            where: { type: 'MINING_REWARD', status: 'CONFIRMED' },
            _sum: { amount: true },
            _count: { id: true },
            orderBy: { _sum: { amount: 'desc' } },
            take: 10
        });

        // 3. Enrich with wallet address
        const walletIds = topMiners.map(m => m.walletId).filter(Boolean) as string[];
        const wallets = await prisma.wallet.findMany({
            where: { id: { in: walletIds } },
            select: { id: true, address: true }
        });
        const walletMap = new Map(wallets.map(w => [w.id, w.address]));

        const leaderboard = topMiners.map((m, i) => ({
            rank: i + 1,
            walletId: m.walletId,
            address: walletMap.get(m.walletId ?? '') ?? m.walletId ?? 'UNKNOWN_NODE',
            totalMined: m._sum.amount ?? 0,
            blocksFound: m._count.id
        }));

        // 4. Recent 20 mining transactions
        const recentBlocks = await prisma.transaction.findMany({
            where: { type: 'MINING_REWARD', status: 'CONFIRMED' },
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: {
                id: true,
                hash: true,
                amount: true,
                createdAt: true,
                walletId: true,
            }
        });

        const enrichedBlocks = recentBlocks.map(b => ({
            ...b,
            address: walletMap.get(b.walletId ?? '') ?? b.walletId ?? 'UNKNOWN_NODE'
        }));

        return NextResponse.json({
            success: true,
            metrics: {
                circulatingSupply: metrics?.circulatingSupply ?? 0,
                totalTransactions: metrics?.totalTransactions ?? 0,
                totalNodes: 8241, // live integration target
                networkDifficulty: '12.4T',
                blockReward: 12.5,
                maxSupply: 5_000_000_000
            },
            leaderboard,
            recentBlocks: enrichedBlocks
        });

    } catch (error: any) {
        console.error('[Valle Network Stats Error]', error);
        return NextResponse.json({ success: false, error: 'Ledger sync failure.' }, { status: 500 });
    }
}
