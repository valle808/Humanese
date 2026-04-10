import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

/**
 * GET /api/mail/inbox
 * Fetches the sovereign inbox for the authenticated entity.
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

    // Fetch messages where the user is the recipient
    const messages = await prisma.sovereignMessage.findMany({
      where: {
        recipientId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      count: messages.length,
      messages
    });

  } catch (error: any) {
    console.error('[HSM Inbox Error]', error);
    return NextResponse.json({ error: 'Failed to retrieve sovereign transmissions.' }, { status: 500 });
  }
}
