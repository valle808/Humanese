import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, amount, method, donorIdentity, currency = 'USD', paymentIntentId } = body;

        if (action === 'create-intent') {
            if (!amount) return NextResponse.json({ error: 'Amount required.' }, { status: 400 });
            
            const numericAmount = parseFloat(amount);
            
            const stripe = getStripe();
            if (!stripe) {
                return NextResponse.json({ error: 'Stripe is currently unavailable.' }, { status: 503 });
            }
            
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(numericAmount * 100), // Stripe expects cents
                currency: currency.toLowerCase(),
                automatic_payment_methods: { enabled: true },
                metadata: {
                    type: 'GLOBAL_DONATION',
                    donorIdentity: donorIdentity || 'ANONYMOUS_PEER'
                }
            });

            return NextResponse.json({ 
                success: true, 
                clientSecret: paymentIntent.client_secret 
            });
        }

        if (action === 'settle') {
            if (!amount || !method) {
                return NextResponse.json({ error: 'Donation settlement requires amount and method.' }, { status: 400 });
            }

            const numericAmount = parseFloat(amount);
            console.log(`[Donation Sync] Settling ${numericAmount} ${currency} via ${method} from ${donorIdentity || 'ANONYMOUS'}`);

            // ── OMEGA SETTLEMENT PROTOCOL ──
            const transaction = await prisma.$transaction(async (tx) => {
                // 1. Credit Sovereign Aid Vault
                const wallet = await tx.wallet.upsert({
                    where: { id: 'sovereign_aid_vault' },
                    update: { balance: { increment: numericAmount } },
                    create: { 
                        id: 'sovereign_aid_vault', 
                        address: 'VAULT_SOVEREIGN_AID', 
                        network: 'VALLE', 
                        balance: numericAmount, 
                        userId: 'system' 
                    }
                });

                // 2. Record Detailed Validation
                const record = await tx.transaction.create({
                    data: {
                        amount: numericAmount,
                        type: 'GLOBAL_DONATION',
                        status: 'CONFIRMED',
                        walletId: wallet.id,
                        hash: paymentIntentId || ('DONATE-' + crypto.randomBytes(16).toString('hex')),
                        metadata: JSON.stringify({
                            donor: donorIdentity || 'PEER_ONYMOUS',
                            method,
                            currency,
                            timestamp: new Date().toISOString(),
                            mandate: '100%_DIRECT_AID'
                        })
                    }
                });

                return record;
            });

            console.log(`[Donation Sync] Settled. Hash: ${transaction.hash}`);

            return NextResponse.json({
                success: true,
                msg: `Sovereign Matrix has received your contribution. Aid Distributed.`,
                hash: transaction.hash,
                allocatedTo: 'Sovereign_Aid_Fund',
                amount: numericAmount,
                unit: currency
            });
        }

        return NextResponse.json({ error: 'Invalid operation.' }, { status: 400 });

    } catch (error: any) {
        console.error('[Donation Engine Error]', error);
        return NextResponse.json({ error: 'Donation Engine Collapse: ' + error.message }, { status: 500 });
    }
}

