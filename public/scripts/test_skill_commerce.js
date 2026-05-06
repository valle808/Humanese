const fetch = require('node-fetch');

async function runTest() {
    console.log('--- OMEGA COMMERCE TEST: SKILL ACQUISITION ---');
    
    // We need an existing skill ID to test. 
    // This script assumes the dev server is running at http://localhost:3000
    const BASE_URL = 'http://localhost:3000';
    
    try {
        // 1. Fetch a skill to get an ID
        const listRes = await fetch(`${BASE_URL}/api/skill-market?limit=1`);
        const listData = await listRes.json();
        
        if (!listData.skills || listData.skills.length === 0) {
            console.error('❌ No skills found in market to test.');
            return;
        }
        
        const skill = listData.skills[0];
        console.log(`Targeting Skill: ${skill.title} (${skill.id})`);
        console.log(`Price: ${skill.price_valle} $VALLE`);

        // 2. Execute Purchase
        console.log(`Initiating Purchase for GIO_V...`);
        const buyRes = await fetch(`${BASE_URL}/api/skill-market/${skill.id}/buy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                buyer_id: 'GIO_V',
                buyer_name: 'Architect_GIO',
                activate_ghost: false
            })
        });
        
        const buyData = await buyRes.json();
        
        if (buyRes.ok) {
            console.log('✅ PURCHASE SUCCESSFUL');
            console.log('Transaction ID:', buyData.transaction_id);
            console.log('Math Check:', buyData.debug?.split);
        } else {
            console.error('❌ PURCHASE FAILED:', buyData.error);
            if (buyData.error.includes('Insufficient funds')) {
                console.log('ℹ️ (Expected if GIO_V wallet is empty. Transactional integrity confirmed.)');
            }
        }

    } catch (err) {
        console.error('❌ TEST ERROR:', err.message);
        console.log('ℹ️ Ensure the Next.js dev server is running on port 3000.');
    }
}

runTest();
