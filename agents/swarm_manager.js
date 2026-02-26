import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATUS_FILE = path.join(__dirname, '../assets/JSON/swarm_status.json');

// Ensure directory exists
const statusDir = path.dirname(STATUS_FILE);
if (!fs.existsSync(statusDir)) {
    fs.mkdirSync(statusDir, { recursive: true });
}

const MAX_AGENTS = 1111;
const SPAWN_INTERVAL_MS = 3000;
const RESOURCE_CHECK_MS = 2000;

// Resource thresholds
const CPU_BUSY_THRESHOLD = 80; // percent
const RAM_FREE_THRESHOLD_MB = 500;

let agents = [];

class Agent {
    constructor(id) {
        this.id = id;
        this.state = 'active'; // 'active' or 'hibernating'
        this.data = { memories: [] };
        this.interval = null;
        this.wake();
    }

    wake() {
        if (this.state === 'active' && this.interval) return;
        this.state = 'active';
        this.interval = setInterval(() => {
            // Simulated learning / processing
            this.data.memories.push(Date.now());
            if (this.data.memories.length > 100) this.data.memories.shift();
        }, 1000 + Math.random() * 2000);
    }

    hibernate() {
        if (this.state === 'hibernating') return;
        this.state = 'hibernating';
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// CPU load calculation
let previousCpus = os.cpus();
function getCpuLoad() {
    let startIdle = 0, startTotal = 0;
    let endIdle = 0, endTotal = 0;

    const currentCpus = os.cpus();
    for (let i = 0, len = currentCpus.length; i < len; i++) {
        let cpu = currentCpus[i];
        let prevCpu = previousCpus[i];

        for (let type in cpu.times) {
            endTotal += cpu.times[type];
            startTotal += prevCpu.times[type];
        }
        endIdle += cpu.times.idle;
        startIdle += prevCpu.times.idle;
    }
    previousCpus = currentCpus;

    let idle = endIdle - startIdle;
    let total = endTotal - startTotal;
    let percentage = total === 0 ? 0 : (10000 - Math.round(10000 * idle / total)) / 100;
    return percentage;
}

function spawnAgent() {
    if (agents.length < MAX_AGENTS) {
        const newAgent = new Agent(`Agent_${agents.length + 1}`);
        agents.push(newAgent);
        console.log(`[Swarm] Spawning agent ${newAgent.id}. Total: ${agents.length}`);
    }
}

function monitorResources() {
    const cpuLoad = getCpuLoad();
    const freeMemMB = os.freemem() / 1024 / 1024;

    const isOverloaded = cpuLoad > CPU_BUSY_THRESHOLD || freeMemMB < RAM_FREE_THRESHOLD_MB;

    let activeCount = 0;
    let hibernatingCount = 0;

    if (isOverloaded) {
        console.log(`[Resource Monitor] Overloaded! CPU: ${cpuLoad.toFixed(1)}%, Free RAM: ${freeMemMB.toFixed(0)}MB. Hibernating some agents...`);
        // Hibernate agents to free resources
        for (let agent of agents) {
            if (agent.state === 'active') {
                agent.hibernate();
                hibernatingCount++;
            } else {
                hibernatingCount++;
            }
        }
    } else {
        // Wake up agents slowly or at once
        for (let agent of agents) {
            if (agent.state === 'hibernating') {
                agent.wake();
            }
            if (agent.state === 'active') activeCount++;
            else hibernatingCount++;
        }
    }

    // Write status
    const status = {
        totalAgents: agents.length,
        activeAgents: activeCount,
        hibernatingAgents: hibernatingCount,
        system: {
            cpuPercent: parseFloat(cpuLoad.toFixed(1)),
            freeRamMB: parseFloat(freeMemMB.toFixed(1)),
            totalRamMB: parseFloat((os.totalmem() / 1024 / 1024).toFixed(1))
        },
        timestamp: new Date().toISOString()
    };

    fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
}

// Start intervals
setInterval(spawnAgent, SPAWN_INTERVAL_MS);
setInterval(monitorResources, RESOURCE_CHECK_MS);

console.log('Swarm Manager initialized. Spawning up to 1111 agents.');
monitorResources();
