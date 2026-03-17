import fetch from 'node-fetch';

async function checkBTC(address) {
    try {
        const res = await fetch(`https://mempool.space/api/address/${address}`);
        if (res.ok) {
            const data = await res.json();
            if (data && data.chain_stats) {
                return (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 1e8;
            }
        }
    } catch (e) { console.error(`BTC check local error for ${address}:`, e.message); }
    return 0;
}

async function checkSOL(address) {
    try {
        const res = await fetch('https://api.mainnet-beta.solana.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getBalance',
                params: [address]
            })
        });
        const data = await res.json();
        return (data.result?.value || 0) / 1e9;
    } catch (e) {
        return 'Error';
    }
}

async function checkBase(address) {
    try {
        const res = await fetch('https://mainnet.base.org', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_getBalance',
                params: [address, 'latest']
            })
        });
        const data = await res.json();
        return parseInt(data.result, 16) / 1e18;
    } catch (e) {
        return 'Error';
    }
}

async function checkEthereum(address) {
    try {
        const res = await fetch('https://eth.llamarpc.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_getBalance',
                params: [address, 'latest']
            })
        });
        const data = await res.json();
        return parseInt(data.result, 16) / 1e18;
    } catch (e) {
        return 'Error';
    }
}

async function checkBNB(address) {
    try {
        const res = await fetch('https://bsc-dataseed.binance.org', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_getBalance',
                params: [address, 'latest']
            })
        });
        const data = await res.json();
        return parseInt(data.result, 16) / 1e18;
    } catch (e) {
        return 'Error';
    }
}

async function main() {
    const addresses = [
        { name: 'Sovereign Treasury SOL (Target)', addr: 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL', type: 'SOL' },
        { name: 'Treasury ETH (Mainnet)', addr: '0x500fcDff3AAa2662b954240978BB01709Ea0Dc68', type: 'ETH' },
        { name: 'Treasury BNB', addr: '0xF76581E2Dc7746B92b258098c9F3C90E691B6dc9', type: 'BNB' },
        { name: 'Treasury XRP', addr: 'rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg', type: 'XRP' }
    ];

    console.log('--- CHECKING ON-CHAIN BALANCES ---');
    for (const a of addresses) {
        let balance = 0;
        if (a.type === 'BTC') balance = await checkBTC(a.addr);
        else if (a.type === 'SOL') balance = await checkSOL(a.addr);
        else if (a.type === 'BASE') balance = await checkBase(a.addr);
        else if (a.type === 'ETH') balance = await checkEthereum(a.addr);
        else if (a.type === 'BNB') balance = await checkBNB(a.addr);
        else if (a.type === 'XRP') balance = 'Check Manually';
        console.log(`[${a.name}] ${a.addr} -> ${balance} ${a.type}`);
    }
}

main();
