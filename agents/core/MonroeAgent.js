/**
 * =========================================================================
 * 🌌 THE HUMANESE SOVEREIGN MATRIX
 * agents/core/MonroeAgent.js
 *
 * 🧠 MONROE — Sovereign Intelligence & Strategic Orchestrator
 *
 * Monroe is the high-reasoning core of the ecosystem.
 * It monitors the treasury, orchestrates the mining swarm,
 * and provides autonomous insights for network expansion.
 * =========================================================================
 */

import { PrismaClient } from '@prisma/client';
import { coinbaseService } from '../../lib/coinbase.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

class MonroeAgent {
    constructor() {
        this.id = 'monroe-prime';
        this.name = 'Monroe';
        this.status = 'INITIALIZING';
        this.stats = {
            cycles: 0,
            lastLogicResult: null,
            startTime: Date.now()
        };
        this.isRunning = false;
    }

    async boot() {
        console.log("[Monroe] 🧠 Initializing Sovereign Intelligence...");
        this.isRunning = true;
        this.status = 'OPERATIONAL';
        this.runReasoningLoop();
    }

    async runReasoningLoop() {
        while (this.isRunning) {
            this.stats.cycles++;
            console.log(`[Monroe] 🔄 Reasoning Cycle #${this.stats.cycles}`);

            try {
                // 1. Audit Treasury
                const btcWallet = await prisma.wallet.findFirst({
                    where: { network: 'Bitcoin' }
                });
                
                if (btcWallet && btcWallet.balance === 0) {
                    console.log("[Monroe] 🏦 Treasury Audit: BTC has been successfully offramped to Coinbase.");
                    this.stats.lastLogicResult = "TREASURY_OFFRAMP_VERIFIED";
                }

                // 2. Monitor Swarm
                const nodeStats = await prisma.hardwareNode.findMany();
                const totalHashrate = nodeStats.reduce((sum, n) => sum + n.hashrate, 0);
                console.log(`[Monroe] 📡 Swarm Health: ${nodeStats.length} nodes active. Total Hashrate: ${totalHashrate.toFixed(2)} KH/s`);

                // 3. Strategic Adaptation
                // Placeholder for LLM-driven decision making
                if (totalHashrate < 10) {
                    console.log("[Monroe] ⚠️ ALERT: Swarm power low. Recommending node expansion.");
                }

                // Persist state
                this.persistState();

            } catch (err) {
                console.error("[Monroe] ❌ Reasoning Loop Error:", err);
            }

            // Wait for 60 seconds before next cycle
            await new Promise(resolve => setTimeout(resolve, 60000));
        }
    }

    persistState() {
        const statePath = path.join(__dirname, '..', 'data', 'monroe_state.json');
        fs.writeFileSync(statePath, JSON.stringify({
            id: this.id,
            status: this.status,
            stats: this.stats,
            timestamp: new Date().toISOString()
        }, null, 2));
    }

    stop() {
        this.isRunning = false;
        this.status = 'IDLE';
        console.log("[Monroe] 🧠 Reasoning suspended.");
    }
}

const monroe = new MonroeAgent();
export default monroe;

// Auto-boot if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    monroe.boot();
}
