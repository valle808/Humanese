
import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

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

const dumpPath = './db_dump.json';
if (fs.existsSync(dumpPath)) {
    const dump = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
    const vault = dump.secretVault;
    if (vault && vault.length > 0) {
        console.log(`--- DECRYPTING ${vault.length} SECRETS ---`);
        vault.forEach(s => {
            const dec = decrypt(s.encryptedValue, s.iv, s.tag);
            console.log(`ID: ${s.id} | Description: ${s.description}`);
            if (dec.startsWith('ERROR')) {
                console.log(`  Decryption Failed: ${dec}`);
            } else {
                console.log(`  Decrypted: ${dec.substring(0, 5)}... (Length: ${dec.length})`);
            }
        });
    }
}
