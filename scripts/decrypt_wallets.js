import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const WALLETS_DIR = './agents/wallets';
const MASTER_KEY_STR = 'Sovereign MatrixAgentWalletMasterKey-v1';
const MASTER_KEY = crypto.createHash('sha256').update(MASTER_KEY_STR).digest();

function decryptWallet(enc) {
    try {
        const decipher = crypto.createDecipheriv('aes-256-gcm', MASTER_KEY, Buffer.from(enc.iv, 'hex'));
        decipher.setAuthTag(Buffer.from(enc.tag, 'hex'));
        const dec = Buffer.concat([decipher.update(Buffer.from(enc.data, 'hex')), decipher.final()]);
        return JSON.parse(dec.toString('utf8'));
    } catch (e) {
        return null;
    }
}

async function run() {
    console.log('--- RECOVERING AGENT WALLETS ---');
    const files = fs.readdirSync(WALLETS_DIR).filter(f => f.endsWith('.enc'));
    const results = [];

    for (const file of files) {
        const content = JSON.parse(fs.readFileSync(path.join(WALLETS_DIR, file), 'utf8'));
        const wallet = decryptWallet(content);
        if (wallet) {
            console.log(`Decrypted: ${file}`);
            results.push({
                agentId: wallet.agentId,
                chains: wallet.chains
            });
        } else {
            console.log(`FAILED: ${file}`);
        }
    }

    fs.writeFileSync('./agents/data/decrypted_wallets_summary.json', JSON.stringify(results, null, 2));
    console.log(`\nExtracted ${results.length} wallets to agents/data/decrypted_wallets_summary.json`);
}

run().catch(console.error);
