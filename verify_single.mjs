
import crypto from 'crypto';

const MASTER_KEY = 'dbd4cf8f1952441a7997a08e5d5eff2828af61b7b43e0df48d5ee690a39e2ab1';
const ALGORITHM = 'aes-256-gcm';
const KEY = crypto.createHash('sha256').update(String(MASTER_KEY)).digest();

function decrypt(ciphertext, iv, tag) {
    try {
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(tag, 'hex'));
        let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        return `ERROR: ${e.message}`;
    }
}

const encryptedValue = "79aa61b32402095a2fde09208ef807c3a7f5bdbb27f53e6f551b3b9c82d36b32cdf6b03007344c8eb36c4bda4af5bbf9dd0e9740a3a7e8701adbaa3ad6c757c19c04b613aa9784ff0cef86a001ca3c5e9197e856f095adcc5f8f313e461b286df70df2f8e01ed7db334ae834008856839b0804f4f7b6b04ce27b4403f8ea8c557a7180a73915fd8f78cff39f261ea1ab1d1e";
const iv = "afc70e521792800b3bdfcdad";
const tag = "ff053cc67cbfaaa30816eae2cbda5322";

console.log("Decrypted DATABASE_URL:", decrypt(encryptedValue, iv, tag));
