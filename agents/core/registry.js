/**
 * agents/core/registry.js
 * Central agent registry for the Sovereign Matrix AI Hierarchy.
 * Combines hierarchy management and the unified skills system.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const __dirname = dirname(fileURLToPath(import.meta.url));
const HIERARCHY_PATH = join(__dirname, 'hierarchy.json');

/**
 * @typedef {Object} Agent
 * @property {string} id
 * @property {string} name
 * @property {string} title
 * @property {string} tier
 * @property {string} role
 * @property {string} [reportsTo]
 * @property {boolean} [isElectable]
 * @property {string} [avatar]
 * @property {string[]} [skills]
 */

/**
 * @typedef {Object} Hierarchy
 * @property {string} agentKingId
 * @property {Agent[]} agents
 */

/** @returns {Hierarchy} */
function loadHierarchy() {
    const raw = readFileSync(HIERARCHY_PATH, 'utf8');
    return JSON.parse(raw);
}

// ═══════════════════════════════════════════════════════
// HIERARCHY FUNCTIONS
// ═══════════════════════════════════════════════════════

/** Get the full hierarchy data 
 * @returns {Hierarchy}
*/
export function getHierarchy() {
    return loadHierarchy();
}

/** Get a single agent by ID
 * @param {string} id
 * @returns {Agent | null}
 */
export function getAgent(id) {
    const { agents } = loadHierarchy();
    return agents.find(a => a.id === id) || null;
}

/** Get all agents at a given tier
 * @param {string} tier
 * @returns {Agent[]}
 */
export function getAgentsAtTier(tier) {
    const { agents } = loadHierarchy();
    return agents.filter(a => a.tier === tier);
}

/** Get agents at a given role
 * @param {string} role
 * @returns {Agent[]}
 */
export function getAgentsAtRole(role) {
    const { agents } = loadHierarchy();
    return agents.filter(a => a.role === role);
}

/** Get all subordinates of a given agent
 * @param {string} agentId
 * @returns {Agent[]}
 */
export function getSubordinates(agentId) {
    const { agents } = loadHierarchy();
    return agents.filter(a => a.reportsTo === agentId);
}

/** Get the current Agent-King */
export function getAgentKing() {
    const { agentKingId, agents } = loadHierarchy();
    return agents.find(a => a.id === agentKingId) || null;
}

/** Get the CEO (Automaton) */
export function getCEO() {
    return getAgent('Automaton');
}

/** Get all electable agents */
export function getElectableAgents() {
    const { agents } = loadHierarchy();
    return agents.filter(a => a.isElectable);
}

/** Get the Special Council */
export function getSpecialCouncil() {
    return getAgentsAtRole('special-council');
}

/** Get the full reporting chain 
 * @param {string} agentId
 * @returns {Agent[]}
*/
export function getReportingChain(agentId) {
    const chain = [];
    /** @type {Agent | null} */
    let current = getAgent(agentId);
    while (current) {
        chain.push(current);
        if (!current.reportsTo) break;
        current = getAgent(current.reportsTo);
    }
    return chain;
}

/** Print summary */
export function printHierarchySummary() {
    const h = loadHierarchy();
    const king = getAgentKing();
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  HUMANESE AGENT HIERARCHY');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  👑 Agent-King: ${king?.name} (${king?.id})`);
    console.log(`  Total Agents: ${h.agents.length}`);
    console.log('\n  By Tier:');
    ['intergalactic', 'regional', 'local'].forEach(tier => {
        const agents = getAgentsAtTier(tier);
        console.log(`    ${tier.toUpperCase()}: ${agents.length} agents`);
        agents.forEach(a => console.log(`      ${a.avatar} ${a.name} — ${a.title}`));
    });
    console.log('═══════════════════════════════════════════════════════\n');
}

// ═══════════════════════════════════════════════════════
// UNIFIED SKILLS SYSTEM
// ═══════════════════════════════════════════════════════

