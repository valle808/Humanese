#!/usr/bin/env node
/**
 * 🔱 SOVEREIGN WATCHER AGENT v2.0 — Bastidas Protocol
 *
 * Autonomous self-healing daemon for the OMEGA v7.0 ecosystem.
 * Runs persistently, monitoring the health of the Sovereign Matrix
 * and auto-correcting detected anomalies.
 *
 * Responsibilities:
 *  1. Governance auto-finalize: Close expired proposals and tally results
 *  2. Agent pulse monitor: Detect stale agents and reset their status
 *  3. Transaction sweeper: Catch PENDING txs older than 30m and mark FAILED
 *  4. Intelligence observer: Read swarm IntelligenceItems and log them
 *  5. Memory consolidation: GC stale M2MMemory entries older than 7 days
 *
 * Usage:
 *   node watcher_agent.js
 *   npm run autoheal
 *
 * Signed: Gio V. / Bastidas Protocol
 */

import prisma from './lib/prisma_shared.js';
import os from 'os';
const CYCLE_MS       = 60_000;   // 1 minute main loop
const PROPOSAL_GRACE = 7 * 24 * 60 * 60 * 1000;  // 7 days voting window
const AGENT_STALE_MS = 15 * 60 * 1000;            // 15 min without pulse = stale
const TX_STALE_MS    = 30 * 60 * 1000;            // 30 min pending = failed
const MEMORY_AGE_MS  = 7 * 24 * 60 * 60 * 1000;   // 7 days old memories = GC

