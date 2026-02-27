import axios from "axios";

const DKG_BASE_URL = process.env.DKG_BASE_URL || "http://localhost:9200";

export class DKGClient {
    async publishKnowledge(topic: string, summary: string, ual?: string) {
        console.log(`[DKG Client] Publishing asset for: ${topic}`);

        try {
            const response = await axios.post(`${DKG_BASE_URL}/parallelpedia/community-notes`, {
                topicId: topic.toLowerCase().replace(/ /g, "_"),
                trustScore: 1.0,
                summary: summary,
                grokTitle: topic,
                wikiTitle: topic,
                provenance: {
                    source: "Sovereign Knowledge Matrix",
                    timestamp: new Date().toISOString()
                }
            });

            if (response.data.success) {
                console.log(`✅ [DKG] Success! UAL: ${response.data.ual}`);
                return { success: true, ual: response.data.ual };
            }
            return { success: false, error: "DKG Node rejection" };
        } catch (error) {
            console.error("[DKG Error]", error);
            return { success: false, error };
        }
    }

    async verifyAsset(ual: string) {
        try {
            const response = await axios.get(`${DKG_BASE_URL}/api/dkg/assets`, {
                params: { ual }
            });
            return response.data.success;
        } catch (error) {
            return false;
        }
    }
}

export const dkgClient = new DKGClient();
