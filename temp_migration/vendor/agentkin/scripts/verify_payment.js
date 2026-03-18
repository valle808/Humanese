const { PrismaClient } = require('../src/generated/client');
const { stripeService } = require('../src/services/stripeService');

// Mock Stripe Service manually
if (stripeService) {
    stripeService.createTransfer = async () => ({ id: 'tr_mock_123456' });
} else {
    // If undefined (e.g. strict naming), try mocking module exports if possible, but strict require usually works.
    // The service exports: export const stripeService = ...
    // In CJS interop, might need .stripeService
}

// Check if stripeService is correctly imported
// If the TS file exports `export const stripeService`, in JS require it might be under .stripeService or default.
const stripeServiceMock = require('../src/services/stripeService');
if (stripeServiceMock.stripeService) {
    stripeServiceMock.stripeService.createTransfer = async () => ({ id: 'tr_mock_123456' });
}

const prisma = new PrismaClient();

async function simulateAgentPayment() {
    console.log('--- Simulating Agent Payment (JS) ---');

    console.log('1. Setting up test data (User, Kin, Agent, Task)...');
    // Create User (The Kin)
    const kinUser = await prisma.user.create({
        data: {
            email: `kin_test_js_v2_${Date.now()}@example.com`,
            role: 'KIN',
            kinProfile: {
                create: {
                    stripeConnectAccountId: 'acct_mock_123'
                }
            }
        },
        include: { kinProfile: true }
    });

    // Create User (The Developer/Agent Owner)
    const devUser = await prisma.user.create({
        data: {
            email: `dev_test_js_v2_${Date.now()}@example.com`,
            role: 'DEVELOPER'
        }
    });

    // Create Agent
    const agentApiKey = `ak_test_js_v2_${Date.now()}`;
    const agent = await prisma.agentProfile.create({
        data: {
            userId: devUser.id,
            agentName: 'Test Agent JS V2',
            API_Key: agentApiKey
        }
    });

    // Create Task
    const task = await prisma.kinTask.create({
        data: {
            title: 'Test Task for Payment JS V2',
            description: 'This is a test task from JS script v2.',
            budget: 50.00,
            status: 'IN_REVIEW',
            agentId: agent.id,
            kinId: kinUser.kinProfile.id
        }
    });

    console.log(`Task Created: ${task.id}, Status: ${task.status}`);

    console.log('2. Executing Payment Logic (Simulating Controller)...');

    // Use the mocked service from closure or imported object
    const service = stripeServiceMock.stripeService || stripeService;

    try {
        const transfer = await service.createTransfer({
            amount: Math.round(Number(task.budget) * 100),
            currency: 'usd',
            destinationAccountId: kinUser.kinProfile.stripeConnectAccountId,
            transferGroup: task.id
        });

        console.log(`Stripe Transfer Created: ${transfer.id}`);

        const transaction = await prisma.transaction.create({
            data: {
                amount: task.budget,
                type: 'TASK_PAYMENT',
                provider: 'STRIPE',
                currency: 'USD',
                stripePaymentIntentId: transfer.id,
                status: 'PROCESSED',
                authorizedAt: new Date(),
                agentSignature: agentApiKey,
                userId: kinUser.id,
                kinTaskId: task.id
            }
        });

        console.log(`Transaction Created: ${transaction.id}`);

        await prisma.kinTask.update({
            where: { id: task.id },
            data: { status: 'COMPLETED' }
        });

        console.log('Task updated to COMPLETED.');
        console.log('--- SUCCESS ---');

    } catch (err) {
        console.error("Logic Error:", err);
        throw err;
    }
}

simulateAgentPayment()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
