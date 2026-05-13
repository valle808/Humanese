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
  GENESIS_TREASURY_BTC: 'bc1qdf6dfd6d5c29cbbf3cfcfa153158708f34b340',
  HMN: 'HMN-VALLE-928EA932'
};

async function main() {
  console.log(`Starting TOTAL Global Fund Consolidation to Admin: ${ADMIN_EMAIL}...`);

  const admin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (!admin) {
    console.error(`Admin user ${ADMIN_EMAIL} not found!`);
    process.exit(1);
  }

  // 1. Get ALL unique networks in the system
  const wallets = await prisma.wallet.findMany();
  const networks = Array.from(new Set(wallets.map(w => w.network)));

  console.log(`Found ${networks.length} unique networks: ${networks.join(', ')}`);

  for (const network of networks) {
    console.log(`\nConsolidating network: ${network}...`);

    // Determine target address for admin
    let targetAddress = '';
    let targetMemo: string | null = null;

    if (network.includes('Bitcoin') || network === 'BTC') targetAddress = CENTRAL_BANK.BTC;
    else if (network.includes('Solana') || network === 'SOL') targetAddress = CENTRAL_BANK.SOL;
    else if (network.includes('Ethereum') || network === 'ETH') targetAddress = CENTRAL_BANK.ETH;
    else if (network === 'XRP') { targetAddress = CENTRAL_BANK.XRP; targetMemo = CENTRAL_BANK.XRP_MEMO; }
    else if (network === 'BNB' || network === 'BSC') targetAddress = CENTRAL_BANK.BNB;
    else if (network.includes('Humanese')) targetAddress = CENTRAL_BANK.HMN;
    else {
      // For other networks, try to find the admin's existing address or use a placeholder
      const existing = await prisma.wallet.findFirst({ where: { userId: admin.id, network } });
      targetAddress = existing ? existing.address : `ADMIN-${network.toUpperCase()}-${uuidv4().substring(0,8)}`;
    }

    // Special case for Genesis Treasury BTC address (ensure it's included in aggregation)
    const extraAddrs = (network.includes('Bitcoin') || network === 'BTC') ? [CENTRAL_BANK.GENESIS_TREASURY_BTC] : [];

    const allWalletsForNetwork = await prisma.wallet.findMany({
      where: {
        OR: [
          { network },
          { address: { in: extraAddrs } }
        ]
      }
    });

    let totalBalance = 0;
    for (const w of allWalletsForNetwork) {
      totalBalance += w.balance;
    }

    // Update or Create Admin Wallet
    const adminWallet = await prisma.wallet.upsert({
      where: { address: targetAddress },
      update: { balance: totalBalance, memo: targetMemo },
      create: {
        id: `wallet_${network.replace(/\s+/g, '_').toLowerCase()}_${uuidv4()}`,
        userId: admin.id,
        network,
        address: targetAddress,
        memo: targetMemo,
        balance: totalBalance
      }
    });

    console.log(`Consolidated Admin Wallet: ${adminWallet.address} (${network}) | Total: ${adminWallet.balance}`);

    // Zero out everyone else
    for (const w of allWalletsForNetwork) {
      if (w.address !== targetAddress) {
        await prisma.wallet.update({
          where: { id: w.id },
          data: { balance: 0 }
        });
      }
    }
  }

  console.log('\n--- ALL FUNDS CONSOLIDATED TO ADMIN ---');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
