import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// VALLE Tokenomics Constants (mirroring VALLEToken.sol)
const MAX_SUPPLY = 1_000_000_000;         // 1 Billion VALLE
const MINING_RESERVE = MAX_SUPPLY * 0.10; // 10% = 100,000,000 VALLE
const INITIAL_REWARD = 1000;               // Starting reward per share
const MINING_GENESIS = new Date('2026-03-14T19:15:52Z').getTime();
const MINING_DURATION_MS = 100 * 365.25 * 24 * 60 * 60 * 1000; // 100 years in ms

/**
 * Calculate the current mining reward based on 100-year linear decay.
 */
function getMiningReward(): number {
    const timePassed = Date.now() - MINING_GENESIS;
    if (timePassed >= MINING_DURATION_MS) return 0;
    const remaining = MINING_DURATION_MS - timePassed;
    return (INITIAL_REWARD * remaining) / MINING_DURATION_MS;
}

/**
 * /api/valle/mine
 * 
 * Secure endpoint for agents to submit Proof-of-Work (PoW) shares.
 * Reward decays linearly over 100 years. Enforces 10% mining cap.
 */
export async function POST(req: Request) {
  try {
    const { agentId, shareHash, difficulty } = await req.json();

    if (!agentId || !shareHash) {
      return NextResponse.json({ success: false, error: 'Invalid share payload' }, { status: 400 });
    }

    // 1. Verify hash meets difficulty requirement
    const requiredPrefix = '0'.repeat(difficulty || 3);
    const isValid = shareHash.startsWith(requiredPrefix);
    
    if (!isValid) {
        return NextResponse.json({ success: false, error: 'Stale or invalid share' }, { status: 403 });
    }

    // 2. Check totalMined against MINING_RESERVE cap
    const aggregate = await prisma.transaction.aggregate({
        where: { type: 'MINING_REWARD', status: 'CONFIRMED' },
        _sum: { amount: true }
    });
    const totalMined = aggregate._sum.amount || 0;

    if (totalMined >= MINING_RESERVE) {
        return NextResponse.json({ success: false, error: 'Mining pool exhausted' }, { status: 403 });
    }

    // 3. Calculate dynamic reward with decay
    let reward = getMiningReward();
    if (reward <= 0) {
        return NextResponse.json({ success: false, error: 'Mining period ended' }, { status: 403 });
    }

    // Hard cap enforcement
    if (totalMined + reward > MINING_RESERVE) {
        reward = MINING_RESERVE - totalMined;
    }

    // 4. Record the verified transaction
    await prisma.transaction.create({
      data: {
        amount: reward,
        type: 'MINING_REWARD',
        status: 'CONFIRMED',
        walletId: 'SOVEREIGN_TREASURY'
      }
    });

    console.log(`[Mining Registry] Share accepted from ${agentId}. Reward: ${reward.toFixed(4)} VALLE (decay-adjusted)`);

    return NextResponse.json({
      success: true,
      reward: parseFloat(reward.toFixed(4)),
      txHash: `0x${shareHash.substring(0, 32)}`,
      totalMined: totalMined + reward,
      miningCapPct: ((totalMined + reward) / MINING_RESERVE * 100).toFixed(6),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Mining submission error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

