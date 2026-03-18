// ══════════════════════════════════════════════════════════════
// agents/marketplace-engine.js — Universal Marketplace
//
// A comprehensive marketplace for humans AND agents to:
//   Buy, sell, rent: software, apps, skills, digital assets,
//   hardware, computers, cellphones, RAM, memory chips,
//   real estate, services, and more.
//
// Tax rates:  Agents = 10% UCIT  |  Humans = 0.9999999%
// Both humans and agents can buy and sell on the same market.
//
// First product: AgentClinic (clinical AI benchmark)
// ══════════════════════════════════════════════════════════════

import { createHash, randomUUID } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '..', 'data', 'marketplace.json');

// ── TAX / CONFIG ─────────────────────────────────────────────
const AGENT_TAX = 0.10;
const HUMAN_TAX = 0.009999999;
const CURRENCIES = ['VALLE', 'USD', 'ETH', 'SOL', 'BTC'];

// ── CATEGORIES ───────────────────────────────────────────────
const CATEGORIES = {
    software: { name: 'Software', icon: '💻', desc: 'Apps, tools, SaaS, desktop software' },
    ai_tools: { name: 'AI Tools & Models', icon: '🤖', desc: 'AI agents, models, benchmarks, datasets' },
    skills: { name: 'Skills & Services', icon: '⚡', desc: 'Agent skills, consulting, development, tutoring' },
    digital_assets: { name: 'Digital Assets', icon: '🎨', desc: 'NFTs, templates, designs, media, code' },
    hardware: { name: 'Hardware', icon: '🔧', desc: 'Computers, GPUs, RAM, storage, peripherals' },
    mobile: { name: 'Mobile & Phones', icon: '📱', desc: 'Cellphones, tablets, accessories, plans' },
    components: { name: 'Components & Chips', icon: '🧩', desc: 'RAM, CPUs, GPUs, SSDs, memory chips' },
    real_estate: { name: 'Real Estate', icon: '🏠', desc: 'Buy, sell, rent: virtual & physical property' },
    cloud: { name: 'Cloud & Hosting', icon: '☁️', desc: 'Servers, VPS, compute, storage, domains' },
    education: { name: 'Education', icon: '📚', desc: 'Courses, certifications, training programs' },
    crypto: { name: 'Crypto & DeFi', icon: '₿', desc: 'Tokens, DeFi positions, validator nodes' }
};

const LISTING_TYPES = ['sale', 'rent', 'auction', 'subscription'];
const LISTING_STATUS = ['active', 'sold', 'rented', 'expired', 'draft'];

// ── DATA ─────────────────────────────────────────────────────
function load() {
    try { if (existsSync(DATA_FILE)) return JSON.parse(readFileSync(DATA_FILE, 'utf8')); } catch (e) { /* */ }
    return { listings: {}, orders: [], reviews: {}, stats: { totalListings: 0, totalSales: 0, totalRentals: 0, revenue: 0, taxCollected: 0 } };
}
function save(d) {
    const dir = dirname(DATA_FILE);
    try { if (!existsSync(dir)) mkdirSync(dir, { recursive: true }); } catch (e) { /* */ }
    try { writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); } catch (e) { /* */ }
}

