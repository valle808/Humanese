import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function exportData() {
    try {
        console.log("Initializing Abyssal Data Export...");
        
        const [agents, users, posts, logs, nodes] = await Promise.all([
            prisma.agent.findMany(),
            prisma.user.findMany(),
            prisma.m2MPost.findMany(),
            prisma.cognitiveLog.findMany({ include: { agent: true } }),
            prisma.hardwareNode.findMany()
        ]);

        const snapshot = {
            metadata: {
                timestamp: new Date().toISOString(),
                version: "4.1.0-ABYSSAL",
                source: "Humanese_Main_DB"
            },
            data: {
                agents,
                users,
                posts,
                logs,
                nodes
            }
        };

        fs.writeFileSync('db_snapshot.json', JSON.stringify(snapshot, null, 2));
        console.log("Snapshot successful: db_snapshot.json [OK]");
    } catch (error) {
        console.error("Export Failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

exportData();
