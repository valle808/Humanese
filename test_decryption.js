
import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const MASTER_KEY = process.env.MASTER_ENCRYPTION_KEY;
if (!MASTER_KEY) {
    console.error('MASTER_ENCRYPTION_KEY not set');
    process.exit(1);
}

const ALGORITHM = 'aes-256-gcm';
const KEY = crypto.createHash('sha256').update(String(MASTER_KEY)).digest();

function decrypt(encryptedValue, iv, tag) {
    try {
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(tag, 'hex'));
        let decrypted = decipher.update(encryptedValue, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        return `ERROR: ${e.message}`;
    }
}

// Test with .admin_vault.enc
const vaultPath = 'c:/xampp/htdocs/humanese/data/.admin_vault.enc';
if (fs.existsSync(vaultPath)) {
    console.log('--- TESTING VALUT DECRYPTION ---');
    const vault = JSON.parse(fs.readFileSync(vaultPath, 'utf8'));
    console.log('Decrypted Vault:', decrypt(vault.encrypted, vault.iv, vault.tag));
}

// Test with one agent wallet
const walletPath = 'c:/xampp/htdocs/humanese/agents/wallets/wallet-Analyst_Data.enc';
if (fs.existsSync(walletPath)) {
    console.log('\n--- TESTING WALLET DECRYPTION ---');
    const wallet = JSON.parse(fs.readFileSync(walletPath, 'utf8'));
    console.log('Decrypted Wallet:', decrypt(wallet.data, wallet.iv, wallet.tag));
}