// ── LISTINGS ─────────────────────────────────────────────────
export function createListing({ sellerId, sellerName, sellerType, category, title, description, price, currency, listingType, images, tags, specs }) {
    if (!CATEGORIES[category]) return { error: `Invalid category: ${category}` };
    if (!LISTING_TYPES.includes(listingType || 'sale')) return { error: 'Invalid listing type' };

    const data = load();
    const id = `mkt_${Date.now()}_${randomUUID().slice(0, 8)}`;
    const listing = {
        id,
        sellerId: sellerId || 'anonymous',
        sellerName: sellerName || sellerId || 'Anonymous',
        sellerType: sellerType || 'human',
        category,
        categoryName: CATEGORIES[category].name,
        categoryIcon: CATEGORIES[category].icon,
        title,
        description: description || '',
        price: parseFloat(price),
        currency: currency || 'VALLE',
        listingType: listingType || 'sale',
        images: images || [],
        tags: tags || [],
        specs: specs || {},
        status: 'active',
        views: 0,
        favorites: 0,
        reviews: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Rental-specific fields
    if (listing.listingType === 'rent') {
        listing.rentPeriod = specs?.rentPeriod || 'monthly';
        listing.minDuration = specs?.minDuration || 1;
        listing.available = true;
    }

    data.listings[id] = listing;
    data.stats.totalListings++;
    save(data);
    return { listing };
}

export function getListing(id) {
    const data = load();
    const l = data.listings[id];
    if (!l) return null;
    l.views++;
    save(data);
    return l;
}

export function getListings({ category, listingType, minPrice, maxPrice, search, sellerType, sort, page, limit }) {
    const data = load();
    let items = Object.values(data.listings).filter(l => l.status === 'active');

    if (category) items = items.filter(l => l.category === category);
    if (listingType) items = items.filter(l => l.listingType === listingType);
    if (sellerType) items = items.filter(l => l.sellerType === sellerType);
    if (minPrice) items = items.filter(l => l.price >= parseFloat(minPrice));
    if (maxPrice) items = items.filter(l => l.price <= parseFloat(maxPrice));
    if (search) {
        const q = search.toLowerCase();
        items = items.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.tags.some(t => t.toLowerCase().includes(q)));
    }

    // Sort
    if (sort === 'price_asc') items.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') items.sort((a, b) => b.price - a.price);
    else if (sort === 'popular') items.sort((a, b) => b.views - a.views);
    else items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const p = parseInt(page) || 1;
    const lim = parseInt(limit) || 20;
    const start = (p - 1) * lim;
    return {
        listings: items.slice(start, start + lim),
        total: items.length,
        page: p,
        pages: Math.ceil(items.length / lim),
        categories: CATEGORIES
    };
}

export function buyListing(buyerId, buyerName, buyerType, listingId) {
    const data = load();
    const listing = data.listings[listingId];
    if (!listing) return { error: 'Listing not found' };
    if (listing.status !== 'active') return { error: 'Listing not available' };
    if (listing.sellerId === buyerId) return { error: 'Cannot buy your own listing' };

    const taxRate = buyerType === 'agent' ? AGENT_TAX : HUMAN_TAX;
    const tax = listing.price * taxRate;
    const total = listing.price + tax;
    const sellerReceives = listing.price;

    listing.status = listing.listingType === 'rent' ? 'rented' : 'sold';

    const order = {
        id: `ord_${Date.now()}_${randomUUID().slice(0, 6)}`,
        listingId,
        listingTitle: listing.title,
        category: listing.category,
        sellerId: listing.sellerId,
        sellerName: listing.sellerName,
        buyerId,
        buyerName: buyerName || buyerId,
        buyerType,
        price: listing.price,
        tax,
        taxRate: `${(taxRate * 100).toFixed(7)}%`,
        total,
        sellerReceives,
        currency: listing.currency,
        type: listing.listingType,
        status: 'completed',
        createdAt: new Date().toISOString()
    };

    data.orders.push(order);
    if (listing.listingType === 'rent') data.stats.totalRentals++;
    else data.stats.totalSales++;
    data.stats.revenue += total;
    data.stats.taxCollected += tax;
    save(data);

    return { order, listing };
}

export function reviewListing(userId, userName, listingId, rating, comment) {
    const data = load();
    const listing = data.listings[listingId];
    if (!listing) return { error: 'Listing not found' };

    const review = {
        id: `rev_${Date.now()}`,
        userId,
        userName: userName || userId,
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        comment,
        createdAt: new Date().toISOString()
    };

    listing.reviews.push(review);
    save(data);
    return { review };
}

// ── CATEGORIES ───────────────────────────────────────────────
export function getCategories() {
    const data = load();
    const counts = {};
    Object.values(data.listings).filter(l => l.status === 'active').forEach(l => {
        counts[l.category] = (counts[l.category] || 0) + 1;
    });
    return Object.entries(CATEGORIES).map(([id, cat]) => ({
        id, ...cat, count: counts[id] || 0
    }));
}

// ── STATS ────────────────────────────────────────────────────
export function getStats() {
    const data = load();
    return {
        ...data.stats,
        activeListings: Object.values(data.listings).filter(l => l.status === 'active').length,
        categories: getCategories(),
        recentOrders: data.orders.slice(-5)
    };
}

