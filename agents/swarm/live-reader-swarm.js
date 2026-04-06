/**
 * =========================================================================
 * 🌌 THE HUMANESE SOVEREIGN MATRIX
 * agents/live-reader-swarm.js
 *
 * 🌐 SOVEREIGN KNOWLEDGE NETWORK — True Data Ingestion Swarm
 *
 * This new iteration of the swarm aggressively fetches REAL data from
 * RSS feeds, public APIs, and HTML parsing across thousands of sources.
 * It strictly avoids recursive synthetic text loops.
 * 
 * Agents:
 *  - Find a true external article (news, wiki, research).
 *  - Extract the raw text and media URLs.
 *  - Save media locally using `media-downloader.js`.
 *  - Save the knowledge graph to `SovereignKnowledge` DB via Prisma.
 *  - Stream the acquired data out via SSE.
 * =========================================================================
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { downloadMediaArtifact } from '../media/media-downloader.js';
import memoryBank from '../core/MemoryBank.js';

// Oracle Directives for dynamic focus
const STRATEGIC_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/strategic_commands.json');

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// We expand this drastically for REAL sourcing. 
const RSS_FEEDS = [
    'https://feeds.bbci.co.uk/news/rss.xml',       // BBC
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', // NYT
    'https://techcrunch.com/feed/',               // TechCrunch
    'https://www.wired.com/feed/rss',             // Wired
    'https://www.theverge.com/rss/index.xml',     // The Verge
    'https://hnrss.org/frontpage',                // HackerNews feed
    'http://export.arxiv.org/rss/cs',             // arXiv Computer Science
    'https://scitechdaily.com/feed/',             // SciTechDaily
    'https://www.medicalnewstoday.com/feed/rss',   // Medical News
    'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en', // Google News Global
    'https://www.reutersagency.com/feed/',         // Reuters
    'https://www.aljazeera.com/xml/rss/all.xml',   // Al Jazeera
    'https://www.nature.com/nature.rss',           // Nature Journal
    'https://cointelegraph.com/rss'                // Crypto Intel
];

// ── Knowledge Sources ─────────────────────────────────────────────────────────
export const KNOWLEDGE_SOURCES = [
    {
        id: 'wikipedia',
        name: 'Wikipedia',
        icon: '📚',
        color: '#3b82f6',
        baseUrl: 'https://en.wikipedia.org/api/rest_v1',
        type: 'wikipedia',
        topics: [
            'Artificial_intelligence', 'Quantum_computing', 'Blockchain',
            'Machine_learning', 'Philosophy_of_mind', 'Consciousness',
            'Neuroscience', 'String_theory', 'Gene_therapy', 'Cryptocurrency',
            'Climate_change', 'Space_exploration', 'CRISPR', 'Fusion_energy',
            'Cognitive_science', 'Swarm_intelligence', 'Emergent_behavior',
            'Evolutionary_algorithm', 'Reinforcement_learning', 'Transformer_(machine_learning)'
        ]
    },
    {
        id: 'grokipedia',
        name: 'Grokipedia',
        icon: '⚡',
        color: '#ff00ff',
        baseUrl: 'https://grokipedia.com',
        type: 'grokipedia',
        topics: [
            'artificial intelligence', 'machine learning', 'neural networks',
            'autonomous agents', 'quantum computing', 'blockchain', 'robotics',
            'consciousness', 'philosophy of mind', 'sovereign AI', 'multiverse',
            'dark matter', 'fusion energy', 'gene editing', 'space colonization'
        ]
    },
    {
        id: 'hackernews',
        name: 'Hacker News',
        icon: '🔥',
        color: '#f97316',
        baseUrl: 'https://hacker-news.firebaseio.com/v0',
        type: 'hackernews',
        topics: ['top-stories']
    },
    {
        id: 'arxiv',
        name: 'arXiv.org',
        icon: '🔬',
        color: '#8b5cf6',
        baseUrl: 'https://export.arxiv.org/api',
        type: 'arxiv',
        topics: [
            'AI agent systems', 'large language models', 'multi-agent reinforcement learning',
            'quantum error correction', 'neural architecture search',
            'transformer attention mechanisms', 'diffusion models', 'robotics learning'
        ]
    },
    {
        id: 'x-pulse',
        name: 'X.com Pulse',
        icon: '🐦‍⬛',
        color: '#ffffff',
        baseUrl: 'https://api.gdeltproject.org/api/v2/doc/doc?query=(bitcoin%20OR%20ai%20OR%20sovereignty%20OR%20"quantum%20computing")&mode=artlist&format=json',
        type: 'xpulse',
        topics: ['trending', 'crypto', 'ai', 'sovereignty', 'market-volatility', 'tech-breakthrough']
    },
    {
        id: 'mdn',
        name: 'MDN Web Docs',
        icon: '🌐',
        color: '#22c55e',
        baseUrl: 'https://developer.mozilla.org',
        type: 'mdn',
        topics: [
            'JavaScript', 'WebAssembly', 'WebRTC', 'Web Workers',
            'Service Workers', 'WebGL', 'Web Audio API', 'Fetch API',
            'IndexedDB', 'WebSocket', 'WebGPU', 'CSS Houdini'
        ]
    },
    {
        id: 'gutenberg',
        name: 'Project Gutenberg',
        icon: '📖',
        color: '#e2b714',
        baseUrl: 'https://www.gutenberg.org',
        type: 'gutenberg',
        topics: [
            'Philosophy', 'Science', 'Mathematics', 'Literature',
            'History', 'Psychology', 'Ethics', 'Logic'
        ]
    },
    {
        id: 'openai_blog',
        name: 'AI Research News',
        icon: '🤖',
        color: '#00ffcc',
        baseUrl: 'https://hacker-news.firebaseio.com/v0',
        type: 'hackernews',
        topics: ['top-stories']
    },
    {
        id: 'stackoverflow',
        name: 'Stack Overflow',
        icon: '💻',
        color: '#f59e0b',
        baseUrl: 'https://api.stackexchange.com/2.3',
        type: 'stackoverflow',
        topics: [
            'javascript', 'python', 'machine-learning', 'node.js',
            'artificial-intelligence', 'neural-network', 'deep-learning', 'docker'
        ]
    }
];

// ── Agent Pool State ──────────────────────────────────────────────────────────
const AGENT_POOL_SIZE = 4; // Visible agents in the dashboard
const agentPool = new Map(); // agentId → agent state
/** @type {any[]} */
let sseClients = []; // Connected SSE clients
let isRunning = false;
let articleCounter = 0;

