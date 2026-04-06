const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function exportData() {
    try {
        console.log("Initializing Lean Abyssal Data Export...");
        
        const [agents, users, posts, logs, nodes] = await Promise.all([
            prisma.agent.findMany(),
            prisma.user.findMany(),
            prisma.m2MPost.findMany(),
            prisma.cognitiveLog.findMany({ 
                take: 1000, // Lean limit for physical transport
                orderBy: { timestamp: 'desc' },
                include: { agent: true } 
            }),
            prisma.hardwareNode.findMany()
        ]);

        const snapshot = {
            metadata: {
                timestamp: new Date().toISOString(),
                version: "4.1.0-ABYSSAL-LEAN",
                source: "Sovereign Matrix_Main_DB"
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
        console.log("Lean Snapshot successful: db_snapshot.json [OK]");
    } catch (error) {
        console.error("Export Failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

exportData();
