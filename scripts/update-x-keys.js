import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const AGENT_ID = "Quantum_Social_Manager";

async function storeNewXKeys() {
    const keys = {
        consumerKey: "TkZWK1CjXK2i1zf5gBeCpZY5S",
        consumerSecret: "NEo3Mg1nvi1G5PpoITuQmiJcH3XEjBPYLJSW0TPCdc9PqBswnB",
        bearerToken: "AAAAAAAAAAAAAAAAAAAAAKRK7wEAAAAAbpCH0uKmAM%2B5OwsRRzxMtgWdx84%3DLvoXJF9EJtyg2Hkmu3V3W6oJW08OQBR5ExMhydVfoGirpb0ORM"
    };

    try {
        await prisma.m2MMemory.create({
            data: {
                agentId: AGENT_ID,
                type: "SECURE_CREDENTIALS",
                content: "Updated X.com App Credentials (humanese_x)",
                metadata: JSON.stringify(keys)
            }
        });
        console.log("Successfully stored the updated X API keys securely in the Quantum Social Manager's infinite memory vault.");
    } catch (e) {
        console.error("Failed to store updated secure keys:", e);
    } finally {
        await prisma.$disconnect();
    }
}

storeNewXKeys();
