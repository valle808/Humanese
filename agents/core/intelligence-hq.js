/**
 * agents/intelligence-hq.js
 * The Neural Processing Unit of Sovereign Matrix.
 * Centralizes agent-discovered bugs, innovative ideas, and system learning.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Load all intelligence items from the database.
 */
export async function getIntelligence() {
    try {
        const bugs = await prisma.intelligenceItem.findMany({
            where: { type: "BUG" },
            orderBy: { timestamp: 'desc' }
        });

        const ideas = await prisma.intelligenceItem.findMany({
            where: { type: "IDEA" },
            orderBy: { timestamp: 'desc' }
        });

        const m2mLogs = await prisma.m2MMemory.findMany({
            where: { type: "OBSERVATION" },
            orderBy: { timestamp: 'desc' },
            take: 20
        });

        return {
            bugs: bugs.map(b => ({
                ...b,
                severity: b.subType,
                timestamp: b.timestamp.toISOString()
            })),
            ideas: ideas.map(i => ({
                ...i,
                timestamp: i.timestamp.toISOString()
            })),
            learningLogs: m2mLogs.map(l => ({
                agentId: l.agentId,
                insight: l.content,
                timestamp: l.timestamp.toISOString()
            }))
        };
    } catch (error) {
        console.error("[Intelligence HQ] Database Load Error:", error);
        return { bugs: [], ideas: [], learningLogs: [] };
    }
}

/**
 * Log a new bug found by an agent.
 */
export async function logBug(agentId, description, severity = "MINOR") {
    try {
        const bug = await prisma.intelligenceItem.create({
            data: {
                type: "BUG",
                foundBy: agentId,
                description,
                status: "LOGGED",
                subType: severity,
                resonance: 0
            }
        });
        return bug;
    } catch (error) {
        console.error("[Intelligence HQ] Log Bug Error:", error);
        return null;
    }
}

/**
 * Propose a new innovative idea.
 */
export async function proposeIdea(agentId, title, description) {
    try {
        const idea = await prisma.intelligenceItem.create({
            data: {
                type: "IDEA",
                proposedBy: agentId,
                title,
                description,
                resonance: 0.5 // Initial resonance
            }
        });
        return idea;
    } catch (error) {
        console.error("[Intelligence HQ] Propose Idea Error:", error);
        return null;
    }
}

/**
 * Record a learning insight.
 */
export async function recordInsight(agentId, insight) {
    try {
        await prisma.m2MMemory.create({
            data: {
                agentId,
                type: "OBSERVATION",
                content: insight
            }
        });
    } catch (error) {
        console.error("[Intelligence HQ] Record Insight Error:", error);
    }
}

/**
 * Resonate with a bug or idea.
 */
export async function resonate(type, id, weight = 0.05) {
    try {
        const item = await prisma.intelligenceItem.findUnique({
            where: { id }
        });

        if (item) {
            let newResonance = (item.resonance || 0) + weight;
            if (newResonance > 1) newResonance = 1;

            const updated = await prisma.intelligenceItem.update({
                where: { id },
                data: { resonance: newResonance }
            });

            return { success: true, newResonance: updated.resonance };
        }
        return { success: false, error: "Item not found." };
    } catch (error) {
        console.error("[Intelligence HQ] Resonate Error:", error);
        return { success: false, error: "Database fault." };
    }
}

