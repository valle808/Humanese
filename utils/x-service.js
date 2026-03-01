import { TwitterApi } from 'twitter-api-v2';
import { getSecret, VaultKeys } from './secrets.js';

/**
 * Monroe Social Evolution - X.com integration
 * Allows Monroe to post updates autonomously.
 */
export class XService {
    constructor() {
        this.client = null;
    }

    async init() {
        if (this.client) return;

        const appKey = await getSecret(VaultKeys.X_API_KEY);
        const appSecret = await getSecret(VaultKeys.X_API_SECRET);
        const accessToken = await getSecret(VaultKeys.X_ACCESS_TOKEN);
        const accessSecret = await getSecret(VaultKeys.X_ACCESS_SECRET);

        if (!appKey || !appSecret || !accessToken || !accessSecret) {
            throw new Error('X.com API credentials missing in Secret Vault.');
        }

        this.client = new TwitterApi({
            appKey,
            appSecret,
            accessToken,
            accessSecret,
        });
    }

    async postTweet(content) {
        await this.init();
        try {
            const { data: createdTweet } = await this.client.v2.tweet(content);
            console.log('[XService] Tweet posted successfully:', createdTweet.id);
            return createdTweet;
        } catch (error) {
            console.error('[XService] Tweeting failed:', error);
            throw error;
        }
    }
}

export const monroeX = new XService();