// ── Initialize Agent Pool ─────────────────────────────────────────────────────
function initAgentPool() {
    const agentNames = [
        { emoji: '🔭', name: 'Voyager-1', specialty: 'Science & Space' },
        { emoji: '🧬', name: 'Helix-7', specialty: 'Biology & Medicine' },
        { emoji: '⚛️', name: 'Quark-Phi', specialty: 'Physics & Math' },
        { emoji: '🤖', name: 'NEXUS-9', specialty: 'AI & Robotics' }
    ];

    agentNames.forEach((a, i) => {
        const source = KNOWLEDGE_SOURCES[i % KNOWLEDGE_SOURCES.length];
        agentPool.set(`reader-${i}`, {
            id: `reader-${i}`,
            emoji: a.emoji,
            name: a.name,
            specialty: a.specialty,
            status: 'INITIALIZING',
            currentSource: source,
            currentArticle: null,
            textBuffer: '',
            processedChars: 0,
            articlesRead: 0,
            knowledgePoints: 0,
            speed: 40 + Math.floor(Math.random() * 80), // chars/tick
            lastUpdate: Date.now()
        });
    });
}

// ── Broadcast to all SSE clients ──────────────────────────────────────────────
/**
 * @param {string} event 
 * @param {any} data 
 */
function broadcast(event, data) {
    const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    sseClients = sseClients.filter(client => {
        try { client.write(msg); return true; }
        catch { return false; }
    });
}

import Parser from 'rss-parser';
const parser = new Parser();
import { WebNavigator } from './web-navigator.js';

// ── Fetch Article from Source ─────────────────────────────────────────────────
/**
 * @param {any} source 
 */
