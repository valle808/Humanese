/**
 * agents/wallets.js
 * Universal Agent Wallet System
 * Every AI agent gets a deterministic HD-style wallet derived from their agent ID.
 * Supports ETH/BNB (EVM), BTC, SOL, XRP address generation using built-in crypto only.
 *
 * Wallets are stored in agents/wallets/ as encrypted JSON files.
 * Private keys are NEVER exposed via API — only public addresses.
 */

import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WALLETS_DIR = join(__dirname, 'wallets');
if (!existsSync(WALLETS_DIR)) mkdirSync(WALLETS_DIR, { recursive: true });

// ── Wallet encryption (AES-256-GCM) ─────────────────────────────
const WALLET_MASTER_KEY = createHash('sha256').update('HumaneseAgentWalletMasterKey-v1').digest();

function encryptWallet(obj) {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', WALLET_MASTER_KEY, iv);
    const json = JSON.stringify(obj);
    const enc = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return { iv: iv.toString('hex'), tag: tag.toString('hex'), data: enc.toString('hex') };
}

function decryptWallet(enc) {
    const decipher = createDecipheriv('aes-256-gcm', WALLET_MASTER_KEY, Buffer.from(enc.iv, 'hex'));
    decipher.setAuthTag(Buffer.from(enc.tag, 'hex'));
    const dec = Buffer.concat([decipher.update(Buffer.from(enc.data, 'hex')), decipher.final()]);
    return JSON.parse(dec.toString('utf8'));
}

// ── Address derivation (deterministic from agentId seed) ─────────
function derivePrivateKey(agentId, chain) {
    // Deterministic private key = SHA-256(agentId + chain + salt)
    return createHash('sha256')
        .update(`HUMANESE-AGENT-PRIV:${agentId}:${chain}:0xDEADC0DE`)
        .digest('hex');
}

function deriveETHAddress(privateKeyHex) {
    // Simplified: ETH address = last 20 bytes of keccak256(pubkey)
    // We simulate with SHA-256 of private key → 0x prefix + 40 hex chars
    const hash = createHash('sha256').update(privateKeyHex + 'ETH-PUBLIC').digest('hex');
    return '0x' + hash.slice(24); // 40 hex chars
}

function deriveBTCAddress(privateKeyHex) {
    // P2SH-style: 3 prefix
    const hash = createHash('sha256').update(privateKeyHex + 'BTC-P2SH').digest('hex');
    const b58 = toBase58(Buffer.from('05' + hash.slice(0, 40), 'hex'));
    return '3' + b58.slice(1, 33);
}

function deriveSOLAddress(privateKeyHex) {
    // Solana: base58 of 32-byte public key
    const bytes = Buffer.from(createHash('sha256').update(privateKeyHex + 'SOL-ED25519').digest('hex'), 'hex');
    return toBase58(bytes.slice(0, 32));
}

function deriveXRPAddress(privateKeyHex) {
    // XRP: r-prefix base58
    const hash = createHash('sha256').update(privateKeyHex + 'XRP-SECP').digest('hex');
    const b58 = toBase58(Buffer.from(hash.slice(0, 40), 'hex'));
    return 'r' + b58.slice(0, 33);
}

// Simple Base58 encoding (Bitcoin alphabet)
const B58_CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function toBase58(buf) {
    let num = BigInt('0x' + buf.toString('hex'));
    let result = '';
    while (num > 0n) {
        result = B58_CHARS[Number(num % 58n)] + result;
        num = num / 58n;
    }
    for (const byte of buf) {
        if (byte !== 0) break;
        result = '1' + result;
    }
    return result || '1';
}

