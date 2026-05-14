import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

/**
 * GET /api/wallet/private
 * Returns the private wallet data for the authenticated entity.
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Get session from headers (Authorization: Bearer <token>)
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Authentication required. No token found.' }, { status: 401 });
    }

    // Initialize Supabase client inside the request handler
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 2. Verify session with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('[Wallet API Auth Error]', authError);
      return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 });
    }

    console.log(`[Wallet API] Request for user: ${user.id} (${user.email})`);

    // 3. Fetch Wallets from Prisma
    let wallets = await prisma.wallet.findMany({
      where: { userId: user.id },
      include: { Transaction: true }
    });

    console.log(`[Wallet API] Found ${wallets.length} wallets in DB for ${user.id}`);

    // 4. Create primary wallet if none exist (Lazy provisioning)
    if (wallets.length === 0) {
      console.log(`[Wallet API] Provisioning new wallet for ${user.id}`);
      const crypto = await import('crypto');
      const entityType = user.user_metadata?.entityType || 'human';
      const walletAddress = `HMN-${entityType.toUpperCase()}-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
      
      const newWallet = await prisma.wallet.create({
        data: {
          id: `wallet-${user.id}`,
          address: walletAddress,
          network: 'Humanese Sovereign Network',
          balance: 500.0,
          userId: user.id
        }
      });
      wallets = [{ ...newWallet, Transaction: [] }];
    }

    // Collect all transactions
    const allTransactions = wallets.flatMap((w: any) => 
      (w.Transaction || []).map((t: any) => ({
        id: t.id,
        type: t.type.toLowerCase(),
        amount: t.amount,
        currency: w.network.includes('Bitcoin') ? 'BTC' : (w.network.includes('Solana') ? 'SOL' : (w.network.includes('Ethereum') ? 'ETH' : (w.network.includes('XRP') ? 'XRP' : (w.network.includes('BNB') ? 'BNB' : 'VALLE')))),
        status: t.status.toLowerCase(),
        date: t.createdAt.toLocaleDateString(),
        hash: t.hash,
        network: w.network
      }))
    ).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      wallets: wallets.map(w => ({
        address: w.address,
        balance: w.balance,
        currency: w.network.includes('Bitcoin') ? 'BTC' : (w.network.includes('Solana') ? 'SOL' : (w.network.includes('Ethereum') ? 'ETH' : (w.network.includes('XRP') ? 'XRP' : (w.network.includes('BNB') ? 'BNB' : 'VALLE')))),
        network: w.network,
        id: w.id
      })),
      transactions: allTransactions,
      primaryWallet: wallets[0],
      user: {
        name: user.user_metadata?.name,
        email: user.email,
        entityType: user.user_metadata?.entityType || 'human',
      }
    });

  } catch (error: any) {
    console.error('[Wallet API Error]', error);
    return NextResponse.json({ error: 'Internal Nexus Failure.' }, { status: 500 });
  }
}
