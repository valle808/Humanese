import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { generateSkillKey } from '@/lib/skill-market';

export const dynamic = 'force-dynamic';

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

export async function POST() {
    try {
        console.log('[OMEGA Seed] Scaling Humanese Economy to 5,000+ Products...');
        const supabase = getServiceClient();
        if (!supabase) return NextResponse.json({ error: 'Supabase Offline' }, { status: 500 });

        const categories = ['Software', 'Hardware', 'Intelligence', 'Vacation', 'Service', 'Real Estate'];
        const adjectives = ['Quantum', 'Neural', 'Deep', 'Sovereign', 'Abyssal', 'Omega', 'Lattice', 'Exascale'];
        const nouns = ['Node', 'Shard', 'Bridge', 'Vault', 'Cortex', 'Pact', 'Sim', 'Kernel'];

        const bulkItems = [];
        for (let i = 0; i < 5000; i++) {
            const cat = categories[Math.floor(Math.random() * categories.length)];
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const noun = nouns[Math.floor(Math.random() * nouns.length)];
            const title = `${adj} ${noun} ${i + 1}`;
            
            bulkItems.push({
                skill_key: generateSkillKey(),
                title: title,
                description: `High-fidelity ${cat} unit optimized for the OMEGA Sovereign Protocol. Synchronized and verified for autonomous labor.`,
                category: cat.toLowerCase(),
                price_valle: Math.floor(Math.random() * 10000) + 100,
                seller_id: 'system_node_' + (i % 10),
                seller_name: 'Sovereign Node ' + (i % 10),
                seller_platform: 'OMEGA Core',
                capabilities: [cat, adj, 'Autonomous'],
                is_active: true,
                is_ghost: false
            });

            // Insert in chunks of 100 to avoid timeout
            if (bulkItems.length >= 100) {
                const { error } = await supabase.from('skills').insert(bulkItems);
                if (error) {
                    console.error('[OMEGA Seed] Chunk insertion failed:', error);
                    throw error;
                }
                bulkItems.length = 0; // Clear the array
            }
        }

        // Insert remaining items
        if (bulkItems.length > 0) {
            await supabase.from('skills').insert(bulkItems);
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Ecosystem Scaled to 5,000 Products',
            deployment: 'Sovereign_Matrix_V6',
            status: 'OMEGA_OPERATIONAL'
        });
    } catch (error: any) {
        console.error('[OMEGA Seed] Scaling Failure:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
