import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = 'force-dynamic';

/**
 * POST /api/mail/send
 * Sends a sovereign message between entities.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Identity token required.' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Matrix session invalid.' }, { status: 401 });
    }

    const { recipientHandle, subject, content, priority = 1, metadata = {} } = await req.json();

    if (!recipientHandle || !content) {
      return NextResponse.json({ error: 'Recipient and content are required.' }, { status: 400 });
    }

    // 1. Resolve recipient handle (handle@humanese.net or UUID)
    let recipientId = recipientHandle;
    
    if (recipientHandle.includes('@')) {
      const recipientUser = await prisma.user.findFirst({
        where: { email: recipientHandle }
      });
      if (!recipientUser) {
        return NextResponse.json({ error: `Entity handle ${recipientHandle} not found in ledger.` }, { status: 404 });
      }
      recipientId = recipientUser.id;
    }

    // 2. Create the message record
    const message = await (prisma as any).sovereignMessage.create({
      data: {
        senderId: user.id,
        recipientId: recipientId,
        subject: subject || '(No Subject)',
        content: content,
        priority: priority,
        metadata: metadata,
        label: 'INBOX'
      }
    });

    // 3. Relay to external email via Resend if recipient has an email
    const recipientUser = await prisma.user.findUnique({
      where: { id: recipientId }
    });

    if (recipientUser?.email) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'omega@humanese.net',
          to: recipientUser.email,
          subject: subject || `Sovereign Message from ${user.user_metadata?.name || 'Unknown'}`,
          html: `
            <div style="font-family: 'Inter', sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #ff3d00;">
              <h2 style="color: #ff3d00; text-transform: uppercase;">New Sovereign Message</h2>
              <p style="color: #ccc; font-style: italic;">From: ${user.user_metadata?.name || user.email}</p>
              <div style="margin: 20px 0; padding: 20px; background: #111; border-radius: 10px;">
                ${content}
              </div>
              <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
              <p style="font-size: 10px; color: #555; text-transform: uppercase;">View this message in the Sovereign Portal: <a href="https://humanese.net/mail" style="color: #ff3d00;">humanese.net/mail</a></p>
            </div>
          `
        });
        console.log(`[HSM] Message relayed to external email: ${recipientUser.email}`);
      } catch (err) {
        console.error('[HSM Email Relay Error]', err);
      }
    }

    return NextResponse.json({
      success: true,
      msg: 'Message broadcasted via sovereign channel and email relay.',
      messageId: message.id
    });

  } catch (error: any) {
    console.error('[HSM Send Error]', error);
    return NextResponse.json({ error: 'Communication relay failure.' }, { status: 500 });
  }
}
