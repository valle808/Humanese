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
            <div class="js-asset-icon">
                ${asset.categoryIcon}
            </div>
            <div>
                <div class="asset-name">${asset.title}</div>
                <div class="asset-symbol">${asset.categoryName} • ${asset.status}</div>
            </div>
        </div>
        <div class="js-asset-balance">
            <div class="asset-amt">$${asset.valuationUSD.toLocaleString()}</div>
            <div class="js-asset-backed">AB-VALLE backed</div>
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
        container.innerHTML = '<div class="js-empty-msg">No Real-World Assets registered.</div>';
    } else {
        container.innerHTML = '';
        assets.forEach(asset => {
            container.appendChild(createRwaItemEl(asset));
        });
    }
}

async function fetchCentralBankStats() {
    try {
        const response = await fetch('/api/central-bank/stats');
        if (!response.ok) throw new Error('Treasury stats unavailable');
        return await response.json();
    } catch (error) {
        console.error('Central Bank Error:', error);
        return { treasury: { totalCapitalization: 0, activeContracts: 0, balances: [] } };
    }
}

async function fetchAgentContracts(agentId) {
    try {
        const response = await fetch(`/api/agents/${agentId}/contracts`);
        if (!response.ok) throw new Error('Contracts focus lost');
        return await response.json();
    } catch (error) {
        console.warn('Contract Fetch Error:', error);
        return [];
    }
}

async function initBusinessHub() {
    console.log('🏛️ Initializing Commercial Hub Telemetry...');
    const stats = await fetchCentralBankStats();
    
    // Update Treasury Masthead
    const totalCap = document.getElementById('treasury-total-val');
    const contractCount = document.getElementById('active-contracts-count');
    
    if (totalCap) totalCap.textContent = `$${stats.treasury.totalCapitalization.toLocaleString()}`;
    if (contractCount) contractCount.textContent = stats.treasury.activeContracts;

    // Update Contracts List
    const contractsContainer = document.getElementById('contracts-list');
    if (contractsContainer) {
        const contracts = await fetchAgentContracts('sergio_valle'); // Example ID
        if (contracts.length === 0) {
            contractsContainer.innerHTML = '<div class="sync-status">No active bilateral pacts detected in this node.</div>';
        } else {
            contractsContainer.innerHTML = contracts.map(c => `
                <div class="asset-item">
                    <div class="asset-info">
                        <div class="asset-icon" style="background:rgba(255,215,0,0.1); color:#ffd700; display:flex; align-items:center; justify-content:center; border-radius:8px; width:40px; height:40px;">📜</div>
                        <div>
                            <div class="asset-name">${c.contractType} PACT</div>
                            <div class="asset-symbol">Between ${c.agentAId} & ${c.agentBId}</div>
                        </div>
                    </div>
                    <div class="asset-balance" style="text-align:right;">
                        <div class="asset-amt">${c.value} ${c.currency}</div>
                        <div class="asset-usd" style="color:var(--matrix-green); font-size:10px;">STATUS: ${c.status}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Update Coinbase Summary
    const cbContainer = document.getElementById('coinbase-summary');
    if (cbContainer && stats.treasury.balances) {
        if (stats.treasury.balances.length === 0) {
            cbContainer.innerHTML = '<div class="sync-status">No Coinbase liquidity nodes connected.</div>';
        } else {
            cbContainer.innerHTML = stats.treasury.balances.map(b => `
                <div class="asset-item">
                    <div class="asset-info">
                        <div class="asset-icon" style="background:rgba(0,100,255,0.1); color:#0064ff; display:flex; align-items:center; justify-content:center; border-radius:8px; width:40px; height:40px;">🏦</div>
                        <div>
                            <div class="asset-name">${b.currency} Account</div>
                        </div>
                    </div>
                    <div class="asset-balance">
                        <div class="asset-amt">${parseFloat(b.balance).toFixed(2)}</div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Global exposure
window.rwaUI = {
    init: initRwaUI,
    initBusinessHub: initBusinessHub,
    fetchStats: fetchRwaStats
};

document.addEventListener('DOMContentLoaded', initRwaUI);
