
import { getSecret } from './utils/secrets.js';

async function checkSecrets() {
    const keys = [
        'OPENROUTER_API_KEY',
        'XAI_API_KEY',
        'OPENAI_API_KEY',
        'FIRECRAWL_API_KEY',
        'MASTER_ENCRYPTION_KEY'
    ];

    console.log('--- VAULT SECRET CHECK ---');
    for (const key of keys) {
        try {
            const val = await getSecret(key);
            console.log(`${key}: ${val ? 'FOUND (Length: ' + val.length + ')' : 'MISSING'}`);
        } catch (e) {
            console.log(`${key}: ERROR (${e.message})`);
        }
    }
}

checkSecrets();
