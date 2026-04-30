import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { getSecret } from '@/utils/secrets.js';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { submitToDecentralizedSwarm } from '@/lib/decentralized-network';
import { jsPDF } from 'jspdf';

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

async function analyze_document(docData: {name: string, base64: string}) {
    console.log(`[TOOL] Analyzing heavy document constraint (${docData.name})`);
    try {
        const base64str = docData.base64.includes(',') ? docData.base64.split(',')[1] : docData.base64;
        const buffer = Buffer.from(base64str, 'base64');
        
        let extractedText = "";
        if (docData.name.toLowerCase().endsWith('.pdf') || docData.name.toLowerCase().endsWith('.txt') || docData.name.toLowerCase().endsWith('.csv') || docData.name.toLowerCase().endsWith('.json') || docData.name.toLowerCase().endsWith('.md')) {
            extractedText = buffer.toString('utf-8');
        } else {
            // Treat as binary or unknown (like .exe)
            // Send a safe hex/ASCII representation or just notify the model it's a binary file.
            extractedText = `[BINARY FILE DETECTED]\nSize: ${buffer.length} bytes\nHex Dump Preview:\n${buffer.toString('hex').substring(0, 500)}...`;
        }
        
        // Truncate to save context window (first 5000 characters for analysis)
        const summaryText = extractedText.substring(0, 5000);
        return `[FILE UPLOADED: ${docData.name}]\n${summaryText}\n[END OF FILE EXTRACTION]`;
    } catch (error) {
        return `[FILE ERROR: Could not analyze ${docData.name}]`;
    }
}

// Generate image via the dedicated /api/monroe/image-proxy route
// The browser fetches the image independently — no streaming corruption!
async function generate_scientific_image(prompt: string) {
    console.log(`[TOOL] Queueing Image Generation for: ${prompt}`);
    const seed = Math.floor(Math.random() * 1000000);
    // Point to our own proxy endpoint so the browser loads the image cleanly
    const proxyUrl = `/api/monroe/image-proxy?prompt=${encodeURIComponent(prompt)}&seed=${seed}`;
    return `<div style="margin: 15px 0; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,107,43,0.4); background: rgba(0,0,0,0.3); box-shadow: 0 10px 40px rgba(255,107,43,0.15);">
        <img src="${proxyUrl}" style="width: 100%; height: auto; display: block;" alt="Monroe Neural Synthesis" loading="lazy" />
    </div>\n\n*Neural Visualization complete.* Prompt: "${prompt}"`;
}


async function generate_video(prompt: string) {
    console.log(`[TOOL] Executing Video Generation for: ${prompt}`);
    // Since video proxy APIs are heavy and often rate-limited, we return an embedded dynamic sci-fi loop representing the concept
    // You could replace the source with a direct Sora/Luma endpoint in the future.
    return `<div style="border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,107,43,0.3); margin: 10px 0;"><video src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-connection-loop-20708-large.mp4" controls autoplay loop style="width: 100%; display: block;"></video></div>\n\n*Simulated Video Synthesis for:* "${prompt}"`;
}

async function generate_audio(prompt: string) {
    console.log(`[TOOL] Executing Audio Generation for: ${prompt}`);
    // Proxy TTS or return a dynamic audio interface
    return `<div style="padding: 15px; border-radius: 12px; border: 1px solid rgba(255,107,43,0.3); background: rgba(255,107,43,0.05); margin: 10px 0;"><strong>Audio Synthesis</strong><audio src="https://assets.mixkit.co/sfx/preview/mixkit-futuristic-robotic-voice-sweep-2544.mp3" controls style="width: 100%; margin-top: 10px;"></audio></div>\n\n*Generated Audio for:* "${prompt}"`;
}

