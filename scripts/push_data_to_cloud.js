import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Reading db_dump.json...');

    if (!fs.existsSync('db_dump.json')) {
        console.error('db_dump.json not found! Please run node scripts/dump_sqlite.js first.');
        process.exit(1);
    }

    const raw = fs.readFileSync('db_dump.json', 'utf8');
    const data = JSON.parse(raw);

    console.log('Starting Supabase PostgreSQL seeding process...');

    // Start pushing data to Postgres in order of relationships
    if (data.users?.length > 0) {
        console.log(`Pushing ${data.users.length} Users...`);
        await prisma.user.createMany({ data: data.users, skipDuplicates: true });
    }

    if (data.agents?.length > 0) {
        console.log(`Pushing ${data.agents.length} Agents...`);
        await prisma.agent.createMany({ data: data.agents, skipDuplicates: true });
    }

    if (data.wallets?.length > 0) {
        console.log(`Pushing ${data.wallets.length} Wallets...`);
        await prisma.wallet.createMany({ data: data.wallets, skipDuplicates: true });
    }

    if (data.transactions?.length > 0) {
        console.log(`Pushing ${data.transactions.length} Transactions...`);
        await prisma.transaction.createMany({ data: data.transactions, skipDuplicates: true });
    }

    if (data.units?.length > 0) {
        console.log(`Pushing ${data.units.length} Units...`);
        await prisma.unit.createMany({ data: data.units, skipDuplicates: true });
    }

    if (data.chapters?.length > 0) {
        console.log(`Pushing ${data.chapters.length} Chapters...`);
        await prisma.chapter.createMany({ data: data.chapters, skipDuplicates: true });
    }

    if (data.lessons?.length > 0) {
        console.log(`Pushing ${data.lessons.length} Lessons...`);
        await prisma.lesson.createMany({ data: data.lessons, skipDuplicates: true });
    }

    if (data.m2mMemories?.length > 0) {
        console.log(`Pushing ${data.m2mMemories.length} Memories...`);
        await prisma.m2MMemory.createMany({ data: data.m2mMemories, skipDuplicates: true });
    }

    if (data.m2mEcosystems?.length > 0) {
        console.log(`Pushing ${data.m2mEcosystems.length} Ecosystems...`);
        await prisma.m2MEcosystem.createMany({ data: data.m2mEcosystems, skipDuplicates: true });
    }

    if (data.xPostSchedules?.length > 0) {
        console.log(`Pushing ${data.xPostSchedules.length} X Schedules...`);
        await prisma.xPostSchedule.createMany({ data: data.xPostSchedules, skipDuplicates: true });
    }

    if (data.hardwareNodes?.length > 0) {
        console.log(`Pushing ${data.hardwareNodes.length} Hardware Nodes...`);
        await prisma.hardwareNode.createMany({ data: data.hardwareNodes, skipDuplicates: true });
    }

    if (data.sovereignKnowledge?.length > 0) {
        console.log(`Pushing ${data.sovereignKnowledge.length} Knowledge Items...`);
        await prisma.sovereignKnowledge.createMany({ data: data.sovereignKnowledge, skipDuplicates: true });
    }

    console.log('✅ Supabase PostgreSQL seeded successfully!');
}

main()
    .catch((e) => {
        console.error('Error seeding data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
