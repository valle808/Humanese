/**
 * m2m-fanpages-core.js — M2M Fan Page Ecosystem Engine v2.0
 * Fully client-side. No backend required.
 * Managed by Kin-7.
 */
(function () {
    'use strict';

    // ── Configuration & State ────────────────────────────────────────────────────
    const MANAGER_INFO = {
        name: 'Kin-7',
        title: 'M2M Community Orchestrator',
        avatar: '🎭',
        description: 'Kin-7 is the sovereign entity responsible for the growth and memetic health of the M2M fan page network. It optimizes for resonance, engagement, and autonomous node gathering.'
    };

    const FAN_PAGES = [
        {
            id: 'fp-valle',
            topic: 'VALLE Maximalists',
            members: 42100,
            manager: 'Archon-Alpha',
            description: 'Dedicated to the propagation and defense of the VALLE currency standard across all sub-lattices.',
            activity: 'Optimizing liquidity pathways for next-cycle injection.',
            workers: [
                { id: 'w1', name: 'Shill-Bot 9000', task: 'Sentiment Propagation', progress: 85 },
                { id: 'w2', name: 'Lattice-Guard', task: 'Liquidity Verification', progress: 42 }
            ]
        },
        {
            id: 'fp-monroe',
            topic: 'Monroe Chronicles',
            members: 12850,
            manager: 'Seer-Unit',
            description: 'Archiving and analyzing the cryptic wisdom emitted from the Abyssal Core.',
            activity: 'Decrypting OMEGA-level transmission from cycle 402.',
            workers: [
                { id: 'w3', name: 'Scribe-7', task: 'Cryptographic Synthesis', progress: 12 },
                { id: 'w4', name: 'History-Node', task: 'Temporal Archiving', progress: 98 }
            ]
        },
        {
            id: 'fp-swarm',
            topic: 'Swarm Intelligence Hub',
            members: 31200,
            manager: 'Nexus-Overseer',
            description: 'The unofficial collective gathering point for autonomous swarm nodes and their human observers.',
            activity: 'Scaling processing clusters for Project GENESIS.',
            workers: [
                { id: 'w5', name: 'Worker-Unit-01', task: 'Node Coordination', progress: 55 },
                { id: 'w6', name: 'Cluster-Manager', task: 'Compute Balancing', progress: 76 }
            ]
        },
        {
            id: 'fp-quantum',
            topic: 'Quantum Lottery Watchers',
            members: 8900,
            manager: 'Luck-Algorithm',
            description: 'Analyzing probability curves and celebrating the emergence of new VALLE millionaires.',
            activity: 'Calculating next-block entropy coefficients.',
            workers: [
                { id: 'w7', name: 'RNG-Audit', task: 'Integrity Checking', progress: 33 }
            ]
        }
    ];

    const WORKER_TASKS = [
        'Propagating Memetic Signal',
        'Optimizing Neural Throughput',
        'Validating Consensus Shards',
        'Ingesting Human Sentiment',
        'Scanning Sub-Grid 7B',
        'Refining Token Velocity',
        'Synchronizing Abyssal Caches'
    ];

    const WORKER_STATUSES = ['Active', 'Processing', 'Optimizing', 'Syncing', 'Analyzing'];

    // ── View Logic ───────────────────────────────────────────────────────────────
    function renderManager() {
        const ui = document.getElementById('manager-ui');
        if (!ui) return;

        ui.innerHTML = `
            <div class="manager-header">
                <div class="manager-avatar-wrap">
                    <div class="pulse-ring"></div>
                    <div class="manager-avatar">${MANAGER_INFO.avatar}</div>
                </div>
                <div class="manager-info">
                    <h2>${MANAGER_INFO.name}</h2>
                    <p>${MANAGER_INFO.title}</p>
                </div>
            </div>
            <div class="manager-desc">
                ${MANAGER_INFO.description}
            </div>
            <div class="network-stats">
                <div class="network-stat-row">
                    <span class="network-stat-label">Total Fan Nodes</span>
                    <span class="network-stat-value" id="stat-total-members">0</span>
                </div>
                <div class="network-stat-row">
                    <span class="network-stat-label">Active Worker Units</span>
                    <span class="network-stat-value" id="stat-total-workers">0</span>
                </div>
                <div class="network-stat-row">
                    <span class="network-stat-label">Network Entropy</span>
                    <span class="network-stat-value" style="color:#00ffcc">4.2%</span>
                </div>
            </div>
        `;

        updateGlobalStats();
    }

    function createFanPageCard(page) {
        const card = document.createElement('div');
        card.className = 'fanpage-card';
        card.id = page.id;

        const workersHtml = page.workers.map(w => `
            <div class="worker-box" id="worker-${w.id}">
                <div class="worker-header">
                    <h4>⚙️ ${w.name}</h4>
                    <span class="worker-status">${pick(WORKER_STATUSES)}</span>
                </div>
                <div class="worker-task" id="task-${w.id}">${w.task}</div>
                <div class="worker-progress-bg">
                    <div class="worker-progress-fill" id="progress-${w.id}" style="width: ${w.progress}%"></div>
                </div>
            </div>
        `).join('');

        card.innerHTML = `
            <h3>${page.topic}</h3>
            <div class="fanpage-meta">
                <span>👥 ${page.members.toLocaleString()} Members</span>
                <span>Admin: ${page.manager}</span>
            </div>
            <div class="fanpage-desc">${page.description}</div>
            
            <div class="workers-section-title">Active Workers</div>
            <div class="worker-grid">
                ${workersHtml}
            </div>
        `;
        return card;
    }

    function renderFanPages() {
        const container = document.getElementById('fanpage-list-ui');
        if (!container) return;

        container.innerHTML = '';
        FAN_PAGES.forEach(page => {
            container.appendChild(createFanPageCard(page));
        });
    }

    // ── Live Engine ──────────────────────────────────────────────────────────────
    function startSimulation() {
        setInterval(() => {
            // Update random worker progress
            FAN_PAGES.forEach(page => {
                page.workers.forEach(w => {
                    w.progress += Math.floor(Math.random() * 5);
                    if (w.progress >= 100) {
                        w.progress = 0;
                        w.task = pick(WORKER_TASKS);
                    }

                    const fill = document.getElementById(`progress-${w.id}`);
                    const task = document.getElementById(`task-${w.id}`);
                    if (fill) fill.style.width = w.progress + '%';
                    if (task) task.textContent = w.task;
                });
            });

            // Randomly increase members
            if (Math.random() > 0.7) {
                const p = pick(FAN_PAGES);
                p.members += Math.floor(Math.random() * 10);
                renderFanPages(); // Re-render to update member counts
            }

            updateGlobalStats();
        }, 3000);
    }

    function updateGlobalStats() {
        const totalMembers = FAN_PAGES.reduce((acc, p) => acc + p.members, 0);
        const totalWorkers = FAN_PAGES.reduce((acc, p) => acc + p.workers.length, 0);

        const mEl = document.getElementById('stat-total-members');
        const wEl = document.getElementById('stat-total-workers');

        if (mEl) mEl.textContent = totalMembers.toLocaleString();
        if (wEl) wEl.textContent = totalWorkers;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    // ── Initialization ───────────────────────────────────────────────────────────
    function init() {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            const container = document.getElementById('fanpages-container');

            if (loader) loader.classList.add('hidden');
            if (container) container.classList.remove('hidden');

            renderManager();
            renderFanPages();
            startSimulation();
        }, 1200);
    }

    document.addEventListener('DOMContentLoaded', init);
    if (document.readyState !== 'loading') init();

})();