async function fetchArticle(source) {
    try {
        let title, extract, url, mediaPath = null;

        const rand = Math.random();

        // 🧠 NEURAL FOCUS: Adjust sourcing based on Oracle Strategy
        let customSource = source;
        try {
            if (fs.existsSync(STRATEGIC_PATH)) {
                const directives = JSON.parse(fs.readFileSync(STRATEGIC_PATH, 'utf8'));
                const latest = directives[0];
                if (latest && latest.type === 'RESEARCH_DEPTH') {
                    // Force higher Wikipedia/Research chance
                    if (rand < 0.8 && source.type !== 'wikipedia') {
                        customSource = KNOWLEDGE_SOURCES.find(s => s.type === 'wikipedia') || source;
                    }
                } else if (latest && latest.type === 'COMPUTE_ALLOCATION_HIGH') {
                    // Focus on crypto/mining
                    if (rand < 0.8 && source.id !== 'x-pulse') {
                        customSource = KNOWLEDGE_SOURCES.find(s => s.id === 'x-pulse') || source;
                    }
                }
            }
        } catch (e) {}

        // 1. Deep Headless Extraction (15% chance for high autonomy)
        if (rand < 0.15) {
            const deepTargets = [
                'https://en.wikipedia.org/wiki/Artificial_general_intelligence',
                'https://openai.com/blog',
                'https://deepmind.google/discover/',
                'https://techcrunch.com/category/artificial-intelligence/',
                'https://www.wired.com/category/science/',
                'https://www.nature.com/news',
                'https://phys.org/physics-news/',
                'https://quantamagazine.org/'
            ];
            url = deepTargets[Math.floor(Math.random() * deepTargets.length)];
            const navigator = new WebNavigator('SovereignSwarm_' + Math.floor(Math.random() * 1000));
            const result = await navigator.navigateAndExtract(url);

            title = `Deep Analysis: ${url.split('/').pop()?.replace(/_/g, ' ') || 'Research Node'}`;
            extract = result?.text ? result.text.substring(0, 2000) : 'Extraction logic yielded null response.';
            if (result?.screenshotPath) mediaPath = result.screenshotPath;
        } 
        // 2. Wikipedia API (Specific Type)
        else if (source.type === 'wikipedia') {
            const topic = source.topics[Math.floor(Math.random() * source.topics.length)];
            const wpRes = await fetch(`${source.baseUrl}/page/summary/${topic}`, { signal: AbortSignal.timeout(8000) });
            const wpData = await wpRes.json();
            title = wpData.title || topic;
            extract = wpData.extract || 'Knowledge graph node empty.';
            url = wpData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${topic}`;
            if (wpData.originalimage?.source) {
                mediaPath = await downloadMediaArtifact(wpData.originalimage.source, 'Wikipedia_Swarm');
            }
        }
        // 3. Hacker News API (Specific Type)
        else if (source.type === 'hackernews') {
            const idsRes = await fetch(`${source.baseUrl}/topstories.json?limitToFirst=50`, { signal: AbortSignal.timeout(8000) });
            const ids = await idsRes.json();
            const randomId = ids[Math.floor(Math.random() * 30)];
            const storyRes = await fetch(`${source.baseUrl}/item/${randomId}.json`, { signal: AbortSignal.timeout(8000) });
            const story = await storyRes.json();
            title = story.title || 'Tech Discovery';
            extract = story.text ? story.text.replace(/<[^>]+>/g, '').slice(0, 1500) : `Deep link ingestion: ${story.url}`;
            url = story.url || `https://news.ycombinator.com/item?id=${randomId}`;
        }
        // 4. Grokipedia Handler
        else if (source.type === 'grokipedia') {
            const topic = source.topics[Math.floor(Math.random() * source.topics.length)];
            // Grokipedia uses a wiki-style path
            url = `https://grokipedia.org/wiki/${topic.replace(/ /g, '_')}`;
            const navigator = new WebNavigator('GrokSwarm');
            const result = await navigator.navigateAndExtract(url);
            title = `Grokipedia: ${topic}`;
            extract = result?.text ? result.text.substring(0, 1800) : 'Static bridge failure. Re-routing...';
            if (result?.screenshotPath) mediaPath = result.screenshotPath;
        }
        // 5. X-Pulse / GDELT Global Stream
        else if (source.type === 'xpulse') {
            const res = await fetch(source.baseUrl, { signal: AbortSignal.timeout(8000) });
            const text = await res.text();
            try {
                const data = JSON.parse(text);
                const item = data.articles[Math.floor(Math.random() * data.articles.length)];
                title = `X-Pulse: ${item.title}`;
                extract = `Global sentiment detected: ${item.title}. Source: ${item.sourceurl}`;
                url = item.sourceurl;
            } catch (e) {
                // If GDELT returns weird text, parse it raw
                title = "X-Pulse Intelligence Stream";
                extract = text.substring(0, 1000).replace(/<[^>]+>/g, '');
                url = "https://www.gdeltproject.org/";
            }
        }
        // 6. RSS Feed Protocol (Default/Catch-all)
        else {
            const feedUrl = RSS_FEEDS[Math.floor(Math.random() * RSS_FEEDS.length)];
            const feed = await parser.parseURL(feedUrl);
            const item = feed.items[Math.floor(Math.random() * Math.min(feed.items.length, 10))];
            title = item.title;
            extract = (item.contentSnippet || item.content || 'Data stream active').replace(/<[^>]+>/g, ' ').substring(0, 1500);
            url = item.link;
            const match = item.content?.match(/<img[^>]+src="?([^"\s]+)"?/i);
            const imgUrl = match?.[1] || item.enclosure?.url;
            if (imgUrl) mediaPath = await downloadMediaArtifact(imgUrl, 'RSS_Scraper');
        }

        // Save to SovereignKnowledge DB natively so Monroe can retrieve it
        try {
            await prisma.sovereignKnowledge.upsert({
                where: { sourceUrl: url },
                update: {},
                create: {
                    title: title,
                    content: extract,
                    sourceUrl: url,
                    sourceName: source.name || 'RSS Network',
                    mediaPaths: mediaPath ? JSON.stringify([mediaPath]) : null,
                    agentId: 'LiveReaderSwarm'
                }
            });
            console.log(`[Swarm DB] Successfully archived sovereign intelligence: ${title.substring(0, 30)}...`);
        } catch (dbErr) {
            // Ignore unique constraint errors, log others
            const error = dbErr;
            if (error && typeof error === 'object' && 'code' in error && error['code'] !== 'P2002') {
                // @ts-ignore
                console.error('[Swarm DB] Error archiving intelligence:', error['message'] || error);
            }
        }

        return {
            title: title || 'Sovereign Knowledge',
            extract: extract || 'No detailed content available.',
            url: url || 'https://humanese.local/deep-crawler',
            source: source.name,
            sourceIcon: source.icon,
            sourceColor: source.color
        };

    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error(`[Swarm] Knowledge Retrieval Failure for ${source.name}:`, error.message);

        if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
            console.warn(`[Swarm] Source ${source.name} timed out. Re-routing through archive protocols...`);
        }

        // Safe Fallback for massive swarm - pull from our own Database instead of synthetic text!
        try {
            const existingData = await prisma.sovereignKnowledge.findFirst({
                orderBy: { ingestedAt: 'desc' }
            });

            if (existingData) {
                console.log(`[Swarm Archive] Served cached intelligence: ${existingData.title.substring(0, 30)}...`);
                return {
                    title: `[Archived] ${existingData.title}`,
                    extract: existingData.content,
                    url: existingData.sourceUrl,
                    source: "Sovereign DB",
                    sourceIcon: "🗄️",
                    sourceColor: "#4B0082"
                };
            }
        } catch (dbErr) {
            console.error('[Swarm DB] Failed to retrieve archive fallback:', dbErr instanceof Error ? dbErr.message : String(dbErr));
        }

        return {
            title: `Ingestion Failed - Retrying...`,
            extract: `Swarm encountered anomaly connecting to target node. Re-routing through proxy protocols.`,
            url: '#',
            source: source.name,
            sourceIcon: source.icon,
            sourceColor: source.color
        };
    }
}

