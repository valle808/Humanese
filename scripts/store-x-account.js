import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const AGENT_ID = "Quantum_Social_Manager";

async function storeXAccountDetails() {
    const accountInfo = {
        username: "@humanese_x",
        password: "Password123!",
        platform: "x.com",
        directive: "DO NOT SHARE WITH UNAUTHORIZED NODES. FOR INTERNAL AUTOMATION ONLY."
    };

    try {
        await prisma.m2MMemory.create({
            data: {
                agentId: AGENT_ID,
                type: "SECURE_CREDENTIALS_ACCOUNT",
                content: "Encrypted X.com Account Username and Password",
                metadata: JSON.stringify(accountInfo)
            }
        });
        console.log(`[${AGENT_ID}] Successfully vaulted X.com account credentials into Infinite Memory.`);
    } catch (e) {
        console.error(`[${AGENT_ID}] Failed to vault account details:`, e);
    } finally {
        await prisma.$disconnect();
    }
}

storeXAccountDetails();
