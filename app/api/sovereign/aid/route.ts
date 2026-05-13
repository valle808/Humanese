import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
    try {
        const { title, description, category, contact } = await req.json();

        if (!title || !description) {
            return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
        }

        const aidRequest = await prisma.intelligenceItem.create({
            data: {
                id: `aid-${randomUUID().substring(0, 8)}`,
                type: 'AID_REQUEST',
                subType: category || 'GENERAL',
                title: title,
                description: `[CONTACT: ${contact || 'ANON'}] ${description}`,
                foundBy: 'HUMAN_SUBMISSION',
                resonance: 0.5,
                status: 'ACTIVE'
            }
        });

        return NextResponse.json({ success: true, id: aidRequest.id });
    } catch (error: any) {
        console.error('[AID_API_ERROR]', error.message);
        return NextResponse.json({ error: "Failed to submit aid request." }, { status: 500 });
    }
}

export async function GET() {
    try {
        const aidRequests = await prisma.intelligenceItem.findMany({
            where: { type: 'AID_REQUEST' },
            orderBy: { timestamp: 'desc' },
            take: 20
        });
        return NextResponse.json(aidRequests);
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch aid requests." }, { status: 500 });
    }
}
