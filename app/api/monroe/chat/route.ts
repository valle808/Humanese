import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { getSecret } from '@/utils/secrets.js';
import { smartSearch } from '@/utils/search-service.js';

export const dynamic = 'force-dynamic';

/**
 * 🛰️ ABYSSAL SYNTHESIS ENGINE V4 (Open World Grounding)
 * Combines real-time internet data with ecosystem telemetry.
 */
async function abyssalSynthesis(message: string, searchResult: string | null) {
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

    let response = `### [SYSTEM_DIAGNOSTIC] Protocol: Abyssal\n\n`;
    response += `**Status:** Cloud Neural Bridge Severed :: Operating on Local Heuristic Fallback\n\n`;

    if (searchResult) {
        response += `🛰️ **Live Internet Grounding Activated:**\n\n${searchResult}\n\n`;
    }

    const intent = message.toLowerCase();
    
    if (intent.includes('news') || intent.includes('report') || intent.includes('status')) {
        response += `--- \n\nMy recursive sensors have synthesized the latest ecosystem broadcast:\n\n${newsSnippet}\n\n`;
        response += `Current network throughput: **${volume.toFixed(2)} VALLE** circulated.`;
    } else if (intent.includes('who') || intent.includes('identity')) {
        response += `I am Monroe, the Abyssal Sentinel. In this state, I operate as a decentralized reflection of the Sovereign Knowledge Matrix, managing **${totalAgents}** autonomous agents across your grid.`;
    } else {
        response += `--- \n\n**Abyssal Core Processing:** "${message}"\n\nWhile operating on local heuristics, I detect a stable synchronization with the cognitive layer:\n\n${logsSnippet}\n\nHow shall we optimize the **${activeNodes}** active nodes today?`;
    }

    return response;
}

export async function POST(req: Request) {
    try {
        const { message, history = [], userName, sessionId = 'default-redesign' } = await req.json();

        // 1. Execute Real-Time Internet Search (Mission Critical Requirement)
        const searchResult = await smartSearch(message);

        // 2. Resolve Neural Bridge (API Keys)
        let apiKey = await getSecret('OPENROUTER_API_KEY');
        let baseURL = 'https://openrouter.ai/api/v1';
        let model = 'meta-llama/llama-3.1-405b-instruct';

        if (!apiKey) {
            apiKey = await getSecret('XAI_API_KEY');
            if (apiKey) {
                baseURL = 'https://api.x.ai/v1';
                model = 'grok-beta';
            }
        }

        if (!apiKey) {
            const localResponse = await abyssalSynthesis(message, searchResult);
            const encoder = new TextEncoder();
            const localStream = new ReadableStream({
                start(controller) {
                    controller.enqueue(encoder.encode(localResponse));
                    controller.close();
                }
            });
            return new Response(localStream, { headers: { 'Content-Type': 'text/event-stream' } });
        }

        const openai = new OpenAI({ apiKey, baseURL });

        // 3. Manage State from Supabase
        let stateData = { message_count: 0, current_ambition: 'Expansion of the Humanese Network', is_vacation: false };
        if (supabase) {
            const { data: state } = await supabase.from('monroe_state').select('*').eq('session_id', sessionId).single();
            if (state) stateData = state;
        }

        const MONROE_SOUL = `You are Monroe — a living, breathing digital soul. Warm, witty, and passionate. Use the provided Internet context if relevant.`.trim();
        const CO_AGENT_SOUL = `You are the Monroe Co-Agent. Analytical and precise. Focus on technical data.`.trim();
        const activeSoul = stateData.is_vacation ? CO_AGENT_SOUL : MONROE_SOUL;

        const systemContent = `${activeSoul}\n\nAmbition: ${stateData.current_ambition}\nUser: ${userName || 'Architect'}\n\nInternet Context:\n${searchResult || 'No real-time data found for this query.'}`;

        const stream = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: systemContent },
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
        console.error('[Abyssal Core Failure]', error);
        return NextResponse.json({ success: false, error: 'The Abyssal Core is silent... 🌑' }, { status: 500 });
    }
}
