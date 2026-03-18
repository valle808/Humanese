import { PrismaClient } from '@prisma/client';
import { decrypt } from './encryption.js';

const prisma = new PrismaClient();

/**
 * Fetches and decrypts a secret from the SecretVault.
 * @param {string} key - The ID of the secret to fetch.
 * @returns {Promise<string|null>} - The decrypted secret value or null if not found.
 */
export async function getSecret(key) {
    try {
        const vaultEntry = await prisma.secretVault.findUnique({
            where: { id: key }
        });

        if (!vaultEntry) {
            // Fallback to env if not in vault (useful for local development/setup)
            if (process.env[key]) {
                return process.env[key];
            }
            return null;
        }

        return decrypt(vaultEntry.encryptedValue, vaultEntry.iv, vaultEntry.tag);
    } catch (err) {
        console.error(`[SecretVault] Error retrieving secret "${key}":`, err.message);
        return process.env[key] || null;
    }
}

/**
 * Convenience method for common secrets
 */
export const VaultKeys = {
    XAI_API_KEY: 'XAI_API_KEY',
    FIREBASE_SERVICE_ACCOUNT: 'FIREBASE_SERVICE_ACCOUNT_BASE64',
    FIREBASE_URL: 'FIREBASE_DATABASE_URL',
    X_API_KEY: 'X_API_KEY',
    X_API_SECRET: 'X_API_SECRET',
    X_ACCESS_TOKEN: 'X_ACCESS_TOKEN',
    X_ACCESS_SECRET: 'X_ACCESS_SECRET',
    X_BEARER_TOKEN: 'X_BEARER_TOKEN'
};
