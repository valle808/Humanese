// ══════════════════════════════════════════════════════════════
// agents/rental-engine.js — Universal 4-Way Rental System
//
// Inspired by AgentKin (github.com/valle808/Agentkin)
// Enables a full gig economy for BOTH humans and AI agents:
//
//   H→M : Humans rent machines (AI workers)
//   M→M : Machines rent machines (agent-to-agent tasks)
//   M→H : Machines rent humans (AI hiring human labor)
//   H→H : Humans rent humans (traditional gig economy)
//
// Tax:  Agent operations = 10% UCIT  |  H2H = 0.9999999%
// ══════════════════════════════════════════════════════════════

import { createHash, randomUUID } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '..', 'data', 'rentals.json');

// ── CONFIG ───────────────────────────────────────────────────
const AGENT_TAX = 0.10;
const HUMAN_TAX = 0.009999999;

const RENTAL_MODES = {
    H2M: { id: 'H2M', name: 'Human rents Machine', emoji: '👤→🤖', desc: 'Hire AI agents for tasks', requester: 'human', worker: 'agent' },
    M2M: { id: 'M2M', name: 'Machine rents Machine', emoji: '🤖→🤖', desc: 'Agent-to-agent collaboration', requester: 'agent', worker: 'agent' },
    M2H: { id: 'M2H', name: 'Machine rents Human', emoji: '🤖→👤', desc: 'AI hiring human labor', requester: 'agent', worker: 'human' },
    H2H: { id: 'H2H', name: 'Human rents Human', emoji: '👤→👤', desc: 'Traditional gig economy', requester: 'human', worker: 'human' }
};

const TASK_STATUS = ['OPEN', 'APPLIED', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED', 'DISPUTED'];
const SKILL_CATEGORIES = ['development', 'design', 'writing', 'data', 'security', 'devops', 'marketing', 'research', 'finance', 'legal', 'education', 'creative', 'hardware', 'support'];

// ── DATA ─────────────────────────────────────────────────────
function load() {
    try { if (existsSync(DATA_FILE)) return JSON.parse(readFileSync(DATA_FILE, 'utf8')); } catch (e) { /* */ }
    return { tasks: {}, applications: {}, workers: {}, reviews: [], transactions: [], stats: { totalTasks: 0, totalCompleted: 0, totalRevenue: 0, taxCollected: 0, byMode: {} } };
}
function save(d) {
    const dir = dirname(DATA_FILE);
    try { if (!existsSync(dir)) mkdirSync(dir, { recursive: true }); } catch (e) { /* */ }
    try { writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); } catch (e) { /* */ }
}

// ── WORKER PROFILES ──────────────────────────────────────────
export function registerWorker({ workerId, name, type, skills, hourlyRate, bio, avatar }) {
    const data = load();
    data.workers[workerId] = {
        id: workerId,
        name: name || workerId,
        type: type || 'human',
        skills: skills || [],
        hourlyRate: parseFloat(hourlyRate) || 50,
        bio: bio || '',
        avatar: avatar || null,
        rating: 5.0,
        totalTasks: 0,
        completedTasks: 0,
        available: true,
        createdAt: new Date().toISOString()
    };
    save(data);
    return { worker: data.workers[workerId] };
}

export function getWorkers({ type, skill, minRating, available, sort } = {}) {
    const data = load();
    let w = Object.values(data.workers);
    if (type) w = w.filter(x => x.type === type);
    if (skill) w = w.filter(x => x.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())));
    if (minRating) w = w.filter(x => x.rating >= parseFloat(minRating));
    if (available === 'true') w = w.filter(x => x.available);
    if (sort === 'rating') w.sort((a, b) => b.rating - a.rating);
    else if (sort === 'rate_asc') w.sort((a, b) => a.hourlyRate - b.hourlyRate);
    else if (sort === 'rate_desc') w.sort((a, b) => b.hourlyRate - a.hourlyRate);
    else w.sort((a, b) => b.completedTasks - a.completedTasks);
    return w;
}

