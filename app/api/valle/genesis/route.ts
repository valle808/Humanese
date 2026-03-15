import { NextResponse } from 'next/server';
import { valleCore } from '../../../../lib/valle-crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const genesis = valleCore.generateGenesisBlock();
        return NextResponse.json({
            success: true,
            network_prefix: valleCore.NETWORK_PREFIX,
            genesis
        });
    } catch (error) {
        console.error('[Valle API Error]', error);
        return NextResponse.json({ success: false, error: 'Synthesis corrupted.' }, { status: 500 });
    }
}
