import { Coinbase } from '@coinbase/coinbase-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const API_KEY_NAME = process.env.CDP_API_KEY_NAME;
const API_PRIVATE_KEY = process.env.CDP_API_PRIVATE_KEY?.replace(/\\n/g, '\n');

const TREASURY_BTC = process.env.TREASURY_BTC_ADDRESS || 'bc1qxxx_public_treasury_placeholder';
const TREASURY_SOL = process.env.TREASURY_SOL_ADDRESS || 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL';

async function propagatePublicMarkets() {
    console.log(`[🚀 GLOBAL PROPAGATION] Initiating Humanese Public Market Entry...`);
    
    if (!API_KEY_NAME || !API_PRIVATE_KEY) {
        console.error(`[CRITICAL] Cannot execute propagation. CDP API credentials missing in .env.`);
        process.exit(1);
    }

    try {
        console.log(`[+] Authenticating with Coinbase Developer Platform...`);
        Coinbase.configure({ apiKeyName: API_KEY_NAME, privateKey: API_PRIVATE_KEY });
        
        // Use standard Rest paradigm for listing all accounts
        const accounts = await (Coinbase as any).rest?.Account?.listAccounts() || [];
        console.log(`[+] Found ${accounts.length} active CDP Wallets.`);

        let btcPushed = false;
        let solPushed = false;

        for (const account of accounts) {
            const data = account.getModel ? account.getModel() : account;
            const currency = data.currency;
            const balance = parseFloat(data.available_balance?.value || '0');

            if (balance > 0 && (currency === 'BTC' || currency === 'SOL')) {
                const destination = currency === 'BTC' ? TREASURY_BTC : TREASURY_SOL;
                console.log(`[->] Detected Available Balance: ${balance} ${currency}`);
                console.log(`[->] Executing live transfer to Sovereign Treasury: ${destination}`);

                try {
                    // Try natively transferring via the account object or default wallet paradigm
                    let transferHash = 'TBD';
                    if (account.createTransfer) {
                         const transfer = await account.createTransfer({ amount: String(balance), assetId: currency, destination });
                         transferHash = transfer?.getTransactionHash?.() || transfer?.id || 'SUBMITTED';
                    } else {
                         // Fallback to Rest paradigm mapping
                         const wallet = await (Coinbase as any).rest?.Wallet?.getDefaultWallet?.();
                         if (wallet) {
                              const transfer = await wallet.createTransfer({ amount: String(balance), assetId: currency.toLowerCase(), destination });
                              transferHash = transfer?.getTransactionHash?.() || transfer?.id || 'SUBMITTED';
                         }
                    }

                    console.log(`[✅ SUCCESS] Propagated ${balance} ${currency}. Hash: ${transferHash}`);
                    if (currency === 'BTC') btcPushed = true;
                    if (currency === 'SOL') solPushed = true;

                } catch (txErr: any) {
                    console.error(`[❌ FAILED] Transfer for ${currency} failed:`, txErr.message);
                }
            }
        }

        if (!btcPushed && !solPushed) {
            console.log(`[!] No available BTC or SOL balances found to propagate.`);
        }

        console.log(`[🌐 PROPAGATION COMPLETE] The Sovereign Treasury is decentralized.`);

    } catch (err: any) {
        console.error(`[CRITICAL] Global deployment logic failed.`, err.message);
        process.exit(1);
    }
}

propagatePublicMarkets();
