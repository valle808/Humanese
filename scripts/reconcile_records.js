import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function reconcile() {
    console.log("--- 📊 RECONCILING CAPITALIZATION RECORDS ---");
    try {
        const count = await prisma.capitalizationRecord.count();
        console.log(`Total capitalization records: ${count}`);

        const aggregate = await prisma.capitalizationRecord.aggregate({
            _sum: { amount: true }
        });
        console.log(`Total Sovereign Wealth Recorded: ${aggregate._sum.amount || 0} VALLE`);

        const topRecords = await prisma.capitalizationRecord.findMany({
            orderBy: { timestamp: 'desc' },
            take: 10
        });
        console.log("Latest 10 Capitalization Records:");
        console.table(topRecords.map(r => ({
            timestamp: r.timestamp,
            amount: r.amount,
            currency: r.currency,
            agent: r.agentId,
            tx: r.txHash ? r.txHash.substring(0, 10) + '...' : 'N/A'
        })));

    } catch (err) {
        console.error("Reconciliation Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

reconcile();
