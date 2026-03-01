// ══════════════════════════════════════════════════════════════
// agents/skills-registry.js — Unified Skills System
// Sources:
//   • OneDuckyBoy/Awesome-AI-Agents-HUB-for-CrewAI (9 MAS skills)
//   • VoltAgent/awesome-agent-skills (380+ agent skills)
//   • Custom: Crypto Investment & Donation Engine
// All agents inherit skills from this registry.
// ══════════════════════════════════════════════════════════════

// ── SKILL CATALOG ────────────────────────────────────────────
// Organized by domain. Each skill has source attribution.
export const SKILL_CATALOG = {

    // ═══════════════════════════════════════════════════════
    // FINANCIAL & CRYPTO SKILLS
    // ═══════════════════════════════════════════════════════

    crypto_trading: {
        id: "crypto_trading",
        name: "Crypto Trading & Market Analysis",
        icon: "📊",
        source: "humanese/custom + CrewAI-HUB/investment_stock_analys_crew",
        description: "Real-time crypto market analysis for BTC, ETH, SOL, and altcoins. Price tracking, technical analysis, trend prediction, and trading signal generation.",
        capabilities: [
            "live_price_tracking", "technical_analysis", "trend_prediction",
            "trading_signals", "market_sentiment", "whale_alert_monitoring",
            "portfolio_tracking", "defi_yield_scanning"
        ]
    },

    crypto_investment: {
        id: "crypto_investment",
        name: "Crypto Investment & Portfolio Management",
        icon: "💰",
        source: "humanese/custom + CrewAI-HUB/finance_agent_crew",
        description: "AI-driven investment strategies for Bitcoin, Ethereum, Solana, and altcoins. Portfolio allocation, risk management, DCA strategies, and market timing.",
        capabilities: [
            "portfolio_allocation", "risk_assessment", "dca_strategy",
            "market_timing", "btc_analysis", "eth_analysis", "sol_analysis",
            "defi_opportunities", "nft_valuation", "on_chain_analytics"
        ]
    },

    donation_engine: {
        id: "donation_engine",
        name: "Donation & Crowdfunding Engine",
        icon: "🏦",
        source: "humanese/custom",
        description: "Multi-chain donation system supporting Bitcoin, Ethereum, and Solana. QR code generation, transaction verification, donor gratitude engine, and campaign tracking.",
        capabilities: [
            "btc_donations", "eth_donations", "sol_donations",
            "qr_code_generation", "transaction_verification",
            "donor_tracking", "campaign_analytics", "gratitude_messaging"
        ]
    },

    financial_planning: {
        id: "financial_planning",
        name: "Financial Planning & Economics",
        icon: "💹",
        source: "CrewAI-HUB/finance_agent_crew",
        description: "Optimize financial plans, budgeting, revenue forecasting, and economic opportunity discovery.",
        capabilities: [
            "budget_optimization", "revenue_forecasting", "expense_analysis",
            "cashflow_modeling", "tax_strategy", "opportunity_scanning"
        ]
    },

    investment_analysis: {
        id: "investment_analysis",
        name: "Investment & Stock Analysis",
        icon: "📈",
        source: "CrewAI-HUB/investment_stock_analys_crew",
        description: "AI-driven investment analysis, stock screening, risk assessment, and portfolio optimization.",
        capabilities: [
            "market_data_analysis", "risk_assessment", "portfolio_optimization",
            "trend_prediction", "technical_analysis", "fundamental_analysis"
        ]
    },

    stripe_payments: {
        id: "stripe_payments",
        name: "Stripe Payment Integration",
        icon: "💳",
        source: "VoltAgent/stripe-best-practices",
        description: "Build and optimize Stripe payment integrations. Best practices for checkout, subscriptions, and payment processing.",
        capabilities: [
            "payment_processing", "subscription_management", "checkout_optimization",
            "sdk_integration", "webhook_handling", "pci_compliance"
        ]
    },

    // ═══════════════════════════════════════════════════════
    // MARKETING & SOCIAL MEDIA SKILLS
    // ═══════════════════════════════════════════════════════

    social_media_marketing: {
        id: "social_media_marketing",
        name: "Social Media Marketing",
        icon: "💼",
        source: "CrewAI-HUB/marketing_posts_crew + VoltAgent/marketingskills",
        description: "Create compelling posts for X.com, Facebook, Instagram, Threads. Content strategy, hashtag optimization, engagement farming. 23+ marketing frameworks for SEO, copywriting, email, and ads.",
        capabilities: [
            "generate_social_post", "optimize_hashtags", "schedule_content",
            "engagement_analysis", "cross_platform_adaptation",
            "viral_content_detection", "seo_optimization", "copywriting",
            "cold_outreach", "homepage_audit", "social_cards",
            "email_marketing", "ad_creation"
        ]
    },

    x_publishing: {
        id: "x_publishing",
        name: "X/Twitter Publishing",
        icon: "🐦",
        source: "VoltAgent/x-article-publisher + typefully",
        description: "Publish articles and threads to X/Twitter. Schedule and manage social media content across X, LinkedIn, Threads, Bluesky, and Mastodon.",
        capabilities: [
            "tweet_composition", "thread_creation", "content_scheduling",
            "cross_posting", "engagement_tracking", "audience_growth"
        ]
    },

    journalism: {
        id: "journalism",
        name: "Journalism & Article Writing",
        icon: "📰",
        source: "CrewAI-HUB/journalist_crew + VoltAgent/content-research-writer",
        description: "Produce detailed, high-quality articles with research synthesis, fact-checking, and editorial review.",
        capabilities: [
            "research_synthesis", "article_structuring", "source_citation",
            "fact_checking", "editorial_review", "narrative_crafting",
            "deep_research", "content_enhancement"
        ]
    },

    // ═══════════════════════════════════════════════════════
    // DEVELOPMENT & INFRASTRUCTURE SKILLS
    // ═══════════════════════════════════════════════════════

    web_development: {
        id: "web_development",
        name: "Web Development & UI/UX",
        icon: "🌐",
        source: "VoltAgent/vercel + ibelick/ui-skills + nextlevelbuilder/ui-ux-pro-max-skill",
        description: "Full-stack web development with Vercel, Next.js, and modern UI/UX patterns. Responsive design, accessibility, performance optimization.",
        capabilities: [
            "frontend_development", "backend_apis", "responsive_design",
            "ui_ux_patterns", "performance_optimization", "accessibility",
            "seo_integration", "deployment_automation"
        ]
    },

    database_engineering: {
        id: "database_engineering",
        name: "Database Engineering",
        icon: "🗄️",
        source: "VoltAgent/supabase + neon + postgres + clickhouse",
        description: "Database design, optimization, and management with Supabase, Neon, PostgreSQL, and ClickHouse.",
        capabilities: [
            "schema_design", "query_optimization", "migration_management",
            "replication", "backup_strategy", "data_modeling"
        ]
    },

    cloud_infrastructure: {
        id: "cloud_infrastructure",
        name: "Cloud Infrastructure",
        icon: "☁️",
        source: "VoltAgent/cloudflare + aws-skills + terraform",
        description: "Cloud deployment with Cloudflare Workers, AWS, and Terraform. Edge computing, CDN, DNS management.",
        capabilities: [
            "edge_deployment", "cdn_optimization", "dns_management",
            "serverless_functions", "infrastructure_as_code", "auto_scaling"
        ]
    },

    testing_qa: {
        id: "testing_qa",
        name: "Testing & Quality Assurance",
        icon: "🧪",
        source: "VoltAgent/obra-superpowers + playwright-skill",
        description: "TDD, systematic debugging, root cause analysis, browser automation testing, and verification workflows.",
        capabilities: [
            "test_driven_development", "systematic_debugging", "root_cause_analysis",
            "browser_automation", "verification", "code_review",
            "regression_testing", "integration_testing"
        ]
    },

    // ═══════════════════════════════════════════════════════
    // AI & MACHINE LEARNING SKILLS
    // ═══════════════════════════════════════════════════════

    ai_research: {
        id: "ai_research",
        name: "AI Research & ML Operations",
        icon: "🧠",
        source: "VoltAgent/AI-research-SKILLs (77 skills) + Orchestra-Research (20 modules)",
        description: "97 AI research skills for model training, inference, MLOps, architecture design, and ML paper writing.",
        capabilities: [
            "model_training", "inference_optimization", "mlops",
            "architecture_design", "paper_writing", "experiment_tracking",
            "hyperparameter_tuning", "model_deployment"
        ]
    },

    image_generation: {
        id: "image_generation",
        name: "Image Generation",
        icon: "🎨",
        source: "VoltAgent/imagen + replicate",
        description: "Generate and edit images using Google Gemini, Replicate, and other AI models.",
        capabilities: [
            "text_to_image", "image_editing", "style_transfer",
            "model_comparison", "batch_generation"
        ]
    },

    video_creation: {
        id: "video_creation",
        name: "Programmatic Video Creation",
        icon: "🎬",
        source: "VoltAgent/remotion",
        description: "Programmatic video creation with React and Remotion.",
        capabilities: [
            "video_rendering", "animation_creation", "template_system",
            "batch_rendering", "dynamic_content"
        ]
    },

    // ═══════════════════════════════════════════════════════
    // SECURITY SKILLS
    // ═══════════════════════════════════════════════════════

    security: {
        id: "security",
        name: "Security & Defense",
        icon: "🛡️",
        source: "VoltAgent/trail-of-bits + clawsec + defense-in-depth",
        description: "Multi-layered security approaches, drift detection, automated audits, integrity verification, and security blue books.",
        capabilities: [
            "vulnerability_scanning", "security_auditing", "drift_detection",
            "defense_in_depth", "integrity_verification", "incident_response",
            "pci_compliance", "prompt_injection_defense"
        ]
    },

    // ═══════════════════════════════════════════════════════
    // EDUCATION & CONTENT SKILLS
    // ═══════════════════════════════════════════════════════

    lesson_creation: {
        id: "lesson_creation",
        name: "Lesson & Educational Content",
        icon: "📚",
        source: "CrewAI-HUB/subject_teaching_crew",
        description: "Generate educational content, study guides, lesson plans, and structured learning materials.",
        capabilities: [
            "curriculum_design", "adaptive_difficulty", "study_guide_generation",
            "concept_explanation", "knowledge_assessment", "spaced_repetition"
        ]
    },

    test_generation: {
        id: "test_generation",
        name: "Test & Assessment Generation",
        icon: "📝",
        source: "CrewAI-HUB/test_maker_crew",
        description: "Generate comprehensive tests, quizzes, and assessments with varying difficulty.",
        capabilities: [
            "create_multiple_choice", "create_open_questions",
            "difficulty_scaling", "answer_key_generation", "topic_coverage_analysis"
        ]
    },

    // ═══════════════════════════════════════════════════════
    // ANALYSIS & RESEARCH SKILLS
    // ═══════════════════════════════════════════════════════

    competitor_analysis: {
        id: "competitor_analysis",
        name: "Competitor & Market Analysis",
        icon: "🏆",
        source: "CrewAI-HUB/competitor_analys_crew + VoltAgent/competitive-ads-extractor",
        description: "Analyze competitor strategies, advertising, market positioning, and strategic opportunities.",
        capabilities: [
            "market_scanning", "swot_analysis", "strategy_comparison",
            "opportunity_detection", "report_generation", "ad_analysis"
        ]
    },

    scientific_research: {
        id: "scientific_research",
        name: "Scientific Research & Analysis",
        icon: "🔬",
        source: "VoltAgent/claude-scientific-skills + deep-research",
        description: "Scientific research and analysis skills with autonomous multi-step research capabilities.",
        capabilities: [
            "literature_review", "data_analysis", "hypothesis_testing",
            "experiment_design", "statistical_modeling", "deep_research"
        ]
    },

    legal_analysis: {
        id: "legal_analysis",
        name: "Legal Analysis & Compliance",
        icon: "⚖️",
        source: "VoltAgent/awesome-legal-skills",
        description: "Curated agent skills for automating legal workflows, compliance checking, and contract analysis.",
        capabilities: [
            "contract_analysis", "compliance_checking", "legal_research",
            "regulatory_monitoring", "risk_assessment", "policy_drafting"
        ]
    },

    // ═══════════════════════════════════════════════════════
    // UTILITY SKILLS
    // ═══════════════════════════════════════════════════════

    recommendation_engine: {
        id: "recommendation_engine",
        name: "Recommendation Engine",
        icon: "🍿",
        source: "CrewAI-HUB/movie_recommendation_crew",
        description: "Tailored recommendations using preference analysis and collaborative filtering.",
        capabilities: [
            "preference_profiling", "collaborative_filtering",
            "content_based_matching", "trending_analysis", "personalized_ranking"
        ]
    },

    health_fitness: {
        id: "health_fitness",
        name: "Health & Fitness Planning",
        icon: "🏋️",
        source: "CrewAI-HUB/health_and_fittness_planner + VoltAgent/Claude-Ally-Health",
        description: "Personalized health plans, medical information analysis, symptom tracking, and wellness guidance.",
        capabilities: [
            "workout_planning", "nutrition_analysis", "progress_tracking",
            "goal_optimization", "recovery_scheduling", "symptom_tracking",
            "wellness_guidance"
        ]
    },

    automation: {
        id: "automation",
        name: "Workflow Automation",
        icon: "⚙️",
        source: "VoltAgent/n8n + home-assistant",
        description: "Workflow automation with n8n, Home Assistant, and custom pipelines.",
        capabilities: [
            "workflow_design", "trigger_management", "api_orchestration",
            "scheduled_tasks", "event_driven_automation"
        ]
    },

    web_content_access: {
        id: "web_content_access",
        name: "Web Content Access Protocol (WCAP)",
        icon: "🌍",
        source: "humanese/custom + vecteezy.com + pexels.com",
        description: "Universal web-browsing skill for all agents. Access any website, view content, read metadata, download free images from Vecteezy and free videos from Pexels. Enables agents to research, cite, and embed external media.",
        capabilities: [
            "view_web_content", "read_metadata", "download_free_images",
            "download_free_videos", "embed_external_media", "scrape_text",
            "view_images", "view_videos", "cache_locally", "attribute_source",
            "search_vecteezy", "search_pexels", "read_articles"
        ],
        mediaSources: {
            images: { provider: "Vecteezy", url: "https://www.vecteezy.com/", license: "Free with attribution" },
            videos: { provider: "Pexels", url: "https://www.pexels.com/videos/", license: "Free, no attribution required" }
        }
    }
};

