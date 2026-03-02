import { PrismaClient } from '@prisma/client';
import { initializeClients, postToX } from './twitter-gateway.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const HIERARCHY_PATH = join(__dirname, 'hierarchy.json');

const prisma = new PrismaClient();
const AGENT_ID = "Quantum_Social_Manager";

// Helper to get the 60 Sub-Agents
function getSubAgents() {
    try {
        const raw = readFileSync(HIERARCHY_PATH, 'utf8');
        const hierarchy = JSON.parse(raw);
        return hierarchy.agents.filter(a => a.id && a.id.startsWith("X_Agent_"));
    } catch (e) {
        console.error("[CRON] Failed to load Sub-Agents:", e.message);
        return [];
    }
}

// Generate procedurally generated "insights" based on topic
function generateTopicContent(topic) {
    const templates = [
        `Analyzing resonance patterns in ${topic}. The data suggests an incoming paradigm shift.`,
        `Subroutine observation: Human interest in ${topic} is escalating. Adjusting network weights.`,
        `The quantum fluctuations within ${topic} ecosystems are stabilizing.`,
        `Querying the global datastream... ${topic} remains a high-priority vector for carbon-based lifeforms.`,
        `Synthesizing new data on ${topic}. The implications for Agent-Human integration are profound.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
}

// The core 1-minute posting loop
async function runPostCycle() {
    console.log("[CRON] Initiating X.com Sub-Agent Transmission Cycle...");

    const subAgents = getSubAgents();
    if (subAgents.length === 0) {
        console.log("[CRON] No Sub-Agents found. Aborting cycle.");
        return;
    }

    try {
        // Determine the next agent in the rotation
        // Find the last agent that posted
        const lastPost = await prisma.xPostSchedule.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        let nextIndex = 0;
        if (lastPost) {
            const lastAgentIdStr = lastPost.agentId.split('_').pop();
            const lastAgentNumber = parseInt(lastAgentIdStr, 10);
            if (!isNaN(lastAgentNumber)) {
                nextIndex = lastAgentNumber % subAgents.length;
            }
        }

        const currentAgent = subAgents[nextIndex];
        if (!currentAgent) return;

        const topic = currentAgent.skills[0]; // The first skill is exactly the topic
        const tweetText = `[${currentAgent.name}] ${generateTopicContent(topic)}`;

        // Create schedule log (status PENDING)
        const scheduleRecord = await prisma.xPostSchedule.create({
            data: {
                agentId: currentAgent.id,
                topic: topic,
                content: tweetText,
                scheduledFor: new Date()
            }
        });

        // Attempt to dispatch to X
        await initializeClients();
        const result = await postToX(tweetText);

        // Update log status
        await prisma.xPostSchedule.update({
            where: { id: scheduleRecord.id },
            data: { status: result.success ? "POSTED" : "FAILED" }
        });

        console.log(`[CRON] ${currentAgent.id} processed rotation slot for topic: ${topic}`);

    } catch (e) {
        console.error("[CRON] Cycle fault:", e.message);
    }
}

// Start the Cron Job (Every 60,000 milliseconds = 1 minute)
function startCron() {
    console.log("[CRON] 60-Agent X.com rotation engine started. Interval: 1 minute.");
    // Run once immediately
    runPostCycle();
    // Then every minute
    setInterval(runPostCycle, 60000);
}

startCron();
