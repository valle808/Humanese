
import { smartSearch } from './utils/search-service.js';

async function testSearch() {
    console.log('--- TESTING ABYSSAL SEARCH ---');
    const queries = [
        'current price of bitcoin',
        'who is the president of the united states',
        'latest news in technology'
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
