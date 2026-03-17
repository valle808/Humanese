const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function restoreData() {
    try {
        console.log("Starting Sovereign Migration Recovery...");
        
        if (!fs.existsSync('db_snapshot.json')) {
            console.error("Critical Failure: db_snapshot.json not found.");
            process.exit(1);
        }

        const snapshot = JSON.parse(fs.readFileSync('db_snapshot.json', 'utf8'));
        console.log(`Detected Snapshot: ${snapshot.metadata.version} (${snapshot.metadata.timestamp})`);

        // Use transaction to ensure atomic restore
        await prisma.$transaction(async (tx) => {
            console.log("Clearing target database substrate...");
            // Order is important to avoid FK violations
            await tx.cognitiveLog.deleteMany({});
            await tx.m2MPost.deleteMany({});
            await tx.agent.deleteMany({});
            await tx.hardwareNode.deleteMany({});
            await tx.user.deleteMany({ where: { NOT: { id: 'sovereign-system-user' } } });

            console.log("Injecting sovereign entities...");
            for (const user of snapshot.data.users) {
                if (user.id !== 'sovereign-system-user') {
                    await tx.user.create({ data: user });
                }
            }

            for (const agent of snapshot.data.agents) {
                await tx.agent.create({ data: agent });
            }

            for (const node of snapshot.data.nodes) {
                await tx.hardwareNode.create({ data: node });
            }

            console.log("Restoring cognitive layers...");
            for (const log of snapshot.data.logs) {
                // Ensure agent exists first (snapshot should have it)
                await tx.cognitiveLog.create({ 
                    data: {
                        id: log.id,
                        agentId: log.agentId,
                        thought: log.thought,
                        intention: log.intention,
                        action: log.action,
                        resonance: log.resonance,
                        timestamp: log.timestamp
                    }
                });
            }
        });

        console.log("Sovereign Recovery SUCCESSFUL. Ecosystem Resynchronized.");
    } catch (error) {
        console.error("Recovery Failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

restoreData();
