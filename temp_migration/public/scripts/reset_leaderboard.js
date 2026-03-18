import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetLeaderboard() {
    console.log('Starting Nexus League database reset...');

    try {
        const result = await prisma.user.updateMany({
            data: {
                xp: 0
                // We keep gems and hearts as they are personal progression, 
                // but League is usually XP based.
            }
        });

        console.log(`Successfully reset XP for ${result.count} users.`);
        console.log('Nexus League has been reset.');
    } catch (error) {
        console.error('Error resetting leaderboard:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetLeaderboard();
