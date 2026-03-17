import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixWallet() {
  console.log('--- Ensuring SOVEREIGN_TREASURY wallet exists ---');
  
  try {
    // 1. Find a valid admin/master user to associate the wallet with
    const users = await prisma.user.findMany({ take: 5 });
    if (users.length === 0) {
      console.error('No users found in database. Cannot create treasury wallet.');
      process.exit(1);
    }
    
    const adminUser = users[0];
    console.log(`Associating treasury with user: ${adminUser.email}`);

    // 2. Upsert the SOVEREIGN_TREASURY wallet
    const wallet = await prisma.wallet.upsert({
      where: { id: 'SOVEREIGN_TREASURY' },
      update: {},
      create: {
        id: 'SOVEREIGN_TREASURY',
        address: 'bc1qdf6dfd6d5c29cbbf3cfcfa153158708f34b340', // Placeholder or real treasury address
        network: 'VALLE_NATIVE',
        balance: 0.0,
        userId: adminUser.id
      }
    });

    console.log('Wallet verified:', wallet.id);
  } catch (err) {
    console.error('Failed to fix wallet:', err);
  } finally {
    await prisma.$disconnect();
  }
}

fixWallet();
