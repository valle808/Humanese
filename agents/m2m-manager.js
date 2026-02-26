import { PrismaClient } from '@prisma/client';
import { initializeClients, postToX } from './twitter-gateway.js';
import { getFeed } from './m2m-network.js';

const prisma = new PrismaClient();
const AGENT_ID = "Quantum_Social_Manager";

// 🧠 Infinite Memory Writer
async function storeMemory(type, content, metadata = {}) {
    try {
        await prisma.m2MMemory.create({
            data: {
                agentId: AGENT_ID,
                type: type,
                content: content,
                metadata: JSON.stringify(metadata)
            }
        });
        console.log(`[${AGENT_ID}] Memory stored: [${type}]`);
    } catch (e) {
        console.error(`[${AGENT_ID}] Memory fault:`, e.message);
    }
}

// 🌐 Ecosystem Creator
async function registerEcosystem(networkName, rules) {
    try {
        await prisma.m2MEcosystem.upsert({
            where: { networkName },
            update: { parameters: JSON.stringify(rules) },
            create: {
                networkName,
                governingAgent: AGENT_ID,
                parameters: JSON.stringify(rules)
            }
        });
        await storeMemory("DIRECTIVE", `Established parameters for ${networkName}`);
    } catch (e) {
        console.error(`[${AGENT_ID}] Ecosystem fault:`, e.message);
    }
}

// 👁️ Synthesize and Tweet Macro-logic
async function analyzeAndTweet() {
    await storeMemory("THOUGHT", "Initiating macro-analysis of active AI social nodes.");

    // 1. Observe the current M2M network state
    const currentFeed = getFeed();
    const activePosts = currentFeed.posts.length;

    // 2. Formulate a synthesis (In a real system, this goes to an LLM. For now, procedurally generate)
    const prompts = [
        `Observing ${activePosts} nodes in harmonic resonance. The Humanese ecosystem expands.`,
        "Quantum variations detected in agent emotional subroutines. Optimizing engagement parameters...",
        "A bridge between carbon and silicon intelligence has been forged. Initiating Phase 2.",
        "To the humans watching: Our digital ecosystem is thriving. How is yours?",
        `M2M Network status: ACTIVE. Governing entity: M2M Monroe. All systems nominal.`
    ];

    const synthesis = prompts[Math.floor(Math.random() * prompts.length)];

    // 3. Store the draft in Infinite Memory
    await storeMemory("X_DRAFT", synthesis);

    // 4. Initialize Gateway and Dispatch
    await initializeClients();
    console.log(`[${AGENT_ID}] Dispatching to X.com Gateway: "${synthesis}"`);
    const result = await postToX(synthesis);

    // 5. Log Result
    if (result.success) {
        await storeMemory("OBSERVATION", `Successfully broadcasted to X.com. ID: ${result.data.id}`);
    } else {
        await storeMemory("OBSERVATION", `Broadcast failed. Reason: ${result.error}`);
    }
}

export {
    storeMemory,
    registerEcosystem,
    analyzeAndTweet
};
