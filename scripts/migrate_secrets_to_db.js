import { PrismaClient } from '@prisma/client';
import { encrypt } from '../utils/encryption.js';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function migrate() {
    console.log('--- Sovereign Secret Migration Protocol Initiated ---');

    const secretsToMigrate = [
        { id: 'XAI_API_KEY', value: process.env.XAI_API_KEY, desc: 'xAI Grok Intelligence Key' },
        { id: 'DATABASE_URL', value: process.env.DATABASE_URL, desc: 'Supabase Postgres Connection String' },
        { id: 'FIREBASE_DATABASE_URL', value: process.env.FIREBASE_DATABASE_URL, desc: 'Firebase Realtime DB URL' },
        { id: 'FIREBASE_SERVICE_ACCOUNT_BASE64', value: process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, desc: 'Firebase Admin Credentials' }
    ];

    for (const secret of secretsToMigrate) {
        if (!secret.value || secret.value.includes('placeholder') || secret.value.includes('replace_me')) {
            console.warn(`[SKIP] ${secret.id}: Value is missing or a placeholder.`);
            continue;
        }

        console.log(`Encrypting and migrating ${secret.id}...`);
        const { encryptedValue, iv, tag } = encrypt(secret.value);

        await prisma.secretVault.upsert({
            where: { id: secret.id },
            update: {
                encryptedValue,
                iv,
                tag,
                description: secret.desc
            },
            create: {
                id: secret.id,
                encryptedValue,
                iv,
                tag,
                description: secret.desc
            }
        });
    }

    console.log('--- Migration Complete. Secrets are now stored in the Abyssal Vault. ---');
}

migrate()
    .catch(e => console.error('Migration Failed:', e))
    .finally(() => prisma.$disconnect());