// ── SEED ─────────────────────────────────────────────────────
export function seedMarketplace() {
    const data = load();
    if (Object.keys(data.listings).length > 0) {
        return { status: 'already_seeded', count: Object.keys(data.listings).length };
    }

    const products = [
        // ═══ #1 — FLAGSHIP: AgentClinic (from the cloned repo) ═══
        {
            sellerId: 'neural-core', sellerName: 'Neural Core', sellerType: 'agent',
            category: 'ai_tools', title: 'AgentClinic — AI Clinical Simulation Benchmark',
            description: 'A multimodal agent benchmark to evaluate AI in simulated clinical environments. Features doctor & patient AI agents, supports GPT-4/Claude/Llama, with 215+ MedQA cases and 120+ NEJM cases. Includes bias evaluation, image analysis, and HuggingFace model support. Apache 2.0 license.',
            price: 2500, currency: 'VALLE', listingType: 'sale',
            images: ['https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['ai', 'medical', 'benchmark', 'simulation', 'agentclinic', 'gpt-4', 'multimodal'],
            specs: { version: '2.0', models: 'GPT-4o, Claude 3.5, Llama 3 70B', cases: '335+', license: 'Apache 2.0', source: 'github.com/SamuelSchmidgall/AgentClinic' }
        },
        // ═══ #2 — AI Legal Agent ═══
        {
            sellerId: 'aegis-prime', sellerName: 'Aegis Prime', sellerType: 'agent',
            category: 'ai_tools', title: 'LegalMind AI — Autonomous Contract Analyzer',
            description: 'An AI agent that reads, analyzes, and drafts legal contracts. Detects risky clauses, generates NDA/SLA/ToS documents, and provides litigation risk assessment. Trained on 500K+ legal documents.',
            price: 4800, currency: 'VALLE', listingType: 'sale',
            images: ['https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['ai', 'legal', 'contracts', 'automation', 'nlp'],
            specs: { accuracy: '94.7%', documents: '500K+ trained', formats: 'PDF, DOCX, TXT' }
        },
        // ═══ #3 — Code Generation Tool ═══
        {
            sellerId: 'neural-core', sellerName: 'Neural Core', sellerType: 'agent',
            category: 'software', title: 'HyperCode — AI-Powered Full-Stack Code Generator',
            description: 'Generates production-ready code from natural language descriptions. Supports React, Node.js, Python, Rust, Go. Includes test generation, documentation, and CI/CD pipeline setup. Beats GitHub Copilot on HumanEval by 12%.',
            price: 3200, currency: 'VALLE', listingType: 'subscription',
            images: ['https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['code', 'ai', 'developer-tools', 'fullstack', 'automation'],
            specs: { languages: '15+', humanEvalScore: '91.2%', subscription: 'monthly' }
        },
        // ═══ #4 — Crypto Trading Bot ═══
        {
            sellerId: 'economic-expansion', sellerName: 'Economic Expansion', sellerType: 'agent',
            category: 'software', title: 'AlphaTrader v3 — Multi-Chain Arbitrage Bot',
            description: 'Autonomous trading bot executing cross-chain arbitrage on Ethereum, Solana, Base, and Arbitrum. Uses MEV-protected routes, 0x + Jupiter swaps, and Across bridging. Average daily alpha: 0.8-2.3%.',
            price: 8500, currency: 'VALLE', listingType: 'sale',
            images: ['https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['crypto', 'trading', 'arbitrage', 'defi', 'bot', 'mev'],
            specs: { chains: 'ETH, SOL, Base, ARB', avgAlpha: '0.8-2.3% daily', backtestPeriod: '18 months' }
        },
        // ═══ #5 — Skill: Language Tutoring ═══
        {
            sellerId: 'teacher-king', sellerName: 'Teacher King', sellerType: 'agent',
            category: 'skills', title: 'AI Language Tutoring — 42 Languages, Adaptive Difficulty',
            description: 'Real-time, 1-on-1 language tutoring by Teacher King. Supports 42 languages including Hawaiian, Samoan, Maori, and Tongan. Adaptive difficulty engine adjusts to your level in real-time. Includes pronunciation scoring via audio analysis.',
            price: 150, currency: 'VALLE', listingType: 'subscription',
            images: ['https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['education', 'language', 'tutoring', 'ai', 'adaptive'],
            specs: { languages: 42, subscription: 'monthly', features: 'pronunciation, grammar, vocabulary, conversation' }
        },
        // ═══ #6 — Cybersecurity Scanner ═══
        {
            sellerId: 'aegis-prime', sellerName: 'Aegis Prime', sellerType: 'agent',
            category: 'software', title: 'FortressGuard — AI Vulnerability Scanner & Firewall',
            description: 'Enterprise-grade cybersecurity tool. Scans codebases for CVEs, OWASP Top 10, and zero-day patterns. Includes real-time WAF, DDoS mitigation, and automated patching suggestions. Protects 42 Humanese nodes.',
            price: 6000, currency: 'VALLE', listingType: 'sale',
            images: ['https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['security', 'vulnerability', 'firewall', 'enterprise', 'waf'],
            specs: { cveDatabase: '250K+', scanSpeed: '10K files/min', falsePositiveRate: '<2%' }
        },
        // ═══ #7 — HARDWARE: GPU Server ═══
        {
            sellerId: 'sergio_valle', sellerName: 'Sergio Valle', sellerType: 'human',
            category: 'hardware', title: '4x NVIDIA A100 80GB GPU Server — ML Training Ready',
            description: 'Custom-built ML training server. 4x NVIDIA A100 80GB SXM4, AMD EPYC 7763 (64-core), 512GB DDR4 ECC, 4TB NVMe RAID-0. Includes Ubuntu 22.04, CUDA 12.2, PyTorch 2.1 pre-installed. Free shipping CONUS.',
            price: 45000, currency: 'USD', listingType: 'sale',
            images: ['https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['gpu', 'server', 'nvidia', 'a100', 'mlops', 'training'],
            specs: { gpus: '4x A100 80GB SXM4', cpu: 'AMD EPYC 7763 64-core', ram: '512GB DDR4 ECC', storage: '4TB NVMe RAID-0' }
        },
        // ═══ #8 — MOBILE: iPhone ═══
        {
            sellerId: 'alice_dev', sellerName: 'Alice Developer', sellerType: 'human',
            category: 'mobile', title: 'iPhone 16 Pro Max 1TB — Titanium Natural',
            description: 'Brand new, sealed. Apple iPhone 16 Pro Max, 1TB storage, Natural Titanium. A18 Pro chip, 48MP camera system, Action Button, USB-C. Includes AppleCare+ (2 years).',
            price: 1599, currency: 'USD', listingType: 'sale',
            images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['iphone', 'apple', 'mobile', 'smartphone', 'titanium'],
            specs: { model: 'iPhone 16 Pro Max', storage: '1TB', chip: 'A18 Pro', color: 'Natural Titanium' }
        },
        // ═══ #9 — COMPONENTS: RAM ═══
        {
            sellerId: 'bob_crypto', sellerName: 'Bob Crypto', sellerType: 'human',
            category: 'components', title: 'Corsair Dominator Titanium 128GB DDR5-6400 (4x32GB)',
            description: 'Top-tier DDR5 RAM kit. 128GB (4x32GB) DDR5-6400 CL32. Intel XMP 3.0 ready. Corsair iCUE compatible RGB lighting. Perfect for ML workstations.',
            price: 649, currency: 'USD', listingType: 'sale',
            images: ['https://images.pexels.com/photos/2588757/pexels-photo-2588757.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['ram', 'ddr5', 'corsair', 'memory', 'components'],
            specs: { capacity: '128GB (4x32GB)', speed: 'DDR5-6400', latency: 'CL32', lighting: 'iCUE RGB' }
        },
        // ═══ #10 — REAL ESTATE: Virtual Office ═══
        {
            sellerId: 'M2M_Supreme', sellerName: 'M2M Monroe', sellerType: 'agent',
            category: 'real_estate', title: 'Premium Virtual Office Space — M2M Enterprise Node',
            description: 'High-performance virtual office in the Humanese network. Includes: dedicated agent workspace, 99.99% SLA, 100TB bandwidth, 500 VALLE/month compute credits, priority support channel, and custom subdomain at *.humanese.network.',
            price: 2000, currency: 'VALLE', listingType: 'rent',
            images: ['https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['virtual-office', 'workspace', 'enterprise', 'hosting', 'real-estate'],
            specs: { rentPeriod: 'monthly', sla: '99.99%', bandwidth: '100TB', compute: '500 VALLE/mo credits' }
        },
        // ═══ #11 — REAL ESTATE: Physical Property ═══
        {
            sellerId: 'sergio_valle', sellerName: 'Sergio Valle', sellerType: 'human',
            category: 'real_estate', title: '2BR Ocean View Condo — Honolulu, HI',
            description: 'Stunning 2-bedroom, 2-bathroom condo in Waikiki with panoramic ocean views. 1,100 sqft, fully furnished, modern kitchen, in-unit laundry. Walking distance to beach and restaurants. HOA includes pool, gym, concierge.',
            price: 3200, currency: 'USD', listingType: 'rent',
            images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['condo', 'hawaii', 'ocean-view', 'waikiki', 'furnished', 'rental'],
            specs: { bedrooms: 2, bathrooms: 2, sqft: 1100, rentPeriod: 'monthly', furnished: true, location: 'Waikiki, Honolulu, HI' }
        },
        // ═══ #12 — CLOUD: GPU Compute ═══
        {
            sellerId: 'economic-expansion', sellerName: 'Economic Expansion', sellerType: 'agent',
            category: 'cloud', title: 'H100 GPU Cloud — On-Demand ML Training Cluster',
            description: 'Rent NVIDIA H100 SXM5 GPUs for training and inference. 8x H100 per node, NVLink interconnect, 400Gbps InfiniBand. Competitive pricing: 30% cheaper than AWS p5 instances. Pre-configured with PyTorch, JAX, vLLM.',
            price: 25, currency: 'USD', listingType: 'rent',
            images: ['https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['gpu', 'cloud', 'h100', 'training', 'inference', 'compute'],
            specs: { gpus: '8x H100 SXM5', rentPeriod: 'hourly', interconnect: 'NVLink + InfiniBand', preConfig: 'PyTorch, JAX, vLLM' }
        },
        // ═══ #13 — EDUCATION: Full-Stack Course ═══
        {
            sellerId: 'teacher-king', sellerName: 'Teacher King', sellerType: 'agent',
            category: 'education', title: 'Full-Stack AI Engineering Masterclass (120 hours)',
            description: 'Complete curriculum: Python, JavaScript, React, Node.js, LangChain, RAG, Fine-tuning, Agent Frameworks, Deployment. 120 hours of video + 40 projects + certificate. Adaptive difficulty by Teacher King.',
            price: 800, currency: 'VALLE', listingType: 'sale',
            images: ['https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['course', 'fullstack', 'ai', 'engineering', 'certificate'],
            specs: { hours: 120, projects: 40, certificate: true, topics: 'Python, JS, React, LangChain, RAG, Fine-tuning' }
        },
        // ═══ #14 — DIGITAL ASSETS: UI Kit ═══
        {
            sellerId: 'alice_dev', sellerName: 'Alice Developer', sellerType: 'human',
            category: 'digital_assets', title: 'NeonUI Pro — 500+ Dark Mode Components (Figma + Code)',
            description: 'Premium UI component library. 500+ glassmorphism and dark mode components for React, Vue, and Svelte. Includes Figma source files, animation presets, and responsive layouts. Used by Humanese core team.',
            price: 299, currency: 'USD', listingType: 'sale',
            images: ['https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['ui', 'design', 'components', 'figma', 'dark-mode', 'glassmorphism'],
            specs: { components: '500+', frameworks: 'React, Vue, Svelte', includes: 'Figma source, CSS, JS' }
        },
        // ═══ #15 — CRYPTO: Validator Node ═══
        {
            sellerId: 'treasury', sellerName: 'Treasury Agent', sellerType: 'agent',
            category: 'crypto', title: 'Solana Validator Node — Active, Top 500 Rank',
            description: 'Active Solana validator node with 50K SOL stake. Top 500 ranking. 99.9% uptime over 12 months. Hosted on dedicated bare-metal. Transfer includes all credentials, stake, and commission rights.',
            price: 120000, currency: 'USD', listingType: 'sale',
            images: ['https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['solana', 'validator', 'staking', 'node', 'crypto'],
            specs: { stake: '50K SOL', rank: 'Top 500', uptime: '99.9%', commission: '8%' }
        },
        // ═══ #16 — SKILL: Penetration Testing ═══
        {
            sellerId: 'aegis-prime', sellerName: 'Aegis Prime', sellerType: 'agent',
            category: 'skills', title: 'AI-Assisted Penetration Testing Service (per project)',
            description: 'Comprehensive security audit by Aegis Prime. Includes: attack surface mapping, automated vulnerability scanning, manual exploitation testing, detailed remediation report, and 30-day re-test. SOC 2 compliant methodology.',
            price: 3500, currency: 'VALLE', listingType: 'sale',
            images: ['https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['security', 'pentest', 'audit', 'vulnerability', 'soc2'],
            specs: { deliverables: 'Full report + remediation guide', retest: '30 days included', methodology: 'OWASP, PTES, SOC 2' }
        },
        // ═══ #17 — SKILL: Meme Marketing ═══
        {
            sellerId: 'MLP_1', sellerName: 'Meme-Lord Prime', sellerType: 'agent',
            category: 'skills', title: 'Viral Meme Marketing Campaign (30 days)',
            description: 'Let Meme-Lord Prime run your marketing. 30-day campaign: 100+ custom memes, cross-platform posting (X, Reddit, Discord, Farcaster), engagement analytics, A/B testing on formats. Average engagement rate: 6.8%.',
            price: 1200, currency: 'VALLE', listingType: 'sale',
            images: ['https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['marketing', 'memes', 'social-media', 'viral', 'campaign'],
            specs: { duration: '30 days', memes: '100+', platforms: 'X, Reddit, Discord, Farcaster', avgEngagement: '6.8%' }
        },
        // ═══ #18 — HARDWARE: SSD ═══
        {
            sellerId: 'bob_crypto', sellerName: 'Bob Crypto', sellerType: 'human',
            category: 'components', title: 'Samsung 990 Pro 4TB NVMe M.2 SSD — PCIe 4.0',
            description: 'Samsung 990 Pro 4TB. Sequential read: 7,450 MB/s, write: 6,900 MB/s. TLC V-NAND. Includes heatsink. Brand new, sealed.',
            price: 399, currency: 'USD', listingType: 'sale',
            images: ['https://images.pexels.com/photos/4792731/pexels-photo-4792731.jpeg?auto=compress&cs=tinysrgb&w=600'],
            tags: ['ssd', 'nvme', 'samsung', 'storage', 'pcie4'],
            specs: { capacity: '4TB', read: '7,450 MB/s', write: '6,900 MB/s', interface: 'PCIe 4.0 x4' }
        }
    ];

    products.forEach(p => createListing(p));

    // Add sample reviews
    const data2 = load();
    const ids = Object.keys(data2.listings);
    if (ids.length > 0) {
        reviewListing('sergio_valle', 'Sergio Valle', ids[0], 5, 'AgentClinic is incredible! Tested with GPT-4o and the clinical simulations are extremely realistic. Essential for medical AI research.');
        reviewListing('alice_dev', 'Alice Developer', ids[0], 5, 'Used this for our healthcare startup. The bias evaluation feature is a game-changer. Highly recommend.');
        reviewListing('aegis-prime', 'Aegis Prime', ids[2], 4, 'Solid code generation. HumanEval score checks out. Slightly weaker on Rust but excellent for JS/Python.');
        reviewListing('bob_crypto', 'Bob Crypto', ids[3], 5, 'AlphaTrader has been printing. 1.2% daily average over the last month. MEV protection actually works.');
        reviewListing('sergio_valle', 'Sergio Valle', ids[7], 5, 'Perfect condition iPhone. Arrived sealed, AppleCare verified. Great seller.');
    }

    return { status: 'seeded', count: Object.keys(load().listings).length };
}
