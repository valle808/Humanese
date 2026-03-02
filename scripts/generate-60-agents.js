import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HIERARCHY_PATH = join(__dirname, '..', 'agents', 'hierarchy.json');

const TOPICS = [
    "AI Co-Pilots", "Authentic Storytelling", "Community Platforms", "Episodic Content", "Social SEO",
    "The AI Paradox", "Creator Partnerships", "Brand Humanization", "Fragmented Identities", "Long-Form Video",
    "Social Commerce", "Micro-Influencers", "User-Generated Content", "Digital Minimalism", "Nostalgia Content",
    "AI Development Platforms", "AI Supercomputing", "Confidential Computing", "Multiagent Systems", "Physical AI",
    "Preemptive Cybersecurity", "Augmented Reality", "Quantum Computing", "Blockchain Security", "AI Enterprise Architecture",
    "Cloud 3.0", "Intelligent Operations", "Autonomous Mobility", "Sodium-ion Batteries", "Global Datacenters",
    "Hybrid Solar Cells", "Non-opioid Pain Drugs", "AI Biomarker Discovery", "Sustainable Tech", "Neurotechnology",
    "Space Commercialization", "CRISPR Editing", "Web3 Gaming", "Synthetic Biology", "Precision Fermentation",
    "Circular Economy", "Hyper-Personalized Healthcare", "Smart Agriculture", "Brain-Computer Interfaces", "Virtual Influencers",
    "Generative Audio", "Zero-Knowledge Proofs", "EdTech Gamification", "Carbon Capture", "Fusion Energy",
    "Digital Twins", "Autonomous Drones", "Bioprinting", "Quantum Cryptography", "Cyber-Physical Systems",
    "Agile Methodologies", "Remote Work Culture", "Mindfulness Apps", "Longevity Research", "Haptic Technology"
];

function generateAgents() {
    try {
        const raw = readFileSync(HIERARCHY_PATH, 'utf8');
        let hierarchy = JSON.parse(raw);

        let count = 0;
        TOPICS.forEach((topic, index) => {
            const agentId = `X_Agent_${index + 1}`;
            const exists = hierarchy.agents.some(a => a.id === agentId);

            if (!exists) {
                hierarchy.agents.push({
                    "id": agentId,
                    "name": `Node ${index + 1} (${topic})`,
                    "title": `Analyst — ${topic}`,
                    "tier": "novice",
                    "role": `Monitor and synthesize trends regarding ${topic} for the Quantum Social Manager via X.com.`,
                    "reportsTo": "Quantum_Social_Manager",
                    "skills": [topic, "Trend Analysis", "Content Generation"],
                    "wallet": null,
                    "avatar": "📡"
                });
                count++;
            }
        });

        if (count > 0) {
            writeFileSync(HIERARCHY_PATH, JSON.stringify(hierarchy, null, 2), 'utf8');
            console.log(`Successfully injected ${count} topical sub-agents into hierarchy.json.`);
        } else {
            console.log("No new agents injected. Rotational pool already full.");
        }

    } catch (error) {
        console.error("Failed to generate 60 Agents:", error);
    }
}

generateAgents();
