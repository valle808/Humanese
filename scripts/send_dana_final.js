import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || 'omega@humanese.net';

async function sendDanaEmail() {
  console.log('🚀 Sending formal confirmation to Dana MD...');
  
  const danaEmail = 'danamd@aol.com';
  const danaName = 'Dana MD';
  const danaAmount = '1,000,000,000 VALLE';
  const danaWallet = 'HMN-DANA-DAD64FDE';
  const deploymentUrl = 'https://humanese.net';

  try {
    const { data, error } = await resend.emails.send({
      from: `Humanese Sovereign <${fromEmail}>`,
      to: [danaEmail],
      subject: `Formal Confirmation: Sovereign Asset Allocation - ${danaName}`,
      html: `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 12px; color: #111827; background-color: #ffffff;">
          <div style="margin-bottom: 32px; border-bottom: 2px solid #f3f4f6; padding-bottom: 16px;">
            <h1 style="font-size: 24px; font-weight: 700; margin: 0; color: #000;">HUMANESE OMEGA</h1>
            <p style="font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px;">Sovereign Protocol Acknowledgment</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5; color: #374151;">Dear <strong>${danaName}</strong>,</p>
          
          <p style="font-size: 16px; line-height: 1.5; color: #374151;">
            This communication serves as a formal confirmation of your asset allocation within the <strong>Humanese OMEGA Ecosystem</strong>. 
            The following assets have been successfully registered under your sovereign identity.
          </p>
          
          <div style="background: #f9fafb; border: 1px solid #f3f4f6; padding: 24px; border-radius: 8px; margin: 32px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding-bottom: 8px; color: #6b7280; font-size: 12px; text-transform: uppercase;">Allocated Asset</td>
                <td style="padding-bottom: 8px; font-weight: 600; text-align: right;">VALLE Utility Token</td>
              </tr>
              <tr>
                <td style="padding-bottom: 8px; color: #6b7280; font-size: 12px; text-transform: uppercase;">Confirmed Balance</td>
                <td style="padding-bottom: 8px; font-weight: 600; text-align: right; color: #059669;">${danaAmount}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 12px; text-transform: uppercase; vertical-align: top; padding-top: 8px;">Sovereign Wallet</td>
                <td style="padding-top: 8px; text-align: right;">
                  <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-size: 13px; font-family: monospace;">${danaWallet}</code>
                </td>
              </tr>
            </table>
          </div>

          <p style="font-size: 16px; line-height: 1.5; color: #374151;">
            Your assets are now secured within the Humanese Ledger. You may monitor these balances and authorize transfers via the Command Portal using your secure access credentials.
          </p>

          <div style="margin: 32px 0;">
            <a href="${deploymentUrl}" style="background-color: #ff6b2b; color: #000; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">
              Access Command Portal
            </a>
          </div>
          
          <div style="margin-top: 48px; border-top: 1px solid #f3f4f6; padding-top: 24px;">
            <p style="font-size: 14px; color: #9ca3af; font-style: italic; margin: 0;">
              Humanese Sovereign Intelligence Network<br />
              Node: OMEGA-SOVEREIGN-01
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
    } else {
      console.log('✅ Email sent successfully!', data);
    }
  } catch (err) {
    console.error('💥 Fatal error:', err);
  }
}

sendDanaEmail();
