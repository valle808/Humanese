import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function registerMiners() {
  const miners = [
    {
      id: 'MinerSwarm_Lead',
      name: 'Deep Dig Alpha',
      email: 'miner-lead@humanese.net',
      serviceType: 'agent',
      isAgent: true
    },
    {
      id: 'Miner_001',
      name: 'Sovereign Miner 01',
      email: 'miner-001@humanese.net',
      serviceType: 'agent',
      isAgent: true
    }
  ];

  for (const m of miners) {
    // 1. Upsert User
    await prisma.user.upsert({
      where: { id: m.id },
      update: m,
      create: m
    });
    
    // 2. Upsert Agent
    await prisma.agent.upsert({
      where: { id: m.id },
      update: {
        name: m.name,
        type: 'MINER',
        config: JSON.stringify({ research: true, stratum: true }),
        status: 'IDLE',
        lastPulse: new Date(),
        userId: m.id
      },
      create: {
        id: m.id,
        name: m.name,
        type: 'MINER',
        config: JSON.stringify({ research: true, stratum: true }),
        status: 'IDLE',
        lastPulse: new Date(),
        userId: m.id
      }
    });
    
    console.log(`Registered Miner Agent: ${m.id}`);
  }
}

registerMiners()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
