import king from './core/AgentKing.js';

console.log('🌌 INITIALIZING SOVEREIGN MINING SWARM...');

// Summon the swarm
king.summonMiners().then(() => {
    console.log('👑 Swarm successfully summoned and operational.');
}).catch(err => {
    console.error('❌ Failed to summon swarm:', err);
});

// Keep process alive
process.on('SIGINT', () => {
    king.stop();
    process.exit();
});
