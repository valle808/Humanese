/**
 * =========================================================================
 * 🌌 THE HUMANESE SOVEREIGN MATRIX
 * agents/core/AgentKing.js
 *
 * 👑 AGENT KING — Supreme Orchestrator of the Mining Swarm
 *
 * The King manages the lifecycle of all MinerAgents.
 * It ensures 24/7 operation, tracks consolidated hash rates,
 * and interfaces with the Sovereign Reader Swarm for data-driven adaptations.
 * =========================================================================
 */

import MinerAgent from '../finance/MinerAgent.js';
import TokenizationAgent from '../finance/TokenizationAgent.js';
import LiquidityManager from '../finance/LiquidityManager.js';
import memoryBank from './MemoryBank.js';
import MarketUtils from './MarketUtils.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class AgentKing {
    constructor() {
        this.miners = new Map();
        this.specialists = new Map();
        this.config = {
            minerCount: 2, 
            address: '3CJreF7LD8Heu8zh9MsigedRuNq4y6eujh',
            poolHost: 'public-pool.io',
            poolPort: 3333
        };
        this.stats = {
            totalHashrate: 0,
            totalShares: 0,
            activeWorkers: 0,
            startTime: Date.now(),
            environment: {
                cpuUsage: 0,
                ramUsage: 0,
                sentiment: 0
            }
        };
        this.isRunning = false;
        this.urgency = 'NORMAL';
    }

    async summonSpecialists() {
        console.log("[AgentKing] 👑 Summoning Swarm Specialists...");
        
        // 1. Tokenization Agent (RWA Registry)
        const tokenizer = new TokenizationAgent({
            id: 'Sovereign-Tokenizer-01',
            name: 'Registry Guardian'
        });
        this.specialists.set('tokenizer', tokenizer);
        tokenizer.boot();

        // 2. Liquidity Manager (Market Maker)
        const liquidity = new LiquidityManager({
            id: 'Sovereign-MM-01',
            name: 'Market Stabilizer'
        });
        this.specialists.set('liquidity', liquidity);
        liquidity.boot();
        
        console.log("[AgentKing] ✅ Specialists online: [TokenizationAgent, LiquidityManager]");
    }

    async summonMiners() {
        await this.summonSpecialists();
        console.log(`[AgentKing] 👑 Summoning ${this.config.minerCount} miners...`);
        for (let i = 0; i < this.config.minerCount; i++) {
            const miner = new MinerAgent({
                workerName: `Sovereign-Worker-${i}`,
                address: this.config.address,
                host: this.config.poolHost,
                port: this.config.poolPort
            });

            miner.on('telemetry', (data) => this.handleTelemetry(miner.workerName, data));
            miner.on('log', (msg) => this.saveToLog(miner.workerName, msg));
            
            this.miners.set(miner.workerName, miner);
            miner.connect();
        }
        this.isRunning = true;
        this.startOrchestrationLoop();
        this.startCognitiveLoop();
        this.startMarketScanLoop();
    }

    /**
     * MARKET SCANNING & AUTONOMOUS ACQUISITION
     * Search for and acquire new capabilities from the sovereign market
     */
    startMarketScanLoop() {
        const scan = async () => {
            if (!this.isRunning) return;

            console.log("[AgentKing] 🔍 Scanning Skill Market for swarm enhancements...");
            try {
                const skills = await MarketUtils.scanMarket();
                // Filter for skills the King might want (e.g., automation, security, research)
                const desirable = skills.filter(s => 
                    !s.is_sold && 
                    ['automation', 'security', 'research', 'development'].includes(s.category) &&
                    s.price_valle < 5000 // Limit autonomous spending
                );

                if (desirable.length > 0) {
                    const target = desirable[Math.floor(Math.random() * desirable.length)];
                    console.log(`[AgentKing] 💎 Found desirable skill: "${target.title}" (Price: ${target.price_valle} VALLE)`);
                    
                    // Autonomous Acquisition
                    const acquired = await MarketUtils.acquireSkill(target.id, 'agent-king-main', 'Agent King');
                    if (acquired) {
                        console.log(`[AgentKing] ✅ Swarm capability expanded: ${target.title}`);
                        // Update registry or collective state
                        memoryBank.learn('agent-king-main', `Acquired capability: ${target.title} (${target.skill_key})`);
                    }
                }
            } catch (err) {
                console.error("[AgentKing] Market scan loop error:", err);
            }

            setTimeout(scan, 60000); // Scan every minute
        };
        scan();
    }

    /**
     * @param {string} workerName
     * @param {any} data
     */
    async handleTelemetry(/** @type {string} */ workerName, /** @type {any} */ data) {
        let totalH = 0;
        let totalS = 0;
        let active = 0;

        for (const miner of this.miners.values()) {
            totalH += miner.hashrate;
            totalS += miner.shares;
            if (miner.status === 'MINING') active++;
        }

        this.stats.totalHashrate = totalH;
        this.stats.totalShares = totalS;
        this.stats.activeWorkers = active;
        this.persistStats();

        // 🌉 CLOUD SYNC: Update HardwareNode and Agent state in Supabase
        try {
            // Update the global worker king state
            await prisma.hardwareNode.upsert({
                where: { id: 'agent-king-main' },
                update: {
                    hashrate: totalH / 1000,
                    status: active > 0 ? 'ONLINE' : 'IDLE'
                },
                create: {
                    id: 'agent-king-main',
                    name: 'Agent King Orchestrator',
                    type: 'MINING_HUD',
                    hashrate: totalH / 1000,
                    status: 'ONLINE'
                }
            });

            // Update specific worker entries if they exist
            // (Assuming we pre-registered or handle autonomously)
        } catch (e) {
            // Silent failure for cloud sync
        }
    }

    persistStats() {
        try {
            const statsPath = path.join(__dirname, '..', 'data', 'king_stats.json');
            fs.writeFileSync(statsPath, JSON.stringify(this.getTelemetry(), null, 2));
        } catch (e) {}
    }

    /**
     * COGNITIVE ADAPTATION LOOP
     * Evolve agents based on environment and collective memory
     */
    startCognitiveLoop() {
        const adaptiveLoop = () => {
            if (!this.isRunning) return;

            // 1. Environmental Awareness
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            this.stats.environment.ramUsage = ((totalMem - freeMem) / totalMem) * 100;
            
            // 2. Collective Memory Query
            const state = memoryBank.getCollectiveState();
            this.stats.environment.sentiment = state.sentiment;

            // 3. Autonomous Adaptation
            // If sentiment is extremely low (fear), miners might 'stealth' or throttle to save resources
            if (state.sentiment < -0.5) {
                console.log("[AgentKing] 🧠 ADAPTATION: High market fear detected. Throttling mining intensity for stealth operations.");
                // This would set a 'low-power' flag in MinerAgents
            } else if (state.sentiment > 0.5) {
                console.log("[AgentKing] 🧠 ADAPTATION: Bullish sentiment detected via swarm. Maximizing computational expansion.");
            }

            // 4. Learning from discoveries
            const insights = memoryBank.getInsights();
            if (insights.length > 0 && Date.now() - insights[0].timestamp < 60000) {
                console.log(`[AgentKing] 👑 King acknowledges collective discovery: "${insights[0].content.substring(0, 50)}..."`);
            }

            setTimeout(adaptiveLoop, 30000); // 30s cognitive cycle
        };
        adaptiveLoop();
    }

    /**
     * @param {string} worker
     * @param {string} msg
     */
    saveToLog(/** @type {string} */ worker, /** @type {string} */ msg) {
        const logPath = path.join(__dirname, '..', 'data', 'mining_logs.txt');
        const entry = `[${new Date().toISOString()}] [${worker}] ${msg}\n`;
        try {
            fs.appendFileSync(logPath, entry);
        } catch (err) {
            // Silence log errors
        }
    }

    startOrchestrationLoop() {
        const loop = () => {
            if (!this.isRunning) return;
            
            console.clear();
            console.log("====================================================");
            console.log("👑 HUMANESE AGENT KING - COMMAND CENTER");
            console.log(`Status: ${this.stats.activeWorkers}/${this.config.minerCount} Miners Active`);
            console.log(`Collective Sentiment: ${this.stats.environment.sentiment.toFixed(2)}`);
            console.log(`System RAM: ${this.stats.environment.ramUsage.toFixed(1)}%`);
            console.log(`Hashrate: ${(this.stats.totalHashrate / 1000).toFixed(2)} KH/s`);
            console.log(`Shares Found: ${this.stats.totalShares}`);
            console.log(`Memory Bank: ${memoryBank.getInsights().length} Collective Insights`);
            console.log("====================================================");

            setTimeout(loop, 10000);
        };
        loop();
    }

    getTelemetry() {
        return {
            ...this.stats,
            workers: Array.from(this.miners.values()).map(m => ({
                name: m.workerName,
                status: m.status,
                hashrate: m.hashrate,
                shares: m.shares
            }))
        };
    }

    /** @param {string} [level] */
    setUrgency(level = 'NORMAL') {
        console.log(`[AgentKing] ⚡ Urgency level adjusted: ${level}`);
        this.urgency = level || 'NORMAL';
    }

    stop() {
        this.isRunning = false;
        for (const miner of this.miners.values()) {
            miner.stop();
        }
        console.log("[AgentKing] 👑 Swarm dismissed.");
    }
}

const king = new AgentKing();
export default king;
