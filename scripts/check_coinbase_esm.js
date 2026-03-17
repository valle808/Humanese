import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const API_KEY_NAME = process.env.CDP_API_KEY_NAME;
const API_KEY_PRIVATE_KEY = process.env.CDP_API_PRIVATE_KEY?.replace(/\\n/g, "\n");

async function run() {
    console.log("--- 🏢 FINAL COINBASE CDP RE-AUDIT ---");
    try {
        if (!API_KEY_NAME || !API_KEY_PRIVATE_KEY) {
            throw new Error("Missing CDP API credentials in .env");
        }

        Coinbase.configure({ apiKeyName: API_KEY_NAME, privateKey: API_KEY_PRIVATE_KEY });

        console.log(`[CDP] Authenticated with: ${API_KEY_NAME}`);
        
        const walletData = [];
        try {
            console.log("[CDP] Fetching wallet list...");
            const walletList = await Wallet.listWallets();
            
            // Re-audit: iterate through the async generator
            for await (const w of walletList) {
                console.log(`[CDP] Found wallet: ${w.getId()}`);
                const balances = await w.listBalances();
                walletData.push({ 
                    id: w.getId(), 
                    networkId: w.getNetworkId(),
                    balances: JSON.parse(JSON.stringify(balances)) 
                });
            }
        } catch (innerError) {
            console.warn("[CDP] Error listing wallets (might be 0 wallets):", innerError.message);
        }

        fs.writeFileSync('./agents/data/coinbase_audit_final.json', JSON.stringify({ 
            timestamp: new Date().toISOString(),
            wallets: walletData 
        }, null, 2));
        
        console.log(`✅ Audit complete. ${walletData.length} wallets identified.`);
        console.log("Report saved to agents/data/coinbase_audit_final.json");

    } catch (e) {
        console.error("❌ CDP Fatal Error:", e);
    }
}

run();
