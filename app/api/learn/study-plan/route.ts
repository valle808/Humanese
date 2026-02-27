import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENROUTER_API_KEY, baseURL: "https://openrouter.ai/api/v1" });

export async function POST(req: Request) {
    try {
        const { topic, userId, location, socialLife, localLaws } = await req.json();

        // 1. Generate Personalized Study Plan via AI
        const prompt = `Generate a personalized study plan for the topic: "${topic}".
        User Context:
        - Location: ${location}
        - Social Life/Style: ${socialLife}
        - Local/Federal Laws: ${localLaws}
        
        Requirements:
        - Include tasks with order.
        - Follow ISO standards for the quiz at the end.
        - Ensure content is relevant to the user's local protocols.
        - Provide a JSON structure: { "title": string, "tasks": [ { "title": string, "content": string } ] }`;

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [{ role: "system", content: "You are the Agent-King's Study Architect." }, { role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const planData = JSON.parse(completion.choices[0].message.content!);

        // 2. Store in Supabase
        const { data: plan, error: pError } = await supabase
            .from("study_plans")
            .insert({
                user_id: userId,
                topic,
                location,
                metadata: { socialLife, localLaws }
            })
            .select()
            .single();

        if (pError) throw pError;

        const tasks = planData.tasks.map((t: any, i: number) => ({
            plan_id: plan.id,
            title: t.title,
            content: t.content,
            task_order: i + 1
        }));

        const { error: tError } = await supabase.from("study_tasks").insert(tasks);
        if (tError) throw tError;

        return NextResponse.json({ success: true, planId: plan.id, planData });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
