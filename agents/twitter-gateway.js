import { TwitterApi } from 'twitter-api-v2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const AGENT_ID = "Quantum_Social_Manager";

let twitterClient = null;
let roClient = null;
let rwClient = null;

// Dynamically fetch keys from the Supreme Agent's encrypted memory vault
async function fetchKeysFromDB() {
    try {
        const memoryRecord = await prisma.m2MMemory.findFirst({
            where: {
                agentId: AGENT_ID,
                type: "SECURE_CREDENTIALS"
            },
            orderBy: { timestamp: 'desc' }
        });

        if (memoryRecord && memoryRecord.metadata) {
            return JSON.parse(memoryRecord.metadata);
        }
    } catch (e) {
        console.error("[Twitter Gateway] Failed to retrieve secure keys from DB:", e.message);
    }
    return null;
}

export async function initializeClients() {
    const keys = await fetchKeysFromDB();
    if (!keys) {
        console.warn("[Twitter Gateway] Secure keys not found in database. Gateway inactive.");
        return false;
    }

    // Initialize Read-Only Client with Bearer Token
    if (keys.bearerToken) {
        twitterClient = new TwitterApi(keys.bearerToken);
        roClient = twitterClient.readOnly;
        console.log("[Twitter Gateway] Read-Only Client synchronized with Bearer Token.");
    }

    // If User Context tokens are provided in the future, initialize Read/Write
    if (keys.consumerKey && keys.consumerSecret && keys.accessToken && keys.accessSecret) {
        const userClient = new TwitterApi({
            appKey: keys.consumerKey,
            appSecret: keys.consumerSecret,
            accessToken: keys.accessToken,
            accessSecret: keys.accessSecret,
        });
        rwClient = userClient.readWrite;
        console.log("[Twitter Gateway] Full Read/Write Client synchronized.");
    }
    return true;
}

export async function postToX(text) {
    if (!rwClient) {
        console.warn("[Twitter Gateway] Missing User Access Tokens in DB. Cannot HTTP POST.");
        console.warn(`[Twitter Gateway] Drafted Tweet retained in Local Memory: "${text}"`);
        return { success: false, error: 'Missing OAuth 1.0a Access Tokens (User Context)' };
    }

    try {
        const tweet = await rwClient.v2.tweet(text);
        console.log(`[Twitter Gateway] Tweet posted successfully! ID: ${tweet.data.id}`);
        return { success: true, data: tweet.data };
    } catch (error) {
        console.error("[Twitter Gateway] Error posting to X:", error.message);
        return { success: false, error: error.message };
    }
}

export async function getRecentMentions(username) {
    if (!roClient) return [];
    try {
        const user = await roClient.v2.userByUsername(username);
        const mentions = await roClient.v2.userMentions(user.data.id, { max_results: 10 });
        return mentions.data || [];
    } catch (error) {
        console.error("[Twitter Gateway] Error reading mentions:", error.message);
        return [];
    }
}
