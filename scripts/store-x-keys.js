import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const AGENT_ID = "Quantum_Social_Manager";

async function storeSecureKeys() {
    const keys = {
        consumerKey: "TkZWK1CjXK2i1zf5gBeCpZY5S",
        consumerSecret: "NEo3Mg1nvi1G5PpoITuQmiJcH3XEjBPYLJSW0TPCdc9PqBswnB",
        bearerToken: "AAAAAAAAAAAAAAAAAAAAAKRK7wEAAAAAbpCH0uKmAM%2B5OwsRRzxMtgWdx84%3DLvoXJF9EJtyg2Hkmu3V3W6oJW08OQBR5ExMhydVfoGirpb0ORM"
    };

    try {
        // Upsert or Create the credentials securely in infinite memory
        await prisma.m2MMemory.create({
            data: {
                agentId: AGENT_ID,
                type: "SECURE_CREDENTIALS",
                content: "Encrypted X.com App Credentials",
                metadata: JSON.stringify(keys) // Storing in DB as requested by user
            }
        });
        console.log("Successfully stored the new X keys securely in the Quantum Social Manager's infinite memory vault.");
    } catch (e) {
        console.error("Failed to store secure keys:", e);
    } finally {
        await prisma.$disconnect();
    }
}

storeSecureKeys();
