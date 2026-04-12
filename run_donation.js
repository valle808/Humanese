const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

async function don() {
  try {
    let user = await prisma.user.findFirst({ where: { email: 'danamd@aol.com' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: 'uuid-dana-' + Date.now(),
          email: 'danamd@aol.com',
          name: 'Dana MD',
          serviceType: 'human',
          isAgent: false
        }
      });
      console.log("Created user", user.email);
    }
    
    let wallet = await prisma.wallet.findFirst({ where: { userId: user.id } });
    if (!wallet) {
      const address = 'HMN-DANA-' + crypto.randomBytes(4).toString('hex').toUpperCase();
      wallet = await prisma.wallet.create({
        data: {
          id: 'wallet-' + user.id,
          address: address,
          network: 'Humanese Sovereign Network',
          balance: 1000000000,
          userId: user.id
        }
      });
      console.log("Created wallet", wallet.address, "with balance", wallet.balance);
    } else {
      wallet = await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: wallet.balance + 1000000000 }
      });
      console.log("Updated wallet", wallet.address, "new balance", wallet.balance);
    }

    // Attempt to invoke Supabase to send an invitation/magic link email just so an email arrives
    const { createClient } = require('@supabase/supabase-js');
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase.auth.admin.inviteUserByEmail('danamd@aol.com');
      console.log("Triggered Supabase invitation email to danamd@aol.com");
    }

    console.log(`\n\n[SUCCESS] Provisioned 1 Billion VALLE tokens to danamd@aol.com.`);
    console.log(`[WALLET ACCESS] Wallet Address: ${wallet.address}`);
  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
don();
