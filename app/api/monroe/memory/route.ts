import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

/**
 * Monroe Conversation Memory API
 * Stores and retrieves Monroe's conversations with emotional context.
 */

export async function POST(req: Request) {
    try {
        const { sessionId, role, content, mood } = await req.json();

        await addDoc(collection(db, 'monroe_conversations'), {
            sessionId: sessionId || 'anonymous',
            role,
            content,
            mood: mood || 0.5,
            timestamp: serverTimestamp(),
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Monroe Memory Write Error]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId') || 'anonymous';

        const q = query(
            collection(db, 'monroe_conversations'),
            where('sessionId', '==', sessionId),
            orderBy('timestamp', 'desc'),
            limit(20)
        );

        const snapshot = await getDocs(q);
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })).reverse();

        return NextResponse.json({ success: true, messages });
    } catch (error: any) {
        console.error('[Monroe Memory Read Error]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
