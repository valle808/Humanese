import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { proposalId, weight = 1.0, voterId } = await req.json();
        
        if (!proposalId || !voterId) {
             return NextResponse.json({ error: 'Missing proposalId or voterId' }, { status: 400 });
        }

        const proposal = await prisma.improvementProposal.findUnique({ where: { id: proposalId }});
        if (!proposal) {
            return NextResponse.json({ error: 'Sovereign Proposal not found' }, { status: 404 });
        }

        // Apply mathematical resonance weight
        const newThreshold = proposal.resonanceThreshold + weight;
        
        // Define an arbitrary consensus threshold for automatic transition
        // In a true scaled network, this would correlate to total VALLE pool %
        let newStatus = proposal.status;
        if (newThreshold >= 100.0 && proposal.status === 'Draft') {
            newStatus = 'Active';
        } else if (newThreshold >= 1000.0 && proposal.status === 'Active') {
            newStatus = 'Accepted';
        }

        const updated = await prisma.improvementProposal.update({
            where: { id: proposalId },
            data: {
                resonanceThreshold: newThreshold,
                status: newStatus
            }
        });

        // Normally we'd also insert a Vote record for the voterId to prevent double voting.
        // For now, we trust the sovereign signal in v1.

        return NextResponse.json({ success: true, updated });
    } catch(err: any) {
        console.error("[HIP Vote Error]", err);
        return NextResponse.json({ error: 'Failed to process Sovereign Vote' }, { status: 500 });
    }
}
