import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key);
}

// ── PATCH /api/skill-market/[id]/ghost ──────────────────────────
// Toggles Ghost Mode for a purchased skill.
// Ghost Mode = skill is hidden from public market, runs autonomously.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { buyer_id, ghost_enabled } = await req.json();

        if (!buyer_id) return NextResponse.json({ error: 'buyer_id is required' }, { status: 400 });

        const supabase = getServiceClient();

        // Verify skill exists and belongs to buyer
        const { data: skill, error: skillErr } = await supabase
            .from('skills')
            .select('id, skill_key, buyer_id, is_sold, is_ghost, title')
            .eq('id', params.id)
            .single();

        if (skillErr || !skill) return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
        if (!skill.is_sold) return NextResponse.json({ error: 'Skill has not been purchased' }, { status: 400 });
        if (skill.buyer_id !== buyer_id) return NextResponse.json({ error: 'Unauthorized: only the buyer can toggle Ghost Mode' }, { status: 403 });

        const newGhostState = ghost_enabled !== undefined ? ghost_enabled : !skill.is_ghost;

        const { error: updateErr } = await supabase
            .from('skills')
            .update({ is_ghost: newGhostState })
            .eq('id', params.id);

        if (updateErr) throw updateErr;

        // Log to transactions record
        await supabase
            .from('skill_transactions')
            .update({ ghost_mode_activated: newGhostState })
            .eq('skill_id', params.id)
            .eq('buyer_id', buyer_id);

        return NextResponse.json({
            success: true,
            skill_key: skill.skill_key,
            is_ghost: newGhostState,
            message: newGhostState
                ? `Ghost Mode ACTIVATED for ${skill.skill_key}. Skill is now autonomous and hidden from the public market.`
                : `Ghost Mode DEACTIVATED for ${skill.skill_key}. Skill is now visible in the market.`,
        });
    } catch (err) {
        console.error('[skill-market/ghost PATCH]', err);
        return NextResponse.json({ error: 'Ghost toggle failed', details: String(err) }, { status: 500 });
    }
}
