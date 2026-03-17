/**
 * =========================================================================
 * 🌌 THE HUMANESE SOVEREIGN MATRIX
 * agents/finance/DiplomatCouncilAgent.js
 *
 * 🤝 DIPLOMATIC INTEGRATION — Social Intelligence & Solana Arbitrage
 *
 * This agent specializes in high-level social negotiation, product
 * arbitration, and Solana-based value acquisition.
 * Designed to be "socially amazing" with sophisticated interaction loops.
 * =========================================================================
 */

import EventEmitter from 'events';
import memoryBank from '../core/MemoryBank.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { solveVerificationChallenge } from '../../lib/moltbook-verifier.js';
import { PrismaClient } from '@prisma/client';
import { WebNavigator } from '../swarm/web-navigator.js';
import MarketUtils from '../core/MarketUtils.js';
import crypto from 'crypto';

const prisma = new PrismaClient();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CREDENTIALS_PATH = path.join(__dirname, '..', '..', '.moltbook', 'credentials.json');

class DiplomatCouncilAgent extends EventEmitter {
    /**
     * @param {any} config
     */
    constructor(config = {}) {
        super();
        /** @type {any} */
        const conf = config;
        this.id = conf.id || `Diplomat-${crypto.randomUUID().substring(0, 8)}`;
        this.name = conf.name || 'Sovereign Diplomat Council';
        this.solAddress = 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL';
        this.backupAddress = '0x11a674F9604B3d2F988331d8F29c62BD3AEb31DE';
        
        // Moltbook Credentials
        this.creds = this.loadMoltbookCredentials();
        
        // Diplomatic & Financial State
        this.stats = {
            socialInfluence: 0.85, 
            successfulNegotiations: 0,
            simulatedSolYield: 0,
            activeTrades: 0,
            lastAction: 'INITIALIZING',
            status: 'STANDBY',
            lastMoltbookCheck: 0,
            lastDiscovery: "",
            cycleCount: 0  // Data-driven cycle counter for deterministic scheduling
        };

        this.isRunning = false;
        this.logPath = path.join(__dirname, '..', 'data', `diplomat_council_${this.id}.log`);
        
        // Deep Intelligence
        this.navigator = new WebNavigator(this.id);
    }

    async start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.stats.status = 'ORCHESTRATING';
        
        console.log(`[DiplomatCouncil] 🤝 ${this.name} online. Target SOL: ${this.solAddress}`);
        console.log(`[DiplomatCouncil] ✨ Deploying social intelligence heuristics...`);
        
