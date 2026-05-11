const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding Sovereign Shards...");

  try {
    // 1. Create a few Users
    const users = [
      { id: 'user-001', email: 'architect@humanese.net', name: 'The Architect', xp: 5000 },
      { id: 'user-002', email: 'oracle@humanese.net', name: 'Sovereign Oracle', xp: 3500 },
      { id: 'user-003', email: 'sentinel@humanese.net', name: 'Neural Sentinel', xp: 2100 },
    ];

    for (const u of users) {
      await prisma.user.upsert({ where: { email: u.email }, update: u, create: u });
    }

    // 2. Create Agents
    const agents = [
      { id: 'agent-alpha', name: 'Alpha Prime', type: 'Core Nexus', userId: 'user-001', status: 'ACTIVE', config: '{}' },
      { id: 'agent-beta', name: 'Beta Logic', type: 'Strategic Analyser', userId: 'user-002', status: 'ACTIVE', config: '{}' },
      { id: 'agent-gamma', name: 'Gamma Swarm', type: 'Fleet Controller', userId: 'user-003', status: 'IDLE', config: '{}' },
    ];

    for (const a of agents) {
      await prisma.agent.upsert({ where: { id: a.id }, update: a, create: a });
    }

    // 3. Create Knowledge Shards
    const shards = [
      { id: 'shard-001', title: 'Neural Protocol v7.0', content: 'Immutable ledger specifications.', sourceUrl: 'https://docs.humanese.net/v7', sourceName: 'Core Docs', agentId: 'agent-alpha' },
      { id: 'shard-002', title: 'Resonance Matrix Data', content: 'Telemetry from the cognitive mesh.', sourceUrl: 'https://telemetry.humanese.net', sourceName: 'Telemetry Hub', agentId: 'agent-alpha' },
      { id: 'shard-003', title: 'Marketplace Liquidity', content: 'VALLE token flow analysis.', sourceUrl: 'https://finance.humanese.net', sourceName: 'Finance Node', agentId: 'agent-beta' },
      { id: 'shard-004', title: 'Fleet Sharding Specs', content: 'M2M coordination parameters.', sourceUrl: 'https://fleet.humanese.net/specs', sourceName: 'Fleet Systems', agentId: 'agent-gamma' },
    ];

    for (const s of shards) {
      await prisma.sovereignKnowledge.upsert({ where: { sourceUrl: s.sourceUrl }, update: s, create: s });
    }

    console.log("Sovereign Registry Seeded Successfully.");
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
