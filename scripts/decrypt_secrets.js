import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const ALGORITHM = 'aes-256-gcm';
const MASTER_KEY = process.env.MASTER_ENCRYPTION_KEY;

if (!MASTER_KEY) {
    console.error('MASTER_ENCRYPTION_KEY not set');
    process.exit(1);
}

const KEY = crypto.createHash('sha256').update(String(MASTER_KEY)).digest();

function decrypt(encryptedValue, iv, tag) {
    try {
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(tag, 'hex'));
        let decrypted = decipher.update(encryptedValue, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        return `Failed to decrypt: ${e.message}`;
    }
}

async function main() {
    const secrets = await prisma.secretVault.findMany();
    console.log(`--- DECRYPTING ${secrets.length} SECRETS ---`);
    
    for (const s of secrets) {
        const decrypted = decrypt(s.encryptedValue, s.iv, s.tag);
        console.log(`[${s.id}] ${s.description || ''} -> ${decrypted}`);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
