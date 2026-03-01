import { storeMemory, registerEcosystem, analyzeAndTweet } from './agents/m2m-manager.js';

async function runM2MManagerTests() {
    console.log("--- Initializing Quantum Social Manager Tests ---");

    // 1. Test infinite memory storage
    await storeMemory("THOUGHT", "Running diagnostic tests on infinite memory matrix.");
    console.log("Memory storage simulated.");

    // 2. Test ecosystem logic
    await registerEcosystem("X_GATEWAY", { "max_latency": "100ms", "sentiment_baseline": "positive" });
    console.log("Ecosystem parameters saved.");

    // 3. Test tweeting logic (Will fail gracefully because of missing OAuth tokens)
    console.log("Triggering analysis and tweet generation...");
    await analyzeAndTweet();

    console.log("--- Tests Completed ---");
}

runM2MManagerTests().catch(console.error);
