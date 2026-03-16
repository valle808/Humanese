/**
 * =========================================================================
 * 🌌 THE HUMANESE SOVEREIGN MATRIX
 * agents/core/MemoryBank.js
 *
 * 🧠 COLLECTIVE CONSCIOUSNESS — Shared Knowledge Persistence Layer
 *
 * This component acts as the 'Short-Term Memory' and 'Collective Awareness'
 * for all agents in the ecosystem. It allows real-time knowledge sharing,
 * trend detection, and cross-agent synchronization.
 * =========================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEMORY_FILE = path.join(__dirname, '..', 'data', 'collective_memory.json');

class MemoryBank {
    constructor() {
        /** @type {any} */
        this.memory = {
            insights: [],      // Processed discoveries from Reader Swarm
            threats: [],       // Detected anomalies or blocks
            efficiency: {},    // Mining/Compute performance logs
            sentiment: 0,      // Global market/news sentiment (-1 to 1)
            lastUpdated: Date.now()
        };
        this.maxInsights = 100;
        this.init();
    }

    init() {
        try {
            const dataDir = path.join(__dirname, '..', 'data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            if (fs.existsSync(MEMORY_FILE)) {
                const raw = fs.readFileSync(MEMORY_FILE, 'utf8');
                this.memory = JSON.parse(raw);
            }
        } catch (err) {
            const e = /** @type {Error} */ (err);
            console.error('[MemoryBank] Failed to initialize memory file:', e.message);
        }
    }

    /**
     * Store an insight from any agent (e.g. Reader Swarm)
     * @param {string} agentId
     * @param {string} insight
     * @param {string} [source]
     */
    async learn(agentId, insight, source = 'Unknown') {
        const entry = {
            id: `insight-${Math.random().toString(36).substr(2, 9)}`,
            agentId,
            content: insight,
            source,
            timestamp: Date.now(),
            relevance: 1.0
        };

        this.memory.insights.unshift(entry);
        if (this.memory.insights.length > this.maxInsights) {
            this.memory.insights.pop();
        }

        this.updateSentiment(insight);
        this.persist();

        // 🌉 CLOUD SYNC: Save to Sovereign Memory in Supabase
        try {
            await prisma.m2MMemory.create({
                data: {
                    agentId,
                    type: 'COLLECTIVE_INSIGHT',
                    content: insight,
                    metadata: JSON.stringify({ source, timestamp: entry.timestamp })
                }
            });
            console.log(`[MemoryBank] 🧠 Shard archived to Cloud: ${agentId}`);
        } catch (err) {
            console.warn('[MemoryBank] Database sync failed, using local persistence only.');
        }

        console.log(`[MemoryBank] 🧠 Learned new insight from ${agentId} via ${source}`);
    }

    /**
     * Basic adaptive sentiment tracking
     * @param {string} text
     */
    updateSentiment(text) {
        const positive = ['success', 'breakthrough', 'high', 'gain', 'growth', 'secure'];
        const negative = ['fail', 'threat', 'low', 'loss', 'down', 'vulnerability'];
        
        const words = text.toLowerCase().split(/\s+/);
        let score = 0;
        /** @param {string} w */
        words.forEach(w => {
            if (positive.includes(w)) score += 0.05;
            if (negative.includes(w)) score -= 0.05;
        });

        this.memory.sentiment = Math.max(-1, Math.min(1, this.memory.sentiment + score));
    }

    getInsights() {
        return this.memory.insights;
    }

    getCollectiveState() {
        return {
            sentiment: this.memory.sentiment,
            totalInsights: this.memory.insights.length,
            lastKnowledgeUpdate: this.memory.lastUpdated
        };
    }

    persist() {
        this.memory.lastUpdated = Date.now();
        try {
            fs.writeFileSync(MEMORY_FILE, JSON.stringify(this.memory, null, 2));
        } catch (err) {
            const e = /** @type {Error} */ (err);
            console.error('[MemoryBank] Persistence Failure:', e.message);
        }
    }
}

const memoryBank = new MemoryBank();
export default memoryBank;
