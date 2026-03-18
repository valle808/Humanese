import { PrismaClient } from '@prisma/client';
import { encrypt } from '../utils/encryption.js';
import readline from 'readline';

const prisma = new PrismaClient();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const VAULT_KEYS = [
    'XAI_API_KEY',
    'X_API_KEY',
    'X_API_SECRET',
    'X_ACCESS_TOKEN',
    'X_ACCESS_SECRET',
    'X_BEARER_TOKEN',
    'FIREBASE_SERVICE_ACCOUNT_BASE64',
    'FIREBASE_DATABASE_URL'
];

async function addSecret() {
    console.log('\n--- Sovereign Secret Injection Tool ---');
    console.log('Available Keys:');
    VAULT_KEYS.forEach((k, i) => console.log(`${i + 1}. ${k}`));

    rl.question('\nSelect key number or type name: ', (choice) => {
        let key = choice;
        if (!isNaN(choice) && VAULT_KEYS[parseInt(choice) - 1]) {
            key = VAULT_KEYS[parseInt(choice) - 1];
        }

        rl.question(`Enter value for ${key}: `, async (value) => {
            if (!value) {
                console.log('Operation cancelled. Empty value.');
                process.exit(0);
            }

            console.log(`Encrypting and storing ${key}...`);
            const { encryptedValue, iv, tag } = encrypt(value);

            try {
                await prisma.secretVault.upsert({
                    where: { id: key },
                    update: { encryptedValue, iv, tag },
                    create: { id: key, encryptedValue, iv, tag, description: `Manually injected via protocol.` }
                });
                console.log(`✅ ${key} successfully secured in the vault.`);
            } catch (err) {
                console.error(`❌ Vault Injection Failed:`, err.message);
            }

            prisma.$disconnect();
            rl.close();
        });
    });
}

addSecret();
