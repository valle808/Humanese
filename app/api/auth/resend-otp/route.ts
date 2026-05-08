import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Identity not found.' }, { status: 404 });
    }

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationCode: otpCode }
    });

    // Send via Resend
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'omega@humanese.net',
      to: email,
      subject: 'New Identity Verification Code',
      html: `
        <div style="font-family: 'Inter', sans-serif; background: hsl(var(--background)); color: hsl(var(--foreground)); padding: 40px; border-radius: 20px; border: 1px solid hsl(var(--primary));">
          <h1 style="text-transform: uppercase; letter-spacing: 0.2em; italic: true; color: hsl(var(--primary));">Identity Resynchronization</h1>
          <p style="color: #888; font-style: italic;">A new code has been generated for your neural presence.</p>
          <div style="margin: 40px 0; padding: 30px; background: hsl(var(--muted)); border: 1px dashed hsl(var(--primary)); text-align: center; border-radius: 15px;">
            <span style="font-size: 42px; font-weight: 900; letter-spacing: 0.5em; color: hsl(var(--primary));">${otpCode}</span>
          </div>
          <p style="font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 0.1em;">Transmit this code to verify your neural presence.</p>
        </div>
      `
    });

    return NextResponse.json({ success: true, msg: 'A new verification code has been transmitted.' });

  } catch (error: any) {
    console.error('[Resend OTP Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
