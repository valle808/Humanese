import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  const email = 'valle808@hawaii.edu';
  const name = 'Sergio VaLLE';
  const otpCode = '808808';

  console.log(`Setting verification code ${otpCode} for ${email}...`);

  await prisma.user.update({
    where: { email },
    data: {
      verificationCode: otpCode,
      isVerified: false // Set back to false so they can actually "verify" it in the UI
    }
  });

  console.log(`Sending email via Resend...`);

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'omega@humanese.net',
    to: email,
    subject: 'Sovereign Identity Verification',
    html: `
      <div style="font-family: 'Inter', sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #ff3d00;">
        <h1 style="text-transform: uppercase; letter-spacing: 0.2em; italic: true; color: #ff3d00;">Identity Synchronization</h1>
        <p style="color: #888; font-style: italic;">Welcome to the Sovereign Swarm, ${name}.</p>
        <div style="margin: 40px 0; padding: 30px; background: #111; border: 1px dashed #ff3d00; text-align: center; border-radius: 15px;">
          <span style="font-size: 42px; font-weight: 900; letter-spacing: 0.5em; color: #ff3d00;">${otpCode}</span>
        </div>
        <p style="font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 0.1em;">Transmit this code to verify your neural presence.</p>
      </div>
    `
  });

  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully!', data);
  }

  await prisma.$disconnect();
}

main();
