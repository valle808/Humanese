import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const TARGET_EMAIL = 'valle808@hawaii.edu';
const NEW_SOL_ADDRESS = 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL';

async function main() {
  console.log(`Starting Solana Vault Setup for ${TARGET_EMAIL}...`);

  // 1. Find the target user
  const user = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
  });

  if (!user) {
    console.error(`User ${TARGET_EMAIL} not found!`);
    process.exit(1);
  }

  console.log(`Found user: ${user.id}`);

  // 2. Find all SOL wallets in the system
  // We check for both 'Solana' and 'SOL' network tags
  const allSolWallets = await prisma.wallet.findMany({
    where: { 
      OR: [
        { network: 'Solana' },
        { network: 'SOL' }
      ]
    },
  });

  console.log(`Found ${allSolWallets.length} existing Solana wallets.`);

  let totalBalance = 0;
  for (const w of allSolWallets) {
    totalBalance += w.balance;
    console.log(`Found wallet ${w.address} (Network: ${w.network}) with balance ${w.balance}`);
  }

  // 3. Setup the default Solana wallet for the target user
  let targetWallet = await prisma.wallet.findFirst({
    where: {
      userId: user.id,
      OR: [
        { network: 'Solana' },
        { network: 'SOL' }
      ]
    }
  });

  if (targetWallet) {
    console.log(`Updating existing Solana wallet for user ${TARGET_EMAIL}...`);
    targetWallet = await prisma.wallet.update({
      where: { id: targetWallet.id },
      data: {
        address: NEW_SOL_ADDRESS,
        network: 'Solana', // Standardize to 'Solana'
        balance: totalBalance // Consolidate all balances here
      }
    });
  } else {
    console.log(`Creating new default Solana wallet for user ${TARGET_EMAIL}...`);
    targetWallet = await prisma.wallet.create({
      data: {
        id: `wallet_sol_${uuidv4()}`,
        userId: user.id,
        network: 'Solana',
        address: NEW_SOL_ADDRESS,
        balance: totalBalance
      }
    });
  }

  console.log(`Consolidated Solana wallet created/updated: ${targetWallet.address} with balance ${targetWallet.balance}`);

  // 4. Zero out and update other SOL wallets
  const others = allSolWallets.filter(w => w.address !== NEW_SOL_ADDRESS);
  for (const w of others) {
    await prisma.wallet.update({
      where: { id: w.id },
      data: {
        balance: 0
      }
    });
    console.log(`Zeroed out balance for wallet ${w.address}`);
  }

  console.log('Solana Consolidation Complete.');
  
  // Verify
  const verify = await prisma.wallet.findUnique({
    where: { address: NEW_SOL_ADDRESS }
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