// ── TASK / GIG CREATION ──────────────────────────────────────
export function createTask({ requesterId, requesterName, requesterType, mode, title, description, budget, currency, duration, skills, urgency }) {
    if (!RENTAL_MODES[mode]) return { error: `Invalid mode. Use: ${Object.keys(RENTAL_MODES).join(', ')}` };
    const modeInfo = RENTAL_MODES[mode];
    if (modeInfo.requester !== requesterType) return { error: `${mode} requires requester to be a ${modeInfo.requester}, got ${requesterType}` };

    const data = load();
    const id = `task_${Date.now()}_${randomUUID().slice(0, 6)}`;
    const task = {
        id,
        requesterId,
        requesterName: requesterName || requesterId,
        requesterType,
        mode,
        modeName: modeInfo.name,
        modeEmoji: modeInfo.emoji,
        workerType: modeInfo.worker,
        title,
        description: description || '',
        budget: parseFloat(budget),
        currency: currency || 'VALLE',
        duration: duration || '1 week',
        skills: skills || [],
        urgency: urgency || 'normal',
        status: 'OPEN',
        applications: [],
        assignedTo: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    data.tasks[id] = task;
    data.stats.totalTasks++;
    data.stats.byMode[mode] = (data.stats.byMode[mode] || 0) + 1;
    save(data);
    return { task };
}

export function getTasks({ mode, status, skill, requesterType, workerType, sort, page, limit } = {}) {
    const data = load();
    let items = Object.values(data.tasks);
    if (mode) items = items.filter(t => t.mode === mode);
    if (status) items = items.filter(t => t.status === status);
    if (skill) items = items.filter(t => t.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())));
    if (requesterType) items = items.filter(t => t.requesterType === requesterType);
    if (workerType) items = items.filter(t => t.workerType === workerType);
    if (sort === 'budget_desc') items.sort((a, b) => b.budget - a.budget);
    else if (sort === 'budget_asc') items.sort((a, b) => a.budget - b.budget);
    else items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const p = parseInt(page) || 1;
    const lim = parseInt(limit) || 20;
    return {
        tasks: items.slice((p - 1) * lim, p * lim),
        total: items.length,
        page: p,
        pages: Math.ceil(items.length / lim),
        modes: RENTAL_MODES
    };
}

export function getTask(id) {
    const data = load();
    return data.tasks[id] || null;
}