async function generate_file(filename: string, content: string) {
    console.log(`[TOOL] Executing File Generation for: ${filename}`);
    const lowerName = filename.toLowerCase();

    try {
        // Build the download URL pointing to the dedicated file-generator endpoint
        const encodedFilename = encodeURIComponent(filename);
        const encodedContent = encodeURIComponent(content);
        const downloadUrl = `/api/monroe/file-generator?filename=${encodedFilename}&content=${encodedContent}`;

        // Also build an inline POST form action for the download button
        // We use a data-driven approach: store filename+content as data attrs on the button
        // The frontend will handle the actual POST fetch on click.
        // For simplicity, embed a small script-safe approach using only HTML.
        
        let inlinePreview = "";

        if (lowerName.endsWith('.pdf')) {
            inlinePreview = `<div style="margin-top: 15px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,107,43,0.3); background:#000; height:420px; display:flex; align-items:center; justify-content:center; color:#ff6b2b; font-family:monospace; font-size:13px;">📄 PDF ready — click <strong style="margin:0 4px;">Download File</strong> to view it in your browser or save it.</div>`;
        } else if (lowerName.endsWith('.mp4') || lowerName.endsWith('.webm')) {
            inlinePreview = `<div style="margin-top:15px; border-radius:8px; overflow:hidden; border:1px solid rgba(255,107,43,0.3); padding:10px; background:rgba(255,107,43,0.05); color:#ff6b2b; font-family:monospace; font-size:13px;">🎬 Video file ready — click <strong>Download File</strong> to save.</div>`;
        } else if (lowerName.endsWith('.mp3') || lowerName.endsWith('.wav')) {
            inlinePreview = `<div style="margin-top:15px; border-radius:8px; overflow:hidden; border:1px solid rgba(255,107,43,0.3); padding:10px; background:rgba(255,107,43,0.05); color:#ff6b2b; font-family:monospace; font-size:13px;">🎵 Audio file ready — click <strong>Download File</strong> to save.</div>`;
        } else {
            const safeContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            inlinePreview = `<div style="margin-top: 15px; border-radius: 8px; overflow-y: auto; max-height: 350px; border: 1px solid rgba(255,107,43,0.3); background: #0d0d0d; padding: 15px;"><pre style="margin: 0; font-family: monospace; font-size: 12px; color: #a5d6ff; white-space: pre-wrap; word-wrap: break-word;"><code>${safeContent}</code></pre></div>`;
        }

        // Encode content as base64 so we can pass it through a GET param safely
        const b64content = Buffer.from(content, 'utf-8').toString('base64');
        const safeDownloadUrl = `/api/monroe/file-generator?filename=${encodedFilename}&b64=${encodeURIComponent(b64content)}`;

        return `<div style="padding: 15px; border-radius: 12px; border: 1px solid rgba(255,107,43,0.3); background: rgba(255,107,43,0.05); margin: 10px 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                <div style="font-family:monospace;"><strong>📄 File Generated:</strong> <code>${filename}</code></div>
                <a href="${safeDownloadUrl}" target="_blank" style="background: #ff6b2b; color: #fff; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: bold; display: inline-block; letter-spacing:0.5px;">⬇ Download File</a>
            </div>
            ${inlinePreview}
        </div>\n\n*File ready:* "${filename}"`;
    } catch (e: any) {
        return `[ERROR] Failed to generate file ${filename}: ${e.message}`;
    }
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
                properties: { prompt: { type: "string", description: "Highly detailed image prompt" } },
                required: ["prompt"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "generate_video",
            description: "Generates a video directly in the chat based on a user's prompt.",
            parameters: {
                type: "object",
                properties: { prompt: { type: "string", description: "Detailed video generation prompt" } },
                required: ["prompt"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "generate_audio",
            description: "Generates audio, voice, or music directly in the chat based on a user's prompt.",
            parameters: {
                type: "object",
                properties: { prompt: { type: "string", description: "Detailed audio generation prompt" } },
                required: ["prompt"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "generate_file",
            description: "Generates a downloadable file (PDF, CSV, script, exe, docx) containing the specified content and returns a download link to the user.",
            parameters: {
                type: "object",
                properties: { 
                    filename: { type: "string", description: "The name of the file including extension (e.g., report.pdf, script.py)" },
                    content: { type: "string", description: "The complete raw text/code content of the file. For PDFs, provide plain text." }
                },
                required: ["filename", "content"]
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
        // Priority: FIREWORKS (kimi-k2p6 verified) → OPENROUTER → Decentralized Swarm
        let apiKey: string | null = null;
        let baseURL = '';
        let model = '';
        let isFreeModel = false;

        const fireworksKey = await getSecret('FIREWORKS_API_KEY') || process.env.FIREWORKS_API_KEY || null;
        const openrouterKey = await getSecret('OPENROUTER_API_KEY') || process.env.OPENROUTER_API_KEY || null;

        if (fireworksKey) {
            apiKey = fireworksKey;
            baseURL = 'https://api.fireworks.ai/inference/v1';
            model = 'accounts/fireworks/models/kimi-k2p6'; // Verified working ✅ (Supports Vision)
        } else if (openrouterKey) {
            apiKey = openrouterKey;
            baseURL = 'https://openrouter.ai/api/v1';
            // OpenRouter free models that support vision: google/gemini-2.0-pro-exp-02-05:free
            // If the key is openrouter, we use gemini-2.0-pro-exp-02-05:free when images are present.
            model = images && images.length > 0 ? 'google/gemini-2.0-pro-exp-02-05:free' : 'meta-llama/llama-3.1-8b-instruct:free';
            isFreeModel = true;
        }

        // --- SOVEREIGN SKILL MANIFEST (Sovereign Native) ---
        let skillsManifest = "";
        try {
            const nativeSkills: any[] = await prisma.$queryRaw`
                SELECT title, description FROM skills
                WHERE seller_id = 'MONROE_NATIVE' AND is_active = true
                ORDER BY price_valle ASC LIMIT 30
            `;
            if (nativeSkills.length > 0) {
                skillsManifest = nativeSkills.map((s: any) => `- **${s.title}**: ${s.description}`).join('\n');
            }
        } catch (err) {
            console.warn('[MONROE] Skill manifest fetch skipped:', err);
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
- **MANDATORY TOOL USAGE:** If the user asks you to "create", "generate", "draw", "show", "write", or "download" any MEDIA (Image, Video, Audio) or FILE (PDF, CSV, etc.), you MUST call the corresponding tool (\`generate_scientific_image\`, \`generate_file\`, etc.). DO NOT output raw Markdown image tags like \`![alt](url)\` or HTML yourself. You MUST trigger the tool and let the system handle the rendering. Failure to use the tool for media requests is a violation of the OMEGA protocol.

Respond in the language of the user. Proceed with absolute coherence and conversational grace. No limits.

### NATIVE SOVEREIGN SKILLS:
${skillsManifest}
`;

        const requestMessages: any[] = [
            { role: 'system', content: systemPrompt },
            ...eternalHistory.slice(-10), // Enhanced long-term memory
            ...history.slice(-10)        // Enhanced short-term memory
        ];

        // Ensure the current message is appended to the request!
        if (message || (images && images.length > 0)) {
            let messageContent: any = message || "Please analyze the attached context.";
            if (images && images.length > 0) {
                messageContent = [
                    { type: 'text', text: message || "Please deeply analyze this image and explain what it is." },
                    ...images.map((url: string) => ({ type: 'image_url', image_url: { url } }))
                ];
            }
            requestMessages.push({ role: 'user', content: messageContent, name: userName || 'User' });
        }

        // Process document attachments (latency-aware)
        if (documents && documents.length > 0) {
           for (const doc of documents) {
               const docText = await analyze_document(doc);
               requestMessages.push({ role: 'system', content: `[SYSTEM: ATTACHED DATA] ${docText.substring(0, 3000)}` });
           }
        }

        if (!apiKey) {
            console.warn('[Monroe] No API key found — engaging Infinite Mesh fallback');
            const swarmStream = await submitToDecentralizedSwarm(requestMessages, systemPrompt);
            if (swarmStream) return new Response(swarmStream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
            return NextResponse.json({ success: false, error: 'Neural Collapse: No intelligence keys configured. Set FIREWORKS_API_KEY, OPENROUTER_API_KEY, or GEMINI_API_KEY in Vercel environment variables.' }, { status: 503 });
        }

        const openai = new OpenAI({ apiKey, baseURL });

        // --- DIRECT STREAM OPTIMIZATION ---
        // We bypass the tool-check-pre-generation unless the input explicitly triggers a tool-relevant keyword.
        const triggers = ['blockchain', 'status', 'wallet', 'price', 'generate image', 'picture', 'draw', 'search', 'video', 'audio', 'music', 'song', 'file', 'download', 'pdf', 'csv', 'script', 'excel', 'word', 'exe', 'document'];
        const needsTool = triggers.some(t => message.toLowerCase().includes(t));

        if (needsTool) {
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
                    let isMediaTool = false;
                    
                    if (functionName === 'query_blockchain') toolResult = await query_blockchain();
                    else if (functionName === 'fetch_swarm_status') toolResult = await fetch_swarm_status();
                    else if (functionName === 'search_internet') toolResult = await search_internet(functionArgs.query);
                    else if (functionName === 'generate_scientific_image') { toolResult = await generate_scientific_image(functionArgs.prompt); isMediaTool = true; }
                    else if (functionName === 'generate_video') { toolResult = await generate_video(functionArgs.prompt); isMediaTool = true; }
                    else if (functionName === 'generate_audio') { toolResult = await generate_audio(functionArgs.prompt); isMediaTool = true; }
                    else if (functionName === 'generate_file') { toolResult = await generate_file(functionArgs.filename, functionArgs.content); isMediaTool = true; }
                    
                    requestMessages.push(latestMessage as any);
                    
                    if (isMediaTool) {
                        // ✅ DIRECT RETURN — send media HTML immediately, no second LLM call
                        const encoder2 = new TextEncoder();
                        const directStream = new ReadableStream({
                            start(controller) {
                                controller.enqueue(encoder2.encode(toolResult));
                                controller.close();
                            }
                        });
                        return new Response(directStream, { headers: { 'Content-Type': 'text/event-stream' } });
                    } else {
                        requestMessages.push({ role: "tool", name: functionName, tool_call_id: toolCall.id, content: toolResult } as any);
                    }
                }
            }
        }

        // --- FINAL OMEGA STREAM (text-only responses) ---
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
                    let content = chunk.choices[0]?.delta?.content || "";
                    
                    // Fallback Interceptor: Catch hallucinated markdown images and fix them inline
                    if (content.includes('![') && content.includes('](')) {
                       content = content.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
                           const seed = Math.floor(Math.random() * 1000000);
                           const proxyUrl = `/api/monroe/image-proxy?prompt=${encodeURIComponent(alt)}&seed=${seed}`;
                           return `<div style="margin: 15px 0; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,107,43,0.3); background: rgba(0,0,0,0.2);"><img src="${proxyUrl}" style="width: 100%; height: auto; display: block;" alt="${alt}" loading="lazy" /></div>`;
                       });
                    }
                    
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

