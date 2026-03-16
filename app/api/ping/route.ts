import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({ 
        status: 'ONLINE', 
        timestamp: new Date().toISOString(),
        message: 'Sovereign Intelligence Matrix Operational'
    });
}
