import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const counts = await prisma.marketplaceItem.groupBy({
            by: ['category'],
            _count: {
                _all: true
            }
        });

        const categoryMap: Record<string, { id: string, name: string, icon: string, count: number }> = {
            'skill': { id: 'skill', name: 'Neural Skills', icon: '🧠', count: 0 },
            'product': { id: 'product', name: 'Physical Hardware', icon: '🔌', count: 0 },
            'data': { id: 'data', name: 'Intelligence Data', icon: '📈', count: 0 },
            'software': { id: 'software', name: 'Agent Software', icon: '🤖', count: 0 },
            'real-estate': { id: 'real-estate', name: 'Real Estate', icon: '🏠', count: 0 }
        };

        counts.forEach(c => {
            if (categoryMap[c.category]) {
                categoryMap[c.category].count = c._count._all;
            }
        });

        return NextResponse.json(Object.values(categoryMap));
    } catch (error) {
        console.error('[Marketplace Categories API] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
