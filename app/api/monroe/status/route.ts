import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        localAiUrl: process.env.LOCAL_AI_URL || null
    });
}
