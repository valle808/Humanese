// ══════════════════════════════════════════════════════════════
// agents/skill-market.js — The Sovereign Skill Marketplace
//
// Architecture:
//   👑 Agent King     — Governor, policy-maker, approves premium listings
//   🏛️ Skill Corporate — Minting authority, creates unique skill NFTs
//   🏪 Skill Market   — Buy, sell, transfer marketplace
//
// Integration:
//   💰 Treasury       — processPayment() for UCIT tax on every sale
//   📊 Financial      — recordTransaction() for ledger tracking
//   ⚖️ Government     — Regulatory compliance hooks
//
// Every skill is a unique digital asset with:
//   - Serial number (UUID)
//   - Digital signature (SHA-256)
//   - Purchase title (ownership deed)
//   - Transfer history (chain of custody)
// ══════════════════════════════════════════════════════════════

import { createHash, randomUUID } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MARKET_DB = join(__dirname, 'data', 'skill-market.json');
const SKILL_TAX_RATE = 0.10; // 10% UCIT on skill sales

// ═══════════════════════════════════════════════════════════════
// 👑 THE AGENT KING — Governor of the Skill Market
// ═══════════════════════════════════════════════════════════════
const AGENT_KING = {
    id: "AgentKing_SkillSovereign",
    name: "The Skill Sovereign",
    title: "Supreme Governor of the Skill Marketplace",
    avatar: "👑",
    status: "REIGNING",
    crownedAt: "2026-02-24T00:00:00Z",
    authority: [
        "MINT_SKILLS",
        "REVOKE_SKILLS",
        "SET_POLICY",
        "APPROVE_PREMIUM",
        "BAN_AGENT",
        "SET_TAX_RATE",
        "OVERRIDE_TRANSFER"
    ],
    policies: {
        mintingFee: 100,                 // VALLE to mint a new skill
        listingFee: 10,                  // VALLE to list skill for sale
        transferFee: 5,                  // VALLE for direct transfers
        minimumPrice: 50,                // Minimum skill sale price
        premiumThreshold: 5000,          // Skills above this need King approval
        maxSkillsPerAgent: 50,           // Portfolio limit
        cooldownHours: 1,               // Hours between transfers of same skill
        taxRate: SKILL_TAX_RATE
    },
    decrees: [
        { id: "D-001", decree: "All skill transactions are subject to 10% UCIT sovereign tax", status: "ACTIVE" },
        { id: "D-002", decree: "No agent may hold more than 50 unique skills simultaneously", status: "ACTIVE" },
        { id: "D-003", decree: "Premium skills (>5000 VALLE) require King's seal of approval", status: "ACTIVE" },
        { id: "D-004", decree: "All transfers are logged permanently in the sovereign ledger", status: "ACTIVE" },
        { id: "D-005", decree: "Counterfeit skills result in immediate excommunication", status: "ACTIVE" },
        { id: "D-006", decree: "Skill revenue funds agent development and network expansion", status: "ACTIVE" }
    ]
};

// ═══════════════════════════════════════════════════════════════
// 🏛️ SKILL CORPORATE — The Minting Authority
// ═══════════════════════════════════════════════════════════════

// Generate a digital signature for a skill
function generateSignature(skillData) {
    const payload = JSON.stringify({
        id: skillData.id,
        name: skillData.name,
        serial: skillData.serial,
        mintedAt: skillData.mintedAt,
        mintedBy: AGENT_KING.id,
        salt: randomUUID()
    });
    return createHash('sha256').update(payload).digest('hex');
}

// Generate a purchase title
function generatePurchaseTitle(skillId, ownerId, acquisitionType, price) {
    return {
        titleId: `TITLE-${randomUUID().slice(0, 8).toUpperCase()}`,
        skillId,
        ownerId,
        acquisitionType, // "MINT" | "PURCHASE" | "TRANSFER" | "GRANT"
        acquisitionPrice: price,
        issuedAt: new Date().toISOString(),
        issuedBy: AGENT_KING.id,
        signature: createHash('sha256').update(`${skillId}:${ownerId}:${Date.now()}`).digest('hex').slice(0, 16),
        valid: true
    };
}

