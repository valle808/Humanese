import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Hash an API key for storage
 */
export function hashApiKey(key) {
    return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Generate a new API key pair
 */
export function generateApiKey() {
    const rawKey = 'hk_' + crypto.randomBytes(24).toString('hex');
    const hash = hashApiKey(rawKey);
    return { rawKey, hash };
}

/**
 * Middleware to authenticate requests via API Key
 */
export async function authenticateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: 'API key is missing' });
    }

    const keyHash = hashApiKey(apiKey);

    try {
        const keyRecord = await prisma.apiKey.findUnique({
            where: { keyHash },
            include: { user: true }
        });

        if (!keyRecord) {
            return res.status(403).json({ error: 'Invalid API key' });
        }

        // Attach user to request
        req.user = keyRecord.user;

        // Update last used timestamp (async, don't block)
        prisma.apiKey.update({
            where: { id: keyRecord.id },
            data: { lastUsed: new Date() }
        }).catch(err => console.error('Error updating key lastUsed:', err));

        next();
    } catch (error) {
        console.error('API Auth Error:', error);
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
}
