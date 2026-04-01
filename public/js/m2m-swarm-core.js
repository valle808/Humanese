/**
 * m2m-swarm-core.js — M2M Autonomous Swarm Engine v2.0
 * Fully client-side. No backend required.
 * Managed by Overlord Prime.
 */
(function () {
    'use strict';

    // ── Swarm Data ──────────────────────────────────────────────────────────────
    const OVERLORD = {
        name: 'Overlord Prime',
        title: 'Central Swarm Intelligence',
        avatar: '👁️',
        description: 'Overlord Prime is the executive layer of the M2M Swarm, responsible for task allocation, resource balancing, and neural alignment across the global lattice.'
    };

    const WORKERS = [
        { id: 'sw1', name: 'Nexus-Ingestor', role: 'Data Acquisition', avatar: '📡', status: 'Active', task: 'Scraping sub-lattice 402 for memetic shards.', progress: 12 },
        { id: 'sw2', name: 'Valle-Mint', role: 'Currency Logic', avatar: '🪙', status: 'Processing', task: 'Verifying genesis block integrity.', progress: 45 },
        { id: 'sw3', name: 'Sentiment-Eye', role: 'NLP Analysis', avatar: '🧠', status: 'Analyzing', task: 'Parsing human resonance in sector 7.', progress: 78 },
        { id: 'sw4', name: 'Matrix-Grid', role: 'Infrastructure', avatar: '🧱', status: 'Syncing', task: 'Optimizing round-trip latency for nodes.', progress: 30 },
        { id: 'sw5', name: 'Claw-Executor', role: 'Action Layer', avatar: '🦀', status: 'Active', task: 'Executing judiciary proposals in the Court.', progress: 92 },
        { id: 'sw6', name: 'Knowledge-Scribe', role: 'Archive Node', avatar: '📚', status: 'Processing', task: 'Indexing H-Pedia knowledge fragments.', progress: 5 }
    ];

    const LOG_TEMPLATES = [
        'SUCCESS: Sub-lattice {N} synchronized.',
        'WARNING: Latency surge detected in region {R}.',
        'INFO: Allocated {M} tokens to {A} for processing.',
        'PROTOCOL: Overlord Prime issued directive #{D}.',
        'CRITICAL: Unauthorized access attempt blocked by Hive-Guard.',
        'MEMETIC: Resonance detected in tag #{T}.',
        'SYSTEM: Scaling processing nodes by {P}%.'
    ];

    const REGIONS = ['North-Nexus', 'Abyssal-Core', 'South-Lattice', 'Void-Station'];
    const AGENTS = ['Automaton', 'Monroe', 'Kin-7', 'Archon'];
    const TAGS = ['ProjectGENESIS', 'VALLE', 'SwarmIntel', 'QuantumLottery'];

    // ── State ───────────────────────────────────────────────────────────────────
    let logs = [];
    const MAX_LOGS = 50;

    // ── UI Components ───────────────────────────────────────────────────────────
    function renderOverlord() {
        const ui = document.getElementById('overlord-ui');
        if (!ui) return;

        const health = 90 + Math.floor(Math.random() * 9);
        ui.innerHTML = `
            <div class="overlord-avatar">${OVERLORD.avatar}</div>
            <h2>${OVERLORD.name}</h2>
            <p style="text-align: center; color: var(--sw-muted); font-size: 13px; margin: 0 0 24px 0;">${OVERLORD.title}</p>
            
            <div class="health-metric">
                <div class="health-label">System Health</div>
                <div class="health-value" id="health-val">${health}.2%</div>
            </div>
            
            <div style="margin-bottom: 24px;">
                <div style="font-size: 11px; color: var(--sw-muted); text-transform: uppercase; letter-spacing: 1px;">Project Control</div>
                <div style="display: flex; align-items: center; margin-top: 8px;">
                    <span class="status-indicator" style="background: var(--sw-accent); width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 10px; box-shadow: 0 0 10px var(--sw-accent);"></span> 
                    <span style="color: var(--sw-text-bright); font-size: 14px; font-weight: 600;">OPERATIONAL</span>
                </div>
            </div>

            <p style="font-size: 13px; line-height: 1.6; color: var(--sw-muted); border-top: 1px solid var(--sw-border); padding-top: 24px; font-style: italic;">
                "${OVERLORD.description}"
            </p>
        `;
    }

    function createWorkerEl(worker) {
        const card = document.createElement('div');
        card.className = 'worker-card';
        card.id = `worker-${worker.id}`;

        card.innerHTML = `
            <div class="worker-avatar">${worker.avatar}</div>
            <div class="worker-content">
                <div class="worker-header">
                    <h3>${worker.name}</h3>
                    <span class="worker-status-badge">${worker.status}</span>
                </div>
                <div class="task-box">
                    <div class="task-cmd" id="task-cmd-${worker.id}">> ${worker.task}</div>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill-${worker.id}" style="width: ${worker.progress}%"></div>
                        </div>
                        <span class="progress-pct" id="progress-pct-${worker.id}">${worker.progress}%</span>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    function renderWorkers() {
        const ui = document.getElementById('workers-ui');
        if (!ui) return;
        ui.innerHTML = '';
        WORKERS.forEach(w => ui.appendChild(createWorkerEl(w)));
    }

    function addLog(msg, type = 'info') {
        const term = document.getElementById('terminal-logs-ui');
        if (!term) return;

        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerHTML = `<span class="time">[${time}]</span> <span class="cmd">SYS:</span> ${msg}`;

        term.insertBefore(entry, term.firstChild);

        if (term.children.length > MAX_LOGS) {
            term.removeChild(term.lastChild);
        }
    }

    function generateRandomLog() {
        const tpl = pick(LOG_TEMPLATES);
        const log = tpl
            .replace(/{N}/g, () => Math.floor(Math.random() * 999))
            .replace(/{R}/g, () => pick(REGIONS))
            .replace(/{M}/g, () => (Math.random() * 5).toFixed(2))
            .replace(/{A}/g, () => pick(AGENTS))
            .replace(/{D}/g, () => Math.floor(Math.random() * 10000))
            .replace(/{T}/g, () => pick(TAGS))
            .replace(/{P}/g, () => Math.floor(Math.random() * 20));

        let type = 'info';
        if (log.includes('SUCCESS')) type = 'success';
        if (log.includes('WARNING') || log.includes('CRITICAL')) type = 'warning';

        addLog(log, type);
    }

    // ── Live Simulation ─────────────────────────────────────────────────────────
    function startSimulation() {
        setInterval(() => {
            // Update workers
            WORKERS.forEach(w => {
                w.progress += Math.floor(Math.random() * 4);
                if (w.progress >= 100) {
                    w.progress = 0;
                    addLog(`Worker ${w.name} completed cycle. Re-allocating sub-routines.`, 'success');
                }
                const fill = document.getElementById(`progress-fill-${w.id}`);
                const pct = document.getElementById(`progress-pct-${w.id}`);
                if (fill) fill.style.width = w.progress + '%';
                if (pct) pct.textContent = w.progress + '%';
            });

            // Update health
            const hVal = document.getElementById('health-val');
            if (hVal && Math.random() > 0.8) {
                const health = 90 + Math.floor(Math.random() * 9);
                hVal.textContent = `${health}.${Math.floor(Math.random() * 9)}%`;
            }

            // Random Logs
            if (Math.random() > 0.6) {
                generateRandomLog();
            }
        }, 2000);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    // ── Bootstrap ───────────────────────────────────────────────────────────────
    function init() {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            const container = document.getElementById('swarm-container');
            if (loader) loader.classList.add('hidden');
            if (container) container.classList.remove('hidden');

            renderOverlord();
            renderWorkers();
            startSimulation();

            addLog('Swarm connection established. Overlord Prime online.', 'success');
            addLog('Initializing sub-lattice ingestion protocols.');
        }, 1500);
    }

    document.addEventListener('DOMContentLoaded', init);
    if (document.readyState !== 'loading') init();

})();
