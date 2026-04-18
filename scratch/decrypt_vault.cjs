const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

// MASTER_ENCRYPTION_KEY from .env
const MASTER_ENCRYPTION_KEY = 'dbd4cf8f1952441a7997a08e5d5eff2828af61b7b43e0df48d5ee690a39e2ab1';

function decrypt(encryptedValue, iv, tag) {
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(MASTER_ENCRYPTION_KEY, 'hex'),
        Buffer.from(iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    let decrypted = decipher.update(encryptedValue, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

async function decryptVault() {
  try {
    const secrets = await prisma.secretVault.findMany();
    console.log(`Found ${secrets.length} secrets.`);
    
    for (const secret of secrets) {
      try {
        const decrypted = decrypt(secret.encryptedValue, secret.iv, secret.tag);
        console.log(`ID: ${secret.id} | Value: ${decrypted}`);
      } catch (e) {
        console.log(`ID: ${secret.id} | FAILED TO DECRYPT: ${e.message}`);
      }
    }
  } catch (err) {
    console.error("Error decrypting vault:", err);
  } finally {
    await prisma.$disconnect();
  }
}

decryptVault();
