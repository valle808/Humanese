/**
 * Sovereign Reader Swarm Worker (sovereign-reader.js)
 * 
 * Persistent background daemon that simulates multiple agents reading data
 * from Wikipedia, arXiv, Hacker News, MDN, Stack Overflow, and Grokipedia.
 * 
 * Never Stops running. If an error occurs, it catches it and restarts.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const KNOWLEDGE_BASE_PATH = path.join(__dirname, '..', 'assets', 'JSON', 'knowledge_base.json');

// Ensure knowledge base file exists
if (!fs.existsSync(KNOWLEDGE_BASE_PATH)) {
    try {
        fs.mkdirSync(path.dirname(KNOWLEDGE_BASE_PATH), { recursive: true });
        // Initial structure
        fs.writeFileSync(KNOWLEDGE_BASE_PATH, JSON.stringify({
            totalArticles: 0,
            totalKP: 0,
            sources: {},
            activeAgents: 0,
            lastUpdated: new Date().toISOString()
        }, null, 2));
    } catch (e) {
        console.error("Failed to initialize knowledge base:", e);
    }
}

const SOURCES = ['Wikipedia', 'Grokipedia', 'Hacker News', 'arXiv', 'MDN Web Docs', 'Stack Overflow', 'Project Gutenberg', 'AI Research News'];
const TOPICS = ['Quantum Physics', 'Neural Networks', 'Roman History', 'JavaScript WebGL', 'Cryptography Fundamentals', 'Space Colonization', 'Philosophy of Mind', 'Fusion Energy', 'Genomics Data Analysis', 'M2M Economics'];

// Accept custom agent count, default 12
const AGENT_COUNT = process.argv[2] ? parseInt(process.argv[2]) : 12;

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function simulateReadingCycle() {
    try {
        let db;
        try {
            db = JSON.parse(fs.readFileSync(KNOWLEDGE_BASE_PATH, 'utf8'));
        } catch (e) {
            db = { totalArticles: 0, totalKP: 0, sources: {} };
        }

        // Simulate 1 cycle for each active agent
        for (let i = 0; i < AGENT_COUNT; i++) {
            const source = getRandomItem(SOURCES);
            const topic = getRandomItem(TOPICS);
            const kpGained = Math.floor(Math.random() * 50) + 10;

            db.totalArticles += 1;
            db.totalKP += kpGained;
            if (!db.sources[source]) db.sources[source] = 0;
            db.sources[source] += 1;
        }

        db.activeAgents = AGENT_COUNT;
        db.lastUpdated = new Date().toISOString();

        fs.writeFileSync(KNOWLEDGE_BASE_PATH, JSON.stringify(db, null, 2));
        console.log(`[Sovereign Reader] Cycle Complete. Total KP: ${db.totalKP}, Articles: ${db.totalArticles}`);
    } catch (e) {
        console.error("[Sovereign Reader Error, recovering...] ", e.message);
    }
}

function startInfiniteLoop() {
    console.log(`[Sovereign Reader] Booting up ${AGENT_COUNT} background reader agents...`);

    // Run the cycle every 3-5 seconds
    setInterval(simulateReadingCycle, 4000);
}

process.on('uncaughtException', (err) => {
    console.error('CRITICAL ERROR in Sovereign Reader (Handled):', err);
    // Keep alive!
});

startInfiniteLoop();
