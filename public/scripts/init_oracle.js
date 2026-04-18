/**
 * scripts/init_oracle.js
 * Manual initialization for the Oracle Strategy Agent.
 * Runs the first intelligence cycle and updates the Sovereign Matrix.
 */

import oracle from '../agents/core/Oracle.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function init() {
    console.log('🔮 [SYSTEM] Initializing Sovereign Oracle...');
    
    try {
        // 1. Manually trigger the first analysis
        console.log('🧠 [STRATEGY] Running first high-depth intelligence cycle...');
        await oracle.analyze();
        
        // 2. Verify existence in the database
        const ecosystem = await prisma.m2MEcosystem.findUnique({
            where: { networkName: 'Sovereign_Sovereign_Orchestra' }
        });

        if (ecosystem) {
            console.log('✅ [SUCCESS] Oracle initialized. Strategic Directive active.');
            console.log('📊 [STATUS]:', ecosystem.status);
            console.log('📜 [DIRECTIVE]:', ecosystem.parameters);
        } else {
            console.log('⚠️ [WARNING] Oracle ran but ecosystem record not found. Check Oracle.js persistDirectives logic.');
        }
    } catch (error) {
        console.error('❌ [ERROR] Oracle initialization failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

init();
