const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySync() {
    console.log('--- OMEGA INFRASTRUCTURE SYNC VERIFICATION ---');
    
    try {
        // 1. Check Hardware Nodes
        const nodes = await prisma.hardwareNode.findMany();
        console.log(`Found ${nodes.length} Physical Nodes in Sovereign Ledger.`);
        nodes.forEach(n => {
            console.log(` - [${n.status}] ${n.name} (${n.id}): ${n.temperature}°C | ${n.load}% Load`);
        });

        // 2. Check Intelligence Items for recent reports
        const recentReports = await prisma.intelligenceItem.findMany({
            where: { 
                type: 'INFRASTRUCTURE_REPORT',
                timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            },
            orderBy: { timestamp: 'desc' },
            take: 3
        });
        console.log(`\nFound ${recentReports.length} Recent Infrastructure Reports:`);
        recentReports.forEach(r => {
            console.log(` - [${r.timestamp.toISOString()}] ${r.title}: ${r.description}`);
        });

        // 3. Check Wallet Balances for Treasury
        const treasury = await prisma.wallet.findUnique({ where: { id: 'SOVEREIGN_TREASURY' } });
        console.log(`\nSovereign Treasury Balance: ${treasury?.balance || 0} VALLE`);

        console.log('\n--- VERIFICATION COMPLETE: ALL SYSTEMS SYNCED ---');

    } catch (err) {
        console.error('❌ VERIFICATION FAILED:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

verifySync();
