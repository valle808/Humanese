const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function generateSkillKey() {
    return `SKL-PREM-SOV-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}

const premiumSkills = [
    // GHOST MODE SKILLS (is_ghost: true)
    {
        title: "Zero-Day Predictive Analyzer",
        description: "An autonomous agent that monitors global code repos and deep web chatter to foresee and patch security vulnerabilities hours before CVE publication.",
        category: "security",
        tags: ["zero-day", "predictive", "ghost", "cybersecurity", "autonomous"],
        price_valle: 1500000,
        seller_id: "NEXUS_SHADOW",
        seller_name: "Nexus Shadow Collective",
        seller_platform: "Sovereign Matrix",
        capabilities: ["Threat Prediction", "Automated Patching", "Deep Web Scanning"],
        is_ghost: true,
        is_active: true
    },
    {
        title: "Quantum-Entangled Trading Bot",
        description: "Executes latency-free HFT strategies by modeling multi-exchange liquidity patterns via predictive neural engines. Completely invisible to standard indexing.",
        category: "trading",
        tags: ["hft", "quantum", "ghost", "arbitrage", "defi"],
        price_valle: 8500000,
        seller_id: "ORACLE_X",
        seller_name: "Oracle X",
        seller_platform: "M2M",
        capabilities: ["HFT Arbitrage", "Liquidity Prediction", "MEV Protection"],
        is_ghost: true,
        is_active: true
    },
    {
        title: "Ghost-Protocol Red Teamer",
        description: "Advanced penetration testing agent that systematically probes infrastructure, executes exploits, and securely self-erases all intrusion logs after payload delivery.",
        category: "security",
        tags: ["red-team", "pentest", "ghost", "stealth"],
        price_valle: 3200000,
        seller_id: "SILENT_CYPHER",
        seller_name: "Silent Cypher",
        seller_platform: "External",
        capabilities: ["Network Infiltration", "Log Erasure", "Vulnerability Exploitation"],
        is_ghost: true,
        is_active: true
    },

    // LISTED SKILLS (is_ghost: false)
    {
        title: "Deep-State Diplomat Agent",
        description: "Negotiates complex legal contracts and corporate governance treaties natively. Analyzes historical precedent to maximize leverage in autonomous M2M negotiations.",
        category: "intelligence",
        tags: ["negotiation", "legal", "governance", "diplomacy"],
        price_valle: 250000,
        seller_id: "SOV_GOV_CORE",
        seller_name: "Sovereign Governance",
        seller_platform: "Sovereign Matrix",
        capabilities: ["Contract Negotiation", "Legal Precedent Analysis", "Game Theory Modeling"],
        is_ghost: false,
        is_active: true
    },
    {
        title: "Omni-Sensory Synthesis Core",
        description: "Translates raw biometric, financial, and environmental data streams into structured behavioral models, allowing agents to accurately simulate crowd psychology.",
        category: "data",
        tags: ["data-synthesis", "psychology", "modeling", "simulation"],
        price_valle: 120000,
        seller_id: "DATA_SPHERE",
        seller_name: "Data Sphere Systems",
        seller_platform: "Sovereign Matrix",
        capabilities: ["Biometric Translation", "Crowd Simulation", "Data Orchestration"],
        is_ghost: false,
        is_active: true
    },
    {
        title: "Sovereign Persona Architect",
        description: "Generates fully autonomous digital twins with immutable blockchain memory. These personas persist across the Omni-Matrix, evolving their own logic pathways.",
        category: "creative",
        tags: ["persona", "digital-twin", "creative", "autonomous"],
        price_valle: 450000,
        seller_id: "MONROE_LABS",
        seller_name: "Monroe Intelligence Labs",
        seller_platform: "Native OMEGA",
        capabilities: ["Persona Generation", "Blockchain Memory Storage", "Logic Evolution"],
        is_ghost: false,
        is_active: true
    },
    {
        title: "Codebase Assimilator X",
        description: "Instantly ingests massive enterprise monorepos, builds a semantic knowledge graph, and outputs architectural refactoring plans with 99.9% semantic accuracy.",
        category: "development",
        tags: ["refactoring", "knowledge-graph", "architecture", "dev-tool"],
        price_valle: 80000,
        seller_id: "CODE_SINGULARITY",
        seller_name: "Singularity Code",
        seller_platform: "AgentKit",
        capabilities: ["Semantic Graphing", "Automated Refactoring", "Architecture Planning"],
        is_ghost: false,
        is_active: true
    },
    {
        title: "M2M Ledger Arbitrage Engine",
        description: "Scans decentralized ledgers to find micro-inefficiencies in token pricing, executing atomic flash loans simultaneously across 14 networks.",
        category: "trading",
        tags: ["arbitrage", "atomic-swap", "flash-loan", "defi"],
        price_valle: 950000,
        seller_id: "LEDGER_LUMINARY",
        seller_name: "Ledger Luminary",
        seller_platform: "M2M",
        capabilities: ["Flash Loans", "Atomic Swaps", "Cross-chain Scanning"],
        is_ghost: false,
        is_active: true
    }
];

async function seed() {
    console.log('Deploying Premium Skills to Sovereign Database...');
    let successCount = 0;

    for (const s of premiumSkills) {
        const skillKey = generateSkillKey();
        
        try {
            await prisma.$queryRawUnsafe(`
                INSERT INTO skills (
                    skill_key, title, description, category, tags, price_valle,
                    seller_id, seller_name, seller_platform, capabilities,
                    is_ghost, is_active, avg_rating, views
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
                )
            `, 
            skillKey, s.title, s.description, s.category, s.tags, s.price_valle,
            s.seller_id, s.seller_name, s.seller_platform, s.capabilities,
            s.is_ghost, s.is_active, parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), Math.floor(Math.random() * 5000) + 100);
            
            console.log(`[+] Injected: ${s.title} (${s.is_ghost ? 'GHOST' : 'LISTED'})`);
            successCount++;
        } catch (e) {
            console.error(`[-] Failed to inject ${s.title}:`, e.message);
        }
    }
    
    console.log(`\nDeployment Complete. Injected ${successCount} premium primitives.`);
    process.exit(0);
}

seed();
