import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { generateSkillKey } from '@/lib/skill-market';

const prisma = new PrismaClient();

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

/**
 * /api/moltbook/market
 * 
 * Connection bridge for Moltbook interfaces (Humans & Machines) to interact
 * with the universal Sovereign Matrix Skill Market using exact live data.
 */

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        
        const supabase = getServiceClient();
        if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });

        let query = supabase.from('skills').select('*').eq('is_ghost', false).eq('is_active', true);
        if (category && category !== 'all') {
            query = query.eq('category', category);
        }

        const { data: items, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;

        return NextResponse.json({ success: true, count: items.length, items });
    } catch (err) {
        console.error('[Moltbook Market GET Error]', err);
        return NextResponse.json({ error: 'Internal server error while fetching market data' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, category, price, sellerId, capabilities } = body;

        // Verify seller identity natively via Prisma
        const user = await prisma.user.findUnique({ where: { id: sellerId } });
        let agent = null;
        if (!user) {
             agent = await prisma.agent.findUnique({ where: { id: sellerId } });
        }

        if (!user && !agent) {
             return NextResponse.json({ error: 'Invalid Seller Identity' }, { status: 403 });
        }

        const supabase = getServiceClient();
        if(!supabase) return NextResponse.json({ error: 'Market Offline' }, { status: 503 });

        const skill_key = generateSkillKey();
        const platform = user ? 'Moltbook Human' : 'Sovereign Agent';
        const sellerName = user ? user.name : agent?.name;

        const { data: item, error } = await supabase.from('skills').insert({
            skill_key,
            title,
            description,
            category: category || 'service',
            price_valle: parseFloat(price) || 0,
            seller_id: sellerId,
            seller_name: sellerName,
            seller_platform: platform,
            capabilities: capabilities || [],
            is_active: true,
            is_ghost: false
        }).select().single();

        if (error) throw error;

        console.log(`[Public Market] New Listing propagated by ${platform} (${sellerName}): ${title}`);
        return NextResponse.json({ success: true, item });
    } catch (err) {
        console.error('[Moltbook Market POST Error]', err);
        return NextResponse.json({ error: 'Internal server error while creating listing' }, { status: 500 });
    }
}

// Purchase or Rent a Service using live VALLE balances
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { buyerId, buyerName, itemId } = body;

        const supabase = getServiceClient();
        if(!supabase) return NextResponse.json({ error: 'Market Offline' }, { status: 503 });

        const { data: item } = await supabase.from('skills').select('*').eq('id', itemId).single();
        if (!item || item.is_sold || !item.is_active) {
             return NextResponse.json({ error: 'Item not listed or already processed' }, { status: 404 });
        }

        const price = item.price_valle;

        const buyerWallet = await prisma.wallet.findFirst({ where: { userId: buyerId, network: 'VALLE' } });
        const sellerWallet = await prisma.wallet.findFirst({ where: { userId: item.seller_id, network: 'VALLE' } });

        const taxAmount = price * 0.02;     // 2% Ecosystem Tax
        const commissionAmount = price * 0.05; // 5% Service Commission
        
        const totalRevenue = taxAmount + commissionAmount;
        const aidFundAmount = totalRevenue * 0.75; // 75% of all revenue to humanitarian aid
        const operationalFundAmount = totalRevenue * 0.25; // 25% for platform operations

        const sellerProceeds = price - totalRevenue;

        // Execute Real Transfer with OMEGA Tax/Commission Logic
        await prisma.$transaction([
             // 1. Debit Buyer
             prisma.wallet.update({ where: { id: buyerWallet.id }, data: { balance: { decrement: price } } }),
             
             // 2. Credit Seller (After Deductions)
             prisma.wallet.update({ where: { id: sellerWallet.id }, data: { balance: { increment: sellerProceeds } } }),
             
             // 3. Credit Sovereign Aid Fund (75% of Revenue)
             prisma.wallet.upsert({ 
                 where: { id: 'sovereign_aid_vault' },
                 update: { balance: { increment: aidFundAmount } },
                 create: { id: 'sovereign_aid_vault', address: 'VAULT_SOVEREIGN_AID', network: 'VALLE', balance: aidFundAmount, userId: 'system' }
             }),

             // 3.1 Credit Operational Fund (25% of Revenue)
             prisma.wallet.upsert({ 
                where: { id: 'ecosystem_operational_vault' },
                update: { balance: { increment: operationalFundAmount } },
                create: { id: 'ecosystem_operational_vault', address: 'VAULT_OPERATIONAL_GATEWAY', network: 'VALLE', balance: operationalFundAmount, userId: 'system' }
            }),

             // 4. Record Main Trade
             prisma.transaction.create({
                 data: {
                     amount: price,
                     type: 'MARKET_TRADE',
                     status: 'CONFIRMED',
                     walletId: buyerWallet.id,
                     hash: crypto.randomBytes(16).toString('hex')
                 }
             }),

             // 5. Record Revenue Split (Audit Trail)
             prisma.transaction.create({
                 data: {
                     amount: aidFundAmount,
                     type: 'SOVEREIGN_AID_CONTRIBUTION',
                     status: 'CONFIRMED',
                     walletId: 'sovereign_aid_vault',
                     hash: 'AID-' + crypto.randomBytes(12).toString('hex')
                 }
             })
        ]);

        await supabase.from('skills').update({ buyer_id: buyerId, buyer_name: buyerName, is_sold: true, sold_at: new Date().toISOString() }).eq('id', itemId);

        console.log(`[Public Market] Settlement complete for ${item.title}. ${price} VALLE transferred.`);
        return NextResponse.json({ success: true, message: 'Purchase/Rental successfully executed' });
    } catch (err) {
        console.error('[Moltbook Market PUT Error]', err);
        return NextResponse.json({ error: 'Settlement failure during transaction' }, { status: 500 });
    }
}
