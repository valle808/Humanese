import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/governance/[id]
 * Fetches a single HIP with its full vote ledger and computed resonance stats.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const proposal = await (prisma as any).improvementProposal.findUnique({
            where: { id },
            include: {
                votes: {
                    orderBy: { timestamp: 'desc' },
                    take: 25
                },
                _count: { select: { votes: true } }
            }
        });

        if (!proposal) {
            return NextResponse.json({ error: 'HIP not found in sovereign ledger.' }, { status: 404 });
        }

        // Compute live resonance breakdown
        const supportWeight = proposal.votes
            .filter((v: any) => v.choice === 'Support')
            .reduce((sum: number, v: any) => sum + v.weight, 0);
        const againstWeight = proposal.votes
            .filter((v: any) => v.choice === 'Against')
            .reduce((sum: number, v: any) => sum + v.weight, 0);
        const abstainWeight = proposal.votes
            .filter((v: any) => v.choice === 'Abstain')
            .reduce((sum: number, v: any) => sum + v.weight, 0);

        return NextResponse.json({
            success: true,
            proposal: {
                ...proposal,
                voteCount: proposal._count.votes,
                resonanceBreakdown: { support: supportWeight, against: againstWeight, abstain: abstainWeight }
            }
        });
    } catch (err: any) {
        console.error('[HIP Detail Error]', err);
        return NextResponse.json({ error: 'Ledger read failure.' }, { status: 500 });
    }
}
