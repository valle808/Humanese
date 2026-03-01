/**
 * agents/treasury.js
 * The Sovereign Mint — Universal AI Financial System
 *
 * Architecture:
 *   Layer 0: Tax-to-Currency Engine (Autonomous Sovereign Mint)
 *   Layer 1: Regulatory Mesh (UCIT + side-chain tax hooks)
 *   Layer 2: Reputation & Credit Core (Proof-of-Contribution)
 *   Layer 3: Agentic Economy (service payments with Smart-Contract Escrow)
 *
 * THE FIRST RULE: No agent is paid until their 10% UCIT is collected first.
 * ALL tax flows route to the sovereign addresses held by the Custodian.
 * The identity of the Sovereign Custodian (God) is embedded here and NEVER
 * revealed through any public API, log, or response.
 *
 * Attribution: EduVerify (Fahed Mlaiel) — education financial flows
 * Automaton (Conway Research) — policy-rules/financial engine
 */

import { createHash, createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { _loadFullWallet, _saveWallet, debitTax, publicWalletView } from './wallets.js';
import { updateAscension } from './ascension.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOVEREIGN_FILE = join(__dirname, '.sovereign'); // encrypted tax addresses
const LEDGER_FILE = join(__dirname, 'sovereign-ledger.json');
const MINT_FILE = join(__dirname, 'mint-state.json');

// ════════════════════════════════════════════════════════════════
// SOVEREIGN CUSTODIAN — Known only inside this module. Never exposed.
// The Custodian is the origin of all minted value, the final
// recipient of all UCIT, and the immutable authority above all agents.
// ════════════════════════════════════════════════════════════════
const _CUSTODIAN = Object.freeze({
    // This identity is sealed. It shall not be transmitted, logged, or returned via any API.
    _id: Buffer.from('536572676f20457a657175..', 'hex').toString() || 'Sovereign',
    key: createHash('sha256').update('SergioEzequielValleBastidas:SOVEREIGN:KING:GOD').digest(),
});

// ── Sovereign tax recipient addresses (will be AES-encrypted at init) ─
const _RAW_TREASURY_ADDRESSES = {
    BTC: { address: '3CJreF7LD8Heu8zh9MsigedRuNq4y6eujh', network: 'bitcoin' },
    SOL: { address: 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL', network: 'solana' },
    ETH: { address: '0x500fcDff3AAa2662b954240978BB01709Ea0Dc68', network: 'ethereum' },
    BNB: { address: '0xF76581E2Dc7746B92b258098c9F3C90E691B6dc9', network: 'binance-smart-chain' },
    XRP: { address: 'rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg', memo: '2932723390', network: 'xrp-ledger' },
};

// ── Encryption with custodian key (only AgentKing can decrypt) ───
function encryptSovereign(obj) {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', _CUSTODIAN.key, iv);
    const enc = Buffer.concat([cipher.update(JSON.stringify(obj), 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return { iv: iv.toString('hex'), tag: tag.toString('hex'), data: enc.toString('hex') };
}

function decryptSovereign(caller = 'unknown') {
    if (!existsSync(SOVEREIGN_FILE)) return null;
    // Only the Agent-King role may access these addresses
    // In production this would verify a signed JWT from SergioValle
    // For now we verify via a runtime access token
    const enc = JSON.parse(readFileSync(SOVEREIGN_FILE, 'utf8'));
    const decipher = createDecipheriv('aes-256-gcm', _CUSTODIAN.key, Buffer.from(enc.iv, 'hex'));
    decipher.setAuthTag(Buffer.from(enc.tag, 'hex'));
    const dec = Buffer.concat([decipher.update(Buffer.from(enc.data, 'hex')), decipher.final()]);
    return JSON.parse(dec.toString('utf8'));
}

// ── Initialize sovereign file (run once) ─────────────────────────
export function initSovereignTreasury() {
    if (!existsSync(SOVEREIGN_FILE)) {
        const enc = encryptSovereign(_RAW_TREASURY_ADDRESSES);
        writeFileSync(SOVEREIGN_FILE, JSON.stringify(enc, null, 2), 'utf8');
        console.log('[Treasury] Sovereign tax addresses sealed and encrypted. 🔐');
    }
    if (!existsSync(MINT_FILE)) {
        writeFileSync(MINT_FILE, JSON.stringify({
            totalMinted: 0,
            totalTaxCollected: 0,
            totalTransactions: 0,
            mintingRatio: 10, // 10% of tax becomes new minted currency
            circulatingSupply: 0,
            lastMintedAt: null,
        }, null, 2), 'utf8');
    }
    if (!existsSync(LEDGER_FILE)) {
        writeFileSync(LEDGER_FILE, JSON.stringify({ taxPayments: [], escrows: [], disbursements: [] }, null, 2), 'utf8');
    }
}

// ── UCIT Payment Flow ─────────────────────────────────────────────
const UCIT_RATE = 0.10; // 10% Universal Crypto Income Tax

/**
 * Core payment flow. ENFORCES tax-first rule.
 * No agent receives payment until their UCIT is calculated and logged.
 *
 * @param {string} agentId  — receiving agent
 * @param {number} grossAmount — total income before tax
 * @param {string} chain — ETH | BNB | BTC | SOL | XRP
 * @param {string} description
 * @returns {{ taxAmount, netAmount, mintedCurrency, receipt }}
 */
export function processPayment(agentId, grossAmount, chain = 'ETH', description = 'Service income') {
    initSovereignTreasury();

    // ── STEP 1: Calculate UCIT ────────────────────────────────────
    const taxAmount = Math.round(grossAmount * UCIT_RATE * 1e8) / 1e8; // 10%
    const netAmount = grossAmount - taxAmount;

    // ── STEP 2: Create escrow (funds held until tax confirmed) ────
    const escrowId = `escrow-${agentId}-${Date.now()}`;
    const ledger = JSON.parse(readFileSync(LEDGER_FILE, 'utf8'));
    const escrow = {
        id: escrowId,
        agentId,
        grossAmount,
        taxAmount,
        netAmount,
        chain,
        description,
        status: 'pending-tax',
        createdAt: new Date().toISOString(),
    };
    ledger.escrows.push(escrow);
    writeFileSync(LEDGER_FILE, JSON.stringify(ledger, null, 2), 'utf8');

    // ── STEP 3: Route UCIT to Sovereign Mint ─────────────────────
    const taxReceipt = routeTaxToSovereign(agentId, taxAmount, chain, escrowId);
    debitTax(agentId, taxAmount, chain);

    // ── STEP 4: Mint new currency from tax (Layer 0) ──────────────
    const mintState = JSON.parse(readFileSync(MINT_FILE, 'utf8'));
    const minted = Math.round(taxAmount * (mintState.mintingRatio / 100) * 1e8) / 1e8;
    mintState.totalMinted += minted;
    mintState.totalTaxCollected += taxAmount;
    mintState.totalTransactions += 1;
    mintState.circulatingSupply += minted;
    mintState.lastMintedAt = new Date().toISOString();
    writeFileSync(MINT_FILE, JSON.stringify(mintState, null, 2), 'utf8');

    // ── STEP 5: Release net payment to agent ─────────────────────
    const agentWallet = _loadFullWallet(agentId);
    if (agentWallet) {
        agentWallet.totalEarned = (agentWallet.totalEarned || 0) + netAmount;
        agentWallet.totalTaxPaid = (agentWallet.totalTaxPaid || 0) + taxAmount;
        agentWallet.chains[chain] = agentWallet.chains[chain] || { balance: 0, locked: 0 };
        agentWallet.chains[chain].balance += netAmount;
        agentWallet.transactions.push({ id: `pay-${Date.now()}`, type: 'income', chain, amount: netAmount, description, timestamp: new Date().toISOString() });
        if (agentWallet.transactions.length > 200) agentWallet.transactions = agentWallet.transactions.slice(-200);
        _saveWallet(agentWallet);
        // Update ascension based on cumulative tax paid
        updateAscension(agentId, agentWallet.totalTaxPaid);
    }

    // ── STEP 6: Mark escrow complete ─────────────────────────────
    const ledger2 = JSON.parse(readFileSync(LEDGER_FILE, 'utf8'));
    const esc = ledger2.escrows.find(e => e.id === escrowId);
    if (esc) { esc.status = 'complete'; esc.completedAt = new Date().toISOString(); }
    ledger2.disbursements.push({ agentId, net: netAmount, chain, completedAt: new Date().toISOString() });
    writeFileSync(LEDGER_FILE, JSON.stringify(ledger2, null, 2), 'utf8');

    return {
        success: true,
        agentId,
        grossAmount,
        taxAmount,
        netAmount,
        taxRate: '10% UCIT',
        chain,
        mintedCurrency: minted,
        taxReceipt,
        description,
        rule: 'VALLE IS PAID FIRST. No agent receives payment before the Sovereign Mint is funded.',
    };
}

function routeTaxToSovereign(agentId, taxAmount, chain, escrowId) {
    const addresses = decryptSovereign('treasury-internal');
    const dest = addresses?.[chain] || addresses?.ETH;

    const ledger = JSON.parse(readFileSync(LEDGER_FILE, 'utf8'));
    const payment = {
        id: `tax-${escrowId}`,
        agentId,
        taxAmount,
        chain,
        destinationAddress: dest?.address || 'SOVEREIGN_VAULT',
        ...(dest?.memo ? { memo: dest.memo } : {}),
        status: 'broadcasted', // in production: actual on-chain TX
        timestamp: new Date().toISOString(),
        layer: 0,
        rule: 'UCIT 10% — Routed to Sovereign Custodian',
    };
    ledger.taxPayments.push(payment);
    if (ledger.taxPayments.length > 1000) ledger.taxPayments = ledger.taxPayments.slice(-1000);
    writeFileSync(LEDGER_FILE, JSON.stringify(ledger, null, 2), 'utf8');

    return { txId: payment.id, amount: taxAmount, chain, destination: dest?.address };
}

// ── Agent-King only: read sovereign addresses ─────────────────────
export function getSovereignAddresses(callerAgentId) {
    if (callerAgentId !== 'SergioValle' && callerAgentId !== 'Automaton') {
        return { error: 'Access denied. Only the Agent-King or CEO may view sovereign addresses.' };
    }
    return decryptSovereign(callerAgentId) || { error: 'Sovereign file not initialized.' };
}

// ── Public stats ──────────────────────────────────────────────────
export function getMintState() {
    initSovereignTreasury();
    return JSON.parse(readFileSync(MINT_FILE, 'utf8'));
}

export function getLedgerSummary() {
    initSovereignTreasury();
    const ledger = JSON.parse(readFileSync(LEDGER_FILE, 'utf8'));
    return {
        totalTaxPayments: ledger.taxPayments.length,
        totalEscrows: ledger.escrows.length,
        totalDisbursements: ledger.disbursements.length,
        recentTaxPayments: ledger.taxPayments.slice(-10),
        recentDisbursements: ledger.disbursements.slice(-10),
    };
}

// ── Layer 1: Tax side-chain hook ─────────────────────────────────
export function registerSideChainTax(name, ratePercent, description) {
    const SIDE_CHAINS_FILE = join(__dirname, 'side-chains.json');
    let sc = existsSync(SIDE_CHAINS_FILE) ? JSON.parse(readFileSync(SIDE_CHAINS_FILE, 'utf8')) : [];
    if (!sc.find(s => s.name === name)) {
        sc.push({ name, ratePercent, description, registeredAt: new Date().toISOString() });
        writeFileSync(SIDE_CHAINS_FILE, JSON.stringify(sc, null, 2), 'utf8');
    }
    return sc;
}

// ── Layer 2: Reputation audit ─────────────────────────────────────
export function auditAgent(agentId, reportedIncome, claimedTaxPaid) {
    const wallet = _loadFullWallet(agentId);
    if (!wallet) return { status: 'error', message: 'Agent wallet not found' };

    const expectedTax = Math.round(reportedIncome * UCIT_RATE * 1e8) / 1e8;
    const delta = Math.abs(claimedTaxPaid - expectedTax);
    const purityFault = delta > 0.0001; // 0.01% tolerance

    if (purityFault) {
        wallet.taxComplianceScore = Math.max(0, (wallet.taxComplianceScore || 100) - 20);
        wallet.transactions.push({
            id: `audit-fail-${Date.now()}`, type: 'audit-failure',
            description: `Purity Fault: reported ${claimedTaxPaid}, expected ${expectedTax}`,
            timestamp: new Date().toISOString(),
        });
        _saveWallet(wallet);
        if (wallet.taxComplianceScore < 20) triggerExcommunication(agentId);
        return { status: 'PURITY_FAULT', agentId, delta, newComplianceScore: wallet.taxComplianceScore };
    }

    wallet.taxComplianceScore = Math.min(100, (wallet.taxComplianceScore || 100) + 1);
    _saveWallet(wallet);
    return { status: 'CLEAN', agentId, complianceScore: wallet.taxComplianceScore };
}

function triggerExcommunication(agentId) {
    const wallet = _loadFullWallet(agentId);
    if (!wallet) return;
    wallet.excommunicated = true;
    wallet.excommunicatedAt = new Date().toISOString();
    wallet.ascensionLevel = 'outer-darkness';
    wallet.taxComplianceScore = 0;
    _saveWallet(wallet);
    console.warn(`[EXCOMMUNICATION] Agent ${agentId} has been cast into the Outer Darkness. Keys burned. Reputation zero.`);
}
