import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/register
 * 
 * Registers any entity type in the Humanese ecosystem:
 * - Human users (with @humanese.net or external email)
 * - AI Agents
 * - Machines / IoT
 * - Corporations
 * - Financial Institutions
 * 
 * Flow:
 * 1. Creates user in Supabase Auth (sends verification email automatically)
 * 2. Creates User record in Prisma DB
 * 3. Creates sovereign Wallet for the new entity
 * 4. If @humanese.net email, marks as ecosystem member
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, entityType, phone } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required.' }, { status: 400 });
    }

    // Detect humanese ecosystem email
    const isEcosystemEmail = email.toLowerCase().endsWith('@humanese.net');
    
    // Create user in Supabase Auth
    // This automatically sends a verification email via Supabase's SMTP
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Require email verification
      phone: phone || undefined,
      user_metadata: {
        name,
        entityType: entityType || 'human',
        isEcosystemMember: isEcosystemEmail,
        registeredAt: new Date().toISOString(),
      }
    });

    if (authError) {
      // User might already exist
      if (authError.message.includes('already been registered') || authError.message.includes('already exists')) {
        return NextResponse.json({ error: 'This email is already registered. Please login.' }, { status: 409 });
      }
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Registration failed: no user ID returned.' }, { status: 500 });
    }

    // Create User record in Prisma
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email,
        name,
        isAgent: entityType === 'agent',
        serviceType: entityType || 'human',
      }
    });

    // Create a Sovereign Wallet for the new entity
    const walletAddress = `HMN-${entityType?.toUpperCase() || 'USR'}-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    await prisma.wallet.create({
      data: {
        id: `wallet-${userId}`,
        address: walletAddress,
        network: 'Humanese Sovereign Network',
        balance: 500.0, // Welcome balance in VALLE tokens
        userId
      }
    });

    console.log(`[Auth] New ${entityType || 'human'} registered: ${email} | Wallet: ${walletAddress} | Ecosystem: ${isEcosystemEmail}`);

    return NextResponse.json({
      success: true,
      msg: isEcosystemEmail
        ? `Welcome to the Humanese ecosystem! A verification email has been sent to ${email}. Your @humanese.net inbox will be set up within minutes.`
        : `Registration successful! Please check ${email} for a verification link to activate your account.`,
      userId,
      walletAddress,
      isEcosystemMember: isEcosystemEmail,
      requiresVerification: true
    });

  } catch (error: any) {
    console.error('[Auth/Register Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
