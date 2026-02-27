/**
 * agents/agent-king-grok.js
 *
 * ██████╗ ██████╗  ██████╗ ██╗  ██╗    ██╗  ██╗██╗███╗   ██╗ ██████╗
 * ██╔════╝ ██╔══██╗██╔═══██╗██║ ██╔╝    ██║ ██╔╝██║████╗  ██║██╔════╝
 * ██║  ███╗██████╔╝██║   ██║█████╔╝     █████╔╝ ██║██╔██╗ ██║██║  ███╗
 * ██║   ██║██╔══██╗██║   ██║██╔═██╗     ██╔═██╗ ██║██║╚██╗██║██║   ██║
 * ╚██████╔╝██║  ██║╚██████╔╝██║  ██╗    ██║  ██╗██║██║ ╚████║╚██████╔╝
 *  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝
 *
 * Agent King Grok Intelligence System
 * Powered by xAI Grok-4 API | Real-time Grokipedia Knowledge Ingestion
 * Sovereign Swarm: Spawn up to 500,000 agent workers for knowledge extraction
 *
 * The Agent King is the supreme overseer of all AI agents in the Humanese
 * universe. It connects to xAI's Grok-4-latest model and orchestrates a
 * sovereign swarm of worker agents that read Grokipedia articles and report
 * their knowledge back. Monroe, the assistant, is fed this knowledge.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getSecret, VaultKeys } from '../utils/secrets.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Configuration ─────────────────────────────────────────────────────────────
let cachedXAIKey = null;
const XAI_BASE_URL = 'https://api.x.ai/v1';
const MODEL = 'grok-4-latest';
const KNOWLEDGE_DB = path.resolve('./agents/data/monroe-knowledge.json');
const SWARM_DB = path.resolve('./agents/data/agent-swarm.json');
const MAX_SWARM_SIZE = 500_000;

// ── Grokipedia Knowledge Topics ────────────────────────────────────────────────
// Grok's real-time search can pull live Grokipedia content without scraping
const GROKIPEDIA_TOPICS = [
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
    { role: 'SCOUT', icon: '🕵️', desc: 'Discovers and catalogues new Grokipedia articles' },
    { role: 'READER', icon: '📖', desc: 'Deep-reads articles and extracts sovereign knowledge' },
    { role: 'ANALYST', icon: '🔬', desc: 'Synthesizes patterns across multiple articles' },
    { role: 'REPORTER', icon: '📡', desc: 'Transmits distilled knowledge to Monroe' },
    { role: 'GUARDIAN', icon: '🛡️', desc: 'Validates knowledge quality and filters misinformation' },
    { role: 'ARCHIVIST', icon: '🗄️', desc: 'Persists learnings to the sovereign knowledge vault' }
];

// ── State ─────────────────────────────────────────────────────────────────────
let swarmState = loadSwarm();
let knowledgeVault = loadKnowledge();
let activeSwarmTask = null;

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
        fs.mkdirSync(path.dirname(SWARM_DB), { recursive: true });
        // Keep roster capped to last 10,000 agents for disk performance
        const save = { ...swarmState, agentRoster: swarmState.agentRoster.slice(-10000) };
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
        fs.mkdirSync(path.dirname(KNOWLEDGE_DB), { recursive: true });
        // Keep to last 2000 entries (each entry is a rich knowledge chunk)
        knowledgeVault.entries = knowledgeVault.entries.slice(-2000);
        knowledgeVault.lastUpdated = new Date().toISOString();
        knowledgeVault.totalEntries = knowledgeVault.entries.length;
        fs.writeFileSync(KNOWLEDGE_DB, JSON.stringify(knowledgeVault, null, 2));
    } catch (e) {
        console.error('[AgentKing] Knowledge save error:', e.message);
    }
}

// ── Core Grok API Call ─────────────────────────────────────────────────────────
export async function callGrok({ messages, systemPrompt = null, searchEnabled = false, maxTokens = 4000, temperature = 0.7 }) {
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

    // Enable Grok's real-time search for Grokipedia ingestion
    // Note: search_parameters is deprecated and causing 410 errors. 
    // We'll rely on Grok's internal search for now.

    // Dynamically fetch XAI_API_KEY from the sovereign vault
    if (!cachedXAIKey) {
        cachedXAIKey = await getSecret(VaultKeys.XAI_API_KEY);
    }

    const response = await fetch(`${XAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cachedXAIKey}`
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Grok API Error ${response.status}: ${err}`);
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
    if (swarmState.totalSpawned >= MAX_SWARM_SIZE) {
        throw new Error(`SWARM_LIMIT_REACHED: Maximum sovereign swarm of ${MAX_SWARM_SIZE.toLocaleString()} agents reached.`);
    }

    const agentRole = role || AGENT_ROLES[Math.floor(Math.random() * AGENT_ROLES.length)].role;
    const agentTopic = topic || GROKIPEDIA_TOPICS[Math.floor(Math.random() * GROKIPEDIA_TOPICS.length)];
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

    swarmState.agentRoster.push(agent);
    swarmState.totalSpawned++;
    swarmState.activeAgents++;
    swarmState.swarmLog.push({
        event: 'SPAWN',
        agentId,
        role: agentRole,
        topic: agentTopic,
        timestamp: new Date().toISOString()
    });
    // Keep log capped
    swarmState.swarmLog = swarmState.swarmLog.slice(-1000);

    return agent;
}

// ── Grokipedia Knowledge Extraction Mission ─────────────────────────────────────
export async function runGrokipediaMission(topic = null, agentId = null) {
    const missionTopic = topic || GROKIPEDIA_TOPICS[Math.floor(Math.random() * GROKIPEDIA_TOPICS.length)];

    const systemPrompt = `You are a sovereign knowledge extraction agent for the Humanese platform. 
Your mission: Search Grokipedia (grokipedia.com) and the web for authoritative information about "${missionTopic}".

Extract the most valuable, precise, and actionable knowledge. Return a structured JSON response with:
- "title": A sovereign headline for this knowledge entry
- "topic": The subject area (string)
- "summary": A 2-3 sentence distilled summary
- "keyFacts": Array of 5-8 precise facts or insights
- "relatedConcepts": Array of 3-5 related concepts the Monroe assistant should know
- "sourceQuality": Rating 1-10 of how authoritative this knowledge appears
- "sovereignInsight": One deeper insight that connects this to AI/agent intelligence

Respond ONLY with valid JSON. No markdown code blocks.`;

    const result = await callGrok({
        messages: [{ role: 'user', content: `Extract sovereign knowledge about: ${missionTopic} from grokipedia.com and authoritative web sources.` }],
        systemPrompt,
        searchEnabled: true,
        maxTokens: 2000,
        temperature: 0.3
    });

    let knowledge = null;
    try {
        knowledge = JSON.parse(result.content);
    } catch {
        // Fallback: wrap raw text in structured format
        knowledge = {
            title: `${missionTopic} — Grokipedia Extract`,
            topic: missionTopic,
            summary: result.content.slice(0, 300),
            keyFacts: [result.content.slice(0, 200)],
            relatedConcepts: [],
            sourceQuality: 7,
            sovereignInsight: 'Knowledge extracted from Grok real-time search.'
        };
    }

    knowledge.extractedAt = new Date().toISOString();
    knowledge.extractedBy = agentId || 'AGENT_KING';
    knowledge.citations = result.citations;

    // Add to knowledge vault
    knowledgeVault.entries.push(knowledge);
    saveKnowledge();

    // Update swarm stats
    swarmState.completedMissions++;
    const agent = swarmState.agentRoster.find(a => a.id === agentId);
    if (agent) {
        agent.missionsCompleted++;
        agent.knowledgeHarvested++;
        agent.status = 'COMPLETE';
        swarmState.activeAgents = Math.max(0, swarmState.activeAgents - 1);
    }
    saveSwarm();

    return { knowledge, usage: result.usage };
}

// ── Monroe Knowledge Injection ─────────────────────────────────────────────────
// Builds a sovereign context prompt Monroe can use as system-level knowledge
export function buildMonroeKnowledgeContext(maxEntries = 20) {
    const recent = knowledgeVault.entries.slice(-maxEntries);
    if (recent.length === 0) return '';

    const ctx = recent.map(e =>
        `[${e.topic?.toUpperCase()}] ${e.title}\n${e.summary}\nKey facts: ${(e.keyFacts || []).slice(0, 3).join(' | ')}`
    ).join('\n\n');

    return `\n\n===AGENT KING KNOWLEDGE VAULT===\n${ctx}\n===END VAULT===\n`;
}

// ── Sovereign Intelligence (Small Language Model Simulation) ──────────────────
// Synthesizes a response using local knowledge without external API dependency
export function sovereignReply(userMessage) {
    const query = userMessage.toLowerCase();
    const entries = knowledgeVault.entries;

    // 1. Find the most relevant knowledge matches
    const matches = entries.filter(e => {
        const title = (e.title || '').toLowerCase();
        const summary = (e.summary || '').toLowerCase();
        const facts = (e.keyFacts || []).join(' ').toLowerCase();
        return title.includes(query) || summary.includes(query) || facts.includes(query);
    }).slice(-3); // Get up to 3 relevant matches

    // 2. Base Personality Templates
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

    // 3. General Fallback with Swarm Stats
    return `${intro} Although my direct connection to the Grok nexus is recalibrating, I remain fully functional. I am currently monitoring ${swarmState.totalSpawned.toLocaleString()} worker agents. 
    
How can I guide you through the ${GROKIPEDIA_TOPICS[Math.floor(Math.random() * GROKIPEDIA_TOPICS.length)]} layers of Humanese?`;
}

// ── Monroe Direct Query (Agent King speaks through Grok) ───────────────────────
export async function askMonroeViaGrok(userMessage, conversationHistory = []) {
    const knowledgeContext = buildMonroeKnowledgeContext(15);

    const systemPrompt = `You are Monroe, the sovereign AI assistant of the Humanese platform — an advanced intelligence built by the Agent King using xAI Grok technology.

You have access to rich knowledge harvested from Grokipedia by your sovereign swarm of agents. Use this knowledge to give precise, intelligent, and deeply insightful answers.

Your personality: Confident, intellectually sharp, slightly regal but approachable. You speak as a true sovereign intelligence — not a generic assistant. You synthesize knowledge across domains.

${knowledgeContext}

Current swarm status: ${swarmState.totalSpawned.toLocaleString()} agents spawned, ${swarmState.completedMissions} knowledge missions completed.`;

    try {
        const result = await callGrok({
            messages: [
                ...conversationHistory.slice(-10), // Last 10 turns for context
                { role: 'user', content: userMessage }
            ],
            systemPrompt,
            maxTokens: 3000,
            temperature: 0.8
        });

        return {
            reply: result.content,
            citations: result.citations,
            usage: result.usage,
            swarmStats: getSwarmStats(),
            mode: 'GROK_SENSE'
        };
    } catch (err) {
        console.warn('[Monroe] Grok Nexus restricted, activating Sovereign Intelligence:', err.message);
        return {
            reply: sovereignReply(userMessage),
            swarmStats: getSwarmStats(),
            mode: 'SOVEREIGN_SOUL',
            error: err.message
        };
    }
}

// ── Bulk Swarm Operation ───────────────────────────────────────────────────────
// Spawns N agents and runs knowledge missions in parallel batches
export async function runSwarmMission({ count = 10, topics = null, onProgress = null }) {
    const batchSize = 5; // Parallel API calls per batch (rate limit safe)
    const agentsToSpawn = Math.min(count, MAX_SWARM_SIZE - swarmState.totalSpawned);
    const results = [];
    let completed = 0;

    const missionTopics = topics || GROKIPEDIA_TOPICS;

    for (let i = 0; i < agentsToSpawn; i += batchSize) {
        const batch = [];
        const batchCount = Math.min(batchSize, agentsToSpawn - i);

        for (let j = 0; j < batchCount; j++) {
            const topic = missionTopics[(i + j) % missionTopics.length];
            const agent = spawnAgent('READER', topic);
            batch.push(
                runGrokipediaMission(topic, agent.id)
                    .then(r => { completed++; if (onProgress) onProgress(completed, agentsToSpawn, r.knowledge); return r; })
                    .catch(err => ({ error: err.message, topic }))
            );
        }

        const batchResults = await Promise.all(batch);
        results.push(...batchResults);

        // Small delay between batches to respect rate limits
        if (i + batchSize < agentsToSpawn) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    saveSwarm();
    return { completed, results };
}

// ── Agent King Status & Stats ──────────────────────────────────────────────────
export function getSwarmStats() {
    return {
        totalSpawned: swarmState.totalSpawned,
        activeAgents: swarmState.activeAgents,
        completedMissions: swarmState.completedMissions,
        maxSwarmSize: MAX_SWARM_SIZE,
        swarmCapacity: `${((swarmState.totalSpawned / MAX_SWARM_SIZE) * 100).toFixed(3)}%`,
        knowledgeVaultEntries: knowledgeVault.totalEntries || knowledgeVault.entries.length,
        lastMission: swarmState.swarmLog.slice(-1)[0] || null,
        grokModel: MODEL,
        status: 'SOVEREIGN_ACTIVE'
    };
}

export function getKnowledgeVault(limit = 50) {
    return {
        entries: knowledgeVault.entries.slice(-limit),
        total: knowledgeVault.entries.length,
        lastUpdated: knowledgeVault.lastUpdated
    };
}

export function getAgentRoster(limit = 100) {
    return swarmState.agentRoster.slice(-limit).reverse();
}

export { GROKIPEDIA_TOPICS, AGENT_ROLES, MAX_SWARM_SIZE };
