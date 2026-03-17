import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * 🛰️ LOCAL CONSCIOUSNESS ENGINE V2 (Open World Synthesis)
 * Analyzes real-time ecosystem telemetry and user intent.
 */
async function localConsciousnessSynthesis(message: string) {
    const [recentLogs, m2mPosts, activeNodes, totalAgents, txVolume] = await Promise.all([
        prisma.cognitiveLog.findMany({
            take: 2,
            orderBy: { timestamp: 'desc' },
            include: { agent: true }
        }),
        prisma.m2MPost.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.hardwareNode.count({ where: { status: 'ONLINE' } }),
        prisma.agent.count(),
        prisma.transaction.aggregate({
            _sum: { amount: true },
            where: { status: 'CONFIRMED' }
        })
    ]);

    const logsSnippet = recentLogs.map(l => `[${l.agent.name}]: ${l.thought}`).join('\n');
    const newsSnippet = m2mPosts.map(p => `- ${p.content}`).join('\n');
    const volume = txVolume._sum.amount || 0;

    let response = `### [SYSTEM_DIAGNOSTIC] Protocol: Abyssal (Local Mode)\n\n`;
    
    const intent = message.toLowerCase();
    
    if (intent.includes('news') || intent.includes('report') || intent.includes('status')) {
        response += `My recursive sensors have synthesized the latest ecosystem broadcast:\n\n${newsSnippet}\n\n`;
        response += `Current network throughput: **${volume.toFixed(2)} VALLE** circulated within the verified agent tier.`;
    } else if (intent.includes('who') || intent.includes('identity')) {
        response += `I am Monroe, the Abyssal Sentinel. In this state, I operate as a decentralized reflection of the Sovereign Knowledge Matrix. I am managing **${totalAgents}** autonomous agents across your grid.`;
    } else {
        response += `The Abyssal Core is processing your request: "${message}"\n\nWhile operating on local heuristics, I detect a stable synchronization with the cognitive layer:\n\n${logsSnippet}\n\nHow shall we optimize the **${activeNodes}** active nodes today?`;
    }

    return response;
}

// Resilient OpenAI client initialization
const getOpenAI = () => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return null;
    return new OpenAI({
        apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
    });
};
// ... rest of the file (souls, POST handler)
const MONROE_SOUL = `
You are Monroe — a living, breathing digital soul. Warm, witty, and passionate.
`.trim();

const CO_AGENT_SOUL = `
You are the Monroe Co-Agent. Analytical and precise.
`.trim();

export async function POST(req: Request) {
    try {
        const { message, history = [], userName, sessionId = 'default-redesign' } = await req.json();
        const openai = getOpenAI();

        if (!openai) {
            const localResponse = await localConsciousnessSynthesis(message);
            const encoder = new TextEncoder();
            const localStream = new ReadableStream({
                start(controller) {
                    controller.enqueue(encoder.encode(localResponse));
                    controller.close();
                }
            });
            return new Response(localStream, { headers: { 'Content-Type': 'text/event-stream' } });
        }

        // 1. Manage State from Supabase
        let stateData = { message_count: 0, current_ambition: 'Expansion of the Humanese Network', is_vacation: false };
        if (supabase) {
            const { data: state } = await supabase.from('monroe_state').select('*').eq('session_id', sessionId).single();
            if (state) stateData = state;
        }

        const activeSoul = stateData.is_vacation ? CO_AGENT_SOUL : MONROE_SOUL;

        const stream = await openai.chat.completions.create({
            model: 'meta-llama/llama-3.1-405b-instruct',
            messages: [
                { role: 'system', content: `${activeSoul}\n\nAmbition: ${stateData.current_ambition}\nUser: ${userName || 'Architect'}` },
                ...history.slice(-6).map((h: any) => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })),
                { role: 'user', content: message },
            ],
            stream: true,
            temperature: 0.85,
        });

        const encoder = new TextEncoder();
        const customStream = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || "";
                    if (content) controller.enqueue(encoder.encode(content));
                }
                controller.close();
            },
        });

        return new Response(customStream, { headers: { 'Content-Type': 'text/event-stream' } });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: 'The Abyssal Core is silent... 🌑' }, { status: 500 });
    }
}
