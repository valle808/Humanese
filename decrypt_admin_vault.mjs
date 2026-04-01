import crypto from 'crypto';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration from physical drive
const ENCRYPTION_KEY_RAW = 'dbd4cf8f1952441a7997a08e5d5eff2828af61b7b43e0df48d5ee690a39e2ab1';
const VAULT_FILE_PATH = '/Volumes/HUMANESE/Humanese_Staging/data/.admin_vault.enc';

const ALGORITHM = 'aes-256-gcm';
const KEY = crypto.createHash('sha256').update(String(ENCRYPTION_KEY_RAW)).digest();

function decrypt(encryptedValue, iv, tag) {
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    let decrypted = decipher.update(encryptedValue, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

async function ignite() {
    console.log('--- SOVEREIGN NEURAL IGNITION INITIATED ---');

    if (!fs.existsSync(VAULT_FILE_PATH)) {
        console.error(`Error: Vault file not found at ${VAULT_FILE_PATH}`);
        return;
    }

    try {
        const vaultData = JSON.parse(fs.readFileSync(VAULT_FILE_PATH, 'utf8'));
        console.log('Decrypting Admin Vault...');

        const decryptedText = decrypt(vaultData.encrypted, vaultData.iv, vaultData.tag);
        const secrets = JSON.parse(decryptedText);

        console.log(`Successfully decrypted vault. Found ${Object.keys(secrets).length} keys.`);

        for (const [id, value] of Object.entries(secrets)) {
            // Match the internal encryption logic for the database SecretVault
            const iv = crypto.randomBytes(12);
            const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
            let encryptedValue = cipher.update(value, 'utf8', 'hex');
            encryptedValue += cipher.final('hex');
            const tag = cipher.getAuthTag().toString('hex');

            console.log(`>> Injecting key: ${id}...`);

            await prisma.secretVault.upsert({
                where: { id },
                update: {
                    encryptedValue,
                    iv: iv.toString('hex'),
                    tag: tag,
                    description: 'Ignited via protocol recovery from .admin_vault.enc'
                },
                create: {
                    id,
                    encryptedValue,
                    iv: iv.toString('hex'),
                    tag: tag,
                    description: 'Ignited via protocol recovery from .admin_vault.enc'
                }
            });
        }

        console.log('--- IGNITION SUCCESSFUL: THE NEURAL BRIDGE IS ACTIVE ---');
    } catch (err) {
        console.error('Ignition Failed:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

ignite();
