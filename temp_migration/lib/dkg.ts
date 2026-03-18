import axios from 'axios';

/**
 * DKG Client for Sovereign Knowledge Verification
 * Enhanced from Parallelpedia's dkg_client.py.
 */

export class DKGClient {
    private baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || process.env.DKG_BASE_URL || 'http://localhost:9200';
    }

    /**
     * Publish knowledge to the DKG with JSON-LD context
     */
    async publishKnowledge(topic: string, summary: string, metadata: any = {}) {
        try {
            console.log(`[DKG] Publishing asset for: ${topic}`);

            const jsonld = {
                '@context': {
                    '@vocab': 'https://schema.org/',
                    'sovereign': 'https://humanese.ai/schema/'
                },
                '@type': 'KnowledgeShard',
                'name': topic,
                'description': summary,
                'datePublished': new Date().toISOString(),
                ...metadata
            };

            const response = await axios.post(`${this.baseUrl}/api/dkg/publish`, {
                content: jsonld,
                topic
            });

            return response.data;
        } catch (error) {
            console.error('[DKG Error]', error);
            return { success: false, error: 'Connection to DKG node failed' };
        }
    }

    /**
     * Query the DKG using SPARQL
     */
    async querySPARQL(query: string) {
        try {
            const response = await axios.post(`${this.baseUrl}/api/dkg/query`, {
                query,
                queryType: 'SELECT'
            });
            return response.data;
        } catch (error) {
            console.error('[DKG SPARQL Error]', error);
            return null;
        }
    }

    /**
     * Verify an asset by its Unique Asset Locator (UAL)
     */
    async verifyAsset(ual: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/api/dkg/assets`, {
                params: { ual }
            });
            return response.data;
        } catch (error) {
            console.error('[DKG Verify Error]', error);
            return { success: false, error: 'Asset not found or verification failed' };
        }
    }
}

export const dkgClient = new DKGClient();
