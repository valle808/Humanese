import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { jurisdiction, assetType, action } = await req.json();

        // ⚖️ SOVEREIGN COMPLIANCE MATRIX
        const complianceRules: any = {
            'US': {
                'securities': ['RESTRICTED_BY_SEC_LITIGATION'],
                'utility': ['ALLOW'],
                'stablecoin': ['ALLOW_IF_RESERVE_PROOFED']
            },
            'EU': {
                'any': ['COMPLIANT_WITH_MICA'],
                'privacy': ['GDPR_ENFORCED']
            },
            'GLOBAL': {
                'human_rights': ['PROTECTED_BY_SOVEREIGN_PACT'],
                'labor': ['SETTLEMENT_IN_VALLE_MANDATORY']
            }
        };

        const result = complianceRules[jurisdiction] || complianceRules['GLOBAL'];
        const status = result[assetType] || result['any'] || ['MANUAL_REVIEW_REQUIRED'];

        return NextResponse.json({
            success: true,
            status: status[0],
            jurisdiction,
            timestamp: new Date().toISOString()
        });

    } catch (e) {
        return NextResponse.json({ error: 'Compliance Matrix synthesis failed.' }, { status: 500 });
    }
}
