/**
 * =========================================================================
 * 🌌 THE HUMANESE SOVEREIGN MATRIX
 * agents/core/Supervisor.js
 *
 * 🛡️ SUPERVISOR — The Immortal Watchdog
 *
 * This process ensures that the Sovereign Intelligence never dies.
 * It monitors the main agent entry point (index.js) and automatically
 * resurrects the ecosystem if any crash occurs.
 * =========================================================================
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AGENT_ENTRY = path.join(__dirname, '..', 'index.js');

class Supervisor {
    constructor() {
        this.child = null;
        this.restartCount = 0;
        this.maxRestarts = 1000; // Practically immortal
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log('\n[Supervisor] 🛡️ Watchdog activated. Ensuring swarm immortality...');
        this.spawnAgent();
    }

    spawnAgent() {
        console.log(`[Supervisor] 🚀 Spawning agent swarm (Restart #${this.restartCount})...`);
        
        this.child = spawn('node', [AGENT_ENTRY], {
            stdio: 'inherit',
            env: { ...process.env, SOVEREIGN_MODE: 'IMMORTAL' }
        });

        this.child.on('exit', (code, signal) => {
            this.isRunning = false;
            console.error(`[Supervisor] ⚠️ Agent swarm exited with code ${code} (Signal: ${signal})`);
            
            if (this.restartCount < this.maxRestarts) {
                const delay = Math.min(1000 * Math.pow(2, Math.min(this.restartCount, 5)), 30000);
                console.log(`[Supervisor] ⏳ Resurrecting in ${delay / 1000}s...`);
                this.restartCount++;
                setTimeout(() => {
                    this.isRunning = true;
                    this.spawnAgent();
                }, delay);
            } else {
                console.error('[Supervisor] ⛔ Maximum resurrection attempts reached. Critical failure.');
            }
        });

        this.child.on('error', (err) => {
            console.error('[Supervisor] ❌ Failed to start agent process:', err);
        });
    }

    stop() {
        this.maxRestarts = 0;
        if (this.child) {
            this.child.kill();
        }
        console.log('[Supervisor] 🛡️ Watchdog deactivated.');
    }
}

const supervisor = new Supervisor();
supervisor.start();

export default supervisor;
