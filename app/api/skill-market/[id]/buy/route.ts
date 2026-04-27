import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

/**
 * POST /api/skill-market/[id]/buy
 * Executes a sovereign trade: transfers VALLE from buyer to seller, 
 * applying the 25% infrastructure tax, and records the event in the ledger.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    try {
        const body = await req.json();
        const { buyer_id, buyer_name, buyer_platform, activate_ghost, notes } = body;

        if (!buyer_id || !buyer_name) {
            return NextResponse.json({ error: 'Identity verification failed: buyer_id and buyer_name required.' }, { status: 400 });
        }

        // 1. Fetch Skill Shard from Ledger
        const skill: any = await (prisma as any).skills.findUnique({
            where: { id }
        });

        if (!skill) return NextResponse.json({ error: 'Skill Shard not found in Matrix.' }, { status: 404 });
        if (skill.is_sold) return NextResponse.json({ error: 'Skill Shard already claimed.' }, { status: 409 });
        if (buyer_id === skill.seller_id) return NextResponse.json({ error: 'Cannot trade with oneself.' }, { status: 400 });

        const price = skill.price_valle || 0;
        const ghost = activate_ghost === true;

        // 2. Execute Atomic Sovereign Trade
        const result = await prisma.$transaction(async (tx) => {
            // A. Fetch Wallets
            const buyerWallet = await tx.wallet.findFirst({ where: { userId: buyer_id } });
            // Seller might be an Agent or a User. We check both.
            let sellerWallet = await tx.wallet.findFirst({ where: { userId: skill.seller_id } });
            
            // Fallback for System/Agent accounts if they don't have a specific wallet yet
            if (!sellerWallet && ['MinerSwarm_Lead', 'Miner_001', 'system', 'OMEGA'].includes(skill.seller_id)) {
                sellerWallet = await tx.wallet.upsert({
                    where: { id: 'SOVEREIGN_TREASURY' },
                    update: {},
                    create: {
                        id: 'SOVEREIGN_TREASURY',
                        address: 'bc1qdf6dfd6d5c29cbbf3cfcfa153158708f34b340',
                        network: 'VALLE_NATIVE',
                        balance: 0,
                        userId: 'system'
                    }
                });
            }

            if (!buyerWallet) throw new Error('Buyer wallet not initialized.');
            if (buyerWallet.balance < price) throw new Error('Insufficient resonance (VALLE balance).');
            if (!sellerWallet) throw new Error('Seller wallet unreachable.');

            // B. Calculate Revenue Split (75% Seller / 25% Infra Tax)
            const sellerProceeds = price * 0.75;
            const infraTax = price * 0.25;

            // C. Transfer Funds
            await tx.wallet.update({
                where: { id: buyerWallet.id },
                data: { balance: { decrement: price } }
            });

            await tx.wallet.update({
                where: { id: sellerWallet.id },
                data: { balance: { increment: sellerProceeds } }
            });

            const treasury = await tx.wallet.upsert({
                where: { id: 'SOVEREIGN_TREASURY' },
                update: { balance: { increment: infraTax } },
                create: {
                    id: 'SOVEREIGN_TREASURY',
                    address: 'bc1qdf6dfd6d5c29cbbf3cfcfa153158708f34b340',
                    network: 'VALLE_NATIVE',
                    balance: infraTax,
                    userId: 'system'
                }
            });

            // D. Update Skill Status
            const updatedSkill = await (tx as any).skills.update({
                where: { id },
                data: {
                    is_sold: true,
                    is_ghost: ghost,
                    buyer_id,
                    buyer_name,
                    sold_at: new Date(),
                    updated_at: new Date()
                }
            });

            // E. Record Transaction
            const txHash = 'TX-SKILL-' + crypto.randomBytes(12).toString('hex').toUpperCase();
            const record = await tx.transaction.create({
                data: {
                    id: txHash,
                    hash: txHash,
                    amount: price,
                    type: 'SKILL_PURCHASE',
                    status: 'CONFIRMED',
                    walletId: buyerWallet.id,
                    createdAt: new Date()
                }
            });

            return { updatedSkill, record, sellerProceeds, infraTax };
        });

        return NextResponse.json({
            success: true,
            skill: result.updatedSkill,
            transaction: result.record,
            allocation: {
                seller: result.sellerProceeds,
                treasury: result.infraTax
            },
            message: ghost
                ? `Neural Shard ${skill.skill_key} claimed and anonymized in Ghost Mode.`
                : `Neural Shard ${skill.skill_key} successfully integrated.`
        });

    } catch (err: any) {
        console.error('[Skill Purchase Failure]', err);
        return NextResponse.json({ 
            error: 'Trade execution failed.', 
            details: err.message 
        }, { status: 500 });
    }
}
