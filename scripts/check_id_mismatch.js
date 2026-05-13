import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const prisma = new PrismaClient();

async function main() {
  const email = 'valle808@hawaii.edu';
  
  // 1. Get Supabase Auth User
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  const authUser = users.find(u => u.email === email);
  
  if (!authUser) {
    console.log('User not found in Supabase Auth');
  } else {
    console.log('Supabase Auth ID:', authUser.id);
  }

  // 2. Get Prisma User
  const prismaUser = await prisma.user.findUnique({ where: { email } });
  if (!prismaUser) {
    console.log('User not found in Prisma');
  } else {
    console.log('Prisma User ID:', prismaUser.id);
  }

  if (authUser && prismaUser && authUser.id !== prismaUser.id) {
    console.log('⚠️ ID MISMATCH DETECTED!');
    console.log(`Wallets are linked to ${prismaUser.id}, but API uses ${authUser.id}`);
  }
}

main().finally(() => prisma.$disconnect());
