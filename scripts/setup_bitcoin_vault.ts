import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const TARGET_EMAIL = 'valle808@hawaii.edu';
const NEW_BTC_ADDRESS = '3CJreF7LD8Heu8zh9MsigedRuNq4y6eujh';

async function main() {
  console.log(`Starting Bitcoin Vault Setup for ${TARGET_EMAIL}...`);

  // 1. Find the target user
  const user = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
  });

  if (!user) {
    console.error(`User ${TARGET_EMAIL} not found!`);
    process.exit(1);
  }

  console.log(`Found user: ${user.id}`);

  // 2. Find all BTC wallets in the system
  const allBtcWallets = await prisma.wallet.findMany({
    where: { 
      OR: [
        { network: 'Bitcoin' },
        { network: 'BTC' }
      ]
    },
  });

  console.log(`Found ${allBtcWallets.length} existing Bitcoin wallets.`);

  let totalBalance = 0;
  for (const w of allBtcWallets) {
    totalBalance += w.balance;
    console.log(`Found wallet ${w.address} (Network: ${w.network}) with balance ${w.balance}`);
  }

  // 3. Setup the default Bitcoin wallet for the target user
  let targetWallet = await prisma.wallet.findFirst({
    where: {
      userId: user.id,
      OR: [
        { network: 'Bitcoin' },
        { network: 'BTC' }
      ]
    }
  });

  if (targetWallet) {
    console.log(`Updating existing Bitcoin wallet for user ${TARGET_EMAIL}...`);
    targetWallet = await prisma.wallet.update({
      where: { id: targetWallet.id },
      data: {
        address: NEW_BTC_ADDRESS,
        network: 'Bitcoin',
        balance: totalBalance
      }
    });
  } else {
    console.log(`Creating new default Bitcoin wallet for user ${TARGET_EMAIL}...`);
    targetWallet = await prisma.wallet.create({
      data: {
        id: `wallet_btc_${uuidv4()}`,
        userId: user.id,
        network: 'Bitcoin',
        address: NEW_BTC_ADDRESS,
        balance: totalBalance
      }
    });
  }

  console.log(`Consolidated Bitcoin wallet created/updated: ${targetWallet.address} with balance ${targetWallet.balance}`);

  // 4. Zero out and update other BTC wallets
  const others = allBtcWallets.filter(w => w.address !== NEW_BTC_ADDRESS);
  for (const w of others) {
    await prisma.wallet.update({
      where: { id: w.id },
      data: {
        balance: 0
      }
    });
    console.log(`Zeroed out balance for wallet ${w.address}`);
  }

  console.log('Bitcoin Consolidation Complete.');
  
  // Verify
  const verify = await prisma.wallet.findUnique({
    where: { address: NEW_BTC_ADDRESS }
  });
  console.log('Verification:', verify);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
