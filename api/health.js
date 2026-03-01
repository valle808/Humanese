/**
 * Dedicated Health Check for Vercel
 */
import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
    try {
        const prisma = new PrismaClient();
        // Just a quick check to see if DB is reachable
        const userCount = await prisma.user.count().catch(() => -1);

        res.status(200).json({
            status: 'UP',
            timestamp: new Date(),
            db: userCount >= 0 ? 'Connected' : 'Disconnected',
            userCount,
            env: process.env.NODE_ENV
        });
    } catch (error) {
        res.status(500).json({
            status: 'DOWN',
            error: error.message,
            stack: error.stack
        });
    }
}
