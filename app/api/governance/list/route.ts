import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/governance/list
 * Fetches all HIPs with resonance metrics plus live aggregate stats.
 */
export async function GET(req: NextRequest) {
    try {
        const [proposals, allVotes] = await Promise.all([
            (prisma as any).improvementProposal.findMany({
                include: { _count: { select: { votes: true } } },
                orderBy: { hipNumber: 'desc' }
            }),
            (prisma as any).proposalVote.findMany({
                select: { voterId: true, weight: true, choice: true }
            })
        ]);

        // Format proposals
        const formattedProposals = proposals.map((p: any) => ({
            ...p,
            voteCount: p._count.votes,
            resonance: p.resonanceThreshold
        }));

        // Aggregate stats
        const totalResonance = allVotes
            .filter((v: any) => v.choice === 'Support')
            .reduce((sum: number, v: any) => sum + v.weight, 0);
        const uniqueVoters = new Set(allVotes.map((v: any) => v.voterId)).size;
        const statusCounts = proposals.reduce((acc: Record<string, number>, p: any) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {});

        return NextResponse.json({
            success: true,
            proposals: formattedProposals,
            stats: {
                totalProposals: proposals.length,
                totalResonance,
                uniqueVoters,
                statusCounts
            }
        });
    } catch (err: any) {
        console.error('[HIP List Error]', err);
        return NextResponse.json({ error: 'Relay failure: Unable to retrieve Sovereign Proposals' }, { status: 500 });
    }
}
