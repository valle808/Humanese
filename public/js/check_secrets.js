import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const secrets = await prisma.secretVault.findMany({
        select: { id: true, updatedAt: true }
    });
    console.log('--- Secret Vault IDs ---');
    console.log(JSON.stringify(secrets, null, 2));
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
