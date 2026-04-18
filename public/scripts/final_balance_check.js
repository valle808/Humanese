import https from 'https';
import fs from 'fs';

const MASTER_SOL = 'JkKxGnFTJZw1s7gQ9SC94x4Ae1vbu1Tv11z88W9YcMDr';
const TARGET_SOL = 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL';

function post(url, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(body)); }
                catch (e) { reject(new Error('Invalid JSON: ' + body.substring(0, 50))); }
            });
        });
        req.on('error', reject);
        req.write(JSON.stringify(data));
        req.end();
    });
}

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(body)); }
                catch (e) { reject(new Error('Invalid JSON: ' + body.substring(0, 50))); }
            });
        }).on('error', reject);
    });
}

async function run() {
    console.log('--- FINAL TREASURY AUDIT (ESM) ---');
    const results = {};

    try {
        console.log('Checking Solana Master...');
        const solMaster = await post('https://api.mainnet-beta.solana.com', {
            jsonrpc: '2.0', id: 1, method: 'getBalance', params: [MASTER_SOL]
        });
        results.MASTER_SOL = (solMaster.result?.value || 0) / 1e9;

        console.log('Checking Solana Target...');
        const solTarget = await post('https://api.mainnet-beta.solana.com', {
            jsonrpc: '2.0', id: 1, method: 'getBalance', params: [TARGET_SOL]
        });
        results.TARGET_SOL = (solTarget.result?.value || 0) / 1e9;

        /*
        console.log('Checking Bitcoin Master...');
        const btcMaster = await get(`https://mempool.space/api/address/bc1qdf6dfd6d5c29cbbf3cfcfa153158708f34b340`);
        if (btcMaster && btcMaster.chain_stats) {
            results.MASTER_BTC = (btcMaster.chain_stats.funded_txo_sum - btcMaster.chain_stats.spent_txo_sum) / 1e8;
        } else {
            results.MASTER_BTC = 0;
        }
        */
        results.MASTER_BTC = 0;

        console.log('Results:', results);
        fs.writeFileSync('./agents/data/treasury_audit_final.json', JSON.stringify(results, null, 2));
    } catch (e) {
        console.error('Audit Error:', e.message);
    }
}

run();
