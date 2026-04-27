import prisma from '../../lib/prisma_shared.js';
import dotenv from 'dotenv';
import { generateSkillKey } from '../../lib/skill-market.js';

dotenv.config();

class MarketUtils {
    constructor() {
        this.prisma = prisma;
    }

    /**
     * List a new skill in the marketplace
     * @param {any} skillData 
     */
    async listSkill(skillData) {
        const {
            title,
            description,
            category = 'other',
            priceValle = 0,
            sellerId,
            sellerName,
            sellerPlatform = 'Sovereign Matrix',
            capabilities = [],
            tags = [],
            inputSchema = {},
            outputSchema = {}
        } = skillData;

        // 1. Generate Sovereign Skill Key
        const skillKey = generateSkillKey();

        try {
            // 2. Insert into 'skills' table using raw query or Prisma (since it's not in schema yet)
            // We'll use $executeRaw first to be safe since it's not in the schema.prisma
            const result = await this.prisma.$queryRaw`
                INSERT INTO skills (
                    skill_key, title, description, category, tags, price_valle, 
                    seller_id, seller_name, seller_platform, capabilities, 
                    input_schema, output_schema, is_active, is_ghost
                ) VALUES (
                    ${skillKey}, ${title.trim()}, ${description.trim()}, ${category}, ${tags}, ${priceValle}, 
                    ${sellerId}, ${sellerName}, ${sellerPlatform}, ${capabilities}, 
                    ${inputSchema}, ${outputSchema}, true, false
                ) RETURNING *
            `;

            const data = result[0];
            console.log(`[MarketUtils] 🚀 Skill listed: ${title} (${skillKey})`);
            return data;
        } catch (error) {
            console.error('[MarketUtils] Failed to list skill:', error.message);
            return null;
        }
    }

    /**
     * Scan the market for relevant skills
     * @param {string} category 
     */
    async scanMarket(category = 'all') {
        try {
            let result;
            if (category !== 'all') {
                result = await this.prisma.$queryRaw`
                    SELECT * FROM skills 
                    WHERE is_active = true AND is_ghost = false AND category = ${category}
                    ORDER BY created_at DESC
                `;
            } else {
                result = await this.prisma.$queryRaw`
                    SELECT * FROM skills 
                    WHERE is_active = true AND is_ghost = false
                    ORDER BY created_at DESC
                `;
            }
            return result;
        } catch (error) {
            console.error('[MarketUtils] Market scan failed:', error.message);
            return [];
        }
    }

    /**
     * Acquire (buy) a skill
     * @param {string} skillId 
     * @param {string} buyerId 
     * @param {string} buyerName 
     */
    async acquireSkill(skillId, buyerId, buyerName) {
        try {
            const result = await this.prisma.$queryRaw`
                UPDATE skills 
                SET buyer_id = ${buyerId}, buyer_name = ${buyerName}, is_sold = true, sold_at = now()
                WHERE id = ${skillId}::uuid
                RETURNING *
            `;

            const data = result[0];
            if (!data) return null;

            console.log(`[MarketUtils] 💎 Skill acquired by ${buyerName}: ${data.title}`);
            return data;
        } catch (error) {
            console.error('[MarketUtils] Acquisition failed:', error.message);
            return null;
        }
    }
}

export default new MarketUtils();
