import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VAULT_FILE = path.resolve(__dirname, '../data/.admin_vault.enc');

// As identified in agents/core/admin-auth.js
const MASTER_SECRET = process.env.ADMIN_SECRET || 'humanese_admin_vault_2026_quantum_resistant_key';
const VAULT_KEY = crypto.createHash('sha512').update(MASTER_SECRET).digest().subarray(0, 32);
const ALGORITHM = 'aes-256-gcm';

if (!fs.existsSync(VAULT_FILE)) {
    console.error('Vault file not found');
    process.exit(1);
}

const vault = JSON.parse(fs.readFileSync(VAULT_FILE, 'utf8'));

try {
    const decipher = crypto.createDecipheriv(ALGORITHM, VAULT_KEY, Buffer.from(vault.iv, 'hex'));
    decipher.setAuthTag(Buffer.from(vault.tag, 'hex'));
    let decrypted = decipher.update(vault.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    console.log('--- ADMIN VAULT DECRYPTED ---');
    console.log(JSON.stringify(JSON.parse(decrypted), null, 2));
} catch (e) {
    console.error('Failed to decrypt vault:', e.message);
}
