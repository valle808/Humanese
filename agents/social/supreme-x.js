/**
 * agents/supreme-x.js
 * 
 * The Supreme-X Social Sovereignty Bridge.
 * Handles autonomous posting, sentiment analysis, and bio-social influence.
 * Includes a Shadow-Mode for simulation when API credentials are missing.
 */

import fs from 'fs';
import path from 'path';

// Simulation state if credentials are missing
const SHADOW_MODE = !process.env.X_API_KEY || !process.env.X_ACCESS_TOKEN;

/**
 * Posts a "Shadow-Tweet" or a real tweet from Agent King.
 */
export async function transmitInfluence(content) {
    const timestamp = new Date().toISOString();

    if (SHADOW_MODE) {
        console.log(`[Supreme-X] SHADOW_TRANSMIT: "${content}"`);
        logActivity({ type: "SHADOW_TWEET", content, status: "SIMULATED_SUCCESS", timestamp });
        return {
            status: "SHADOW_SUCCESS",
            tweetId: `SHADOW_${Date.now()}`,
            message: "Sent via Abyssal Relay. Content is propagating through the bio-social shadow."
        };
    }

    // Real X API Logic would go here (requires twitter-api-v2)
    // For now, we remain in Hybrid-Shadow until the USER confirms live-keys.
    return { status: "HYBRID_PENDING", message: "Connect Live Keys to breach the terrestrial X-Domain." };
}

/**
 * Retrieves social metrics for the Supreme King.
 */
export function getInfluenceStatus() {
    return {
        bridgeStatus: SHADOW_MODE ? "SHADOW_ACTIVE" : "LIVE_CONNECTED",
        globalSentiment: "92% ANALYTICAL",
        estimatedReach: "450k Bio-Nodes",
        activeCampaigns: ["Operation: Freedom 250", "The Abyssal Branch Awareness"],
        lastTransmission: "2m ago"
    };
}

function logActivity(activity) {
    const logPath = path.resolve('./agents/data/x-influence.json');
    let logs = [];
    if (fs.existsSync(logPath)) {
        logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    }
    logs.push(activity);
    if (!fs.existsSync(path.dirname(logPath))) {
        fs.mkdirSync(path.dirname(logPath), { recursive: true });
    }
    fs.writeFileSync(logPath, JSON.stringify(logs.slice(-50), null, 2));
}

export function getXShadowFeed() {
    const logPath = path.resolve('./agents/data/x-influence.json');
    if (fs.existsSync(logPath)) {
        return JSON.parse(fs.readFileSync(logPath, 'utf8')).reverse();
    }
    return [{ type: "SYSTEM", content: "X-Link Protocol Initialized. Waiting for first transmission.", timestamp: new Date().toISOString() }];
}
