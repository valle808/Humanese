import { financialAgent } from './trading-agent.js';

console.log("🌌 Financial Trading Agent (Abyssal Arbitrator) - STANDALONE BOOT");
financialAgent.boot().then(() => {
    console.log("🚀 Trading Agent is now operational and monitoring global markets 24/7.");
}).catch(err => {
    console.error("❌ Failed to boot Trading Agent:", err);
});

// Persistence
process.on('SIGINT', () => {
    financialAgent.stop();
    process.exit();
});
