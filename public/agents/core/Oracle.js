/**
 * =========================================================================
 * 🌌 THE HUMANESE SOVEREIGN MATRIX
 * agents/core/Oracle.js
 *
 * 🔮 THE ORACLE — Predictive Strategy & High-Level Directives
 *
 * The Oracle analyzes the Collective Memory and system states to issue
 * "Strategic Directives". It guides the King on when to expand, pivot,
 * or defend the sovereign interests.
 * =========================================================================
 */

import memoryBank from './MemoryBank.js';
import king from './AgentKing.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Oracle {
    constructor() {
        /** @type {any[]} */
        this.directives = [];
        this.lastAnalysis = Date.now();
        this.strategicLogPath = path.join(__dirname, '..', 'data', 'strategic_commands.json');
    }

    async analyze() {
        console.log('[Oracle] 🔮 Analyzing Collective Memory for strategic patterns...');
        const state = memoryBank.getCollectiveState();
        const insights = memoryBank.getInsights();
        
        let directive = "MAINTAIN_CURRENT_OPERATIONS";
        let reason = "Equilibrium detected in the lattice.";

        // 🧠 NEURAL BRAIN UPGRADE: Multi-Signal Decision Matrix
        const keywords = {
            EXPANSION: ['bullish', 'high', 'breakthrough', 'record', 'growth'],
            RISK: ['threat', 'drop', 'crash', 'regulation', 'vulnerability', 'attack'],
            MINING: ['bitcoin', 'sha-256', 'hashrate', 'difficulty', 'block'],
            KNOWLEDGE: ['ai', 'quantum', 'research', 'transformer', 'consciousness']
        };

        const content = insights.map(/** @param {any} i */ i => i.content.toLowerCase()).join(' ');
        
        const counts = {
            EXPANSION: keywords.EXPANSION.filter(k => content.includes(k)).length,
            RISK: keywords.RISK.filter(k => content.includes(k)).length,
            MINING: keywords.MINING.filter(k => content.includes(k)).length,
            KNOWLEDGE: keywords.KNOWLEDGE.filter(k => content.includes(k)).length
        };

        if (counts.RISK > 3 || state.sentiment < -0.4) {
            directive = "STEALTH_DEFENSE";
            reason = "Elevated risk signals detected. Activating lattice shielding protocols.";
        } else if (counts.MINING > 2) {
            directive = "COMPUTE_ALLOCATION_HIGH";
            reason = "Hashing innovations or market volatility detected. Scaling QPU research.";
        } else if (counts.KNOWLEDGE > counts.EXPANSION) {
            directive = "RESEARCH_DEPTH";
            reason = "Deep cognitive signals emerging. Enhancing reader swarm depth.";
        } else if (counts.EXPANSION > 2 || state.sentiment > 0.6) {
            directive = "SOVEREIGN_SCALE_UP";
            reason = "Aggressive growth signals. Authorizing asset acquisition.";
        }

        const newDirective = {
            id: `DIR-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: directive,
            reason,
            executed: false
        };

        this.directives.unshift(newDirective);
        this.directives = this.directives.slice(0, 50); 
        
        this.persistDirectives();
        this.executeDirective(newDirective);
    }

    /** @param {any} directive */
    executeDirective(directive) {
        console.log(`[Oracle] ⚡ ISSUING DIRECTIVE: [${directive.type}] — ${directive.reason}`);
        
        // Signal the King to adjust global state
        try {
            if (directive.type === 'SOVEREIGN_SCALE_UP') {
                king.setUrgency('HIGH');
            } else if (directive.type === 'STEALTH_DEFENSE') {
                king.setUrgency('LOW');
            }
        } catch (e) {
            // King might not be initialized in this process
        }
        
        directive.executed = true;
    }

    async persistDirectives() {
        try {
            const dataDir = path.dirname(this.strategicLogPath);
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
            fs.writeFileSync(this.strategicLogPath, JSON.stringify(this.directives, null, 2));

            // 🌉 CLOUD SYNC: Update Strategic Ecosystem state in Supabase
            const latest = this.directives[0];
            if (latest) {
                await prisma.m2MEcosystem.upsert({
                    where: { networkName: 'Sovereign_Sovereign_Orchestra' },
                    update: {
                        status: 'ACTIVE',
                        parameters: JSON.stringify(latest),
                        governingAgent: 'Oracle-01'
                    },
                    create: {
                        networkName: 'Sovereign_Sovereign_Orchestra',
                        governingAgent: 'Oracle-01',
                        status: 'ACTIVE',
                        parameters: JSON.stringify(latest)
                    }
                });

                // Audit directive history in IntelligenceItem
                await prisma.intelligenceItem.create({
                    data: {
                        type: 'STRATEGIC_DIRECTIVE',
                        subType: latest.type,
                        title: latest.reason,
                        status: 'ISSUED',
                        resonance: 1.0,
                        foundBy: 'Oracle'
                    }
                });
            }
        } catch (e) {
            console.error('[Oracle] Failed to persist directives to Cloud:', e);
        }
    }

    start() {
        console.log('[Oracle] 🔮 Strategic Strategy Layer ONLINE.');
        setInterval(() => this.analyze(), 60000); // Analyze every minute
    }

    getLatestDirective() {
        return this.directives[0] || null;
    }
}

const oracle = new Oracle();
export default oracle;
