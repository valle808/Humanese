
import { getSecret } from './utils/secrets.js';
import OpenAI from 'openai';

async function testGrok() {
    console.log('--- TESTING GROK CONNECTIVITY ---');
    try {
        const apiKey = await getSecret('XAI_API_KEY');
        if (!apiKey) {
            console.error('XAI_API_KEY not found in Vault or ENV.');
            return;
        }
        console.log('XAI_API_KEY found. Length:', apiKey.length);

        const client = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://api.x.ai/v1',
        });

        const completion = await client.chat.completions.create({
            model: "grok-2-latest", // Using latest Grok
            messages: [
                { role: "system", content: "You are Monroe, testing your internet connection." },
                { role: "user", content: "Tell me a very brief fact about Sovereign Matrix." },
            ],
        });
        console.log('Grok Response:', completion.choices[0].message.content);
    } catch (e) {
        console.error('Grok Test Failed:', e.message);
    }
}

testGrok();
