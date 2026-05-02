import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';

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

    // 1. First check our manual OTP in Prisma
    const user = await prisma.user.findFirst({
      where: email ? { email } : { id: phone } // handle phone or email
    });

    if (user && user.verificationCode === token) {
      // Manual match! Confirm user in Supabase
      const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        email_confirm: true
      });

      if (confirmError) {
        return NextResponse.json({ error: `Manual verification passed, but matrix update failed: ${confirmError.message}` }, { status: 400 });
      }

      // Mark as verified in Prisma
      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true, verificationCode: null }
      });

      // Sign the user in to get a session
      const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'signup',
        email: user.email,
      });

      // Note: Supabase admin generateLink returns a link, but we want a session.
      // Actually, since we've confirmed the email, the user can now log in normally.
      // But we want to return a session immediately.
      // We'll use signInWithPassword with the user's password? No, we don't have it here.
      // We'll return success and tell them to login, or we can use admin.createSession if available.
      
      return NextResponse.json({
        success: true,
        msg: 'Verification successful. Your identity is now activated. Please login to synchronize.',
        user: { id: user.id, email: user.email }
      });
    }

    // 2. Fallback to standard Supabase verifyOtp
    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      email,
      phone,
      token,
      type: type || 'signup'
    });

    if (error) {
      return NextResponse.json({ error: 'Verification code mismatch or expired.' }, { status: 400 });
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
