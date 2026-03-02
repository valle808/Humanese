export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENROUTER_API_KEY, baseURL: "https://openrouter.ai/api/v1" });

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [
                { role: "system", content: "You are the Study Buddy in the Sovereign Knowledge Matrix. You help students plan, execute, and study advanced topics. Be encouraging but precise." },
                ...history.map((h: any) => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })),
                { role: "user", content: message }
            ]
        });

        return NextResponse.json({ response: completion.choices[0].message.content });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
