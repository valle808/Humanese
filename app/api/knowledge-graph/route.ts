import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 60; // Cache for 60 seconds to prevent DB connection exhaustion

export async function GET() {
  try {
    // Fetch all relevant entities from the Sovereign database sequentially to avoid max connection limits
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, xp: true, creationDate: true }
    });
    
    const agents = await prisma.agent.findMany({
      select: { id: true, name: true, type: true, status: true, userId: true, createdAt: true }
    });
    
    const knowledge = await prisma.sovereignKnowledge.findMany({
      select: { id: true, title: true, sourceName: true, agentId: true, ingestedAt: true }
    });

    const nodes: any[] = [];
    const links: any[] = [];

    // 1. Process Users
    users.forEach(u => {
      nodes.push({
        id: u.id,
        label: u.name || u.email || 'Anonymous Entity',
        type: 'ENTITY',
        group: 'USER',
        metadata: { xp: u.xp, registered: u.creationDate },
        timestamp: u.creationDate.toISOString()
      });
    });

    // 2. Process Agents
    agents.forEach(a => {
      nodes.push({
        id: a.id,
        label: a.name,
        type: 'CONVERSATION', // Using existing types from SovereignGraph
        group: 'AGENT',
        metadata: { type: a.type, status: a.status },
        timestamp: a.createdAt.toISOString()
      });

      // Link Agent to User
      if (a.userId) {
        links.push({
          source: a.userId,
          target: a.id,
          relationship: 'CONTROLS',
          weight: 2
        });
      }
    });

    // 3. Process Knowledge Shards
    knowledge.forEach(k => {
      nodes.push({
        id: k.id,
        label: k.title,
        type: 'PREDICTION', // Mapped as Prediction for visual orange glow
        group: 'KNOWLEDGE',
        metadata: { source: k.sourceName },
        timestamp: k.ingestedAt.toISOString()
      });

      // Link Knowledge to Ingesting Agent
      if (k.agentId) {
        links.push({
          source: k.agentId,
          target: k.id,
          relationship: 'INGESTED',
          weight: 1
        });
      }
    });

    // Return the dynamic real-time graph
    return NextResponse.json({ nodes, links });

  } catch (err: any) {
    console.error('[Atlas API Error]', err);
    return NextResponse.json({ error: 'Failed to load sovereign graph', message: err.message }, { status: 500 });
  }
}