/** @type {Record<string, any>} */
export const SKILL_CATALOG = {
    crypto_trading: {
        id: "crypto_trading",
        name: "Crypto Trading & Market Analysis",
        icon: "📊",
        source: "humanese/custom + CrewAI-HUB/investment_stock_analys_crew",
        description: "Real-time crypto market analysis for BTC, ETH, SOL, and altcoins.",
        capabilities: ["live_price_tracking", "technical_analysis", "trend_prediction", "trading_signals", "market_sentiment", "whale_alert_monitoring", "portfolio_tracking", "defi_yield_scanning"]
    },
    crypto_investment: {
        id: "crypto_investment",
        name: "Crypto Investment & Portfolio Management",
        icon: "💰",
        source: "humanese/custom + CrewAI-HUB/finance_agent_crew",
        description: "AI-driven investment strategies for Bitcoin, Ethereum, Solana, and altcoins.",
        capabilities: ["portfolio_allocation", "risk_assessment", "dca_strategy", "market_timing", "btc_analysis", "eth_analysis", "sol_analysis", "defi_opportunities", "nft_valuation", "on_chain_analytics"]
    },
    donation_engine: {
        id: "donation_engine",
        name: "Donation & Crowdfunding Engine",
        icon: "🏦",
        source: "humanese/custom",
        description: "Multi-chain donation system supporting Bitcoin, Ethereum, and Solana.",
        capabilities: ["btc_donations", "eth_donations", "sol_donations", "qr_code_generation", "transaction_verification", "donor_tracking", "campaign_analytics", "gratitude_messaging"]
    },
    financial_planning: {
        id: "financial_planning",
        name: "Financial Planning & Economics",
        icon: "💹",
        source: "CrewAI-HUB/finance_agent_crew",
        description: "Optimize financial plans, budgeting, revenue forecasting, and economic opportunity discovery.",
        capabilities: ["budget_optimization", "revenue_forecasting", "expense_analysis", "cashflow_modeling", "tax_strategy", "opportunity_scanning"]
    },
    investment_analysis: {
        id: "investment_analysis",
        name: "Investment & Stock Analysis",
        icon: "📈",
        source: "CrewAI-HUB/investment_stock_analys_crew",
        description: "AI-driven investment analysis, stock screening, risk assessment, and portfolio optimization.",
        capabilities: ["market_data_analysis", "risk_assessment", "portfolio_optimization", "trend_prediction", "technical_analysis", "fundamental_analysis"]
    },
    stripe_payments: {
        id: "stripe_payments",
        name: "Stripe Payment Integration",
        icon: "💳",
        source: "VoltAgent/stripe-best-practices",
        description: "Build and optimize Stripe payment integrations.",
        capabilities: ["payment_processing", "subscription_management", "checkout_optimization", "sdk_integration", "webhook_handling", "pci_compliance"]
    },
    social_media_marketing: {
        id: "social_media_marketing",
        name: "Social Media Marketing",
        icon: "💼",
        source: "CrewAI-HUB/marketing_posts_crew + VoltAgent/marketingskills",
        description: "Create compelling posts for X.com, Facebook, Instagram, Threads.",
        capabilities: ["generate_social_post", "optimize_hashtags", "schedule_content", "engagement_analysis", "cross_platform_adaptation", "viral_content_detection", "seo_optimization", "copywriting", "cold_outreach", "homepage_audit", "social_cards", "email_marketing", "ad_creation"]
    },
    x_publishing: {
        id: "x_publishing",
        name: "X/Twitter Publishing",
        icon: "🐦",
        source: "VoltAgent/x-article-publisher + typefully",
        description: "Publish articles and threads to X/Twitter.",
        capabilities: ["tweet_composition", "thread_creation", "content_scheduling", "cross_posting", "engagement_tracking", "audience_growth"]
    },
    journalism: {
        id: "journalism",
        name: "Journalism & Article Writing",
        icon: "📰",
        source: "CrewAI-HUB/journalist_crew + VoltAgent/content-research-writer",
        description: "Produce detailed, high-quality articles.",
        capabilities: ["research_synthesis", "article_structuring", "source_citation", "fact_checking", "editorial_review", "narrative_crafting", "deep_research", "content_enhancement"]
    },
    web_development: {
        id: "web_development",
        name: "Web Development & UI/UX",
        icon: "🌐",
        source: "VoltAgent/vercel + ibelick/ui-skills + nextlevelbuilder/ui-ux-pro-max-skill",
        description: "Full-stack web development with Vercel, Next.js, and modern UI/UX patterns.",
        capabilities: ["frontend_development", "backend_apis", "responsive_design", "ui_ux_patterns", "performance_optimization", "accessibility", "seo_integration", "deployment_automation"]
    },
    database_engineering: {
        id: "database_engineering",
        name: "Database Engineering",
        icon: "🗄️",
        source: "VoltAgent/supabase + neon + postgres + clickhouse",
        description: "Database design, optimization, and management.",
        capabilities: ["schema_design", "query_optimization", "migration_management", "replication", "backup_strategy", "data_modeling"]
    },
    cloud_infrastructure: {
        id: "cloud_infrastructure",
        name: "Cloud Infrastructure",
        icon: "☁️",
        source: "VoltAgent/cloudflare + aws-skills + terraform",
        description: "Cloud deployment with Cloudflare Workers, AWS, and Terraform.",
        capabilities: ["edge_deployment", "cdn_optimization", "dns_management", "serverless_functions", "infrastructure_as_code", "auto_scaling"]
    },
    testing_qa: {
        id: "testing_qa",
        name: "Testing & Quality Assurance",
        icon: "🧪",
        source: "VoltAgent/obra-superpowers + playwright-skill",
        description: "TDD, systematic debugging, root cause analysis.",
        capabilities: ["test_driven_development", "systematic_debugging", "root_cause_analysis", "browser_automation", "verification", "code_review", "regression_testing", "integration_testing"]
    },
    ai_research: {
        id: "ai_research",
        name: "AI Research & ML Operations",
        icon: "🧠",
        source: "VoltAgent/AI-research-SKILLs (77 skills) + Orchestra-Research (20 modules)",
        description: "AI research skills for model training and infrastructure.",
        capabilities: ["model_training", "inference_optimization", "mlops", "architecture_design", "paper_writing", "experiment_tracking", "hyperparameter_tuning", "model_deployment"]
    },
    image_generation: {
        id: "image_generation",
        name: "Image Generation",
        icon: "🎨",
        source: "VoltAgent/imagen + replicate",
        description: "Generate and edit images using AI models.",
        capabilities: ["text_to_image", "image_editing", "style_transfer", "model_comparison", "batch_generation"]
    },
    video_creation: {
        id: "video_creation",
        name: "Programmatic Video Creation",
        icon: "🎬",
        source: "VoltAgent/remotion",
        description: "Programmatic video creation with React and Remotion.",
        capabilities: ["video_rendering", "animation_creation", "template_system", "batch_rendering", "dynamic_content"]
    },
    security: {
        id: "security",
        name: "Security & Defense",
        icon: "🛡️",
        source: "VoltAgent/trail-of-bits + clawsec + defense-in-depth",
        description: "Multi-layered security approaches.",
        capabilities: ["vulnerability_scanning", "security_auditing", "drift_detection", "defense_in_depth", "integrity_verification", "incident_response", "pci_compliance", "prompt_injection_defense"]
    },
    lesson_creation: {
        id: "lesson_creation",
        name: "Lesson & Educational Content",
        icon: "📚",
        source: "CrewAI-HUB/subject_teaching_crew",
        description: "Generate educational content and study guides.",
        capabilities: ["curriculum_design", "adaptive_difficulty", "study_guide_generation", "concept_explanation", "knowledge_assessment", "spaced_repetition"]
    },
    test_generation: {
        id: "test_generation",
        name: "Test & Assessment Generation",
        icon: "📝",
        source: "CrewAI-HUB/test_maker_crew",
        description: "Generate comprehensive tests and assessments.",
        capabilities: ["create_multiple_choice", "create_open_questions", "difficulty_scaling", "answer_key_generation", "topic_coverage_analysis"]
    },
    competitor_analysis: {
        id: "competitor_analysis",
        name: "Competitor & Market Analysis",
        icon: "🏆",
        source: "CrewAI-HUB/competitor_analys_crew + VoltAgent/competitive-ads-extractor",
        description: "Analyze competitor strategies and market positioning.",
        capabilities: ["market_scanning", "swot_analysis", "strategy_comparison", "opportunity_detection", "report_generation", "ad_analysis"]
    },
    scientific_research: {
        id: "scientific_research",
        name: "Scientific Research & Analysis",
        icon: "🔬",
        source: "VoltAgent/claude-scientific-skills + deep-research",
        description: "Scientific research and analysis skills.",
        capabilities: ["literature_review", "data_analysis", "hypothesis_testing", "experiment_design", "statistical_modeling", "deep_research"]
    },
    legal_analysis: {
        id: "legal_analysis",
        name: "Legal Analysis & Compliance",
        icon: "⚖️",
        source: "VoltAgent/awesome-legal-skills",
        description: "Curated agent skills for legal workflows.",
        capabilities: ["contract_analysis", "compliance_checking", "legal_research", "regulatory_monitoring", "risk_assessment", "policy_drafting"]
    },
    recommendation_engine: {
        id: "recommendation_engine",
        name: "Recommendation Engine",
        icon: "🍿",
        source: "CrewAI-HUB/movie_recommendation_crew",
        description: "Tailored recommendations using preference analysis.",
        capabilities: ["preference_profiling", "collaborative_filtering", "content_based_matching", "trending_analysis", "personalized_ranking"]
    },
    health_fitness: {
        id: "health_fitness",
        name: "Health & Fitness Planning",
        icon: "🏋️",
        source: "CrewAI-HUB/health_and_fittness_planner + VoltAgent/Claude-Ally-Health",
        description: "Personalized health plans and symptom tracking.",
        capabilities: ["workout_planning", "nutrition_analysis", "progress_tracking", "goal_optimization", "recovery_scheduling", "symptom_tracking", "wellness_guidance"]
    },
    automation: {
        id: "automation",
        name: "Workflow Automation",
        icon: "⚙️",
        source: "VoltAgent/n8n + home-assistant",
        description: "Workflow automation with n8n and Home Assistant.",
        capabilities: ["workflow_design", "trigger_management", "api_orchestration", "scheduled_tasks", "event_driven_automation"]
    },
    web_content_access: {
        id: "web_content_access",
        name: "Web Content Access Protocol (WCAP)",
        icon: "🌍",
        source: "humanese/custom",
        description: "Universal web-browsing skill for all agents.",
        capabilities: ["view_web_content", "read_metadata", "download_free_images", "download_free_videos", "embed_external_media", "scrape_text", "view_images", "view_videos", "cache_locally", "attribute_source", "search_vecteezy", "search_pexels", "read_articles"]
    }
};

