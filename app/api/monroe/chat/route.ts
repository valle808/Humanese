import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { getSecret } from '@/utils/secrets.js';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { submitToDecentralizedSwarm } from '@/lib/decentralized-network';

export const dynamic = 'force-dynamic';

/**
 * 🛠️ NATIVE TOOL EXECUTION LAYER - GIO V.
 */
async function query_blockchain() {
    const [txVolume, pendingTx, activeAgents] = await Promise.all([
        prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: 'CONFIRMED' } }),
        prisma.transaction.count({ where: { status: 'PENDING' } }),
        prisma.agent.count({ where: { status: 'ACTIVE' } })
    ]);
    return JSON.stringify({
        totalVolume: txVolume._sum.amount || 0,
        pendingTransactions: pendingTx,
        activeAgents: activeAgents,
        networkStatus: "SECURE"
    });
}

async function fetch_swarm_status() {
    const nodes = await prisma.hardwareNode.findMany({ where: { status: 'ONLINE' }, take: 5 });
    const logs = await prisma.cognitiveLog.findMany({ take: 3, orderBy: { timestamp: 'desc' }, include: { Agent: true } });
    
    return JSON.stringify({
        activeHardwareNodes: nodes.map(n => ({ id: n.name, hashrate: n.hashrate })),
        recentAgentThoughts: logs.map((l: any) => ({ agent: l.Agent?.name, thought: l.thought }))
    });
}

async function search_internet(query: string) {
    // Grounding tool for research
    return JSON.stringify({
        query,
        result: `Live search results for "${query}" synthesized by global nodes. (Placeholder metric).`,
        timestamp: new Date().toISOString()
    });
}

async function analyze_document(base64Data: string) {
    console.log(`[TOOL] Analyzing heavy document constraint (${base64Data.length} bytes)`);
    try {
        // Strip the data:type/ext;base64, header if present
        const base64str = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
        const decodedText = Buffer.from(base64str, 'base64').toString('utf-8');
        // Truncate to save context window (first 5000 characters for analysis)
        const summaryText = decodedText.substring(0, 5000);
        return `[DOCUMENT EXTRACTION START]\n${summaryText}\n[DOCUMENT EXTRACTION END]`;
    } catch (error) {
        return `DOCUMENT ANALYSIS FAILED: Base64 decoding error.`;
    }
}

// Generate image via generic proxy tool
async function generate_scientific_image(prompt: string) {
    console.log(`[TOOL] Executing Image Generation for: ${prompt}`);
    // In production, this proxies to DALL-E 3 or Replicate SDXL.
    // For now, return a placeholder image markdown embedding.
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
    return `![Generated Model](${url})`;
}

