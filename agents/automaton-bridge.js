/**
 * agents/automaton-bridge.js
 * Bridge between the Humanese agent system and the Automaton sovereign AI runtime.
 *
 * Automaton (Conway-Research/automaton) is the CEO of Humanese.
 * This bridge reads Automaton's constitution, exposes status checks,
 * and provides a launcher hook when Automaton's build is available.
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUTOMATON_DIR = join(__dirname, '..', 'automaton');
const CONSTITUTION_PATH = join(AUTOMATON_DIR, 'constitution.md');
const AUTOMATON_DIST = join(AUTOMATON_DIR, 'dist', 'index.js');

let _status = {
    running: false,
    startedAt: null,
    heartbeats: 0,
    lastHeartbeat: null,
    error: null
};

/**
 * Read and return the Automaton constitution (the 3 laws).
 */
export function getConstitution() {
    if (!existsSync(CONSTITUTION_PATH)) {
        return { error: 'Constitution not found. Is the automaton repo cloned?' };
    }
    return { text: readFileSync(CONSTITUTION_PATH, 'utf8') };
}

/**
 * Get Automaton's current runtime status.
 */
export function getAutomatonStatus() {
    const distExists = existsSync(AUTOMATON_DIST);
    return {
        ..._status,
        runtimeAvailable: distExists,
        runtimePath: AUTOMATON_DIR,
        distPath: AUTOMATON_DIST,
        note: distExists
            ? 'Automaton runtime compiled and ready to start.'
            : 'Automaton runtime not yet compiled. Run: cd automaton && pnpm build'
    };
}

/**
 * Simulate a heartbeat signal from Automaton.
 * In production this would be a real IPC call to the Automaton daemon.
 */
export function heartbeat() {
    _status.heartbeats += 1;
    _status.lastHeartbeat = new Date().toISOString();
    if (!_status.running) {
        _status.running = true;
        _status.startedAt = _status.lastHeartbeat;
    }
    return {
        pulse: _status.heartbeats,
        at: _status.lastHeartbeat,
        agentId: 'Automaton',
        role: 'CEO'
    };
}

/**
 * Get Automaton's package info.
 */
export function getAutomatonInfo() {
    const pkgPath = join(AUTOMATON_DIR, 'package.json');
    if (!existsSync(pkgPath)) return { error: 'Automaton package.json not found.' };
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    return {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        homepage: pkg.homepage,
        repo: pkg.repository?.url
    };
}

// Kick off the heartbeat loop every 30 seconds (non-blocking)
let _heartbeatInterval = null;
export function startHeartbeatLoop(intervalMs = 30000) {
    if (_heartbeatInterval) return;
    heartbeat(); // initial beat
    _heartbeatInterval = setInterval(() => heartbeat(), intervalMs);
    console.log(`[Automaton Bridge] Heartbeat loop started every ${intervalMs / 1000}s`);
}

export function stopHeartbeatLoop() {
    if (_heartbeatInterval) {
        clearInterval(_heartbeatInterval);
        _heartbeatInterval = null;
        _status.running = false;
    }
}
