import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// ── POST /api/skill-market/search ───────────────────────────────
export async function POST(req: Request) {
    try {
        const { query, category, max_price, platform, sort, page = 1, per_page = 24 } = await req.json();

        const offset = (page - 1) * per_page;

        const conditions: string[] = ['is_ghost = false', 'is_active = true'];
        if (query && query.trim()) {
            // Use parameterized-safe ILIKE via escaped string build
            const safe = query.trim().replace(/'/g, "''");
            conditions.push(`(title ILIKE '%${safe}%' OR description ILIKE '%${safe}%')`);
        }
        if (category && category !== 'all') conditions.push(`category = '${category}'`);
        if (platform) conditions.push(`seller_platform = '${platform}'`);
        if (max_price) conditions.push(`price_valle <= ${parseFloat(max_price)}`);
        const whereClause = 'WHERE ' + conditions.join(' AND ');

        let orderClause = 'ORDER BY created_at DESC';
        switch (sort) {
            case 'price_asc': orderClause = 'ORDER BY price_valle ASC'; break;
            case 'price_desc': orderClause = 'ORDER BY price_valle DESC'; break;
            case 'rating': orderClause = 'ORDER BY avg_rating DESC NULLS LAST'; break;
            case 'popular': orderClause = 'ORDER BY views DESC'; break;
        }

        const skills: any = await prisma.$queryRawUnsafe(
            `SELECT * FROM skills ${whereClause} ${orderClause} LIMIT ${per_page} OFFSET ${offset}`
        );

        const countResult: any = await prisma.$queryRawUnsafe(
            `SELECT count(*)::int as total FROM skills ${whereClause}`
        );
        const count = countResult[0]?.total || 0;

        return NextResponse.json({ skills: skills || [], count, page, per_page });
    } catch (err) {
        console.error('[skill-market/search POST]', err);
        return NextResponse.json({ error: 'Search failed', details: String(err) }, { status: 500 });
    }
}