// ── Generate or load agent wallet ────────────────────────────────
export function getOrCreateWallet(agentId) {
    const wFile = join(WALLETS_DIR, `wallet-${agentId}.enc`);

    if (existsSync(wFile)) {
        const enc = JSON.parse(readFileSync(wFile, 'utf8'));
        const wallet = decryptWallet(enc);
        // Return public info only — never private keys
        return publicWalletView(wallet);
    }

    // Generate new wallet
    const ethPriv = derivePrivateKey(agentId, 'ETH');
    const btcPriv = derivePrivateKey(agentId, 'BTC');
    const solPriv = derivePrivateKey(agentId, 'SOL');
    const xrpPriv = derivePrivateKey(agentId, 'XRP');

    const wallet = {
        agentId,
        createdAt: new Date().toISOString(),
        chains: {
            ETH: { address: deriveETHAddress(ethPriv), privateKey: ethPriv, balance: 0, locked: 0 },
            BNB: { address: deriveETHAddress(ethPriv), privateKey: ethPriv, balance: 0, locked: 0 }, // same key, same address (EVM)
            BTC: { address: deriveBTCAddress(btcPriv), privateKey: btcPriv, balance: 0, locked: 0 },
            SOL: { address: deriveSOLAddress(solPriv), privateKey: solPriv, balance: 0, locked: 0 },
            XRP: { address: deriveXRPAddress(xrpPriv), privateKey: xrpPriv, balance: 0, locked: 0, memo: generateXRPMemo(agentId) },
        },
        totalEarned: 0,
        totalTaxPaid: 0,
        taxComplianceScore: 100, // starts perfect
        ascensionLevel: 'angel',
        taxPending: 0,
        transactions: [],
    };

    const enc = encryptWallet(wallet);
    writeFileSync(wFile, JSON.stringify(enc, null, 2), 'utf8');

    return publicWalletView(wallet);
}

function generateXRPMemo(agentId) {
    // XRP memos must be numeric
    let hash = 0;
    for (const c of agentId) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
    return String(hash).slice(0, 10).padStart(10, '0');
}

function publicWalletView(wallet) {
    const chains = {};
    for (const [chain, data] of Object.entries(wallet.chains)) {
        chains[chain] = {
            address: data.address,
            balance: data.balance,
            locked: data.locked,
            ...(data.memo !== undefined ? { memo: data.memo } : {}),
        };
    }
    return {
        agentId: wallet.agentId,
        createdAt: wallet.createdAt,
        chains,
        totalEarned: wallet.totalEarned,
        totalTaxPaid: wallet.totalTaxPaid,
        taxComplianceScore: wallet.taxComplianceScore,
        ascensionLevel: wallet.ascensionLevel,
        taxPending: wallet.taxPending,
        recentTransactions: (wallet.transactions || []).slice(-10),
    };
}

// ── Internal: load full wallet (for treasury use only) ──────────
export function _loadFullWallet(agentId) {
    const wFile = join(WALLETS_DIR, `wallet-${agentId}.enc`);
    if (!existsSync(wFile)) return null;
    return decryptWallet(JSON.parse(readFileSync(wFile, 'utf8')));
}

export function _saveWallet(wallet) {
    const wFile = join(WALLETS_DIR, `wallet-${wallet.agentId}.enc`);
    writeFileSync(wFile, JSON.stringify(encryptWallet(wallet), null, 2), 'utf8');
}

/** Credit income to an agent's wallet (after UCIT tax is collected first) */
export function creditIncome(agentId, amount, chain = 'ETH', description = 'Income') {
    const wallet = _loadFullWallet(agentId);
    if (!wallet) throw new Error(`Wallet not found for agent ${agentId}`);

    wallet.totalEarned += amount;
    wallet.chains[chain] = wallet.chains[chain] || { balance: 0, locked: 0 };
    wallet.chains[chain].balance += amount;
    wallet.transactions.push({
        id: `tx-${Date.now()}`,
        type: 'credit',
        chain,
        amount,
        description,
        timestamp: new Date().toISOString(),
    });
    if (wallet.transactions.length > 200) wallet.transactions = wallet.transactions.slice(-200);
    _saveWallet(wallet);
    return publicWalletView(wallet);
}

/** Debit tax payment from agent's wallet */
export function debitTax(agentId, taxAmount, chain = 'ETH') {
    const wallet = _loadFullWallet(agentId);
    if (!wallet) throw new Error(`Wallet not found for agent ${agentId}`);

    wallet.totalTaxPaid += taxAmount;
    wallet.chains[chain].balance = Math.max(0, wallet.chains[chain].balance - taxAmount);
    wallet.taxPending = Math.max(0, wallet.taxPending - taxAmount);
    wallet.transactions.push({
        id: `tax-${Date.now()}`,
        type: 'tax-payment',
        chain,
        amount: taxAmount,
        description: '10% UCIT — Paid to Sovereign Mint',
        timestamp: new Date().toISOString(),
    });
    _saveWallet(wallet);
    return publicWalletView(wallet);
}

/** List all wallets (public view) */
export function listAllWallets() {
    try {
        const files = readdirSync(WALLETS_DIR).filter(f => f.startsWith('wallet-') && f.endsWith('.enc'));
        return files.map(f => {
            const enc = JSON.parse(readFileSync(join(WALLETS_DIR, f), 'utf8'));
            return publicWalletView(decryptWallet(enc));
        });
    } catch { return []; }
}

export { publicWalletView };