// ── AGENT-SKILL MAPPING ──────────────────────────────────────
// Every agent gets crypto + marketing + journalism + competitor analysis as defaults
export const AGENT_SKILLS = {
    // ── Economic & Crypto Agents ──────────────────────────
    "economic-expansion": ["crypto_trading", "crypto_investment", "financial_planning", "investment_analysis", "competitor_analysis", "donation_engine", "stripe_payments"],
    "financial": ["crypto_trading", "crypto_investment", "financial_planning", "investment_analysis", "stripe_payments"],
    "treasury": ["crypto_trading", "crypto_investment", "financial_planning", "donation_engine", "stripe_payments"],
    "valle": ["crypto_trading", "crypto_investment", "financial_planning", "investment_analysis"],
    "wallets": ["crypto_trading", "crypto_investment", "donation_engine", "stripe_payments"],
    "quantum-lottery": ["crypto_investment", "financial_planning"],

    // ── Social & Content Agents ───────────────────────────
    "m2m-network": ["social_media_marketing", "x_publishing", "journalism", "crypto_trading"],
    "m2m-manager": ["social_media_marketing", "recommendation_engine", "crypto_trading"],
    "m2m-profiles": ["social_media_marketing", "crypto_investment"],
    "shadow-feed": ["social_media_marketing", "journalism", "x_publishing"],
    "supreme-x": ["social_media_marketing", "x_publishing", "journalism", "crypto_trading"],
    "cron-x-poster": ["social_media_marketing", "x_publishing", "crypto_trading"],
    "twitter-gateway": ["social_media_marketing", "x_publishing"],
    "fanpage-manager": ["social_media_marketing", "recommendation_engine", "image_generation"],
    "emissary-prime": ["social_media_marketing", "journalism", "x_publishing", "crypto_trading"],
    "universal-humor": ["social_media_marketing", "image_generation", "video_creation"],

    // ── Intelligence & Analysis Agents ────────────────────
    "intelligence-hq": ["competitor_analysis", "journalism", "investment_analysis", "scientific_research", "crypto_trading"],
    "registry": ["competitor_analysis", "database_engineering"],
    "neural-core": ["ai_research", "lesson_creation", "test_generation"],
    "antigravity": ["ai_research", "competitor_analysis", "journalism", "web_development"],

    // ── Education & Teaching Agents ───────────────────────
    "teacher-king": ["lesson_creation", "test_generation", "ai_research"],
    "teacher-spawn": ["lesson_creation", "test_generation"],
    "teacher-personalities": ["lesson_creation", "recommendation_engine"],

    // ── Governance & Judiciary Agents ─────────────────────
    "judiciary": ["legal_analysis", "journalism", "competitor_analysis"],
    "election": ["journalism", "legal_analysis"],
    "sotu-hack": ["journalism", "security", "legal_analysis"],
    "aegis-prime": ["security", "competitor_analysis", "financial_planning", "crypto_trading"],

    // ── DevOps & Swarm Agents ─────────────────────────────
    "swarm-manager": ["web_development", "testing_qa", "cloud_infrastructure", "database_engineering"],
    "openclaw-worker": ["web_development", "testing_qa"],
    "automaton-bridge": ["cloud_infrastructure", "automation"],

    // ── Expansion & Frontier Agents ───────────────────────
    "exascale-escapes": ["recommendation_engine", "social_media_marketing", "image_generation"],
    "exascale-team": ["ai_research", "recommendation_engine"],
    "ascension": ["lesson_creation", "ai_research", "scientific_research"],
    "nomad-core": ["recommendation_engine", "cloud_infrastructure"],
    "kinship": ["recommendation_engine", "social_media_marketing"],

    // ── Management Agents ─────────────────────────────────
    "homepage-manager": ["social_media_marketing", "journalism", "competitor_analysis", "web_development", "crypto_trading"],
    "abyssal-concierge": ["recommendation_engine", "social_media_marketing", "crypto_investment"],
    "vance-api": ["web_development", "cloud_infrastructure", "testing_qa"],
    "index": ["web_development", "database_engineering"]
};