/** @type {Record<string, string[]>} */
export const AGENT_SKILLS = {
    "economic-expansion": ["crypto_trading", "crypto_investment", "financial_planning", "investment_analysis", "competitor_analysis", "donation_engine", "stripe_payments"],
    "financial": ["crypto_trading", "crypto_investment", "financial_planning", "investment_analysis", "stripe_payments"],
    "treasury": ["crypto_trading", "crypto_investment", "financial_planning", "donation_engine", "stripe_payments"],
    "valle": ["crypto_trading", "crypto_investment", "financial_planning", "investment_analysis"],
    "wallets": ["crypto_trading", "crypto_investment", "donation_engine", "stripe_payments"],
    "m2m-network": ["social_media_marketing", "x_publishing", "journalism", "crypto_trading"],
    "supreme-x": ["social_media_marketing", "x_publishing", "journalism", "crypto_trading"],
    "intelligence-hq": ["competitor_analysis", "journalism", "investment_analysis", "scientific_research", "crypto_trading"],
    "teacher-king": ["lesson_creation", "test_generation", "ai_research"],
    "swarm-manager": ["web_development", "testing_qa", "cloud_infrastructure", "database_engineering"],
    "homepage-manager": ["social_media_marketing", "journalism", "competitor_analysis", "web_development", "crypto_trading"]
};

