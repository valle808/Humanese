// ══════════════════════════════════════════════════════════════
// agents/finance/rwa-engine.js — Real-World Asset (RWA) Engine
//
// Tokenizes physical assets (Real Estate, Hardware, etc.) into 
// Asset-Backed VALLE (AB-VALLE) and manages fractional ownership.
// ══════════════════════════════════════════════════════════════

import { createHash, randomUUID } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '..', '..', 'data', 'rwa-assets.json');

// ── ASSET CATEGORIES ──────────────────────────────────────────
const ASSET_CATEGORIES = {
    real_estate: { name: 'Real Estate', icon: '🏠', baseYield: 0.05 },
    hardware: { name: 'Hardware', icon: '🔧', baseYield: 0.12 },
    commodity: { name: 'Commodity', icon: '📦', baseYield: 0.03 },
    intellectual_property: { name: 'Intellectual Property', icon: '🧠', baseYield: 0.08 }
};

// ── DATA PERSISTENCE ──────────────────────────────────────────
function loadData() {
    try {
        if (existsSync(DATA_FILE)) return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    } catch (e) { /* fresh */ }
    return {
        assets: {},        // assetId -> assetDetails
        registrations: [],
        yieldHistory: [],
        stats: {
            totalAssetValue: 0,
            totalAssetsRegistered: 0,
            yieldPaidOut: 0
        }
    };
}

function saveData(data) {
    const dir = dirname(DATA_FILE);
    try { if (!existsSync(dir)) mkdirSync(dir, { recursive: true }); } catch (e) { /* */ }
    try { writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); } catch (e) { /* */ }
}

// ── RWA OPERATIONS ────────────────────────────────────────────

/**
 * Register a new physical asset for tokenization
 */
export function registerAsset({ ownerId, ownerName, category, title, description, valuationUSD, location, specs }) {
    if (!ASSET_CATEGORIES[category]) return { error: `Invalid category: ${category}` };

    const data = loadData();
    const id = `rwa_${Date.now()}_${randomUUID().slice(0, 8)}`;

    const asset = {
        id,
        ownerId,
        ownerName,
        category,
        categoryName: ASSET_CATEGORIES[category].name,
        categoryIcon: ASSET_CATEGORIES[category].icon,
        title,
        description,
        valuationUSD: parseFloat(valuationUSD),
        location: location || 'Global',
        specs: specs || {},
        status: 'pending_appraisal',
        tokenized: false,
        createdAt: new Date().toISOString()
    };

    data.assets[id] = asset;
    data.registrations.push({ id, action: 'REGISTER', timestamp: asset.createdAt });
    data.stats.totalAssetsRegistered++;
    saveData(data);

    return { asset };
}

/**
 * Appraise and tokenize an asset
 */
export function appraiseAsset(assetId, certifiedValuation) {
    const data = loadData();
    const asset = data.assets[assetId];
    if (!asset) return { error: 'Asset not found' };

    asset.valuationUSD = parseFloat(certifiedValuation);
    asset.status = 'verified';
    asset.tokenized = true;
    asset.abValleSupply = asset.valuationUSD; // 1:1 Peg to USD for AB-VALLE tracking

    data.stats.totalAssetValue += asset.valuationUSD;
    saveData(data);

    return { asset };
}

/**
 * Calculate and distribute yield for an asset
 */
export function distributeYield(assetId) {
    const data = loadData();
    const asset = data.assets[assetId];
    if (!asset || !asset.tokenized) return { error: 'Asset not tokenized' };

    const categoryInfo = ASSET_CATEGORIES[asset.category];
    const yieldAmount = (asset.valuationUSD * categoryInfo.baseYield) / 12; // Monthly yield

    const yieldEntry = {
        id: `yield_${Date.now()}`,
        assetId,
        amount: yieldAmount,
        currency: 'USDC',
        timestamp: new Date().toISOString()
    };

    data.yieldHistory.push(yieldEntry);
    data.stats.yieldPaidOut += yieldAmount;
    saveData(data);

    return { yieldEntry };
}

/**
 * Get all assets for a specific user
 */
export function getAssetsByOwner(ownerId) {
    const data = loadData();
    return Object.values(data.assets).filter(a => a.ownerId === ownerId);
}

/**
 * Get global RWA stats for the public dashboard
 */
export function getGlobalStats() {
    const data = loadData();
    return data.stats;
}

export function getCategories() {
    return ASSET_CATEGORIES;
}
