import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const knowledge = await prisma.sovereignKnowledge.findMany({
            take: 10,
            orderBy: { ingestedAt: 'desc' }
        });

        return NextResponse.json(knowledge);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
