import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function ignite() {
    console.log("--- BASTIDAS PROTOCOL: VAULT IGNITION ---");
    
    const dumpPath = path.resolve('db_dump.json');
    if (!fs.existsSync(dumpPath)) {
        console.error("Error: db_dump.json not found in the root directory.");
        return;
    }

    try {
        const dump = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
        const vaultEntries = dump.secretVault;

        if (!vaultEntries || !Array.isArray(vaultEntries)) {
            console.error("Error: No 'secretVault' entries found in db_dump.json");
            return;
        }

        console.log(`Found ${vaultEntries.length} encrypted secrets to import.`);

        for (const entry of vaultEntries) {
            console.log(`>> Importing secret: ${entry.id} (${entry.description || 'No description'})`);
            
            await prisma.secretVault.upsert({
                where: { id: entry.id },
                update: {
                    encryptedValue: entry.encryptedValue,
                    iv: entry.iv,
                    tag: entry.tag,
                    description: entry.description,
                    updatedAt: new Date(entry.updatedAt)
                },
                create: {
                    id: entry.id,
                    encryptedValue: entry.encryptedValue,
                    iv: entry.iv,
                    tag: entry.tag,
                    description: entry.description,
                    updatedAt: new Date(entry.updatedAt)
                }
            });
        }

        console.log("--- IGNITION SUCCESSFUL ---");
        console.log("Protocol status: IMMACULATE");
    } catch (err) {
        console.error("Ignition failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

ignite();
