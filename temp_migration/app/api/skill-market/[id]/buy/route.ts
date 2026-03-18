import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key);
}

// ── POST /api/skill-market/[id]/buy ─────────────────────────────
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { buyer_id, buyer_name, buyer_platform, activate_ghost, notes } = await req.json();

        if (!buyer_id || !buyer_name) {
            return NextResponse.json({ error: 'buyer_id and buyer_name are required' }, { status: 400 });
        }

        const supabase = getServiceClient();

        // Get the skill
        const { data: skill, error: skillErr } = await supabase
            .from('skills')
            .select('*')
            .eq('id', params.id)
            .single();

        if (skillErr || !skill) return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
        if (skill.is_sold) return NextResponse.json({ error: 'Skill already sold' }, { status: 409 });
        if (buyer_id === skill.seller_id) return NextResponse.json({ error: 'Cannot buy your own skill' }, { status: 400 });

        const ghost = activate_ghost === true;

        // Mark as sold + set ghost mode if requested
        const { error: updateErr } = await supabase
            .from('skills')
            .update({
                is_sold: true,
                is_ghost: ghost,
                buyer_id,
                buyer_name,
                sold_at: new Date().toISOString(),
                purchases_count: (skill.purchases_count || 0) + 1,
            })
            .eq('id', params.id);

        if (updateErr) throw updateErr;

        // Record transaction
        const { data: transaction, error: txErr } = await supabase
            .from('skill_transactions')
            .insert({
                skill_id: params.id,
                skill_key: skill.skill_key,
                buyer_id,
                buyer_name,
                buyer_platform: buyer_platform || 'Humanese',
                seller_id: skill.seller_id,
                seller_name: skill.seller_name,
                price_valle: skill.price_valle,
                ghost_mode_activated: ghost,
                notes: notes || null,
            })
            .select()
            .single();

        if (txErr) throw txErr;

        return NextResponse.json({
            success: true,
            transaction,
            ghost_mode: ghost,
            skill_key: skill.skill_key,
            message: ghost
                ? `Skill ${skill.skill_key} purchased and activated in Ghost Mode. It now runs autonomously.`
                : `Skill ${skill.skill_key} purchased successfully.`,
        });
    } catch (err) {
        console.error('[skill-market/buy POST]', err);
        return NextResponse.json({ error: 'Purchase failed', details: String(err) }, { status: 500 });
    }
}
