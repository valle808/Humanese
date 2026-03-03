import { sovereignReply } from './agents/core/agent-king-sovereign.js';

function testSovereignReply() {
    console.log('--- Testing sovereignReply with Search Context ---');

    const userMsg = 'What is the weather in Hawaii?';
    const mockSearchData = '🌤 **Weather in Honolulu, US**\n• Condition: Sunny\n• Temperature: 82°F / 28°C\n• Humidity: 65%';

    const response = sovereignReply(userMsg, mockSearchData);

    console.log('User Message:', userMsg);
    console.log('Generated Response:\n', response);

    if (response.includes('successfully retrieved real-time data') && response.includes('Sunny') && response.includes('82°F')) {
        console.log('✅ TEST PASSED: Search context successfully integrated!');
    } else {
        console.log('❌ TEST FAILED: Search context missing or incorrectly formatted.');
    }
}

testSovereignReply();
