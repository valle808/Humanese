import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.SOVEREIGN_DATABASE_URL,
    },
  },
});

async function run() {
    console.log('--- STARTING DEEP DATABASE AUDIT ---');
    try {
        const agentTotals = await prisma.agent.aggregate({
            _sum: { balance: true, earnings: true },
            _count: { id: true }
        });
        console.log('Agent Totals:', agentTotals);

        const topBalances = await prisma.agent.findMany({
            where: { balance: { gt: 0 } },
            orderBy: { balance: 'desc' },
            take: 20
        });
        console.log(`Found ${topBalances.length} agents with non-zero balances.`);

        const rwa = await prisma.rWARegistry.findMany();
        console.log(`Found ${rwa.length} RWA entries.`);

        const secrets = await prisma.secretVault.findMany({
            select: { id: true, updatedAt: true }
        });
        console.log(`Found ${secrets.length} keys in SecretVault.`);

        const wallets = await prisma.wallet.findMany();
        console.log(`Found ${wallets.length} wallet records.`);

        const report = {
            timestamp: new Date().toISOString(),
            agentTotals,
            topBalances,
            rwa,
            secrets,
            wallets
        };

        fs.writeFileSync('./agents/data/wealth_inventory_final.json', JSON.stringify(report, null, 2));
        console.log('Final inventory saved to agents/data/wealth_inventory_final.json');
    } catch (e) {
        console.error('Database Audit Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

run();
