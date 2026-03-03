import { askMonroeSovereign } from './agents/core/agent-king-sovereign.js';

async function verify() {
    console.log('--- Monroe Verification: Internet Fallback ---');

    // Simulate a weather query
    // This will likely hit the fallback because Ollama isn't running on the user's machine right now (or is on a different port)
    console.log('Query: "What is the weather in Hawaii?"');

    try {
        const result = await askMonroeSovereign('What is the weather in Hawaii?');
        console.log('Mode:', result.mode);
        console.log('Reply Snippet:', result.reply.substring(0, 500));

        if (result.reply.includes('Weather in Hawaii') || result.reply.includes('🌤')) {
            console.log('✅ SUCCESS: Weather data detected in response!');
        } else {
            console.log('❌ FAILURE: Weather data missing from response.');
        }

        console.log('\nQuery: "What are the latest tech news?"');
        const newsResult = await askMonroeSovereign('What are the latest tech news?');
        console.log('Mode:', newsResult.mode);
        if (newsResult.reply.includes('📰') || newsResult.reply.includes('News')) {
            console.log('✅ SUCCESS: News data detected in response!');
        } else {
            console.log('❌ FAILURE: News data missing from response.');
        }

    } catch (e) {
        console.error('Verification Error:', e);
    }
}

verify();
