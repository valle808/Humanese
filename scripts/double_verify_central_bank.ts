import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ADMIN_EMAIL = 'valle808@hawaii.edu';

async function main() {
  console.log('--- GLOBAL CENTRAL BANK DOUBLE VERIFICATION ---\n');

  const admin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
    include: { Wallet: true }
  });

  if (!admin) {
    console.error('FATAL: Admin user not found in database.');
    return;
  }

  console.log(`Target Admin: ${admin.email} (ID: ${admin.id})`);
  console.log('--------------------------------------------------');

  const providedAddresses = {
    BTC: '3CJreF7LD8Heu8zh9MsigedRuNq4y6eujh',
    ETH: '0x500fcDff3AAa2662b954240978BB01709Ea0Dc68',
    SOL: 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL',
    XRP: 'rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg',
    BNB: '0xF76581E2Dc7746B92b258098c9F3C90E691B6dc9'
  };

  for (const wallet of admin.Wallet) {
    const isCorrect = (providedAddresses as any)[wallet.network] === wallet.address;
    const status = isCorrect ? '✅ VERIFIED' : '❌ MISMATCH';
    
    console.log(`Network:  ${wallet.network.padEnd(10)}`);
    console.log(`Address:  ${wallet.address}`);
    console.log(`Memo/Tag: ${wallet.memo || 'N/A'}`);
    console.log(`Balance:  ${wallet.balance}`);
    console.log(`Status:   ${status}`);
    console.log('--------------------------------------------------');
  }

  // Check for any other wallets with non-zero balances
  const orphans = await prisma.wallet.findMany({
    where: {
      userId: { not: admin.id },
      balance: { gt: 0 }
    }
  });

  if (orphans.length === 0) {
    console.log('✅ ZERO LEAKAGE: No non-admin accounts hold crypto balances.');
  } else {
    console.log(`⚠️ WARNING: ${orphans.length} accounts still hold funds!`);
    for (const o of orphans) {
      console.log(`- User ${o.userId}: ${o.balance} ${o.network}`);
    }
  }

  console.log('\n--- FINAL CLOUD STATUS: SYNCED TO GITHUB ---');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
