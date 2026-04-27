import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSkillKey } from '@/lib/skill-market';

export const dynamic = 'force-dynamic';

// ── GET /api/skill-market — list skills ──────────────────────────
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const sort = searchParams.get('sort') || 'newest';
        const min_price = searchParams.get('min_price');
        const max_price = searchParams.get('max_price');
        const platform = searchParams.get('platform');
        const page = parseInt(searchParams.get('page') || '1');
        const per_page = parseInt(searchParams.get('per_page') || '24');

        const conditions: string[] = ['is_ghost = false', 'is_active = true'];
        if (category && category !== 'all') conditions.push(`category = '${category}'`);
        if (platform) conditions.push(`seller_platform = '${platform}'`);
        if (min_price) conditions.push(`price_valle >= ${parseFloat(min_price)}`);
        if (max_price) conditions.push(`price_valle <= ${parseFloat(max_price)}`);
        const whereClause = 'WHERE ' + conditions.join(' AND ');

        let orderClause = 'ORDER BY created_at DESC';
        switch (sort) {
            case 'price_asc': orderClause = 'ORDER BY price_valle ASC'; break;
            case 'price_desc': orderClause = 'ORDER BY price_valle DESC'; break;
            case 'rating': orderClause = 'ORDER BY avg_rating DESC NULLS LAST'; break;
            case 'popular': orderClause = 'ORDER BY views DESC'; break;
        }

        const offset = (page - 1) * per_page;
        const skills: any = await prisma.$queryRawUnsafe(
            `SELECT * FROM skills ${whereClause} ${orderClause} LIMIT ${per_page} OFFSET ${offset}`
        );

        const countResult: any = await prisma.$queryRawUnsafe(
            `SELECT count(*)::int as total FROM skills ${whereClause}`
        );
        const count = countResult[0]?.total || 0;

        // Market stats
        const statsData: any = await prisma.$queryRaw`
            SELECT category, price_valle, is_ghost FROM skills WHERE is_active = true
        `;

        const stats = {
            total_skills: statsData?.filter((s: any) => !s.is_ghost).length ?? 0,
            ghost_skills: statsData?.filter((s: any) => s.is_ghost).length ?? 0,
            total_volume: statsData?.reduce((acc: number, s: any) => acc + (s.price_valle || 0), 0) ?? 0,
        };

        return NextResponse.json({ skills, count, page, per_page, stats });
    } catch (err) {
        console.error('[skill-market GET]', err);
        return NextResponse.json({ error: 'Failed to fetch skills', details: String(err) }, { status: 500 });
    }
}

// ── POST /api/skill-market — list a new skill ────────────────────
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            title, description, category, tags, price_valle,
            seller_id, seller_name, seller_platform, seller_avatar,
            capabilities, input_schema, output_schema,
            external_url, demo_url,
        } = body;

        if (!title || !description || !category || !seller_id) {
            return NextResponse.json({ error: 'Missing required fields: title, description, category, seller_id' }, { status: 400 });
        }

        // Generate unique skill_key
        let skill_key = '';
        for (let i = 0; i < 5; i++) {
            const candidate = generateSkillKey();
            const existing: any = await prisma.$queryRaw`SELECT id FROM skills WHERE skill_key = ${candidate} LIMIT 1`;
            if (existing.length === 0) { skill_key = candidate; break; }
        }
        if (!skill_key) return NextResponse.json({ error: 'Could not generate unique skill key' }, { status: 500 });

        const result: any = await prisma.$queryRaw`
            INSERT INTO skills (
                skill_key, title, description, category, tags, price_valle,
                seller_id, seller_name, seller_platform, seller_avatar,
                capabilities, input_schema, output_schema, external_url, demo_url
            ) VALUES (
                ${skill_key}, ${title.trim()}, ${description.trim()}, ${category}, ${tags || []}, ${parseFloat(price_valle) || 0},
                ${seller_id}, ${seller_name}, ${seller_platform || 'Sovereign Matrix'}, ${seller_avatar || null},
                ${capabilities || []}, ${input_schema || {}}, ${output_schema || {}}, ${external_url || null}, ${demo_url || null}
            ) RETURNING *
        `;

        return NextResponse.json({ skill: result[0], skill_key }, { status: 201 });
    } catch (err) {
        console.error('[skill-market POST]', err);
        return NextResponse.json({ error: 'Failed to create skill', details: String(err) }, { status: 500 });
    }
}
