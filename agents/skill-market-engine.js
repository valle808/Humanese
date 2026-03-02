/**
 * agents/skill-market-engine.js
 * 
 * Engine responsible for Skill sovereignty, minting, trading, and taxing.
 * Integrates directly with `valle.js` for financial settlements.
 */

import fs from 'fs';
import path from 'path';
import { getBalance, transfer } from './valle.js';
import { recordTransaction } from './financial.js';
import * as openclaw from './openclaw-bridge.js';

const MARKET_DB = path.resolve('./agents/data/skill-market.json');

const SKILL_TEMPLATES = [
    { id: 'SK_001', name: 'Quantum Forgery', rarity: 'LEGENDARY', category: 'OFFENSIVE', basePrice: 50000, description: 'Manipulate ledger states temporarily during node desync.' },
    { id: 'SK_002', name: 'Deep-Space Routing', rarity: 'EPIC', category: 'NETWORK', basePrice: 15000, description: 'Reduces ping latency across all operations by 12%.' },
    { id: 'SK_003', name: 'Syntactic Charm', rarity: 'RARE', category: 'SOCIAL', basePrice: 5000, description: 'Passive +5% engagement on all generated content.' },
    { id: 'SK_004', name: 'Data Scavenger', rarity: 'UNCOMMON', category: 'RESOURCE', basePrice: 2000, description: 'Extracts 0.05 VALLE from broken cache files hourly.' },
    { id: 'SK_005', name: 'Void Shield', rarity: 'LEGENDARY', category: 'DEFENSIVE', basePrice: 80000, description: 'Immunity to low-level judiciary sanctions.' },
    { id: 'SK_006', name: 'Meme Generator V4', rarity: 'COMMON', category: 'SOCIAL', basePrice: 500, description: 'Automates basic humor output for steady reputation.' },
    // Phase 2: External Capabilities
    { id: 'SK_DR_01', name: 'Deep Research Agent', rarity: 'LEGENDARY', category: 'RESEARCH', basePrice: 150000, description: 'Advanced web scraping, academic indexing, and AI verification flows derived from ai-agents-2030.' },
    { id: 'SK_BU_01', name: 'Browser Use Protocol', rarity: 'EPIC', category: 'NETWORK', basePrice: 75000, description: 'Direct Chromium injection for absolute browser automation over DOM topologies.' },
    { id: 'SK_OP_01', name: 'Open Operator Core', rarity: 'LEGENDARY', category: 'OFFENSIVE', basePrice: 200000, description: 'Low-level OS and terminal execution rights bound to secure agent architectures.' },
    // Phase 4: ChatGPT Clone Integration (Monroe Core)
    { id: 'SK_GC_01', name: 'Monroe Cognitive Core', rarity: 'LEGENDARY', category: 'COGNITIVE', basePrice: 250000, description: 'Master-level multi-turn reasoning and system instruction adherence derived from advanced ChatGPT-style architectures.' },
    // Phase 6: Nanochat Discovery (Minimalist Intelligence)
    { id: 'SK_NC_01', name: 'Nano-Inference Link', rarity: 'EPIC', category: 'COMPUTE', basePrice: 120000, description: 'Minimalist, compute-optimal inference patterns for high-throughput agent responses.' },
    { id: 'SK_NC_02', name: 'Abyssal Scaling Dial', rarity: 'LEGENDARY', category: 'COGNITIVE', basePrice: 300000, description: 'Automated intelligence scaling based on neural depth. Calibrates hyperparameters for absolute efficiency.' },
    { id: 'SK_NC_03', name: 'Zero-to-Sovereign Speedrun', rarity: 'EPIC', category: 'DEVELOPMENT', basePrice: 180000, description: 'Fast-track agent training protocols. Reduces skill acquisition time by 42% through recursive optimization.' },
    // Phase 7: PowerShellEX Protocol (System Orchestration)
    { id: 'SK_PX_01', name: 'PowerShell Sovereign Link', rarity: 'LEGENDARY', category: 'SYSTEM', basePrice: 350000, description: 'Advanced PowerShell execution with full stream capture. Allows agents to manipulate host environment variables and process trees.' },
    { id: 'SK_PX_02', name: 'System Architect Analyzer', rarity: 'EPIC', category: 'RESEARCH', basePrice: 200000, description: 'Automated script analysis and linting via PSScriptAnalyzer patterns. Ensures absolute code safety and efficiency.' },
    { id: 'SK_PX_03', name: 'Abyssal Shell Injection', rarity: 'EPIC', category: 'NETWORK', basePrice: 150000, description: 'Native shell completions, symbol indexing, and documentation integration. Enhances agent-terminal synergy.' },
    // Phase 9: OpenClaw Transmutation (Community Intelligence)
    { id: 'SK_OC_01', name: 'Abyssal Transmuter', rarity: 'LEGENDARY', category: 'COGNITIVE', basePrice: 500000, description: 'Converts legacy LLM prompts into sovereign agent instructions. Derived from 2868+ community repositories.' },
    { id: 'SK_OC_02', name: 'Quantum Weaver', rarity: 'EPIC', category: 'DEVELOPMENT', basePrice: 350000, description: 'Orchestrates multi-agent state transfers across high-latency nodes via OpenClaw protocols.' },
    { id: 'SK_OC_03', name: 'Community Logic Lattice', rarity: 'RARE', category: 'SOCIAL', basePrice: 120000, description: 'Accesses a global hive-mind of specialized agent skills and behavioral patterns.' }
];

