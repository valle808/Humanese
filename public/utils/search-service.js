import fetch from 'node-fetch';

/**
 * Monroe Curiosity Engine - Live Internet Search
 * Uses free, no-key APIs for real-time data retrieval.
 */

/**
 * Get real-time weather for a location using wttr.in (free, no key needed)
 */
export async function getWeather(location) {
    try {
        const encoded = encodeURIComponent(location || 'auto');
        const res = await fetch(`https://wttr.in/${encoded}?format=j1`, {
            headers: { 'User-Agent': 'Monroe-AI/1.0 (Sovereign Matrix)' },
            signal: AbortSignal.timeout(6000)
        });
        if (!res.ok) throw new Error(`wttr.in error: ${res.status}`);
        const data = await res.json();
        const current = data.current_condition?.[0];
        const area = data.nearest_area?.[0];
        const areaName = area?.areaName?.[0]?.value || location;
        const country = area?.country?.[0]?.value || '';
        const tempC = current?.temp_C;
        const tempF = current?.temp_F;
        const desc = current?.weatherDesc?.[0]?.value;
        const humidity = current?.humidity;
        const windKm = current?.windspeedKmph;
        const feelsC = current?.FeelsLikeC;

        return `🌤 **Weather in ${areaName}, ${country}**
• Condition: ${desc}
• Temperature: ${tempF}°F / ${tempC}°C (feels like ${feelsC}°C)
• Humidity: ${humidity}%
• Wind: ${windKm} km/h`;
    } catch (e) {
        console.error('[Search:Weather]', e.message);
        return null;
    }
}

/**
 * DuckDuckGo Instant Answer API — returns quick-answer snippets for queries (no API key)
 */
export async function searchInternet(query) {
    console.log(`[Search] Querying internet for: "${query}"`);
    try {
        const encoded = encodeURIComponent(query);
        const res = await fetch(
            `https://api.duckduckgo.com/?q=${encoded}&format=json&skip_disambig=1&no_redirect=1`,
            {
                headers: { 'User-Agent': 'Monroe-AI/1.0 (Sovereign Matrix)' },
                signal: AbortSignal.timeout(6000)
            }
        );
        if (!res.ok) throw new Error(`DDG error ${res.status}`);
        const data = await res.json();
        const results = [];

        // Abstract: main answer
        if (data.AbstractText) {
            results.push(`📖 **${data.AbstractSource}**: ${data.AbstractText}`);
        }
        // Answer: direct fact
        if (data.Answer) {
            results.push(`✅ **Direct Answer**: ${data.Answer}`);
        }
        // Related topics
        const topics = (data.RelatedTopics || []).slice(0, 4);
        topics.forEach(t => {
            if (t.Text) results.push(`🔗 ${t.Text}`);
        });

        return results.length > 0
            ? results.join('\n\n')
            : null;
    } catch (e) {
        console.error('[Search]', e.message);
        return null;
    }
}

/**
 * Fetch latest news headlines using a free RSS-to-JSON service
 */
export async function getNewsHeadlines(topic = 'technology') {
    try {
        const rssUrl = topic.toLowerCase().includes('tech')
            ? 'https://feeds.feedburner.com/TechCrunch'
            : `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`;

        const res = await fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=5`,
            { signal: AbortSignal.timeout(6000) }
        );
        if (!res.ok) throw new Error('RSS fetch failed');
        const data = await res.json();
        const items = data.items?.slice(0, 5) || [];
        if (items.length === 0) return null;

        const headlines = items
            .map((item, i) => `${i + 1}. **${item.title}** — _${item.pubDate?.split(' ').slice(0, 4).join(' ')}_`)
            .join('\n');

        return `📰 **Latest ${topic} Headlines:**\n${headlines}`;
    } catch (e) {
        console.error('[Search:News]', e.message);
        return null;
    }
}

/**
 * Smart intent dispatcher — detects what kind of search Monroe should do
 */
export async function smartSearch(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    // 1. Weather intent: more flexible patterns
    if (/(?:weather|temperature|forecast|rain|snow|sunny|cloudy|humid|wind|climate|how is it outside|is it raining|hot|cold)/.test(msg)) {
        // Try to extract location: "weather in London", "London weather", "weather for NYC"
        const locationMatch = msg.match(/(?:weather|temperature|forecast|conditions|how is it|is it raining)\s+(?:in|at|for|of)?\s*([^?.,!]+)/i)
            || msg.match(/([^?.,!]+)\s+(?:weather|forecast|conditions)/i);

        let location = locationMatch?.[1]?.trim();
        // Clean up common "noise" words from location extraction
        if (location) {
            location = location.replace(/^(monroe|can you|tell me|please|today|tomorrow|now)\s+/i, '').trim();
        }

        const weather = await getWeather(location || 'current location');
        if (weather) return weather;
    }

    // 2. News intent: broader headlines detection
    if (/(?:news|headlines|breaking|latest|updates|what happened|tell me about current events)/.test(msg)) {
        const topicMatch = msg.match(/(?:news|headlines|latest|updates|about)\s+(?:on|in|for|regarding)?\s*([^?.,!]+)/i);
        const topic = topicMatch?.[1]?.trim()
            || (msg.includes('news') ? 'world' : null);

        if (topic) {
            const news = await getNewsHeadlines(topic);
            if (news) return news;
        }
    }

    // 3. General search intent: direct questions
    if (/(?:who|what|how|where|when|why|tell me about|search|look up|find|meaning of|price of|status of)\s+/.test(msg)) {
        const clean = msg
            .replace(/^(monroe|please|can you|tell me|search for|look up|find out|what is|who is|how is|where is|when is|why is|explain)\s+/gi, '')
            .trim();
        const result = await searchInternet(clean || userMessage);
        if (result) return result;
    }

    return null;
}
