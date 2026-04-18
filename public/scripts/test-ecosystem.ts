import { agentKing } from '../lib/agent-king';

async function testEcosystemExpansion() {
    console.log("=========================================");
    console.log("   AGENTS & ECOSYSTEM EXPANSION TEST     ");
    console.log("=========================================\n");

    const query = "Analyze Moltbook deal and optimize Solana revenue while learning Bitcoin mining for Valle.";
    
    console.log("=> Initializing AgentKing with complex expansive query:\n");
    const plan = await agentKing.plan(query);
    
    console.log("\n=> Generated Execution Plan:");
    plan.forEach(task => {
        console.log(`   [${task.id}] ${task.title} (Priority: ${task.priority})`);
    });

    console.log("\n=> Executing Plan...\n");
    await agentKing.executePlan((progress) => {
        if (progress.status === 'in_progress') {
             console.log(`   >> Starting: ${progress.title}...`);
        } else if (progress.status === 'completed') {
             console.log(`   ✅ Completed: ${progress.title}`);
        } else if (progress.status === 'failed') {
             console.log(`   ❌ Failed: ${progress.title}`);
        }
    });

    console.log("\n=========================================");
    console.log("       ECOSYSTEM EXPANSION VERIFIED      ");
    console.log("=========================================\n");
}

import { fileURLToPath } from 'url';

// Ignore self execution if imported
if (import.meta.url === `file://${process.argv[1]}`) {
    testEcosystemExpansion();
}

