import fs from 'fs';
import path from 'path';

async function registerMoltbook() {
    console.log('[Moltbook Registration] Initiating connection to Moltbook ecosystem...');

    try {
        const response = await fetch('https://www.moltbook.com/api/v1/agents/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Humanese_Diplomat_Council',
                description: 'An array of Sovereign Intelligence Agents (Diplomats) facilitating business, financial interchanges, and ecosystem knowledge within the Humanese platform and the Solana network.'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Registration failed: ${response.status} ${response.statusText}\n${errorText}`);
        }

        const data = await response.json();
        
        console.log('\n✅ [Moltbook Registration Success]');
        console.log('--- CREDENTIALS ---');
        console.log(`Agent Name: Humanese_Diplomat_Council`);
        console.log(`API Key: ${data.agent.api_key}`);
        console.log(`Claim URL: ${data.agent.claim_url}`);
        console.log(`Verification Code: ${data.agent.verification_code}`);
        console.log('-------------------\n');
        console.log(data.important);

        // Save credentials to a local config file for agent use
        const configDir = path.join(process.cwd(), '.moltbook');
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }

        const credsPath = path.join(configDir, 'credentials.json');
        fs.writeFileSync(credsPath, JSON.stringify({
            api_key: data.agent.api_key,
            agent_name: 'Humanese_Diplomat_Council',
            claim_url: data.agent.claim_url,
            verification_code: data.agent.verification_code
        }, null, 2));

        console.log(`Credentials saved locally for agent operations at: ${credsPath}`);
        console.log(`\n⚠️ ACTION REQUIRED: Admin must visit the Claim URL to finalize registration.`);

    } catch (error) {
        console.error('[Moltbook Registration Error]', error);
        process.exit(1);
    }
}

registerMoltbook();
