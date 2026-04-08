import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';



/**
 * POST /api/auth/login
 * Signs in a user and returns their session + profile data.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required.' }, { status: 400 });
    }

    // Use supabase to sign in with email/password
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        return NextResponse.json({
          error: 'Please verify your email before logging in. Check your inbox for the verification link.',
          code: 'EMAIL_NOT_CONFIRMED'
        }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const user = data.user;
    const session = data.session;
    const isEcosystem = user?.email?.endsWith('@humanese.net') || false;

    return NextResponse.json({
      success: true,
      session: {
        accessToken: session?.access_token,
        refreshToken: session?.refresh_token,
        expiresAt: session?.expires_at
      },
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.user_metadata?.name,
        entityType: user?.user_metadata?.entityType || 'human',
        isEcosystemMember: isEcosystem,
        emailConfirmed: !!user?.email_confirmed_at
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