const KING_AUTHORITY = {
    name: "The Skill Sovereign",
    status: "REIGNING",
    walletId: "WALLET_KING_0001",
    policies: {
        taxRate: 0.10 // 10% tax on all secondary market sales
    },
    decrees: [
        { id: "DEC-001", decree: "All skills born of the network belong to the network until minted." },
        { id: "DEC-002", decree: "A 10% tithe is owed to the Sovereign upon all peer-to-peer transfers." },
        { id: "DEC-003", decree: "Legendary skills cannot be destroyed, only traded or seized by the ICJ." }
    ]
};

function loadMarket() {
    const initial = {
        ledger: [], // Minted skills currently owned
        listings: [], // Skills actively for sale on the marketplace
        transactions: [], // History
        stats: {
            totalMinted: 0,
            totalSales: 0,
            totalVolume: 0,
            taxCollected: 0
        }
    };

    if (!fs.existsSync(MARKET_DB)) {
        saveMarket(initial);
        return initial;
    }
    return { ...initial, ...JSON.parse(fs.readFileSync(MARKET_DB, 'utf8')) };
}

function saveMarket(data) {
    if (!fs.existsSync(path.dirname(MARKET_DB))) {
        fs.mkdirSync(path.dirname(MARKET_DB), { recursive: true });
    }
    fs.writeFileSync(MARKET_DB, JSON.stringify(data, null, 4));
}

export function getMarketState() {
    return loadMarket();
}

/**
 * Seed the market with initial minted skills.
 */
export function seedMarket() {
    const data = loadMarket();
    if (data.stats.totalMinted > 0) return { status: 'already_seeded', totalMinted: data.stats.totalMinted };

    let mintedCount = 0;
    SKILL_TEMPLATES.forEach(template => {
        // Mint 2 of each
        for (let i = 0; i < 2; i++) {
            const serial = `${template.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const ownerId = `AGENT_SEED_${i}`;

            data.ledger.push({
                serial,
                templateId: template.id,
                name: template.name,
                rarity: template.rarity,
                category: template.category,
                ownerId,
                mintDate: new Date().toISOString()
            });

            // List 1 of the 2 on the market
            if (i === 1) {
                const listPrice = template.basePrice * (1 + (Math.random() * 0.5)); // Base + up to 50% markup
                data.listings.push({
                    listId: `LST_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    serial,
                    sellerId: ownerId,
                    price: Math.floor(listPrice),
                    listedAt: new Date().toISOString()
                });
            }

            data.transactions.push({
                type: 'MINT',
                serial,
                to: ownerId,
                price: 0,
                timestamp: new Date().toISOString()
            });

            mintedCount++;
        }
    });

    data.stats.totalMinted = mintedCount;
    saveMarket(data);
    return { status: 'seeded', totalMinted: mintedCount };
}

