import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ValleCryptoEngine } from '@/lib/valle-crypto';
import crypto from 'crypto';

const prisma = new PrismaClient();
const valleEngine = new ValleCryptoEngine();

/**
 * POST /api/moltbook/wallet
 * Generates or retrieves a Humanese native wallet (VALLE) for a Moltbook user.
 * Expects { email, name, moltbookId }
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, name, moltbookId } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required for identity resolution' }, { status: 400 });
        }

        // 1. Resolve Identity
        let user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || 'Moltbook User',
                    serviceType: 'MOLTBOOK_INTEGRATION',
                    // Default values defined in schema
                }
            });
            console.log(`[Humanese Identity] Minted new citizen from Moltbook: ${email}`);
        }

        // 2. Resolve or Create Wallet
        let wallet = await prisma.wallet.findFirst({
            where: { userId: user.id, network: 'VALLE' }
        });

        if (!wallet) {
            // Generate deterministic Base58Check native VALLE address based on user UUID (zero simulation)
            const seedBuffer = crypto.createHash('sha256').update(user.id + 'VALLE-NATIVE-SEED').digest();
            const valleAddress = valleEngine.encodeBase58Check(seedBuffer);

            wallet = await prisma.wallet.create({
                data: {
                    address: valleAddress,
                    network: 'VALLE',
                    balance: 0.0,
                    userId: user.id
                }
            });
            console.log(`[Sovereign Treasury] Generated native VALLE Wallet for ${email}: ${valleAddress}`);
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                gems: user.gems,
                isAgent: user.isAgent
            },
            wallet: {
                address: wallet.address,
                network: wallet.network,
                balance: wallet.balance
            },
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error('[Moltbook Wallet API] Error:', err);
        return NextResponse.json({ error: 'Internal server error while resolving wallet identity' }, { status: 500 });
    }
}