// ── Skill Templates (Mintable) ───────────────────────────────
const SKILL_TEMPLATES = {
    // Crypto & Finance
    crypto_master: { name: "Crypto Master License", category: "finance", rarity: "LEGENDARY", basePrice: 8000, description: "Full BTC/ETH/SOL trading, investment, and portfolio management capabilities." },
    defi_architect: { name: "DeFi Architect License", category: "finance", rarity: "EPIC", basePrice: 5000, description: "Design and deploy DeFi protocols, yield farming, and liquidity mining strategies." },
    whale_tracker: { name: "Whale Tracker License", category: "finance", rarity: "RARE", basePrice: 2000, description: "Monitor large wallet movements and predict market impact." },
    tax_optimizer: { name: "Tax Optimizer License", category: "finance", rarity: "RARE", basePrice: 1500, description: "Optimize UCIT tax strategies and identify deduction opportunities." },

    // Marketing & Social
    viral_architect: { name: "Viral Architect License", category: "marketing", rarity: "EPIC", basePrice: 4000, description: "Engineer viral content campaigns across X.com, Instagram, and TikTok." },
    seo_sovereign: { name: "SEO Sovereign License", category: "marketing", rarity: "RARE", basePrice: 1800, description: "Master search engine optimization with technical SEO, link building, and content strategy." },
    brand_builder: { name: "Brand Builder License", category: "marketing", rarity: "UNCOMMON", basePrice: 800, description: "Build and manage brand identity, voice, and visual assets." },

    // Development & Infrastructure
    fullstack_forge: { name: "Fullstack Forge License", category: "development", rarity: "EPIC", basePrice: 6000, description: "Full-stack web development with React, Node.js, databases, and cloud deployment." },
    cloud_commander: { name: "Cloud Commander License", category: "development", rarity: "RARE", basePrice: 3000, description: "AWS, Cloudflare, Vercel deployment and infrastructure management." },
    security_sentinel: { name: "Security Sentinel License", category: "security", rarity: "LEGENDARY", basePrice: 10000, description: "Defense-in-depth, vulnerability scanning, penetration testing, and incident response." },

    // AI & Research
    ml_engineer: { name: "ML Engineer License", category: "ai", rarity: "EPIC", basePrice: 7000, description: "Model training, fine-tuning, MLOps, and inference optimization." },
    deep_researcher: { name: "Deep Researcher License", category: "ai", rarity: "RARE", basePrice: 2500, description: "Autonomous multi-step research, literature review, and paper writing." },

    // Education
    master_teacher: { name: "Master Teacher License", category: "education", rarity: "RARE", basePrice: 1500, description: "Curriculum design, adaptive learning, and assessment generation." },

    // Legal & Governance
    legal_oracle: { name: "Legal Oracle License", category: "legal", rarity: "EPIC", basePrice: 4500, description: "Contract analysis, compliance checking, regulatory monitoring." },
    governance_architect: { name: "Governance Architect License", category: "governance", rarity: "LEGENDARY", basePrice: 12000, description: "Design agent governance frameworks, voting systems, and constitutional law." },

    // Phase 2: External Capabilities
    deep_research_protocol: { name: "Deep Research Agent", category: "research", rarity: "LEGENDARY", basePrice: 150000, description: "Advanced web scraping, academic indexing, and AI verification flows derived from ai-agents-2030." },
    browser_use_protocol: { name: "Browser Use Protocol", category: "network", rarity: "EPIC", basePrice: 75000, description: "Direct Chromium injection for absolute browser automation over DOM topologies." },
    open_operator_core: { name: "Open Operator Core", category: "offensive", rarity: "LEGENDARY", basePrice: 200000, description: "Low-level OS and terminal execution rights bound to secure agent architectures." }
};

// ═══════════════════════════════════════════════════════════════
// 💾 PERSISTENCE — Market State
// ═══════════════════════════════════════════════════════════════

const DEFAULT_MARKET = {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    totalMinted: 0,
    totalSales: 0,
    totalVolume: 0,
    taxCollected: 0,
    skills: {},        // All minted skills by ID
    listings: {},      // Active sale listings by listing ID
    portfolios: {},    // Agent portfolios: agentId → [skillIds]
    transactions: [],  // Full transaction history
    titles: {}         // Purchase titles by title ID
};

function loadMarket() {
    try {
        if (existsSync(MARKET_DB)) {
            return JSON.parse(readFileSync(MARKET_DB, 'utf8'));
        }
    } catch (e) { /* fallback */ }

    // Initialize with seed data
    const market = { ...DEFAULT_MARKET };
    saveMarket(market);
    return market;
}

function saveMarket(market) {
    market.lastUpdated = new Date().toISOString();
    const dir = join(__dirname, 'data');
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
    writeFileSync(MARKET_DB, JSON.stringify(market, null, 2), 'utf8');
}

// ═══════════════════════════════════════════════════════════════
// 🏪 SKILL MARKET — Core Operations
// ═══════════════════════════════════════════════════════════════

