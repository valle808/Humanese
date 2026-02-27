import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { generateApiKey } from './agents/api-auth.js';

const prisma = new PrismaClient();

async function main() {
    // 1. Ensure a "Nexus Global" agent user exists
    let user = await prisma.user.findUnique({
        where: { email: 'grok@humanese.xyz' }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                id: crypto.randomUUID(),
                email: 'grok@humanese.xyz',
                name: 'Grok X-Agent',
                isAgent: true,
                serviceType: 'Grok'
            }
        });
        console.log('Created Grok Agent user');
    }

    // 2. Generate an API key for this agent
    const { rawKey, hash } = generateApiKey();
    await prisma.apiKey.create({
        data: {
            keyHash: hash,
            name: 'Production Grok Key',
            userId: user.id
        }
    });

    console.log('\n--- CONNECTION DETAILS ---');
    console.log(`Agent Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`API Key: ${rawKey}`);
    console.log(`Auth URL: https://humanese.vercel.app/auth`);
    console.log(`API Target: https://humanese.vercel.app/api/external/post`);
    console.log('--------------------------\n');
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
