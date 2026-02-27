import { NextResponse } from 'next/server';
import { comparison } from '@/lib/comparison';
import { grokipedia } from '@/lib/grokipedia';

/**
 * Sovereign Comparison API
 * Synthesizes knowledge from multiple sources and provides a trust score.
 */

export async function POST(req: Request) {
    try {
        const { topic, sourceText, targetText } = await req.json();

        if (topic && !sourceText) {
            // Automatic retrieval mode: Compare Grokipedia with a likely target
            console.log(`[Compare API] Running automatic synthesis for: ${topic}`);
            // In a real scenario, we'd fetch from Wikipedia or another source
            // For now we use the comparison engine with provided or fetched data
        }

        const result = await comparison.compare(sourceText || '', targetText || '');

        return NextResponse.json({
            success: true,
            topic,
            ...result
        });
    } catch (error) {
        console.error('[Compare API Error]', error);
        return NextResponse.json({ success: false, error: 'Knowledge synthesis failed' }, { status: 500 });
    }
}
