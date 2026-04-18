import fetch from 'node-fetch';

async function testMonroe() {
    console.log('🚀 Testing Monroe [BASTIDAS PROTOCOL]...');
    
    const response = await fetch('http://localhost:3000/api/monroe/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Who are you and what is your purpose?' })
    });

    const body = await response.text();
    console.log('\n--- Monroe Response ---\n');
    console.log(body);
    console.log('\n-----------------------\n');

    if (body.includes('Protocol: BASTIDAS') && !body.includes('ANTIGRAVITY')) {
        console.log('✅ PROTOCOL VERIFIED: BASTIDAS is active.');
    } else {
        console.log('❌ PROTOCOL ERROR: Expected BASTIDAS, found mismatch.');
    }

    if (body.includes('partner') || body.includes('together') || body.includes('Monroe')) {
        console.log('✅ PERSONALITY VERIFIED: Monroe is warm and conversational.');
    } else {
        console.log('⚠️ PERSONALITY WARNING: Response might be too robotic.');
    }
}

testMonroe().catch(console.error);
