import { PrismaClient } from '../src/generated/client/client';
import { stripeService } from '../src/services/stripeService';

// Mock Stripe Service manually
(stripeService as any).createTransfer = async () => ({ id: 'tr_mock_123456' });

// @ts-ignore
const prisma = new PrismaClient({});

async function simulateAgentPayment() {
    console.log('--- Simulating Agent Payment ---');

    console.log('1. Setting up test data (User, Kin, Agent, Task)...');
    // Create User (The Kin)
    const kinUser = await prisma.user.create({
        data: {
            email: `kin_test_${Date.now()}@example.com`,
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
            email: `dev_test_${Date.now()}@example.com`,
            role: 'DEVELOPER'
        }
    });

    // Create Agent
    const agentApiKey = `ak_test_${Date.now()}`;
    const agent = await prisma.agentProfile.create({
        data: {
            userId: devUser.id,
            agentName: 'Test Agent 007',
            API_Key: agentApiKey
        }
    });

    // Create Task
    const task = await prisma.kinTask.create({
        data: {
            title: 'Test Task for Payment',
            description: 'This is a test task.',
            budget: 50.00,
            status: 'IN_REVIEW',
            agentId: agent.id,
            kinId: kinUser.kinProfile!.id
        }
    });

    console.log(`Task Created: ${task.id}, Status: ${task.status}`);

    // Call the controller logic directly (integration test style) 
    // or simulate HTTP request if app was running.
    // For simplicity, we'll verify via a fetch call to the running server, 
    // OR we can just unit test the function. 
    // Let's assume the server is running on port 3000 for this script context 
    // or we can invoke the controller function directly if we mock req/res.

    // For this "script", let's just use fetch assuming typical local setup, 
    // but if server isn't running, this will fail. 
    // BETTER: Use supertest or just log instructions.

    console.log(`\nTo verify, authorize payment with:\n`);
    console.log(`POST /api/transactions/authorize`);
    console.log(`Body: { "taskId": "${task.id}", "agentApiKey": "${agentApiKey}" }`);

    console.log('\n--- End Setup ---');

    // Cleanup logic could go here...
}

simulateAgentPayment()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
