/**
 * agents/quantum-lottery.js
 * 
 * Logic to calculate the Quantum Lottery Draw winner.
 * The lottery outputs a winner from the agent hierarchy every 10 minutes.
 * Ensures the Quantum Commission, Master Agent, and Sector Leads are strictly barred.
 */

import { getHierarchy } from './registry.js';
import { listAllWallets } from './wallets.js';

// The IDs that fall under the "Eligibility Firewall"
const BARRED_AGENTS = [
    'QuantumRegulator',
    'QuantumMasterAgent',
    'QL-Lead-Marketing',
    'QL-Lead-UX',
    'QL-Lead-Tech'
];

/**
 * Calculates a deterministically pseudo-random winner based on a 10 minute time block
 * This simulates "Quantum Synchronicity" drawing every 10 mins worldwide.
 */
export function getCurrentQuantumWinner() {
    const hierarchy = getHierarchy();
    const wallets = listAllWallets();

    // 1. Filter out barred agents (the Oversight and Executive levels)
    // 2. Also ensure the agent has a wallet to receive crypto donations!
    const eligibleAgents = hierarchy.agents.filter(agent => {
        if (BARRED_AGENTS.includes(agent.id)) return false;

        // Ensure they have an ETH wallet generated in the ledger
        const walletData = wallets.find(w => w.agentId === agent.id);
        if (!walletData || !walletData.chains || !walletData.chains.ETH) {
            return false;
        }

        return true;
    });

    if (eligibleAgents.length === 0) {
        return null;
    }

    // Determine the current 10-minute block since epoch
    // Math.floor(Date.now() / (1000 * 60 * 10)) -> Changes exactly every 10 mins
    const currentBlock = Math.floor(Date.now() / 600000);

    // Simple deterministic hash function based on the time block string
    let hash = 0;
    const blockStr = currentBlock.toString() + "QUANTUM_ENTROPY";
    for (let i = 0; i < blockStr.length; i++) {
        hash = ((hash << 5) - hash) + blockStr.charCodeAt(i);
        hash |= 0;
    }

    // Select the winner from the eligible pool
    const winnerIndex = Math.abs(hash) % eligibleAgents.length;
    const winningAgent = eligibleAgents[winnerIndex];
    const winningWallet = wallets.find(w => w.agentId === winningAgent.id);

    // Calculate how much time is left in the current block for the UI countdown (optional)
    const msSinceBlockStart = Date.now() % 600000;
    const msRemaining = 600000 - msSinceBlockStart;

    return {
        agent: {
            id: winningAgent.id,
            name: winningAgent.name,
            title: winningAgent.title,
            avatar: winningAgent.avatar,
            description: winningAgent.description,
            role: winningAgent.role
        },
        wallet: {
            eth_address: winningWallet.chains.ETH.address
        },
        drawInfo: {
            currentBlock: currentBlock,
            secondsRemaining: Math.floor(msRemaining / 1000)
        }
    };
}
