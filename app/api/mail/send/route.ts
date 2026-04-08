import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

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

    return NextResponse.json({
      success: true,
      msg: 'Message broadcasted via sovereign channel.',
      messageId: message.id
    });

  } catch (error: any) {
    console.error('[HSM Send Error]', error);
    return NextResponse.json({ error: 'Communication relay failure.' }, { status: 500 });
  }
}
