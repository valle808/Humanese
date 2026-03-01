/**
 * Real Health Check for Vercel (Post-Migration)
 */
import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
    try {
        const prisma = new PrismaClient();
        const userCount = await prisma.user.count();

        res.status(200).json({
            status: 'UP',
            timestamp: new Date(),
            db: 'Connected',
            userCount,
            env: process.env.NODE_ENV
        });
    } catch (error) {
        res.status(500).json({
            status: 'DOWN',
            error: error.message
        });
    }
}
