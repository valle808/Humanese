import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import fs from 'fs';

const ethProvider = new ethers.JsonRpcProvider('https://rpc.ankr.com/eth');
const solConnection = new Connection('https://api.mainnet-beta.solana.com');

async function massAudit() {
    console.log("--- 🚀 MASS AGENT WALLET AUDIT ---");
    const wallets = JSON.parse(fs.readFileSync('./agents/data/decrypted_wallets_summary.json', 'utf8'));
    const results = [];

    for (const agent of wallets) {
        console.log(`Scanning ${agent.agentId}...`);
        const agentStatus = { agentId: agent.agentId, assets: [] };
        
        try {
            // ETH Check
            const ethAddr = agent.chains.ETH.address;
            let ethEther = 0;
            try {
                const ethBal = await ethProvider.getBalance(ethAddr);
                ethEther = parseFloat(ethers.formatEther(ethBal));
            } catch (ethErr) {
                console.warn(`  [ETH Error] ${ethErr.message}`);
            }
            if (ethEther > 0) agentStatus.assets.push({ chain: 'ETH', address: ethAddr, balance: ethEther });

            // SOL Check
            const solAddr = agent.chains.SOL.address;
            let solEther = 0;
            try {
                const solBal = await solConnection.getBalance(new PublicKey(solAddr));
                solEther = solBal / 1e9;
            } catch (solErr) {
                console.warn(`  [SOL Error] ${solErr.message}`);
            }
            if (solEther > 0) agentStatus.assets.push({ chain: 'SOL', address: solAddr, balance: solEther });

            if (agentStatus.assets.length > 0) {
                console.log(`  [!] FOUND ASSETS:`, agentStatus.assets);
                results.push(agentStatus);
            }
        } catch (e) {
            console.error(`  [Fatal Error] ${e.message}`);
        }
        
        // Delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 2000));
    }

    fs.writeFileSync('./agents/data/mass_audit_results.json', JSON.stringify(results, null, 2));
    console.log("\n--- Audit Complete. Results saved to agents/data/mass_audit_results.json ---");
}

massAudit();
