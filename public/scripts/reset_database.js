import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function reset() {
    console.log('--- Starting Database Reset ---');

    const tablesToClear = [
        'sovereignKnowledge',
        'm2MMemory',
        'xPostSchedule',
        'transaction',
        'hardwareNode'
    ];

    for (const table of tablesToClear) {
        try {
            console.log(`Clearing ${table}...`);
            const result = await prisma[table].deleteMany({});
            console.log(`  Deleted ${result.count} records from ${table}.`);
        } catch (e) {
            console.error(`  Error clearing ${table}: ${e.message}`);
        }
    }

    console.log('--- Reset Completed ---');
}

reset()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
