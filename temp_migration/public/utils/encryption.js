import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const ALGORITHM = 'aes-256-gcm';
const KEY = process.env.MASTER_ENCRYPTION_KEY ?
    crypto.createHash('sha256').update(String(process.env.MASTER_ENCRYPTION_KEY)).digest() :
    crypto.randomBytes(32); // Fallback to random if not set, but this will fail decryption after restart

if (!process.env.MASTER_ENCRYPTION_KEY) {
    console.error('[SECURITY WARNING] MASTER_ENCRYPTION_KEY is not set in .env. Using a volatile random key.');
}

export function encrypt(text) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag().toString('hex');

    return {
        encryptedValue: encrypted,
        iv: iv.toString('hex'),
        tag: tag
    };
}

export function decrypt(encryptedValue, iv, tag) {
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    let decrypted = decipher.update(encryptedValue, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