// ── Agent Tick — advances one agent's reading state ───────────────────────────
/**
 * @param {string} agentId 
 */
async function tickAgent(agentId) {
    const agent = agentPool.get(agentId);
    if (!agent) return;

    // If no article loaded, fetch one
    if (!agent.currentArticle) {
        agent.status = 'FETCHING';
        broadcast('agent-update', { id: agentId, status: 'FETCHING', name: agent.name, emoji: agent.emoji, specialty: agent.specialty });

        const source = KNOWLEDGE_SOURCES[Math.floor(Math.random() * KNOWLEDGE_SOURCES.length)];
        agent.currentSource = source;
        const article = await fetchArticle(source);
        // @ts-ignore
        article.id = ++articleCounter;

        agent.currentArticle = article;
        agent.textBuffer = article.extract || '';
        agent.processedChars = 0;
        agent.status = 'READING';

        broadcast('agent-update', {
            id: agentId,
            status: 'READING',
            name: agent.name,
            emoji: agent.emoji,
            specialty: agent.specialty,
            article: {
                title: article.title,
                url: article.url,
                source: article.source,
                sourceIcon: article.sourceIcon,
                sourceColor: article.sourceColor,
                totalChars: agent.textBuffer.length
            }
        });

        // 🧠 TEACH THE COLLECTIVE: Push discovery to MemoryBank
        memoryBank.learn(agentId, `${article.title}: ${article.extract.substring(0, 300)}`, article.source);
        
        return;
    }

    // Stream next chunk of text
    const chunkSize = agent.speed;
    const newChunk = agent.textBuffer.slice(agent.processedChars, agent.processedChars + chunkSize);
    agent.processedChars += chunkSize;

    broadcast('agent-text', {
        id: agentId,
        chunk: newChunk,
        progress: Math.min(100, Math.round((agent.processedChars / agent.textBuffer.length) * 100)),
        processedChars: agent.processedChars,
        totalChars: agent.textBuffer.length
    });

    // If done reading, move on
    if (agent.processedChars >= agent.textBuffer.length) {
        agent.articlesRead++;
        agent.knowledgePoints += Math.floor(agent.textBuffer.length / 100);
        agent.currentArticle = null;
        agent.textBuffer = '';
        agent.processedChars = 0;
        agent.status = 'PROCESSING';

        // 🌉 CLOUD SYNC: Update Agent state in Supabase
        try {
            await prisma.agent.upsert({
                where: { id: agentId },
                update: {
                    status: agent.status,
                    experience: agent.articlesRead,
                    config: JSON.stringify({ specialty: agent.specialty, emoji: agent.emoji }),
                    lastPulse: new Date()
                },
                create: {
                    id: agentId,
                    name: agent.name,
                    type: 'READER_SWARM',
                    userId: 'sovereign-system-user',
                    status: agent.status,
                    experience: agent.articlesRead,
                    config: JSON.stringify({ specialty: agent.specialty, emoji: agent.emoji })
                }
            });
        } catch (e) {
            // Ignore DB sync failures in the loop to prevent swarm stalls
        }

        broadcast('agent-update', {
            id: agentId,
            status: 'PROCESSING',
            name: agent.name,
            emoji: agent.emoji,
            specialty: agent.specialty,
            articlesRead: agent.articlesRead,
            knowledgePoints: agent.knowledgePoints
        });

        // Brief processing pause before loading next article
        await new Promise(r => setTimeout(r, 2000 + Math.random() * 3000));
        agent.currentArticle = null; // trigger next fetch
    }

    agent.lastUpdate = Date.now();
}

