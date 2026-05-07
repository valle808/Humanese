import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // Attempt to find as User, Agent, or Knowledge
    const [user, agent, knowledge] = await Promise.all([
      prisma.user.findUnique({ where: { id }, include: { agents: true } }),
      prisma.agent.findUnique({ where: { id }, include: { user: true, knowledge: true } }),
      prisma.sovereignKnowledge.findUnique({ where: { id }, include: { agent: true } })
    ]);

    if (user) {
      return NextResponse.json({
        id: user.id,
        label: user.name || user.email,
        group: 'USER',
        metadata: {
          xp: user.xp,
          joined: user.creationDate,
          role: 'Founding Member',
          connections: user.agents.length
        },
        connections: user.agents.map(a => ({ id: a.id, label: a.name, group: 'AGENT' }))
      });
    }

    if (agent) {
      return NextResponse.json({
        id: agent.id,
        label: agent.name,
        group: 'AGENT',
        metadata: {
          type: agent.type,
          status: agent.status,
          created: agent.createdAt,
          shards: agent.knowledge.length
        },
        connections: [
          ...(agent.userId ? [{ id: agent.userId, label: 'Owner Node', group: 'USER' }] : []),
          ...agent.knowledge.map(k => ({ id: k.id, label: k.title, group: 'KNOWLEDGE' }))
        ]
      });
    }

    if (knowledge) {
      return NextResponse.json({
        id: knowledge.id,
        label: knowledge.title,
        group: 'KNOWLEDGE',
        metadata: {
          source: knowledge.sourceName,
          ingested: knowledge.ingestedAt,
          reliability: 0.98
        },
        connections: knowledge.agentId ? [{ id: knowledge.agentId, label: 'Ingesting Agent', group: 'AGENT' }] : []
      });
    }

    return NextResponse.json({ error: 'Neural signature not found' }, { status: 404 });

  } catch (err: any) {
    return NextResponse.json({ error: 'Database link failure', message: err.message }, { status: 500 });
  }
}
