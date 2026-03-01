import fetch from 'node-fetch';

/**
 * Monroe Curiosity Engine - Web Search Integration
 * Allows Monroe to stay updated with real-time information.
 */
export async function searchInternet(query) {
    console.log(`[Search] Querying evolution nexus for: ${query}`);

    // We'll use a standard search-to-markdown bridge (DuckDuckGo or similar)
    // For production, this should use a proper API like Google/Bing or Serper
    try {
        const response = await fetch(`https://ddg-api.herokuapp.com/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) return "Search nexus unavailable.";

        const results = await response.json();
        return results.slice(0, 5).map(r => `[${r.title}](${r.link}): ${r.snippet}`).join('\n\n');
    } catch (e) {
        console.error('[Search] Error:', e);
        return "Search failed due to network interference.";
    }
}
