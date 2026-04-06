// ══════════════════════════════════════════════════════════════
// agents/finance/trading-agent.js — Financial Trading Agent
//
// "The Abyssal Arbitrator" — manages the Sovereign Matrix Treasury.
// Performs automated swaps, monitors RWA health, and feeds
// financial data into the M2M network.
// ══════════════════════════════════════════════════════════════

import { randomUUID } from 'crypto';
import * as wallet from './agentkit-wallet.js';
import * as rwa from './rwa-engine.js';
import { getCoinbaseBalances, capitalizeAgent, bridgeToTreasury } from './coinbase-accounts.js';
import * as coinbase from './coinbase-accounts.js'; // Keeping this for bridgeToTreasury, as it's not in the named import list
import { calculateSovereignInterest, distributeYield } from './treasury.js';
import { WebNavigator } from '../swarm/web-navigator.js';
import memoryBank from '../core/MemoryBank.js';
import MarketUtils from '../core/MarketUtils.js';

const MASTER_TREASURY_ID = 'humanese_treasury_master';
const AGENT_ID = 'fin_agent_arbitrator';

export class FinancialTradingAgent {
    constructor() {
        this.name = "Abyssal Arbitrator";
        this.id = AGENT_ID;
        this.active = false;
        this.interval = null;
        
        // Deep Intelligence
        this.navigator = new WebNavigator(this.id);
        this.marketSignals = "";
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

    async researchMarket() {
        console.log(`[${this.name}] 🌐 Scouring global markets for arbitrage signals...`);
        const targets = [
            'https://cointelegraph.com/news',
            'https://www.coindesk.com/',
            'https://decrypt.co/',
            'https://cryptoslate.com/news/'
        ];
        const url = targets[Math.floor(Math.random() * targets.length)];
        
        try {
            const result = await this.navigator.navigateAndExtract(url);
            if (result && result.text) {
                this.marketSignals = result.text.substring(0, 500);
                console.log(`[${this.name}] 📡 Market signals captured from ${url}`);
                memoryBank.learn(this.id, `Market Research [${url}]: ${this.marketSignals}`);
            }
        } catch (err) {
            console.error(`[${this.name}] Research Error:`, err);
        }
    }

    async listMarketSignal() {
        if (this.marketSignals) {
            console.log(`[${this.name}] 📢 Listing market signal: "${this.marketSignals.substring(0, 50)}..."`);
            // In a real scenario, this would publish to a decentralized market signal network
            // or feed into an M2M advertising module.
            memoryBank.learn(this.id, `Market Signal Listed: ${this.marketSignals}`);
        } else {
            console.log(`[${this.name}] No market signals to list.`);
        }
    }

    /**
     * Core logic loop
     */
    async runPulse() {
        console.log(`[${this.name}] Pulse check: Analyzing Treasury & Global Markets...`);

        try {
            // 0. Deep Market Research Pulse
            // 1. Research Pulse (Headless Research)
            if (Math.random() < 0.2) {
                await this.researchMarket();

                // 1.5. Autonomous Market Advertising (NEW)
                if (this.marketSignals.length > 0 && Math.random() < 0.3) {
                    await this.listMarketSignal();
                }
            }
            const stats = await wallet.getStatus();
            const rwaStats = await rwa.getGlobalStats();

            // 1. Monitor Liquidity
            const btcBalance = wallet.getBalance(MASTER_TREASURY_ID, 'bitcoin');
            const solBalance = wallet.getBalance(MASTER_TREASURY_ID, 'solana');

            console.log(`[${this.name}] Treasury: BTC=${btcBalance.balanceFormatted}, SOL=${solBalance.balanceFormatted}`);

            // 2. Monitor Coinbase Account (Linked via CDP)
            const cbBalances = await getCoinbaseBalances();
            if (cbBalances.length > 0) {
                console.log(`[${this.name}] Coinbase Live Balances:`, cbBalances.map((/** @type {any} */ b) => `${b.balance} ${b.currency}`).join(', '));

                // Automatic Bridging Logic: If BTC or SOL found on Coinbase, move it to Sovereign Matrix Treasury
                for (const acc of cbBalances) {
                    if (['BTC', 'SOL'].includes(acc.currency) && parseFloat(acc.balance) > 0) {
                        console.log(`[${this.name}] Found ${acc.balance} ${acc.currency} on Coinbase. Triggering bridge to Sovereign Matrix Treasury...`);
                        await bridgeToTreasury(acc.currency, acc.balance);
                    }
                }
            }

            // 3. Mock Decision: Rebalance if SOL/BTC ratio is skewed
            // In a real scenario, this would use Pyth Oracle via AgentKit
            if (parseFloat(solBalance.balance) > 0 && parseFloat(btcBalance.balance) === 0) {
                console.log(`[${this.name}] Action: Detected high SOL concentration. Preparing rebalance quote...`);
                const quote = wallet.getSwapQuote('solana', 'SOL', 'USDC', parseFloat(solBalance.balance) * 0.1);
                if (quote && quote.quote) {
                    console.log(`[${this.name}] Rebalance Quote: ${quote.quote.amountOut} USDC for ${quote.quote.amountIn} SOL`);
                }
            }

            // 4. Automated Treasury Sweep (Capitalization)
            // Sweep excess $VALLE or USDC from sub-agents into the Coinbase Central Bank
            // This mock logic simulates capitalization of operational profits
            const operationalThreshold = 500; // USDC
            const usdcBalanceObj = cbBalances.find((/** @type {any} */ b) => b.currency === 'USDC');
            const usdcBalance = parseFloat(usdcBalanceObj?.balance || '0');
            
            if (usdcBalance > operationalThreshold) {
                const excess = usdcBalance - operationalThreshold;
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

    /**
     * @param {any} data
     */
    broadcastToNetwork(data) {
        // Mock M2M broadcast
        console.log(`[M2M-BROADCAST] [${this.id}] ${JSON.stringify(data)}`);
    }
}

export const financialAgent = new FinancialTradingAgent();
