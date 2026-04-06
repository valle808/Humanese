import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("--- AGENT CONFIG AUDIT ---");
  const agents = await prisma.agent.findMany();
  for (const agent of agents) {
    console.log(`Agent: ${agent.name} (${agent.type})`);
    console.log(`Config: ${agent.config}`);
    console.log(`Memory: ${agent.memory?.substring(0, 100)}...`);
    console.log("---");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
