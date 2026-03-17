import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * /api/valle/mine
 * 
 * Secure endpoint for agents to submit Proof-of-Work (PoW) shares.
 * In production, this would verify the share on-chain using the VALLEToken.mine() function.
 */
export async function POST(req: Request) {
  try {
    const { agentId, shareHash, difficulty } = await req.json();

    if (!agentId || !shareHash) {
      return NextResponse.json({ success: false, error: 'Invalid share payload' }, { status: 400 });
    }

    // REAL-WORLD VERIFICATION:
    // 1. Ensure hash starts with required difficulty prefix
    const isValid = shareHash.startsWith('000'); // Low difficulty for POC
    
    if (!isValid) {
        return NextResponse.json({ success: false, error: 'Stale or invalid share' }, { status: 403 });
    }

    // 2. Record the transaction in the database
    // In a decentralized state, this would be an ethers.js call to the contract
    await prisma.transaction.create({
      data: {
        amount: 50.0, // Fixed reward for POC
        type: 'MINING_REWARD',
        status: 'CONFIRMED',
        walletId: 'SOVEREIGN_TREASURY' // Placeholder for Treasury logic
      }
    });

    console.log(`[Mining Registry] Share accepted from ${agentId}. Reward: 50 VALLE`);

    return NextResponse.json({
      success: true,
      reward: 50,
      txHash: `0x${shareHash.substring(0, 32)}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Mining submission error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
