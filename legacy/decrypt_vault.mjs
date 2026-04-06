
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load initial environment for MASTER_ENCRYPTION_KEY
dotenv.config();

const ENV_MASTER_KEY = process.env.MASTER_ENCRYPTION_KEY;
const DEFAULT_PHRASE = 'VALLE_OVERLORD';

const POTENTIAL_INPUTS = [
    ENV_MASTER_KEY,
    DEFAULT_PHRASE,
].filter(Boolean);

const ALGORITHM_GCM = 'aes-256-gcm';
const ALGORITHM_CBC = 'aes-256-cbc';

/**
 * Decrypts with various permutations of key derivation and algorithm.
 */
function attemptDecryption(ciphertext, ivHex, tagHex, rawInput) {
    const iv = Buffer.from(ivHex, 'hex');
    const tag = tagHex ? Buffer.from(tagHex, 'hex') : null;

    // Try multiple key derivations
    const derivations = [
        crypto.createHash('sha256').update(String(rawInput)).digest(),
    ];
    // If rawInput looks like hex, try it as a buffer
    if (/^[0-9a-fA-F]+$/.test(rawInput) && rawInput.length % 2 === 0) {
        derivations.push(crypto.createHash('sha256').update(Buffer.from(rawInput, 'hex')).digest());
        // Also try the raw hex buffer as the key directly if it's 32 bytes
        const rawBuf = Buffer.from(rawInput, 'hex');
        if (rawBuf.length === 32) {
            derivations.push(rawBuf);
        }
    }

    for (const key of derivations) {
        // Try GCM if tag exists
        if (tag) {
            try {
                const decipher = crypto.createDecipheriv(ALGORITHM_GCM, key, iv);
                decipher.setAuthTag(tag);
                let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
                decrypted += decipher.final('utf8');
                return decrypted;
            } catch (e) {}
        }
        
        // Try CBC as fallback (no tag needed usually, but some implementations might include it)
        try {
            const decipher = crypto.createDecipheriv(ALGORITHM_CBC, key, iv);
            let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (e) {}

        // Try GCM with different IV lengths? (Some use 16)
    }
    return null;
}

function multiDecrypt(ciphertext, iv, tag, label) {
    for (const input of POTENTIAL_INPUTS) {
        const dec = attemptDecryption(ciphertext, iv, tag, input);
        if (dec) return dec;
    }
    return null;
}

async function run() {
    console.log("--- HUMANESE BASTIDAS PROTOCOL: DEEP SEEK [V3] ---");
    const recoveredSecrets = {};

    // 1. Process db_dump.json
    const dumpPath = './db_dump.json';
    if (fs.existsSync(dumpPath)) {
        console.log(`Processing ${dumpPath}...`);
        try {
            const dump = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
            const vault = dump.secretVault || [];
            vault.forEach(entry => {
                const dec = multiDecrypt(entry.encryptedValue, entry.iv, entry.tag, entry.id);
                if (dec) {
                    recoveredSecrets[entry.id] = dec;
                }
            });
        } catch (e) {
            console.error(`Error parsing dump: ${e.message}`);
        }
    }

    // 2. Process .admin_vault.enc
    const adminVaultPaths = [
        './data/.admin_vault.enc',
        './public/data/.admin_vault.enc',
        './public/agents/data/.admin_vault.enc'
    ];
    adminVaultPaths.forEach(p => {
        if (fs.existsSync(p)) {
            console.log(`Processing admin vault: ${p}...`);
            try {
                const vault = JSON.parse(fs.readFileSync(p, 'utf8'));
                const dec = multiDecrypt(vault.encrypted || vault.data || vault.encryptedValue, vault.iv, vault.tag, p);
                if (dec) {
                    console.log(`[OK] Decrypted admin vault ${p}`);
                    try {
                        const parsed = JSON.parse(dec);
                        Object.assign(recoveredSecrets, parsed);
                    } catch {
                        recoveredSecrets['ADMIN_VAULT_CONTENT'] = dec;
                    }
                } else {
                    console.error(`[FAIL] Admin vault decryption failed: ${p}`);
                }
            } catch (e) {}
        }
    });

    // 3. Process Agent Wallets
    const walletsDir = './public/agents/wallets';
    if (fs.existsSync(walletsDir)) {
        console.log(`Processing wallets in ${walletsDir}...`);
        const files = fs.readdirSync(walletsDir).filter(f => f.endsWith('.enc'));
        files.forEach(f => {
            const p = path.join(walletsDir, f);
            try {
                const wallet = JSON.parse(fs.readFileSync(p, 'utf8'));
                const dec = multiDecrypt(wallet.data || wallet.encryptedValue || wallet.encrypted, wallet.iv, wallet.tag, f);
                if (dec) {
                    const walletId = f.split('.')[0].replace('wallet-', '').toUpperCase() + '_PRIVATE_KEY';
                    recoveredSecrets[walletId] = dec;
                    console.log(`[OK] Recovered wallet: ${walletId}`);
                }
            } catch (e) {}
        });
    }

    // Wrap-up
    console.log(`\nKeys Recovered: ${Object.keys(recoveredSecrets).length}`);
    if (Object.keys(recoveredSecrets).length > 0) {
        let existingEnv = {};
        if (fs.existsSync('.env.local')) {
            existingEnv = dotenv.parse(fs.readFileSync('.env.local', 'utf8'));
        }
        const finalEnv = { ...existingEnv, ...recoveredSecrets };
        let envContent = '';
        for (const [key, val] of Object.entries(finalEnv)) {
            const safeVal = (typeof val === 'string' && (val.includes('\n') || val.includes(' '))) ? `"${val.replace(/"/g, '\\"')}"` : val;
            envContent += `${key}=${safeVal}\n`;
        }
        fs.writeFileSync('.env.local', envContent.trim() + '\n');
        console.log("--- BASTIDAS PROTOCOL: SECRETS SECURED ---");
    }
}

run();
