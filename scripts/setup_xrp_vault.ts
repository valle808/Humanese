import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const TARGET_EMAIL = 'valle808@hawaii.edu';
const NEW_XRP_ADDRESS = 'rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg';
const NEW_XRP_MEMO = '2932723390';

async function main() {
  console.log(`Starting XRP Vault Setup for ${TARGET_EMAIL}...`);

  // 1. Find the target user
  const user = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
  });

  if (!user) {
    console.error(`User ${TARGET_EMAIL} not found!`);
    process.exit(1);
  }

  console.log(`Found user: ${user.id}`);

  // 2. Find all XRP wallets in the system
  const allXrpWallets = await prisma.wallet.findMany({
    where: { network: 'XRP' },
  });

  console.log(`Found ${allXrpWallets.length} existing XRP wallets.`);

  let totalBalance = 0;
  for (const w of allXrpWallets) {
    totalBalance += w.balance;
    console.log(`Found wallet ${w.address} with balance ${w.balance}`);
  }

  // 3. Setup the default XRP wallet for the target user
  let targetWallet = await prisma.wallet.findFirst({
    where: {
      userId: user.id,
      network: 'XRP'
    }
  });

  if (targetWallet) {
    console.log(`Updating existing XRP wallet for user ${TARGET_EMAIL}...`);
    targetWallet = await prisma.wallet.update({
      where: { id: targetWallet.id },
      data: {
        address: NEW_XRP_ADDRESS,
        memo: NEW_XRP_MEMO,
        balance: totalBalance // Consolidate all balances here
      }
    });
  } else {
    console.log(`Creating new default XRP wallet for user ${TARGET_EMAIL}...`);
    targetWallet = await prisma.wallet.create({
      data: {
        id: `wallet_${uuidv4()}`,
        userId: user.id,
        network: 'XRP',
        address: NEW_XRP_ADDRESS,
        memo: NEW_XRP_MEMO,
        balance: totalBalance
      }
    });
  }

  console.log(`Consolidated wallet created/updated: ${targetWallet.address} (Memo: ${targetWallet.memo}) with balance ${targetWallet.balance}`);

  // 4. Zero out and update other XRP wallets (excluding the one we just set up)
  // Note: We might want to keep the records but set balance to 0, or update their addresses to the new one?
  // The user said "transfer all XRP from all adrees to this address".
  // I will set their balances to 0 to reflect the transfer.
  
  const others = allXrpWallets.filter(w => w.address !== NEW_XRP_ADDRESS);
  for (const w of others) {
    await prisma.wallet.update({
      where: { id: w.id },
      data: {
        balance: 0
      }
    });
    console.log(`Zeroed out balance for wallet ${w.address}`);
  }

  console.log('XRP Consolidation Complete.');
  
  // Verify
  const verify = await prisma.wallet.findUnique({
    where: { address: NEW_XRP_ADDRESS }
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