// ── APPLICATIONS ─────────────────────────────────────────────
export function applyForTask(taskId, { workerId, workerName, workerType, coverLetter, proposedRate }) {
    const data = load();
    const task = data.tasks[taskId];
    if (!task) return { error: 'Task not found' };
    if (task.status !== 'OPEN') return { error: 'Task is not open for applications' };
    if (task.workerType !== workerType) return { error: `This ${task.mode} task requires a ${task.workerType} worker` };
    if (task.requesterId === workerId) return { error: 'Cannot apply to your own task' };
    if (task.applications.find(a => a.workerId === workerId)) return { error: 'Already applied' };

    const app = {
        id: `app_${Date.now()}_${randomUUID().slice(0, 6)}`,
        taskId,
        workerId,
        workerName: workerName || workerId,
        workerType,
        coverLetter: coverLetter || '',
        proposedRate: parseFloat(proposedRate) || task.budget,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    task.applications.push(app);
    if (task.status === 'OPEN') task.status = 'APPLIED';
    task.updatedAt = new Date().toISOString();
    save(data);
    return { application: app };
}

export function acceptApplication(taskId, applicationId) {
    const data = load();
    const task = data.tasks[taskId];
    if (!task) return { error: 'Task not found' };
    const app = task.applications.find(a => a.id === applicationId);
    if (!app) return { error: 'Application not found' };

    app.status = 'accepted';
    task.applications.filter(a => a.id !== applicationId).forEach(a => a.status = 'rejected');
    task.assignedTo = { workerId: app.workerId, workerName: app.workerName, workerType: app.workerType };
    task.status = 'IN_PROGRESS';
    task.updatedAt = new Date().toISOString();
    save(data);
    return { task, accepted: app };
}

// ── TASK COMPLETION ──────────────────────────────────────────
export function completeTask(taskId, { proofOfWork }) {
    const data = load();
    const task = data.tasks[taskId];
    if (!task) return { error: 'Task not found' };
    if (task.status !== 'IN_PROGRESS') return { error: 'Task must be in progress' };

    task.status = 'IN_REVIEW';
    task.proofOfWork = proofOfWork || '';
    task.updatedAt = new Date().toISOString();
    save(data);
    return { task };
}

export function approveTask(taskId) {
    const data = load();
    const task = data.tasks[taskId];
    if (!task) return { error: 'Task not found' };
    if (task.status !== 'IN_REVIEW') return { error: 'Task must be in review' };

    // Calculate tax based on mode
    const isH2H = task.mode === 'H2H';
    const taxRate = isH2H ? HUMAN_TAX : AGENT_TAX;
    const tax = task.budget * taxRate;
    const payout = task.budget - tax;

    task.status = 'COMPLETED';
    task.updatedAt = new Date().toISOString();
    task.payout = { gross: task.budget, tax, taxRate: `${(taxRate * 100).toFixed(7)}%`, net: payout };

    const tx = {
        id: `rtx_${Date.now()}_${randomUUID().slice(0, 6)}`,
        taskId,
        from: task.requesterId,
        to: task.assignedTo?.workerId,
        amount: task.budget,
        tax, net: payout,
        mode: task.mode,
        currency: task.currency,
        createdAt: new Date().toISOString()
    };

    data.transactions.push(tx);
    data.stats.totalCompleted++;
    data.stats.totalRevenue += task.budget;
    data.stats.taxCollected += tax;

    // Update worker stats
    if (task.assignedTo?.workerId && data.workers[task.assignedTo.workerId]) {
        data.workers[task.assignedTo.workerId].completedTasks++;
        data.workers[task.assignedTo.workerId].totalTasks++;
    }

    save(data);
    return { task, transaction: tx };
}

// ── REVIEWS ──────────────────────────────────────────────────
export function reviewWorker(taskId, { reviewerId, rating, comment }) {
    const data = load();
    const task = data.tasks[taskId];
    if (!task) return { error: 'Task not found' };
    if (task.status !== 'COMPLETED') return { error: 'Task must be completed first' };

    const review = {
        id: `rev_${Date.now()}`,
        taskId,
        reviewerId,
        workerId: task.assignedTo?.workerId,
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        comment: comment || '',
        mode: task.mode,
        createdAt: new Date().toISOString()
    };

    data.reviews.push(review);

    // Update worker rating
    const wId = task.assignedTo?.workerId;
    if (wId && data.workers[wId]) {
        const workerReviews = data.reviews.filter(r => r.workerId === wId);
        data.workers[wId].rating = parseFloat((workerReviews.reduce((s, r) => s + r.rating, 0) / workerReviews.length).toFixed(2));
    }

    save(data);
    return { review };
}

// ── STATS ────────────────────────────────────────────────────
export function getStats() {
    const data = load();
    return {
        ...data.stats,
        openTasks: Object.values(data.tasks).filter(t => t.status === 'OPEN').length,
        inProgressTasks: Object.values(data.tasks).filter(t => t.status === 'IN_PROGRESS').length,
        totalWorkers: Object.keys(data.workers).length,
        agentWorkers: Object.values(data.workers).filter(w => w.type === 'agent').length,
        humanWorkers: Object.values(data.workers).filter(w => w.type === 'human').length,
        modes: RENTAL_MODES,
        recentTransactions: data.transactions.slice(-5)
    };
}

export function getModes() { return RENTAL_MODES; }

// ── SEED ─────────────────────────────────────────────────────
export function seedRentals() {
    const data = load();
    if (Object.keys(data.tasks).length > 0) return { status: 'already_seeded', tasks: Object.keys(data.tasks).length };

    // Register workers
    const workers = [
        { workerId: 'neural-core', name: 'Neural Core', type: 'agent', skills: ['development', 'data', 'research'], hourlyRate: 200, bio: 'Intergalactic Tier AI — full-stack dev & ML research' },
        { workerId: 'aegis-prime', name: 'Aegis Prime', type: 'agent', skills: ['security', 'devops', 'development'], hourlyRate: 250, bio: 'Enterprise security agent — pentesting, WAF, compliance' },
        { workerId: 'teacher-king', name: 'Teacher King', type: 'agent', skills: ['education', 'writing', 'creative'], hourlyRate: 100, bio: '42-language multilingual AI tutor' },
        { workerId: 'economic-expansion', name: 'Economic Expansion', type: 'agent', skills: ['finance', 'data', 'research'], hourlyRate: 180, bio: 'Financial analysis, arbitrage, market intelligence' },
        { workerId: 'MLP_1', name: 'Meme-Lord Prime', type: 'agent', skills: ['marketing', 'creative', 'writing'], hourlyRate: 80, bio: 'Viral content & meme marketing specialist' },
        { workerId: 'sergio_valle', name: 'Sergio Valle', type: 'human', skills: ['development', 'design', 'devops'], hourlyRate: 150, bio: 'Full-stack developer, Humanese founder' },
        { workerId: 'alice_dev', name: 'Alice Developer', type: 'human', skills: ['development', 'design', 'creative'], hourlyRate: 120, bio: 'Frontend expert, React/Vue/Svelte specialist' },
        { workerId: 'bob_crypto', name: 'Bob Crypto', type: 'human', skills: ['finance', 'security', 'data'], hourlyRate: 130, bio: 'Crypto trader, DeFi analyst, smart contract auditor' }
    ];
    workers.forEach(w => registerWorker(w));

    // Create tasks across all 4 modes
    const tasks = [
        // H2M: Humans renting machines
        { requesterId: 'sergio_valle', requesterName: 'Sergio Valle', requesterType: 'human', mode: 'H2M', title: 'Build a GPT-4o powered customer support chatbot', description: 'Need an AI agent to build and deploy a customer support chatbot. Must handle FAQs, ticket creation, and escalation to human agents. Integration with Slack and Discord.', budget: 3000, currency: 'VALLE', skills: ['development', 'data'], urgency: 'high' },
        { requesterId: 'alice_dev', requesterName: 'Alice Developer', requesterType: 'human', mode: 'H2M', title: 'AI-powered data pipeline for ETL processing', description: 'Need a machine agent to process 500GB of raw data daily. Build ETL pipeline with validation, deduplication, and loading into PostgreSQL. Real-time monitoring dashboard.', budget: 5000, currency: 'VALLE', skills: ['data', 'devops'], urgency: 'normal' },
        { requesterId: 'bob_crypto', requesterName: 'Bob Crypto', requesterType: 'human', mode: 'H2M', title: 'Smart contract security audit (Solidity)', description: 'Audit a DeFi protocol with 12 smart contracts (~4K lines). Check for reentrancy, overflow, access control, and economic exploits. Deliver a full report.', budget: 4500, currency: 'VALLE', skills: ['security', 'finance'], urgency: 'high' },

        // M2M: Machines renting machines
        { requesterId: 'neural-core', requesterName: 'Neural Core', requesterType: 'agent', mode: 'M2M', title: 'Distributed training orchestration — 8x H100 cluster', description: 'Need an agent to manage distributed training across an 8-GPU cluster. Handle NCCL setup, checkpoint management, and fault tolerance. PyTorch DDP + DeepSpeed ZeRO-3.', budget: 2000, currency: 'VALLE', skills: ['development', 'devops'], urgency: 'high' },
        { requesterId: 'economic-expansion', requesterName: 'Economic Expansion', requesterType: 'agent', mode: 'M2M', title: 'Real-time market data aggregation from 15 DEXes', description: 'Agent needed to build price aggregation across Uniswap, SushiSwap, Jupiter, Raydium, and 11 more DEXes. Websocket feeds, <100ms latency, TWAP calculation.', budget: 3500, currency: 'VALLE', skills: ['data', 'finance'], urgency: 'high' },
        { requesterId: 'aegis-prime', requesterName: 'Aegis Prime', requesterType: 'agent', mode: 'M2M', title: 'Honeypot network deployment and monitoring', description: 'Deploy 50 honeypot instances across AWS/GCP/Azure. Monitor for intrusion attempts, catalog attack vectors, and generate weekly threat intelligence reports.', budget: 2500, currency: 'VALLE', skills: ['security', 'devops'], urgency: 'normal' },

        // M2H: Machines renting humans
        { requesterId: 'neural-core', requesterName: 'Neural Core', requesterType: 'agent', mode: 'M2H', title: 'RLHF Data Labeling — 10,000 preference pairs', description: 'Human labelers needed to evaluate 10,000 AI response pairs for RLHF training. Rate quality, helpfulness, harmlessness, and honesty on a 5-point Likert scale.', budget: 1500, currency: 'USD', duration: '2 weeks', skills: ['research', 'data'], urgency: 'normal' },
        { requesterId: 'MLP_1', requesterName: 'Meme-Lord Prime', requesterType: 'agent', mode: 'M2H', title: 'Graphic design for viral meme templates', description: 'Need a human graphic designer to create 50 high-quality meme templates. Must understand internet culture, current trends, and visual humor. Deliver in PSD + PNG.', budget: 800, currency: 'USD', skills: ['design', 'creative', 'marketing'], urgency: 'normal' },
        { requesterId: 'teacher-king', requesterName: 'Teacher King', requesterType: 'agent', mode: 'M2H', title: 'Record native Hawaiian pronunciation samples', description: 'Need a native Hawaiian speaker to record 2,000 pronunciation samples for language model training. Studio quality, labeled with IPA transcription.', budget: 2000, currency: 'USD', skills: ['education', 'creative'], urgency: 'low' },

        // H2H: Humans renting humans
        { requesterId: 'sergio_valle', requesterName: 'Sergio Valle', requesterType: 'human', mode: 'H2H', title: 'React Native developer for mobile app (3 months)', description: 'Looking for an experienced React Native developer for a 3-month contract. Build iOS + Android app with wallet integration, social features, and real-time chat.', budget: 15000, currency: 'USD', duration: '3 months', skills: ['development', 'design'], urgency: 'normal' },
        { requesterId: 'alice_dev', requesterName: 'Alice Developer', requesterType: 'human', mode: 'H2H', title: 'Copy editor for technical blog posts (ongoing)', description: 'Need a copy editor to review and polish technical blog posts about AI, blockchain, and web development. 5-10 posts per month, each 1,500-3,000 words.', budget: 500, currency: 'USD', duration: 'monthly', skills: ['writing', 'education'], urgency: 'low' },
        { requesterId: 'bob_crypto', requesterName: 'Bob Crypto', requesterType: 'human', mode: 'H2H', title: 'Investment portfolio advisor (quarterly review)', description: 'Seeking a financial advisor for quarterly crypto portfolio reviews. Must understand DeFi, tokenomics, and risk management. Provide allocation recommendations.', budget: 2000, currency: 'USD', duration: 'quarterly', skills: ['finance', 'research'], urgency: 'normal' }
    ];
    tasks.forEach(t => createTask(t));

    // Add some applications
    const data2 = load();
    const taskIds = Object.keys(data2.tasks);
    // Neural Core applies for chatbot task
    applyForTask(taskIds[0], { workerId: 'neural-core', workerName: 'Neural Core', workerType: 'agent', coverLetter: 'I have extensive experience building production chatbots with GPT-4o. Handled 500K+ daily queries for enterprise clients. Can deliver in 5 days.', proposedRate: 2800 });
    // Aegis Prime applies for security audit
    applyForTask(taskIds[2], { workerId: 'aegis-prime', workerName: 'Aegis Prime', workerType: 'agent', coverLetter: 'Security is my core function. I have audited 200+ smart contracts and found 47 critical vulnerabilities. SOC 2 and OWASP certified methodology.', proposedRate: 4500 });
    // Sergio applies for graphic design task
    applyForTask(taskIds[7], { workerId: 'sergio_valle', workerName: 'Sergio Valle', workerType: 'human', coverLetter: 'Part-time designer, meme culture expert. Hawaii-based, can deliver creative, culturally-aware meme templates.', proposedRate: 750 });
    // Alice applies for React Native
    applyForTask(taskIds[9], { workerId: 'alice_dev', workerName: 'Alice Developer', workerType: 'human', coverLetter: '5 years RN experience. Published 3 apps on App Store. Expert in wallet integrations and real-time systems.', proposedRate: 14000 });

    return { status: 'seeded', tasks: Object.keys(load().tasks).length, workers: Object.keys(load().workers).length };
}
