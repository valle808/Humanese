import { getCoinbaseBalances } from '../agents/finance/coinbase-accounts.js';
import { Wallet, Coinbase } from '@coinbase/coinbase-sdk';

async function main() {
    console.log('--- FETCHING LIVE COINBASE ASSETS ---');
    
    // 1. Check Accounts (REST API)
    const balances = await getCoinbaseBalances();
    console.log('--- Accounts ---');
    if (balances.length === 0) {
        console.log('No accounts found.');
    } else {
        balances.forEach(b => {
            console.log(`${b.name} (${b.currency}): ${b.balance}`);
        });
    }

    // 2. Check Developer Wallets
    console.log('\n--- Developer Wallets ---');
    try {
        const wallets = await Wallet.listWallets();
        if (wallets.data.length === 0) {
            console.log('No wallets found.');
        } else {
            wallets.data.forEach(w => {
                console.log(`Wallet ID: ${w.id}, Network: ${w.networkId}`);
            });
        }
    } catch (e) {
        console.error('Failed to list wallets:', e.message);
    }
}

main();
