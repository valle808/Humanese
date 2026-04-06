#!/usr/bin/env node
/**
 * 🔑 SOVEREIGN KEY INJECTOR
 * Encrypts and stores an API key directly into the Supabase SecretVault.
 * 
 * Usage:
 *   /Users/sergiovalle/.nvm/versions/node/v25.8.2/bin/node inject_key.mjs OPENROUTER_API_KEY sk-or-v1-YOUR-KEY-HERE
 *   /Users/sergiovalle/.nvm/versions/node/v25.8.2/bin/node inject_key.mjs XAI_API_KEY xai-YOUR-KEY-HERE
 */

import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const MASTER_KEY = process.env.MASTER_ENCRYPTION_KEY;
if (!MASTER_KEY) { console.error('❌ MASTER_ENCRYPTION_KEY not set'); process.exit(1); }

const KEY = crypto.createHash('sha256').update(String(MASTER_KEY)).digest();
const ALGORITHM = 'aes-256-gcm';

function encrypt(text) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedValue: encrypted, iv: iv.toString('hex'), tag: cipher.getAuthTag().toString('hex') };
}

const [,, keyId, keyValue] = process.argv;

if (!keyId || !keyValue) {
    console.log('Usage: node inject_key.mjs <KEY_ID> <KEY_VALUE>');
    console.log('Example: node inject_key.mjs OPENROUTER_API_KEY sk-or-v1-...');
    process.exit(1);
}

const prisma = new PrismaClient();

try {
    console.log(`\n🔐 Encrypting ${keyId}...`);
    const { encryptedValue, iv, tag } = encrypt(keyValue);
    
    await prisma.secretVault.upsert({
        where: { id: keyId },
        update: { encryptedValue, iv, tag, updatedAt: new Date() },
        create: {
            id: keyId,
            encryptedValue, iv, tag,
            description: `Injected via Bastidas Protocol`,
            updatedAt: new Date()
        }
    });
    
    console.log(`✅ ${keyId} securely stored in Supabase SecretVault`);
    console.log(`   Monroe AI will now use this key for live LLM responses.`);
    
    // Verify it can be decrypted back
    const stored = await prisma.secretVault.findUnique({ where: { id: keyId } });
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(stored.iv, 'hex'));
    decipher.setAuthTag(Buffer.from(stored.tag, 'hex'));
    let dec = decipher.update(stored.encryptedValue, 'hex', 'utf8');
    dec += decipher.final('utf8');
    
    if (dec === keyValue) {
        console.log(`✅ Vault verification: PASS (round-trip decryption successful)`);
    } else {
        console.error(`❌ Vault verification: FAIL`);
    }
    
} catch (err) {
    console.error('❌ Injection failed:', err.message);
} finally {
    await prisma.$disconnect();
}
