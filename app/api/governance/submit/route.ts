import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/governance/submit
 * Anchors a new Humanese Improvement Proposal (HIP) to the Sovereign Ledger.
 * Computes a SHA-256 content hash for on-chain notarization compatibility
 * (mirrors the keccak256 that SovereignGovernance.sol will receive).
 *
 * Signed: Gio V. / Bastidas Protocol
 */
export async function POST(req: NextRequest) {
    try {
        const { title, content, type, authorId, layer, category, bipReference } = await req.json();

        if (!title || !content || !authorId || !type) {
            return NextResponse.json(
                { error: 'Missing required fields: title, content, type, authorId' },
                { status: 400 }
            );
        }

        // — Compute content hash for on-chain notarization —
        const contentHash = '0x' + createHash('sha256').update(content, 'utf8').digest('hex');

        const proposal = await (prisma as any).improvementProposal.create({
            data: {
                title,
                type,
                layer:              layer    || 'Consensus',
                category:           category || 'Core',
                bipReference:       bipReference || null,
                authorId,
                markdownContent:    content,
                status:             'Draft',           // Initialize as Draft
                resonanceThreshold: 0.0
            }
        });

        const formattedHip = `HIP-${proposal.hipNumber.toString().padStart(4, '0')}`;

        // — Emit telemetry item for the swarm —
        try {
            await (prisma as any).intelligenceItem.create({
                data: {
                    id:          `intel-hip-${proposal.id}`,
                    type:        'GOVERNANCE_EVENT',
                    subType:     'HIP_SUBMITTED',
                    title:       `${formattedHip} Anchored — ${title}`,
                    description: `New Sovereign Improvement Proposal submitted by ${authorId}. Content hash: ${contentHash.slice(0, 18)}…`,
                    foundBy:     authorId,
                    proposedBy:  authorId,
                    resonance:   1.0,
                    status:      'ACTIVE',
                }
            });
        } catch (telErr) {
            console.warn('[HIP Telemetry] Failed to emit intelligence item:', telErr);
        }

        return NextResponse.json({
            success:     true,
            identifier:  formattedHip,
            contentHash,
            proposal
        });
    } catch (err: any) {
        console.error('[HIP Submit Error]', err);
        return NextResponse.json(
            { error: 'Failed to anchor proposal to the Sovereign Ledger' },
            { status: 500 }
        );
    }
}
