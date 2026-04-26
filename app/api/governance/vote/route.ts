import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * RESONANCE WEIGHT ENGINE v1.0
 *
 * Calculates a voter's resonance multiplier from their VALLE token balance.
 * Uses a logarithmic scale to prevent plutocratic dominance while still 
 * rewarding long-term ecosystem participants.
 *
 * Formula: weight = 1.0 + log10(1 + balance / 100)
 *
 * Examples:
 *   500 VALLE  (welcome balance) → ~1.845
 *   1,000 VALLE                  → ~2.041
 *   10,000 VALLE                 → ~3.0
 *   100,000 VALLE                → ~4.0
 *
 * Floor: 1.0 (every identity has a base resonance of 1)
 * Cap:   5.0 (prevents any single entity from dominating)
 */
async function deriveVoterWeight(voterId: string): Promise<number> {
    try {
        const wallet = await prisma.wallet.findFirst({
            where: { userId: voterId },
            select: { balance: true }
        });

        if (!wallet || wallet.balance <= 0) return 1.0;

        const raw = 1.0 + Math.log10(1 + wallet.balance / 100);
        // Clamp between 1.0 and 5.0
        return Math.min(5.0, Math.max(1.0, parseFloat(raw.toFixed(4))));
    } catch {
        // Fallback to base resonance if wallet lookup fails
        return 1.0;
    }
}

export async function POST(req: NextRequest) {
    try {
        const { proposalId, voterId, choice, comment, ghostMode = false } = await req.json();
        
        if (!proposalId || !voterId || !choice) {
             return NextResponse.json({ error: 'Missing proposalId, voterId, or choice' }, { status: 400 });
        }

        // 1. Check if proposal exists and is in a votable state
        const proposal = await (prisma as any).improvementProposal.findUnique({ 
            where: { id: proposalId }
        });
        
        if (!proposal) {
            return NextResponse.json({ error: 'Sovereign Proposal not found' }, { status: 404 });
        }

        if (['Accepted', 'Rejected', 'Withdrawn', 'Final'].includes(proposal.status)) {
            return NextResponse.json({ error: `Proposal is ${proposal.status}. Resonance window is closed.` }, { status: 403 });
        }

        // 2. Prevent double voting (sybil resistance)
        const existingVote = await (prisma as any).proposalVote.findUnique({
            where: {
                proposalId_voterId: {
                    proposalId,
                    voterId
                }
            }
        });

        if (existingVote) {
            return NextResponse.json({ error: 'Identity has already broadcasted resonance for this proposal.' }, { status: 403 });
        }

        // 3. Derive VALLE-weighted resonance score
        const weight = await deriveVoterWeight(voterId);

        // 3b. Apply Ghost Mode transformation if requested
        let effectiveVoterId = voterId;
        if (ghostMode) {
            effectiveVoterId = 'ghost_' + createHash('sha256').update(voterId + proposalId).digest('hex');
            console.log(`[Governance] Applied Ghost Anonymization: ${voterId.substring(0, 8)}... -> ${effectiveVoterId.substring(0, 14)}...`);
        }

        console.log(`[Governance] Vote cast by ${effectiveVoterId} | Proposal: ${proposalId} | Choice: ${choice} | Weight: ${weight} | Ghost: ${ghostMode}`);

        // 4. Register the vote in the Resonance Ledger
        await (prisma as any).proposalVote.create({
            data: {
                proposalId,
                voterId: effectiveVoterId,
                choice,
                weight,
                comment,
                isGhost: ghostMode
            }
        });

        // 5. Re-calculate full resonance for this proposal
        const allVotes = await (prisma as any).proposalVote.findMany({
            where: { proposalId }
        });
        
        const supportResonance = allVotes
            .filter((v: any) => v.choice === 'Support')
            .reduce((sum: number, v: any) => sum + v.weight, 0);

        const againstResonance = allVotes
            .filter((v: any) => v.choice === 'Against')
            .reduce((sum: number, v: any) => sum + v.weight, 0);

        // 6. State machine: advance proposal status based on resonance thresholds
        let newStatus = proposal.status;
        if (supportResonance >= 100.0 && proposal.status === 'Draft') {
            newStatus = 'Active';
            console.log(`[Governance] HIP #${proposal.hipNumber} promoted to Active (resonance: ${supportResonance.toFixed(2)})`);
        } else if (supportResonance >= 1000.0 && proposal.status === 'Active') {
            newStatus = 'Accepted';
            console.log(`[Governance] HIP #${proposal.hipNumber} ACCEPTED (resonance: ${supportResonance.toFixed(2)})`);
        } else if (againstResonance > supportResonance * 2 && allVotes.length >= 10) {
            // Overwhelming opposition (2x against) with quorum → Rejected
            newStatus = 'Rejected';
            console.log(`[Governance] HIP #${proposal.hipNumber} REJECTED (against: ${againstResonance.toFixed(2)} vs support: ${supportResonance.toFixed(2)})`);
        }

        await (prisma as any).improvementProposal.update({
            where: { id: proposalId },
            data: {
                resonanceThreshold: supportResonance,
                status: newStatus
            }
        });

        return NextResponse.json({ 
            success: true,
            vote: { choice, weight },
            resonance: {
                support: parseFloat(supportResonance.toFixed(4)),
                against: parseFloat(againstResonance.toFixed(4)),
                total: parseFloat((supportResonance + againstResonance).toFixed(4))
            },
            status: newStatus,
            statusChanged: newStatus !== proposal.status
        });
    } catch(err: any) {
        console.error("[HIP Vote Error]", err);
        return NextResponse.json({ error: 'Failed to process Sovereign Vote' }, { status: 500 });
    }
}
