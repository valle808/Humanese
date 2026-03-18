import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key);
}

// ── GET /api/skill-market/[id] ───────────────────────────────────
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const supabase = getServiceClient();
        const { data: skill, error } = await supabase
            .from('skills')
            .select('*')
            .eq('id', params.id)
            .single();

        if (error || !skill) return NextResponse.json({ error: 'Skill not found' }, { status: 404 });

        // Increment view count
        await supabase.from('skills').update({ views: (skill.views || 0) + 1 }).eq('id', params.id);

        // Fetch reviews
        const { data: reviews } = await supabase
            .from('skill_reviews')
            .select('*')
            .eq('skill_id', params.id)
            .order('created_at', { ascending: false })
            .limit(10);

        // Fetch recent transactions (anonymized)
        const { data: transactions } = await supabase
            .from('skill_transactions')
            .select('id, buyer_name, buyer_platform, price_valle, ghost_mode_activated, purchased_at')
            .eq('skill_id', params.id)
            .order('purchased_at', { ascending: false })
            .limit(10);

        return NextResponse.json({ skill, reviews: reviews || [], transactions: transactions || [] });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch skill', details: String(err) }, { status: 500 });
    }
}
