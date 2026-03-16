import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const count = await prisma.agent.count();
        return NextResponse.json({ success: true, count, timestamp: new Date().toISOString() });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
