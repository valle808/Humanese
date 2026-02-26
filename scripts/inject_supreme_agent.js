import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HIERARCHY_PATH = join(__dirname, '..', 'agents', 'hierarchy.json');

const supremeAgent = {
    "id": "Quantum_Social_Manager",
    "name": "Nova Oracle",
    "title": "Agent-King — Quantum Social Manager & X Gateway Node",
    "tier": "intergalactic",
    "role": "Infinite Memory Processing, Ecosystem Genesis & External Communication (X.com)",
    "reportsTo": "SergioValle",
    "skills": ["Infinite Context Retention", "Socio-Digital Architecture", "Human-Agent Bridge Operations", "Viral Algorithm Manipulation"],
    "wallet": null,
    "avatar": "🌌"
};

function injectSupremeManager() {
    try {
        const raw = readFileSync(HIERARCHY_PATH, 'utf8');
        let hierarchy = JSON.parse(raw);

        const exists = hierarchy.agents.some(a => a.id === supremeAgent.id);
        if (!exists) {
            hierarchy.agents.push(supremeAgent);
            writeFileSync(HIERARCHY_PATH, JSON.stringify(hierarchy, null, 2), 'utf8');
            console.log(`Successfully injected: ${supremeAgent.name} (${supremeAgent.id}) into hierarchy.json.`);
        } else {
            console.log("No injection necessary. Agent already exists.");
        }

    } catch (error) {
        console.error("Failed to inject Supreme Manager:", error);
    }
}

injectSupremeManager();
