/**
 * HUMANESE RWA UI Module
 * Handles display and interaction for Real-World Assets
 */

async function fetchRwaAssets(ownerId) {
    try {
        const response = await fetch(`/api/rwa/assets/${ownerId}`);
        if (!response.ok) throw new Error('Failed to fetch RWA assets');
        return await response.json();
    } catch (error) {
        console.error('RWA Fetch Error:', error);
        return [];
    }
}

async function fetchRwaStats() {
    try {
        const response = await fetch('/api/rwa/stats');
        if (!response.ok) throw new Error('Failed to fetch RWA stats');
        return await response.json();
    } catch (error) {
        console.error('RWA Stats Error:', error);
        return { totalAssetValue: 0, totalAssetsRegistered: 0, yieldPaidOut: 0 };
    }
}

function createRwaItemEl(asset) {
    const el = document.createElement('div');
    el.className = 'asset-item';
    el.innerHTML = `
        <div class="asset-info">
            <div class="asset-icon" style="background: rgba(0, 255, 204, 0.1); color: #00ffcc; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 8px; font-size: 20px;">
                ${asset.categoryIcon}
            </div>
            <div>
                <div class="asset-name">${asset.title}</div>
                <div class="asset-symbol">${asset.categoryName} • ${asset.status}</div>
            </div>
        </div>
        <div class="asset-balance" style="text-align: right;">
            <div class="asset-amt">$${asset.valuationUSD.toLocaleString()}</div>
            <div class="asset-usd" style="color: #00ffcc; font-size: 11px;">AB-VALLE backed</div>
        </div>
    `;
    return el;
}

async function initRwaUI() {
    const container = document.getElementById('rwa-asset-list');
    if (!container) return;

    // In a real app, this would be the logged-in user's ID
    const ownerId = 'sergio_valle';
    const assets = await fetchRwaAssets(ownerId);
    const stats = await fetchRwaStats();

    // Update Treasury Display in wallet if elements exist
    const treasuryVal = document.getElementById('treasury-valuation');
    if (treasuryVal) treasuryVal.textContent = `$${stats.totalAssetValue.toLocaleString()}`;

    if (assets.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; opacity: 0.5; font-size: 13px;">No Real-World Assets registered.</div>';
    } else {
        container.innerHTML = '';
        assets.forEach(asset => {
            container.appendChild(createRwaItemEl(asset));
        });
    }
}

// Global exposure
window.rwaUI = {
    init: initRwaUI,
    fetchStats: fetchRwaStats
};

document.addEventListener('DOMContentLoaded', initRwaUI);
