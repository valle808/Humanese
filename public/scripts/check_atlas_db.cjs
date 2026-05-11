const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const userCount = await prisma.user.count();
  const agentCount = await prisma.agent.count();
  const knowledgeCount = await prisma.sovereignKnowledge.count();
  console.log({ userCount, agentCount, knowledgeCount });
  process.exit(0);
}

check();