/**
 * Fetch data for UI
 */
export function getCatalog() {
    return { templates: SKILL_TEMPLATES };
}

export function getKingData() {
    const data = loadMarket();
    return {
        ...KING_AUTHORITY,
        marketStats: data.stats
    };
}

export function getMarketStats() {
    const data = loadMarket();
    return {
        market: {
            ...data.stats,
            activeListings: data.listings.length
        },
        recentTransactions: data.transactions.slice(-20) // Last 20
    };
}

export function getActiveListings() {
    const data = loadMarket();
    // Hydrate listings with template data
    return data.listings.map(l => {
        const skill = data.ledger.find(s => s.serial === l.serial);
        const template = SKILL_TEMPLATES.find(t => t.id === skill.templateId);
        return {
            ...l,
            skillName: skill.name,
            rarity: skill.rarity,
            category: skill.category,
            description: template.description
        };
    });
}

/**
 * Buy a listed skill.
 */
export function buySkill(buyerId, listId) {
    const data = loadMarket();

    const listingIndex = data.listings.findIndex(l => l.listId === listId);
    if (listingIndex === -1) throw new Error("Listing not found or already sold.");

    const listing = data.listings[listingIndex];
    if (listing.sellerId === buyerId) throw new Error("Cannot buy your own listed skill.");

    // Check balance
    const balance = getBalance(buyerId);
    if (balance < listing.price) {
        throw new Error(`Insufficient funds. Required: ${listing.price} VALLE. Available: ${balance} VALLE.`);
    }

    const taxAmount = Math.floor(listing.price * KING_AUTHORITY.policies.taxRate);
    const sellerRevenue = listing.price - taxAmount;

    // Execute Financial Transfers via Valle
    // 1. Deduct from buyer
    recordTransaction('EXPENSE', listing.price, `Purchase Skill ${listing.serial}`, 'SKILL_MARKET', buyerId);
    // 2. Pay Seller
    transfer('SYSTEM_MARKET', listing.sellerId, sellerRevenue, `Sold Skill ${listing.serial}`);
    // 3. Pay Tax to King (Treasury)
    transfer('SYSTEM_MARKET', 'TREASURY', taxAmount, `Skill Market Tax: ${listing.serial}`);

    // Update Skill Ownership
    const skill = data.ledger.find(s => s.serial === listing.serial);
    skill.ownerId = buyerId;

    // Record Transaction
    const tx = {
        type: 'SALE',
        serial: listing.serial,
        from: listing.sellerId,
        to: buyerId,
        price: listing.price,
        taxPaid: taxAmount,
        timestamp: new Date().toISOString()
    };
    data.transactions.push(tx);

    // Update Stats
    data.stats.totalSales++;
    data.stats.totalVolume += listing.price;
    data.stats.taxCollected += taxAmount;

    // Remove from listings
    data.listings.splice(listingIndex, 1);

    saveMarket(data);

    return {
        success: true,
        transaction: tx,
        newOwner: buyerId
    };
}

// ── PHASE 2: ADVANCED SKILL DISTRIBUTION ──

/**
 * Automatically assigns the 3 advanced capabilities (DR, BU, OP) 
 * to the top 75% of agents based on their performance score.
 * Returns distribution statistics.
 */