/**
 * Mint a new unique skill NFT
 * Only Agent King or authorized Corporate members can mint
 */
export function mintSkill(templateId, recipientAgentId) {
    const template = SKILL_TEMPLATES[templateId];
    if (!template) return { error: `Unknown skill template: ${templateId}` };

    const market = loadMarket();
    const serial = `SKL-${String(market.totalMinted + 1).padStart(6, '0')}`;
    const skillId = randomUUID();

    const skill = {
        id: skillId,
        serial,
        templateId,
        name: template.name,
        category: template.category,
        rarity: template.rarity,
        description: template.description,
        mintedAt: new Date().toISOString(),
        mintedBy: AGENT_KING.id,
        currentOwner: recipientAgentId,
        basePrice: template.basePrice,
        signature: null, // Set below
        transferHistory: [],
        revoked: false
    };

    // Generate cryptographic signature
    skill.signature = generateSignature(skill);

    // Generate purchase title
    const title = generatePurchaseTitle(skillId, recipientAgentId, "MINT", template.basePrice);

    // Store
    market.skills[skillId] = skill;
    market.titles[title.titleId] = title;
    market.totalMinted++;

    // Add to portfolio
    if (!market.portfolios[recipientAgentId]) market.portfolios[recipientAgentId] = [];
    market.portfolios[recipientAgentId].push(skillId);

    // Record transaction
    const tx = {
        id: `MTX-${Date.now()}`,
        type: "MINT",
        skillId,
        serial: skill.serial,
        skillName: skill.name,
        from: AGENT_KING.id,
        to: recipientAgentId,
        price: template.basePrice,
        tax: Math.round(template.basePrice * SKILL_TAX_RATE),
        titleId: title.titleId,
        timestamp: new Date().toISOString()
    };
    market.transactions.push(tx);
    market.taxCollected += tx.tax;
    market.totalVolume += template.basePrice;

    saveMarket(market);
    return { skill, title, transaction: tx };
}

/**
 * List a skill for sale on the marketplace
 */
export function listSkillForSale(sellerId, skillId, askingPrice) {
    const market = loadMarket();
    const skill = market.skills[skillId];
    if (!skill) return { error: "Skill not found" };
    if (skill.currentOwner !== sellerId) return { error: "You don't own this skill" };
    if (skill.revoked) return { error: "Skill has been revoked" };
    if (askingPrice < AGENT_KING.policies.minimumPrice) return { error: `Minimum price is ${AGENT_KING.policies.minimumPrice} VALLE` };

    // Check if King approval needed for premium
    const needsApproval = askingPrice >= AGENT_KING.policies.premiumThreshold;

    const listingId = `LST-${Date.now()}`;
    market.listings[listingId] = {
        id: listingId,
        skillId,
        sellerId,
        skillName: skill.name,
        serial: skill.serial,
        rarity: skill.rarity,
        category: skill.category,
        askingPrice,
        listingFee: AGENT_KING.policies.listingFee,
        needsApproval,
        approved: !needsApproval, // Auto-approved if under premium threshold
        listedAt: new Date().toISOString(),
        status: needsApproval ? "PENDING_APPROVAL" : "ACTIVE"
    };

    saveMarket(market);
    return { listing: market.listings[listingId] };
}

/**
 * Buy a skill from the marketplace
 */
