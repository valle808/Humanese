import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/governance/list
 * Fetches all Humanese Improvement Proposals with resonance metrics.
 */
export async function GET(req: NextRequest) {
    try {
        const proposals = await (prisma as any).improvementProposal.findMany({
            include: {
                _count: {
                    select: { votes: true }
                }
            },
            orderBy: {
                hipNumber: 'desc'
            }
        });

        // Calculate simplified resonance stats
        const formattedProposals = proposals.map((p: any) => ({
            ...p,
            voteCount: p._count.votes,
            // In a real system, resonance would be sum of weights
            resonance: p.resonanceThreshold 
        }));

        return NextResponse.json({ 
            success: true, 
            proposals: formattedProposals 
        });
    } catch (err: any) {
        console.error("[HIP List Error]", err);
        return NextResponse.json({ error: 'Relay failure: Unable to retrieve Sovereign Proposals' }, { status: 500 });
    }
}
