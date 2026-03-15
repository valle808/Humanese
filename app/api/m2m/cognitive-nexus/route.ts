import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const logs = await prisma.cognitiveLog.findMany({
            take: 20,
            orderBy: { timestamp: 'desc' },
            include: {
                agent: {
                    select: {
                        name: true,
                        type: true
                    }
                }
            }
        });

        return NextResponse.json(logs);
    } catch (error: any) {
        console.error('[API /m2m/cognitive-nexus] Error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
