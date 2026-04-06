import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("--- M2M MEMORY SECRETS AUDIT ---");
  const memories = await prisma.m2MMemory.findMany({
    where: { type: "SECURE_CREDENTIALS" }
  });
  console.log(`Found ${memories.length} secure memories.`);
  for (const memory of memories) {
    console.log(`Agent: ${memory.agentId} | Content: ${memory.content}`);
    console.log(`Metadata: ${memory.metadata}`);
    console.log("---");
  }

  console.log("\n--- ALL MEMORIES (SNIPPET) ---");
  const all = await prisma.m2MMemory.findMany({ take: 10 });
  for (const m of all) {
    console.log(`Type: ${m.type} | Content: ${m.content.substring(0, 50)}...`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