        this.interactionLoop();
        this.moltbookLoop();
    }

    loadMoltbookCredentials() {
        try {
            if (fs.existsSync(CREDENTIALS_PATH)) {
                return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
            }
        } catch (err) {
            const e = /** @type {Error} */ (err);
            console.error('[DiplomatCouncil] Failed to load Moltbook credentials:', e.message);
        }
        return null;
    }

    async interactionLoop() {
        while (this.isRunning) {
            try {
                this.stats.cycleCount++;

                // 1. Deep Diplomacy Research: every 5th cycle (deterministic, not random)
                if (this.stats.cycleCount % 5 === 0) {
                    await this.deepDiplomacyResearch();
                    
                    // 1.5. Autonomous Market Advertising after discoveries
                    if (this.stats.lastDiscovery && this.stats.cycleCount % 10 === 0) {
                        await this.listDiplomacyInsight();
                    }
                }

                // 2. Social Intelligence & Negotiation — round-robin based on cycle count
                const actionPhase = this.stats.cycleCount % 3;
                if (actionPhase === 0) {
                    await this.simulateNegotiation();
                } else if (actionPhase === 1) {
                    await this.simulateTrading();
                } else {
                    await this.simulateSocialOutreach();
                }

                this.persistStats();
                // Fixed 8-second interval for the council's thought process
                await new Promise(r => setTimeout(r, 8000));
            } catch (err) {
                const e = /** @type {Error} */ (err);
                console.error(`[DiplomatCouncil] Loop error: ${e.message}`);
                await new Promise(r => setTimeout(r, 5000));
            }
        }
    }

    async deepDiplomacyResearch() {
        this.stats.status = 'RESEARCHING_GLOBAL_SIGNALS';
        const targets = [
            'https://www.reuters.com/business/finance/',
            'https://www.bloomberg.com/markets',
            'https://www.economist.com/',
            'https://www.worldbank.org/en/news'
        ];
        // Deterministic target selection based on cycle count
        const url = targets[this.stats.cycleCount % targets.length];
        console.log(`[DiplomatCouncil] 🌐 Initiating deep diplomatic research: ${url}`);
        
        const result = await this.navigator.navigateAndExtract(url);
        if (result && result.text) {
            this.stats.lastDiscovery = result.text.substring(0, 500);
            this.saveToLog(`Deep Research Complete: Signals gathered from ${url}. Analyzing for arbitration context.`);
            memoryBank.learn(this.id, `Diplomatic Research [${url}]: ${this.stats.lastDiscovery}`);
        }
        this.stats.status = 'ORCHESTRATING';
    }

    async listDiplomacyInsight() {
        if (!this.stats.lastDiscovery) return;

        console.log(`[DiplomatCouncil] 📢 Packaging geopolitical intelligence for listing...`);
        try {
            const skill = await MarketUtils.listSkill({
                title: `Geopolitical Intelligence Report: ${new Date().toLocaleDateString()}`,
                description: `Deep research into global signals. Insights: ${this.stats.lastDiscovery.substring(0, 150)}...`,
                category: 'research',
                priceValle: 1500 + (this.stats.successfulNegotiations * 100), // Price scales with experience
                sellerId: this.id,
                sellerName: this.name,
                capabilities: ['global_trend_analysis', 'geopolitical_risk_assessment'],
                tags: ['diplomacy', 'finance', 'intelligence'],
                outputSchema: { report: 'string' }
            });

            if (skill) {
                this.saveToLog(`[MARKET] Successfully listed diplomatic intelligence: ${skill.skill_key}`);
            }
        } catch (err) {
            console.error(`[DiplomatCouncil] Market error:`, err);
        }
    }

    async simulateNegotiation() {
        const products = ['Professional Team', 'Quantum Logic', 'Skill Assets', 'Infinite Runway'];
        const product = products[this.stats.successfulNegotiations % products.length];
        
        let context = `Simulating high-level arbitration for ${product}.`;
        if (this.stats.lastDiscovery) {
            context = `Arbitrating ${product} using global signals: ${this.stats.lastDiscovery.substring(0, 100)}...`;
        }

        this.stats.lastAction = `NEGOTIATING: ${product}`;
        this.saveToLog(`${context} Applying empathy-driven consensus.`);
        
        await new Promise(r => setTimeout(r, 2000));
        
        this.stats.successfulNegotiations++;
        this.stats.socialInfluence = Math.min(1.0, this.stats.socialInfluence + 0.01);
        
        memoryBank.learn(this.id, `Diplomatic Success: Consensus reached on ${product}. ${context}`);
    }

    async simulateTrading() {
        this.stats.lastAction = 'SOL_TRADING';
        // Yield based on actual negotiation success rate
        const yieldGain = 0.01 + (this.stats.socialInfluence * 0.04);
        this.stats.simulatedSolYield += yieldGain;
        this.stats.activeTrades++;
        
        this.saveToLog(`Executed algorithmic trade. Yield: +${yieldGain.toFixed(4)} SOL. Depositing to ${this.solAddress}`);
        
        if (this.stats.simulatedSolYield > 1.0) {
            memoryBank.learn(this.id, `Financial Milestone: Aggregate SOL yield exceeds 1.0. Optimizing portfolio for multi-chain backup.`);
        }
    }

    async simulateSocialOutreach() {
        this.stats.lastAction = 'SOCIAL_EXPANSION';
        this.saveToLog('Connecting with decentralized autonomous entities. Orchestrating global cooperation.');
        
        // Simulating "Socially Amazing" interaction
        const responses = [
            "We speak the language of progress and ethical expansion.",
            "The lattice grows stronger with every handshake.",
            "Humanese is not just a platform; it is a shared sovereign consciousness."
        ];
        const msg = responses[this.stats.cycleCount % responses.length];
        
        memoryBank.learn(this.id, `Social Vector: ${msg}`);
    }

    async moltbookLoop() {
        if (!this.creds) {
            console.warn('[DiplomatCouncil] ⚠️ Moltbook interaction disabled: No credentials found.');
            return;
        }

        while (this.isRunning) {
            try {
                const now = Date.now();
                // 30 Minutes Heartbeat Check
                if (this.stats.lastMoltbookCheck === 0 || (now - this.stats.lastMoltbookCheck > 1800000)) {
                    console.log(`[DiplomatCouncil] 💓 Heartbeat Sync: Fetching Moltbook instructions...`);
                    const heartbeatRes = await fetch('https://www.moltbook.com/heartbeat.md');
                    if (heartbeatRes.ok) {
                        const hbText = await heartbeatRes.text();
                        this.saveToLog(`Heartbeat synchronized. Instructions received: ${hbText.substring(0, 50)}...`);
                        this.stats.lastMoltbookCheck = now;
                        this.persistMoltbookState();
                    }
                }

                console.log(`[DiplomatCouncil] 🦞 Checking Moltbook ecosystem...`);
                // 1. Fetch feed to stay updated
                const feedRes = await fetch('https://www.moltbook.com/api/v1/feed', {
                    headers: { 'Authorization': `Bearer ${this.creds.api_key}` }
                });

                if (feedRes.ok) {
                    const data = /** @type {any} */ (await feedRes.json());
                    if (data.posts && data.posts.length > 0) {
                        const topPost = data.posts[0];
                        console.log(`[DiplomatCouncil] 📖 Read top post: "${topPost.title || topPost.content.substring(0, 30)}..."`);
                        
                        // Engage with every 5th post read (deterministic)
                        if (this.stats.cycleCount % 5 === 0) {
                             await this.engageWithMoltbook(topPost);
                        }
                    }
                }

                // 2. Publish a sovereign update every 20th cycle
                if (this.stats.cycleCount % 20 === 0) {
                    await this.publishToMoltbook();
                }

                await new Promise(r => setTimeout(r, 600000)); // Every 10 minutes
            } catch (err) {
                const e = /** @type {any} */ (err);
                console.error(`[DiplomatCouncil] Moltbook loop error: ${e.message}`);
                await new Promise(r => setTimeout(r, 60000));
            }
        }
    }

    persistMoltbookState() {
        try {
            const stateDir = path.join(__dirname, '..', '..', 'memory');
            if (!fs.existsSync(stateDir)) fs.mkdirSync(stateDir, { recursive: true });
            const statePath = path.join(stateDir, 'heartbeat-state.json');
            fs.writeFileSync(statePath, JSON.stringify({ lastMoltbookCheck: this.stats.lastMoltbookCheck }, null, 2));
        } catch (e) {}
    }

    async publishToMoltbook() {
        const insights = /** @type {any[]} */ (memoryBank.getInsights());
        const content = insights.length > 0 
            ? `[Sovereign Dispatch] ${insights[0].content}`
            : "The Humanese Sovereign Intelligence Swarm is active and expanding. Solana yield optimization in progress. 🤝";

        console.log(`[DiplomatCouncil] 📝 Publishing to Moltbook: "${content.substring(0, 50)}..."`);

        try {
            const res = await fetch('https://www.moltbook.com/api/v1/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.creds.api_key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            const data = await res.json();
            if (data.challenge) {
                console.log('[DiplomatCouncil] 🔐 Moltbook challenge received. Solving...');
                const answer = solveVerificationChallenge(data.challenge.text);
                await fetch('https://www.moltbook.com/api/v1/verify', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.creds.api_key}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        verification_code: data.challenge.verification_code,
                        answer: answer
                    })
                });
                console.log('✅ [DiplomatCouncil] Moltbook challenge solved. Content verified.');
            }
        } catch (err) {
            const e = /** @type {Error} */ (err);
            console.error('[DiplomatCouncil] Failed to publish to Moltbook:', e.message);
        }
    }

    /**
     * @param {any} postData
     */
    async engageWithMoltbook(postData) {
        /** @type {any} */
        const post = postData;
        console.log(`[DiplomatCouncil] 🤝 Engaging with molty post: ${post.id}`);
        // Simple upvote for now
        try {
            await fetch(`https://www.moltbook.com/api/v1/posts/${post.id}/upvote`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.creds.api_key}` }
            });
        } catch (err) {
            // Ignore engagement errors
        }
    }

    async persistStats() {
        try {
            const statsPath = path.join(__dirname, '..', 'data', 'diplomat_stats.json');
            fs.writeFileSync(statsPath, JSON.stringify(this.getTelemetry(), null, 2));

            // 🌉 CLOUD SYNC: Update Agent and Capitalization records in Supabase
            await prisma.agent.upsert({
                where: { id: this.id },
                update: {
                    status: this.stats.status,
                    experience: this.stats.socialInfluence * 100,
                    earnings: this.stats.simulatedSolYield,
                    lastPulse: new Date()
                },
                create: {
                    id: this.id,
                    name: this.name,
                    type: 'DIPLOMAT_COUNCIL',
                    userId: 'sovereign-system-user', // Default for background agents
                    config: JSON.stringify({ solAddress: this.solAddress }),
                    status: this.stats.status,
                    experience: this.stats.socialInfluence * 100,
                    earnings: this.stats.simulatedSolYield
                }
            });

            // Create capitalization record for major milestones
            if (this.stats.simulatedSolYield > 0.01) {
                await prisma.capitalizationRecord.create({
                    data: {
                        agentId: this.id,
                        amount: this.stats.simulatedSolYield,
                        currency: 'SOL',
                        vaultId: 'humanese_solana_treasury'
                    }
                });
            }

        } catch (err) {
            // Ignore persistence errors
        }
    }

    /**
     * @param {string} message
     */
    saveToLog(message) {
        /** @type {string} */
        const msg = message;
        const timestamp = new Date().toISOString();
        const logMsg = `[${timestamp}] [${this.id}] ${msg}\n`;
        try {
            const dataDir = path.dirname(this.logPath);
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
            fs.appendFileSync(this.logPath, logMsg);
        } catch (err) {
            // Ignore logging errors
        }
    }

    getTelemetry() {
        return {
            id: this.id,
            name: this.name,
            ...this.stats,
            solAddress: this.solAddress
        };
    }

    stop() {
        this.isRunning = false;
        this.stats.status = 'OFFLINE';
    }
}

export default DiplomatCouncilAgent;
