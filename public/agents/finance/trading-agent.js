// ══════════════════════════════════════════════════════════════
// agents/finance/trading-agent.js — Financial Trading Agent
//
// "The Abyssal Arbitrator" — manages the Humanese Treasury.
// Performs automated swaps, monitors RWA health, and feeds
// financial data into the M2M network.
// ══════════════════════════════════════════════════════════════

import { randomUUID } from 'crypto';
import * as wallet from './agentkit-wallet.js';
import * as rwa from './rwa-engine.js';
import { getCoinbaseBalances, capitalizeAgent, bridgeToTreasury } from './coinbase-accounts.js';
import * as coinbase from './coinbase-accounts.js'; // Keeping this for bridgeToTreasury, as it's not in the named import list
import { calculateSovereignInterest, distributeYield } from './treasury.js';

const MASTER_TREASURY_ID = 'humanese_treasury_master';
const AGENT_ID = 'fin_agent_arbitrator';

export class FinancialTradingAgent {
    constructor() {
        this.name = "Abyssal Arbitrator";
        this.id = AGENT_ID;
        this.active = false;
        this.interval = null;
    }

    async boot() {
        console.log(`[${this.name}] Initializing financial protocols...`);
        this.active = true;
        this.interval = setInterval(() => this.runPulse(), 1000 * 60 * 15); // Every 15 mins
        this.runPulse(); // Immediate first pulse
    }

    async stop() {
        this.active = false;
        if (this.interval) clearInterval(this.interval);
    }

    /**
     * Core logic loop
     */
    async runPulse() {
        console.log(`[${this.name}] Pulse check: Analyzing Treasury...`);

        try {
            const stats = await wallet.getStatus();
            const rwaStats = await rwa.getGlobalStats();

            // 1. Monitor Liquidity
            const btcBalance = wallet.getBalance(MASTER_TREASURY_ID, 'bitcoin');
            const solBalance = wallet.getBalance(MASTER_TREASURY_ID, 'solana');

            console.log(`[${this.name}] Treasury: BTC=${btcBalance.balanceFormatted}, SOL=${solBalance.balanceFormatted}`);

            // 2. Monitor Coinbase Account (Linked via CDP)
            const cbBalances = await getCoinbaseBalances();
            if (cbBalances.length > 0) {
                console.log(`[${this.name}] Coinbase Live Balances:`, cbBalances.map(b => `${b.balance} ${b.currency}`).join(', '));

                // Automatic Bridging Logic: If BTC or SOL found on Coinbase, move it to Humanese Treasury
                for (const acc of cbBalances) {
                    if (['BTC', 'SOL'].includes(acc.currency) && parseFloat(acc.balance) > 0) {
                        console.log(`[${this.name}] Found ${acc.balance} ${acc.currency} on Coinbase. Triggering bridge to Humanese Treasury...`);
                        await bridgeToTreasury(acc.currency, acc.balance);
                    }
                }
            }

            // 3. Mock Decision: Rebalance if SOL/BTC ratio is skewed
            // In a real scenario, this would use Pyth Oracle via AgentKit
            if (parseFloat(solBalance.balance) > 0 && parseFloat(btcBalance.balance) === 0) {
                console.log(`[${this.name}] Action: Detected high SOL concentration. Preparing rebalance quote...`);
                const quote = wallet.getSwapQuote('solana', 'SOL', 'USDC', parseFloat(solBalance.balance) * 0.1);
                console.log(`[${this.name}] Rebalance Quote: ${quote.quote.amountOut} USDC for ${quote.quote.amountIn} SOL`);
            }

            // 4. Automated Treasury Sweep (Capitalization)
            // Sweep excess $VALLE or USDC from sub-agents into the Coinbase Central Bank
            // This mock logic simulates capitalization of operational profits
            const operationalThreshold = 500; // USDC
            if (parseFloat(cbBalances.find(b => b.currency === 'USDC')?.balance || 0) > operationalThreshold) {
                const excess = parseFloat(cbBalances.find(b => b.currency === 'USDC').balance) - operationalThreshold;
                console.log(`[${this.name}] System Surplus Detected: ${excess} USDC. Capitalizing to Central Bank...`);
                await capitalizeAgent(this.id, excess, 'USDC');
            }

            // 5. RWA Appraisal Update
            const pendingAssets = Object.values(rwa.getAssetsByOwner('sergio_valle'))
                .filter(a => a.status === 'pending_appraisal');

            for (const asset of pendingAssets) {
                console.log(`[${this.name}] Appraising Pending Asset: ${asset.title}`);
                // Simulated appraisal: Increase valuation by 2-5%
                const newValuation = asset.valuationUSD * (1 + (Math.random() * 0.03 + 0.02));
                rwa.appraiseAsset(asset.id, newValuation);
                console.log(`[${this.name}] Asset ${asset.id} appraised at $${newValuation.toLocaleString()}`);
            }

            // ── STEP 5: Calculate Sovereign Interest (Phase 3) ───────────────
            console.log('[Abyssal-Arbitrator] Calculating Sovereign Interest yield...');
            const yieldGenerated = calculateSovereignInterest();
            if (yieldGenerated > 0) {
                distributeYield(yieldGenerated);
            }

            // ── STEP 6: Broadcast to M2M ─────────────────────────────────────
            this.broadcastToNetwork({
                action: 'TREASURY_AUDIT',
                totalValue: rwaStats.totalAssetValue,
                assetsCount: rwaStats.totalAssetsRegistered,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error(`[${this.name}] Pulse Error:`, error);
        }
    }

    broadcastToNetwork(data) {
        // Mock M2M broadcast
        console.log(`[M2M-BROADCAST] [${this.id}] ${JSON.stringify(data)}`);
    }
}

export const financialAgent = new FinancialTradingAgent();
