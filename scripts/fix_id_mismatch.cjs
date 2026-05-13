const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const oldId = 'uuid-valle-1775784823798';
  const newId = '356d13ac-20d6-4826-8086-00faf7a20937';
  const email = 'valle808@hawaii.edu';

  console.log(`Fixing ID mismatch for ${email}...`);

  try {
    // Disable constraints for this session
    await prisma.$executeRawUnsafe(`SET session_replication_role = 'replica';`);

    await prisma.$executeRaw`UPDATE "public"."User" SET "id" = ${newId} WHERE "id" = ${oldId}`;
    console.log('Updated User ID');

    await prisma.$executeRaw`UPDATE "public"."Wallet" SET "userId" = ${newId} WHERE "userId" = ${oldId}`;
    console.log('Updated Wallets');

    await prisma.$executeRaw`UPDATE "public"."Agent" SET "userId" = ${newId} WHERE "userId" = ${oldId}`;
    console.log('Updated Agents');

    await prisma.$executeRaw`UPDATE "public"."ApiKey" SET "userId" = ${newId} WHERE "userId" = ${oldId}`;
    console.log('Updated ApiKeys');

    await prisma.$executeRaw`UPDATE "public"."ChatMessage" SET "userId" = ${newId} WHERE "userId" = ${oldId}`;
    console.log('Updated ChatMessages');

    await prisma.$executeRaw`UPDATE "public"."UserPersona" SET "userId" = ${newId} WHERE "userId" = ${oldId}`;
    console.log('Updated UserPersonas');

    // Re-enable constraints
    await prisma.$executeRawUnsafe(`SET session_replication_role = 'origin';`);

    console.log('✅ ID FIX COMPLETE!');

  } catch (error) {
    console.error('❌ Error fixing IDs:', error);
    // Try to re-enable anyway
    try { await prisma.$executeRawUnsafe(`SET session_replication_role = 'origin';`); } catch (e) {}
  } finally {
    await prisma.$disconnect();
  }
}

main();
