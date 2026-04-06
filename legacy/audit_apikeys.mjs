import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("--- API KEY TABLE AUDIT ---");
  const keys = await prisma.apiKey.findMany({
    include: { user: true }
  });
  console.log(`Found ${keys.length} keys.`);
  for (const k of keys) {
    console.log(`Name: ${k.name} | User: ${k.user?.email} | KeyHash: ${k.keyHash.substring(0, 10)}...`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
