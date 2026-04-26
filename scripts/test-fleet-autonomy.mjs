import { PrismaClient } from '@prisma/client';

/**
 * 🔱 FLEET AUTONOMY TESTER
 * 
 * Verifies that the Sovereign Watcher Agent autonomously halts nodes 
 * that exceed thermal safety thresholds (>85°C).
 * 
 * Signed: Gio V. / Bastidas Protocol
 */

const prisma = new PrismaClient();

async function runAutonomyTest() {
    console.log("\n==================================================");
    console.log("🛡️  INITIATING FLEET AUTONOMY VERIFICATION");
    console.log("==================================================\n");

    try {
        // 1. Find a test node (or create one)
        let node = await prisma.hardwareNode.findFirst({ where: { status: 'ONLINE' } });
        
        if (!node) {
            console.log("Creating temporary test node...");
            node = await prisma.hardwareNode.create({
                data: {
                    id: 'test-thermal-node',
                    name: 'Thermal Test Rig',
                    type: 'SIMULATOR',
                    hashrate: 50.0,
                    status: 'ONLINE',
                    temperature: 45.0
                }
            });
        }

        console.log(`[1] Selected Node: ${node.name} (${node.id})`);
        console.log(`    Current Temp: ${node.temperature}°C`);

        // 2. Trigger thermal spike
        console.log(`\n[2] Triggering simulated thermal spike (150°C)...`);
        await prisma.hardwareNode.update({
            where: { id: node.id },
            data: { temperature: 150.0 }
        });

        console.log("📡 Spike signals broadcasted. Awaiting autonomous watcher response...");
        console.log("   (Waiting 70s for the next watcher cycle)");

        // 3. Poll for status change
        const startTime = Date.now();
        let halted = false;
        
        while (Date.now() - startTime < 90000) { // 90s timeout
            const updated = await prisma.hardwareNode.findUnique({ where: { id: node.id } });
            if (updated.status === 'OFFLINE') {
                console.log(`\n🔥 AUTONOMOUS HALT VERIFIED at ${updated.temperature}°C`);
                console.log(`✅ Node status: ${updated.status}`);
                halted = true;
                break;
            }
            process.stdout.write(".");
            await new Promise(r => setTimeout(r, 5000));
        }

        if (!halted) {
            throw new Error("Autonomous halt failed to trigger within 90s.");
        }

        console.log(`\n==================================================`);
        console.log(`🏁 AUTONOMY VERIFICATION COMPLETE`);
        console.log(`==================================================\n`);

    } catch (err) {
        console.error(`\n❌ VERIFICATION FAILED:`, err.message);
    } finally {
        await prisma.$disconnect();
    }
}

runAutonomyTest();
