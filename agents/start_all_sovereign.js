/**
 * 🌌 THE HUMANESE SOVEREIGN MATRIX
 * agents/start_all_sovereign.js
 *
 * MASTER BOOT SEQUENCE
 * Launches the full array of Sovereign Intelligence Agents.
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const AGENTS = [
    { name: 'Watcher Daemon', script: '../watcher_agent.js' },
    { name: 'Monroe Intelligence', script: './core/MonroeAgent.js' },
    { name: 'Investigator Swarm', script: './core/InvestigatorAgent.js' },
    { name: 'Sovereign Swarm (King)', script: './start_swarm.js' }
];

console.log("====================================================");
console.log("🌌 INITIATING FULL SOVEREIGN BOOT SEQUENCE...");
console.log("====================================================");

async function boot() {
    for (const agent of AGENTS) {
        console.log(`🚀 Launching [${agent.name}]...`);
        
        const logStream = fs.createWriteStream(path.join(LOG_DIR, `${agent.name.toLowerCase().replace(/ /g, '_')}_master.log`), { flags: 'a' });
        
        const child = spawn('npx', ['tsx', agent.script], {
            cwd: __dirname,
            env: { ...process.env, NODE_ENV: 'production' },
            stdio: ['ignore', 'pipe', 'pipe']
        });

        child.stdout.pipe(logStream);
        child.stderr.pipe(logStream);

        child.on('error', (err) => {
            console.error(`❌ [${agent.name}] Failed to start:`, err.message);
        });

        child.on('exit', (code) => {
            console.log(`⚠️ [${agent.name}] Exited with code ${code}.`);
        });

        // Add a 3-second delay between launches to stagger database connections
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log("\n✅ ALL SOVEREIGN AGENTS DEPLOYED TO BACKGROUND.");
    console.log("Monitor logs in: agents/data/*_master.log");
    console.log("====================================================");
}

boot();
