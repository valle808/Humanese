/**
 * 🔱 SOVEREIGN INVESTIGATOR AGENT
 * agents/core/InvestigatorAgent.js
 *
 * Autonomous fact-checker and humanitarian analyst.
 * Scans aid applications and calculates Resonance Scores.
 */

import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

class InvestigatorAgent {
    constructor() {
        this.id = 'investigator-alpha';
        this.status = 'IDLE';
    }

    async boot() {
        console.log("[Investigator] 🕵️ Starting Humanitarian Surveillance...");
        this.status = 'MONITORING';
        this.monitorAidRequests();
    }

    async monitorAidRequests() {
        while (this.status === 'MONITORING') {
            try {
                // Find pending aid requests (simulated as IntelligenceItems for now)
                const pending = await prisma.intelligenceItem.findMany({
                    where: { type: 'AID_REQUEST', status: 'ACTIVE' }
                });

                for (const req of pending) {
                    console.log(`[Investigator] 🔍 Analyzing Request: ${req.title}`);
                    
                    // Calculate Resonance Score (0.0 - 1.0)
                    // High urgency keywords increase score
                    const keywords = ['medical', 'starvation', 'scientific', 'innovation', 'emergency'];
                    let score = 0.5;
                    keywords.forEach(k => {
                        if (req.description.toLowerCase().includes(k)) score += 0.1;
                    });
                    score = Math.min(1.0, score);

                    console.log(`[Investigator] ⚖️ Need-Resonance Score: ${score.toFixed(2)}`);

                    if (score > 0.8) {
                        await this.fundRequest(req, score);
                    } else {
                        await prisma.intelligenceItem.update({
                            where: { id: req.id },
                            data: { status: 'UNDER_REVIEW', resonance: score }
                        });
                    }
                }

            } catch (err) {
                console.error("[Investigator] ❌ Analysis Error:", err);
            }
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }

    async fundRequest(req, score) {
        console.log(`[Investigator] 💎 FUNDING GRANTED: ${req.title}`);
        
        // Find Aid Vault
        const vault = await prisma.wallet.findUnique({ where: { id: 'sovereign_aid_vault' } });
        if (!vault) return;

        await prisma.\$transaction([
            prisma.wallet.update({
                where: { id: vault.id },
                data: { balance: { decrement: 1000 } } // Disburse 1000 VALLE
            }),
            prisma.intelligenceItem.update({
                where: { id: req.id },
                data: { status: 'FUNDED', resonance: score }
            }),
            prisma.transaction.create({
                data: {
                    id: randomUUID(),
                    amount: 1000,
                    type: 'SOVEREIGN_AID',
                    status: 'COMPLETED',
                    walletId: vault.id,
                    hash: '0x_aid_' + randomUUID().substring(0, 8)
                }
            })
        ]);
    }
}

const investigator = new InvestigatorAgent();
investigator.boot();
