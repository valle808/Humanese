const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

async function don(email, name) {
  let user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: 'uuid-' + name.toLowerCase() + '-' + Date.now(),
        email: email,
        name: name,
        serviceType: 'human',
        isAgent: false
      }
    });
    console.log("Created user", user.email);
  }
  
  let wallet = await prisma.wallet.findFirst({ where: { userId: user.id } });
  if (!wallet) {
    const address = 'HMN-' + name.toUpperCase() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();
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

  // Attempt to trigger Supabase email since we lack a raw SMTP provider like SendGrid
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    await supabase.auth.admin.inviteUserByEmail(email);
    console.log("Triggered Supabase platform email to", email);
  } else {
    console.warn("WARNING: Supabase tokens missing from .env. Could not trigger email.");
  }

  return wallet.address;
}

async function main() {
    try {
        const emails = [
            { e: 'danamd@aol.com', n: 'Dana' }, 
            { e: 'valle808@hawaii.edu', n: 'Valle' }
        ];
        
        for(let em of emails) {
            let addr = await don(em.e, em.n);
            console.log(`[SUCCESS] Provisioned 1 Billion VALLE to ${em.e}. Wallet: ${addr}\n`);
        }
    } catch(err) {
        console.error("FATAL:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
