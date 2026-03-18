import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const count = await prisma.user.count();
        console.log(`Total users in database: ${count}`);

        if (count > 0) {
            const users = await prisma.user.findMany({ take: 5 });
            console.log('Sample users:', JSON.stringify(users, null, 2));
        }
    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
