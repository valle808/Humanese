import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key);
}

// ── POST /api/skill-market/search ───────────────────────────────
export async function POST(req: Request) {
    try {
        const { query, category, max_price, platform, sort, page = 1, per_page = 24 } = await req.json();

        const supabase = getServiceClient();
        const from = (page - 1) * per_page;

        let dbQuery = supabase
            .from('skills')
            .select('*', { count: 'exact' })
            .eq('is_ghost', false)
            .eq('is_active', true);

        // Full-text search
        if (query && query.trim()) {
            dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
        }

        if (category && category !== 'all') dbQuery = dbQuery.eq('category', category);
        if (platform) dbQuery = dbQuery.eq('seller_platform', platform);
        if (max_price) dbQuery = dbQuery.lte('price_valle', parseFloat(max_price));

        switch (sort) {
            case 'price_asc': dbQuery = dbQuery.order('price_valle', { ascending: true }); break;
            case 'price_desc': dbQuery = dbQuery.order('price_valle', { ascending: false }); break;
            case 'rating': dbQuery = dbQuery.order('avg_rating', { ascending: false, nullsFirst: false }); break;
            case 'popular': dbQuery = dbQuery.order('views', { ascending: false }); break;
            default: dbQuery = dbQuery.order('created_at', { ascending: false }); break;
        }

        dbQuery = dbQuery.range(from, from + per_page - 1);

        const { data: skills, count, error } = await dbQuery;
        if (error) throw error;

        return NextResponse.json({ skills: skills || [], count: count || 0, page, per_page });
    } catch (err) {
        console.error('[skill-market/search POST]', err);
        return NextResponse.json({ error: 'Search failed', details: String(err) }, { status: 500 });
    }
}
