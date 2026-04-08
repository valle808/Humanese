import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/verify-otp
 * Verifies a 6-digit OTP code for email or phone.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, phone, token, type } = await req.json();

    if (!token || (!email && !phone)) {
      return NextResponse.json({ error: 'Token and (Email or Phone) are required.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verify OTP using Supabase
    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      email,
      phone,
      token,
      type: type || 'signup' // signup, recovery, magiclink, sms
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      msg: 'Verification successful. Your identity is now activated.',
      user: data.user,
      session: data.session
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
