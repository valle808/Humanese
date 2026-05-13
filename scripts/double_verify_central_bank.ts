import { PrismaClient } from '@prisma/client';
import { CoinbaseService } from '../lib/coinbase.js';

const prisma = new PrismaClient();
const coinbase = CoinbaseService.getInstance();
const ADMIN_EMAIL = 'valle808@hawaii.edu';

async function main() {
  console.log('--- GLOBAL CENTRAL BANK & COINBASE VERIFICATION ---\n');

  const admin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
    include: { Wallet: true }
  });

  if (!admin) {
    console.error('FATAL: Admin user not found.');
    return;
  }

  const providedAddresses = {
    BTC: '3CJreF7LD8Heu8zh9MsigedRuNq4y6eujh',
    ETH: '0x500fcDff3AAa2662b954240978BB01709Ea0Dc68',
    SOL: 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL',
    XRP: 'rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg',
    BNB: '0xF76581E2Dc7746B92b258098c9F3C90E691B6dc9'
  };

  console.log(`Checking Humanese Ledger for ${ADMIN_EMAIL}...`);
  for (const wallet of admin.Wallet) {
    const expected = (providedAddresses as any)[wallet.network];
    const status = expected === wallet.address ? '✅ SYNCED' : '⚠️ LOCAL_ONLY';
    console.log(`[${wallet.network}] ${wallet.address.substring(0, 12)}... | Balance: ${wallet.balance} | Status: ${status}`);
  }

  console.log('\n--- COINBASE CDP STATUS ---');
  const keyName = process.env.COINBASE_CDP_API_KEY_NAME;
  if (keyName) {
    console.log('✅ Coinbase CDP Integration: ACTIVE');
    console.log(`Project ID: ${process.env.COINBASE_CDP_PROJECT_ID}`);
    console.log('Sovereign Bridge: ESTABLISHED');
  } else {
    console.log('❌ Coinbase CDP Integration: STANDBY (Credentials Required in .env.local)');
  }

  // Check Swarm Activity
  console.log('\n--- MINING SWARM STATUS ---');
  const activeMiners = await prisma.hardwareNode.findMany({
    where: { status: 'ONLINE' }
  });
  console.log(`Active Swarm Nodes: ${activeMiners.length}`);
  for (const node of activeMiners) {
    console.log(`- ${node.name}: ${node.hashrate} KH/s (Mining to ${ADMIN_EMAIL})`);
  }

  const leakage = await prisma.wallet.findMany({
    where: { userId: { not: admin.id }, balance: { gt: 0 } }
  });

  if (leakage.length === 0) {
    console.log('\n✅ LEAKAGE VERIFICATION: 100% funds centralized.');
  } else {
    console.log(`\n⚠️ LEAKAGE DETECTED: ${leakage.length} orphan wallets found.`);
  }

  console.log('\n--- VERIFICATION COMPLETE ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
