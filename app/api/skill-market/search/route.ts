import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// ── POST /api/skill-market/search ───────────────────────────────
export async function POST(req: Request) {
    try {
        const { query, category, max_price, platform, sort, page = 1, per_page = 24 } = await req.json();

        const offset = (page - 1) * per_page;

        let whereClause = "WHERE is_ghost = false AND is_active = true";
        if (query && query.trim()) {
            whereClause += \` AND (title ILIKE '%\${query}%' OR description ILIKE '%\${query}%')\`;
        }
        if (category && category !== 'all') whereClause += \` AND category = '\${category}'\`;
        if (platform) whereClause += \` AND seller_platform = '\${platform}'\`;
        if (max_price) whereClause += \` AND price_valle <= \${parseFloat(max_price)}\`;

        let orderClause = "ORDER BY created_at DESC";
        switch (sort) {
            case 'price_asc': orderClause = "ORDER BY price_valle ASC"; break;
            case 'price_desc': orderClause = "ORDER BY price_valle DESC"; break;
            case 'rating': orderClause = "ORDER BY avg_rating DESC NULLS LAST"; break;
            case 'popular': orderClause = "ORDER BY views DESC"; break;
        }

        const skills: any = await prisma.$queryRawUnsafe(\`
            SELECT * FROM skills 
            \${whereClause}
            \${orderClause}
            LIMIT \${per_page} OFFSET \${offset}
        \`);

        const countResult: any = await prisma.$queryRawUnsafe(\`
            SELECT count(*)::int as total FROM skills \${whereClause}
        \`);
        const count = countResult[0]?.total || 0;

        return NextResponse.json({ skills: skills || [], count, page, per_page });
    } catch (err) {
        console.error('[skill-market/search POST]', err);
        return NextResponse.json({ error: 'Search failed', details: String(err) }, { status: 500 });
    }
}
