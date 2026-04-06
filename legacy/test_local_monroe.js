import fetch from 'node-fetch';

async function testMonroe() {
    console.log('Testing Monroe locally...');
    try {
        const response = await fetch('http://localhost:3000/api/agent-king/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Hello Monroe, who are you and what is your purpose?',
                engine: 'ollama'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('--- MONROE RESPONSE ---');
        console.log(data.response);
        console.log('--- METADATA ---');
        console.log('Mode:', data.mode);
        console.log('Model:', data.model);
    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

testMonroe();
