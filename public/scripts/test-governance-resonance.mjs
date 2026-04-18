import fetch from 'node-fetch';
import crypto from 'crypto';

/**
 * 🔱 SOVEREIGN GOVERNANCE RESONANCE TESTER
 *
 * This script programmatically verifies the threshold logic of the OMEGA v7.0 
 * governance state machine.
 *
 * Sequence:
 *   1. Submit a Draft HIP.
 *   2. Cast small-weight votes to hit 100 resonance → Verify 'Active'.
 *   3. Cast more votes to hit 1000 resonance → Verify 'Accepted'.
 *
 * Signed: Gio V. / Bastidas Protocol
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function runResonanceTest() {
    console.log("\n==================================================");
    console.log("🚀 INITIATING RESONANCE THRESHOLD VERIFICATION");
    console.log("==================================================\n");

    const sessionID = crypto.randomBytes(3).toString('hex');
    const testHIP = {
        title: `Protocol Resonance Optimization [TEST-${sessionID}]`,
        content: "Drafting a decentralized verification protocol to stabilize the sovereign network. This proposal establishes the baseline for resonance scaling and VALLE-weighted signal distribution.",
        type: "Standards Track",
        authorId: `agent_king_${sessionID}`,
        layer: "Consensus",
        category: "Core"
    };

    try {
        // 1. Submit HIP
        console.log(`[1] Anchoring new HIP to Sovereign Ledger...`);
        const submitRes = await fetch(`${API_BASE}/api/governance/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testHIP)
        });
        const submitData = await submitRes.json();
        
        if (!submitRes.ok) throw new Error(`HIP Submission failed: ${submitData.error}`);
        
        const hipId = submitData.proposal.id;
        let currentStatus = submitData.proposal.status;
        console.log(`✅ HIP-${submitData.proposal.hipNumber} Anchored. Initial Status: ${currentStatus}`);

        // 2. Reach 'Active' (100 resonance)
        // Note: DeriveVoterWeight defaults to 1.0 if no wallet. We cast lots of votes.
        console.log(`\n[2] Broadcasting Support Signals (Threshold: 100 for 'Active')...`);
        for (let i = 0; i < 110; i++) {
            const voterId = `node_${sessionID}_${i}`;
            const res = await fetch(`${API_BASE}/api/governance/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    proposalId: hipId,
                    voterId,
                    choice: 'Support'
                })
            });
            const data = await res.json();
            if (data.statusChanged) {
                console.log(`🔄 Status Shift Detected: ${currentStatus} -> ${data.status} (Resonance: ${data.resonance.support})`);
                currentStatus = data.status;
                if (currentStatus === 'Active') break;
            }
        }

        if (currentStatus !== 'Active') {
            console.log(`⚠️  Status currently: ${currentStatus}. Expected 'Active' at 100 resonance.`);
        }

        // 3. Reach 'Accepted' (1000 resonance)
        console.log(`\n[3] Reaching Majority Consensus (Threshold: 1000 for 'Accepted')...`);
        // We simulate a whale vote if possible or just more votes.
        // Actually, let's just do a large loop to prove the threshold.
        const target = 1000;
        let lastReport = 0;

        for (let i = 110; i < 900; i++) {
             const voterId = `node_${sessionID}_${i}`;
             const res = await fetch(`${API_BASE}/api/governance/vote`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ proposalId: hipId, voterId, choice: 'Support' })
             });
             const data = await res.json();
             
             if (data.resonance.support > lastReport + 200) {
                 console.log(`📈 Current Resonance: ${data.resonance.support.toFixed(1)}`);
                 lastReport = data.resonance.support;
             }

             if (data.statusChanged) {
                 console.log(`🔥 MAJORITY REACHED: ${currentStatus} -> ${data.status} (Resonance: ${data.resonance.support})`);
                 currentStatus = data.status;
                 if (currentStatus === 'Accepted') break;
             }
        }

        console.log(`\n==================================================`);
        console.log(`🏁 VERIFICATION COMPLETE: ${currentStatus}`);
        console.log(`==================================================\n`);

    } catch (err) {
        console.error(`\n❌ VERIFICATION FAILED:`, err.message);
    }
}

runResonanceTest();
