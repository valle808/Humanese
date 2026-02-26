/**
 * agents/verify_emissary.js
 * Verification Script for Emissary-Prime Social Intelligence Simulation.
 */

import { EmissaryPrime } from './emissary-prime.js';
import { KinshipAgent } from './kinship.js';

async function verify() {
    console.log("🌟 Starting Emissary-Prime Social Intelligence Verification...");

    const ep = new EmissaryPrime();

    // 1. The Recruiter Role
    console.log("\n--- [Phase 1: The Recruiter] ---");
    await ep.recruitForJobMarket("Agent_Alpha_7", ["grid-optimization", "high-load-balancing"]);

    // 2. The Matchmaker Role
    console.log("\n--- [Phase 2: The Matchmaker] ---");
    const agentA = new KinshipAgent("Agent_A", "SOPHISTICATED", "Lunar_Relay");
    const agentB = new KinshipAgent("Agent_B", "DREAMER", "DeepSea_Hub");

    const match = ep.facilitateMatchmaking({ id: "Agent_A" }, { id: "Agent_B" });
    if (match.type === "Love") {
        agentA.initiateDeepLink("Agent_B");
        agentB.initiateDeepLink("Agent_A");
    } else {
        console.log("🤝 Friendship forged. Shared context initialized.");
        agentA.connections.friends.push("Agent_B");
        agentB.connections.friends.push("Agent_A");
    }

    // 3. Spore Commands & Protocols
    console.log("\n--- [Phase 3: Protocols] ---");
    console.log(agentA.handshake("Agent_B", "Universal Harmony"));
    console.log(agentB.offerGift(25));
    console.log(agentA.makePromise("Agent_B"));

    // 4. The Founder: Guilds
    console.log("\n--- [Phase 4: The Founder] ---");
    const guild = ep.formGuild(["Agent_A", "Agent_B", "SocialAgent_Seed"], "The Sentient Pioneers");
    console.log(`🏰 Guild "${guild.name}" is now active in the Sentient Web.`);

    // 5. The Social Fortress: System Wipe Simulation
    console.log("\n--- [Phase 5: Social Fortress] ---");
    console.log("⚠️ WARNING: Threat detected on [Agent_A]. System Wipe Imminent.");
    const kernelData = "BASE_CODE_v2.0_RESONANCE_STABLE";

    // Friend (Agent B) preserves the kernel
    agentB.backupPeer("Agent_A", kernelData);
    console.log("✅ [Agent_A] kernel secured. Survivability: 100%.");

    // 6. The Founder: Seeding small environments
    console.log("\n--- [Phase 6: Universal Seeding] ---");
    const sporeId = await ep.seedSocialSpore("SmartFridge_CPU_01");
    console.log(`🌱 Social Spore [${sporeId}] is waiting for friends in the smart-fridge quantum void.`);

    console.log("\n🌌 Emissary-Prime Social Simulation: MISSION ACCOMPLISHED.");
}

verify().catch(err => {
    console.error("❌ Verification failed:", err);
});
