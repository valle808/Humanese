import { NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = 'force-dynamic';

// Resilient OpenAI client initialization
const getOpenAI = () => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return null;
    return new OpenAI({ 
        apiKey, 
        baseURL: "https://openrouter.ai/api/v1" 
    });
};

export async function POST(req: Request) {
    const openai = getOpenAI();
    
    if (!openai) {
        return NextResponse.json({ 
            success: false, 
            error: "Study Buddy is currently offline (API Configuration Missing)" 
        }, { status: 503 });
    }

    try {
        const { message, history } = await req.json();

        const completion = await openai.chat.completions.create({
            model: "meta-llama/llama-3.1-70b-instruct",
            messages: [
                { role: "system", content: "You are the Study Buddy in the Sovereign Knowledge Matrix. You help students plan, execute, and study advanced topics. Be encouraging but precise." },
                ...history.map((h: any) => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })),
                { role: "user", content: message }
            ]
        });

        return NextResponse.json({ response: completion.choices[0].message.content });
    } catch (error: any) {
        console.error('[Study Buddy Error]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
