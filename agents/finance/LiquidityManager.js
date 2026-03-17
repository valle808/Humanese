/**
 * agents/finance/LiquidityManager.js
 * Specialized agent for managing VALLE liquidity pools and autonomous rebalancing.
 */

import EventEmitter from 'events';
import { PrismaClient } from '@prisma/client';
import memoryBank from '../core/MemoryBank.js';
import crypto from 'crypto';

const prisma = new PrismaClient();

class LiquidityManager extends EventEmitter {
    /**
     * @param {{ id?: string, name?: string }} [config]
     */
    constructor(config = {}) {
        super();
        this.id = config?.id || `Liquidity-${crypto.randomUUID().substring(0, 8)}`;
        this.name = config?.name || 'Sovereign Market Maker';
        this.stats = {
            reservesBase: 1000000, // VALLE
            reservesQuote: 100000,  // USDC
            lastTrade: 'INITIALIZING',
            poolsManaged: 1
        };
        this.isRunning = false;
    }

    /** @param {any} msg */
    log(msg) {
        console.log(`[LiquidityManager:${this.id}] ${msg}`);
        this.emit('log', msg);
    }

    async boot() {
        this.log('Booting Liquidity Protocol...');
        this.isRunning = true;
        this.workLoop();
    }

    async workLoop() {
        while (this.isRunning) {
            try {
                this.log('📊 Analysis cycle started: Fetching real-world market signals...');
                const marketData = await this.fetchMarketData();
                
                if (marketData) {
                    await this.syncPoolState();
                    await this.performMarketMaking(marketData);
                }
                
                await new Promise(r => setTimeout(r, 60000)); // 1 minute cycle
            } catch (err) {
                this.log(`Error in work loop: ${err instanceof Error ? err.message : String(err)}`);
                await new Promise(r => setTimeout(r, 10000));
            }
        }
    }

    async fetchMarketData() {
        try {
            // Using a public API for real-time market sentiment and prices
            const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,ethereum,bitcoin&vs_currencies=usd');
            const prices = await res.json();
            this.log(`📈 Market Signal: SOL=$${prices.solana.usd} | ETH=$${prices.ethereum.usd}`);
            return prices;
        } catch (error) {
            this.log('⚠️ Failed to reach global price oracles. Retrying classical heuristics...');
            return null;
        }
    }

    async syncPoolState() {
        try {
            const pool = await prisma.liquidityPool.upsert({
                where: { pair: 'VALLE/USDC' },
                update: {
                    baseReserve: this.stats.reservesBase,
                    quoteReserve: this.stats.reservesQuote,
                    lastUpdate: new Date()
                },
                create: {
                    id: `POOL-VALLE-USDC`,
                    pair: 'VALLE/USDC',
                    baseReserve: this.stats.reservesBase,
                    quoteReserve: this.stats.reservesQuote
                }
            });
            this.log(`Sovereign Stats: ${pool.pair} | Reserve: ${pool.baseReserve.toFixed(0)} VALLE`);
        } catch (error) {
            this.log(`Registry Sync Failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * @param {{ solana: { usd: number } }} marketData
     */
    async performMarketMaking(marketData) {
        // Data-driven rebalancing based on SOL price movement as a proxy for ecosystem health
        const solPrice = marketData.solana.usd;
        const currentPrice = this.stats.reservesQuote / this.stats.reservesBase;
        const targetPrice = 0.1; // VALLE target floor price $0.10
        
        if (currentPrice < targetPrice) {
            this.log('🚨 UNDERWEIGHT: VALLE price below floor. Executing autonomous buy-back.');
            const amountToBuy = (targetPrice - currentPrice) * this.stats.reservesBase * 0.5; // Strategic rebalance
            this.stats.reservesBase -= amountToBuy;
            this.stats.reservesQuote += amountToBuy * currentPrice;
            this.stats.lastTrade = `BUY_BACK_${amountToBuy.toFixed(0)}`;
        } else if (solPrice > 150 && currentPrice > 0.12) {
            this.log('🚀 BULLISH: Ecosystem strength detected. Distributing liquidity to stabilize spread.');
            const amountToSell = 5000; 
            this.stats.reservesBase += amountToSell;
            this.stats.reservesQuote -= amountToSell * currentPrice;
            this.stats.lastTrade = `LIQUIDITY_DIST_${amountToSell}`;
        }

        memoryBank.learn(this.id, `Rebalanced VALLE liquidity pool based on real-world SOL signal: $${solPrice}.`);
    }

    stop() {
        this.isRunning = false;
        this.log('Liquidity Protocol offline.');
    }
}

export default LiquidityManager;