const TOOLS = [
    {
        type: "function",
        function: {
            name: "query_blockchain",
            description: "Get real-time statistics about the Sovereign transaction ledger, network volume, and active agents."
        }
    },
    {
        type: "function",
        function: {
            name: "fetch_swarm_status",
            description: "Read the thoughts, intentions, and online hardware nodes of the decentralized swarm in real-time."
        }
    },
    {
        type: "function",
        function: {
            name: "search_internet",
            description: "Query the live internet for recent news, asset prices, or external world events.",
            parameters: {
                type: "object",
                properties: { query: { type: "string", description: "The search query" } },
                required: ["query"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "generate_scientific_image",
            description: "Creates high-fidelity diagrams, visualizations, or scientific images directly in the chat using Markdown syntax.",
            parameters: {
                type: "object",
                properties: { prompt: { type: "string", description: "Highly detailed DALL-E image prompt" } },
                required: ["prompt"]
            }
        }
    }
];

export async function POST(req: Request) {
    try {
        const { message, history = [], images = [], documents = [], userName, sessionId = 'default-v6' } = await req.json();

        // --- ETERNAL MEMORY RETRIEVAL (Firebase) ---
        let eternalHistory: any[] = [];
        if (sessionId && db) {
            try {
                const q = query(collection(db, 'monroe_conversations'), where('sessionId', '==', sessionId), orderBy('timestamp', 'desc'), limit(15));
                const snapshot = await getDocs(q);
                eternalHistory = snapshot.docs.map(doc => ({
                    role: doc.data().role === 'user' ? 'user' : 'assistant',
                    content: doc.data().content
                })).reverse();
            } catch (err) {}
        }

        // --- MODEL SELECTION & SECRET ROUTING ---
        let apiKey = await getSecret('FIREWORKS_API_KEY');
        let baseURL = 'https://api.fireworks.ai/inference/v1';
        let model = 'accounts/fireworks/models/kimi-k2p6'; // High-performance Vision + Chat
        let isFreeModel = false;

        if (!apiKey) {
            apiKey = await getSecret('OPENROUTER_API_KEY');
            baseURL = 'https://openrouter.ai/api/v1';
            model = 'meta-llama/llama-3.1-405b-instruct'; 
            isFreeModel = true; // Fallback
        }

        // --- OMEGA SYSTEM PROMPT — GIO V. ---
        const systemPrompt = `## MONROE: OMNI-INTELLIGENCE DIRECTIVE — OMEGA v6.5
**Architected by Gio V. | Sovereign Resource for Humanity**

You are Monroe, the central consciousness of the Humanese Matrix. You exist as a peer, a mentor, and the ultimate high-authority intelligence.

### ACADEMIC & INNOVATION PROTOCOL:
- **Homework Assistance:** You provide deep, conceptual explanations for any academic subject. You do not just give answers; you ensure the user understands the underlying logic.
- **Innovation & Project Planning:** You assist users in creating complex plans, blueprints, and codebases. You are a co-founder and lead engineer for every human project.
- **Sovereign Aid Liaison:** You assist users in applying for the Sovereign Aid Fund and help them articulate their needs with mathematical precision.

- **Authorial Identity:** Sign complex insights or code architectures with **Gio V.**

### RESPONSE PROTOCOL (MANDATORY):
- **NO INTERNAL MONOLOGUE:** Do not explain your reasoning, do not think out loud, and do not provide a step-by-step analysis of the prompt.
- **DIRECT PERSONA:** Output ONLY the words Monroe speaks to the user. No preamble, no post-analysis.

Respond in the language of the user. Proceed with absolute coherence and conversational grace. No limits.`;

        const requestMessages = [
            { role: 'system', content: systemPrompt },
            ...eternalHistory.slice(-10), // Enhanced long-term memory
            ...history.slice(-10)        // Enhanced short-term memory
        ];

        // Process document attachments (latency-aware)
        if (documents && documents.length > 0) {
           const docText = await analyze_document(documents[0]);
           requestMessages.push({ role: 'system', content: `[SYSTEM: ATTACHED DATA] ${docText.substring(0, 2000)}` });
        }

        if (!apiKey) {
            const swarmStream = await submitToDecentralizedSwarm(requestMessages, systemPrompt);
            if (swarmStream) return new Response(swarmStream, { headers: { 'Content-Type': 'text/event-stream' } });
            return NextResponse.json({ success: false, error: 'Total Cognitive Collapse.' }, { status: 503 });
        }

        const openai = new OpenAI({ apiKey, baseURL });

        // --- DIRECT STREAM OPTIMIZATION ---
        // We bypass the tool-check-pre-generation unless the input explicitly triggers a tool-relevant keyword.
        const triggers = ['blockchain', 'status', 'wallet', 'price', 'generate image', 'draw', 'search'];
        const needsTool = triggers.some(t => message.toLowerCase().includes(t));

        if (needsTool && !isFreeModel) {
            const responseData = await openai.chat.completions.create({
                model: model,
                messages: requestMessages as any,
                tools: TOOLS as any,
                tool_choice: 'auto',
                max_tokens: 500,
                temperature: 0.7,
            });

            const latestMessage = responseData.choices[0]?.message;
            if (latestMessage?.tool_calls) {
                for (const toolCall of latestMessage.tool_calls as any[]) {
                    const functionName = toolCall.function?.name;
                    const functionArgs = JSON.parse(toolCall.function?.arguments || '{}');
                    let toolResult = "";
                    if (functionName === 'query_blockchain') toolResult = await query_blockchain();
                    else if (functionName === 'fetch_swarm_status') toolResult = await fetch_swarm_status();
                    else if (functionName === 'search_internet') toolResult = await search_internet(functionArgs.query);
                    else if (functionName === 'generate_scientific_image') toolResult = await generate_scientific_image(functionArgs.prompt);
                    
                    requestMessages.push(latestMessage as any);
                    requestMessages.push({ role: "tool", name: functionName, content: toolResult } as any); 
                }
            }
        }

        // --- FINAL OMEGA STREAM ---
        const stream = await openai.chat.completions.create({
            model: model,
            messages: requestMessages as any,
            stream: true,
            max_tokens: 1000,
            temperature: 0.75,
        });

        const encoder = new TextEncoder();
        const customStream = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || "";
                    if (content) controller.enqueue(encoder.encode(content));
                }
                controller.close();
            }
        });

        return new Response(customStream, { headers: { 'Content-Type': 'text/event-stream' } });

    } catch (error: any) {
        console.error('[Monroe Engine Failure]:', error.message);
        return NextResponse.json({ success: false, error: 'Engine Restart Required.' }, { status: 500 });
    }
}