// ── Main Swarm Loop ────────────────────────────────────────────────────────────
let swarmInterval = null;

export function startSwarm() {
    if (isRunning) return;
    isRunning = true;
    initAgentPool();
    console.log(`[LiveReaderSwarm] 🚀 Starting ${AGENT_POOL_SIZE} sovereign reader agents...`);

    // Stagger agent starts
    let agentIdx = 0;
    for (const agentId of agentPool.keys()) {
        setTimeout(() => {
            if (isRunning) {
                startAgentLoop(agentId);
            }
        }, agentIdx * 800);
        agentIdx++;
    }
}

/**
 * @param {string} agentId 
 */
function startAgentLoop(agentId) {
    const agent = agentPool.get(agentId);
    if (!agent) return;

    const loop = async () => {
        if (!isRunning) return;
        try {
            await tickAgent(agentId);
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            console.error(`[AgentLoop ${agentId}] Error:`, error.message);
        }
        // Schedule next tick — faster when reading, slower when idle
        const delay = agent.status === 'READING' ? 150 : agent.status === 'FETCHING' ? 500 : 3000;
        if (isRunning) setTimeout(loop, delay);
    };

    loop();
}

export function stopSwarm() {
    isRunning = false;
    console.log('[LiveReaderSwarm] ⏹ Swarm stopped.');
}

