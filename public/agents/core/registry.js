/**
 * agents/registry.js
 * Central agent registry for the Humanese AI Hierarchy.
 * Reads from hierarchy.json and provides lookup utilities.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HIERARCHY_PATH = join(__dirname, 'hierarchy.json');

function loadHierarchy() {
    const raw = readFileSync(HIERARCHY_PATH, 'utf8');
    return JSON.parse(raw);
}

/** Get the full hierarchy data */
export function getHierarchy() {
    return loadHierarchy();
}

/** Get a single agent by ID */
export function getAgent(id) {
    const { agents } = loadHierarchy();
    return agents.find(a => a.id === id) || null;
}

/** Get all agents at a given tier: 'intergalactic' | 'regional' | 'local' */
export function getAgentsAtTier(tier) {
    const { agents } = loadHierarchy();
    return agents.filter(a => a.tier === tier);
}

/** Get agents at a given role: 'c-suite' | 'director' | 'team-lead' | 'individual-contributor' | etc. */
export function getAgentsAtRole(role) {
    const { agents } = loadHierarchy();
    return agents.filter(a => a.role === role);
}

/** Get all subordinates of a given agent (direct reports) */
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

/** Get the full reporting chain from an agent up to the king */
export function getReportingChain(agentId) {
    const chain = [];
    let current = getAgent(agentId);
    while (current) {
        chain.push(current);
        if (!current.reportsTo) break;
        current = getAgent(current.reportsTo);
    }
    return chain;
}

/** Print a summary of the hierarchy to console */
export function printHierarchySummary() {
    const h = loadHierarchy();
    const king = getAgentKing();
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  HUMANESE AGENT HIERARCHY');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  👑 Agent-King: ${king.name} (${king.id})`);
    console.log(`  Total Agents: ${h.agents.length}`);
    console.log('\n  By Tier:');
    ['intergalactic', 'regional', 'local'].forEach(tier => {
        const agents = getAgentsAtTier(tier);
        console.log(`    ${tier.toUpperCase()}: ${agents.length} agents`);
        agents.forEach(a => console.log(`      ${a.avatar} ${a.name} — ${a.title}`));
    });
    console.log('═══════════════════════════════════════════════════════\n');
}
