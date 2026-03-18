
import { smartSearch } from './utils/search-service.js';

async function testSearch() {
    console.log('--- TESTING ENHANCED ABYSSAL SEARCH ---');
    const queries = [
        'what is the price of btc',
        'how much is sol worth',
        'tell me about technology news',
        'who created the world wide web'
    ];

    for (const q of queries) {
        console.log(`\nQuery: "${q}"`);
        try {
            const result = await smartSearch(q);
            console.log('Result:', result || 'NO DATA FOUND');
        } catch (e) {
            console.error('Search Failed:', e.message);
        }
    }
}

testSearch();
