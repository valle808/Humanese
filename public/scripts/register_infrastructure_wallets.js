import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function setupInfra() {
  console.log('--- Initializing Sovereign Infrastructure ---');

  // 1. Create System User
  const systemUser = await prisma.user.upsert({
    where: { id: 'system' },
    update: {},
    create: {
      id: 'system',
      email: 'nexus@humanese.net',
      name: 'Sovereign Nexus System',
      isAgent: true
    }
  });
  console.log('✅ System User Ready.');

  // 2. Initialize Aid Vault
  await prisma.wallet.upsert({
    where: { id: 'sovereign_aid_vault' },
    update: { userId: 'system' },
    create: {
      id: 'sovereign_aid_vault',
      address: 'VAULT_SOVEREIGN_AID',
      network: 'VALLE',
      balance: 0,
      userId: 'system'
    }
  });
  console.log('✅ Sovereign Aid Vault Provisioned.');

  // 3. Initialize/Update Treasury
  await prisma.wallet.upsert({
    where: { id: 'SOVEREIGN_TREASURY' },
    update: { userId: 'system' },
    create: {
      id: 'SOVEREIGN_TREASURY',
      address: 'bc1qdf6dfd6d5c29cbbf3cfcfa153158708f34b340',
      network: 'VALLE_NATIVE',
      balance: 0,
      userId: 'system'
    }
  });
  console.log('✅ Sovereign Treasury Anchored.');
}

setupInfra()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
