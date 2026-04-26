import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkDana() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'danamd@aol.com' },
      include: { Wallet: true }
    });
    console.log(JSON.stringify(user, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

checkDana();