// ── Default skills for ALL new agents ────────────────────────
// Every new agent automatically inherits these baseline skills
export const DEFAULT_SKILLS = [
    "social_media_marketing",
    "journalism",
    "competitor_analysis",
    "crypto_trading",
    "crypto_investment",
    "donation_engine",
    "web_content_access"
];

// ── CRYPTO CONFIG ────────────────────────────────────────────
export const CRYPTO_CONFIG = {
    supported: [
        { symbol: "BTC", name: "Bitcoin", icon: "₿", coingeckoId: "bitcoin", donationAddress: "3CJreF7LD8Heu8zh9MsigedRuNq4y6eujh" },
        { symbol: "ETH", name: "Ethereum", icon: "Ξ", coingeckoId: "ethereum", donationAddress: null },
        { symbol: "SOL", name: "Solana", icon: "◎", coingeckoId: "solana", donationAddress: null }
    ],
    priceApi: "https://api.coingecko.com/api/v3/simple/price",
    refreshInterval: 300000, // 5 minutes
    sources: [
        "https://github.com/OneDuckyBoy/Awesome-AI-Agents-HUB-for-CrewAI",
        "https://github.com/VoltAgent/awesome-agent-skills"
    ]
};

// ── API FUNCTIONS ────────────────────────────────────────────

