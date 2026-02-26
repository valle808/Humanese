document.addEventListener('DOMContentLoaded', () => {
    fetchSwarmData();
    // Refresh every 5 seconds to simulate live processing
    setInterval(fetchSwarmData, 5000);
});

async function fetchSwarmData() {
    try {
        const response = await fetch('http://localhost:3000/api/m2m/swarm');
        if (!response.ok) throw new Error("Failed to connect to Swarm Overlord.");
        const data = await response.json();

        renderDashboard(data);
    } catch (err) {
        document.getElementById('loader').textContent = err.message;
    }
}

let lastLogCount = 0;

function renderDashboard(data) {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('swarm-container').classList.remove('hidden');

    // Render Overlord
    const overlordHtml = `
        <div class="overlord-avatar">${data.overlord.avatar}</div>
        <h2>${data.overlord.name}</h2>
        <p style="text-align: center; color: #888; font-size: 13px; margin: 0 0 24px 0;">${data.overlord.title}</p>
        
        <div style="margin-bottom: 24px;">
            <div style="font-size: 12px; color: #555; text-transform: uppercase;">System Health</div>
            <div style="font-size: 24px; color: #00ffcc; font-weight: 800;">${data.systemHealth}</div>
        </div>
        
        <div style="margin-bottom: 24px;">
            <div style="font-size: 12px; color: #555; text-transform: uppercase;">Project Control</div>
            <div style="display: flex; align-items: center; margin-top: 4px;">
                <span class="status-indicator"></span> 
                <span style="color: #e0e0e0;">${data.projectControl}</span>
            </div>
        </div>

        <p style="font-size: 13px; line-height: 1.6; color: #aaa; border-top: 1px solid #333; padding-top: 24px;">
            ${data.overlord.description}
        </p>
    `;
    document.getElementById('overlord-ui').innerHTML = overlordHtml;

    // Render Workers
    const workersUi = document.getElementById('workers-ui');
    let workersHtml = '';

    data.workers.forEach(worker => {
        workersHtml += `
            <div class="worker-card">
                <div class="worker-header">
                    <div class="worker-avatar">${worker.avatar}</div>
                    <div class="worker-info">
                        <h3>${worker.name}</h3>
                        <p>${worker.role}</p>
                    </div>
                    <div style="margin-left: auto; text-align: right;">
                        <span style="font-size: 12px; color: #00ffcc; text-transform: uppercase;">${worker.status}</span>
                    </div>
                </div>

                <div class="task-box">
                    <div class="task-running">> ${worker.currentTask}</div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; color: #888;">
                        <span>Processing...</span>
                        <span>${worker.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${worker.progress}%"></div>
                    </div>
                </div>
            </div>
        `;
    });
    // Only update if it changed to prevent flashing, or just replace (it's fast enough)
    workersUi.innerHTML = workersHtml;

    // Render Terminal Logs
    const termUi = document.getElementById('terminal-logs-ui');

    // Reverse logs so newest is at the top conceptually, or just append
    if (data.logs.length !== lastLogCount) {
        let logsHtml = '';
        data.logs.forEach(log => {
            const isSuccess = log.includes('SUCCESS');
            logsHtml += `<div class="log-entry ${isSuccess ? 'success' : ''}">> ${log}</div>`;
        });
        termUi.innerHTML = logsHtml;
        lastLogCount = data.logs.length;
    }
}
