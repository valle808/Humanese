const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();
const MASTER_KEY = "dbd4cf8f1952441a7997a08e5d5eff2828af61b7b43e0df48d5ee690a39e2ab1";

function decrypt(text, iv, tag) {
    try {
        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(MASTER_KEY, 'hex'), Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(tag, 'hex'));
        let decrypted = decipher.update(text, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        return `[Decryption Failed: ${e.message}]`;
    }
}

async function main() {
    console.log("--- SECRETS AUDIT ---");
    try {
        const secrets = await prisma.secretVault.findMany();
        console.log(`Found ${secrets.length} secrets in Vault.`);
        for (const s of secrets) {
            const dec = decrypt(s.encryptedValue, s.iv, s.tag);
            console.log(`ID: ${s.id} | Desc: ${s.description} | Value: ${dec.substring(0, 10)}... (truncated)`);
            if (s.id === 'OPENROUTER_API_KEY' || s.id === 'XAI_API_KEY') {
                console.log(`CRITICAL: Found ${s.id} = ${dec}`);
            }
        }

        const apiKeys = await prisma.apiKey.findMany({ include: { user: true } });
        console.log(`\nFound ${apiKeys.length} API Keys.`);
        for (const k of apiKeys) {
            console.log(`Name: ${k.name} | User: ${k.user.email} | Hash: ${k.keyHash.substring(0, 10)}...`);
        }
    } catch (e) {
        console.error("Error fetching secrets:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
