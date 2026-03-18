import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Resilient Supabase client initialization to prevent build-time crashes
const getSupabase = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    try {
        return createClient(url, key);
    } catch (e) {
        console.error('[Supabase Init Error]', e);
        return null;
    }
};

/**
 * Sovereign Vault API
 * Fetches the latest intelligence shards collected by the autonomous agents.
 */
export async function GET() {
    const supabase = getSupabase();
    
    if (!supabase) {
        console.warn('[Vault API] Supabase client not initialized - missing environment variables.');
        return NextResponse.json({ 
            success: false, 
            error: 'Abyssal Vault is currently offline (Service Configuration Error)' 
        }, { status: 503 });
    }

    try {
        const { data, error } = await supabase
            .from('cached_pages')
            .select('url, title, cached_at')
            .order('cached_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            shards: data || []
        });
    } catch (error) {
        console.error('[Vault API Error]', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to access the Abyssal Vault' 
        }, { status: 500 });
    }
}
