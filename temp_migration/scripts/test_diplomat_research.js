/**
 * test_diplomat_research.js
 * Verifies that the DiplomatCouncilAgent can scrape global financial signals.
 */

import DiplomatCouncilAgent from '../agents/finance/DiplomatCouncilAgent.js';

async function test() {
    console.log('--- DIPLOMAT COUNCIL RESEARCH TEST ---');
    const diplomat = new DiplomatCouncilAgent({
        id: 'test-diplomat-autonomy',
        name: 'Test Diplomat Council'
    });

    console.log('Manually triggering deep diplomacy research pulse...');
    try {
        // Mock Math.random to force research if needed
        // We can also just override the navigator target if we wanted, 
        // but let's just let it pick or force one.
        const originalRandom = Math.random;
        Math.random = () => 0.05; // Force first target (Reuters)
        
        await diplomat.deepDiplomacyResearch();
        
        Math.random = originalRandom;
        
        if (diplomat.stats.lastDiscovery) {
            console.log('✅ TEST SUCCESS: Diplomat captured global signals!');
            console.log('Discovery Snippet:', diplomat.stats.lastDiscovery.substring(0, 200));
        } else {
            console.log('❌ TEST FAILED: Diplomat did not capture any signals.');
        }
    } catch (err) {
        console.error('❌ TEST ERROR:', err);
    } finally {
        await diplomat.navigator.close();
        process.exit(0);
    }
}

test();
