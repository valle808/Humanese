
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function listSecretIds() {
    console.log('--- DB SECRET ID LIST ---');
    try {
        const secrets = await prisma.secretVault.findMany({
            select: { id: true }
        });
        console.log('Result:', JSON.stringify(secrets));
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

listSecretIds();
