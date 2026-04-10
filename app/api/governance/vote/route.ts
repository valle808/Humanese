import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { proposalId, voterId, choice, weight = 1.0, comment } = await req.json();
        
        if (!proposalId || !voterId || !choice) {
             return NextResponse.json({ error: 'Missing proposalId, voterId, or choice' }, { status: 400 });
        }

        // 1. Check if proposal exists
        const proposal = await (prisma as any).improvementProposal.findUnique({ 
            where: { id: proposalId },
            include: { votes: true }
        });
        
        if (!proposal) {
            return NextResponse.json({ error: 'Sovereign Proposal not found' }, { status: 404 });
        }

        // 2. Prevent double voting
        const existingVote = await (prisma as any).proposalVote.findUnique({
            where: {
                proposalId_voterId: {
                    proposalId: proposalId,
                    voterId: voterId
                }
            }
        });

        if (existingVote) {
            return NextResponse.json({ error: 'Identity has already broadcasted resonance for this proposal.' }, { status: 403 });
        }

        // 3. Register the vote
        await (prisma as any).proposalVote.create({
            data: {
                proposalId,
                voterId,
                choice,
                weight,
                comment
            }
        });

        // 4. Calculate new total resonance
        const totalVotes = await (prisma as any).proposalVote.findMany({
            where: { proposalId }
        });
        
        const supportResonance = totalVotes
            .filter((v: any) => v.choice === 'Support')
            .reduce((sum: number, v: any) => sum + v.weight, 0);

        // 5. Update status based on resonance (simplified state machine)
        let newStatus = proposal.status;
        if (supportResonance >= 100.0 && proposal.status === 'Draft') {
            newStatus = 'Active';
        } else if (supportResonance >= 1000.0 && proposal.status === 'Active') {
            newStatus = 'Accepted';
        }

        const updated = await (prisma as any).improvementProposal.update({
            where: { id: proposalId },
            data: {
                resonanceThreshold: supportResonance,
                status: newStatus
            }
        });

        return NextResponse.json({ 
            success: true, 
            resonance: supportResonance,
            status: newStatus
        });
    } catch(err: any) {
        console.error("[HIP Vote Error]", err);
        return NextResponse.json({ error: 'Failed to process Sovereign Vote' }, { status: 500 });
    }
}
