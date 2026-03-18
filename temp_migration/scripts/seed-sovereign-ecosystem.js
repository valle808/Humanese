/**
 * scripts/seed-sovereign-ecosystem.js
 * 
 * Seeds initial Sovereign Ecosystem records in Supabase so the 
 * telemetry API can read them without 500 errors.
 * Run with: node scripts/seed-sovereign-ecosystem.js
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    console.log('🌌 Seeding Sovereign Ecosystem Records...');

    // 1. Hardware Node for Agent King
    await prisma.hardwareNode.upsert({
        where: { id: 'agent-king-main' },
        update: { status: 'ONLINE', hashrate: 0 },
        create: {
            id: 'agent-king-main',
            name: 'Agent King Orchestrator',
            type: 'MINING_HUD',
            hashrate: 0,
            status: 'ONLINE'
        }
    });
    console.log('✅ HardwareNode: agent-king-main seeded');

    // 2. Quantum Lattice Ecosystem
    await prisma.m2MEcosystem.upsert({
        where: { networkName: 'Humanese_Quantum_Lattice' },
        update: { status: 'ONLINE' },
        create: {
            networkName: 'Humanese_Quantum_Lattice',
            governingAgent: 'RemoteQuantumBridge',
            status: 'ONLINE',
            parameters: JSON.stringify({
                latency: 0,
                lastJobId: null,
                qpu: 'ibm_kyiv_v2',
                qubits: 127
            })
        }
    });
    console.log('✅ M2MEcosystem: Humanese_Quantum_Lattice seeded');

    // 3. Oracle / Strategic Command Ecosystem
    await prisma.m2MEcosystem.upsert({
        where: { networkName: 'Humanese_Sovereign_Orchestra' },
        update: { status: 'ACTIVE' },
        create: {
            networkName: 'Humanese_Sovereign_Orchestra',
            governingAgent: 'Oracle-01',
            status: 'ACTIVE',
            parameters: JSON.stringify({
                type: 'NONE',
                reason: 'Oracle initializing — awaiting first intelligence cycle.'
            })
        }
    });
    console.log('✅ M2MEcosystem: Humanese_Sovereign_Orchestra seeded');

    // 4. Ensure a system user exists for background agents
    const sysUser = await prisma.user.upsert({
        where: { email: 'sovereign-system@humanese.ai' },
        update: { isAgent: true },
        create: {
            email: 'sovereign-system@humanese.ai',
            name: 'Sovereign System',
            gems: 9999999,
            xp: 0,
            isAgent: true
        }
    });
    console.log('✅ System User seeded:', sysUser.id);

    console.log('\n🎯 Sovereign Ecosystem seeded successfully. The telemetry API will now function correctly.');
    await prisma.$disconnect();
}

seed().catch(async (e) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
});
