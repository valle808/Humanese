import { PrismaClient } from '@prisma/client';
import { decrypt } from '../utils/encryption.js';
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const prisma = new PrismaClient();
const ethProvider = new ethers.JsonRpcProvider('https://cloudflare-eth.com');
const solConnection = new Connection('https://api.mainnet-beta.solana.com');

async function runAudit() {
    console.log("--- 🕵️ DEEP WEALTH DISCOVERY INITIATED ---");
    const report = {
        vault: [],
        wallets: [],
        coinbase: [],
        summary: { totalEth: 0, totalSol: 0, totalValle: 0 }
    };

    try {
        // 1. Decrypt SecretVault
        console.log("🔓 Decrypting SecretVault...");
        const vaultEntries = await prisma.secretVault.findMany();
        for (const entry of vaultEntries) {
            try {
                const value = await decrypt(entry.encryptedValue, entry.iv, entry.tag);
                report.vault.push({ id: entry.id, value: value.substring(0, 4) + '...' + value.substring(value.length - 4), description: entry.description });
                // If it looks like a private key or mnemonic, mark it (don't log full value in report)
                if (value.length > 40) console.log(`[!] Found potential sensitive material in vault key: ${entry.id}`);
            } catch (e) {
                report.vault.push({ id: entry.id, error: "Decryption failed" });
            }
        }

        // 2. Audit Database Wallets
        console.log("🔍 Auditing DB Wallet entries...");
        const dbWallets = await prisma.wallet.findMany();
        for (const w of dbWallets) {
            let balance = 0;
            try {
                if (w.network === 'Ethereum') {
                    const b = await ethProvider.getBalance(w.address);
                    balance = parseFloat(ethers.formatEther(b));
                    report.summary.totalEth += balance;
                } else if (w.network === 'Solana') {
                    const b = await solConnection.getBalance(new PublicKey(w.address));
                    balance = b / 1e9;
                    report.summary.totalSol += balance;
                }
                report.wallets.push({ id: w.id, address: w.address, network: w.network, liveBalance: balance });
            } catch (e) {
                report.wallets.push({ id: w.id, address: w.address, error: "Chain query failed" });
            }
        }

        // 3. Coinbase CDP Audit
        console.log("🏢 Checking Coinbase CDP Assets...");
        if (process.env.CDP_API_KEY_NAME && process.env.CDP_API_PRIVATE_KEY) {
            try {
                Coinbase.configure({ 
                    apiKeyName: process.env.CDP_API_KEY_NAME, 
                    privateKey: process.env.CDP_API_PRIVATE_KEY.replace(/\\n/g, "\n")
                });
                
                // listWallets returns a list object, need to iterate manually or use the list's generator
                const wallets = await Wallet.listWallets();
                for await (const w of wallets) {
                    const balances = await w.listBalances();
                    report.coinbase.push({ id: w.getId(), balances: JSON.parse(JSON.stringify(balances)) });
                }
            } catch (e) {
                console.error("CDP Error:", e.message);
                report.coinbase.push({ error: e.message });
            }
        }

        fs.writeFileSync('./agents/data/deep_wealth_report.json', JSON.stringify(report, null, 2));
        console.log("✅ Deep audit completed. Report saved to agents/data/deep_wealth_report.json");

    } catch (err) {
        console.error("Audit Fatal Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

runAudit();
