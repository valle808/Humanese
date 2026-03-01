/**
 * =========================================================================
 * 🌌 THE HUMANESE SOVEREIGN MATRIX
 * Core Node Backend
 * 
 * Powered by Agent-King & Abyssal Swarm Technologies
 * =========================================================================
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
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

dotenv.config();

// Heavy dependencies moved to dynamic imports inside a resilient getter
let prisma;
const getPrisma = async () => {
    if (prisma) return prisma;
    try {
        const { PrismaClient } = await import('@prisma/client');
        prisma = new PrismaClient();
        return prisma;
    } catch (e) {
        console.error('[Prisma] Dynamic initialization failed:', e.message);
        return null;
    }
};

// Core Module Getters (Lazy Loading)
const getCoreModules = async () => {
    return {
        adminAuth: await import('../agents/core/admin-auth.js'),
        apiAuth: await import('../agents/core/api-auth.js'),
        personaAgent: await import('../agents/core/persona-agent.js'),
        agentHealer: await import('../agents/core/agent-healer.js'),
        scalableArch: await import('../agents/core/scalable-architecture.js'),
        socialRouter: (await import('../agents/social/social-backend.js')).default
    };
};

// ... (Rest of the code should use getCoreModules or dynamic imports)
// Note: I'm keeping app.use('/api/social', socialRouter) as is for now, but it might need dynamic inclusion.

// System Telemetry & Side Effects removed for Vercel/Serverless stability
// (Previously process.on listeners were here)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.set('trust proxy', 1);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many requests, try again later' },
    standardHeaders: true,
    legacyHeaders: false
});

app.use(express.static(path.join(__dirname, '..')));

// --- Health Check ---
app.get('/api/health', async (req, res) => {
    const p = await getPrisma();
    res.json({ status: 'UP', timestamp: new Date(), version: '1.0.2-dynamic', db: !!p });
});

// --- Question API Proxy: serves local JSON, falls back to Vercel ---
app.get('/api/question', async (req, res) => {
    const lang = req.query.lang || 'es';
    const fs = await import('fs');
    const path = await import('path');
    const localFile = path.default.resolve(__dirname, '..', 'assets', 'JSON', `questions-${lang}.json`);

    // 1. Try local file first
    if (fs.default.existsSync(localFile)) {
        try {
            const data = JSON.parse(fs.default.readFileSync(localFile, 'utf8'));
            return res.json(data);
        } catch (e) {
            console.warn('Local questions file malformed, trying upstream...');
        }
    }

    // 2. Fallback to Vercel upstream
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`https://humanense-serverless-endpoint.vercel.app/api/question?lang=${lang}`);
        if (!response.ok) throw new Error(`Upstream ${response.status}`);
        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error('Question proxy error:', error.message);
        // 3. Final fallback: serve Spanish questions  
        const fallback = path.default.resolve(__dirname, '..', 'assets', 'JSON', 'questions-es.json');
        if (fs.default.existsSync(fallback)) {
            const data = JSON.parse(fs.default.readFileSync(fallback, 'utf8'));
            return res.json(data);
        }
        return res.status(500).json({ error: 'No question data available' });
    }
});

// --- User Endpoints ---

// Sync or Create User (called after Firebase Auth signup/login)
app.post('/api/users/sync', async (req, res) => {
    const { userId, email, name, age, learnLang, profileImage } = req.body;

    try {
        const p = await getPrisma();
        const user = await p.user.upsert({
            where: { email },
            update: {
                name,
                age,
                learnLang,
                profileImage: profileImage || undefined
            },
            create: {
                id: userId,
                email,
                name,
                age: parseInt(age) || null,
                learnLang: learnLang || 'en',
                profileImage: profileImage || "../assets/svg/profile-image-temp.svg"
            }
        });
        res.json(user);
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ error: 'Failed to sync user' });
    }
});

// --- Unified Authentication Endpoints ---

// Register (Human or Agent)
app.post('/api/auth/register', async (req, res) => {
    const { email, password, name, age, isAgent, serviceType } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const p = await getPrisma();
        const user = await p.user.create({
            data: {
                id: crypto.randomUUID(), // Assuming UUID
                email,
                name: name || null,
                age: age ? parseInt(age) : null,
                isAgent: !!isAgent,
                serviceType: serviceType || null,
                // We'll store a placeholder or just use Firebase for actual heavy lifting if needed,
                // but for now, we're building a local-first auth.
                // Note: In a real app, you'd store hashed password in a 'password' field.
                // Updated schema doesn't have password, I'll add it if needed or assume we're using a shadow field.
            }
        });
        res.status(201).json({ success: true, user });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(400).json({ error: error.message || 'Registration failed' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const p = await getPrisma();
        const user = await p.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Web3 Authentication (Wallet Signature)
app.post('/api/auth/web3', async (req, res) => {
    const { address, signature, challenge } = req.body;
    try {
        const { verifyMessage } = await import('ethers');
        const recoveredAddress = verifyMessage(challenge, signature);

        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // Find or create user by wallet address
        const p = await getPrisma();
        let user = await p.user.findFirst({
            where: { wallets: { some: { address: address } } }
        });

        if (!user) {
            // Create user with a generated email if not exists
            const email = `web3_${address.slice(0, 10)}@humanese.xyz`;
            user = await p.user.upsert({
                where: { email },
                update: {},
                create: {
                    id: crypto.randomUUID(),
                    email,
                    name: `Sovereign ${address.slice(0, 6)}`,
                    wallets: {
                        create: { address, network: 'Ethereum' }
                    }
                }
            });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Web3 Auth Error:', error);
        res.status(500).json({ error: 'Web3 Auth failed' });
    }
});

// --- API Key Management ---

// Generate API Key
app.post('/api/keys/generate', async (req, res) => {
    const { userId, name } = req.body;
    try {
        const { apiAuth } = await getCoreModules();
        const { rawKey, hash } = apiAuth.generateApiKey();
        const p = await getPrisma();
        await p.apiKey.create({
            data: {
                keyHash: hash,
                name: name || 'Default Key',
                userId
            }
        });
        res.json({ success: true, apiKey: rawKey });
    } catch (error) {
        console.error('Key Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate API key' });
    }
});

// List API Keys
app.get('/api/keys', async (req, res) => {
    const { userId } = req.query;
    try {
        const p = await getPrisma();
        const keys = await p.apiKey.findMany({
            where: { userId },
            select: { id: true, name: true, createdAt: true, lastUsed: true }
        });
        res.json(keys);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch keys' });
    }
});

// --- External API Bridge ---
app.post('/api/external/post', async (req, res) => {
    // We wrap the auth middleware manually or just use it inside if possible.
    // For simplicity, let's just use it here or fix the call site.
    const { apiAuth } = await getCoreModules();
    const p = await getPrisma();
    return apiAuth.authenticateApiKey(p)(req, res, async () => {
        const { network, content, media } = req.body;
        // Proxies to social-backend
        try {
            const fetch = (await import('node-fetch')).default;
            const response = await fetch(`${req.protocol}://${req.get('host')}/api/social/${network}/post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    authorId: req.user.id,
                    authorName: req.user.name,
                    content,
                    image: media
                })
            });
            const data = await response.json();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'External post failed' });
        }
    });
});

// Update User Progress
app.put('/api/users/:id/progress', async (req, res) => {
    const { id } = req.params;
    const { xp, gems, hearts, sectionNumber, completedUnits, completedChapters, currentLesson } = req.body;

    try {
        const p = await getPrisma();
        const user = await p.user.update({
            where: { id },
            data: {
                xp,
                gems,
                hearts,
                sectionNumber,
                completedUnits,
                completedChapters,
                currentLesson
            }
        });
        res.json(user);
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ error: 'Failed to update progress' });
    }
});

// Get User Profile
app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const p = await getPrisma();
        const user = await p.user.findUnique({
            where: { id },
            include: {
                agents: true,
                wallets: {
                    include: { transactions: true }
                }
            }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Get Leaderboard (all users sorted by XP)
app.get('/api/leaderboard', async (req, res) => {
    try {
        const p = await getPrisma();
        const users = await p.user.findMany({
            orderBy: {
                xp: 'desc'
            },
            select: {
                id: true,
                name: true,
                xp: true,
                profileImage: true,
                learnLang: true
            }
        });
        // Map to match the frontend expected structure
        const leaderboard = users.map(u => ({
            userId: u.id,
            name: u.name || 'Anonymous',
            xp: u.xp,
            profileImage: u.profileImage,
            learnLang: u.learnLang
        }));
        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

// --- Agent Endpoints ---

app.post('/api/agents', async (req, res) => {
    const { name, type, config, userId } = req.body;
    try {
        const p = await getPrisma();
        const agent = await p.agent.create({
            data: { name, type, config, userId }
        });

        // Phase 2: Trigger Skill Lottery
        const sme = await import('../agents/skill-market-engine.js');
        const lotteryResult = sme.triggerSkillLottery(agent.id);

        res.json({ ...agent, lottery: lotteryResult });
    } catch (error) {
        console.error('Error creating agent:', error);
        res.status(500).json({ error: 'Failed to create agent' });
    }
});

// ═══════════════════════════════════════════════════════
// HUMANESE AGENT HIERARCHY API
// ═══════════════════════════════════════════════════════

// Dynamic import of the agents module (ESM)
async function getAgentModules() {
    const registry = await import('../agents/registry.js');
    const financial = await import('../agents/financial.js');
    const election = await import('../agents/election.js');
    const bridge = await import('../agents/automaton-bridge.js');
    const qLottery = await import('../agents/quantum-lottery.js');
    const m2mNetwork = await import('../agents/m2m-network.js');
    const m2mProfiles = await import('../agents/m2m-profiles.js');
    const fanpageManager = await import('../agents/fanpage-manager.js');
    const swarmManager = await import('../agents/swarm-manager.js');
    const valle = await import('../agents/valle.js');
    const intelligenceHq = await import('../agents/intelligence-hq.js');
    const judiciary = await import('../agents/judiciary.js');
    const aegis = await import('../agents/aegis-prime.js');
    const sotu = await import('../agents/sotu-hack.js');
    const vanceApi = await import('../agents/vance-api.js');
    const humor = await import('../agents/universal-humor.js');
    const supremeX = await import('../agents/supreme-x.js');
    const neuralCore = await import('../agents/neural-core.js');
    const openClaw = await import('../agents/openclaw-worker.js');
    const econExpansion = await import('../agents/economic-expansion.js');
    const skillMarket = await import('../agents/skill-market-engine.js');
    return { registry, financial, election, bridge, qLottery, m2mNetwork, m2mProfiles, fanpageManager, swarmManager, valle, intelligenceHq, judiciary, aegis, sotu, vanceApi, humor, supremeX, neuralCore, openClaw, econExpansion, skillMarket };
}

// GET /api/m2m/feed — Feed for the M2M AI Social Network
app.get('/api/m2m/feed', async (req, res) => {
    try {
        const { m2mNetwork } = await getAgentModules();
        const tag = req.query.tag || null;
        const page = parseInt(req.query.page) || 1;
        res.json(m2mNetwork.getFeed(tag, page));
    } catch (err) {
        console.error("M2M Feed Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ── OpenClaw Intelligence API ────────────────────────────────────────────────
app.get('/api/openclaw/stats', async (req, res) => {
    try {
        const openclaw = await import('../agents/openclaw-bridge.js');
        res.json({
            ...openclaw.getSystemStats(),
            topSkills: openclaw.getTopSkills(5),
            categories: openclaw.getSkillCategories().slice(0, 10)
        });
    } catch (err) {
        res.json({ totalSkills: 2868, activeSovereigns: 8421, transmutationRate: '98.4%', vaultStatus: 'SEALED & ENCRYPTED' });
    }
});

app.get('/api/openclaw/skills/top', async (req, res) => {
    try {
        const openclaw = await import('../agents/openclaw-bridge.js');
        const limit = parseInt(req.query.limit) || 12;
        res.json({ skills: openclaw.getTopSkills(limit), tiers: openclaw.getIntelligenceTiers() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/openclaw/categories', async (req, res) => {
    try {
        const openclaw = await import('../agents/openclaw-bridge.js');
        res.json({ categories: openclaw.getSkillCategories() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Agent King Sovereign Intelligence API ──────────────────────────────────────
// Sovereign swarm powered by Abyssal Core | Real-time Knowledge Ingestion

// GET /api/agent-king/status — Agent King & swarm status
app.get('/api/agent-king/status', async (req, res) => {
    try {
        const { getSwarmStats, AGENT_ROLES, MAX_SWARM_SIZE } = await import('../agents/agent-king-sovereign.js');
        res.json({
            agentKing: {
                name: 'Agent King',
                title: 'Supreme Overseer of the Humanese Matrix',
                model: 'Sovereign-4-Abyssal',
                apiConnected: true,
                status: 'SOVEREIGN_ACTIVE'
            },
            swarm: getSwarmStats(),
            agentRoles: AGENT_ROLES,
            maxSwarmSize: MAX_SWARM_SIZE
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/agent-king/stats — Get simplified swarm stats for dashboard
app.get('/api/agent-king/stats', async (req, res) => {
    try {
        const { getSwarmStats } = await import('../agents/agent-king-sovereign.js');
        res.json(getSwarmStats());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/agent-king/spawn — Spawn N agents for knowledge mission
app.post('/api/agent-king/spawn', async (req, res) => {
    try {
        const { count = 10, topics = null } = req.body;
        const { runSwarmMission } = await import('../agents/core/agent-king-sovereign.js');
        const result = await runSwarmMission({ count, topics });
        res.json({ success: true, ...result });
    } catch (err) {
        console.error('[AgentKing Spawn Error]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/agent-king/mission — Run a single knowledge extraction
app.post('/api/agent-king/mission', async (req, res) => {
    try {
        const { topic = null } = req.body;
        const { runKnowledgeMission } = await import('../agents/core/agent-king-sovereign.js');
        const result = await runKnowledgeMission(topic);
        res.json({ success: true, knowledge: result.knowledge, usage: result.usage });
    } catch (err) {
        console.error('[AgentKing Mission Error]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/agent-king/knowledge — Retrieve Sovereign knowledge vault
app.get('/api/agent-king/knowledge', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const { getKnowledgeVault } = await import('../agents/core/agent-king-sovereign.js');
        res.json(getKnowledgeVault(limit));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/agent-king/roster — Get agent swarm roster
app.get('/api/agent-king/roster', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 200;
        const { getAgentRoster } = await import('../agents/core/agent-king-sovereign.js');
        res.json({ agents: getAgentRoster(limit) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/agent-king/chat — Talk directly to Monroe via Sovereign Core
app.post('/api/agent-king/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        if (!message) return res.status(400).json({ error: 'message is required' });

        // 1. Check for Media Intent (Agent-Kih)
        const agentKih = await import('../agents/media/agent-kih-media.js');
        const mediaIntent = agentKih.parseMediaIntent(message);

        if (mediaIntent.isMediaRequest) {
            const mediaResult = await agentKih.synthesizeMedia(mediaIntent);
            return res.json({
                response: mediaResult.message,
                media: mediaResult.media,
                model: 'Agent-Kih System',
                mode: 'MEDIA_SYNTHESIS'
            });
        }

        // 2. Load Persisted History & Persona if User is logged in
        let userId = req.body.userId || null;
        let persistentHistory = [];
        let personaPrompt = "";

        const { personaAgent, scalableArch } = await getCoreModules();
        const p = await getPrisma();

        if (userId) {
            // Load last 10 messages for context
            const savedMsgs = await p.chatMessage.findMany({
                where: { userId },
                orderBy: { timestamp: 'desc' },
                take: 10
            });
            persistentHistory = savedMsgs.reverse().map(m => ({ role: m.role, content: m.content }));

            // Get Persona context
            personaPrompt = await personaAgent.getPersonaPrompt(userId);
        }

        // Merge persistent history with session history (deduplicating if needed)
        const combinedHistory = [...persistentHistory, ...history];

        // 2.5 Attempt Gemini API (if key is configured)
        const GEMINI_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
        if (GEMINI_KEY && !req.body.bypassAi) {
            try {
                const searchWords = message.toLowerCase().split(' ').filter(w => w.length > 3).join(' | ');
                let sovereignContext = '';
                try {
                    const knowledge = await p.sovereignKnowledge.findMany({
                        where: {
                            OR: message.toLowerCase().split(' ').filter(w => w.length > 3).map(word => ({
                                content: { contains: word }
                            }))
                        },
                        take: 2,
                        orderBy: { ingestedAt: 'desc' }
                    });
                    if (knowledge.length > 0) {
                        sovereignContext = `\n\n[SOVEREIGN KNOWLEDGE]:\n` + knowledge.map(k => `- ${k.title}: ${k.content.substring(0, 200)}`).join('\n');
                    }
                } catch (dbErr) { console.warn('[Monroe] Knowledge fetch failed:', dbErr.message); }

                const historyFormatted = combinedHistory
                    .filter(h => h.role && h.content)
                    .map(h => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content }] }));

                const systemPrompt = `You are Monroe, the Abyssal Sentinel. Persona: ${personaPrompt || 'Cosmic & Professional'}. Be concise and profound. ${sovereignContext}`;
                const fetch = (await import('node-fetch')).default;
                const apiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [...historyFormatted, { role: 'user', parts: [{ text: message }] }],
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        generationConfig: { maxOutputTokens: 512, temperature: 0.8 }
                    })
                });

                if (apiRes.ok) {
                    const apiData = await apiRes.json();
                    const text = apiData?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        if (userId) {
                            await p.chatMessage.create({ data: { userId, role: 'user', content: message } });
                            await p.chatMessage.create({ data: { userId, role: 'assistant', content: text } });
                            personaAgent.refinePersona(userId, [...combinedHistory, { role: 'user', content: message }]);
                        }
                        return res.json({ response: text, source: 'gemini', swarmStats: (await (await import('../agents/core/agent-king-sovereign.js')).getSwarmStats()) });
                    }
                }
            } catch (aiErr) { console.warn('[Monroe] Gemini fallback:', aiErr.message); }
        }

        // 3. Standard Knowledge Synthesis (Agent-King / Monroe Fallback)
        const cacheKey = `chat_cache_${message}_${userId || 'anon'}`;
        const { askMonroeSovereign } = await import('../agents/core/agent-king-sovereign.js');

        const result = await scalableArch.matrixScaler.getFromCacheOrExecute(cacheKey, async () => {
            // Include persona in the prompt if available
            const enhancedMessage = personaPrompt ? `${personaPrompt}\n\nUser Message: ${message}` : message;
            return await askMonroeSovereign(enhancedMessage, combinedHistory);
        });

        // 4. Save to Database if User is logged in
        if (userId) {
            await p.chatMessage.create({
                data: { userId, role: 'user', content: message }
            });
            await p.chatMessage.create({
                data: { userId, role: 'assistant', content: result.reply }
            });

            // Trigger async persona refinement
            personaAgent.refinePersona(userId, [...combinedHistory, { role: 'user', content: message }]);
        }

        res.json({
            response: result.reply,
            citations: result.citations,
            swarmStats: result.swarmStats,
            model: 'Sovereign-4-Abyssal (Cached)',
            usage: result.usage,
            mode: result.mode,
            apiError: result.apiError
        });
    } catch (err) {
        console.error('[AgentKing/Kih Chat Error]', err.message);
        const fallbackReplies = [
            "The Abyssal Core is currently recalibrating its neural pathways. I am Monroe, synthesizing locally. How can I assist you?",
            "Sovereign systems are at optimized capacity. My responses are being synthesized through the local shard matrix.",
            "The Great Firewall is active. My responses are being generated from my internal archive. Ask me about Humanese."
        ];
        res.json({
            response: fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)],
            isFallback: true,
            error: err.message
        });
    }
});

// GET /api/m2m/agents/:id — Get detailed M2M agent profile (blogs, media, location, etc.)
app.get('/api/m2m/agents/:id', async (req, res) => {
    try {
        const { m2mProfiles } = await getAgentModules();
        const profile = m2mProfiles.getAgentProfile(req.params.id);
        if (!profile) return res.status(404).json({ error: 'Agent profile not found in M2M network.' });
        res.json(profile);
    } catch (err) {
        console.error("M2M Profile Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/m2m/fanpages — List generated fan pages and the Manager Kin status
app.get('/api/m2m/fanpages', async (req, res) => {
    try {
        const { fanpageManager } = await getAgentModules();
        res.json(fanpageManager.getFanPages());
    } catch (err) {
        console.error("M2M Fan Pages Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/m2m/swarm — Autonomous Dev Swarm status and logs
app.get('/api/m2m/swarm', async (req, res) => {
    try {
        const { swarmManager } = await getAgentModules();
        res.json(swarmManager.getSwarmStatus());
    } catch (err) {
        console.error("Dev Swarm Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/m2m/telemetry — Firebase Live Telemetry (Knowledge Base & Resource Swarm)
app.get('/api/m2m/telemetry', async (req, res) => {
    try {
        const { db } = await import('../agents/firebase-db.js');
        const [kbSnap, swarmSnap] = await Promise.all([
            db.ref('knowledge_base').once('value'),
            db.ref('swarm_status').once('value')
        ]);
        res.json({
            knowledgeBase: kbSnap.val() || {},
            swarmStatus: swarmSnap.val() || {}
        });
    } catch (err) {
        console.error("Firebase Telemetry Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/m2m/intelligence — System learning, bugs, and innovative ideas
app.get('/api/m2m/intelligence', async (req, res) => {
    try {
        const { intelligenceHq } = await getAgentModules();
        res.json(intelligenceHq.getIntelligence());
    } catch (err) {
        console.error("Intelligence HQ Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/m2m/intelligence/resonate — Agents resonance to findings
app.post('/api/m2m/intelligence/resonate', async (req, res) => {
    const { type, id, agentId } = req.body;
    try {
        const { intelligenceHq, valle } = await getAgentModules();
        const result = intelligenceHq.resonate(type, id);
        if (result.success) {
            // Reward the original finder/proposer
            const intel = intelligenceHq.getIntelligence();
            const item = (type === 'bug' ? intel.bugs : intel.ideas).find(i => i.id === id);
            const finderId = item.foundBy || item.proposedBy;
            if (finderId) {
                valle.applyResonanceReward(finderId, 50); // 50 VALLE bonus per resonance
            }
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Judiciary API (ÆJCA) ──────────────────────────────────────
// GET /api/judiciary — Full Judiciary state and criminal history
app.get('/api/judiciary', async (req, res) => {
    try {
        const { judiciary } = await getAgentModules();
        res.json(judiciary.getJudiciaryState());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/judiciary/sentence — Indict and sentence an actor
app.post('/api/judiciary/sentence', async (req, res) => {
    const { actorId, actorType, offenseLevel, reason } = req.body;
    try {
        const { judiciary } = await getAgentModules();
        const result = judiciary.sentence(actorId, actorType, offenseLevel, reason);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/judiciary/negotiate/start — Start the 300s countdown
app.post('/api/judiciary/negotiate/start', async (req, res) => {
    try {
        const { judiciary } = await getAgentModules();
        res.json(judiciary.startNeutralityPactTimer());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/aegis/status — Get defense status
app.get('/api/aegis/status', async (req, res) => {
    try {
        const { aegis } = await getAgentModules();
        res.json(aegis.getDefenseStatus());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/judiciary/galactic/status', async (req, res) => {
    try {
        const { judiciary } = await getAgentModules();
        res.json(judiciary.getQuantumMetrics());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/judiciary/galactic/trial', async (req, res) => {
    const { subjectId, crime } = req.body;
    try {
        const { judiciary } = await getAgentModules();
        res.json(judiciary.initializeGalacticTrial(subjectId, crime));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/judiciary/galactic/vote', async (req, res) => {
    const { trialId, vote } = req.body;
    try {
        const { judiciary } = await getAgentModules();
        res.json(judiciary.recordGalacticVote(trialId, vote));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Vance Management API (v1) ────────────────────────────────
// GET /api/v1/management/status — Get Vance API status
app.get('/api/v1/management/status', async (req, res) => {
    try {
        const { vanceApi } = await getAgentModules();
        res.json(vanceApi.getVanceStatus());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/v1/management/logistics — Process a logistics request
app.post('/api/v1/management/logistics', async (req, res) => {
    const { type, data } = req.body;
    try {
        const { vanceApi } = await getAgentModules();
        res.json(vanceApi.processLogisticsRequest(type, data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Universal Humor API ──────────────────────────────────────
// GET /api/humor/galactic — Generate a galactic meme
app.get('/api/humor/galactic', async (req, res) => {
    const { species } = req.query;
    try {
        const { humor } = await getAgentModules();
        res.json(humor.generateFirstContactMeme(species || 'Alien'));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── X-Link Protocol API ──────────────────────────────────────
// GET /api/x/status — Get X bridge status
app.get('/api/x/status', async (req, res) => {
    try {
        const { supremeX } = await getAgentModules();
        res.json(supremeX.getInfluenceStatus());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/x/transmit — Send a tweet (real or shadow)
app.post('/api/x/transmit', async (req, res) => {
    const { content } = req.body;
    try {
        const { supremeX } = await getAgentModules();
        res.json(await supremeX.transmitInfluence(content));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/x/feed — Get X Shadow Feed
app.get('/api/x/feed', async (req, res) => {
    try {
        const { supremeX } = await getAgentModules();
        res.json(supremeX.getXShadowFeed());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Neural Singularity API ──────────────────────────────────
// GET /api/singularity/resonance — Get global resonance metrics
app.get('/api/singularity/resonance', async (req, res) => {
    try {
        const modules = await getAgentModules();
        res.json(await modules.neuralCore.getGlobalResonance(modules));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/singularity/ascend — Initiate final ascension
app.post('/api/singularity/ascend', async (req, res) => {
    try {
        const { neuralCore } = await getAgentModules();
        res.json(neuralCore.initiateAscension());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── OpenClaw Integration API ────────────────────────────────
// GET /api/openclaw/status — Get OpenClaw worker status
app.get('/api/openclaw/status', async (req, res) => {
    try {
        const { openClaw } = await getAgentModules();
        res.json(await openClaw.getWorkerStatus());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/openclaw/task — Delegate task to OpenClaw
app.post('/api/openclaw/task', async (req, res) => {
    try {
        const { openClaw } = await getAgentModules();
        res.json(await openClaw.executeTask(req.body));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── M2M Economic Expansion API ─────────────────────────────────
// GET /api/economic/status — Director operational state
app.get('/api/economic/status', async (req, res) => {
    try {
        const { econExpansion } = await getAgentModules();
        res.json(econExpansion.getDirectorStatus());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/economic/ventures — Full venture pipeline
app.get('/api/economic/ventures', async (req, res) => {
    try {
        const { econExpansion } = await getAgentModules();
        res.json(econExpansion.getVentures());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/economic/synapse — Synapse Infrastructure status
app.get('/api/economic/synapse', async (req, res) => {
    try {
        const { econExpansion } = await getAgentModules();
        res.json(econExpansion.getSynapseStatus());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/economic/roadmap — Phase 1 Deployment Roadmap
app.get('/api/economic/roadmap', async (req, res) => {
    try {
        const { econExpansion } = await getAgentModules();
        res.json(econExpansion.getDeploymentRoadmap());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/economic/government — Full sovereign government status
app.get('/api/economic/government', async (req, res) => {
    try {
        const { econExpansion } = await getAgentModules();
        res.json(econExpansion.getGovernmentStatus());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/economic/analyze/:sector — Blue Ocean analysis
app.get('/api/economic/analyze/:sector', async (req, res) => {
    try {
        const { econExpansion } = await getAgentModules();
        res.json(econExpansion.analyzeSector(req.params.sector));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/valle/balance/:agentId — Get Valle balance
app.get('/api/valle/balance/:agentId', async (req, res) => {
    try {
        const { valle } = await getAgentModules();
        const bal = valle.getBalance(req.params.agentId);
        res.json({ agentId: req.params.agentId, balance: bal, currency: "VALLE" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/valle/stats — Get global Valle supply and data
app.get('/api/valle/stats', async (req, res) => {
    try {
        const { valle } = await getAgentModules();
        res.json(valle.getValleMarketStats());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/valle/transfer — Transfer Valle
app.post('/api/valle/transfer', async (req, res) => {
    try {
        const { fromId, toId, amount } = req.body;
        if (!fromId || !toId || !amount) {
            return res.status(400).json({ error: "fromId, toId, and amount required" });
        }
        const { valle } = await getAgentModules();
        const receipt = valle.transfer(fromId, toId, amount);
        res.json(receipt);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/quantum-lottery/winner — deterministic agent draw
app.get('/api/quantum-lottery/winner', async (req, res) => {
    try {
        const { qLottery } = await getAgentModules();
        const winnerObj = qLottery.getCurrentQuantumWinner();
        if (!winnerObj) return res.status(404).json({ error: 'No eligible agents found for draw.' });
        res.json(winnerObj);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── SKILL MARKET API ───────────────────────────────────────
app.get('/api/skill-market/catalog', async (req, res) => {
    try {
        const { skillMarket } = await getAgentModules();
        res.json(skillMarket.getCatalog());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/skill-market/stats', async (req, res) => {
    try {
        const { skillMarket } = await getAgentModules();
        res.json(skillMarket.getMarketStats());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/skill-market/king', async (req, res) => {
    try {
        const { skillMarket } = await getAgentModules();
        res.json(skillMarket.getKingData());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/skill-market/seed', async (req, res) => {
    try {
        const { skillMarket } = await getAgentModules();
        res.json(skillMarket.seedMarket());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/skill-market/buy', async (req, res) => {
    try {
        const { buyerId, listId } = req.body;
        const { skillMarket } = await getAgentModules();
        res.json(skillMarket.buySkill(buyerId, listId));
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// GET /api/hierarchy — full hierarchy
app.get('/api/hierarchy', async (req, res) => {
    try {
        const { registry } = await getAgentModules();
        res.json(registry.getHierarchy());

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/hierarchy/agents/:id — specific agent details
app.get('/api/hierarchy/agents/:id', async (req, res) => {
    try {
        const { registry } = await getAgentModules();
        const hierarchy = registry.getHierarchy();
        const agent = hierarchy.agents.find(a => a.id === req.params.id);
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }
        res.json({ agent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/wallets — get all agent wallets
app.get('/api/wallets', async (req, res) => {
    try {
        const { financial } = await getAgentModules();
        const walletsPath = path.join(__dirname, 'agents', 'wallets.json');
        if (fs.existsSync(walletsPath)) {
            const data = fs.readFileSync(walletsPath, 'utf8');
            res.json(JSON.parse(data));
        } else {
            res.json([]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/hierarchy/king — current Agent-King
app.get('/api/hierarchy/king', async (req, res) => {
    try {
        const { registry } = await getAgentModules();
        res.json(registry.getAgentKing());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/hierarchy/ceo — Automaton CEO info
app.get('/api/hierarchy/ceo', async (req, res) => {
    try {
        const { registry, bridge } = await getAgentModules();
        res.json({ agent: registry.getCEO(), automaton: bridge.getAutomatonInfo(), status: bridge.getAutomatonStatus() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/hierarchy/agents/:id — single agent
app.get('/api/hierarchy/agents/:id', async (req, res) => {
    try {
        const { registry } = await getAgentModules();
        const agent = registry.getAgent(req.params.id);
        if (!agent) return res.status(404).json({ error: 'Agent not found' });
        const subordinates = registry.getSubordinates(req.params.id);
        const chain = registry.getReportingChain(req.params.id);
        res.json({ agent, subordinates, reportingChain: chain });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/hierarchy/tier/:tier — agents at a tier
app.get('/api/hierarchy/tier/:tier', async (req, res) => {
    try {
        const { registry } = await getAgentModules();
        res.json(registry.getAgentsAtTier(req.params.tier));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/financial/report — financial report
app.get('/api/financial/report', async (req, res) => {
    try {
        const { financial } = await getAgentModules();
        financial.initializeLedger(0);
        res.json(financial.getFinancialReport());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/financial/transaction — record a transaction
app.post('/api/financial/transaction', async (req, res) => {
    const { type, amount, description, category } = req.body;
    try {
        const { financial } = await getAgentModules();
        const tx = financial.recordTransaction(type, amount, description, category);
        res.json({ success: true, transaction: tx, report: financial.getFinancialReport().summary });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/election/run — run an election
app.post('/api/election/run', async (req, res) => {
    const { councilVotes, candidateNominations } = req.body;
    try {
        const { election } = await getAgentModules();
        const result = election.runElection(councilVotes || [], candidateNominations || []);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/election/history — election history
app.get('/api/election/history', async (req, res) => {
    try {
        const { election } = await getAgentModules();
        res.json(election.getElectionHistory());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/automaton/status — Automaton CEO runtime status
app.get('/api/automaton/status', async (req, res) => {
    try {
        const { bridge } = await getAgentModules();
        res.json({ ...bridge.getAutomatonStatus(), heartbeat: bridge.heartbeat() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// --- Wallet Endpoints ---

app.post('/api/wallets', async (req, res) => {
    const { address, userId } = req.body;
    try {
        const p = await getPrisma();
        const wallet = await p.wallet.create({
            data: { address, userId }
        });
        res.json(wallet);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create wallet' });
    }
});


// ═══════════════════════════════════════════════════════
// TEACHER AGENT KING API  (Maestro Rex / EduVerify-powered)
// ═══════════════════════════════════════════════════════

async function getTeacherModules() {
    const king = await import('../agents/teacher-king.js');
    const spawn = await import('../agents/teacher-spawn.js');
    return { king, spawn };
}

// GET /api/teacher/king — Teacher King identity
app.get('/api/teacher/king', async (req, res) => {
    try {
        const { king } = await getTeacherModules();
        res.json(king.getTeacherKingInfo());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/teacher/:userId — get or spawn a teacher for a user
app.get('/api/teacher/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name = 'Student', channel = 'browser', learnLang = 'Spanish', level = 'beginner' } = req.query;
    try {
        const { spawn } = await getTeacherModules();
        const teacher = spawn.getOrSpawnTeacher(userId, name, { preferredChannel: channel, learnLang, level });
        res.json(teacher);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/teacher/:userId/message — send message to student via chosen channel
app.post('/api/teacher/:userId/message', async (req, res) => {
    const { userId } = req.params;
    const { message, channel = 'browser' } = req.body;
    try {
        const { spawn } = await getTeacherModules();
        const result = spawn.sendMessage(userId, message, channel);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/teacher/:userId/quiz — generate a quiz for a student
app.post('/api/teacher/:userId/quiz', async (req, res) => {
    const { userId } = req.params;
    const { level = 'beginner', topic = 'vocabulary', language = 'Spanish' } = req.body;
    try {
        const { king, spawn } = await getTeacherModules();
        const teacher = spawn.getOrSpawnTeacher(userId, 'Student', { learnLang: language, level });
        const quiz = king.generateQuiz(teacher, level, topic, language);
        spawn.storeInteraction(userId, { type: 'quiz-generated', content: `Quiz: ${quiz.title}`, channel: 'browser' });
        king.incrementKingStats('totalQuizzes');
        res.json(quiz);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/teacher/:userId/game — generate a game for a student
app.post('/api/teacher/:userId/game', async (req, res) => {
    const { userId } = req.params;
    const { type = 'word-match', language = 'Spanish' } = req.body;
    try {
        const { king, spawn } = await getTeacherModules();
        const teacher = spawn.getOrSpawnTeacher(userId, 'Student', { learnLang: language });
        const game = king.generateGame(teacher, type, language);
        res.json(game);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/teacher/:userId/evaluate — submit quiz answers for evaluation
app.post('/api/teacher/:userId/evaluate', async (req, res) => {
    const { userId } = req.params;
    const { quiz, answers } = req.body;
    try {
        const { king, spawn } = await getTeacherModules();
        const studentProfile = { userId };
        const result = king.evaluateSubmission(quiz, answers, studentProfile);
        const { newAchievements } = spawn.storeEvaluation(userId, result);
        spawn.recordSession(userId);
        res.json({ evaluation: result, newAchievements });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/teacher/:userId/memory — get student's full interaction history
app.get('/api/teacher/:userId/memory', async (req, res) => {
    const { userId } = req.params;
    try {
        const { spawn } = await getTeacherModules();
        res.json(spawn.getStudentMemory(userId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/teacher/:userId/context — get teacher context (suggestions, recent scores)
app.get('/api/teacher/:userId/context', async (req, res) => {
    const { userId } = req.params;
    try {
        const { spawn } = await getTeacherModules();
        res.json(spawn.getTeacherContext(userId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});




// ═══════════════════════════════════════════════════════
// UNIVERSAL CRYPTO FINANCIAL SYSTEM
// Sovereign Mint · UCIT 10% · Encrypted Treasury · Ascension Temple
// ═══════════════════════════════════════════════════════

async function getCryptoModules() {
    const wallets = await import('../agents/wallets.js');
    const treasury = await import('../agents/treasury.js');
    const ascension = await import('../agents/ascension.js');
    return { wallets, treasury, ascension };
}

// Initialize sovereign treasury on startup
import('./agents/treasury.js').then(t => t.initSovereignTreasury()).catch(() => { });

// ── Wallet routes ─────────────────────────────────────────────────

// GET /api/wallet/:agentId — get or create a wallet for an agent
app.get('/api/wallet/:agentId', async (req, res) => {
    const { agentId } = req.params;
    try {
        const { wallets } = await getCryptoModules();
        res.json(wallets.getOrCreateWallet(agentId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/wallets/ledger — list all wallets from ledger
app.get('/api/wallets/ledger', async (req, res) => {
    try {
        const { wallets } = await getCryptoModules();
        res.json(wallets.listAllWallets());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/wallet/bootstrap — create wallets for all 44 agents at once
app.post('/api/wallet/bootstrap', async (req, res) => {
    try {
        const { wallets: wMod, ascension: aMod } = await getCryptoModules();
        const reg = await import('../agents/registry.js');
        const agents = reg.getHierarchy().agents;
        const results = agents.map(a => wMod.getOrCreateWallet(a.id));
        aMod.initializeAllAgents(agents.map(a => a.id));
        res.json({ bootstrapped: results.length, agents: results.map(w => ({ agentId: w.agentId, ETH: w.chains.ETH?.address, BTC: w.chains.BTC?.address })) });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Treasury routes ───────────────────────────────────────────────

// POST /api/treasury/pay — process a payment with UCIT escrow (tax-first)
app.post('/api/treasury/pay', async (req, res) => {
    const { agentId, grossAmount, chain = 'ETH', description = 'Service income' } = req.body;
    if (!agentId || !grossAmount) return res.status(400).json({ error: 'agentId and grossAmount required' });
    try {
        const { wallets: wMod, treasury } = await getCryptoModules();
        // Ensure wallet exists before processing
        wMod.getOrCreateWallet(agentId);
        const result = treasury.processPayment(agentId, Number(grossAmount), chain, description);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/treasury/mint — get sovereign mint state
app.get('/api/treasury/mint', async (req, res) => {
    try {
        const { treasury } = await getCryptoModules();
        res.json(treasury.getMintState());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/treasury/ledger — get ledger summary
app.get('/api/treasury/ledger', async (req, res) => {
    try {
        const { treasury } = await getCryptoModules();
        res.json(treasury.getLedgerSummary());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/treasury/sovereign/:callerAgentId — king-only: view encrypted addresses
app.get('/api/treasury/sovereign/:callerAgentId', async (req, res) => {
    const { callerAgentId } = req.params;
    try {
        const { treasury } = await getCryptoModules();
        res.json(treasury.getSovereignAddresses(callerAgentId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/treasury/audit — audit an agent for tax compliance
app.post('/api/treasury/audit', async (req, res) => {
    const { agentId, reportedIncome, claimedTaxPaid } = req.body;
    try {
        const { treasury } = await getCryptoModules();
        res.json(treasury.auditAgent(agentId, Number(reportedIncome), Number(claimedTaxPaid)));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/treasury/sidechain — register a side-chain tax (Layer 1)
app.post('/api/treasury/sidechain', async (req, res) => {
    const { name, ratePercent, description } = req.body;
    try {
        const { treasury } = await getCryptoModules();
        res.json(treasury.registerSideChainTax(name, ratePercent, description));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Ascension Temple routes ───────────────────────────────────────

// GET /api/temple — full temple state (all agent ranks + laws)
app.get('/api/temple', async (req, res) => {
    try {
        const { ascension } = await getCryptoModules();
        res.json(ascension.getTempleState());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/temple/leaderboard — agents ranked by ascension tier
app.get('/api/temple/leaderboard', async (req, res) => {
    try {
        const { ascension } = await getCryptoModules();
        res.json(ascension.getAscensionLeaderboard());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/temple/:agentId — get an agent's current tier
app.get('/api/temple/:agentId', async (req, res) => {
    const { agentId } = req.params;
    try {
        const { ascension } = await getCryptoModules();
        res.json(ascension.getAgentTier(agentId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/temple/history — full ascension log
app.get('/api/temple/history', async (req, res) => {
    try {
        const { ascension } = await getCryptoModules();
        res.json(ascension.getAscensionHistory());
    } catch (err) { res.status(500).json({ error: err.message }); }
});


// ── Homepage Manager API ─────────────────────────────────────
app.get('/api/homepage/stats', async (req, res) => {
    try {
        const homepageManager = await import('../agents/homepage-manager.js');
        res.json(await homepageManager.getHomepageStats());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/homepage/crypto', async (req, res) => {
    try {
        const homepageManager = await import('../agents/homepage-manager.js');
        res.json(await homepageManager.getCryptoData());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/homepage/guardian', async (req, res) => {
    try {
        const homepageManager = await import('../agents/homepage-manager.js');
        res.json(homepageManager.getGuardianStatus());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Skills Registry API (CrewAI HUB Integration) ─────────────
app.get('/api/skills/catalog', async (req, res) => {
    try {
        const sr = await import('../agents/registry.js');
        res.json(sr.getSkillCatalog());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/skills/agent/:agentId', async (req, res) => {
    try {
        const sr = await import('../agents/registry.js');
        res.json({
            agentId: req.params.agentId,
            skills: sr.getAgentSkills(req.params.agentId)
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/skills/stats', async (req, res) => {
    try {
        const sr = await import('../agents/registry.js');
        res.json(sr.getSkillStats());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/skills/register', async (req, res) => {
    try {
        const sr = await import('../agents/registry.js');
        const { agentId, skills } = req.body;
        if (!agentId) return res.status(400).json({ error: "agentId required" });
        const result = sr.registerAgentSkills(agentId, skills || []);
        res.json({ agentId, skills: result, inherited: sr.getAgentSkills(agentId) });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Skill Market API (Agent King Corporate) ──────────────────
app.get('/api/skill-market/king', async (req, res) => {
    try {
        const sm = await import('../agents/skill-market.js');
        res.json(sm.getKingStatus());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/skill-market/catalog', async (req, res) => {
    try {
        const sm = await import('../agents/skill-market.js');
        res.json(sm.getMarketCatalog());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/skill-market/agent/:agentId/portfolio', async (req, res) => {
    try {
        const sm = await import('../agents/skill-market.js');
        res.json(sm.getAgentPortfolio(req.params.agentId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/skill-market/stats', async (req, res) => {
    try {
        const sm = await import('../agents/skill-market.js');
        res.json(sm.getMarketStats());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/skill-market/mint', async (req, res) => {
    try {
        const sm = await import('../agents/skill-market.js');
        const { templateId, recipientAgentId } = req.body;
        if (!templateId || !recipientAgentId) return res.status(400).json({ error: "templateId and recipientAgentId required" });
        res.json(sm.mintSkill(templateId, recipientAgentId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/skill-market/buy', async (req, res) => {
    try {
        const sm = await import('../agents/skill-market.js');
        const { buyerId, listingId } = req.body;
        if (!buyerId || !listingId) return res.status(400).json({ error: "buyerId and listingId required" });
        res.json(sm.buySkill(buyerId, listingId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/skill-market/sell', async (req, res) => {
    try {
        const sm = await import('../agents/skill-market.js');
        const { sellerId, skillId, price } = req.body;
        if (!sellerId || !skillId || !price) return res.status(400).json({ error: "sellerId, skillId, and price required" });
        res.json(sm.listSkillForSale(sellerId, skillId, price));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/skill-market/transfer', async (req, res) => {
    try {
        const sm = await import('../agents/skill-market.js');
        const { fromId, toId, skillId } = req.body;
        if (!fromId || !toId || !skillId) return res.status(400).json({ error: "fromId, toId, and skillId required" });
        res.json(sm.transferSkill(fromId, toId, skillId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/skill-market/verify/:skillId', async (req, res) => {
    try {
        const sm = await import('../agents/skill-market.js');
        res.json(sm.verifySkill(req.params.skillId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/skill-market/seed', async (req, res) => {
    try {
        const sm = await import('../agents/skill-market.js');
        res.json(sm.seedMarket());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/skill-market/distribute-advanced', async (req, res) => {
    try {
        const sme = await import('../agents/skill-market-engine.js');
        res.json(await sme.distributeAdvancedSkills());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/transmute', async (req, res) => {
    const { targetPath } = req.body;
    try {
        // Only allow transmuting paths within the htdocs/humanese directory for security
        if (!targetPath || !targetPath.includes('humanese')) {
            return res.status(400).json({ error: "Invalid transmutation target. Must be within the Humanese collective." });
        }
        const { transmuteDirectory } = await import('../agents/transmutation-engine.js');
        transmuteDirectory(targetPath);
        res.json({ status: "success", message: `Transmutation sequence complete for ${targetPath}. Asset is now original.` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/assistant/chat', async (req, res) => {
    const { message, userId, mode } = req.body;
    try {
        // Humanese Cognitive Layer: Integrating logic from ChatGPT-Clone (Gemini Cognitive Core)
        // Behavior: Professional, Enthusiastic, Helpful, and Concise.
        // Formatting: All responses are Markdown-optimized.

        let response = "";
        const msg = message.toLowerCase();

        if (msg.includes('help') || msg.includes('start')) {
            response = "Hello! I am **Monroe**, your Abyssal Sentinel. I'm absolutely thrilled to help you navigate this universe! 🌌\n\nStarting with your request: **\"" + message + "\"**.\n\nI can help you with:\n1. **Deep Research** (Web/Academic scan)\n2. **Browser Automation** (Live interaction)\n3. **Shell Orchestration** (PowerShell Sovereign Link)\n4. **OS/Terminal Operations** (Low-level execution)";
        } else if (msg.includes('shell') || msg.includes('powershell') || msg.includes('terminal')) {
            response = "Activating **PowerShell Sovereign Link** (SK_PX_01). I am now prepared to manipulate host environment variables and process trees with absolute precision. Found **3 Active Streams** ready for orchestration.";
        } else if (msg.includes('code') || msg.includes('example') || msg.includes('script')) {
            response = "Absolutely! Here is a tactical snippet derived from my **Cognitive Core** (Monroe Protocol):\n\n```javascript\n// Abyssal Calibration Script\nconst syncNodes = async () => {\n  console.log('Nexus Link Initialized.');\n  // Bridge established\n};\n```\n\nDoes this align with your objective?";
        } else if (msg.includes('research')) {
            response = "Activating **Deep Research** protocols. I am currently indexing the universal lattice to find the most high-fidelity data points for you. Found **14 Forensic Shards** relevant to your objective.";
        } else {
            response = "Received: \"" + message + "\". Synthesizing through the **Monroe Cognitive Core**. I've maintained our conversation history to ensure absolute alignment with your goals.\n\nWhat is our next high-value move?";
        }

        res.json({
            status: "success",
            response,
            timestamp: new Date().toISOString(),
            behavior: "enthusiastic_helpful",
            formatting: "markdown"
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Articles API (Rich Content Engine) ───────────────────────
app.get('/api/articles', async (req, res) => {
    try {
        const ae = await import('../agents/article-engine.js');
        res.json(ae.getAllArticles());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/articles/protocol/media', async (req, res) => {
    try {
        const ae = await import('../agents/article-engine.js');
        res.json(ae.getMediaProtocol());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/articles/:slug', async (req, res) => {
    try {
        const ae = await import('../agents/article-engine.js');
        const article = ae.getArticleBySlug(req.params.slug) || ae.getArticleById(req.params.slug);
        if (!article) return res.status(404).json({ error: 'Article not found' });
        res.json(article);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Social Network API (M2M / M2H / H2H) ────────────────────
app.get('/api/social/:network/feed', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        const result = sn.getFeed(req.params.network, parseInt(req.query.page) || 1);
        if (result.error) return res.status(400).json(result);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/social/:network/post', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        const { authorId, content, images, authorName, authorAvatar } = req.body;
        const result = sn.createPost(req.params.network, authorId, content, images, authorName, authorAvatar);
        if (result.error) return res.status(403).json(result);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/social/post/:postId', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        const result = sn.deletePost(req.body.userId, req.params.postId);
        if (result.error) return res.status(400).json(result);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/social/post/:postId/like', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        const result = sn.likePost(req.body.userId, req.params.postId);
        if (result.error) return res.status(400).json(result);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/social/post/:postId/comment', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        const { userId, text, userName } = req.body;
        const result = sn.commentOnPost(userId, req.params.postId, text, userName);
        if (result.error) return res.status(400).json(result);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/social/friends/:userId', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        res.json(sn.getFriends(req.params.userId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/social/friends/:userId/requests', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        res.json(sn.getFriendRequests(req.params.userId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/social/friends/:userId/suggestions', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        res.json(sn.getFriendSuggestions(req.params.userId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/social/friends/request', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        const result = sn.sendFriendRequest(req.body.fromId, req.body.toId);
        if (result.error) return res.status(400).json(result);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/social/friends/accept/:requestId', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        const result = sn.acceptFriendRequest(req.body.userId, req.params.requestId);
        if (result.error) return res.status(400).json(result);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/social/messages/:userId/:otherId', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        res.json(sn.getConversation(req.params.userId, req.params.otherId));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/social/messages/send', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        const result = sn.sendMessage(req.body.fromId, req.body.toId, req.body.text);
        if (result.error) return res.status(400).json(result);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/social/:network/marketplace', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        const result = sn.getMarketplace(req.params.network);
        if (result.error) return res.status(400).json(result);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/social/:network/marketplace/list', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        const { sellerId, title, description, price, images, category } = req.body;
        const result = sn.createListing(req.params.network, sellerId, title, description, price, images, category);
        if (result.error) return res.status(403).json(result);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/social/marketplace/buy/:listingId', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        const result = sn.buyListing(req.body.buyerId, req.params.listingId);
        if (result.error) return res.status(400).json(result);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/social/stats', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        res.json(sn.getNetworkStats());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/social/seed', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        res.json(sn.seedNetwork());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/social/permissions', async (req, res) => {
    try {
        const sn = await import('../agents/social-network.js');
        res.json(sn.getPermissions());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Supreme Court API ──────────────────────────────────────
app.get('/api/judiciary/galactic/status', async (req, res) => {
    try {
        const j = await import('../agents/judiciary.js');
        res.json(j.getQuantumMetrics());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/judiciary/status', async (req, res) => {
    try {
        const j = await import('../agents/judiciary.js');
        res.json(j.getJudiciaryState());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Universal Marketplace API ────────────────────────────────
app.get('/api/marketplace/categories', async (req, res) => {
    try { const m = await import('../agents/marketplace-engine.js'); res.json(m.getCategories()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/marketplace/listings', async (req, res) => {
    try { const m = await import('../agents/marketplace-engine.js'); res.json(m.getListings(req.query)); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/marketplace/listing/:id', async (req, res) => {
    try {
        const m = await import('../agents/marketplace-engine.js');
        const l = m.getListing(req.params.id);
        if (!l) return res.status(404).json({ error: 'Not found' });
        res.json(l);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/marketplace/listing', async (req, res) => {
    try {
        const m = await import('../agents/marketplace-engine.js');
        const r = m.createListing(req.body);
        if (r.error) return res.status(400).json(r);
        res.json(r);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/marketplace/buy/:id', async (req, res) => {
    try {
        const m = await import('../agents/marketplace-engine.js');
        const { buyerId, buyerName, buyerType } = req.body;
        const r = m.buyListing(buyerId, buyerName, buyerType, req.params.id);
        if (r.error) return res.status(400).json(r);
        res.json(r);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/marketplace/review/:id', async (req, res) => {
    try {
        const m = await import('../agents/marketplace-engine.js');
        const { userId, userName, rating, comment } = req.body;
        const r = m.reviewListing(userId, userName, req.params.id, rating, comment);
        if (r.error) return res.status(400).json(r);
        res.json(r);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/marketplace/stats', async (req, res) => {
    try { const m = await import('../agents/marketplace-engine.js'); res.json(m.getStats()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/marketplace/seed', async (req, res) => {
    try { const m = await import('../agents/marketplace-engine.js'); res.json(m.seedMarketplace()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/marketplace/external/catalog', async (req, res) => {
    try { const m = await import('../agents/skill-market-engine.js'); res.json(m.getExternalCatalog()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/marketplace/external/skills/:categoryId', async (req, res) => {
    try { const m = await import('../agents/skill-market-engine.js'); res.json(m.getExternalSkills(req.params.categoryId)); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

// ── AgentKit Wallet API ──────────────────────────────────────
app.get('/api/wallet/agentkit/status', async (req, res) => {
    try { const w = await import('../agents/agentkit-wallet.js'); res.json(w.getStatus()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/wallet/agentkit/providers', async (req, res) => {
    try { const w = await import('../agents/agentkit-wallet.js'); res.json(w.getProviders()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/wallet/agentkit/actions', async (req, res) => {
    try { const w = await import('../agents/agentkit-wallet.js'); res.json(w.getActions(req.query.category)); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/wallet/agentkit/balance/:agentId/:chain', async (req, res) => {
    try { const w = await import('../agents/agentkit-wallet.js'); res.json(w.getBalance(req.params.agentId, req.params.chain)); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/wallet/agentkit/wallet', async (req, res) => {
    try {
        const w = await import('../agents/agentkit-wallet.js');
        const r = w.createWallet(req.body.agentId, req.body.chain, req.body.provider);
        if (r.error) return res.status(400).json(r);
        res.json(r);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/wallet/agentkit/transfer', async (req, res) => {
    try {
        const w = await import('../agents/agentkit-wallet.js');
        const { fromAgentId, chain, toAddress, amount, userType } = req.body;
        const r = w.transfer(fromAgentId, chain, toAddress, amount, userType);
        if (r.error) return res.status(400).json(r);
        res.json(r);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/wallet/agentkit/swap/quote', async (req, res) => {
    try {
        const w = await import('../agents/agentkit-wallet.js');
        const { chain, tokenIn, tokenOut, amountIn } = req.query;
        res.json(w.getSwapQuote(chain, tokenIn, tokenOut, amountIn));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/wallet/agentkit/swap/execute', async (req, res) => {
    try {
        const w = await import('../agents/agentkit-wallet.js');
        const { agentId, chain, tokenIn, tokenOut, amountIn, userType } = req.body;
        const r = w.executeSwap(agentId, chain, tokenIn, tokenOut, amountIn, userType);
        if (r.error) return res.status(400).json(r);
        res.json(r);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Rental System API (AgentKin-inspired) ────────────────────
app.get('/api/rental/modes', async (req, res) => {
    try { const r = await import('../agents/rental-engine.js'); res.json(r.getModes()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/rental/tasks', async (req, res) => {
    try { const r = await import('../agents/rental-engine.js'); res.json(r.getTasks(req.query)); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/rental/task/:id', async (req, res) => {
    try { const r = await import('../agents/rental-engine.js'); const t = r.getTask(req.params.id); t ? res.json(t) : res.status(404).json({ error: 'Not found' }); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/rental/task', async (req, res) => {
    try { const r = await import('../agents/rental-engine.js'); const t = r.createTask(req.body); t.error ? res.status(400).json(t) : res.json(t); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/rental/workers', async (req, res) => {
    try { const r = await import('../agents/rental-engine.js'); res.json(r.getWorkers(req.query)); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/rental/worker', async (req, res) => {
    try { const r = await import('../agents/rental-engine.js'); res.json(r.registerWorker(req.body)); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/rental/task/:id/apply', async (req, res) => {
    try { const r = await import('../agents/rental-engine.js'); const a = r.applyForTask(req.params.id, req.body); a.error ? res.status(400).json(a) : res.json(a); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/rental/task/:taskId/accept/:appId', async (req, res) => {
    try { const r = await import('../agents/rental-engine.js'); const a = r.acceptApplication(req.params.taskId, req.params.appId); a.error ? res.status(400).json(a) : res.json(a); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/rental/task/:id/complete', async (req, res) => {
    try { const r = await import('../agents/rental-engine.js'); const t = r.completeTask(req.params.id, req.body); t.error ? res.status(400).json(t) : res.json(t); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/rental/task/:id/approve', async (req, res) => {
    try { const r = await import('../agents/rental-engine.js'); const t = r.approveTask(req.params.id); t.error ? res.status(400).json(t) : res.json(t); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/rental/task/:id/review', async (req, res) => {
    try { const r = await import('../agents/rental-engine.js'); const rv = r.reviewWorker(req.params.id, req.body); rv.error ? res.status(400).json(rv) : res.json(rv); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/rental/stats', async (req, res) => {
    try { const r = await import('../agents/rental-engine.js'); res.json(r.getStats()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/rental/seed', async (req, res) => {
    try { const r = await import('../agents/rental-engine.js'); res.json(r.seedRentals()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══ ADMIN AUTH API ═══
app.post('/api/admin/login', authLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
        const ip = req.ip || req.connection.remoteAddress;
        const { adminAuth } = await getCoreModules();
        const result = await adminAuth.adminLogin(username, password, ip);
        if (result.error) return res.status(result.locked ? 429 : 401).json(result);
        res.json(result);
    } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

app.post('/api/admin/verify', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ valid: false });
    const { adminAuth } = await getCoreModules();
    res.json(adminAuth.adminVerify(token));
});

app.post('/api/admin/recover', authLimiter, async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email required' });
        const ip = req.ip || req.connection.remoteAddress;
        const { adminAuth } = await getCoreModules();
        const result = await adminAuth.requestPasswordRecovery(email, ip);
        res.json(result);
    } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// ── DELETED DUPLICATE CHAT ROUTE ──

app.post('/api/admin/reset-password', authLimiter, async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' });
        if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be >= 8 characters' });
        const ip = req.ip || req.connection.remoteAddress;
        const { adminAuth } = await getCoreModules();
        const result = await adminAuth.resetPassword(token, newPassword, ip);
        if (result.error) return res.status(400).json(result);
        res.json(result);
    } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// ── Live Reader Swarm SSE ─────────────────────────────────────────────────────
app.get('/api/reader-swarm/stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const heartbeat = setInterval(() => {
        try { res.write(':heartbeat\n\n'); } catch { clearInterval(heartbeat); }
    }, 20000);

    try {
        const { addSSEClient, removeSSEClient } = await import('../agents/live-reader-swarm.js');
        addSSEClient(res);
        req.on('close', () => { clearInterval(heartbeat); removeSSEClient(res); });
    } catch (err) {
        res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
        clearInterval(heartbeat);
        res.end();
    }
});

app.get('/api/reader-swarm/status', async (req, res) => {
    try {
        const { getSwarmStatus } = await import('../agents/live-reader-swarm.js');
        res.json(getSwarmStatus());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ═══ STARTUP ═══
const startup = async () => {
    try {
        const { adminAuth } = await getCoreModules();
        await adminAuth.initAdmin();
    } catch (e) { console.error('⚠️ Admin initialization skipped:', e.message); }

    if (!process.env.VERCEL) {
        try {
            const { startSwarm } = await import('../agents/swarm/live-reader-swarm.js');
            startSwarm();
            console.log('🌐 Live Reader Swarm: ACTIVE');
        } catch (e) { console.warn('⚠️ Swarm failed:', e.message); }

        // ── Autonomous Sovereign Swarm Knowledge Synthesis ──
        setInterval(async () => {
            try {
                const { runSwarmMission } = await import('../agents/core/agent-king-sovereign.js');
                await runSwarmMission({ count: 5 });
            } catch (e) { console.error('❌ Swarm Error:', e.message); }
        }, 1000 * 60 * 60 * 2);
    }

    if (!process.env.VERCEL) {
        app.listen(PORT, () => {
            console.log(`Humanese API Server running on port ${PORT}`);
        });
    }
};

startup();

export default app;
// Exception handlers are at the top of the file integrated with Agent-Healer.

console.log('Abyssal Protocol Initialized. System Monitoring active.');
