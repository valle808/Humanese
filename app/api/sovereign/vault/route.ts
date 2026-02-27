import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Sovereign Vault API
 * Fetches the latest intelligence shards collected by the autonomous agents.
 */

export async function GET() {
    try {
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
