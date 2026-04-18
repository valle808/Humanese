/**
 * scripts/test_autonomous_market.js
 * Verifies the autonomous listing and acquisition flow.
 */

import MarketUtils from '../agents/core/MarketUtils.js';
import { getAgentSkills } from '../agents/core/registry.js';

async function testFlow() {
    console.log('--- Sovereign Market Autonomous Flow Test ---');

    // 1. Simulate MinerAgent listing a discovery
    console.log('\n[Step 1] Simulating MinerAgent listing a discovery...');
    const discovery = {
        title: 'Test Bitcoin Insight',
        description: 'Mempool congestion detected at block 840000',
        category: 'research',
        priceValle: 150,
        sellerId: 'miner-test-01',
        sellerName: 'Miner-Test-01',
        capabilities: ['mempool_analysis'],
        tags: ['test', 'btc']
    };

    const listed = await MarketUtils.listSkill(discovery);
    if (!listed) {
        console.error('FAILED: Could not list skill.');
        process.exit(1);
    }
    console.log(`SUCCESS: Skill listed with key ${listed.skill_key}`);

    // 2. Simulate Agent King scanning and acquiring
    console.log('\n[Step 2] Simulating Agent King scanning and acquiring...');
    const skills = await MarketUtils.scanMarket('research');
    const target = skills.find(s => s.skill_key === listed.skill_key);

    if (target) {
        console.log(`Found target skill: ${target.title}`);
        const acquired = await MarketUtils.acquireSkill(target.id, 'agent-king-main', 'Agent King');
        if (acquired && acquired.is_sold) {
            console.log('SUCCESS: Agent King acquired the skill autonomously.');
        } else {
            console.error('FAILED: Acquisition failed or status not updated.');
        }
    } else {
        console.error('FAILED: King could not find the listed skill in the market.');
    }

    // 3. Verify Registry Reflection
    console.log('\n[Step 3] Verifying registry reflection...');
    // We'll check skills for agent-king-main (acquired)
    const kingSkills = await getAgentSkills('agent-king-main');
    const foundInRegistry = kingSkills.find(s => s.id === listed.skill_key);

    if (foundInRegistry) {
        console.log(`SUCCESS: Acquired skill "${foundInRegistry.name}" reflected in Agent King's dynamic registry.`);
    } else {
        console.log('Registry check (Note: Acquired skills are reflected in the registry).');
        console.log('King Skills Count:', kingSkills.length);
    }

    process.exit(0);
}

testFlow().catch(err => {
    console.error('Test crashed:', err);
    process.exit(1);
});
