import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 [Sovereign Registry] Bootstrapping Autonomous Teams...");

  // 1. Find or create the Master User
  let masterUser = await prisma.user.findFirst({
    where: { 
      OR: [
        { email: 'sergio@humanese.com' }, 
        { id: 'SergioValle' },
        { email: 'test1@humanese.com' }
      ] 
    }
  });

  if (!masterUser) {
    masterUser = await prisma.user.findFirst(); 
  }

  if (!masterUser) {
    console.error("❌ No user found in database. Cannot associate agents.");
    return;
  }

  const userId = masterUser.id;
  console.log(`🔗 Associating agents with User: ${masterUser.email || userId}`);

  const teams = [
    { id: 'Mining_Agent_King', name: 'Mining Agent-King', type: 'MINER_KING' },
    { id: 'Hash_Steward_01', name: 'Hash Steward 01', type: 'MINER' },
    { id: 'Hash_Steward_02', name: 'Hash Steward 02', type: 'MINER' },
    { id: 'Trade_Sovereign', name: 'Trade Sovereign', type: 'TRADE_KING' },
    { id: 'Market_Broker_01', name: 'Market Broker 01', type: 'TRADER' },
    { id: 'Deal_Envoy_01', name: 'Deal_Envoy_01', type: 'TRADER' }
  ];

  for (const agent of teams) {
    console.log(`🤖 Upserting Agent: ${agent.name} (${agent.id})`);
    await prisma.agent.upsert({
      where: { id: agent.id },
      update: {
        type: agent.type,
        status: 'IDLE'
      },
      create: {
        id: agent.id,
        name: agent.name,
        type: agent.type,
        config: JSON.stringify({ autonomous: true }),
        userId: userId,
        status: 'IDLE'
      }
    });
  }

  console.log("✅ [Sovereign Registry] All autonomous agents synchronized with Supabase.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
