/**
 * test_miner_research.js
 * Verifies that the MinerAgent can successfully navigate the web and extract signals.
 */

import MinerAgent from '../agents/finance/MinerAgent.js';

async function test() {
    console.log('--- MINER AGENT RESEARCH TEST ---');
    const miner = new MinerAgent({
        id: 'test-miner-autonomy',
        workerName: 'ResearchTester'
    });

    console.log('Manually triggering deep research pulse...');
    try {
        // Mock Math.random to force research
        const originalRandom = Math.random;
        Math.random = () => 0.05; 
        
        await miner.researchNetwork();
        
        Math.random = originalRandom;
        
        if (miner.lastResearch) {
            console.log('✅ TEST SUCCESS: Miner captured research signals!');
            console.log('Signal Snippet:', miner.lastResearch.substring(0, 200));
        } else {
            console.log('❌ TEST FAILED: Miner did not capture any signals.');
        }
    } catch (err) {
        console.error('❌ TEST ERROR:', err);
    } finally {
        await miner.navigator.close();
        process.exit(0);
    }
}

test();
