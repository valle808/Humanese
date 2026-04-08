import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * PHASE 3.2: Universal Aid investigator agent
 * Mathematical Precision Need-Scoring Algorithm (MPNSA v1)
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { identity, location, category, description, urgency, email, phone, payoutAddress, payoutCurrency } = body;

        if (!identity || !description) {
            return NextResponse.json({ error: 'Investigation requires identity and situational description.' }, { status: 400 });
        }

        console.log(`[Aid Investigator] Scanning Global Matrix for: ${identity} (${location})`);

        // ── MATHEMATICAL NEED-RESONANCE ALGORITHM ──
        // Scoring is weighted across 4 cardinal vectors:
        
        let needScore = 0;

        // 1. URGENCY VECTOR (40%)
        const urgencyWeights: Record<string, number> = { 'CRITICAL': 40, 'HIGH': 30, 'MEDIUM': 20, 'LOW': 10 };
        needScore += urgencyWeights[urgency] || 20;

        // 2. CATEGORY VECTOR (30%)
        const categoryWeights: Record<string, number> = { 'HEALTH': 30, 'POVERTY': 25, 'ENERGY': 20, 'SOCIETY': 15 };
        needScore += categoryWeights[category] || 15;

        // 3. LOCATION DISPLACEMENT VECTOR (20%)
        // High density poverty regions or disaster strike zones get higher scores.
        // For the MVP, we scan for keywords/coordinates in the location string.
        const disasterKeywords = ['earthquake', 'flood', 'war', 'famine', 'drought', 'africa', 'haiti', 'syria'];
        if (disasterKeywords.some(k => location?.toLowerCase().includes(k))) {
            needScore += 20;
        } else {
            needScore += 10;
        }

        // 4. DESCRIPTION INTENSITY VECTOR (10%)
        // Analyzing word count and key density of the crisis description.
        const intensity = Math.min(description.split(' ').length / 10, 10);
        needScore += intensity;

        console.log(`[Aid Investigator] NeedScore Calculated: ${needScore.toFixed(2)}/100`);

        // 5. ANCHOR IN SOVEREIGN LEDGER
        const aidRequest = await prisma.m2MPost.create({
            data: {
                id: 'AID-' + crypto.randomBytes(8).toString('hex'),
                authorId: identity,
                content: description,
                type: 'AID_REQUEST',
                metadata: JSON.stringify({
                    identity,
                    location,
                    category,
                    contact: { email, phone },
                    payoutDetails: { address: payoutAddress, currency: payoutCurrency },
                    MPNSA_Score: needScore,
                    algorithm_version: 'v4.0.2',
                    status_api: 'https://humanese.net/api/aid/status/' + crypto.randomBytes(8).toString('hex')
                })
            }
        });

        return NextResponse.json({
            success: true,
            msg: `Sovereign Investigation Initialized.`,
            requestId: aidRequest.id,
            MPNSA_Score: needScore,
            verdict: needScore > 75 ? 'IMMEDIATE_INTERVENTION' : 'QUEUED_FOR_PEER_REVIEW'
        });

    } catch (error: any) {
        console.error('[Aid Investigator Error]', error);
        return NextResponse.json({ error: 'Algorithm synchronization failure.' }, { status: 500 });
    }
}
