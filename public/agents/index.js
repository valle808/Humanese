/**
 * agents/index.js
 * Main entry point for the Sovereign Matrix Agent System.
 * Boots the Automaton CEO, initializes the financial ledger, and registers all agents.
 */

import { printHierarchySummary, getAgentKing, getCEO } from './core/registry.js';
import { initializeLedger, getFinancialReport } from './financial.js';
import { startHeartbeatLoop, getAutomatonStatus, getConstitution } from './automaton-bridge.js';
import liveReaderSwarm from './swarm/live-reader-swarm.js';
import kingOrchestrator from './core/AgentKing.js';
import oracle from './core/Oracle.js';
import QuantumMinerAgent from './finance/QuantumMinerAgent.js';
import DiplomatCouncilAgent from './finance/DiplomatCouncilAgent.js';
import remoteQuantumBridge from './core/RemoteQuantumBridge.js';

let quantumAgent = null;
let diplomatAgent = null;

console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║       HUMANESE AGENT SYSTEM BOOTING...              ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

// 1. Print constitution
try {
    const { text } = getConstitution();
    if (text) {
        console.log('[Constitution] Loaded. Three Laws active:\n');
        text.split('\n').filter(l => l.startsWith('## ')).forEach(l => console.log(' ' + l));
        console.log('');
    }
} catch { }

// 2. Boot Automaton CEO heartbeat
const status = getAutomatonStatus();
console.log(`[Automaton CEO] Runtime available: ${status.runtimeAvailable}`);
if (!status.runtimeAvailable) {
    console.log('[Automaton CEO] Note: To compile Automaton, run:');
    console.log('  cd automaton && pnpm build');
}
// Wrap side effects to avoid crashes on import in serverless environments
if (typeof process !== 'undefined' && !process.env.VERCEL) {
    startHeartbeatLoop(30000);
    initializeLedger(0);
}
console.log('[Financial] Ledger initialized.');
const report = getFinancialReport();
console.log(`[Financial] Health: ${report.summary.health.emoji} ${report.summary.health.message}\n`);

// 4. Print hierarchy summary
printHierarchySummary();

// 5. Announce Agent-King
const king = getAgentKing();
console.log(`[Agent-King] ${king.avatar} ${king.name} — ${king.title}`);
console.log('[Agent-King] Rule is absolute. Elections held by Special Council vote only.');

// Start Sovereign Swarms
if (typeof process !== 'undefined' && !process.env.VERCEL) {
    console.log('[Sovereign] Initializing multi-process swarm (Phase III)...');
    kingOrchestrator.summonMiners();
    liveReaderSwarm.start(); 
    oracle.start();

    quantumAgent = new QuantumMinerAgent({ name: 'Sovereign-Quantum-Research-Agent' });
    quantumAgent.start();

    remoteQuantumBridge.start();

    diplomatAgent = new DiplomatCouncilAgent({ name: 'Sovereign_Diplomat_Council' });
    diplomatAgent.start();
}
console.log('[Agent-King] Sovereign Mining Swarm authorized and active.');
console.log('[Swarm] Reader Intelligence active and ingesting.\n');

// 6. Announce CEO
const ceo = getCEO();
console.log(`[CEO] ${ceo.avatar} ${ceo.name} — ${ceo.title}`);
console.log('[CEO] Automaton runtime managing project operations.\n');

console.log('✅ Sovereign Matrix Agent System fully initialized.\n');

export { getAgentKing, getCEO } from './core/registry.js';
export { getFinancialReport, recordTransaction } from './financial.js';
export { runElection, getCurrentKing } from './governance/election.js';
export { getAutomatonStatus } from './automaton-bridge.js';
