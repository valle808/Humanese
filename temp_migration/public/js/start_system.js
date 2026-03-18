/**
 * Humanese Bootloader (start_system.js)
 * 
 * Auto-starts the entire Sovereign System ecosystem based on current hardware resources.
 * 
 * Launches:
 * 1. Swarm Manager (System Resource Monitor & Agent Spawner)
 * 2. Sovereign Reader Swarm (Knowledge Extractor)
 */

import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimal Resource Profiling
const cpus = os.cpus().length;
const totalRamGB = os.totalmem() / 1024 / 1024 / 1024;

console.log(`[BOOTLOADER] Initiating Humanese Ecosystem...`);
console.log(`[BOOTLOADER] Hardware Detected: ${cpus} Cores, ${totalRamGB.toFixed(1)} GB RAM`);

// Determine optimal reader count (max 24)
let customReaderCount = Math.min(Math.floor(cpus * 1.5), 24);
if (totalRamGB < 4) customReaderCount = Math.min(customReaderCount, 4);

console.log(`[BOOTLOADER] Provisioning ${customReaderCount} Sovereign Readers for optimal ingestion...`);

function launchDaemon(scriptPath, args = [], name) {
    const p = spawn('node', [scriptPath, ...args], {
        cwd: path.dirname(scriptPath),
        stdio: 'inherit'
    });

    p.on('close', (code) => {
        console.warn(`[BOOTLOADER] ${name} exited with code ${code}. Restarting...`);
        setTimeout(() => launchDaemon(scriptPath, args, name), 2000);
    });

    return p;
}

// 1. Launch Swarm Manager
launchDaemon(path.join(__dirname, 'agents', 'swarm_manager.js'), [], 'Swarm Manager');

// 2. Launch Sovereign Reader 
launchDaemon(path.join(__dirname, 'agents', 'sovereign-reader.js'), [customReaderCount.toString()], 'Sovereign Reader Swarm');

console.log(`[BOOTLOADER] All systems GO.`);

// Keep bootloader alive
process.stdin.resume();
