import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'valle808@hawaii.edu';
  console.log(`Confirming user: ${email}`);
  
  try {
    // Supabase auth users are in the 'auth' schema. 
    // We can use $executeRawUnsafe to run a direct update if the user has permissions.
    const result = await prisma.$executeRawUnsafe(
      `UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = $1`,
      email
    );
    
    console.log('Update result:', result);
    
    // Also ensure the user is verified in the public.User table
    const publicUser = await prisma.$executeRawUnsafe(
      `UPDATE public."User" SET "isVerified" = true, "verificationCode" = null WHERE email = $1`,
      email
    );
    console.log('Public User update result:', publicUser);
    
  } catch (error) {
    console.error('Error confirming user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
