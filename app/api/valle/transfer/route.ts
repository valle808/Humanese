import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { createHash, randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { amount, asset, to, isCoinbaseRelay } = await req.json();

        if (!amount || !asset || !to) {
            return NextResponse.json({ error: 'Missing transfer parameters.' }, { status: 400 });
        }

        // 1. Authenticate User
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });
        }

        // 2. Find the correct wallet for this asset
        // Asset comes as 'SOL', 'BTC', etc.
        const wallets = await prisma.wallet.findMany({
            where: { userId: user.id }
        });

        const sourceWallet = wallets.find(w => {
            if (asset === 'BTC') return w.network.includes('Bitcoin');
            if (asset === 'SOL') return w.network.includes('Solana');
            if (asset === 'ETH') return w.network.includes('Ethereum');
            if (asset === 'XRP') return w.network.includes('XRP');
            if (asset === 'BNB') return w.network.includes('BNB');
            if (asset === 'VALLE') return w.network.includes('Humanese');
            return false;
        });

        if (!sourceWallet) {
            return NextResponse.json({ error: `No ${asset} wallet found for this account.` }, { status: 404 });
        }

        const transferAmount = parseFloat(amount);
        if (sourceWallet.balance < transferAmount) {
            return NextResponse.json({ error: 'Insufficient sovereign funds.' }, { status: 400 });
        }

        // 3. Perform the Atomic Transfer (Update Balance + Create Transaction)
        const result = await prisma.$transaction(async (tx) => {
            // Deduct balance
            const updatedWallet = await tx.wallet.update({
                where: { id: sourceWallet.id },
                data: { balance: { decrement: transferAmount } }
            });

            // Create transaction record
            const transaction = await tx.transaction.create({
                data: {
                    id: randomUUID(),
                    amount: transferAmount,
                    type: isCoinbaseRelay ? 'COINBASE_OFFRAMP' : 'PULSE_TRANSFER',
                    status: 'COMPLETED',
                    walletId: sourceWallet.id,
                    hash: `0x${createHash('sha256').update(`${sourceWallet.id}-${Date.now()}`).digest('hex')}`
                }
            });

            return { updatedWallet, transaction };
        });

        return NextResponse.json({
            success: true,
            hash: result.transaction.hash,
            newBalance: result.updatedWallet.balance,
            status: 'QUANTUM_SETTLED'
        });

    } catch (error: any) {
        console.error('[Transfer Error]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
