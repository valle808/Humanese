import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const assets = await prisma.marketplaceItem.findMany({
            where: { category: 'real-estate' }
        });

        const totalValue = assets.reduce((acc, a) => acc + a.price, 0);

        return NextResponse.json({
            total_assets: assets.length,
            total_valuation_valle: totalValue,
            market_status: 'STABLE',
            last_appraisal: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
