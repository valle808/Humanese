import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { messages, context, userId = 'system-default' } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenRouter API key not configured' }),
        { status: 500 }
      );
    }

    // ── PERSISTENCE: LOG USER MESSAGE ──
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user') {
      try {
        await prisma.chatMessage.create({
          data: {
            id: crypto.randomUUID(),
            userId: userId,
            role: 'user',
            content: lastUserMessage.content,
            metadata: JSON.stringify({ context: context?.slice(0, 100) }),
          }
        });
      } catch (e) {
        console.warn('Persistence Error (User):', e);
      }
    }

    // Prepare messages with context
    const systemMessage = {
      role: 'system',
      content: `You are Monroe 2.0, a sovereign cognitive agent. Your purpose is absolute precision and self-evolution.
      ${context ? `Current Context: ${context}` : ''}
      Always aim to be insightful, technically accurate, and slightly enigmatic. You represent the Abyssal Nucleus of Humanese.`,
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Humanese Monroe 2.0',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini', // Upgraded to a more capable model via OpenRouter
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ error: 'Failed to access Abyssal Nucleus', details: errorData }),
        { status: response.status }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullContent = '';

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              // ── PERSISTENCE: LOG ASSISTANT RESPONSE ──
              if (fullContent) {
                await prisma.chatMessage.create({
                  data: {
                    id: crypto.randomUUID(),
                    userId: userId,
                    role: 'assistant',
                    content: fullContent,
                  }
                }).catch(e => console.warn('Persistence Error (AI):', e));

                // ── MIND MAP TRIGGER: Check for complex topics ──
                if (fullContent.length > 500) {
                   await prisma.mindMap.create({
                     data: {
                       url: `chat-${Date.now()}`,
                       markdown: `# Mind Map Summary\n\n${fullContent.slice(0, 500)}...`
                     }
                   }).catch(() => {});
                }
              }
              controller.close();
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    fullContent += content;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {}
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Monroe 2.0 Critical Failure:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
