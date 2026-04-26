import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const prisma = new PrismaClient();

const ALGORITHM = 'aes-256-gcm';
const MASTER_KEY = process.env.MASTER_ENCRYPTION_KEY;

if (!MASTER_KEY) {
    console.error('❌ FATAL: MASTER_ENCRYPTION_KEY not found in .env');
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
        return null;
    }
}

async function recover() {
    console.log('🔱 INITIATING SOVEREIGN SECRET RECOVERY...');
    const secrets = await prisma.secretVault.findMany();
    
    let recoveredEnv = '';
    let resendKeyFound = false;

    console.log(`Found ${secrets.length} encrypted records.\n`);

    for (const s of secrets) {
        const decrypted = decrypt(s.encryptedValue, s.iv, s.tag);
        if (decrypted) {
            console.log(`✅ RECOVERED: [${s.id}] (${s.description || 'No description'})`);
            recoveredEnv += `${s.id}="${decrypted}"\n`;
            if (s.id === 'RESEND_API_KEY' || decrypted.startsWith('re_')) {
                resendKeyFound = true;
                console.log('   ✨ MISSION CRITICAL: RESEND_API_KEY IDENTIFIED');
            }
        } else {
            console.log(`❌ FAILED: [${s.id}] - Authenticated decryption failed. Potential key mismatch.`);
        }
    }

    if (recoveredEnv) {
        const envPath = path.join(process.cwd(), '.env.local');
        // Read existing .env.local if it exists to avoid overwriting unrelated vars
        let existingContent = '';
        if (fs.existsSync(envPath)) {
            existingContent = fs.readFileSync(envPath, 'utf8');
        }

        // Only append keys that aren't already there or overwrite them?
        // Let's create a clean recovery block
        const output = `\n# --- SOVEREIGN RECOVERY BLOCK (${new Date().toISOString()}) ---\n${recoveredEnv}`;
        fs.appendFileSync(envPath, output);
        console.log(`\n💾 SUCCESS: Recovered secrets appended to .env.local`);
    } else {
        console.warn('\n⚠️ No secrets were recovered. Ensure MASTER_ENCRYPTION_KEY is correct.');
    }

    if (!resendKeyFound) {
        console.error('\n🚫 ALERT: RESEND_API_KEY was NOT found in the vault.');
    }
}

recover()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
