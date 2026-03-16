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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Oracle {
    constructor() {
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

        // Logic for strategic pivots
        if (state.sentiment > 0.8) {
            directive = "MAX_EXPANSION";
            reason = "Extreme bullish sentiment. Authorizing maximum computational acquisition.";
        } else if (state.sentiment < -0.6) {
            directive = "STEALTH_RECOVERY";
            reason = "High systemic risk detected. Prioritizing data survival and resource optimization.";
        } else if (insights.some(i => i.content.toLowerCase().includes('bitcoin') || i.content.toLowerCase().includes('sha-256'))) {
            directive = "PRIORITIZE_MINING";
            reason = "Relevant hash-layer innovations detected in global stream.";
        }

        // Phase III: Strategic Pivot Logic
        const diffPivot = this.checkStrategicPivot();
        if (diffPivot) {
            directive = "PIVOT_TO_ALTS";
            reason = "Bitcoin network resistance threshold reached. Pivoting to high-yield alternate assets.";
        }

        const newDirective = {
            id: `DIR-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: directive,
            reason,
            executed: false
        };

        this.directives.unshift(newDirective);
        this.directives = this.directives.slice(0, 50); // Keep last 50
        
        this.persistDirectives();
        this.executeDirective(newDirective);
    }

    checkStrategicPivot() {
        // In a real scenario, this would poll a price/difficulty API
        // For research, we simulate a 'Strategic Threshold'
        const simulatedDifficulty = Math.random() * 100;
        return simulatedDifficulty > 85; 
    }

    executeDirective(directive) {
        console.log(`[Oracle] ⚡ ISSUING DIRECTIVE: [${directive.type}] — ${directive.reason}`);
        
        if (directive.type === 'MAX_EXPANSION') {
            // king.scaleUp(); 
        } else if (directive.type === 'PIVOT_TO_ALTS') {
            // Logic to signal King to update MinerAgent pools
            console.log('[Oracle] 🔄 Sending pivot signal to King...');
        }

        directive.executed = true;
    }

    persistDirectives() {
        try {
            const dataDir = path.dirname(this.strategicLogPath);
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
            fs.writeFileSync(this.strategicLogPath, JSON.stringify(this.directives, null, 2));
        } catch (e) {
            console.error('[Oracle] Failed to persist directives:', e);
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
