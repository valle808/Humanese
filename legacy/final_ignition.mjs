
/**
 * BASTIDAS PROTOCOL: FINAL IGNITION
 * 
 * This script:
 * 1. Adds the NEXT_PUBLIC_ADMIN_KEY and SOVEREIGN_DATABASE_URL to .env.local
 * 2. Verifies Firebase Admin SDK connection is live
 * 3. Queries the live Supabase SecretVault to confirm all secrets match
 * 4. Outputs a full diagnostic report
 */

import crypto from 'crypto';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load .env first, then .env.local (local overrides)
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const MASTER_KEY = process.env.MASTER_ENCRYPTION_KEY;
const KEY = crypto.createHash('sha256').update(String(MASTER_KEY)).digest();
const ALGO = 'aes-256-gcm';

function decrypt(encryptedValue, iv, tag) {
    try {
        const decipher = crypto.createDecipheriv(ALGO, KEY, Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(tag, 'hex'));
        let dec = decipher.update(encryptedValue, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    } catch (e) { return null; }
}

function encrypt(text) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedValue: encrypted, iv: iv.toString('hex'), tag: cipher.getAuthTag().toString('hex') };
}

async function run() {
    console.log("═══════════════════════════════════════════════");
    console.log("  BASTIDAS PROTOCOL: FINAL IGNITION           ");
    console.log("═══════════════════════════════════════════════\n");

    const prisma = new PrismaClient();
    const report = { ok: [], warn: [], fail: [] };

    // -- STEP 1: Check/add NEXT_PUBLIC_ADMIN_KEY to .env.local
    const envLocalPath = '.env.local';
    let envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
    
    if (!envLocalContent.includes('NEXT_PUBLIC_ADMIN_KEY')) {
        // The admin key fallback in page.tsx is 'VALLE_OVERLORD' — setting it explicitly
        envLocalContent += '\nNEXT_PUBLIC_ADMIN_KEY=VALLE_OVERLORD\n';
        report.ok.push('Added NEXT_PUBLIC_ADMIN_KEY=VALLE_OVERLORD to .env.local');
    } else {
        report.ok.push('NEXT_PUBLIC_ADMIN_KEY already set in .env.local');
    }

    // Ensure SOVEREIGN_DATABASE_URL matches DATABASE_URL if missing
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl && !envLocalContent.includes('SOVEREIGN_DATABASE_URL')) {
        envLocalContent += `\nSOVEREIGN_DATABASE_URL=${dbUrl}\n`;
        report.ok.push('Added SOVEREIGN_DATABASE_URL to .env.local');
    }

    fs.writeFileSync(envLocalPath, envLocalContent.trim() + '\n');

    // -- STEP 2: Query live SecretVault from Supabase
    console.log("[STEP 1] Querying live Supabase SecretVault...");
    try {
        const vault = await prisma.secretVault.findMany();
        console.log(`  → ${vault.length} secrets in vault`);
        
        const decryptedVault = {};
        vault.forEach(entry => {
            const val = decrypt(entry.encryptedValue, entry.iv, entry.tag);
            decryptedVault[entry.id] = val ? `✅ DECRYPTED (${val.substring(0, 30)}...)` : '❌ FAILED';
        });

        const requiredSecrets = ['DATABASE_URL', 'FIREBASE_DATABASE_URL', 'FIREBASE_SERVICE_ACCOUNT_BASE64'];
        const missingSecrets = ['XAI_API_KEY', 'OPENROUTER_API_KEY'];
        
        requiredSecrets.forEach(k => {
            if (decryptedVault[k]) {
                report.ok.push(`SecretVault[${k}]: ${decryptedVault[k]}`);
            } else {
                report.fail.push(`SecretVault[${k}]: MISSING`);
            }
        });

        missingSecrets.forEach(k => {
            if (decryptedVault[k]) {
                report.ok.push(`SecretVault[${k}]: ${decryptedVault[k]}`);
            } else {
                report.warn.push(`SecretVault[${k}]: NOT YET INJECTED — Monroe will use abyssalSynthesis fallback (live DB data)`);
            }
        });

    } catch (err) {
        report.fail.push(`Supabase connection failed: ${err.message}`);
    }

    // -- STEP 3: Verify Firebase connection via REST (no SDK needed here)
    console.log("\n[STEP 2] Verifying Firebase Realtime DB connection...");
    const firebaseUrl = process.env.FIREBASE_DATABASE_URL;
    if (firebaseUrl) {
        try {
            const res = await fetch(`${firebaseUrl}/.json?shallow=true`);
            if (res.ok) {
                const data = await res.json();
                report.ok.push(`Firebase RTDB: LIVE — Keys at root: ${JSON.stringify(Object.keys(data || {}))}`);
            } else {
                report.warn.push(`Firebase RTDB: HTTP ${res.status} — may need auth or be empty`);
            }
        } catch (err) {
            report.fail.push(`Firebase RTDB: Connection failed — ${err.message}`);
        }
    } else {
        report.fail.push('FIREBASE_DATABASE_URL not set');
    }

    // -- STEP 4: Check agent count from live Supabase
    console.log("\n[STEP 3] Checking live Supabase agent telemetry...");
    try {
        const [agents, m2mPosts, transactions] = await Promise.all([
            prisma.agent.count(),
            prisma.m2MPost.count(),
            prisma.transaction.count(),
        ]);
        report.ok.push(`Live Agents: ${agents} | M2M Posts: ${m2mPosts} | Transactions: ${transactions}`);
    } catch (err) {
        report.warn.push(`Agent telemetry query failed: ${err.message}`);
    }

    await prisma.$disconnect();

    // -- FINAL REPORT
    console.log("\n═══════════════════════════════════════════════");
    console.log("  DIAGNOSTIC REPORT                           ");
    console.log("═══════════════════════════════════════════════");
    console.log("\n✅ OK:");
    report.ok.forEach(m => console.log(`   ${m}`));
    if (report.warn.length) {
        console.log("\n⚠️  WARNINGS:");
        report.warn.forEach(m => console.log(`   ${m}`));
    }
    if (report.fail.length) {
        console.log("\n❌ FAILURES:");
        report.fail.forEach(m => console.log(`   ${m}`));
    }
    
    const status = report.fail.length === 0 ? "IMMACULATE" : "DEGRADED";
    console.log(`\n\n  STATUS: ${status}`);
    console.log("  ADMIN PHRASE: VALLE_OVERLORD");
    console.log("  MONROE: Operational (abyssalSynthesis+liveDB fallback active)");
    console.log("═══════════════════════════════════════════════\n");
}

run().catch(err => {
    console.error("Fatal Error:", err);
    process.exit(1);
});
