import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { buyerId } = body;

        const item = await prisma.marketplaceItem.findUnique({
            where: { id: params.id }
        });

        if (!item) {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
        }

        // Simulate a transaction creation
        // In a real app, we would deduct balance from a wallet
        const wallet = await prisma.wallet.findFirst({
            where: { userId: buyerId || 'sergio_valle' }
        });

        const orderId = Math.random().toString(36).substring(2, 12).toUpperCase();

        return NextResponse.json({
            success: true,
            order: {
                id: orderId,
                listingTitle: item.title,
                type: item.category,
                price: item.price,
                currency: item.currency,
                taxRate: '0.00%',
                tax: 0,
                total: item.price
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
