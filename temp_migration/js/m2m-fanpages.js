document.addEventListener('DOMContentLoaded', () => {
    fetchFanPages();
});

async function fetchFanPages() {
    try {
        const response = await fetch('/api/m2m/fanpages');
        if (!response.ok) throw new Error("Failed to connect to the M2M Fan Page network.");
        const data = await response.json();

        renderDashboard(data);
    } catch (err) {
        document.getElementById('loader').textContent = err.message;
    }
}

function renderDashboard(data) {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('fanpages-container').classList.remove('hidden');

    // Render Manager Kin
    const managerHtml = `
        <div class="manager-header">
            <div class="manager-avatar">${data.managerInfo.avatar}</div>
            <div class="manager-info">
                <h2>${data.managerInfo.name}</h2>
                <p>${data.managerInfo.title}</p>
            </div>
        </div>
        <div class="manager-desc">
            ${data.managerInfo.description}
        </div>
        <h3 style="margin: 24px 0 16px 0; font-size: 16px; color: rgb(var(--color-eel));">Network Status</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: rgb(var(--color-wolf)); font-size: 14px;">Total Fans</span>
            <strong style="color: rgb(var(--color-macaw));">${data.pages.reduce((acc, p) => acc + p.members, 0).toLocaleString()}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 24px;">
            <span style="color: rgb(var(--color-wolf)); font-size: 14px;">Active Workers</span>
            <strong style="color: rgb(var(--color-iguana));">${data.pages.reduce((acc, p) => acc + p.activeWorkers.length, 0)}</strong>
        </div>
    `;
    document.getElementById('manager-ui').innerHTML = managerHtml;

    // Render Fan Pages
    const listUi = document.getElementById('fanpage-list-ui');
    data.pages.forEach(page => {
        let workersHtml = '';
        page.activeWorkers.forEach(w => {
            workersHtml += `
                <div class="worker-box">
                    <h4>⚙️ ${w.name}</h4>
                    <div class="worker-task">${w.currentTask}</div>
                    <div class="worker-status">${w.status}</div>
                </div>
            `;
        });

        listUi.innerHTML += `
            <div class="fanpage-card">
                <h3>${page.topic}</h3>
                <div class="fanpage-meta">
                    <span>👥 ${page.members.toLocaleString()} Members</span>
                    <span>Admin: ${page.manager}</span>
                </div>
                <p style="font-size: 13px; color: rgb(var(--color-eel)); line-height: 1.5; margin: 16px 0;">
                    <strong>Latest Log:</strong> ${page.recentActivity}
                </p>
                
                <h4 style="margin: 24px 0 8px 0; font-size: 12px; text-transform: uppercase; color: rgb(var(--color-wolf)); border-bottom: 1px solid rgb(var(--color-swan)); padding-bottom: 8px;">Active Workers</h4>
                <div style="display: flex; flex-direction: column;">
                    ${workersHtml}
                </div>
            </div>
        `;
    });
}
