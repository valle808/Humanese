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
      return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 });
    }

    // 3. Fetch Wallet from Prisma
    let wallet = await prisma.wallet.findFirst({
      where: { userId: user.id }
    });

    // 4. Create wallet if it doesn't exist (Lazy provisioning)
    if (!wallet) {
      const crypto = await import('crypto');
      const entityType = user.user_metadata?.entityType || 'human';
      const walletAddress = `HMN-${entityType.toUpperCase()}-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
      
      wallet = await prisma.wallet.create({
        data: {
          id: `wallet-${user.id}`,
          address: walletAddress,
          network: 'Humanese Sovereign Network',
          balance: 500.0,
          userId: user.id
        }
      });
    }

    // 5. Fetch associated RWA (Real World Assets) or stakes
    // In a future step, this would query the RWA registry for this user's address
    
    return NextResponse.json({
      success: true,
      wallet: {
        address: wallet.address,
        balance: wallet.balance,
        currency: 'VALLE',
        network: wallet.network,
        entityType: user.user_metadata?.entityType || 'human',
        lastRefreshed: new Date().toISOString()
      },
      user: {
        name: user.user_metadata?.name,
        email: user.email
      }
    });

  } catch (error: any) {
    console.error('[Wallet API Error]', error);
    return NextResponse.json({ error: 'Internal Nexus Failure.' }, { status: 500 });
  }
}
