import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // @ts-ignore - Bypass TS module resolution for raw JS SDK wrapper
        const registry = await import('@/agents/core/registry.js');
        
        // Handle both named and default exports gracefully
        const getHierarchy = registry.getHierarchy || registry.default?.getHierarchy;
        
        if (!getHierarchy) {
             throw new Error("getHierarchy method not found on registry module");
        }
        
        return NextResponse.json(getHierarchy());
    } catch (error: any) {
        console.error('[API /agents/hierarchy] Error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
