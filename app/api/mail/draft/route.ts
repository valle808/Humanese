import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "dummy",
    defaultHeaders: {
        "HTTP-Referer": "https://humanese.net",
        "X-Title": "Sovereign Mail",
    }
});

export async function POST(req: NextRequest) {
    try {
        const { subject, content } = await req.json();

        if (!process.env.OPENROUTER_API_KEY) {
             return NextResponse.json({ 
                draft: content + "\n\n[NEURAL_SYNTHESIS_OFFLINE]: Sovereign Agent API credentials missing. Bypassing active synthesis." 
             });
        }

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-lite-preview-02-05:free", // High speed free-tier for testing
            messages: [
                {
                    role: "system",
                    content: "You are the autonomous Agent-King embedded in the Humanese Sovereign network. You are assisting a user in drafting a highly articulate, cryptographically secure transmission. Take their rough subject and content notes and aggressively re-write them to be decisive, deeply intelligent, and slightly cyberpunk. Omit any AI apologies or greetings. Just output the raw, synthesized message content."
                },
                {
                    role: "user",
                    content: `Subject: ${subject || 'UNKNOWN'}\nRough Content: ${content}`
                }
            ]
        });

        const draft = completion.choices[0]?.message?.content || content;

        return NextResponse.json({ draft });
    } catch(err: any) {
        console.error("Agent-King drafting error:", err);
        return NextResponse.json({ error: "Sovereign Synthesis Failed" }, { status: 500 });
    }
}
