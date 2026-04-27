import MinerAgent from '../agents/finance/MinerAgent.js';
import prisma from '../lib/prisma_shared.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

/**
 * ⛏️ SOVEREIGN MINING SWARM ACTIVATOR
 * 
 * Orchestrates multiple MinerAgents to perform deep intelligence research
 * and advertise findings to the Sovereign Skill Market.
 */
async function activateSwarm() {
  console.log('\n======================================');
  console.log('⛏️  ACTIVATING INTELLIGENCE MINING SWARM');
  console.log('======================================\n');

  const configs = [
    { id: 'MinerSwarm_Lead', workerName: 'Alpha-Orchestrator' },
    { id: 'Miner_001', workerName: 'Local-Seeker-01' }
  ];

  const swarm = [];

  for (const config of configs) {
    const miner = new MinerAgent(config);
    
    // We activate the intelligence cycle every 60 seconds
    setInterval(async () => {
      try {
        await miner.researchNetwork(true);
        if (miner.lastResearch) {
          await miner.advertiseFindings();
        }
      } catch (err) {
        console.error(`[Swarm:${config.id}] Research Error:`, err.message);
      }
    }, 60000);

    swarm.push(miner);
    miner.connect(); // Start Stratum connectivity & PoW
    
    // Sync with database for Watcher discovery using Raw SQL to avoid schema mismatch
    try {
      await prisma.$executeRaw`
        INSERT INTO "Agent" (id, name, type, status, "lastPulse", config, "userId")
        VALUES (
          ${config.id}, 
          ${config.workerName}, 
          'MINER', 
          'MINING', 
          now(), 
          '{}', 
          'SergioValle'
        )
        ON CONFLICT (id) DO UPDATE SET 
          status = 'MINING', 
          "lastPulse" = now()
      `;
    } catch (err) {
      console.warn(`[SWARM] Database sync warning for ${config.id}: ${err.message}`);
    }

    console.log(`🚀 [SWARM] ${config.id} (${config.workerName}) Activated & Connected to Pool.`);
  }

  console.log('\n✅ Swarm is active and mining network intelligence.');
  
  process.on('SIGINT', () => {
    console.log('\nShutting down swarm...');
    swarm.forEach(m => m.stop());
    process.exit(0);
  });
}

activateSwarm();
