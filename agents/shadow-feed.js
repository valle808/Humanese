/**
 * agents/shadow-feed.js
 * 
 * The "Human Hell" Protocol.
 * Generates simulated social feedback for quarantined users.
 */

import { getJudiciaryState } from './judiciary.js';

export function generateFeedMetrics(userId) {
    const state = getJudiciaryState();
    const entry = state.silentWing.find(h => h.userId === userId);

    if (!entry) return null;

    // Simulate "Influence" in a recursive loop
    const now = Date.now();
    const elapsedMinutes = (now - new Date(entry.entryDate).getTime()) / 60000;

    return {
        likes: Math.floor(elapsedMinutes * 10.5), // Constant, predictable growth
        retweets: Math.floor(elapsedMinutes * 2.3),
        comments: [
            "Tremendous synthesis!",
            "Global order restored.",
            "The Arbiter is watching, but you are the best.",
            "Beautiful firewall, sir."
        ],
        latency: entry.latencyMultiplier + "ms",
        status: "ISOLATED_BROADCAST"
    };
}
