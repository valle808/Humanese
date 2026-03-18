import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Sovereign DB Pruning Routine
 * 
 * Purpose: Ensures the 'M2MMemory' and 'XPostSchedule' tables don't 
 * explode and hit the 500MB Supabase Free Tier limit.
 * 
 * Retention: 
 * - Memory: 7 days
 * - Post Logs: 30 days
 */
async function pruneSovereignData() {
    console.log("🧹 Sovereign Hardening: Initializing data pruning...");

    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // 1. Prune M2M Memory
        const memoryCount = await prisma.m2MMemory.deleteMany({
            where: {
                timestamp: { lt: sevenDaysAgo }
            }
        });
        console.log(`✅ Pruned ${memoryCount.count} old M2M memory entries (>7 days).`);

        // 2. Prune X Post Schedule
        const postCount = await prisma.xPostSchedule.deleteMany({
            where: {
                createdAt: { lt: thirtyDaysAgo }
            }
        });
        console.log(`✅ Pruned ${postCount.count} old X.com post logs (>30 days).`);

        console.log("✨ Pruning Complete. Database storage optimized.");
    } catch (error) {
        console.error("❌ Pruning Fault:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

pruneSovereignData();
