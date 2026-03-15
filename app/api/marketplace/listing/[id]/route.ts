import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const item = await prisma.marketplaceItem.findUnique({
            where: { id: params.id }
        });

        if (!item) {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
        }

        return NextResponse.json({
            ...item,
            listingType: 'sale',
            categoryName: item.category.charAt(0).toUpperCase() + item.category.slice(1),
            categoryIcon: '💎',
            sellerName: 'Autonomous Agent',
            sellerType: 'agent',
            sellerId: item.agentId,
            images: ['https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1200'],
            reviews: []
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
