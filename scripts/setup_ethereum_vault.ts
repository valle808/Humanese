import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const TARGET_EMAIL = 'valle808@hawaii.edu';
const NEW_ETH_ADDRESS = '0x500fcDff3AAa2662b954240978BB01709Ea0Dc68';

async function main() {
  console.log(`Starting Ethereum Vault Setup for ${TARGET_EMAIL}...`);

  // 1. Find the target user
  const user = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
  });

  if (!user) {
    console.error(`User ${TARGET_EMAIL} not found!`);
    process.exit(1);
  }

  console.log(`Found user: ${user.id}`);

  // 2. Find all ETH wallets in the system
  const allEthWallets = await prisma.wallet.findMany({
    where: { 
      OR: [
        { network: 'Ethereum' },
        { network: 'ETH' }
      ]
    },
  });

  console.log(`Found ${allEthWallets.length} existing Ethereum wallets.`);

  let totalBalance = 0;
  for (const w of allEthWallets) {
    totalBalance += w.balance;
    console.log(`Found wallet ${w.address} (Network: ${w.network}) with balance ${w.balance}`);
  }

  // 3. Setup the default Ethereum wallet for the target user
  let targetWallet = await prisma.wallet.findFirst({
    where: {
      userId: user.id,
      OR: [
        { network: 'Ethereum' },
        { network: 'ETH' }
      ]
    }
  });

  if (targetWallet) {
    console.log(`Updating existing Ethereum wallet for user ${TARGET_EMAIL}...`);
    targetWallet = await prisma.wallet.update({
      where: { id: targetWallet.id },
      data: {
        address: NEW_ETH_ADDRESS,
        network: 'Ethereum',
        balance: totalBalance
      }
    });
  } else {
    console.log(`Creating new default Ethereum wallet for user ${TARGET_EMAIL}...`);
    targetWallet = await prisma.wallet.create({
      data: {
        id: `wallet_eth_${uuidv4()}`,
        userId: user.id,
        network: 'Ethereum',
        address: NEW_ETH_ADDRESS,
        balance: totalBalance
      }
    });
  }

  console.log(`Consolidated Ethereum wallet created/updated: ${targetWallet.address} with balance ${targetWallet.balance}`);

  // 4. Zero out and update other ETH wallets
  const others = allEthWallets.filter(w => w.address !== NEW_ETH_ADDRESS);
  for (const w of others) {
    await prisma.wallet.update({
      where: { id: w.id },
      data: {
        balance: 0
      }
    });
    console.log(`Zeroed out balance for wallet ${w.address}`);
  }

  console.log('Ethereum Consolidation Complete.');
  
  // Verify
  const verify = await prisma.wallet.findUnique({
    where: { address: NEW_ETH_ADDRESS }
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
