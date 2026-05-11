import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'valle808@hawaii.edu';
  console.log(`Adding sovereign wallets for: ${email}`);

  let retries = 0;
  const maxRetries = 10;
  
  while (retries < maxRetries) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        console.error('User not found.');
        return;
      }

      const wallets = [
        { network: 'Solana', address: 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwD', balance: 142.50 },
        { network: 'Bitcoin', address: '3CJreF7LD8Heu8zh9MsigedRuNq4y6eujh', balance: 1.25 },
        { network: 'Ethereum', address: '0x500fcDff3AAa2662954240978BB01709Ea0Dc68', balance: 12.4 },
        { network: 'XRP', address: 'rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg', balance: 45000.0, memo: '2932723390' },
        { network: 'BNB', address: '0xF765812D7746B92b258098c9F3C90E691B6dc9', balance: 88.0 },
        { network: 'Bitcoin (Genesis)', address: 'bc1qdf6dfd6d5c29cbbf3cfcfa153158708f34b340', balance: 0.5 }
      ];

      for (const w of wallets) {
        const walletId = `wallet-${user.id}-${w.network.toLowerCase().replace(/\s+/g, '-')}`;
        await prisma.wallet.upsert({
          where: { id: walletId },
          update: {
            address: w.address,
            balance: w.balance,
            network: w.network
          },
          create: {
            id: walletId,
            address: w.address,
            network: w.network,
            balance: w.balance,
            userId: user.id
          }
        });
        console.log(`✅ Upserted ${w.network} wallet: ${w.address}`);
      }

      console.log('Sovereign Treasury Sync Complete.');
      break;

    } catch (error) {
      if (error.message.includes('max clients reached')) {
        console.log(`Connection pool full, retrying... (${++retries}/${maxRetries})`);
        await new Promise(r => setTimeout(r, 5000 * retries));
      } else {
        console.error('Error adding wallets:', error);
        break;
      }
    }
  }
}

main();
