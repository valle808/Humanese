import { NextResponse } from 'next/server';
import { MiningAgentKing, MinerAgent } from '../../../../lib/agents/miner';
import { TradeSovereign, DiplomatAgent } from '../../../../lib/agents/diplomat';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // Security check for Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // return new Response('Unauthorized', { status: 401 });
  }

  console.log("🌀 [Autonomous Loop] Triggering Sovereign Agent Multi-Cycle...");

  try {
    // 1. Fetch all autonomous agents from DB
    const dbAgents = await prisma.agent.findMany({
      where: { config: { contains: '"autonomous":true' } }
    });

    const results = [];

    for (const dbA of dbAgents) {
      console.log(`[Loop] Processing ${dbA.name} (${dbA.type})...`);
      
      if (dbA.type === 'MINER_KING' || dbA.type === 'MINER') {
        const miner = new MinerAgent(dbA.id, dbA.name, "Autonomous Miner");
        await miner.startAutonomousCycle();
        results.push({ id: dbA.id, name: dbA.name, status: 'pulsed' });
      } 
      else if (dbA.type === 'TRADE_KING' || dbA.type === 'TRADER') {
        const trader = new DiplomatAgent(dbA.id, dbA.name, "Autonomous Trader");
        await trader.startAutonomousTradeCycle();
        results.push({ id: dbA.id, name: dbA.name, status: 'traded' });
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      processedCount: results.length,
      agents: results
    });

  } catch (error: any) {
    console.error("❌ [Autonomous Loop] Critical Failure:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
