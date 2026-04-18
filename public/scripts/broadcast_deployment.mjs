/**
 * Sovereign Broadcast Script — On-Chain Telemetry
 * Signed: Gio V. / Bastidas Protocol
 * 
 * Logs a deployment event to the SovereignKnowledge table
 * and emits an IntelligenceItem for the swarm to observe.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function broadcastDeployment() {
  const deploymentUrl = process.env.DEPLOYMENT_URL || 'https://humanese.vercel.app';
  const gitSha       = process.env.GIT_SHA        || 'local';
  const deployer     = process.env.DEPLOYER       || 'Gio V. / Bastidas Protocol';
  const timestamp    = new Date().toISOString();

  console.log('[Sovereign Broadcast] Anchoring deployment to Sovereign Ledger...');

  // 1 — Log to the Sovereign Knowledge base
  await prisma.sovereignKnowledge.upsert({
    where: { sourceUrl: `deployment:${gitSha}` },
    create: {
      id:         `deploy-${gitSha}`,
      title:      `OMEGA v7.0 Deployment — ${timestamp}`,
      content:    `Sovereign Matrix has been deployed to production.\n\nURL: ${deploymentUrl}\nCommit: ${gitSha}\nDeployer: ${deployer}\nTimestamp: ${timestamp}`,
      sourceUrl:  `deployment:${gitSha}`,
      sourceName: 'Bastidas Protocol CI/CD',
      agentId:    'prime-dev',
    },
    update: {
      content:   `Sovereign Matrix re-deployed.\n\nURL: ${deploymentUrl}\nCommit: ${gitSha}\nDeployer: ${deployer}\nTimestamp: ${timestamp}`,
    }
  });

  // 2 — Emit an IntelligenceItem for the swarm
  await prisma.intelligenceItem.create({
    data: {
      id:          `intel-deploy-${gitSha}-${Date.now()}`,
      type:        'DEPLOYMENT_EVENT',
      subType:     'PRODUCTION',
      title:       `OMEGA v7.0 LIVE — ${deploymentUrl}`,
      description: `Autonomous deploy complete. Commit ${gitSha.slice(0, 8)} anchored to Sovereign Mesh.`,
      foundBy:     'Bastidas Protocol CI/CD',
      proposedBy:  'Gio V.',
      resonance:   1.0,
      status:      'ACTIVE',
    }
  });

  console.log(`[Sovereign Broadcast] ✅ Deployment event anchored to Sovereign Ledger.`);
  console.log(`[Sovereign Broadcast] 🔱 OMEGA v7.0 LIVE: ${deploymentUrl}`);
}

broadcastDeployment()
  .catch(e => { console.error('[Sovereign Broadcast] FATAL:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
