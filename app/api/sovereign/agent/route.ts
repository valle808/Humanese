import { NextResponse } from 'next/server';
import { agentKing } from '@/lib/agent-king';

/**
 * Sovereign Agent King API
 * Triggers autonomous planning and execution for complex intelligence tasks.
 */

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
        }

        console.log(`[Agent API] Triggering Agent King for: ${query}`);

        // In a streaming implementation, we would return a stream of task updates.
        // For this transmutation phase, we return the plan immediately.
        const plan = await agentKing.plan(query);

        return NextResponse.json({
            success: true,
            query,
            plan,
            message: "Agent King has initialized the strategy. Execution is standing by."
        });
    } catch (error) {
        console.error('[Agent API Error]', error);
        return NextResponse.json({ success: false, error: 'Agent planning failed' }, { status: 500 });
    }
}
