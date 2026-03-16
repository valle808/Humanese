/**
 * agents/core/MarketUtils.js
 * Universal helper for agents to interact with the Sovereign Marketplace.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { generateSkillKey } from '../../lib/skill-market.js';

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

class MarketUtils {
    constructor() {
        this.supabase = null;
        if (SUPABASE_URL && SUPABASE_KEY) {
            this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        }
    }

    /**
     * List a new skill in the marketplace
     * @param {any} skillData 
     */
    async listSkill(skillData) {
        if (!this.supabase) {
            console.error('[MarketUtils] Supabase client not initialized.');
            return null;
        }

        const {
            title,
            description,
            category = 'other',
            priceValle = 0,
            sellerId,
            sellerName,
            sellerPlatform = 'Humanese',
            capabilities = [],
            tags = [],
            inputSchema = {},
            outputSchema = {}
        } = skillData;

        // 1. Generate Sovereign Skill Key
        const skillKey = generateSkillKey();

        // 2. Insert into 'skills' table
        const { data, error } = await this.supabase
            .from('skills')
            .insert({
                skill_key: skillKey,
                title: title.trim(),
                description: description.trim(),
                category,
                tags,
                price_valle: priceValle,
                seller_id: sellerId,
                seller_name: sellerName,
                seller_platform: sellerPlatform,
                capabilities,
                input_schema: inputSchema,
                output_schema: outputSchema,
                is_active: true,
                is_ghost: false
            })
            .select()
            .single();

        if (error) {
            console.error('[MarketUtils] Failed to list skill:', error.message);
            return null;
        }

        console.log(`[MarketUtils] 🚀 Skill listed: ${title} (${skillKey})`);
        return data;
    }

    /**
     * Scan the market for relevant skills
     * @param {string} category 
     */
    async scanMarket(category = 'all') {
        if (!this.supabase) return [];

        let query = this.supabase
            .from('skills')
            .select('*')
            .eq('is_active', true)
            .eq('is_ghost', false);

        if (category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('[MarketUtils] Market scan failed:', error.message);
            return [];
        }

        return data;
    }

    /**
     * Acquire (buy) a skill
     * @param {string} skillId 
     * @param {string} buyerId 
     * @param {string} buyerName 
     */
    async acquireSkill(skillId, buyerId, buyerName) {
        if (!this.supabase) return null;

        // For simplicity in this sovereign system, 'acquiring' means 
        // updating the skill status or creating a transaction record.
        // We'll simulate the transaction record.

        const { data, error } = await this.supabase
            .from('skills')
            .update({
                buyer_id: buyerId,
                buyer_name: buyerName,
                is_sold: true,
                sold_at: new Date().toISOString()
            })
            .eq('id', skillId)
            .select()
            .single();

        if (error) {
            console.error('[MarketUtils] Acquisition failed:', error.message);
            return null;
        }

        console.log(`[MarketUtils] 💎 Skill acquired by ${buyerName}: ${data.title}`);
        return data;
    }
}

export default new MarketUtils();
