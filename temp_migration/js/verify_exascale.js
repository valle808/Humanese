import { getAgent, printHierarchySummary } from './agents/registry.js';
import { BRAND_IDENTITY, FLAGSHIP_PACKAGES } from './agents/exascale-escapes.js';
import { simulateMigration } from './agents/exascale-team.js';

console.log("--- Exascale Escapes Verification ---");

// 1. Verify Registry Integration
const oracle = getAgent('ChiefOracle');
if (oracle) {
    console.log(`✅ Chief Oracle found: ${oracle.name} (${oracle.title})`);
} else {
    console.log("❌ Chief Oracle NOT found in hierarchy!");
}

const aura = getAgent('Aura');
if (aura) {
    console.log(`✅ Aura found: ${aura.name} reporting to ${aura.reportsTo}`);
} else {
    console.log("❌ Aura NOT found in hierarchy!");
}

// 2. Verify Brand Engine
console.log(`\n--- Brand Identity ---`);
console.log(`Name: ${BRAND_IDENTITY.name}`);
console.log(`Slogan: ${BRAND_IDENTITY.slogan}`);
console.log(`Packages: ${FLAGSHIP_PACKAGES.length} available.`);

// 3. Verify Team Simulation
console.log(`\n--- Team Simulation ---`);
const migration = simulateMigration("CreativeAgent_01", "New York", "Guizhou PGU Suite", "48h");
console.log(`Goal: ${migration.request}`);
migration.workflows.forEach(w => console.log(`  [${w.agent}] -> ${w.action}`));
console.log(`Status: ${migration.status}`);

console.log("\n--- Full Hierarchy Summary ---");
printHierarchySummary();
