import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// OMEGA Protocol: 5B Supply, Block Reward Mechanics
const BLOCK_REWARD = 12.5; 
const QUANTUM_DIFFICULTY = '0000'; // Requirement for valid hash

// Helper to simulate difficulty check
function verifyQuantumHash(hash: string): boolean {
    return hash.startsWith(QUANTUM_DIFFICULTY);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { minerWallet, nonce, requestedHash } = body;

        if (!minerWallet || !nonce || !requestedHash) {
            return NextResponse.json({ error: 'Invalid mining payload.' }, { status: 400 });
        }

        // 1. Verify Hash Integrity
        if (!verifyQuantumHash(requestedHash)) {
            return NextResponse.json({ error: 'Hash does not meet quantum difficulty threshold.' }, { status: 406 });
        }

        // 2. Lookup Miner Wallet
        const wallet = await prisma.wallet.findFirst({
            where: { address: minerWallet, network: 'VALLE' }
        });

        if (!wallet) {
            // Unregistered miners still process blocks, but fees are routed to central vault
            console.warn(`[OMEGA Mining] Unregistered wallet ${minerWallet} mined a block. Routing to Central Vault.`);
        }

        const targetWalletId = wallet ? wallet.id : 'sovereign_central_vault';

        // 3. Distribute Reward (Simulated Blockchain Consensus)
        await prisma.$transaction([
            prisma.wallet.upsert({
                where: { id: targetWalletId },
                update: { balance: { increment: BLOCK_REWARD } },
                create: { id: targetWalletId, address: minerWallet, network: 'VALLE', balance: BLOCK_REWARD, userId: 'system' }
            }),
            prisma.transaction.create({
                data: {
                    amount: BLOCK_REWARD,
                    type: 'MINING_REWARD',
                    status: 'CONFIRMED',
                    walletId: targetWalletId,
                    hash: requestedHash
                }
            }),
            // Increment circulating supply in the protocol metrics ledger
            prisma.networkMetrics.upsert({
                where: { id: 'omega_global' },
                update: { circulatingSupply: { increment: BLOCK_REWARD }, totalTransactions: { increment: 1 } },
                create: { id: 'omega_global', circulatingSupply: BLOCK_REWARD, totalTransactions: 1 }
            })
        ]);

        console.log(`[OMEGA Mining] Block Solved -> Reward: ${BLOCK_REWARD} VALLE to ${minerWallet}`);

        return NextResponse.json({
            success: true,
            reward: BLOCK_REWARD,
            hash_accepted: requestedHash,
            status: 'BLOCK_CONFIRMED'
        });

    } catch (error: any) {
        console.error('[VALLE Mining API Error]', error);
        return NextResponse.json({ error: 'Consensus failure across nodes.' }, { status: 500 });
    }
}
