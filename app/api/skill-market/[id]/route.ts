import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// ── GET /api/skill-market/[id] ───────────────────────────────────
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const skills: any = await prisma.$queryRawUnsafe(
            `SELECT * FROM skills WHERE id = $1 LIMIT 1`, 
            id
        );

        const skill = skills[0];

        if (!skill) {
            return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
        }

        // Increment view count (fire and forget)
        prisma.$queryRawUnsafe(
            `UPDATE skills SET views = views + 1 WHERE id = $1`, 
            id
        ).catch(e => console.error('Failed to update views:', e));

        // Note: For now we return empty arrays for reviews and transactions
        // as they are not currently supported in the Prisma schema implementation
        return NextResponse.json({ skill, reviews: [], transactions: [] });
    } catch (err) {
        console.error('[skill-market GET ID]', err);
        return NextResponse.json({ error: 'Failed to fetch skill', details: String(err) }, { status: 500 });
    }
}
