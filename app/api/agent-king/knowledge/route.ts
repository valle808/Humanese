import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const knowledge = await prisma.sovereignKnowledge.findMany({
            take: 10,
            orderBy: { ingestedAt: 'desc' }
        });

        // Map to UI format
        const formattedKnowledge = knowledge.map(k => ({
            id: k.id,
            title: k.title,
            topic: 'Intelligence', // Example category
            extractedBy: k.agentId,
            extractedAt: k.ingestedAt,
            summary: k.content.substring(0, 200) + '...',
            keyFacts: [k.sourceName, 'Neural Verification: Optimal'],
            sovereignInsight: 'Knowledge shard ingested and verified by the Abyssal Core.'
        }));

        return NextResponse.json({ entries: formattedKnowledge, total: formattedKnowledge.length });
