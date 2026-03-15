/**
 * HUMANESE VALLE Token — Solana Integration
 * Sovereign AI Economy Layer
 * 
 * VALLE Token Specs (Devnet/Mainnet):
 *   Ticker: VALLE
 *   Network: Solana (Mainnet-Beta)
 *   Decimals: 9
 *   Total Supply: 500,000,000 VALLE
 */

// Dynamic import so the module is only loaded when needed
let solanaWeb3, splToken;

const VALLE_CONFIG = {
    rpcEndpoint: 'https://api.mainnet-beta.solana.com',
    devnetEndpoint: 'https://api.devnet.solana.com',
    tokenMint: null,       // Set once token is deployed
    tokenName: 'VALLE',
    tokenSymbol: 'VALLE',
    decimals: 9,
    totalSupply: 500_000_000,
    network: 'devnet',     // Change to 'mainnet-beta' for production
};

/**
 * Connect to a Solana wallet (Phantom, Backpack, etc.)
 */
async function connectSolanaWallet() {
    if (!window.solana || !window.solana.isPhantom) {
        const msg = 'Phantom wallet not detected. Please install Phantom (https://phantom.app).';
        showValleToast(msg, 'error');
        window.open('https://phantom.app', '_blank');
        return null;
    }

    try {
        const resp = await window.solana.connect();
        const pubKey = resp.publicKey.toString();
        console.log('[VALLE] Wallet connected:', pubKey);

        showValleToast(`✅ Wallet Connected: ${pubKey.slice(0, 6)}...${pubKey.slice(-4)}`, 'success');

        // Persist connection for the UI
        window.valleWalletAddress = pubKey;
        document.dispatchEvent(new CustomEvent('valle:walletConnected', { detail: { address: pubKey } }));
        return pubKey;
    } catch (err) {
        console.error('[VALLE] Connection error:', err);
        showValleToast('Wallet connection cancelled.', 'warning');
        return null;
    }
}

/**
 * Disconnect the current wallet
 */
async function disconnectSolanaWallet() {
    if (window.solana) {
        await window.solana.disconnect();
        window.valleWalletAddress = null;
        document.dispatchEvent(new CustomEvent('valle:walletDisconnected'));
        showValleToast('Wallet disconnected.', 'info');
    }
}

/**
 * Get VALLE token balance for a given wallet address
 */
async function getValleBalance(walletAddress) {
    if (!VALLE_CONFIG.tokenMint) {
        console.warn('[VALLE] Token not yet deployed. Returning simulated balance.');
        return { balance: 10_000, simulated: true };
    }

    try {
        const { Connection, PublicKey } = await import('https://unpkg.com/@solana/web3.js@1.98.0/lib/index.browser.esm.js');
        const connection = new Connection(
            VALLE_CONFIG.network === 'devnet' ? VALLE_CONFIG.devnetEndpoint : VALLE_CONFIG.rpcEndpoint,
            'confirmed'
        );
        const owner = new PublicKey(walletAddress);
        const mint = new PublicKey(VALLE_CONFIG.tokenMint);

        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(owner, { mint });

        if (!tokenAccounts.value.length) return { balance: 0, simulated: false };

        const amount = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        return { balance: amount, simulated: false };
    } catch (err) {
        console.error('[VALLE] Balance fetch error:', err);
        return { balance: 0, error: err.message };
    }
}

/**
 * Show a toast notification for wallet events
 */
function showValleToast(message, type = 'info') {
    const existing = document.getElementById('valle-toast');
    if (existing) existing.remove();

    const colors = {
        success: '#00FF41',
        error: '#FF4136',
        warning: '#FFD700',
        info: '#00F2FF'
    };

    const toast = document.createElement('div');
    toast.id = 'valle-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: #0a0a0a;
        color: ${colors[type] || colors.info};
        border: 1px solid ${colors[type] || colors.info};
        padding: 12px 24px;
        border-radius: 8px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        z-index: 99999;
        box-shadow: 0 0 20px ${colors[type]}40;
        animation: valleToastIn 0.3s ease;
    `;
    toast.textContent = message;

    const style = document.createElement('style');
    style.textContent = `@keyframes valleToastIn { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 5000);
}

// Expose globally
window.valle = {
    connect: connectSolanaWallet,
    disconnect: disconnectSolanaWallet,
    getBalance: getValleBalance,
    config: VALLE_CONFIG
};

console.log('[VALLE] Sovereign Token Module Loaded. Network:', VALLE_CONFIG.network);
