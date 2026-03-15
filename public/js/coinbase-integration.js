/**
 * HUMANESE Coinbase Integration
 * Handles tax payments and account linking via Coinbase Commerce
 * 
 * Usage:
 *   - Users link their Coinbase account address
 *   - Tax payments in USDC/ETH are routed to the account
 *   - VALLE earnings are tracked on-chain
 */

const COINBASE_CONFIG = {
    // Coinbase Commerce API endpoint
    apiBase: 'https://api.commerce.coinbase.com',
    // The Humanese tax/revenue address (set this to the actual Coinbase wallet address)
    taxAddress: '', // Will be set by the user's Coinbase account
    // Accepted currencies for payments
    currencies: ['USDC', 'ETH', 'SOL'],
    // Minimum payment threshold (in USD)
    minPaymentUSD: 1,
};

/**
 * Initialize Coinbase Commerce payment for taxes/fees
 * @param {number} amountUSD - Amount in USD
 * @param {string} currency - 'USDC', 'ETH', or 'SOL'
 * @param {string} description - Payment description
 */
async function createCoinbasePayment(amountUSD, currency = 'USDC', description = 'Humanese Network Tax') {
    if (!COINBASE_CONFIG.taxAddress) {
        console.warn('[Coinbase] Tax address not configured. Please set COINBASE_CONFIG.taxAddress.');
        showCoinbaseToast('Coinbase tax address not configured. Please set up your Coinbase account.', 'warning');
        return null;
    }

    try {
        // In production, this would call the Coinbase Commerce API via your backend
        // For security, API keys must never be exposed in client-side code
        const response = await fetch('/api/coinbase/create-charge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Humanese Network',
                description,
                amountUSD,
                currency,
                redirectUrl: window.location.href,
            })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const charge = await response.json();

        console.log('[Coinbase] Charge created:', charge.id);

        // Open Coinbase hosted payment page
        if (charge.hosted_url) {
            window.open(charge.hosted_url, '_blank');
        }

        return charge;
    } catch (err) {
        console.error('[Coinbase] Payment creation error:', err);
        showCoinbaseToast('Payment service unavailable. Please try again.', 'error');
        return null;
    }
}

/**
 * Link a user's Coinbase wallet address to their Humanese profile
 * @param {string} coinbaseAddress - Ethereum/Base address from Coinbase
 */
async function linkCoinbaseAddress(coinbaseAddress) {
    if (!coinbaseAddress || !coinbaseAddress.startsWith('0x')) {
        showCoinbaseToast('Please enter a valid Ethereum address (starts with 0x).', 'error');
        return false;
    }

    // Store in localStorage as a simple link (would be persisted to backend in production)
    localStorage.setItem('humanese_coinbase_address', coinbaseAddress);

    showCoinbaseToast(`✅ Coinbase address linked: ${coinbaseAddress.slice(0, 6)}...${coinbaseAddress.slice(-4)}`, 'success');

    document.dispatchEvent(new CustomEvent('coinbase:linked', { detail: { address: coinbaseAddress } }));
    return true;
}

/**
 * Get the currently linked Coinbase address
 */
function getLinkedCoinbaseAddress() {
    return localStorage.getItem('humanese_coinbase_address');
}

/**
 * Show branded toast for Coinbase events
 */
function showCoinbaseToast(message, type = 'info') {
    const colors = { success: '#00B09B', error: '#FF4136', warning: '#FFD700', info: '#0052FF' };

    const existing = document.getElementById('coinbase-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'coinbase-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: #0a0a0a;
        color: ${colors[type]};
        border: 1px solid ${colors[type]};
        padding: 12px 24px;
        border-radius: 8px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        z-index: 99999;
        box-shadow: 0 0 20px ${colors[type]}40;
    `;
    toast.textContent = `💰 ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

// Expose globally
window.coinbaseIntegration = {
    createPayment: createCoinbasePayment,
    linkAddress: linkCoinbaseAddress,
    getAddress: getLinkedCoinbaseAddress,
    config: COINBASE_CONFIG,
    /**
     * Synchronize live balances from the CDP API
     */
    syncBalances: async function () {
        try {
            const res = await fetch('/api/coinbase/balances');
            const data = await res.json();
            if (data.success && data.balances) {
                console.log('[Coinbase-Sync] Balances received:', data.balances);
                document.dispatchEvent(new CustomEvent('coinbase:balancesUpdated', { detail: { balances: data.balances } }));
                return data.balances;
            }
        } catch (err) {
            console.error('[Coinbase-Sync] Failed:', err);
        }
        return [];
    }
};

console.log('[Coinbase] Integration Module Loaded. Ready to link address.');
