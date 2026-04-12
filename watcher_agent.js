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

import { PrismaClient } from '@prisma/client';
import os from 'os';

const prisma = new PrismaClient();
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
