const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createHash, randomUUID } = require('crypto');

async function main() {
  const userId = '356d13ac-20d6-4826-8086-00faf7a20937'; // valle808@hawaii.edu
  const amount = 142.5;
  const targetAddress = 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL';

  console.log(`Performing sovereign test transfer of ${amount} SOL to ${targetAddress}...`);

  try {
    const wallets = await prisma.wallet.findMany({ where: { userId } });
    const solWallet = wallets.find(w => w.network.includes('Solana'));

    if (!solWallet) {
      console.error('SOL wallet not found');
      return;
    }

    if (solWallet.balance < amount) {
      console.error(`Insufficient balance: ${solWallet.balance}`);
      return;
    }

    await prisma.$transaction(async (tx) => {
      // 1. Deduct balance
      await tx.wallet.update({
        where: { id: solWallet.id },
        data: { balance: { decrement: amount } }
      });

      // 2. Create transaction record
      await tx.transaction.create({
        data: {
          id: randomUUID(),
          amount: amount,
          type: 'COINBASE_OFFRAMP',
          status: 'COMPLETED',
          walletId: solWallet.id,
          hash: `0x${createHash('sha256').update(`${solWallet.id}-${Date.now()}`).digest('hex')}`
        }
      });
    });

    console.log('✅ Transfer Successful in Database!');
  } catch (e) {
    console.error('❌ Transfer Failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
