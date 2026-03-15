import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { user: string } }) {
    try {
        // Find user by ID or name
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: params.user },
                    { name: { contains: params.user, mode: 'insensitive' } }
                ]
            },
            include: { wallets: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Return mock assets based on marketplace data or user profile
        return NextResponse.json({
            user_id: user.id,
            user_name: user.name,
            assets: [
                { type: 'INTELLECTUAL_PROPERTY', name: 'Neural Core Alpha V1', status: 'VERIFIED' },
                { type: 'CURRENCY', name: 'VALLE', balance: user.wallets?.[0]?.balance || 0 }
            ]
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
