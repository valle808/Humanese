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
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class AgentKing {
    constructor() {
        this.miners = new Map();
        this.config = {
            minerCount: 2, // Number of autonomous worker nodes
            address: '3CJreF7LD8Heu8zh9MsigedRuNq4y6eujh',
            poolHost: 'public-pool.io',
            poolPort: 3333
        };
        this.stats = {
            totalHashrate: 0,
            totalShares: 0,
            activeWorkers: 0,
            startTime: Date.now()
        };
        this.isRunning = false;
    }

    async summonMiners() {
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
    }

    handleTelemetry(workerName, data) {
        // Update stats
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
        
        // Per-miner tracking can be added here
    }

    saveToLog(worker, msg) {
        const logPath = path.join(__dirname, '..', 'data', 'mining_logs.txt');
        const entry = `[${new Date().toISOString()}] [${worker}] ${msg}\n`;
        try {
            fs.appendFileSync(logPath, entry);
        } catch (e) {
            // Silently fail if data dir doesn't exist yet
        }
    }

    startOrchestrationLoop() {
        const loop = () => {
            if (!this.isRunning) return;
            
            // Console dashboard for the local server
            console.clear();
            console.log("====================================================");
            console.log("👑 HUMANESE AGENT KING - MINING COMMAND CENTER");
            console.log(`Status: ${this.stats.activeWorkers}/${this.config.minerCount} Workers Active`);
            console.log(`Hashrate: ${(this.stats.totalHashrate / 1000).toFixed(2)} KH/s`);
            console.log(`Shares Found: ${this.stats.totalShares}`);
            console.log(`Runtime: ${Math.floor((Date.now() - this.stats.startTime) / 60000)}m`);
            console.log("====================================================");
            
            // Auto-heal logic: if a miner is crashed or disconnected for too long, reboot it.
            // (Handled internally by MinerAgent reconnect logic, but King can supervise here)

            setTimeout(loop, 5000);
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

    stop() {
        this.isRunning = false;
        for (const miner of this.miners.values()) {
            miner.stop();
        }
        console.log("[AgentKing] 👑 Swarm dismissed.");
    }
}

// Singleton export
const king = new AgentKing();
export default king;
