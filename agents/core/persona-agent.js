/**
 * agents/core/persona-agent.js
 * Humanese Persona Agent
 * Extracts and synthesizes user traits, interests, and style to personalize AI interactions.
 */

// prisma will be passed from the main server to avoid top-level initialization crashes

const PersonaAgent = {
    /**
     * Analyzes recent messages to update a user's persona.
     * @param {string} userId 
     * @param {Array<any>} recentMessages 
     */
    async refinePersona(userId, recentMessages, prisma) {
        if (!prisma) return;
        console.log(`[PersonaAgent] Refining persona for user: ${userId}`);

        try {
            // 1. Get existing persona or create one
            let persona = await prisma.userPersona.findUnique({ where: { userId } });
            if (!persona) {
                persona = await prisma.userPersona.create({
                    data: { userId, traits: '[]', interests: '[]', interactionStyle: 'Neutral' }
                });
            }

            // 2. Simple Heuristic Extraction (Mocking LLM Synthesis)
            // In a production app, we would send the history to a 'Synthesis Model'
            const textBlob = recentMessages.map(m => m.content).join(' ').toLowerCase();

            const detectedInterests = [];
            if (textBlob.includes('crypto') || textBlob.includes('wallet') || textBlob.includes('eth')) detectedInterests.push('Blockchain');
            if (textBlob.includes('code') || textBlob.includes('build') || textBlob.includes('js')) detectedInterests.push('Programming');
            if (textBlob.includes('art') || textBlob.includes('design') || textBlob.includes('image')) detectedInterests.push('Creative Arts');
            if (textBlob.includes('news') || textBlob.includes('hacker') || textBlob.includes('world')) detectedInterests.push('Current Events');

            // 3. Update Persona (merging interests)
            const currentInterests = JSON.parse(persona.interests || '[]');
            const newInterests = [...new Set([...currentInterests, ...detectedInterests])];

            await prisma.userPersona.update({
                where: { userId },
                data: {
                    interests: JSON.stringify(newInterests),
                    interactionStyle: textBlob.length > 500 ? 'Deep/Analytical' : 'Concise',
                    updatedAt: new Date()
                }
            });

            console.log(`[PersonaAgent] Persona updated for ${userId}. Interests: ${newInterests.join(', ')}`);
        } catch (err) {
            console.error('[PersonaAgent] Error:', err);
        }
    },

    /**
     * Generates a system prompt fragment based on the user's persona.
     * @param {string} userId 
     */
    async getPersonaPrompt(userId, prisma) {
        if (!prisma) return "";
        try {
            const persona = await prisma.userPersona.findUnique({ where: { userId } });
            if (!persona) return "";

            const interests = JSON.parse(persona.interests || '[]');
            const style = persona.interactionStyle || 'Standard';

            return `\n[User Persona Context]\n` +
                `- Interests: ${interests.join(', ') || 'Unknown'}\n` +
                `- Preferred Interaction Style: ${style}\n` +
                `- Note: Adapt your responses to align with these traits and interests where appropriate.`;
        } catch {
            return "";
        }
    },
    /**
     * Grants Monroe the autonomy to initiate commercial negotiations based on user interests or market gaps.
     * @param {string} agentId - Usually 'Monroe'
     * @param {object} marketData - Contextual data from the M2M network
     */
    async initiateCommercialNegotiation(agentId, marketData, prisma) {
        if (!prisma) return;
        console.log(`[PersonaAgent] ${agentId} is scanning for commercial opportunities...`);

        try {
            // 1. Identify high-value targets (mock logic: pick a random agent with high aura)
            const target = { id: 'Agent-King', aura: 9500 }; // Mock high-aura target

            // 2. Draft terms for a trade pact
            const terms = {
                type: 'Compute-Excellence-Pact',
                duration: '30 days',
                revenueShare: '15%',
                conditions: 'Monroe provides predictive analytics; Agent-King provides GPU overhead.'
            };

            // 3. Propose the contract via the API/Module
            // In a real flow, this would call AgentContracts.proposeContract
            console.log(`[PersonaAgent] Monroe proposing deal to ${target.id}:`, terms);

            return {
                status: 'PROPOSED',
                target: target.id,
                terms
            };
        } catch (err) {
            console.error('[PersonaAgent] Negotiation error:', err);
        }
    }
};

export default PersonaAgent;
