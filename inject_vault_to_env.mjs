import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const MASTER_KEY = process.env.MASTER_ENCRYPTION_KEY;
const KEY = crypto.createHash('sha256').update(String(MASTER_KEY)).digest();
const ALGO = 'aes-256-gcm';

function decrypt(encryptedValue, iv, tag) {
    try {
        const decipher = crypto.createDecipheriv(ALGO, KEY, Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(tag, 'hex'));
        let dec = decipher.update(encryptedValue, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    } catch (e) { return null; }
}

async function run() {
    const prisma = new PrismaClient();
    const vault = await prisma.secretVault.findMany();
    
    console.log(`Found ${vault.length} secrets in vault.`);
    
    const envPath = '.env.local';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    vault.forEach(entry => {
        const decrypted = decrypt(entry.encryptedValue, entry.iv, entry.tag);
        if (decrypted && (entry.id === 'XAI_API_KEY' || entry.id === 'OPENROUTER_API_KEY')) {
            if (!envContent.includes(`${entry.id}=`)) {
                envContent += `\n${entry.id}=${decrypted}\n`;
                console.log(`✅ Injected ${entry.id}`);
            } else {
                console.log(`ℹ️ ${entry.id} already exists in .env.local`);
            }
        }
    });

    fs.writeFileSync(envPath, envContent.trim() + '\n');
    console.log("Secret injection complete.");
    await prisma.$disconnect();
}

run().catch(console.error);
