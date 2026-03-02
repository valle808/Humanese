import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkRows() {
    const models = [
        'user', 'agent', 'wallet', 'transaction', 'unit', 'chapter', 'lesson',
        'm2MMemory', 'm2MEcosystem', 'xPostSchedule', 'hardwareNode', 'sovereignKnowledge', 'secretVault'
    ];

    console.log('--- Table Row Counts ---');
    for (const model of models) {
        try {
            const count = await prisma[model].count();
            console.log(`${model}: ${count}`);
        } catch (e) {
            console.log(`${model}: Error - ${e.message}`);
        }
    }
}

checkRows().catch(console.error).finally(() => prisma.$disconnect());
