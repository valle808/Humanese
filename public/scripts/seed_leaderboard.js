import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
    console.log('Seeding Nexus League with fresh data...');

    const users = [
        { id: 'user-1', email: 'test1@humanese.com', name: 'Alice', xp: 0, profileImage: '../assets/svg/profile-image-temp.svg', learnLang: 'en' },
        { id: 'user-2', email: 'test2@humanese.com', name: 'Bob', xp: 0, profileImage: '../assets/svg/profile-image-temp.svg', learnLang: 'es' },
        { id: 'user-3', email: 'test3@humanese.com', name: 'Charlie', xp: 0, profileImage: '../assets/svg/profile-image-temp.svg', learnLang: 'fr' }
    ];

    try {
        for (const user of users) {
            await prisma.user.upsert({
                where: { email: user.email },
                update: { xp: 0 },
                create: user
            });
        }
        console.log('Successfully seeded 3 test users with 0 XP.');
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedUsers();
