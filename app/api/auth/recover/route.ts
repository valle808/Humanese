import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, identifier, phrase } = body;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    if (method === 'email') {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(identifier, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://humanese.net'}/auth/reset`
      });
      if (error) throw new Error(error.message);
      return NextResponse.json({ success: true, message: 'Recovery link transmitted.' });
    }

    if (method === 'phone') {
      const { error } = await supabaseClient.auth.signInWithOtp({ phone: identifier });
      if (error) throw new Error(error.message);
      return NextResponse.json({ success: true, message: 'Recovery SMS transmitted.' });
    }

    if (method === 'phrase') {
      const hashedPhrase = crypto.createHash('sha256').update(phrase).digest('hex');
      
      // Query auth.users in Prisma
      // Note: prisma.users maps to the auth.users table because of multiSchema setup in schema.prisma
      const matchedUser = await prisma.users.findFirst({
        where: {
          raw_user_meta_data: {
            path: ['secretPhraseHash'],
            equals: hashedPhrase
          }
        }
      });

      if (!matchedUser) {
        throw new Error('Sovereign phrase mismatch or entity not found.');
      }

      // Generate a temporary recovery password
      const tempPass = `RECOVER-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      // Force reset password via admin API
      const { error } = await supabaseAdmin.auth.admin.updateUserById(matchedUser.id, {
        password: tempPass
      });

      if (error) throw new Error('Failed to override matrix security protocols.');

      // Return the temporary password to the user.
      // In a real sovereign system, this would log them in directly or provide a secure reset form.
      return NextResponse.json({ 
        success: true, 
        message: `Override successful. Your temporary password is: ${tempPass}. Please login and change it immediately via Sovereign Settings.` 
      });
    }

    throw new Error('Invalid recovery protocol.');

  } catch (error: any) {
    console.error('[Recovery Error]', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
