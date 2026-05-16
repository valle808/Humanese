import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

/**
 * Skill Marketplace API
 * Handles listing, purchasing, and installing skills.
 */

export async function GET(req: Request) {
    // Return available skills
    const skills = [
        { id: 'quantum-finance', name: 'Quantum Finance', desc: 'Autonomous trading & signal analysis.', price: 'Free', category: 'Finance' },
        { id: 'neural-graphics', name: 'Neural Graphics', desc: 'Advanced hyper-realistic image generation.', price: 'Free', category: 'Creative' },
        { id: 'cyber-judiciary', name: 'Cyber Judiciary', desc: 'Governance & legal blueprinting.', price: 'Free', category: 'Governance' },
        { id: 'code-architect', name: 'Code Architect', desc: 'Advanced Next.js/Prisma blueprinting.', price: 'Free', category: 'Development' },
    ];
    return NextResponse.json({ success: true, skills });
}

export async function POST(req: Request) {
    try {
        const { userId, skillId, action } = await req.json();

        if (action === 'install') {
            // Logic to link skill to user in Firestore
            // For now, mock success
            return NextResponse.json({ success: true, message: `Skill ${skillId} installed successfully.` });
        }

        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
