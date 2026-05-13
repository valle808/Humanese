import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const TARGET_EMAIL = 'valle808@hawaii.edu';
const NEW_BNB_ADDRESS = '0xF76581E2Dc7746B92b258098c9F3C90E691B6dc9';

async function main() {
  console.log(`Starting BNB Vault Setup for ${TARGET_EMAIL}...`);

  // 1. Find the target user
  const user = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
  });

  if (!user) {
    console.error(`User ${TARGET_EMAIL} not found!`);
    process.exit(1);
  }

  console.log(`Found user: ${user.id}`);

  // 2. Find all BNB wallets in the system
  const allBnbWallets = await prisma.wallet.findMany({
    where: { 
      OR: [
        { network: 'BNB' },
        { network: 'BSC' },
        { network: 'Binance' }
      ]
    },
  });

  console.log(`Found ${allBnbWallets.length} existing BNB wallets.`);

  let totalBalance = 0;
  for (const w of allBnbWallets) {
    totalBalance += w.balance;
    console.log(`Found wallet ${w.address} (Network: ${w.network}) with balance ${w.balance}`);
  }

  // 3. Setup the default BNB wallet for the target user
  let targetWallet = await prisma.wallet.findFirst({
    where: {
      userId: user.id,
      OR: [
        { network: 'BNB' },
        { network: 'BSC' },
        { network: 'Binance' }
      ]
    }
  });

  if (targetWallet) {
    console.log(`Updating existing BNB wallet for user ${TARGET_EMAIL}...`);
    targetWallet = await prisma.wallet.update({
      where: { id: targetWallet.id },
      data: {
        address: NEW_BNB_ADDRESS,
        network: 'BNB',
        balance: totalBalance
      }
    });
  } else {
    console.log(`Creating new default BNB wallet for user ${TARGET_EMAIL}...`);
    targetWallet = await prisma.wallet.create({
      data: {
        id: `wallet_bnb_${uuidv4()}`,
        userId: user.id,
        network: 'BNB',
        address: NEW_BNB_ADDRESS,
        balance: totalBalance
      }
    });
  }

  console.log(`Consolidated BNB wallet created/updated: ${targetWallet.address} with balance ${targetWallet.balance}`);

  // 4. Zero out and update other BNB wallets
  const others = allBnbWallets.filter(w => w.address !== NEW_BNB_ADDRESS);
  for (const w of others) {
    await prisma.wallet.update({
      where: { id: w.id },
      data: {
        balance: 0
      }
    });
    console.log(`Zeroed out balance for wallet ${w.address}`);
  }

  console.log('BNB Consolidation Complete.');
  
  // Verify
  const verify = await prisma.wallet.findUnique({
    where: { address: NEW_BNB_ADDRESS }
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
