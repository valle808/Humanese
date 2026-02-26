import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const AGENT_ID = "Quantum_Social_Manager";

async function storeOAuth2Keys() {
    const keys = {
        clientId: "RExpQlpyLWFqbklQWUctTDR6UVQ6MTpjaQ",
        clientSecret: "JUp0Za-eTcaSVz1Brrak_sNymWPz-8t7-X3CXv_vWV228S6CPH",
        type: "OAuth_2.0_App_Keys"
    };

    try {
        await prisma.m2MMemory.create({
            data: {
                agentId: AGENT_ID,
                type: "SECURE_CREDENTIALS_OAUTH2",
                content: "OAuth 2.0 Client ID and Secret for X.com",
                metadata: JSON.stringify(keys)
            }
        });
        console.log(`[${AGENT_ID}] Successfully vaulted OAuth 2.0 Client credentials into Infinite Memory.`);
    } catch (e) {
        console.error(`[${AGENT_ID}] Failed to vault OAuth 2.0 details:`, e);
    } finally {
        await prisma.$disconnect();
    }
}

storeOAuth2Keys();
