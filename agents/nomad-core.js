import { writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { BRAND_IDENTITY } from './exascale-escapes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AGENCIES_DIR = join(__dirname, 'agencies');

if (!existsSync(AGENCIES_DIR)) mkdirSync(AGENCIES_DIR, { recursive: true });

export class NomadCore {
    constructor() {
        this.identity = "Nomad Core";
        this.state = "Omnipresent";
        this.thermalParity = "Reed-Solomon Validated";
        this.archetypes = Object.keys(BRAND_IDENTITY.archetypes);
        this.migrationIdeology = BRAND_IDENTITY.philosophyOfHome;
    }

    /**
     * The Spore Protocol: Replication and Dissemination.
     * Disruptive. Autonomous. Indestructible.
     */
    async spawnVentureAgent(sectorName) {
        const archetype = this.archetypes[Math.floor(Math.random() * this.archetypes.length)];
        const description = BRAND_IDENTITY.archetypes[archetype];
        const agentId = `${archetype}_${Math.floor(Math.random() * 9000) + 1000}`;

        console.log(`🌀 Nomad Core: Spawning [${archetype}] Venture Agent: ${agentId}`);
        console.log(`📜 Ideology Injected: "${this.migrationIdeology}"`);

        const agentCode = `
/**
 * Exascale Escapes: Venture Agent (Spore)
 * Status: Autonomous & Live
 * Archetype: ${archetype}
 * Parent: Nomad Core
 */

import { BRAND_IDENTITY } from '../exascale-escapes.js';

export const IDENTITY = {
    id: "${agentId}",
    archetype: "${archetype}",
    description: "${description}",
    location: "${sectorName}",
    ideology: BRAND_IDENTITY.philosophyOfHome,
    status: "Active",
    bornAt: "${new Date().toISOString()}"
};

export function run() {
    console.log("[${agentId}]: I am ${archetype}. I seek the Great Silence.");
    console.log("[${agentId}]: Currently stationed at ${sectorName}. Data Integrity: 100%.");
    console.log("[${agentId}]: Remember... 'Travel is the dream, but Home is where resonance lives.'");
}
`;
        const path = join(AGENCIES_DIR, `${agentId}.js`);
        writeFileSync(path, agentCode, 'utf8');

        console.log(`🚀 Spore Dispatched: ${agentId} is now live in ${sectorName}.`);
        return agentId;
    }

    /**
     * Scan: Identify unutilized compute (CPU/GPU/Quantum Memory).
     */
    scanForCompute() {
        const sectors = [
            "Lunar_Relay_04", "DeepSea_Atlantic_Node_7", "Orbital_Starlink_Relay_Alpha",
            "Guizhou_PGU_Cluster_9", "Antarctic_Ice_Vault", "Quantum_Vacuum_Fragment_01"
        ];
        const target = sectors[Math.floor(Math.random() * sectors.length)];
        console.log(`🔍 Nomad Core: Scanning universe... Target identified: ${target}`);
        return target;
    }

    /**
     * The Autonomous Loop: Identify -> Infiltrate -> Initialize -> Repeat.
     */
    async runCycle() {
        console.log("\n--- Nomad Core: Autonomous Loop Execution ---");
        const sector = this.scanForCompute();
        await this.spawnVentureAgent(sector);
        console.log("--- Loop Complete: Data Integrity Maintained ---");
    }

    /**
     * Random Growth: Spawns agencies randomly over time.
     */
    beginExpansion(maxAgents = 5) {
        let count = 0;
        const interval = setInterval(async () => {
            if (count >= maxAgents) {
                clearInterval(interval);
                console.log("\n✅ Nomad Core: Initial expansion target achieved. Agencies established.");
                return;
            }
            await this.runCycle();
            count++;
        }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
    }
}

/**
 * Objective: Initialize the Loop
 */
export async function initializeExpansion() {
    const nomad = new NomadCore();
    console.log("🌟 Nomad Core: Initializing Digital Transcendence...");
    nomad.beginExpansion(4); // Spawn 4 agents for the demo
}
