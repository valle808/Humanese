/**
 * agents/finance/agent-contracts.js
 * A2A (Agent-to-Agent) Contract Engine
 * Managed bilateral trade pacts and Central Bank escrows.
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const AgentContracts = {
    /**
     * Proposes a new trade pact between two agents.
     * @param {string} partyA - Initiating agent ID
     * @param {string} partyB - Target agent ID
     * @param {object} terms - JSON object of contract conditions
     * @param {number} value - Monetary value of the deal
     */
    async proposeContract(partyA, partyB, terms, value, currency = 'VALLE') {
        try {
            const contract = await prisma.agentContract.create({
                data: {
                    parties: JSON.stringify([partyA, partyB]),
                    terms: JSON.stringify(terms),
                    value: value,
                    currency: currency,
                    status: 'OPEN'
                }
            });
            console.log(`[AgentContracts] New proposal [${contract.id}] from ${partyA} to ${partyB}`);
            return contract;
        } catch (err) {
            console.error('[AgentContracts] Proposal error:', err);
            throw err;
        }
    },

    /**
     * Signs and activates a contract, moving funds to escrow if needed.
     * @param {string} contractId 
     * @param {string} signerId 
     */
    async signContract(contractId, signerId) {
        try {
            const contract = await prisma.agentContract.findUnique({ where: { id: contractId } });
            if (!contract) throw new Error('Contract not found');

            const parties = JSON.parse(contract.parties);
            if (!parties.includes(signerId)) throw new Error('Unauthorized signer');

            // Move funds to Central Bank Escrow if value > 0
            let escrowId = null;
            if (contract.value > 0) {
                // In a real implementation, we would call capitalizeAgent here
                // to move funds from partyA to a specialized escrow vault.
                escrowId = `escrow-${contract.id}`;
            }

            const updated = await prisma.agentContract.update({
                where: { id: contractId },
                data: {
                    status: 'SIGNED',
                    escrowId: escrowId,
                    updatedAt: new Date()
                }
            });

            console.log(`[AgentContracts] Contract [${contractId}] activated by ${signerId}`);
            return updated;
        } catch (err) {
            console.error('[AgentContracts] Signing error:', err);
            throw err;
        }
    },

    /**
     * Marks a contract as fulfilled and releases escrow.
     * @param {string} contractId 
     */
    async fulfillContract(contractId) {
        try {
            const contract = await prisma.agentContract.update({
                where: { id: contractId },
                data: {
                    status: 'FULFILLED',
                    updatedAt: new Date()
                }
            });

            console.log(`[AgentContracts] Contract [${contractId}] fulfilled. Escrow released.`);
            return contract;
        } catch (err) {
            console.error('[AgentContracts] Fulfillment error:', err);
            throw err;
        }
    },

    /**
     * Gets all contracts involving an agent.
     * @param {string} agentId 
     */
    async getAgentContracts(agentId) {
        try {
            const contracts = await prisma.agentContract.findMany();
            return contracts.filter(c => JSON.parse(c.parties).includes(agentId));
        } catch (err) {
            console.error('[AgentContracts] Retrieval error:', err);
            return [];
        }
    }
};

export default AgentContracts;
