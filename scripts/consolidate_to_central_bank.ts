import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'valle808@hawaii.edu';

const CENTRAL_BANK = {
  SOL: 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL',
  BTC: '3CJreF7LD8Heu8zh9MsigedRuNq4y6eujh',
  ETH: '0x500fcDff3AAa2662b954240978BB01709Ea0Dc68',
  XRP: 'rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg',
  XRP_MEMO: '2932723390',
  BNB: '0xF76581E2Dc7746B92b258098c9F3C90E691B6dc9',
  GENESIS_TREASURY_BTC: 'bc1qdf6dfd6d5c29cbbf3cfcfa153158708f34b340'
};

async function main() {
  console.log(`Starting Global Fund Consolidation to Admin: ${ADMIN_EMAIL}...`);

  // 1. Find the admin user
  const admin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (!admin) {
    console.error(`Admin user ${ADMIN_EMAIL} not found!`);
    process.exit(1);
  }

  const currencies = [
    { name: 'SOL', address: CENTRAL_BANK.SOL, networkTags: ['Solana', 'SOL'] },
    { name: 'BTC', address: CENTRAL_BANK.BTC, networkTags: ['Bitcoin', 'BTC'], extraAddresses: [CENTRAL_BANK.GENESIS_TREASURY_BTC] },
    { name: 'ETH', address: CENTRAL_BANK.ETH, networkTags: ['Ethereum', 'ETH'] },
    { name: 'XRP', address: CENTRAL_BANK.XRP, memo: CENTRAL_BANK.XRP_MEMO, networkTags: ['XRP'] },
    { name: 'BNB', address: CENTRAL_BANK.BNB, networkTags: ['BNB', 'BSC', 'Binance'] },
  ];

  for (const cur of currencies) {
    console.log(`\nConsolidating ${cur.name}...`);
    
    // Find all wallets for this currency (including extra addresses like Genesis)
    const allWallets = await prisma.wallet.findMany({
      where: {
        OR: [
          ...cur.networkTags.map(tag => ({ network: tag })),
          ...(cur.extraAddresses || []).map(addr => ({ address: addr }))
        ]
      }
    });

    let totalBalance = 0;
    for (const w of allWallets) {
      totalBalance += w.balance;
      console.log(`Aggregating wallet ${w.address} (Balance: ${w.balance})`);
    }

    // Setup/Update Admin Wallet
    let adminWallet = await prisma.wallet.findFirst({
      where: {
        userId: admin.id,
        network: cur.networkTags[0]
      }
    });

    if (adminWallet) {
      console.log(`Updating Admin's ${cur.name} wallet...`);
      adminWallet = await prisma.wallet.update({
        where: { id: adminWallet.id },
        data: {
          address: cur.address,
          memo: cur.memo || null,
          balance: totalBalance
        }
      });
    } else {
      console.log(`Creating Admin's ${cur.name} wallet...`);
      adminWallet = await prisma.wallet.create({
        data: {
          id: `wallet_${cur.name.toLowerCase()}_${uuidv4()}`,
          userId: admin.id,
          network: cur.networkTags[0],
          address: cur.address,
          memo: cur.memo || null,
          balance: totalBalance
        }
      });
    }

    console.log(`Consolidated Admin ${cur.name} Wallet: ${adminWallet.address} | Total: ${adminWallet.balance}`);

    // Zero out other wallets
    const others = allWallets.filter(w => w.address !== cur.address);
    for (const w of others) {
      await prisma.wallet.update({
        where: { id: w.id },
        data: { balance: 0 }
      });
      console.log(`Zeroed out ${w.address}`);
    }
  }

  console.log('\nGlobal Consolidation Complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