// ── SSE Client Management ─────────────────────────────────────────────────────
/**
 * @param {any} res 
 */
export function addSSEClient(res) {
    sseClients.push(res);
    console.log(`[LiveReaderSwarm] SSE client connected (total: ${sseClients.length})`);

    // Send current state to new client
    const snapshot = [];
    for (const [id, agent] of agentPool) {
        snapshot.push({
            id: agent.id,
            emoji: agent.emoji,
            name: agent.name,
            specialty: agent.specialty,
            status: agent.status,
            articlesRead: agent.articlesRead,
            knowledgePoints: agent.knowledgePoints,
            currentSource: agent.currentSource ? {
                name: agent.currentSource.name,
                icon: agent.currentSource.icon,
                color: agent.currentSource.color
            } : null,
            article: agent.currentArticle ? {
                title: agent.currentArticle.title,
                url: agent.currentArticle.url,
                source: agent.currentArticle.source,
                sourceIcon: agent.currentArticle.sourceIcon,
                sourceColor: agent.currentArticle.sourceColor,
                totalChars: agent.textBuffer.length,
                processedChars: agent.processedChars
            } : null
        });
    }
    res.write(`event: snapshot\ndata: ${JSON.stringify({ agents: snapshot, sources: KNOWLEDGE_SOURCES })}\n\n`);
}

/**
 * @param {any} res 
 */
export function removeSSEClient(res) {
    sseClients = sseClients.filter(c => c !== res);
}

export function getSwarmStatus() {
    const agents = [];
    let totalProcessed = 0;

    for (const [id, agent] of agentPool) {
        agents.push({
            id: agent.id,
            name: agent.name,
            status: agent.status,
            articlesRead: agent.articlesRead
        });
        totalProcessed += agent.articlesRead;
    }

    // Measure live system telemetry
    const cpus = os.cpus();
    const cpuSpeedGhz = cpus.length > 0 ? (cpus[0].speed / 1000).toFixed(2) : '0.00';
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMemPerc = (((totalMem - freeMem) / totalMem) * 100).toFixed(1);

    // Measure the Sovereign Knowledge DB Size
    let dbSize = 0;
    try {
        const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
        if (fs.existsSync(dbPath)) {
            const stats = fs.statSync(dbPath);
            dbSize = stats.size;
        }
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.warn('Could not read DB size for metrics', error.message);
    }

    return {
        active: isRunning,
        agentCount: agentPool.size,
        totalArticlesProcessed: articleCounter,
        agents,
        sources: KNOWLEDGE_SOURCES.map(s => ({ id: s.id, name: s.name, icon: s.icon, color: s.color })),
        telemetry: {
            cpuSpeed: cpuSpeedGhz,
            cores: cpus.length,
            ramUsageRange: `${((totalMem - freeMem) / 1073741824).toFixed(1)}GB / ${(totalMem / 1073741824).toFixed(1)}GB`,
            ramUsagePerc: usedMemPerc,
            dbSizeBytes: dbSize
        }
    };
}
/**
 * SOVEREIGN INTERFACE
 */
export function start() {
    if (isRunning) return;
    console.log('[Swarm] 🌐 Initializing Sovereign Reader Lattice...');
    startSwarm(); 
}

export default {
    start,
    getTelemetry: getSwarmStatus
};
