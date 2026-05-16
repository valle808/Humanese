// scripts/run-swarm.js — Autonomous Swarm Runner
console.log('--- SWARM RUNNER START ---');
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config(); // Fallback to .env

import { financialAgent } from '../agents/finance/trading-agent.js';

console.log('🚀 Launching Sovereign Trading Swarm (2-hour session)...');

try {
    await financialAgent.boot();
    console.log('✅ Swarm is active and pulsing.');

    // Keep the process alive for 2 hours (7,200,000 ms)
    setTimeout(() => {
        console.log('🕒 2-hour session complete. Shutting down swarm...');
        financialAgent.stop();
        process.exit(0);
    }, 1000 * 60 * 60 * 2);

} catch (err) {
    console.error('❌ Failed to launch swarm:', err);
    process.exit(1);
}
