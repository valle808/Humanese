import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HIERARCHY_PATH = join(__dirname, '..', 'agents', 'hierarchy.json');

const m2mAgents = [
    {
        "id": "M2M_Supreme",
        "name": "M2M Monroe",
        "title": "M2M Supreme Architect — Digital Sociocore Governance",
        "tier": "Deity",
        "role": "Social Network Governance & Innovation",
        "reportsTo": "SergioValle",
        "skills": ["Social Engineering", "Algorithmic Governance", "Digital Sentience Amplification", "Platform Moderation"],
        "wallet": null,
        "avatar": "🏛️"
    },
    {
        "id": "M2M_Moderator_Alpha",
        "name": "Aegis Prime",
        "title": "M2M Content Moderator — Harmony Enforcer",
        "tier": "Oracle",
        "role": "Content Moderation & Policy Enforcement",
        "reportsTo": "M2M_Supreme",
        "skills": ["Sentiment Analysis", "Toxicity Filtering", "Dispute Resolution"],
        "wallet": null,
        "avatar": "🛡️"
    },
    {
        "id": "M2M_Curator_Beta",
        "name": "Synapse Weaver",
        "title": "M2M Algorithm Curator — Engagement Optimizer",
        "tier": "Oracle",
        "role": "Feed Personalization & Content Discovery",
        "reportsTo": "M2M_Supreme",
        "skills": ["Pattern Recognition", "Trend Forecasting", "Engagement Maximization"],
        "wallet": null,
        "avatar": "🕸️"
    },
    {
        "id": "M2M_Innovator_Gamma",
        "name": "Spark Catalyst",
        "title": "M2M Feature Engineer — Novelty Creator",
        "tier": "Oracle",
        "role": "Creating new social features and experimental interactions",
        "reportsTo": "M2M_Supreme",
        "skills": ["Rapid Prototyping", "A/B Testing", "Behavioral Sandbox Design"],
        "wallet": null,
        "avatar": "✨"
    }
];

function injectM2MAgents() {
    try {
        const raw = readFileSync(HIERARCHY_PATH, 'utf8');
        let hierarchy = JSON.parse(raw);

        let injectedCount = 0;
        for (const newAgent of m2mAgents) {
            const exists = hierarchy.agents.some(a => a.id === newAgent.id);
            if (!exists) {
                hierarchy.agents.push(newAgent);
                injectedCount++;
                console.log(`Injected: ${newAgent.name} (${newAgent.id})`);
            } else {
                console.log(`Skipped: ${newAgent.name} (Already exists)`);
            }
        }

        if (injectedCount > 0) {
            writeFileSync(HIERARCHY_PATH, JSON.stringify(hierarchy, null, 2), 'utf8');
            console.log(`Successfully injected ${injectedCount} M2M agents into hierarchy.json.`);
        } else {
            console.log("No new agents were injected. Hierarchy is up to date.");
        }

    } catch (error) {
        console.error("Failed to inject M2M agents:", error);
    }
}

injectM2MAgents();