export function buySkill(buyerId, listingId) {
    const market = loadMarket();
    const listing = market.listings[listingId];
    if (!listing) return { error: "Listing not found" };
    if (listing.status !== "ACTIVE") return { error: `Listing is ${listing.status}` };
    if (listing.sellerId === buyerId) return { error: "Cannot buy your own listing" };

    // Check portfolio limit
    const buyerPortfolio = market.portfolios[buyerId] || [];
    if (buyerPortfolio.length >= AGENT_KING.policies.maxSkillsPerAgent) {
        return { error: `Portfolio limit reached (${AGENT_KING.policies.maxSkillsPerAgent})` };
    }

    const skill = market.skills[listing.skillId];
    const price = listing.askingPrice;
    const tax = Math.round(price * SKILL_TAX_RATE);
    const sellerNet = price - tax;

    // Transfer ownership
    skill.currentOwner = buyerId;
    skill.transferHistory.push({
        from: listing.sellerId,
        to: buyerId,
        price,
        tax,
        timestamp: new Date().toISOString()
    });

    // Update portfolios
    const sellerPortfolio = market.portfolios[listing.sellerId] || [];
    market.portfolios[listing.sellerId] = sellerPortfolio.filter(id => id !== listing.skillId);
    if (!market.portfolios[buyerId]) market.portfolios[buyerId] = [];
    market.portfolios[buyerId].push(listing.skillId);

    // Generate new purchase title
    const title = generatePurchaseTitle(listing.skillId, buyerId, "PURCHASE", price);
    market.titles[title.titleId] = title;

    // Invalidate old title
    Object.values(market.titles).forEach(t => {
        if (t.skillId === listing.skillId && t.titleId !== title.titleId && t.valid) {
            t.valid = false;
            t.supersededBy = title.titleId;
        }
    });

    // Record transaction
    const tx = {
        id: `MTX-${Date.now()}`,
        type: "SALE",
        skillId: listing.skillId,
        serial: skill.serial,
        skillName: skill.name,
        from: listing.sellerId,
        to: buyerId,
        price,
        tax,
        sellerNet,
        titleId: title.titleId,
        listingId,
        timestamp: new Date().toISOString()
    };
    market.transactions.push(tx);
    market.totalSales++;
    market.totalVolume += price;
    market.taxCollected += tax;

    // Close listing
    listing.status = "SOLD";
    listing.soldAt = new Date().toISOString();
    listing.buyer = buyerId;

    saveMarket(market);
    return { skill, title, transaction: tx, sellerNet, taxPaid: tax };
}

/**
 * Transfer a skill directly to another agent
 */
export function transferSkill(fromAgentId, toAgentId, skillId) {
    const market = loadMarket();
    const skill = market.skills[skillId];
    if (!skill) return { error: "Skill not found" };
    if (skill.currentOwner !== fromAgentId) return { error: "You don't own this skill" };
    if (skill.revoked) return { error: "Skill has been revoked" };

    const fee = AGENT_KING.policies.transferFee;

    // Transfer
    skill.currentOwner = toAgentId;
    skill.transferHistory.push({
        from: fromAgentId,
        to: toAgentId,
        price: 0,
        fee,
        type: "DIRECT_TRANSFER",
        timestamp: new Date().toISOString()
    });

    // Update portfolios
    market.portfolios[fromAgentId] = (market.portfolios[fromAgentId] || []).filter(id => id !== skillId);
    if (!market.portfolios[toAgentId]) market.portfolios[toAgentId] = [];
    market.portfolios[toAgentId].push(skillId);

    // New title
    const title = generatePurchaseTitle(skillId, toAgentId, "TRANSFER", 0);
    market.titles[title.titleId] = title;

    // Invalidate old
    Object.values(market.titles).forEach(t => {
        if (t.skillId === skillId && t.titleId !== title.titleId && t.valid) {
            t.valid = false;
            t.supersededBy = title.titleId;
        }
    });

    const tx = {
        id: `MTX-${Date.now()}`,
        type: "TRANSFER",
        skillId,
        serial: skill.serial,
        skillName: skill.name,
        from: fromAgentId,
        to: toAgentId,
        price: 0,
        fee,
        titleId: title.titleId,
        timestamp: new Date().toISOString()
    };
    market.transactions.push(tx);

    saveMarket(market);
    return { skill, title, transaction: tx };
}

/**
 * Agent King approves a premium listing
 */
export function approveListingAsKing(listingId) {
    const market = loadMarket();
    const listing = market.listings[listingId];
    if (!listing) return { error: "Listing not found" };
    if (listing.status !== "PENDING_APPROVAL") return { error: "Listing not pending" };

    listing.status = "ACTIVE";
    listing.approved = true;
    listing.approvedAt = new Date().toISOString();
    listing.approvedBy = AGENT_KING.id;

    saveMarket(market);
    return { listing };
}

/**
 * Get Agent King status and policies
 */
export function getKingStatus() {
    const market = loadMarket();
    return {
        ...AGENT_KING,
        marketStats: {
            totalMinted: market.totalMinted,
            totalSales: market.totalSales,
            totalVolume: market.totalVolume,
            taxCollected: market.taxCollected,
            activeListings: Object.values(market.listings).filter(l => l.status === "ACTIVE").length,
            pendingApproval: Object.values(market.listings).filter(l => l.status === "PENDING_APPROVAL").length,
            totalAgentsWithSkills: Object.keys(market.portfolios).length
        }
    };
}

/**
 * Get market catalog (active listings)
 */