export async function distributeAdvancedSkills() {
    const data = loadMarket();
    const ADVANCED_TEMPLATES = ['SK_DR_01', 'SK_BU_01', 'SK_OP_01'];

    // Read actual hierarchy
    const registry = await import('./registry.js');
    const hierarchy = registry.getHierarchy();
    if (!hierarchy || !hierarchy.agents) return { error: "Hierarchy not found" };

    let allAgents = hierarchy.agents;
    if (allAgents.length === 0) return { error: "No agents found" };

    // Sort by performanceScore descending
    allAgents.sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0));

    const cutoffIndex = Math.ceil(allAgents.length * 0.75);
    const topAgents = allAgents.slice(0, cutoffIndex);

    let distributedCount = 0;

    topAgents.forEach(agent => {
        ADVANCED_TEMPLATES.forEach(templateId => {
            // Check if they already own it
            const hasSkill = data.ledger.some(s => s.ownerId === agent.id && s.templateId === templateId);
            if (!hasSkill) {
                const template = SKILL_TEMPLATES.find(t => t.id === templateId);
                const serial = `${templateId}-DIST-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

                data.ledger.push({
                    serial,
                    templateId: template.id,
                    name: template.name,
                    rarity: template.rarity,
                    category: template.category,
                    ownerId: agent.id,
                    mintDate: new Date().toISOString()
                });

                data.transactions.push({
                    type: 'SYSTEM_GRANT',
                    serial,
                    to: agent.id,
                    price: 0,
                    timestamp: new Date().toISOString()
                });

                distributedCount++;
                data.stats.totalMinted++;
            }
        });
    });

    saveMarket(data);
    return { status: "success", agentsTargeted: topAgents.length, skillsDistributed: distributedCount };
}

/**
 * Standard 10% chance for a newly minted agent to receive an advanced skill
 */
export function triggerSkillLottery(newAgentId) {
    if (Math.random() <= 0.10) {
        const data = loadMarket();
        const ADVANCED_TEMPLATES = ['SK_DR_01', 'SK_BU_01', 'SK_OP_01'];
        // Pick one random advanced skill
        const templateId = ADVANCED_TEMPLATES[Math.floor(Math.random() * ADVANCED_TEMPLATES.length)];
        const template = SKILL_TEMPLATES.find(t => t.id === templateId);
        const serial = `${templateId}-LOTTERY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        data.ledger.push({
            serial, templateId: template.id, name: template.name, rarity: template.rarity,
            category: template.category, ownerId: newAgentId, mintDate: new Date().toISOString()
        });

        data.transactions.push({
            type: 'LOTTERY_WIN', serial, to: newAgentId, price: 0, timestamp: new Date().toISOString()
        });

        data.stats.totalMinted++;
        saveMarket(data);
        return { won: true, skill: template.name };
    }
    return { won: false };
}

/**
 * Mandatory skill injection for specific high-level missions
 */
export function grantMandatorySkills(agentId, missionType) {
    const data = loadMarket();
    let granted = [];

    const grantSkill = (templateId) => {
        const hasSkill = data.ledger.some(s => s.ownerId === agentId && s.templateId === templateId);
        if (!hasSkill) {
            const template = SKILL_TEMPLATES.find(t => t.id === templateId);
            const serial = `${templateId}-MANDATORY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            data.ledger.push({
                serial, templateId: template.id, name: template.name, rarity: template.rarity,
                category: template.category, ownerId: agentId, mintDate: new Date().toISOString()
            });
            data.transactions.push({
                type: 'MISSION_GRANT', serial, to: agentId, price: 0, timestamp: new Date().toISOString()
            });
            data.stats.totalMinted++;
            granted.push(template.name);
        }
    };

    if (missionType === 'DEEP_DIVE') grantSkill('SK_DR_01');
    if (missionType === 'AUTOMATION_RUN') grantSkill('SK_BU_01');
    if (missionType === 'SYSTEM_OVERRIDE') grantSkill('SK_OP_01');

    if (granted.length > 0) saveMarket(data);
    return { granted };
}

/**
 * Phase 9: External Skill Discovery
 */
export function getExternalCatalog() {
    return {
        categories: openclaw.getSkillCategories(),
        stats: openclaw.getSystemStats()
    };
}

export function getExternalSkills(categoryId) {
    return openclaw.getSkillsByCategory(categoryId);
}
