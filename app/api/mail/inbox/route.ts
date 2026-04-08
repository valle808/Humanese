import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';


/**
 * GET /api/mail/inbox
 * Fetches messages for the authenticated entity.
 */
export async function GET(req: NextRequest) {
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

    const searchParams = req.nextUrl.searchParams;
    const label = searchParams.get('label') || 'INBOX';

    const messages = await (prisma as any).sovereignMessage.findMany({
      where: {
        recipientId: user.id,
        label: label,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Optionally fetch sender names for the UI
    const senderIds = Array.from(new Set(messages.map((m: any) => m.senderId))) as string[];
    const senders = await prisma.user.findMany({
      where: { id: { in: senderIds } },
      select: { id: true, name: true, email: true }
    });

    const senderMap = Object.fromEntries(senders.map((s: any) => [s.id, s]));

    const enrichedMessages = messages.map((m: any) => ({
      ...m,
      sender: senderMap[m.senderId] || { name: 'Unknown Entity', email: 'unknown@humanese.net' }
    }));

    return NextResponse.json({
      success: true,
      messages: enrichedMessages,
      unreadCount: messages.filter((m: any) => !m.readAt).length
    });

  } catch (error: any) {
    console.error('[HSM Inbox Error]', error);
    return NextResponse.json({ error: 'Inbound relay failure.' }, { status: 500 });
  }
}