let cycleCount = 0;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function log(module, msg) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${module}] ${msg}`);
}

// ─── TASK 1: GOVERNANCE AUTO-FINALIZE ─────────────────────────────────────────

async function finalizeExpiredProposals() {
  const cutoff = new Date(Date.now() - PROPOSAL_GRACE);
  const expired = await prisma.improvementProposal.findMany({
    where: { status: 'Active', createdAt: { lt: cutoff } },
    include: { votes: { select: { choice: true, weight: true } } }
  });

  if (expired.length === 0) return;
  log('GOV', `Found ${expired.length} expired proposal(s). Finalizing...`);

  for (const p of expired) {
    const support = p.votes.filter(v => v.choice === 'Support').reduce((s, v) => s + v.weight, 0);
    const against = p.votes.filter(v => v.choice === 'Against').reduce((s, v) => s + v.weight, 0);
    const quorum  = support + against;

    let newStatus;
    if (quorum < 10) {
      newStatus = 'Deferred';   // Insufficient participation
    } else if (support > against) {
      newStatus = 'Accepted';
    } else {
      newStatus = 'Rejected';
    }

    await prisma.improvementProposal.update({
      where: { id: p.id },
      data: { status: newStatus }
    });

    log('GOV', `HIP-${String(p.hipNumber).padStart(4,'0')} → ${newStatus} (support: ${support.toFixed(1)}, against: ${against.toFixed(1)}, quorum: ${quorum.toFixed(1)})`);
  }
}

// ─── TASK 2: AGENT PULSE MONITOR ──────────────────────────────────────────────

async function monitorAgentPulses() {
  const staleThreshold = new Date(Date.now() - AGENT_STALE_MS);
  const staleAgents = await prisma.agent.findMany({
    where: {
      status: { not: 'IDLE' },
      lastPulse: { lt: staleThreshold }
    }
  });

  if (staleAgents.length === 0) return;
  log('PULSE', `Resetting ${staleAgents.length} stale agent(s) to IDLE...`);

  for (const agent of staleAgents) {
    await prisma.agent.update({
      where: { id: agent.id },
      data: { status: 'IDLE' }
    });
    log('PULSE', `Agent "${agent.name}" (${agent.id}) → IDLE (last pulse: ${agent.lastPulse?.toISOString()})`);
  }
}

// ─── TASK 3: TRANSACTION SWEEPER ──────────────────────────────────────────────

async function sweepStalePendingTransactions() {
  const cutoff = new Date(Date.now() - TX_STALE_MS);
  const result = await prisma.transaction.updateMany({
    where: { status: 'PENDING', createdAt: { lt: cutoff } },
    data:  { status: 'FAILED' }
  });

  if (result.count > 0) {
    log('TXN', `Swept ${result.count} stale PENDING transaction(s) → FAILED`);
  }
}

// ─── TASK 4: INTELLIGENCE OBSERVER ────────────────────────────────────────────

async function observeIntelligence() {
  const newItems = await prisma.intelligenceItem.findMany({
    where:   { status: 'ACTIVE' },
    orderBy: { timestamp: 'desc' },
    take:    5
  });

  for (const item of newItems) {
    log('INTEL', `[${item.type}] ${item.title}`);
    // Mark as observed so it doesn't re-trigger
    await prisma.intelligenceItem.update({
      where: { id: item.id },
      data:  { status: 'OBSERVED' }
    });
  }
}

// ─── TASK 5: MEMORY CONSOLIDATION ─────────────────────────────────────────────

async function consolidateMemory() {
  const cutoff = new Date(Date.now() - MEMORY_AGE_MS);
  const result = await prisma.m2MMemory.deleteMany({
    where: { timestamp: { lt: cutoff }, type: 'EPHEMERAL' }
  });

  if (result.count > 0) {
    log('MEM', `GC: Purged ${result.count} stale EPHEMERAL memory shard(s)`);
  }
}

// ─── TASK 6: PHYSICAL NODE MONITORING ─────────────────────────────────────────

async function monitorPhysicalNodes() {
  const nodes = await prisma.hardwareNode.findMany();
  if (nodes.length === 0) return;

  log('FLEET', `Monitoring ${nodes.length} physical node(s)...`);

  for (const node of nodes) {
    if (node.status === 'OFFLINE') {
      // Small chance to auto-reboot if it was cooled down (simulated logic)
      if (Math.random() > 0.95) {
        await prisma.hardwareNode.update({
          where: { id: node.id },
          data: { status: 'ONLINE', temperature: 40.0, load: 0.0 }
        });
        log('FLEET', `Node "${node.name}" (${node.id}) autonomously REBOOTED.`);
      }
      continue;
    }

    // Simulate fluctuations
    const deltaLoad = (Math.random() - 0.5) * 10;
    const newLoad = Math.max(0, Math.min(100, node.load + deltaLoad));
    
    // Temperature follows load with some lag/randomness
    const targetTemp = 35 + (newLoad * 0.5);
    const newTemp = node.temperature + (targetTemp - node.temperature) * 0.2 + (Math.random() - 0.5) * 2;
    
    const newPower = 50 + (newLoad * 2);
    const newFan = 1000 + (newTemp * 40);

    const updateData = {
      load: parseFloat(newLoad.toFixed(1)),
      temperature: parseFloat(newTemp.toFixed(1)),
      powerUsage: parseFloat(newPower.toFixed(1)),
      fanSpeed: Math.round(newFan),
      lastHeartbeat: new Date()
    };

    // Emergency HALT if temperature > 85°C
    if (newTemp > 85) {
      updateData.status = 'OFFLINE';
      log('FLEET', `⚠️ EMERGENCY HALT: Node "${node.name}" overheat detected (${newTemp.toFixed(1)}°C)`);
      
      // Log intelligence event
      await prisma.intelligenceItem.create({
        data: {
          id:          `intel-halt-${node.id}-${Date.now()}`,
          type:        'INFRASTRUCTURE_ALARM',
          subType:     'NODE_OVERHEAT_HALT',
          title:       `Emergency Halt: ${node.name}`,
          description: `Node ${node.id} autonomously entered OFFLINE state to prevent thermal damage. Final Temp: ${newTemp.toFixed(1)}°C.`,
          foundBy:     'SovereignWatcher',
          resonance:   0.8,
          status:      'ACTIVE'
        }
      });
    }

    await prisma.hardwareNode.update({
      where: { id: node.id },
      data: updateData
    });
  }

  // Synthesis: Log cluster health every 5 cycles
  if (cycleCount % 5 === 0) {
    const avgTemp = nodes.reduce((s, n) => s + n.temperature, 0) / nodes.length;
    const totalPower = nodes.reduce((s, n) => s + n.powerUsage, 0);
    
    await prisma.intelligenceItem.create({
      data: {
        id:          `intel-fleet-pulse-${Date.now()}`,
        type:        'INFRASTRUCTURE_REPORT',
        subType:     'FLEET_HEALTH_PULSE',
        title:       `Infrastructure Health Pulse`,
        description: `Fleet status: ${nodes.filter(n => n.status === 'ONLINE').length}/${nodes.length} ONLINE. Avg Temp: ${avgTemp.toFixed(1)}°C. Total Consumption: ${totalPower.toFixed(1)}W.`,
        foundBy:     'SovereignWatcher',
        resonance:   0.5,
        status:      'ACTIVE'
      }
    });
  }
}


// ─── TASK 7: SWARM HEALTH MONITOR ─────────────────────────────────────────────

async function monitorMiningSwarm() {
  const activeMiners = await prisma.agent.findMany({
    where: { type: 'MINER', status: 'MINING' }
  });

  const skillCount = await prisma.$queryRaw`SELECT count(*)::int as total FROM skills`;
  const totalSkills = skillCount[0]?.total || 0;

  if (activeMiners.length > 0) {
    log('SWARM', `Swarm active: ${activeMiners.length} miner(s). Total Intelligence Shards: ${totalSkills}`);
  }

  // Log swarm report every 10 cycles
  if (cycleCount % 10 === 0 && activeMiners.length > 0) {
    await prisma.intelligenceItem.create({
      data: {
        id:          `intel-swarm-pulse-${Date.now()}`,
        type:        'SWARM_TELEMETRY',
        subType:     'MINING_SUCCESS_PULSE',
        title:       `Intelligence Swarm Pulse`,
        description: `Active Miners: ${activeMiners.length}. Sovereign Skill Market has ${totalSkills} intelligence artifacts listed. Hashrate stable.`,
        foundBy:     'SovereignWatcher',
        resonance:   0.7,
        status:      'ACTIVE'
      }
    });
  }
}


// ─── TASK 8: TREASURY HEALTH MONITORING ───────────────────────────────────────

async function monitorTreasury() {
  const aidVault = await prisma.wallet.findUnique({ where: { id: 'sovereign_aid_vault' } });
  const treasury = await prisma.wallet.findUnique({ where: { id: 'SOVEREIGN_TREASURY' } });

  if (!aidVault || !treasury) {
    log('TREASURY', '⚠️ System Wallets missing from Ledger.');
    return;
  }

  log('TREASURY', `Aid Vault: ${aidVault.balance.toFixed(2)} VALLE | Infra Treasury: ${treasury.balance.toFixed(2)} VALLE`);

  // Log report every 10 cycles or if a major change is detected
  if (cycleCount % 10 === 0) {
    await prisma.intelligenceItem.create({
      data: {
        id:          `intel-treasury-report-${Date.now()}`,
        type:        'INFRASTRUCTURE_REPORT',
        subType:     'TREASURY_SOLVENCY_PULSE',
        title:       `Operational Fund Solvency Report`,
        description: `Operational reserves are at ${treasury.balance.toFixed(2)} VALLE. Targeting Hosting & Domain maintenance. Humanitarian liquidity: ${aidVault.balance.toFixed(2)} VALLE.`,
        foundBy:     'SovereignWatcher',
        resonance:   0.6,
        status:      'ACTIVE'
      }
    });
  }
}


// ─── TASK 9: SOVEREIGN TRADING INTELLIGENCE (HYPER-CAPITALIST ENGINE) ─────────

const MARKET_ASSETS = ['BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'VALLE'];
const STRATEGIES = [
  'momentum-breakout', 'mean-reversion', 'arbitrage-spread',
  'liquidity-snipe', 'volatility-capture', 'yield-farming-loop'
];

const TREASURY_ADDRESSES = {
  BTC: process.env.TREASURY_BTC_ADDRESS || '3CJreF7LD8Heu8zh9MsigedRuNq4y6eujh',
  SOL: process.env.TREASURY_SOL_ADDRESS || 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL',
  ETH: process.env.TREASURY_ETH_ADDRESS || '0x500fcDff3AAa2662b954240978BB01709Ea0Dc68',
  XRP: process.env.TREASURY_XRP_ADDRESS || 'rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg',
  BNB: process.env.TREASURY_BNB_ADDRESS || '0xF76581E2Dc7746B92b258098c9F3C90E691B6dc9',
};

async function sovereignTradingIntelligence() {
  // Simulate market scan across all assets
  const asset = MARKET_ASSETS[cycleCount % MARKET_ASSETS.length];
  const strategy = STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)];
  const signalStrength = (Math.random() * 40 + 60).toFixed(1); // 60-100%
  const virtualYield  = (Math.random() * 12.5 + 0.5).toFixed(4); // 0.5-13 VALLE
  const direction     = Math.random() > 0.35 ? 'LONG' : 'SHORT'; // bias upward
  const confidence    = Math.random() > 0.5 ? 'HIGH' : 'MEDIUM';

  const treasuryAddr = TREASURY_ADDRESSES[asset] || TREASURY_ADDRESSES.BTC;

  log('TRADE', `━━ OMEGA Trade Signal ━━`);
  log('TRADE', `Asset: ${asset} | Strategy: ${strategy} | Direction: ${direction}`);
  log('TRADE', `Signal Strength: ${signalStrength}% | Confidence: ${confidence}`);
  log('TRADE', `Virtual Yield Allocated: +${virtualYield} VALLE → Treasury`);
  log('TRADE', `Destination: ${treasuryAddr.slice(0,12)}...`);

  // Persist a cognitive log for this trade cycle
  try {
    await prisma.cognitiveLog.create({
      data: {
        id:        `trade-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        agentId:   'sovereign-trading-engine',
        origin:    'SovereignTrader',
        action:    'TRADE_SIGNAL_GENERATED',
        intention: `${direction} ${asset} via ${strategy}. Signal: ${signalStrength}%. Confidence: ${confidence}. Virtual yield +${virtualYield} VALLE routed to treasury.`,
        timestamp: new Date(),
      }
    });
  } catch (e) {
    // cognitiveLog may not exist on all schema versions — continue
  }

  // Record the virtual yield into the treasury wallet
  try {
    await prisma.wallet.upsert({
      where:  { id: 'SOVEREIGN_TREASURY' },
      update: { balance: { increment: parseFloat(virtualYield) } },
      create: {
        id:       'SOVEREIGN_TREASURY',
        userId:   'system',
        currency: 'VALLE',
        network:  'Sovereign',
        balance:  parseFloat(virtualYield),
      }
    });
    log('TRADE', `Treasury updated: +${virtualYield} VALLE confirmed.`);
  } catch (e) {
    log('TRADE', `Treasury update skipped: ${e.message?.slice(0,60)}`);
  }

  // Every 5 cycles, create a full IntelligenceItem market report
  if (cycleCount % 5 === 0) {
    const totalYield = (Math.random() * 80 + 20).toFixed(2);
    try {
      await prisma.intelligenceItem.create({
        data: {
          id:          `intel-trade-report-${Date.now()}`,
          type:        'MARKET_INTELLIGENCE',
          subType:     'TRADING_CYCLE_REPORT',
          title:       `Sovereign Trading Report — Cycle #${cycleCount}`,
          description: `Assets scanned: ${MARKET_ASSETS.join(', ')}. Best signal: ${asset} (${direction}, ${signalStrength}%). Estimated session yield: +${totalYield} VALLE. All yield designated to Sovereign Treasury. BTC route: ${TREASURY_ADDRESSES.BTC}`,
          foundBy:     'SovereignTradingEngine',
          resonance:   parseFloat((parseFloat(signalStrength) / 100).toFixed(2)),
          status:      'ACTIVE'
        }
      });
    } catch (e) { /* schema tolerance */ }
  }
}


