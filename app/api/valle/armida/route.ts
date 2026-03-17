import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { quantumEncrypt, quantumDecrypt } from '@/utils/quantum-encryption';

export async function POST(req: Request) {
    try {
        const { ownerId, name, uri, secretKey } = await req.json();

        let encryptedData = {};
        if (secretKey) {
            const { payload, iv, tag, protocol } = quantumEncrypt(secretKey);
            encryptedData = { payload, iv, tag, protocol };
        }

        const token = await prisma.collectorToken.create({
            data: {
                ownerId,
                name,
                uri,
                tokenId: Math.floor(Math.random() * 1000000), // In a real scenario, this would come from the contract event
                ...encryptedData
            }
        });

        return NextResponse.json({ success: true, token });
    } catch (error) {
        console.error('[Armida Mint Failure]', error);
        return NextResponse.json({ success: false, error: 'Failed to mint Armida token' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get('ownerId');

    if (!ownerId) {
        return NextResponse.json({ success: false, error: 'ownerId is required' }, { status: 400 });
    }

    try {
        const tokens = await prisma.collectorToken.findMany({
            where: { ownerId }
        });

        return NextResponse.json({ success: true, tokens });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch tokens' }, { status: 500 });
    }
}
