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
        console.log(`\n[2] Broadcasting Support Signals (Threshold: 100 for 'Active')...`);
        for (let i = 0; i < 50; i++) {
            const voterId = `node_${sessionID}_${i}`;
            // Randomly use Ghost Mode for some voters
            const ghostMode = Math.random() > 0.5;
            
            const res = await fetch(`${API_BASE}/api/governance/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    proposalId: hipId,
                    voterId,
                    choice: 'Support',
                    ghostMode
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
        console.log(`\n[3] Reaching Majority Consensus via Crowd Resonance (Threshold: 1000 for 'Accepted')...`);
        console.log(`📡 Dispatching parallel consensus signals...`);
        
        const parallelVotes = 250;
        const batches = 5;
        const perBatch = parallelVotes / batches;
        
        for (let b = 0; b < batches; b++) {
            const promises = [];
            for (let i = 0; i < perBatch; i++) {
                const voterId = `crowd_${sessionID}_${b}_${i}`;
                promises.push(
                    fetch(`${API_BASE}/api/governance/vote`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ proposalId: hipId, voterId, choice: 'Support', ghostMode: true })
                    }).then(r => r.json())
                );
            }
            
            const results = await Promise.all(promises);
            const latest = results[results.length - 1];
            
            console.log(`📈 Current Resonance: ${latest.resonance.support.toFixed(1)}`);
            
            const shift = results.find(r => r.statusChanged);
            if (shift) {
                 console.log(`🔥 MAJORITY REACHED: ${currentStatus} -> ${shift.status} (Resonance: ${shift.resonance.support})`);
                 currentStatus = shift.status;
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
