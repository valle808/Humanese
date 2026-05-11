import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'valle808@hawaii.edu';
  console.log(`Provisioning ecosystem tokens for: ${email}`);

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error('User not found.');
      return;
    }

    const wallet = await prisma.wallet.findFirst({ where: { userId: user.id } });
    if (wallet) {
      const updatedWallet = await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: 1000000000 } }
      });
      console.log(`✅ Provisioned 1 Billion VALLE tokens. New Balance: ${updatedWallet.balance}`);
    } else {
      console.error('No wallet found for user.');
    }
  } catch (error) {
    console.error('Error provisioning tokens:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
