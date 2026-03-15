import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // @ts-ignore - Bypass TS module resolution for raw JS SDK wrapper
        const intelligenceHq = await import('@/agents/core/intelligence-hq.js');
        
        const getIntelligence = intelligenceHq.getIntelligence || intelligenceHq.default?.getIntelligence;
        
        if (!getIntelligence) {
             throw new Error("getIntelligence method not found on intelligenceHq module");
        }
        
        return NextResponse.json(getIntelligence());
    } catch (error: any) {
        console.error('[API /m2m/intelligence] Error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
