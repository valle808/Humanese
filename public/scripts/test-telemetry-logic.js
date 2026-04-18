import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testTelemetry() {
    console.log('--- STARTING TELEMETRY LOGIC TEST (ESM) ---');
    try {
        console.log('1. Fetching Knowledge Count...');
        const totalArticles = await prisma.sovereignKnowledge.count();
        console.log('Count:', totalArticles);

        console.log('2. Fetching Agents...');
        const dbAgents = await prisma.agent.findMany();
        console.log('Agents Count:', dbAgents.length);

        console.log('3. Fetching Quantum Ecosystem...');
        const quantumEcosystem = await prisma.m2MEcosystem.findUnique({
            where: { networkName: 'Sovereign_Quantum_Lattice' }
        });
        console.log('Quantum Ecosystem:', quantumEcosystem ? 'Found' : 'Not Found');

        if (quantumEcosystem && quantumEcosystem.parameters) {
             try {
                 const params = JSON.parse(quantumEcosystem.parameters);
                 console.log('Quantum Params parsed successfully:', params.qpu || 'unknown');
             } catch (e) {
                 console.error('FAILED TO PARSE QUANTUM PARAMS:', e.message);
             }
        }

        console.log('4. Fetching Orchestra Ecosystem...');
        const oracleEcosystem = await prisma.m2MEcosystem.findUnique({
            where: { networkName: 'Sovereign_Sovereign_Orchestra' }
        });
        console.log('Orchestra Ecosystem:', oracleEcosystem ? 'Found' : 'Not Found');

        console.log('5. Fetching Hardware Node...');
        const kingNode = await prisma.hardwareNode.findUnique({
            where: { id: 'agent-king-main' }
        });
        console.log('King Node:', kingNode ? 'Found' : 'Not Found');

        console.log('6. Testing Agent Mapping Logic...');
        const agents = dbAgents.map(a => ({
            id: a.id,
            name: a.name,
            status: a.status,
            articlesRead: a.type === 'DIPLOMAT_COUNCIL' ? Math.floor(a.experience) : 0,
            mbRead: a.earnings.toFixed(4),
            text: a.status === 'ORCHESTRATING' ? '🤝 Harmonizing global social signals.' : '🌐 Waiting for directive...',
            progress: Math.floor(a.experience)
        }));
        console.log('Agent Mapping successful. Count:', agents.length);

        console.log('--- TEST SUCCESSFUL ---');
    } catch (error) {
        console.error('--- TEST FAILED ---');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

testTelemetry();
