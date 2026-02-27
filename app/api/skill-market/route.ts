import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateSkillKey } from '@/lib/skill-market';

// Use service role to bypass RLS for admin operations
function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key);
}

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

        const supabase = getServiceClient();

        let query = supabase
            .from('skills')
            .select('*', { count: 'exact' })
            .eq('is_ghost', false)
            .eq('is_active', true);

        if (category && category !== 'all') query = query.eq('category', category);
        if (platform) query = query.eq('seller_platform', platform);
        if (min_price) query = query.gte('price_valle', parseFloat(min_price));
        if (max_price) query = query.lte('price_valle', parseFloat(max_price));

        // Sorting
        switch (sort) {
            case 'price_asc': query = query.order('price_valle', { ascending: true }); break;
            case 'price_desc': query = query.order('price_valle', { ascending: false }); break;
            case 'rating': query = query.order('avg_rating', { ascending: false, nullsFirst: false }); break;
            case 'popular': query = query.order('views', { ascending: false }); break;
            case 'newest':
            default: query = query.order('created_at', { ascending: false }); break;
        }

        // Pagination
        const from = (page - 1) * per_page;
        query = query.range(from, from + per_page - 1);

        const { data: skills, count, error } = await query;
        if (error) throw error;

        // Market stats
        const { data: statsData } = await supabase
            .from('skills')
            .select('category, price_valle, is_ghost')
            .eq('is_active', true);

        const stats = {
            total_skills: statsData?.filter(s => !s.is_ghost).length ?? 0,
            ghost_skills: statsData?.filter(s => s.is_ghost).length ?? 0,
            total_volume: statsData?.reduce((acc, s) => acc + (s.price_valle || 0), 0) ?? 0,
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

        const supabase = getServiceClient();

        // Generate unique skill_key — retry up to 5 times on collision
        let skill_key = '';
        for (let i = 0; i < 5; i++) {
            const candidate = generateSkillKey();
            const { data: existing } = await supabase.from('skills').select('id').eq('skill_key', candidate).single();
            if (!existing) { skill_key = candidate; break; }
        }
        if (!skill_key) return NextResponse.json({ error: 'Could not generate unique skill key' }, { status: 500 });

        const { data: skill, error } = await supabase
            .from('skills')
            .insert({
                skill_key,
                title: title.trim(),
                description: description.trim(),
                category,
                tags: tags || [],
                price_valle: parseFloat(price_valle) || 0,
                seller_id,
                seller_name,
                seller_platform: seller_platform || 'Humanese',
                seller_avatar: seller_avatar || null,
                capabilities: capabilities || [],
                input_schema: input_schema || {},
                output_schema: output_schema || {},
                external_url: external_url || null,
                demo_url: demo_url || null,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ skill, skill_key }, { status: 201 });
    } catch (err) {
        console.error('[skill-market POST]', err);
        return NextResponse.json({ error: 'Failed to create skill', details: String(err) }, { status: 500 });
    }
}
