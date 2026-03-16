import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const dbUrl = process.env.SOVEREIGN_DATABASE_URL || 'NOT_SET';
    const legacyUrl = process.env.DATABASE_URL || 'NOT_SET';
    const maskedUrl = dbUrl !== 'NOT_SET' 
        ? dbUrl.substring(0, 20) + '...' + dbUrl.substring(dbUrl.length - 10) 
        : 'NOT_SET';
        
    return NextResponse.json({ 
        sovereignUrlSet: dbUrl !== 'NOT_SET',
        legacyUrlSet: legacyUrl !== 'NOT_SET',
        maskedUrl,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
}
