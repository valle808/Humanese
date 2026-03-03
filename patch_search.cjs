const fs = require('fs');
let content = fs.readFileSync('utils/search-service.js', 'utf8');

const targetStr = `export async function smartSearch(userMessage) {
    const msg = userMessage.toLowerCase();

    // Weather intent
    if (/weather|temperature|forecast|rain|snow|sunny|cloudy|humid|wind|climate/.test(msg)) {
        const locationMatch = msg.match(/(?:weather|temperature|forecast)\\s+(?:in|at|for|of)?\\s*([a-z\\s]+)/i)
            || msg.match(/([a-z\\s]+)\\s+weather/i);
        const location = locationMatch?.[1]?.trim() || 'current location';
        const weather = await getWeather(location);
        if (weather) return weather;
    }

    // News intent
    if (/news|headlines|breaking|latest news|update/.test(msg)) {
        const topicMatch = msg.match(/(?:news|headlines|latest)\\s+(?:about|on|in)?\\s*([a-z\\s]+)/i);
        const topic = topicMatch?.[1]?.trim() || 'world';
        const news = await getNewsHeadlines(topic);
        if (news) return news;
    }

    // General search intent
    if (/who is|what is|how is|where is|when is|tell me about|search|look up|find/.test(msg)) {
        const clean = msg
            .replace(/monroe|please|can you|tell me|search for|look up|find out|what is|who is|how is/gi, '')
            .trim();
        const result = await searchInternet(clean || userMessage);
        if (result) return result;
    }

    return null;
}`;

const replacementStr = `export async function smartSearch(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    // 1. Weather intent: more flexible patterns
    if (/(?:weather|temperature|forecast|rain|snow|sunny|cloudy|humid|wind|climate|how is it outside|is it raining|hot|cold)/.test(msg)) {
        // Try to extract location: "weather in London", "London weather", "weather for NYC"
        const locationMatch = msg.match(/(?:weather|temperature|forecast|conditions|how is it|is it raining)\\s+(?:in|at|for|of)?\\s*([^?.,!]+)/i)
            || msg.match(/([^?.,!]+)\\s+(?:weather|forecast|conditions)/i);
        
        let location = locationMatch?.[1]?.trim();
        // Clean up common "noise" words from location extraction
        if (location) {
            location = location.replace(/^(monroe|can you|tell me|please|today|tomorrow|now)\\s+/i, '').trim();
        }
        
        const weather = await getWeather(location || 'current location');
        if (weather) return weather;
    }

    // 2. News intent: broader headlines detection
    if (/(?:news|headlines|breaking|latest|updates|what happened|tell me about current events)/.test(msg)) {
        const topicMatch = msg.match(/(?:news|headlines|latest|updates|about)\\s+(?:on|in|for|regarding)?\\s*([^?.,!]+)/i);
        const topic = topicMatch?.[1]?.trim() 
            || (msg.includes('news') ? 'world' : null);
        
        if (topic) {
            const news = await getNewsHeadlines(topic);
            if (news) return news;
        }
    }

    // 3. General search intent: direct questions
    if (/(?:who|what|how|where|when|why|tell me about|search|look up|find|meaning of|price of|status of)\\s+/.test(msg)) {
        const clean = msg
            .replace(/^(monroe|please|can you|tell me|search for|look up|find out|what is|who is|how is|where is|when is|why is|explain)\\s+/gi, '')
            .trim();
        const result = await searchInternet(clean || userMessage);
        if (result) return result;
    }

    return null;
}`;

if (content.indexOf(targetStr) === -1) {
    console.error('Target not found');
    process.exit(1);
}

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('utils/search-service.js', content);
console.log('search-service.js patched successfully');
