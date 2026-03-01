/**
 * agents/election.js
 * Election system for choosing a new Agent-King.
 *
 * Rules:
 * - Only the Special Council (5 members) can open an election.
 * - An election requires UNANIMOUS vote from the council to open.
 * - Candidates are scored on: performanceScore (40%), taskCompletionRate (40%), peersVotes (20%).
 * - The candidate with the highest composite score wins.
 * - The winner is written to hierarchy.json as the new agentKingId.
 * - All elections are recorded in elections.log.
 */

import { readFileSync, writeFileSync, appendFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HIERARCHY_PATH = join(__dirname, 'hierarchy.json');
const ELECTIONS_LOG = join(__dirname, 'elections.log');

function loadHierarchy() {
    return JSON.parse(readFileSync(HIERARCHY_PATH, 'utf8'));
}

function saveHierarchy(data) {
    writeFileSync(HIERARCHY_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function logElection(record) {
    const line = JSON.stringify({ ...record, timestamp: new Date().toISOString() }) + '\n';
    appendFileSync(ELECTIONS_LOG, line, 'utf8');
}

/**
 * Open an election with council votes.
 * @param {Array<{councilId: string, approve: boolean}>} councilVotes
 * @param {Array<{candidateId: string, peersVotes: number}>} candidateNominations
 * @returns {{ success: boolean, winner: object|null, message: string }}
 */
export function runElection(councilVotes, candidateNominations = []) {
    const hierarchy = loadHierarchy();
    const agents = hierarchy.agents;

    // ── Step 1: Validate council votes ──────────────────────────
    const council = agents.filter(a => a.role === 'special-council');
    const councilIds = council.map(a => a.id);

    const approvals = councilVotes.filter(v => councilIds.includes(v.councilId) && v.approve);
    const required = councilIds.length; // unanimous

    if (approvals.length < required) {
        const msg = `Election blocked. Got ${approvals.length}/${required} council approvals. Unanimous vote required.`;
        logElection({ type: 'election-blocked', approvals: approvals.length, required, councilVotes });
        return { success: false, winner: null, message: msg };
    }

    // ── Step 2: Build candidate list ────────────────────────────
    const peerVoteMap = {};
    candidateNominations.forEach(n => { peerVoteMap[n.candidateId] = n.peersVotes || 0; });

    const candidates = agents.filter(a => a.isElectable && a.role !== 'special-council');

    if (candidates.length === 0) {
        return { success: false, winner: null, message: 'No electable candidates found.' };
    }

    // ── Step 3: Score candidates ─────────────────────────────────
    // Composite = 40% performanceScore + 40% taskCompletionRate*100 + 20% peerVoteNormalized
    const maxPeerVotes = Math.max(...candidates.map(c => peerVoteMap[c.id] || 0), 1);

    const scored = candidates.map(a => {
        const peerScore = ((peerVoteMap[a.id] || 0) / maxPeerVotes) * 100;
        const composite = (a.performanceScore * 0.4) + (a.taskCompletionRate * 100 * 0.4) + (peerScore * 0.2);
        return { ...a, peersVotes: peerVoteMap[a.id] || 0, compositeScore: Math.round(composite * 100) / 100 };
    });

    scored.sort((a, b) => b.compositeScore - a.compositeScore);
    const winner = scored[0];

    // ── Step 4: Install the new Agent-King ──────────────────────
    const previousKing = hierarchy.agentKingId;
    hierarchy.agentKingId = winner.id;
    hierarchy.lastUpdated = new Date().toISOString();

    // Reset winner's role to agent-king in agents array
    const winnerAgent = hierarchy.agents.find(a => a.id === winner.id);
    if (winnerAgent) {
        winnerAgent.previousRole = winnerAgent.role;
        winnerAgent.role = 'agent-king';
    }

    saveHierarchy(hierarchy);

    // ── Step 5: Record the election ─────────────────────────────
    const electionRecord = {
        type: 'election-complete',
        previousKing,
        newKing: winner.id,
        winnerName: winner.name,
        compositeScore: winner.compositeScore,
        standings: scored.map(a => ({ id: a.id, name: a.name, score: a.compositeScore }))
    };
    logElection(electionRecord);

    if (!hierarchy.electionHistory) hierarchy.electionHistory = [];
    hierarchy.electionHistory.push(electionRecord);
    saveHierarchy(hierarchy);

    return {
        success: true,
        winner: { id: winner.id, name: winner.name, score: winner.compositeScore },
        standings: scored.map(a => ({ id: a.id, name: a.name, score: a.compositeScore })),
        message: `Election complete. New Agent-King: ${winner.name} (Score: ${winner.compositeScore})`
    };
}

/** Get the election history */
export function getElectionHistory() {
    const hierarchy = loadHierarchy();
    return hierarchy.electionHistory || [];
}

/** Get the current Agent-King */
export function getCurrentKing() {
    const hierarchy = loadHierarchy();
    return hierarchy.agents.find(a => a.id === hierarchy.agentKingId) || null;
}
