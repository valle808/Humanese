
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runAudit() {
    console.log('--- SOVEREIGN AUDIT START ---');
    try {
        const count = await prisma.sovereignKnowledge.count();
        console.log('KNOWLEDGE_COUNT:', count);

        const agents = await prisma.agent.findMany({
            select: {
                name: true,
                status: true,
                experience: true,
                lastPulse: true
            }
        });

        console.log('AGENT_STATUS_LOG:');
        agents.forEach(a => {
            console.log(`- ${a.name} [${a.status}] | XP: ${a.experience} | Last Pulse: ${a.lastPulse?.toISOString()}`);
        });

        console.log('--- SOVEREIGN AUDIT END ---');
    } catch (e) {
        console.error('AUDIT_ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

runAudit();
