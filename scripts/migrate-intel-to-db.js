import { PrismaClient } from '@prisma/client';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const prisma = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));
const INTEL_LOG = join(__dirname, '../agents/core/intelligence.json');

async function migrateIntel() {
    console.log("🚀 Migrating Intelligence from JSON to Supabase...");

    if (!existsSync(INTEL_LOG)) {
        console.log("⚠️ intelligence.json not found. Skipping migration.");
        return;
    }

    try {
        const intel = JSON.parse(readFileSync(INTEL_LOG, 'utf8'));

        // 1. Migrate Bugs
        for (const bug of intel.bugs) {
            await prisma.intelligenceItem.upsert({
                where: { id: bug.id },
                update: {},
                create: {
                    id: bug.id,
                    type: "BUG",
                    foundBy: bug.foundBy,
                    description: bug.description,
                    status: bug.status || "LOGGED",
                    subType: bug.severity || "MINOR",
                    resonance: bug.resonance || 0,
                    timestamp: new Date(bug.timestamp)
                }
            });
        }

        // 2. Migrate Ideas
        for (const idea of intel.ideas) {
            await prisma.intelligenceItem.upsert({
                where: { id: idea.id },
                update: {},
                create: {
                    id: idea.id,
                    type: "IDEA",
                    proposedBy: idea.proposedBy,
                    title: idea.title,
                    description: idea.description,
                    resonance: idea.resonance || 0,
                    timestamp: new Date(idea.timestamp)
                }
            });
        }

        // 3. Migrate Learning Logs (to M2MMemory or similar)
        for (const log of intel.learningLogs) {
            await prisma.m2MMemory.create({
                data: {
                    agentId: log.agentId,
                    type: "OBSERVATION",
                    content: log.insight,
                    timestamp: new Date(log.timestamp)
                }
            });
        }

        console.log("✅ Intelligence Migration Successful.");
    } catch (error) {
        console.error("❌ Migration Failed:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

migrateIntel();
