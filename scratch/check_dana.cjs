const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDana() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'danamd@aol.com' }
    });
    
    if (!user) {
      console.log("User danamd@aol.com NOT FOUND.");
      return;
    }
    
    console.log("Found User:", user);
    
    const wallet = await prisma.wallet.findFirst({
      where: { userId: user.id }
    });
    
    console.log("Found Wallet:", wallet);
    
    const secrets = await prisma.secretVault.findMany();
    console.log("Available Secret IDs:", secrets.map(s => s.id));
    
  } catch (err) {
    console.error("Error checking Dana:", err);
  } finally {
    await prisma.$disconnect();
  }
}

checkDana();
