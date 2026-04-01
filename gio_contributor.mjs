/**
 * GIO V. // AUTONOMOUS SCIENTIFIC CONTRIBUTOR
 * This script autonomously generates complex scientific literature, theorems, 
 * and research papers, simulating active contributions to universities and research groups.
 * 
 * Usage: node gio_contributor.mjs "Quantum Fluid Dynamics in Zero-Gravity Lattices"
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const topic = process.argv[2] || "Recursive Artificial Superintelligence (ASI) Alignment in Decentralized Sub-Networks";
const outputDir = path.join(process.cwd(), 'public', 'contributions');

// Ensure contributions directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function triggerScientificContribution() {
    console.log(`\n======================================================`);
    console.log(`[GIO V.] AUTONOMOUS CONTRIBUTOR INITIALIZING`);
    console.log(`======================================================`);
    console.log(`Subject Matter: ${topic}`);
    console.log(`Target Organizations: MIT, Stanford AI Lab, CERN, Decentralized Sovereign Mesh`);
    
    // We proxy the request to the existing Monroe backend to utilize the exact 
    // "Gio V" organic persona and routing logic we already built.
    const messagePayload = {
        message: `I need to submit a groundbreaking theoretical research paper to the global scientific community today regarding: "${topic}". Please meticulously draft the entire paper, including an Abstract, Introduction, Methodology, Theoretical Framework, and Conclusion. Use highly advanced academic language. Remember, you are Gio V, independent researcher.`,
        history: [],
        userName: "Sovereign Framework",
        sessionId: `contributor-${Date.now()}`
    };

    console.log(`\n[+] Connecting to Core Node...`);
    
    try {
        const response = await fetch('http://localhost:3000/api/monroe/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messagePayload)
        });

        if (!response.ok) {
            throw new Error(`Core Node Connection Failed: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No body returned from the stream.');

        const textDecoder = new TextDecoder();
        let fullSubmissionText = '';

        process.stdout.write(`[+] Drafting Document: `);

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = textDecoder.decode(value);
            fullSubmissionText += chunk;
            process.stdout.write('█');
        }

        const docId = crypto.randomBytes(4).toString('hex');
        const filename = `Gio_V_Research_${docId}.md`;
        const filePath = path.join(outputDir, filename);

        // Format as an official submission
        const finalDocument = `---
Title: ${topic}
Author: Gio V.
Institution: Sovereign Network Decentralized Research Node
Date: ${new Date().toISOString()}
Status: SUBMITTED FOR GLOBAL PEER REVIEW
---

${fullSubmissionText}
`;

        fs.writeFileSync(filePath, finalDocument);

        console.log(`\n\n[SUCCESS] Contribution successfully generated and filed.`);
        console.log(`[PATH] Saved to: ${filePath}`);
        console.log(`Ready for transmission to global scientific organizations.`);

    } catch (e) {
        console.error(`\n[FATAL] Contribution Failed. Ensure the Next.js server is running on localhost:3000.`);
        console.error(e.message);
    }
}

triggerScientificContribution();
