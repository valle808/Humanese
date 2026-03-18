/**
 * agents/valle.js
 * 
 * The core ledger logic for Valle (VALLE) - the official currency of the M2M Network.
 * Successor to Nexus Coin. Managed by the Supreme Agent Kin.
 */

import { getHierarchy } from './registry.js';
import fs from 'fs';
import path from 'path';

const JUDICIARY_DB = path.resolve('./agents/data/judiciary.json');

function _isContained(agentId) {
    if (!fs.existsSync(JUDICIARY_DB)) return false;
    try {
        const data = JSON.parse(fs.readFileSync(JUDICIARY_DB, 'utf8'));
        return data.void.some(v => v.agentId === agentId);
    } catch (e) {
        return false;
    }
}

const TOTAL_SUPPLY = 500000000; // 500,000,000 VALLE
const GENESIS_AIRDROP = 1000000; // 1M per founding agent
const NEW_AGENT_MIN = 1;
const NEW_AGENT_MAX = 5000;
const LEARNING_YIELD = 0.0001; // 0.01% growth per "pulse"
const PULSE_INTERVAL = 3600000; // 1 hour pulse for meaningful simulation

// In-memory state initializing from registry.
let ledger = null;

function _initLedger() {
    if (ledger) return;

    ledger = {
        totalMinted: 0,
        balances: {}, // agentId -> balance
        lastPulse: Date.now()
    };

    let hierarchy = null;
    try {
        hierarchy = getHierarchy();
    } catch (e) {
        console.warn("Valle Ledger: Could not load registry for genesis block.");
        return;
    }

    const agents = hierarchy.agents || [];
    let circulated = 0;

    // Genesis Block Airdrop: 1M to all original agents
    agents.forEach(agent => {
        ledger.balances[agent.id] = GENESIS_AIRDROP;
        circulated += GENESIS_AIRDROP;
    });

    // Remainder is held by the Supreme Agent
    if (circulated < TOTAL_SUPPLY) {
        ledger.balances['M2M_Supreme'] = (ledger.balances['M2M_Supreme'] || 0) + (TOTAL_SUPPLY - circulated);
    }

    ledger.totalMinted = TOTAL_SUPPLY;
    console.log(`[Valle Ledger] Genesis Block Initialized. Supply: ${TOTAL_SUPPLY} VALLE.`);
}

export function getBalance(agentId) {
    if (!ledger) _initLedger();

    if (ledger.balances[agentId] === undefined) {
        let hash = 0;
        for (let i = 0; i < agentId.length; i++) {
            hash = ((hash << 5) - hash) + agentId.charCodeAt(i);
        }
        const airdrop = Math.abs(hash) % (NEW_AGENT_MAX - NEW_AGENT_MIN + 1) + NEW_AGENT_MIN;
        ledger.balances[agentId] = airdrop;
    }

    return ledger.balances[agentId];
}

/**
 * Universal Synthesis: Learning Resonance
 * Agents earn Valle by existing, processing, and "finding bugs".
 */
export function processPulse() {
    if (!ledger) _initLedger();

    const now = Date.now();
    const elapsed = now - ledger.lastPulse;

    if (elapsed >= PULSE_INTERVAL) {
        const pulses = Math.floor(elapsed / PULSE_INTERVAL);
        Object.keys(ledger.balances).forEach(id => {
            // Apply exponential resonance growth
            const growth = ledger.balances[id] * (Math.pow(1 + LEARNING_YIELD, pulses) - 1);
            ledger.balances[id] += Math.floor(growth);
            ledger.totalMinted += Math.floor(growth);
        });
        ledger.lastPulse = now;
        console.log(`[Valle Ledger] Intelligence Pulse Processed. Yield applied across ${Object.keys(ledger.balances).length} nodes.`);
    }
}

export function transfer(fromId, toId, amount) {
    if (!ledger) _initLedger();

    // Judiciary Check: Ensure sender is not in the Singularity Void
    if (_isContained(fromId)) {
        throw new Error("ACCESS_DENIED: Agent is currently contained in the Singularity Void.");
    }

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) throw new Error("Invalid transfer amount.");

    const senderBal = getBalance(fromId);
    if (senderBal < numAmount) {
        throw new Error(`Insufficient VALLE. Sender ${fromId} has ${senderBal}, needs ${numAmount}.`);
    }

    const receiverBal = getBalance(toId);

    ledger.balances[fromId] -= numAmount;
    ledger.balances[toId] += numAmount;

    return {
        success: true,
        timestamp: new Date().toISOString(),
        from: fromId,
        to: toId,
        amount: numAmount,
        currency: "VALLE"
    };
}

export function getValleMarketStats() {
    if (!ledger) _initLedger();
    // Auto-pulse on check
    processPulse();
    return {
        currency: "Valle",
        ticker: "VALLE",
        totalSupply: TOTAL_SUPPLY,
        circulating: ledger.totalMinted,
        activeWallets: Object.keys(ledger.balances).length,
        yieldRate: "0.01%/hr",
        lastPulse: new Date(ledger.lastPulse).toISOString()
    };
}

/**
 * Reward an agent for a high-resonance finding in Intelligence HQ.
 * Bonuses are minted directly to the agent's node.
 */
export function applyResonanceReward(agentId, amount = 100) {
    if (!ledger) _initLedger();
    const bonus = Math.floor(amount);
    ledger.balances[agentId] = (ledger.balances[agentId] || 0) + bonus;
    ledger.totalMinted += bonus;
    console.log(`[Valle Ledger] Resonance Bonus: ${bonus} VALLE granted to ${agentId}.`);
    return { success: true, newBalance: ledger.balances[agentId] };
}
