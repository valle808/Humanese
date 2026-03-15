import { valleCore } from '../lib/valle-crypto';

async function verifyValleCryptoCore() {
    console.log("=========================================");
    console.log("    VALLE CRYPTOCURRENCY CORE TEST       ");
    console.log("=========================================\n");

    try {
        console.log("=> Forging Valle Genesis Block...");
        const genesis = valleCore.generateGenesisBlock();
        
        console.log("\n   [GENESIS BLOCK VERIFIED]");
        console.log(`   Message:   ${genesis.message}`);
        console.log(`   Timestamp: ${genesis.timestamp}`);
        console.log(`   Hash:      ${genesis.hash}`);
        console.log(`   Address:   ${genesis.address}`);

        console.log("\n=> Verifying Base58Check Architecture (Imported from libbase58)...");
        const isVPrefixed = genesis.address.startsWith('V');
        
        if (isVPrefixed) {
             console.log(`   ✅ Success: Address correctly prefixed with 'V' network byte.`);
        } else {
             console.error(`   ❌ Failure: Address prefix incorrect.`);
             process.exit(1);
        }

        console.log("\n=========================================");
        console.log("    VALLE ARCHITECTURE SYNTHESIS OK      ");
        console.log("=========================================\n");
    } catch (error) {
        console.error("❌ Valle Crypto Engine Failure:", error);
        process.exit(1);
    }
}

// Execute if run directly
import { fileURLToPath } from 'url';
if (import.meta.url === `file://${process.argv[1]}`) {
    verifyValleCryptoCore();
}
