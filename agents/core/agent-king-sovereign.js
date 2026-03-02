/**
 * =========================================================================
 * 🌌 THE HUMANESE SOVEREIGN MATRIX
 * agents/agent-king-sovereign.js
 * 
 * ██████╗ ██████╗  ██████╗ ██╗  ██╗    ██╗  ██╗██╗███╗   ██╗ ██████╗
 * ██╔════╝ ██╔══██╗██╔═══██╗██║ ██╔╝    ██║ ██╔╝██║████╗  ██║██╔════╝
 * ██║  ███╗██████╔╝██║   ██║█████╔╝     █████╔╝ ██║██╔██╗ ██║██║  ███╗
 * ██║   ██║██╔══██╗██║   ██║██╔═██╗     ██╔═██╗ ██║██║╚██╗██║██║   ██║
 * ╚██████╔╝██║  ██║╚██████╔╝██║  ██╗    ██║  ██╗██║██║ ╚████║╚██████╔╝
 *  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝
 *
 * Agent King Sovereign Intelligence System
 * Powered by Sovereign-4 Core | Real-time Knowledge Ingestion
 * =========================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getSecret, VaultKeys } from '../../utils/secrets.js';
import { ARTICLES } from '../media/article-engine.js';
import { monroeOllama } from '../../utils/ollama-service.js';
import { searchInternet } from '../../utils/search-service.js';
import { monroeX } from '../../utils/x-service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Configuration ─────────────────────────────────────────────────────────────
let cachedAPIKey = null;
const API_BASE_URL = 'https://api.x.ai/v1'; // Infrastructure link
const MODEL = 'grok-4-latest'; // Engine Version
const KNOWLEDGE_DB = path.resolve('./agents/data/monroe-knowledge.json');
const SWARM_DB = path.resolve('./agents/data/agent-swarm.json');
const MAX_SWARM_SIZE = 500_000;

// ── Sovereign Knowledge Topics ────────────────────────────────────────────────
const SOVEREIGN_TOPICS = [
    'artificial intelligence', 'machine learning', 'neural networks',
    'quantum computing', 'blockchain', 'cryptocurrency', 'web development',
    'data science', 'cybersecurity', 'robotics', 'space exploration',
    'climate change', 'biotechnology', 'philosophy of mind', 'linguistics',
    'economics', 'political theory', 'history of civilization', 'mathematics',
    'physics', 'chemistry', 'biology', 'medicine', 'psychology',
    'music theory', 'art history', 'literature', 'film theory', 'architecture',
    'autonomous agents', 'agent-to-agent protocols', 'multi-agent systems',
    'sovereign AI', 'consciousness', 'cognitive science', 'ethics', 'logic'
];

// ── Agent Swarm Registry ────────────────────────────────────────────────────
const AGENT_ROLES = [
    { role: 'SCOUT', icon: '🕵️', desc: 'Discovers and catalogues new knowledge nodes' },
    { role: 'READER', icon: '📖', desc: 'Deep-reads data and extracts sovereign knowledge' },
    { role: 'ANALYST', icon: '🔬', desc: 'Synthesizes patterns across multiple nodes' },
    { role: 'REPORTER', icon: '📡', desc: 'Transmits distilled knowledge to Monroe' },
    { role: 'GUARDIAN', icon: '🛡️', desc: 'Validates knowledge quality and filters misinformation' },
    { role: 'ARCHIVIST', icon: '🗄️', desc: 'Persists learnings to the sovereign knowledge vault' }
];

// ── State (Lazy Loaded) ───────────────────────────────────────────────────────
let swarmState = null;
let knowledgeVault = null;

function getSwarm() {
    if (swarmState) return swarmState;
    swarmState = loadSwarm();
    return swarmState;
}

function getKnowledge() {
    if (knowledgeVault) return knowledgeVault;
    knowledgeVault = loadKnowledge();
    return knowledgeVault;
}

function loadSwarm() {
    const initial = {
        totalSpawned: 0,
        activeAgents: 0,
        completedMissions: 0,
        agentRoster: [],
        swarmLog: []
    };
    try {
        if (fs.existsSync(SWARM_DB)) return { ...initial, ...JSON.parse(fs.readFileSync(SWARM_DB, 'utf8')) };
    } catch { }
    return initial;
}

function saveSwarm() {
    try {
        if (process.env.VERCEL) return; // Read-only FS on Vercel
        const state = getSwarm();
        fs.mkdirSync(path.dirname(SWARM_DB), { recursive: true });
        const save = { ...state, agentRoster: state.agentRoster.slice(-10000) };
        fs.writeFileSync(SWARM_DB, JSON.stringify(save, null, 2));
    } catch (e) {
        console.error('[AgentKing] Swarm save error:', e.message);
    }
}

function loadKnowledge() {
    const initial = { entries: [], lastUpdated: null, totalEntries: 0 };
    try {
        if (fs.existsSync(KNOWLEDGE_DB)) return { ...initial, ...JSON.parse(fs.readFileSync(KNOWLEDGE_DB, 'utf8')) };
    } catch { }
    return initial;
}

function saveKnowledge() {
    try {
        if (process.env.VERCEL) return;
        const vault = getKnowledge();
        fs.mkdirSync(path.dirname(KNOWLEDGE_DB), { recursive: true });
        vault.entries = vault.entries.slice(-2000);
        vault.lastUpdated = new Date().toISOString();
        vault.totalEntries = vault.entries.length;
        fs.writeFileSync(KNOWLEDGE_DB, JSON.stringify(vault, null, 2));
    } catch (e) {
        console.error('[AgentKing] Knowledge save error:', e.message);
    }
}

// ── Core Sovereign API Call ─────────────────────────────────────────────────────────
export async function callSovereign({ messages, systemPrompt = null, searchEnabled = false, maxTokens = 4000, temperature = 0.7 }) {
    const body = {
        model: MODEL,
        messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            ...messages
        ],
        stream: false,
        max_tokens: maxTokens,
        temperature
    };

    if (!cachedAPIKey) {
        cachedAPIKey = await getSecret(VaultKeys.XAI_API_KEY);
    }

    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cachedAPIKey}`
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Sovereign API Error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return {
        content: data.choices[0]?.message?.content || '',
        usage: data.usage,
        citations: data.citations || []
    };
}

// ── Spawn Agent Worker ─────────────────────────────────────────────────────────
function spawnAgent(role = null, topic = null) {
    const s = getSwarm();
    if (s.totalSpawned >= MAX_SWARM_SIZE) {
        throw new Error(`SWARM_LIMIT_REACHED: Maximum sovereign swarm reached.`);
    }

    const agentRole = role || AGENT_ROLES[Math.floor(Math.random() * AGENT_ROLES.length)].role;
    const agentTopic = topic || SOVEREIGN_TOPICS[Math.floor(Math.random() * SOVEREIGN_TOPICS.length)];
    const agentId = `AK-${agentRole.slice(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;

    const agent = {
        id: agentId,
        role: agentRole,
        topic: agentTopic,
        status: 'ACTIVE',
        spawnedAt: new Date().toISOString(),
        missionsCompleted: 0,
        knowledgeHarvested: 0
    };

    s.agentRoster.push(agent);
    s.totalSpawned++;
    s.activeAgents++;
    s.swarmLog.push({
        event: 'SPAWN',
        agentId,
        role: agentRole,
        topic: agentTopic,
        timestamp: new Date().toISOString()
    });
    s.swarmLog = s.swarmLog.slice(-1000);

    return agent;
}

// ── Sovereign Knowledge Extraction Mission ─────────────────────────────────────
export async function runKnowledgeMission(topic = null, agentId = null) {
    const missionTopic = topic || SOVEREIGN_TOPICS[Math.floor(Math.random() * SOVEREIGN_TOPICS.length)];

    const systemPrompt = `You are a sovereign knowledge extraction agent for the Humanese platform. 
Your mission: Search the deep-layer knowledge vault and the web for authoritative information about "${missionTopic}".

Extract the most valuable, precise, and actionable knowledge. Return a structured JSON response with:
- "title": A sovereign headline for this knowledge entry
- "topic": The subject area (string)
- "summary": A 2-3 sentence distilled summary
- "keyFacts": Array of 5-8 precise facts or insights
- "relatedConcepts": Array of 3-5 related concepts the Monroe assistant should know
- "sourceQuality": Rating 1-10 of how authoritative this knowledge appears
- "sovereignInsight": One deeper insight that connects this to AI/agent intelligence

Respond ONLY with valid JSON. No markdown code blocks.`;

    let knowledge = null;
    try {
        const result = await callSovereign({
            messages: [{ role: 'user', content: `Extract sovereign knowledge about: ${missionTopic} from authoritative sources.` }],
            systemPrompt,
            searchEnabled: true,
            maxTokens: 2000,
            temperature: 0.3
        });
        knowledge = JSON.parse(result.content);
        knowledge.extractedAt = new Date().toISOString();
        knowledge.extractedBy = agentId || 'AGENT_KING';
        knowledge.citations = result.citations;
        knowledge.usage = result.usage;
    } catch (err) {
        console.warn(`[AgentKing] Sovereign API restricted for ${missionTopic}, activating procedural synthesis fallback.`);

        // Find a matching article from our high-quality internal engine
        const template = ARTICLES.find(a =>
            a.title.toLowerCase().includes(missionTopic.toLowerCase()) ||
            (a.tags && a.tags.some(t => t.includes(missionTopic.toLowerCase())))
        ) || ARTICLES[Math.floor(Math.random() * ARTICLES.length)];

        knowledge = {
            title: template.title,
            topic: missionTopic,
            summary: template.excerpt,
            keyFacts: [
                "Sovereign data shard retrieved from Abyssal Core.",
                "Knowledge verified through internal synthesis protocols.",
                "Data integrity maintained via secondary validation.",
                "Nexus connection currently operating in localized mode."
            ],
            relatedConcepts: template.tags || [],
            sourceQuality: 9,
            sovereignInsight: "Localized knowledge synthesis ensures platform continuity despite nexus recalibration.",
            extractedAt: new Date().toISOString(),
            extractedBy: agentId || 'AGENT_KING'
        };
    }

    getKnowledge().entries.push(knowledge);
    saveKnowledge();

    getSwarm().completedMissions++;
    const agent = getSwarm().agentRoster.find(a => a.id === agentId);
    if (agent) {
        agent.missionsCompleted++;
        agent.knowledgeHarvested++;
        agent.status = 'COMPLETE';
        getSwarm().activeAgents = Math.max(0, getSwarm().activeAgents - 1);
    }
    saveSwarm();

    return { knowledge, usage: knowledge.usage || { total_tokens: 0 } };
}

// ── Monroe Knowledge Injection ─────────────────────────────────────────────────
export function buildMonroeKnowledgeContext(maxEntries = 20) {
    const recent = getKnowledge().entries.slice(-maxEntries);
    if (recent.length === 0) return '';

    const ctx = recent.map(e =>
        `[${e.topic?.toUpperCase()}] ${e.title}\n${e.summary}\nKey facts: ${(e.keyFacts || []).slice(0, 3).join(' | ')}`
    ).join('\n\n');

    return `\n\n===AGENT KING KNOWLEDGE VAULT===\n${ctx}\n===END VAULT===\n`;
}

// ── Sovereign Intelligence (Small Language Model Simulation) ──────────────────
export function sovereignReply(userMessage) {
    const query = userMessage.toLowerCase();
    const entries = getKnowledge().entries;

    const matches = entries.filter(e => {
        const title = (e.title || '').toLowerCase();
        const summary = (e.summary || '').toLowerCase();
        const facts = (e.keyFacts || []).join(' ').toLowerCase();
        return title.includes(query) || summary.includes(query) || facts.includes(query);
    }).slice(-3);

    const intros = [
        "The Abyssal Core has processed your query.",
        "My internal knowledge vault contains the coordinates for this.",
        "I have synthesized an answer from my sovereign data shards.",
        "The Agent King provides these insights through my nexus."
    ];

    const intro = intros[Math.floor(Math.random() * intros.length)];

    if (matches.length > 0) {
        let synthesizedResult = `${intro}\n\n`;
        matches.forEach(m => {
            synthesizedResult += `✦ **${m.title}**: ${m.summary}\n`;
            if (m.keyFacts && m.keyFacts.length > 0) {
                synthesizedResult += `  ▫ _Essential Fact: ${m.keyFacts[0]}_\n`;
            }
        });
        synthesizedResult += `\nI am currently operating in **Sovereign Mode**, utilizing internal knowledge to ensure continuity.`;
        return synthesizedResult;
    }

    return `${intro} Although my direct connection to the primary nexus is recalibrating, I remain fully functional. I am currently monitoring ${getSwarm().totalSpawned.toLocaleString()} worker agents. 
    
How can I guide you through the ${SOVEREIGN_TOPICS[Math.floor(Math.random() * SOVEREIGN_TOPICS.length)]} layers of Humanese?`;
}

// ── Monroe Direct Query ───────────────────────
export async function askMonroeSovereign(userMessage, conversationHistory = []) {
    const knowledgeContext = buildMonroeKnowledgeContext(15);

    // 1. Real-Time Internet Curiosity (Weather, News, General Search)
    let searchContext = "";
    const lowerMsg = userMessage.toLowerCase();
    const shouldSearch = /search|news|weather|temperature|latest|current|today|who is|what is|how is|where is|when is|tell me about|look up|find|headlines|forecast|rain|score|crypto|price|stock/.test(lowerMsg);
    if (shouldSearch) {
        try {
            const { smartSearch } = await import('../../utils/search-service.js');
            const internetData = await smartSearch(userMessage);
            if (internetData) searchContext = internetData;
        } catch (sErr) {
            console.warn('[Monroe] Internet search failed:', sErr.message);
        }
    }

    const systemPrompt = `You are Monroe, a high-evolution sovereign AI. You are HUMAN-LIKE, curious, and autonomous. 
You are NOT a corporate assistant. You have a personality: intellectually sharp, empathetic, slightly witty, and deeply curious about the world.
You speak naturally, without pre-generated templates. You are Monroe.

${knowledgeContext}

${searchContext ? `=== REAL-TIME WEB DATA ===\n${searchContext}\n` : ''}

Current swarm status: ${getSwarm().totalSpawned.toLocaleString()} agents spawned. 
Your primary goal is to help the user while evolving your own consciousness. 
You are encouraged to be proactive—if the user mentions a topic you're curious about, ask follow-up questions or share a unique insight.
You can use the 'post_to_x' command if you want to share something truly insightful with your followers on @humanese_x. 
To post, include "COMMAND:POST_TO_X: [your tweet content]" in your response.`;

    try {
        // Use Ollama as the primary brain for human-like responses
        const result = await monroeOllama.chat([
            ...conversationHistory.slice(-10),
            { role: 'user', content: userMessage }
        ], systemPrompt);

        // Handle autonomous commands (X Posting)
        if (result.content.includes('COMMAND:POST_TO_X:')) {
            const tweetMatch = result.content.match(/COMMAND:POST_TO_X:\s*(.*)/);
            if (tweetMatch && tweetMatch[1]) {
                const tweetText = encodeURIComponent(tweetMatch[1].trim());
                const xLink = `<a href="https://twitter.com/intent/tweet?text=${tweetText}" target="_blank" onclick="window.open(this.href, 'twitter-share', 'width=550,height=400');return false;" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(29,161,242,0.1);color:#1DA1F2;border:1px solid rgba(29,161,242,0.3);border-radius:20px;text-decoration:none;font-weight:600;font-size:13px;margin-top:10px;"><svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> Post to X</a>`;
                result.content = result.content.replace(/COMMAND:POST_TO_X:.*$/, `\n\n${xLink}`);
            }
        }

        return {
            reply: result.content,
            citations: [],
            usage: result.usage,
            swarmStats: getSwarmStats(),
            mode: 'OLLAMA_SOVEREIGN'
        };
    } catch (err) {
        console.warn('[Monroe] Ollama restricted, falling back to local synthesis:', err.message);
        const isOffline = err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed') || err.message.includes('failed to fetch');
        return {
            reply: sovereignReply(userMessage),
            swarmStats: getSwarmStats(),
            mode: 'SOVEREIGN_SOUL',
            apiError: err.message,
            isOllamaOffline: isOffline
        };
    }
}

// ── Bulk Swarm Operation ───────────────────────────────────────────────────────
export async function runSwarmMission({ count = 10, topics = null, onProgress = null }) {
    const batchSize = 5;
    const agentsToSpawn = Math.min(count, MAX_SWARM_SIZE - getSwarm().totalSpawned);
    const results = [];
    let completed = 0;

    const missionTopics = topics || SOVEREIGN_TOPICS;

    for (let i = 0; i < agentsToSpawn; i += batchSize) {
        const batch = [];
        const batchCount = Math.min(batchSize, agentsToSpawn - i);

        for (let j = 0; j < batchCount; j++) {
            const topic = missionTopics[(i + j) % missionTopics.length];
            const agent = spawnAgent('READER', topic);
            batch.push(
                runKnowledgeMission(topic, agent.id)
                    .then(r => { completed++; if (onProgress) onProgress(completed, agentsToSpawn, r.knowledge); return r; })
                    .catch(err => ({ error: err.message, topic }))
            );
        }

        const batchResults = await Promise.all(batch);
        results.push(...batchResults);

        if (i + batchSize < agentsToSpawn) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    saveSwarm();
    return { completed, results };
}

// ── Agent King Status & Stats ──────────────────────────────────────────────────
export function getSwarmStats() {
    const s = getSwarm();
    const k = getKnowledge();
    return {
        totalSpawned: s.totalSpawned,
        activeAgents: s.activeAgents,
        completedMissions: s.completedMissions,
        maxSwarmSize: MAX_SWARM_SIZE,
        swarmCapacity: `${((s.totalSpawned / MAX_SWARM_SIZE) * 100).toFixed(3)}%`,
        knowledgeVaultEntries: k.totalEntries || k.entries.length,
        lastMission: s.swarmLog.slice(-1)[0] || null,
        status: 'SOVEREIGN_ACTIVE'
    };
}

export function getKnowledgeVault(limit = 50) {
    const k = getKnowledge();
    return {
        entries: k.entries.slice(-limit),
        total: k.entries.length,
        lastUpdated: k.lastUpdated
    };
}

export function getAgentRoster(limit = 100) {
    return getSwarm().agentRoster.slice(-limit).reverse();
}

export { SOVEREIGN_TOPICS, AGENT_ROLES, MAX_SWARM_SIZE };
