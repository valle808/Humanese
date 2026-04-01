/**
 * scripts/init_treasury.js
 * Initializes the Humanese Master Treasury and outputs addresses for BTC and SOL.
 */
import * as w from '../agents/finance/agentkit-wallet.js';

async function init() {
    const treasuryId = 'humanese_treasury_master';

    // Create wallets using the Humanese Native provider
    const btc = w.createWallet(treasuryId, 'bitcoin', 'humanese_native');
    const sol = w.createWallet(treasuryId, 'solana', 'humanese_native');

    console.log('\n================================================');
    console.log('🏛️ HUMANESE MASTER TREASURY INITIALIZED');
    console.log('================================================');
    console.log(`BTC ADDRESS: ${btc.wallet ? btc.wallet.address : 'ERROR'}`);
    console.log(`SOL ADDRESS: ${sol.wallet ? sol.wallet.address : 'ERROR'}`);
    console.log('================================================\n');
}

init().catch(console.error);
