import { OllamaService } from '../utils/ollama-service.js';
import { askMonroeSovereign } from '../agents/core/agent-king-sovereign.js';

async function testAutonomy() {
    console.log('--- Testing Monroe Autonomy (Mocked) ---');

    // We can't easily mock the import inside agent-king-sovereign without a complex setup,
    // so we'll test the string parsing and logic flow.

    const mockUserMessage = "Share a thought about the future of AI on X.";
    const mockHistory = [];

    try {
        const result = await askMonroeSovereign(mockUserMessage, mockHistory);
        console.log('Monroe Response:', result.reply);
        console.log('Mode:', result.mode);

        if (result.reply.includes('Post to X')) {
            console.log('[SUCCESS] COMMAND:POST_TO_X was parsed and converted to a UI link.');
        } else {
            console.warn('[FAIL] COMMAND:POST_TO_X was NOT found in response.');
        }
    } catch (e) {
        console.error('Autonomy Test Error:', e.message);
    }
}

testAutonomy();
