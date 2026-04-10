import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { title, content, type, authorId } = await req.json();
        
        if (!title || !content || !authorId || !type) {
             return NextResponse.json({ error: 'Missing required fields: title, content, type, authorId' }, { status: 400 });
        }

        const proposal = await prisma.improvementProposal.create({
            data: {
                title,
                type,
                authorId,
                markdownContent: content,
                status: 'Draft',
                resonanceThreshold: 0.0
            }
        });

        // Automatically assign the HIP string representation using the auto-incremented number
        const formattedHip = `HIP-${proposal.hipNumber.toString().padStart(4, '0')}`;

        return NextResponse.json({ 
            success: true, 
            identifier: formattedHip,
            proposal 
        });
    } catch(err: any) {
        console.error("[HIP Submit Error]", err);
        return NextResponse.json({ error: 'Failed to anchor proposal to the Sovereign Ledger' }, { status: 500 });
    }
}
