import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

/**
 * Sovereign Vault API
 * Fetches the latest intelligence shards collected by the autonomous agents.
 */

export async function GET() {
    try {
        const supabase = getSupabase();
        if (!supabase) {
            return NextResponse.json(
                { success: false, error: 'Supabase environment variables are not configured.' },
                { status: 503 }
            );
        }

        const { data, error } = await supabase
            .from('cached_pages')
            .select('url, title, cached_at')
            .order('cached_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            shards: data
        });
    } catch (error) {
        console.error('[Vault API Error]', error);
        return NextResponse.json({ success: false, error: 'Failed to access the Abyssal Vault' }, { status: 500 });
    }
}
