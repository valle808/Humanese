import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, id } = body;
        
        // @ts-ignore - Bypass TS module resolution for raw JS SDK wrapper
        const intelligenceHq = await import('@/agents/core/intelligence-hq.js');
        
        const resonate = intelligenceHq.resonate || intelligenceHq.default?.resonate;
        
        if (!resonate) {
             throw new Error("resonate method not found on intelligenceHq module");
        }
        
        const result = await resonate(type, id);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('[API /m2m/intelligence/resonate] Error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