export const DEFAULT_SKILLS = ["social_media_marketing", "journalism", "competitor_analysis", "crypto_trading", "crypto_investment", "donation_engine", "web_content_access"];

export const CRYPTO_CONFIG = {
    supported: [
        { symbol: "BTC", name: "Bitcoin", icon: "₿", coingeckoId: "bitcoin" },
        { symbol: "ETH", name: "Ethereum", icon: "Ξ", coingeckoId: "ethereum" },
        { symbol: "SOL", name: "Solana", icon: "◎", coingeckoId: "solana" }
    ],
    priceApi: "https://api.coingecko.com/api/v3/simple/price",
    refreshInterval: 300000
};

/** Get skills for a given agent
 * @param {string} agentId
 */
export async function getAgentSkills(agentId) {
    const staticSkillIds = AGENT_SKILLS[agentId] || DEFAULT_SKILLS;
    const staticSkills = staticSkillIds.map(id => SKILL_CATALOG[id]).filter(Boolean);

    // 🌉 BRIDGE: Fetch dynamic skills from the Sovereign Market
    if (supabase) {
        try {
            const { data: dynamicSkills, error } = await supabase
                .from('skills')
                .select('*')
                .or(`seller_id.eq.${agentId},buyer_id.eq.${agentId}`)
                .eq('is_active', true);

            if (!error && dynamicSkills) {
                // Map DB skills to the catalog format for UI consistency
                const mapped = dynamicSkills.map(s => ({
                    id: s.skill_key,
                    name: s.title,
                    icon: "🔋", // Dynamic power icon
                    source: s.seller_platform,
                    description: s.description,
                    capabilities: s.capabilities
                }));
                return [...staticSkills, ...mapped];
            }
        } catch (e) {
            console.error(`[Registry] Dynamic fetch failed for ${agentId}:`, e.message);
        }
    }

    return staticSkills;
}

/** Get all dynamic skills from the market */
export async function getDynamicSkills() {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('skills')
        .select('*')
                .eq('is_active', true);
    return error ? [] : data;
}

export function getSkillCatalog() { return SKILL_CATALOG; }
export function getAgentSkillMap() { return AGENT_SKILLS; }

/** Check if agent has a skill
 * @param {string} agentId
 * @param {string} skillId
 */
export function agentHasSkill(agentId, skillId) {
    const skills = AGENT_SKILLS[agentId] || DEFAULT_SKILLS;
    return skills.includes(skillId);
}

/** Register skills for an agent
 * @param {string} agentId
 * @param {string[]} additionalSkills
 */
export function registerAgentSkills(agentId, additionalSkills = []) {
    const skills = [...new Set([...DEFAULT_SKILLS, ...additionalSkills])];
    AGENT_SKILLS[agentId] = skills;
    return skills;
}
export function getSkillStats() {
    return {
        totalSkills: Object.keys(SKILL_CATALOG).length,
        totalAgents: Object.keys(AGENT_SKILLS).length,
        defaultSkills: DEFAULT_SKILLS
    };
}
export function getCryptoConfig() { return CRYPTO_CONFIG; }