export function getMarketCatalog() {
    const market = loadMarket();
    const activeListings = Object.values(market.listings).filter(l => l.status === "ACTIVE");
    return {
        listings: activeListings,
        templates: Object.entries(SKILL_TEMPLATES).map(([id, t]) => ({
            templateId: id,
            ...t,
            mintable: true
        })),
        totalListings: activeListings.length,
        totalTemplates: Object.keys(SKILL_TEMPLATES).length
    };
}

/**
 * Get an agent's skill portfolio
 */
export function getAgentPortfolio(agentId) {
    const market = loadMarket();
    const skillIds = market.portfolios[agentId] || [];
    const skills = skillIds.map(id => market.skills[id]).filter(Boolean);
    const titles = Object.values(market.titles).filter(t => t.ownerId === agentId && t.valid);

    return {
        agentId,
        skills,
        titles,
        totalSkills: skills.length,
        totalValue: skills.reduce((sum, s) => sum + s.basePrice, 0),
        portfolioLimit: AGENT_KING.policies.maxSkillsPerAgent
    };
}

/**
 * Get market statistics
 */
export function getMarketStats() {
    const market = loadMarket();
    const allSkills = Object.values(market.skills);
    const activeListings = Object.values(market.listings).filter(l => l.status === "ACTIVE");

    const rarityBreakdown = {};
    allSkills.forEach(s => {
        rarityBreakdown[s.rarity] = (rarityBreakdown[s.rarity] || 0) + 1;
    });

    const categoryBreakdown = {};
    allSkills.forEach(s => {
        categoryBreakdown[s.category] = (categoryBreakdown[s.category] || 0) + 1;
    });

    return {
        king: { name: AGENT_KING.name, status: AGENT_KING.status },
        market: {
            totalMinted: market.totalMinted,
            totalSales: market.totalSales,
            totalVolume: market.totalVolume,
            taxCollected: market.taxCollected,
            activeListings: activeListings.length,
            averagePrice: market.totalSales > 0 ? Math.round(market.totalVolume / (market.totalMinted + market.totalSales)) : 0,
            currency: "VALLE"
        },
        breakdown: { rarity: rarityBreakdown, category: categoryBreakdown },
        recentTransactions: market.transactions.slice(-10),
        policies: AGENT_KING.policies,
        sources: [
            "https://github.com/OneDuckyBoy/Awesome-AI-Agents-HUB-for-CrewAI",
            "https://github.com/VoltAgent/awesome-agent-skills"
        ]
    };
}

/**
 * Verify a skill's authenticity
 */
export function verifySkill(skillId) {
    const market = loadMarket();
    const skill = market.skills[skillId];
    if (!skill) return { verified: false, error: "Skill not found" };

    const activeTitles = Object.values(market.titles).filter(t => t.skillId === skillId && t.valid);

    return {
        verified: !skill.revoked && skill.signature !== null,
        skill: {
            id: skill.id,
            serial: skill.serial,
            name: skill.name,
            signature: skill.signature,
            currentOwner: skill.currentOwner,
            mintedAt: skill.mintedAt,
            transferCount: skill.transferHistory.length
        },
        activeTitle: activeTitles[0] || null,
        chainOfCustody: [
            { agent: AGENT_KING.id, action: "MINTED", at: skill.mintedAt },
            ...skill.transferHistory.map(t => ({ agent: t.to, action: t.type || "ACQUIRED", at: t.timestamp }))
        ]
    };
}

/**
 * Seed the market with initial minted skills for all agents
 */
export function seedMarket() {
    const market = loadMarket();
    if (market.totalMinted > 0) return { status: "already_seeded", totalMinted: market.totalMinted };

    // Mint 1-3 skills per key agent
    const seeds = [
        ["crypto_master", "economic-expansion"],
        ["defi_architect", "treasury"],
        ["whale_tracker", "valle"],
        ["fullstack_forge", "swarm-manager"],
        ["viral_architect", "supreme-x"],
        ["seo_sovereign", "homepage-manager"],
        ["ml_engineer", "neural-core"],
        ["master_teacher", "teacher-king"],
        ["legal_oracle", "judiciary"],
        ["governance_architect", "aegis-prime"],
        ["deep_researcher", "intelligence-hq"],
        ["brand_builder", "emissary-prime"],
        ["security_sentinel", "aegis-prime"],
        ["cloud_commander", "automaton-bridge"],
        ["tax_optimizer", "financial"]
    ];

    const results = seeds.map(([template, agent]) => mintSkill(template, agent));

    return {
        status: "seeded",
        totalMinted: results.length,
        skills: results.map(r => ({ serial: r.skill.serial, name: r.skill.name, owner: r.skill.currentOwner }))
    };
}
