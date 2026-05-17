import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

/**
 * POST /api/mail/send
 * Sends a sovereign message between entities.
 * External email relay via Resend is optional — internal message always saved.
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
      return NextResponse.json({ error: 'Matrix session invalid. Please re-authenticate.' }, { status: 401 });
    }

    const { recipientHandle, subject, content, priority = 1, metadata = {} } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Message payload (content) is required.' }, { status: 400 });
    }

    // 1. Resolve recipient — default to self (internal note) if no recipient given
    let recipientId: string = user.id;
    let recipientUser: any = null;

    if (recipientHandle && recipientHandle.trim() !== '') {
      if (recipientHandle.includes('@')) {
        recipientUser = await prisma.user.findFirst({ where: { email: recipientHandle.trim() } });
        if (!recipientUser) {
          // Try by handle (username) part before the @
          const handle = recipientHandle.split('@')[0];
          recipientUser = await prisma.user.findFirst({ where: { handle } });
        }
        if (!recipientUser) {
          return NextResponse.json({
            error: `Entity "${recipientHandle}" not found in sovereign ledger. Use a valid handle@humanese.net address.`
          }, { status: 404 });
        }
        recipientId = recipientUser.id;
      } else {
        // Treat as a handle directly
        recipientUser = await prisma.user.findFirst({ where: { handle: recipientHandle.trim() } });
        if (!recipientUser) {
          return NextResponse.json({
            error: `Handle "${recipientHandle}" not found. Use format: username or email@humanese.net`
          }, { status: 404 });
        }
        recipientId = recipientUser.id;
      }
    }

    // 2. Save the message record to the DB
    const message = await (prisma as any).sovereignMessage.create({
      data: {
        senderId:    user.id,
        recipientId: recipientId,
        subject:     subject || '(No Subject)',
        content:     content,
        priority:    priority,
        metadata:    metadata,
        label:       'INBOX'
      }
    });

    // 3. Optional: External email relay via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && recipientUser?.email) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@humanese.net',
          to:   recipientUser.email,
          subject: subject || `Sovereign Message from OMEGA`,
          html: `
            <div style="font-family:'Inter',sans-serif;background:#050505;color:#fff;padding:48px;border-radius:24px;border:1px solid rgba(255,61,0,0.3);max-width:640px;margin:0 auto;">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
                <div style="width:40px;height:40px;background:#ff3d00;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;">Ω</div>
                <span style="color:#ff3d00;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.4em;">Sovereign HSM Relay</span>
              </div>
              <h2 style="color:#fff;font-size:28px;font-weight:900;font-style:italic;text-transform:uppercase;letter-spacing:-0.02em;margin:0 0 8px;">${subject || 'Sovereign Signal'}</h2>
              <p style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:0.3em;margin:0 0 32px;">From: ${user.user_metadata?.name || user.email}</p>
              <div style="background:#0f0f0f;border:1px solid #1a1a1a;border-radius:16px;padding:28px;margin-bottom:32px;">
                <p style="color:#ccc;font-size:16px;line-height:1.7;font-style:italic;margin:0;">${content.replace(/\n/g, '<br/>')}</p>
              </div>
              <hr style="border:0;border-top:1px solid #1a1a1a;margin:32px 0;"/>
              <p style="font-size:10px;color:#444;text-transform:uppercase;letter-spacing:0.3em;">
                Reply via <a href="https://humanese.net/mail" style="color:#ff3d00;">humanese.net/mail</a>
              </p>
            </div>
          `
        });
        console.log(`[HSM] External relay sent to ${recipientUser.email}`);
      } catch (err) {
        // Email relay failure is non-blocking — message is already saved in DB
        console.error('[HSM Email Relay Error]', err);
      }
    } else if (!resendKey) {
      console.log('[HSM] RESEND_API_KEY not configured — internal message saved, no external relay.');
    }

    return NextResponse.json({
      success: true,
      msg: 'Signal transmitted via sovereign channel.',
      messageId: message.id,
      relayed: !!(resendKey && recipientUser?.email)
    });

  } catch (error: any) {
    console.error('[HSM Send Error]', error);
    return NextResponse.json({
      error: error.message?.includes('not found')
        ? error.message
        : 'Communication relay failure. Check server logs.'
    }, { status: 500 });
  }
}

