import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '20');

    const articles = await prisma.sovereignKnowledge.findMany({
      where: {
        AND: [
          search ? { title: { contains: search, mode: 'insensitive' } } : {},
          category ? { sourceName: { contains: category, mode: 'insensitive' } } : {}
        ]
      },
      take: limit,
      orderBy: { ingestedAt: 'desc' }
    });

    return NextResponse.json({
      total: articles.length,
      articles: articles.map(a => ({
        id: a.id,
        title: a.title,
        excerpt: a.content.substring(0, 250) + '...',
        slug: `dynamic-${a.id}`,
        sourceName: a.sourceName,
        agentId: a.agentId,
        publishedAt: a.ingestedAt
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
