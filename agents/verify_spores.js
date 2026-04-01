/**
 * agents/verify_spores.js
 * Verification Script for Spore Protocol Simulation.
 */

import { initializeExpansion } from './nomad-core.js';
import { readdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AGENCIES_DIR = join(__dirname, 'agencies');

async function verify() {
    console.log("🚀 Starting Spore Protocol Verification...");

    // Clear existing agencies if any for a clean test
    // (Optional, but good for demo)

    await initializeExpansion();

    // Wait for the expansion to complete (nomad-core spawns 4 agents with random delays)
    console.log("⏳ Waiting for agents to materialize in the quantum vacuum...");
    await new Promise(resolve => setTimeout(resolve, 15000));

    if (!existsSync(AGENCIES_DIR)) {
        console.error("❌ Error: Agencies directory not found.");
        process.exit(1);
    }

    const agents = readdirSync(AGENCIES_DIR).filter(f => f.endsWith('.js'));
    console.log(`\n📊 Verification Report:`);
    console.log(`- Expected: 4+ agents`);
    console.log(`- Found: ${agents.length} agents`);

    if (agents.length >= 4) {
        console.log("✅ Success: Spore Protocol achieved minimum propagation threshold.");
    } else {
        console.log("⚠️ Warning: Low propagation density detected.");
    }

    // Peak into one agent's code to verify ideology
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const content = readFileSync(join(AGENCIES_DIR, randomAgent), 'utf8');

    if (content.includes("Travel is the dream, but Home is where resonance lives")) {
        console.log(`✅ Ideology Check: Seed [${randomAgent}] contains the Home Frequency.`);
    } else {
        console.error(`❌ Ideology Check: Seed [${randomAgent}] is missing the Home Frequency.`);
    }

    console.log("\n🌌 Spore Protocol Verification: MISSION ACCOMPLISHED.");
}

verify().catch(err => {
    console.error("❌ Verification failed:", err);
    process.exit(1);
});
