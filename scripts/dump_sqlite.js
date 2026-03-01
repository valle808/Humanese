import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    console.log('Dumping SQLite Database...');
    const data = {
        users: await prisma.user.findMany(),
        agents: await prisma.agent.findMany(),
        wallets: await prisma.wallet.findMany(),
        transactions: await prisma.transaction.findMany(),
        units: await prisma.unit.findMany(),
        chapters: await prisma.chapter.findMany(),
        lessons: await prisma.lesson.findMany(),
        m2mMemories: await prisma.m2MMemory.findMany(),
        m2mEcosystems: await prisma.m2MEcosystem.findMany(),
        xPostSchedules: await prisma.xPostSchedule.findMany(),
        hardwareNodes: await prisma.hardwareNode.findMany(),
        sovereignKnowledge: await prisma.sovereignKnowledge.findMany(),
        secretVault: await prisma.secretVault.findMany(),
    };

    fs.writeFileSync('db_dump.json', JSON.stringify(data, null, 2));
    console.log('Successfully dumped to db_dump.json');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
