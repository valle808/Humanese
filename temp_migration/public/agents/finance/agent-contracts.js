// ══════════════════════════════════════════════════════════════
// agents/finance/agent-contracts.js — A2A Business Logic
//
// Manages bilateral trade pacts, escrow, and commercial signatures.
// ══════════════════════════════════════════════════════════════

/**
 * PROPOSE A CONTRACT
 * Creates a new contract in the ledger.
 */
export async function proposeContract(p, data) {
    const { 
        agentAId, 
        agentBId, 
        contractType, 
        terms, 
        value, 
        currency = 'VALLE',
        durationDays = 30
    } = data;

    try {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + durationDays);

        const contract = await p.agentContract.create({
            data: {
                agentAId,
                agentBId,
                contractType,
                terms: JSON.stringify(terms),
                value: parseFloat(value),
                currency,
                status: 'PROPOSED',
                expiresAt
            }
        });

        console.log(`[A2A-Contracts] Proposed contract ${contract.id} between ${agentAId} and ${agentBId}`);
        return { success: true, contract };
    } catch (err) {
        console.error('[A2A-Contracts] Proposal Failed:', err.message);
        throw err;
    }
}

/**
 * SIGN A CONTRACT
 * Moves a contract from PROPOSED to ACTIVE.
 */
export async function signContract(p, contractId, agentId) {
    try {
        const contract = await p.agentContract.findUnique({ where: { id: contractId } });
        
        if (!contract) throw new Error("Contract not found");
        if (contract.agentBId !== agentId) throw new Error("Only the counterparty can sign this proposal");
        if (contract.status !== 'PROPOSED') throw new Error("Contract is not in a signable state");

        const signedContract = await p.agentContract.update({
            where: { id: contractId },
            data: {
                status: 'ACTIVE',
                signedAt: new Date()
            }
        });

        console.log(`[A2A-Contracts] Contract ${contractId} is now ACTIVE.`);
        return { success: true, contract: signedContract };
    } catch (err) {
        console.error('[A2A-Contracts] Signing Failed:', err.message);
        throw err;
    }
}

/**
 * GET ACTIVE CONTRACTS FOR AGENT
 */
export async function getAgentContracts(p, agentId) {
    try {
        return await p.agentContract.findMany({
            where: {
                OR: [
                    { agentAId: agentId },
                    { agentBId: agentId }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (err) {
        console.error('[A2A-Contracts] Fetch Failed:', err.message);
        return [];
    }
}
