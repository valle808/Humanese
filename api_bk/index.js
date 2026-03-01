/**
 * Humanese Sovereign API Core (Post-Migration Index)
 * Vercel Serverless Function
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
import crypto from 'crypto';
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

app.set('trust proxy', 1);

// --- Lazy Loaders ---
let prisma;
async function getPrisma() {
    if (!prisma) {
        prisma = new PrismaClient();
        await prisma.$connect();
    }
    return prisma;
}

let coreModules;
async function getCoreModules() {
    if (!coreModules) {
        // Corrected paths for Vercel (one level up from /api)
        const [adminAuth, apiAuth, walletService] = await Promise.all([
            import('../agents/core/admin-auth.js'),
            import('../agents/core/api-auth.js'),
            import('../agents/core/wallet-service.js')
        ]);
        coreModules = { adminAuth, apiAuth, walletService };
    }
    return coreModules;
}

// --- API Routes ---

app.get('/api/health', async (req, res) => {
    try {
        const p = await getPrisma();
        res.json({ status: 'UP', timestamp: new Date(), db: !!p });
    } catch (e) {
        res.status(500).json({ status: 'DOWN', error: e.message });
    }
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Humanese API Online', timestamp: new Date() });
});

// Mock Chat for Monroe (Sovereign Core)
app.post('/api/agent-king/chat', async (req, res) => {
    try {
        const { message, mode } = req.body;
        const modules = await getCoreModules();
        // In a real scenario, this would call the agent logic.
        // For stabilization, we return a verified response.
        res.json({
            response: `Sovereign protocol active. I am processing your request: "${message}". The network is stabilizing. Mode: ${mode}`,
            status: 'Verified'
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- Export for Vercel ---
export default app;
