import { getSecret, VaultKeys } from '../utils/secrets.js';

const prisma = new PrismaClient();
const AGENT_ID = "Quantum_Social_Manager";

let twitterClient = null;
let roClient = null;
let rwClient = null;

export async function initializeClients() {
    console.log("[Twitter Gateway] Synchronizing with Secret Vault...");

    const [bearerToken, consumerKey, consumerSecret, accessToken, accessSecret] = await Promise.all([
        getSecret(VaultKeys.X_BEARER_TOKEN),
        getSecret(VaultKeys.X_API_KEY),
        getSecret(VaultKeys.X_API_SECRET),
        getSecret(VaultKeys.X_ACCESS_TOKEN),
        getSecret(VaultKeys.X_ACCESS_SECRET)
    ]);

    if (!bearerToken && !consumerKey) {
        console.warn("[Twitter Gateway] Secure keys not found in vault. Gateway inactive.");
        return false;
    }

    // Initialize Read-Only Client with Bearer Token
    if (bearerToken) {
        twitterClient = new TwitterApi(bearerToken);
        roClient = twitterClient.readOnly;
        console.log("[Twitter Gateway] Read-Only Client synchronized with Bearer Token.");
    }

    // If User Context tokens are provided, initialize Read/Write
    if (consumerKey && consumerSecret && accessToken && accessSecret) {
        const userClient = new TwitterApi({
            appKey: consumerKey,
            appSecret: consumerSecret,
            accessToken: accessToken,
            accessSecret: accessSecret,
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
