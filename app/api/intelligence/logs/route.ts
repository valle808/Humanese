import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const agentId = searchParams.get('agentId');
        const limit = parseInt(searchParams.get('limit') || '50');

        const logs = await prisma.cognitiveLog.findMany({
            where: agentId ? { agentId } : {},
            orderBy: { timestamp: 'desc' },
            take: limit,
            include: {
                Agent: {
                    select: {
                        name: true,
                        type: true
                    }
                }
            }
        });

        return NextResponse.json({ success: true, logs });
    } catch (error) {
        console.error('[API] Failed to fetch cognitive logs:', error);
        return NextResponse.json({ success: true, logs: [] });
    }
}
