import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import dotenv from "dotenv";

dotenv.config();

const API_KEY_NAME = process.env.CDP_API_KEY_NAME;
const API_KEY_PRIVATE_KEY = process.env.CDP_API_PRIVATE_KEY?.replace(/\\n/g, "\n");

async function run() {
    if (!API_KEY_NAME || !API_KEY_PRIVATE_KEY) {
        console.error("Missing CDP API credentials in .env");
        return;
    }

    console.log("--- AUDITING COINBASE CDP ASSETS ---");
    Coinbase.configure({ apiKeyName: API_KEY_NAME, privateKey: API_KEY_PRIVATE_KEY });

    try {
        console.log("Listing wallets...");
        const wallets = await Wallet.listWallets();
        console.log(`Found ${wallets.length} developer-custodied wallets.`);

        for (const wallet of wallets) {
            const balances = await wallet.listBalances();
            console.log(`Wallet [${wallet.getId()}]:`, balances);
        }
    } catch (e) {
        console.error("CDP Audit Error:", e.message);
    }
}

run().catch(console.error);
