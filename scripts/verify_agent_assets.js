import fetch from 'node-fetch';
import fs from 'fs';

const SUMMARY_FILE = './agents/data/decrypted_wallets_summary.json';

async function checkBTC(address) {
    try {
        const res = await fetch(`https://mempool.space/api/address/${address}`);
        if (res.ok) {
            const data = await res.json();
            return (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 1e8;
        }
    } catch (e) {}
    return 0;
}

async function checkSOL(address) {
    try {
        const res = await fetch('https://api.mainnet-beta.solana.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getBalance', params: [address] })
        });
        const data = await res.json();
        return (data.result?.value || 0) / 1e9;
    } catch (e) {}
    return 0;
}

async function checkEVM(address, rpc) {
    try {
        const res = await fetch(rpc, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getBalance', params: [address, 'latest'] })
        });
        const data = await res.json();
        return parseInt(data.result, 16) / 1e18;
    } catch (e) {}
    return 0;
}

async function run() {
    const agents = JSON.parse(fs.readFileSync(SUMMARY_FILE, 'utf8'));
    console.log(`--- VERIFYING ASSETS FOR ${agents.length} AGENTS ---`);
    
    const liveResults = [];
    
    for (const agent of agents) {
        console.log(`Checking ${agent.agentId}...`);
        const live = { agentId: agent.agentId, balances: {} };
        
        if (agent.chains.ETH) live.balances.ETH = await checkEVM(agent.chains.ETH.address, 'https://eth.llamarpc.com');
        if (agent.chains.BNB) live.balances.BNB = await checkEVM(agent.chains.BNB.address, 'https://bsc-dataseed.binance.org');
        if (agent.chains.SOL) live.balances.SOL = await checkSOL(agent.chains.SOL.address);
        if (agent.chains.BTC) live.balances.BTC = await checkBTC(agent.chains.BTC.address);
        
        const hasFunds = Object.values(live.balances).some(v => v > 0);
        if (hasFunds) {
            console.log(`!!! FUNDS FOUND for ${agent.agentId}:`, live.balances);
            liveResults.push(live);
        }
    }

    fs.writeFileSync('./agents/data/live_agent_balances.json', JSON.stringify(liveResults, null, 2));
    console.log(`\nAudit complete. Found ${liveResults.length} agents with live funds.`);
}

run().catch(console.error);
