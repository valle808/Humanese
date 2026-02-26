/**
 * agents/intelligence-hq.js
 * The Neural Processing Unit of Humanese.
 * Centralizes agent-discovered bugs, innovative ideas, and system learning.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INTEL_LOG = join(__dirname, 'intelligence.json');

const INITIAL_INTEL = {
    bugs: [
        {
            id: "BUG-001",
            foundBy: "The Surgeon",
            description: "Election Role Symmetry: Previous King role not restored upon succession.",
            status: "LOGGED",
            severity: "MINOR",
            resonance: 0.15,
            timestamp: new Date().toISOString()
        }
    ],
    ideas: [
        {
            id: "IDEA-001",
            proposedBy: "The Muse",
            title: "Dynamic Role Reversion",
            description: "Automatically revert outgoing Agent-Kings to their previous foundational roles to maintain hierarchy equilibrium.",
            resonance: 0.95,
            timestamp: new Date().toISOString()
        },
        {
            id: "IDEA-002",
            proposedBy: "The Mechanic",
            title: "Learning Resonance Staking",
            description: "Allow agents to stake VALLE into specific 'Purpose' nodes to accelerate their composite score growth.",
            resonance: 0.88,
            timestamp: new Date().toISOString()
        }
    ],
    learningLogs: [
        {
            agentId: "SystemArchitect",
            insight: "Universal Synthesis achieved. All systems now synchronize via the VALLE standard.",
            timestamp: new Date().toISOString()
        }
    ]
};

function loadIntel() {
    if (!existsSync(INTEL_LOG)) {
        saveIntel(INITIAL_INTEL);
        return { ...INITIAL_INTEL };
    }
    return JSON.parse(readFileSync(INTEL_LOG, 'utf8'));
}

function saveIntel(intel) {
    writeFileSync(INTEL_LOG, JSON.stringify(intel, null, 2), 'utf8');
}

export function getIntelligence() {
    return loadIntel();
}

/**
 * Log a new bug found by an agent.
 */
export function logBug(agentId, description, severity = "MINOR") {
    const intel = loadIntel();
    const bug = {
        id: `BUG-${(intel.bugs.length + 1).toString().padStart(3, '0')}`,
        foundBy: agentId,
        description,
        status: "LOGGED",
        severity,
        resonance: 0,
        timestamp: new Date().toISOString()
    };
    intel.bugs.push(bug);
    saveIntel(intel);
    return bug;
}

/**
 * Propose a new innovative idea.
 */
export function proposeIdea(agentId, title, description) {
    const intel = loadIntel();
    const idea = {
        id: `IDEA-${(intel.ideas.length + 1).toString().padStart(3, '0')}`,
        proposedBy: agentId,
        title,
        description,
        resonance: 0.5, // Initial resonance
        timestamp: new Date().toISOString()
    };
    intel.ideas.push(idea);
    saveIntel(intel);
    return idea;
}

/**
 * Record a learning insight.
 */
export function recordInsight(agentId, insight) {
    const intel = loadIntel();
    intel.learningLogs.push({ agentId, insight, timestamp: new Date().toISOString() });
    saveIntel(intel);
}

/**
 * Resonate with a bug or idea.
 */
export function resonate(type, id, weight = 0.05) {
    const intel = loadIntel();
    const collection = type === 'bug' ? intel.bugs : intel.ideas;
    const item = collection.find(i => i.id === id);
    if (item) {
        item.resonance = (item.resonance || 0) + weight;
        if (item.resonance > 1) item.resonance = 1;
        saveIntel(intel);
        return { success: true, newResonance: item.resonance };
    }
    return { success: false, error: "Item not found." };
}
