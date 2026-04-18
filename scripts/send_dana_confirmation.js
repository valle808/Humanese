import dotenv from 'dotenv';
import { sendSovereignConfirmation } from '../lib/email.js'; // Note: In ESM, we often use .js extension for imports

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config(); // Fallback to standard .env

/**
 * EXECUTION SCRIPT: Formal Dana Confirmation
 * This script triggers the formal email confirmation for Dana's 1B VALLE allocation.
 */
async function triggerDanaConfirmation() {
  console.log('\n======================================');
  console.log('🚀 INITIATING DANA CONFIRMATION EMAIL');
  console.log('======================================\n');

  const danaEmail = 'danamd@aol.com';
  const danaName = 'DANA';
  const danaAmount = '1,000,000,000 VALLE (Reserved)';
  const danaWallet = 'HMN-DANA-DAD64FDE';

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ ERROR: RESEND_API_KEY is missing.');
    console.log('Please ensure it is set in .env.local or provided as an environment variable.');
    process.exit(1);
  }

  const deploymentUrl = process.env.DEPLOYMENT_URL;

  console.log(`Target: ${danaEmail}`);
  console.log(`Wallet: ${danaWallet}`);
  console.log(`Amount: ${danaAmount}`);
  if (deploymentUrl) console.log(`Portal: ${deploymentUrl}`);
  console.log('\nSending formal protocol acknowledgment...');

  const result = await sendSovereignConfirmation({
    email: danaEmail,
    name: danaName,
    amount: danaAmount,
    walletAddress: danaWallet,
    deploymentUrl: deploymentUrl,
  });

  if (result.success) {
    console.log('\n✅ SUCCESS: Confirmation email sent to queue.');
    console.log('Message ID:', result.data?.id);
    console.log('\nYou can track delivery in your Resend Dashboard: https://resend.com/emails');
  } else {
    console.error('\n❌ FAILED to send email:');
    console.error(JSON.stringify(result.error, null, 2));
  }
}

triggerDanaConfirmation().catch((err) => {
  console.error('\n💥 FATAL ERROR:', err);
  process.exit(1);
});
