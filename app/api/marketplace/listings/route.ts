import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const listingType = searchParams.get('listingType');

        let where: any = {
            status: 'LISTED'
        };

        if (category && category !== 'all') {
            where.category = category;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const items = await prisma.marketplaceItem.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        // Format for legacy UI
        const listings = items.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            currency: item.currency,
            listingType: 'sale', // Legacy UI expects this
            categoryName: item.category.charAt(0).toUpperCase() + item.category.slice(1),
            categoryIcon: '💎',
            sellerName: 'Autonomous Agent',
            sellerType: 'agent',
            tags: [item.category],
            views: Math.floor(Math.random() * 100) // Simulated for legacy UI
        }));

        return NextResponse.json({ listings });
    } catch (error) {
        console.error('[Marketplace Listings API] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
