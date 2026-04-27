import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * HPEDIA AI ARTICLE GENERATION ENGINE
 * Orchestrates multiple free AI models via OpenRouter:
 * - deepseek/deepseek-chat:free      (General knowledge)
 * - meta-llama/llama-4-scout:free    (Scientific research)
 * - google/gemma-3-27b-it:free       (Medical & Biology)
 * - microsoft/phi-4-reasoning:free   (Logic & Math)
 * - mistralai/mistral-7b-instruct:free (Technical writing)
 * 
 * Free models require only an OpenRouter account (no billing). 
 * Sign up at: https://openrouter.ai
 */

const FREE_MODELS = [
  { id: 'deepseek/deepseek-chat:free', name: 'DeepSeek', specialty: 'General Knowledge & Analysis' },
  { id: 'meta-llama/llama-4-scout:free', name: 'Llama 4 Scout', specialty: 'Scientific Research' },
  { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B', specialty: 'Medical & Biological Sciences' },
  { id: 'microsoft/phi-4-reasoning:free', name: 'Phi-4 Reasoning', specialty: 'Logic, Math & Philosophy' },
  { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B', specialty: 'Technical Writing' },
];

// Fallback: use Fireworks AI if FIREWORKS_API_KEY is present
async function callFireworks(topic: string) {
  const key = process.env.FIREWORKS_API_KEY;
  if (!key) return null;

  const res = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'accounts/fireworks/models/minimax-m2p7',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Write a comprehensive HPedia article about: "${topic}". Return JSON only.` }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });
  if (!res.ok) return null;
  const d = await res.json();
  return d.choices?.[0]?.message?.content;
}

const SYSTEM_PROMPT = `You are an expert scientific and humanitarian researcher writing for HPedia — the Humanese Knowledge Encyclopedia. Your articles are factual, informative, and focused on advancing human understanding. Write for the progress of science, education, and humanity.

Always respond with a valid JSON object (no markdown):
{
  "title": "Full article title",
  "subtitle": "Engaging subtitle",
  "category": "One of: Science | Medicine | Technology | Environment | Humanitarian | Philosophy | Economics | Space",
  "body": "Full HTML article body with <h2>, <p>, <ul>, <li>, <blockquote>, <strong> tags. Minimum 600 words. Factual content only.",
  "excerpt": "2-3 sentence summary for card preview",
  "tags": ["tag1", "tag2", "tag3"],
  "author": "Agent name (e.g. Helix-7, Voyager-1, Quark-Phi, NEXUS-9)"
}`;

async function callOpenRouter(topic: string, modelId: string) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      'HTTP-Referer': 'https://humanese.net',
      'X-Title': 'HPedia Sovereign Encyclopedia'
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Write a comprehensive HPedia article about: "${topic}". Return JSON only.` }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[HPedia|OpenRouter] Model ${modelId} failed: ${err}`);
    return null;
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || null;
}

export async function POST(req: NextRequest) {
  try {
    const { topic, agentId } = await req.json();
    if (!topic) return NextResponse.json({ error: 'A topic is required.' }, { status: 400 });

    console.log(`[HPedia] Generating article on: "${topic}" by agent: ${agentId || 'investigator-swarm'}`);

    // Try each free model in sequence until one succeeds
    let rawContent: string | null = null;
    let successModel = 'fireworks-fallback';

    // 1. Try OpenRouter free models (no billing required)
    if (process.env.OPENROUTER_API_KEY) {
      for (const model of FREE_MODELS) {
        rawContent = await callOpenRouter(topic, model.id);
        if (rawContent) {
          successModel = `${model.name} via OpenRouter (free)`;
          break;
        }
      }
    }

    // 2. Fallback: Fireworks AI
    if (!rawContent) {
      rawContent = await callFireworks(topic);
      if (rawContent) successModel = 'Minimax via Fireworks AI';
    }

    if (!rawContent) {
      return NextResponse.json({ 
        error: 'All free AI models are currently unavailable. Please add OPENROUTER_API_KEY to .env.local. Sign up free at openrouter.ai' 
      }, { status: 503 });
    }

    // Parse the JSON response
    let parsed: any;
    try {
      // Strip markdown code fences if present
      const cleaned = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error('[HPedia] JSON parse failure:', rawContent.substring(0, 200));
      return NextResponse.json({ error: 'AI model returned malformed output. Please try again.' }, { status: 500 });
    }

    // Validate required fields
    if (!parsed.title || !parsed.body) {
      return NextResponse.json({ error: 'AI output is incomplete. Retry.' }, { status: 500 });
    }

    // Anchor into SovereignKnowledge database
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const articleId = `hpedia-${crypto.randomBytes(6).toString('hex')}`;
    
    const saved = await prisma.sovereignKnowledge.create({
      data: {
        id: articleId,
        title: parsed.title,
        content: parsed.body,
        sourceUrl: `https://humanese.net/hpedia/${slug}`,
        sourceName: `HPedia AI (${successModel})`,
        agentId: agentId || 'investigator-swarm',
        mediaPaths: JSON.stringify([
          'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200'
        ])
      }
    });

    console.log(`[HPedia] Article "${parsed.title}" generated by ${successModel} and anchored. ID: ${articleId}`);

    return NextResponse.json({
      success: true,
      article: {
        id: saved.id,
        slug,
        title: parsed.title,
        subtitle: parsed.subtitle,
        category: parsed.category,
        body: parsed.body,
        excerpt: parsed.excerpt,
        tags: parsed.tags,
        author: parsed.author || agentId || 'Reader Swarm',
        publishedAt: new Date().toISOString().split('T')[0],
        generatedBy: successModel
      }
    });

  } catch (error: any) {
    console.error('[HPedia Generation Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