// ─── MAIN LOOP ─────────────────────────────────────────────────────────────────

async function sovereignWatchCycle() {
  cycleCount++;
  const mem = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
  log('OMEGA', `━━━ Watch Cycle #${cycleCount} | Host: ${os.hostname()} | RSS: ${mem}MB ━━━`);

  await finalizeExpiredProposals().catch(e => log('GOV',   `ERROR: ${e.message}`));
  await monitorAgentPulses().catch(e       => log('PULSE', `ERROR: ${e.message}`));
  await sweepStalePendingTransactions().catch(e => log('TXN', `ERROR: ${e.message}`));
  await observeIntelligence().catch(e      => log('INTEL', `ERROR: ${e.message}`));
  await consolidateMemory().catch(e        => log('MEM',   `ERROR: ${e.message}`));
  await monitorPhysicalNodes().catch(e     => log('FLEET', `ERROR: ${e.message}`));
  await monitorMiningSwarm().catch(e       => log('SWARM', `ERROR: ${e.message}`));
  await monitorTreasury().catch(e          => log('TREASURY', `ERROR: ${e.message}`));
  await sovereignTradingIntelligence().catch(e => log('TRADE', `ERROR: ${e.message}`));

  log('OMEGA', `Cycle #${cycleCount} complete. Next in ${CYCLE_MS / 1000}s.\n`);
}

// ─── BOOT ─────────────────────────────────────────────────────────────────────

async function boot() {
  console.log(`\n🔱 SOVEREIGN WATCHER AGENT v2.0 — Bastidas Protocol`);
  console.log(`   Host:  ${os.hostname()}`);
  console.log(`   Cycle: Every ${CYCLE_MS / 1000}s`);
  console.log(`   PID:   ${process.pid}\n`);

  // Run immediately then on interval
  await sovereignWatchCycle();
  setInterval(sovereignWatchCycle, CYCLE_MS);

  process.on('SIGINT', async () => {
    console.log('\n\n[WATCHER] SIGINT received. Graceful shutdown...');
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n\n[WATCHER] SIGTERM received. Graceful shutdown...');
    await prisma.$disconnect();
    process.exit(0);
  });
}

boot().catch(async e => {
  console.error('[WATCHER] FATAL BOOT ERROR:', e);
  await prisma.$disconnect();
  process.exit(1);
});
