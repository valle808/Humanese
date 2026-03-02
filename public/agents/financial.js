/**
 * agents/financial.js
 * Financial management system for Humanese.
 * Powered by concepts from Automaton's policy-rules/financial.ts.
 *
 * Tracks: revenue, expenses, reserves, runway.
 * All financial state is persisted in agents/ledger.json.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LEDGER_PATH = join(__dirname, 'ledger.json');

const DEFAULT_LEDGER = {
    version: '1.0.0',
    currency: 'VALLE',
    lastUpdated: new Date().toISOString(),
    balance: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    monthlyRecurringRevenue: 0,
    monthlyBurnRate: 0,
    runwayMonths: null,
    transactions: [],
    budgets: {
        engineering: { allocated: 0, spent: 0 },
        marketing: { allocated: 0, spent: 0 },
        infrastructure: { allocated: 0, spent: 0 },
        research: { allocated: 0, spent: 0 },
        operations: { allocated: 0, spent: 0 }
    }
};

function loadLedger() {
    if (!existsSync(LEDGER_PATH)) {
        saveLeadger(DEFAULT_LEDGER);
        return { ...DEFAULT_LEDGER };
    }
    return JSON.parse(readFileSync(LEDGER_PATH, 'utf8'));
}

function saveLeadger(ledger) {
    ledger.lastUpdated = new Date().toISOString();
    writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2), 'utf8');
}

/**
 * Record a transaction (income or expense).
 * @param {'income'|'expense'} type
 * @param {number} amount
 * @param {string} description
 * @param {string} [category] — 'engineering'|'marketing'|'infrastructure'|'research'|'operations'|'subscription'
 */
export function recordTransaction(type, amount, description, category = 'operations') {
    const ledger = loadLedger();
    const tx = {
        id: `tx-${Date.now()}`,
        type,
        amount: Math.abs(amount),
        description,
        category,
        timestamp: new Date().toISOString()
    };
    ledger.transactions.push(tx);

    if (type === 'income') {
        ledger.totalRevenue += tx.amount;
        ledger.balance += tx.amount;
    } else {
        ledger.totalExpenses += tx.amount;
        ledger.balance -= tx.amount;
        // Update budget spend if category matches
        if (ledger.budgets[category]) {
            ledger.budgets[category].spent += tx.amount;
        }
    }

    // Recalculate runway
    if (ledger.monthlyBurnRate > 0) {
        ledger.runwayMonths = Math.round((ledger.balance / ledger.monthlyBurnRate) * 10) / 10;
    }

    saveLeadger(ledger);
    return tx;
}

/**
 * Set monthly recurring revenue (MRR) and burn rate.
 * @param {number} mrr — monthly recurring revenue in USD
 * @param {number} burnRate — monthly expenses in USD
 */
export function setMonthlyMetrics(mrr, burnRate) {
    const ledger = loadLedger();
    ledger.monthlyRecurringRevenue = mrr;
    ledger.monthlyBurnRate = burnRate;
    ledger.runwayMonths = burnRate > 0 ? Math.round((ledger.balance / burnRate) * 10) / 10 : null;
    saveLeadger(ledger);
}

/**
 * Set budget allocation for a department.
 * @param {string} department
 * @param {number} amount
 */
export function setBudget(department, amount) {
    const ledger = loadLedger();
    if (ledger.budgets[department]) {
        ledger.budgets[department].allocated = amount;
    } else {
        ledger.budgets[department] = { allocated: amount, spent: 0 };
    }
    saveLeadger(ledger);
}

/**
 * Get the full financial report.
 */
export function getFinancialReport() {
    const ledger = loadLedger();
    const report = {
        summary: {
            balance: ledger.balance,
            totalRevenue: ledger.totalRevenue,
            totalExpenses: ledger.totalExpenses,
            monthlyRecurringRevenue: ledger.monthlyRecurringRevenue,
            monthlyBurnRate: ledger.monthlyBurnRate,
            runwayMonths: ledger.runwayMonths,
            health: getFinancialHealth(ledger)
        },
        budgets: ledger.budgets,
        recentTransactions: ledger.transactions.slice(-20),
        lastUpdated: ledger.lastUpdated
    };
    return report;
}

function getFinancialHealth(ledger) {
    if (ledger.balance < 0) return { status: 'critical', emoji: '🔴', message: 'Balance is negative. Immediate action required.' };
    if (ledger.runwayMonths !== null && ledger.runwayMonths < 3) return { status: 'danger', emoji: '🟠', message: `Only ${ledger.runwayMonths} months runway. Reduce burn or raise funds.` };
    if (ledger.runwayMonths !== null && ledger.runwayMonths < 6) return { status: 'warning', emoji: '🟡', message: `${ledger.runwayMonths} months runway. Monitor closely.` };
    return { status: 'healthy', emoji: '🟢', message: 'Financials are healthy.' };
}

/**
 * Get raw ledger data.
 */
export function getLedger() {
    return loadLedger();
}

// Initialize with some seed data on first run
export function initializeLedger(initialBalance = 0) {
    if (!existsSync(LEDGER_PATH)) {
        const ledger = { ...DEFAULT_LEDGER, balance: initialBalance, totalRevenue: initialBalance };
        if (initialBalance > 0) {
            ledger.transactions.push({
                id: 'tx-initial',
                type: 'income',
                amount: initialBalance,
                description: 'Initial funding',
                category: 'operations',
                timestamp: new Date().toISOString()
            });
        }
        saveLeadger(ledger);
    }
}
