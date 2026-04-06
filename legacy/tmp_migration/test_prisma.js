import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing Prisma models...');
    try {
        const models = ['user', 'chatMessage', 'sovereignKnowledge', 'apiKey'];
        for (const model of models) {
            if (prisma[model]) {
                console.log(`[OK] Model '${model}' found.`);
                if (typeof prisma[model].findMany === 'function') {
                    console.log(`[OK] '${model}.findMany' is a function.`);
                } else {
                    console.error(`[ERROR] '${model}.findMany' is NOT a function!`);
                }
            } else {
                console.error(`[ERROR] Model '${model}' NOT found on prisma client.`);
            }
        }
    } catch (e) {
        const error = e;
        console.error('Prisma test failed:', error instanceof Error ? error.message : String(error));
    } finally {
        await prisma.$disconnect();
    }
}

main();
