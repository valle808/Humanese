import dotenv from 'dotenv';
import { Resend } from 'resend';
import { sendSovereignConfirmation } from '../lib/email.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const domainId = '48123b56-fbd3-468e-9734-750231a3161c';

async function autoSend() {
  console.log('\n[AUTO-VERIFY DAEMON] Starting continuous verification loop...');
  console.log('Monitoring domain propagation for humanese.net...\n');

  while (true) {
    try {
      // Prod verification
      await resend.domains.verify(domainId);
      
      // Check status
      const { data } = await resend.domains.get(domainId);

      if (data && data.status === 'verified') {
        console.log('✅ DOMAIN VERIFIED! Initiating Sovereign Confirmation dispatch...');
        
        // Force the FROM email for our dispatch
        process.env.RESEND_FROM_EMAIL = 'omega@humanese.net';

        const result = await sendSovereignConfirmation({
          email: 'danamd@aol.com',
          name: 'DANA',
          amount: '1,000,000,000 VALLE (Reserved)',
          walletAddress: 'HMN-DANA-DAD64FDE',
        });

        if (result.success) {
          console.log('\n🚀 [SUCCESS] 1 Billion VALLE Formal Confirmation sent to danamd@aol.com!');
          console.log('Message ID:', result.data?.id);
        } else {
          console.error('\n❌ FAILED to send email:', result.error);
        }
        
        break; // Exit daemon
      } else {
        console.log(`[${new Date().toISOString()}] Status: ${data?.status || 'unknown'}. Waiting 30 seconds for DNS propagation...`);
      }
    } catch (err) {
      console.error('[ERROR] Verification tick failed:', err.message);
    }

    // Wait exactly 30 seconds before pinging again
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
}

autoSend();