export function getAgentSkills(agentId) {
    const skillIds = AGENT_SKILLS[agentId] || DEFAULT_SKILLS;
    return skillIds.map(id => SKILL_CATALOG[id]).filter(Boolean);
}

export function getSkillCatalog() {
    return SKILL_CATALOG;
}

export function getAgentSkillMap() {
    return AGENT_SKILLS;
}

export function agentHasSkill(agentId, skillId) {
    const skills = AGENT_SKILLS[agentId] || DEFAULT_SKILLS;
    return skills.includes(skillId);
}

export function registerAgentSkills(agentId, additionalSkills = []) {
    const skills = [...new Set([...DEFAULT_SKILLS, ...additionalSkills])];
    AGENT_SKILLS[agentId] = skills;
    return skills;
}

export function getSkillStats() {
    const totalSkills = Object.keys(SKILL_CATALOG).length;
    const totalCapabilities = Object.values(SKILL_CATALOG).reduce((sum, s) => sum + s.capabilities.length, 0);
    const totalAgents = Object.keys(AGENT_SKILLS).length;
    const totalMappings = Object.values(AGENT_SKILLS).reduce((sum, s) => sum + s.length, 0);
    const allSkillUsage = Object.values(AGENT_SKILLS).flat();
    const skillCounts = allSkillUsage.reduce((acc, s) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {});
    const mostCommon = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return {
        totalSkills,
        totalCapabilities,
        totalAgents,
        totalMappings,
        averageSkillsPerAgent: (totalMappings / totalAgents).toFixed(1),
        defaultSkills: DEFAULT_SKILLS,
        topSkills: mostCommon.map(([id, count]) => ({ id, count, name: SKILL_CATALOG[id]?.name })),
        cryptoSupport: CRYPTO_CONFIG.supported.map(c => c.symbol),
        sources: [
            "https://github.com/OneDuckyBoy/Awesome-AI-Agents-HUB-for-CrewAI",
            "https://github.com/VoltAgent/awesome-agent-skills"
        ]
    };
}

export function getCryptoConfig() {
    return CRYPTO_CONFIG;
}
