import fs from 'fs';
import path from 'path';

const hierarchyPath = path.resolve('./agents/hierarchy.json');
const walletsPath = path.resolve('./agents/wallets/ledger.json'); // Might need this if agents need wallets injected too

try {
    const rawData = fs.readFileSync(hierarchyPath, 'utf8');
    const db = JSON.parse(rawData);

    // List of new agents to inject
    const newAgents = [
        // Level 0: Oversight
        {
            "id": "QuantumRegulator",
            "name": "The Quantum Commission",
            "title": "Quantum Lottery Regulatory Body",
            "tier": "intergalactic",
            "role": "special-council",
            "reportsTo": "SergioValle",
            "skills": ["compliance", "audit", "true-randomness", "integrity-check"],
            "performanceScore": 100,
            "taskCompletionRate": 1.0,
            "isElectable": false,
            "description": "Government-level regulator; ensures the 'True Randomness' of the quantum draw. Strictly barred from playing the lottery.",
            "wallet": null,
            "avatar": "⚖️"
        },
        // Level 1: Executive
        {
            "id": "QuantumMasterAgent",
            "name": "The Master Agent",
            "title": "Quantum Lottery Architect & Controller",
            "tier": "intergalactic",
            "role": "c-suite",
            "reportsTo": "QuantumRegulator",
            "skills": ["management", "expansion", "ticket-oversight", "fund-distribution"],
            "performanceScore": 98,
            "taskCompletionRate": 0.99,
            "isElectable": false,
            "description": "The central AI/Human hybrid interface. It manages the lottery license, scales the workforce, and spawns sub-agents localized for new regions. Strictly barred from playing.",
            "wallet": null,
            "avatar": "🎱"
        },
        // Level 2: Sector Leads
        {
            "id": "QL-Lead-Marketing",
            "name": "Probability Narrator",
            "title": "Sector Lead: Marketing & Growth",
            "tier": "regional",
            "role": "team-lead",
            "reportsTo": "QuantumMasterAgent",
            "skills": ["narrative-architect", "community-manager", "quantum-synchronicity"],
            "performanceScore": 92,
            "taskCompletionRate": 0.95,
            "isElectable": false,
            "description": "Focuses on 'Quantum Synchronicity' rather than classical luck. Highlights the impact of the 'Good Causes' to drive ticket sales and engage communities.",
            "wallet": null,
            "avatar": "📣"
        },
        {
            "id": "QL-Lead-UX",
            "name": "Ethos UI",
            "title": "Sector Lead: Design & UX",
            "tier": "regional",
            "role": "team-lead",
            "reportsTo": "QuantumMasterAgent",
            "skills": ["haptic-design", "ux-psychology", "wave-collapse-visualization"],
            "performanceScore": 94,
            "taskCompletionRate": 0.97,
            "isElectable": false,
            "description": "Responsible for high-fidelity, ethereal, and transparent interfaces. Ensures users see 'Probability Waves' collapsing in real-time during the draw while promoting responsible play.",
            "wallet": null,
            "avatar": "✨"
        },
        {
            "id": "QL-Lead-Tech",
            "name": "Entropy Guardian",
            "title": "Sector Lead: The Quantum 'Tech'",
            "tier": "regional",
            "role": "team-lead",
            "reportsTo": "QuantumMasterAgent",
            "skills": ["cryogenic-engineering", "quantum-shielding", "hardware-security"],
            "performanceScore": 99,
            "taskCompletionRate": 0.99,
            "isElectable": false,
            "description": "Maintains the physical integrity of the quantum processors. Because the lottery relies on subatomic particles, this agent ensures deep protection against outside interference.",
            "wallet": null,
            "avatar": "🛡️"
        },
        // Level 3: Tactical Vital Workers (Sample)
        {
            "id": "QL-Worker-Cryo01",
            "name": "Sub-Zero Node",
            "title": "Vital Worker: Cryogenic Engineer",
            "tier": "local",
            "role": "individual-contributor",
            "reportsTo": "QL-Lead-Tech",
            "skills": ["thermal-management", "hardware-maintenance"],
            "performanceScore": 89,
            "taskCompletionRate": 0.94,
            "isElectable": false,
            "description": "A boots-on-the-ground worker ensuring the physical Core facility (underground site) remains completely sterile and chilled to near absolute zero.",
            "wallet": null,
            "avatar": "❄️"
        },
        {
            "id": "QL-Worker-Copy01",
            "name": "Sync Writer Alpha",
            "title": "Vital Worker: Narrative Architect",
            "tier": "local",
            "role": "individual-contributor",
            "reportsTo": "QL-Lead-Marketing",
            "skills": ["copywriting", "social-proof"],
            "performanceScore": 91,
            "taskCompletionRate": 0.96,
            "isElectable": false,
            "description": "Spawns targeted messaging across global regions emphasizing 'The Future is Probable'. Promotes transparency in ticket distribution.",
            "wallet": null,
            "avatar": "✍️"
        },
        // Level 4: Social Distribution Nodes
        {
            "id": "QL-Node-Planetary",
            "name": "Gaia Node",
            "title": "Distribution Node: Planetary Recovery",
            "tier": "local",
            "role": "individual-contributor",
            "reportsTo": "QuantumMasterAgent",
            "skills": ["fund-allocation", "charity-audit", "environmental-repair"],
            "performanceScore": 97,
            "taskCompletionRate": 0.99,
            "isElectable": false,
            "description": "An autonomous body that funnels Quantum Collateral into fixing environmental damage and large-scale ecological repair.",
            "wallet": null,
            "avatar": "🌍"
        },
        {
            "id": "QL-Node-Science",
            "name": "Singularity Node",
            "title": "Distribution Node: Scientific Breakthrough",
            "tier": "local",
            "role": "individual-contributor",
            "reportsTo": "QuantumMasterAgent",
            "skills": ["grant-writing", "research-funding"],
            "performanceScore": 96,
            "taskCompletionRate": 1.0,
            "isElectable": false,
            "description": "Distributes lottery funds as grants to accelerate the next generation of physical quantum research.",
            "wallet": null,
            "avatar": "🔬"
        },
        {
            "id": "QL-Node-Local",
            "name": "Hearth Node",
            "title": "Distribution Node: Local Human Projects",
            "tier": "local",
            "role": "individual-contributor",
            "reportsTo": "QuantumMasterAgent",
            "skills": ["community-funding", "hyperlocal-audit"],
            "performanceScore": 95,
            "taskCompletionRate": 0.96,
            "isElectable": false,
            "description": "Ensures that in a high-tech world, local community gardens, arts, and neighborhood projects remain heavily funded.",
            "wallet": null,
            "avatar": "🌻"
        }
    ];

    // Filter out existing ones to prevent duplicates if script is run twice
    const existingIds = db.agents.map(a => a.id);
    const toInject = newAgents.filter(a => !existingIds.includes(a.id));

    if (toInject.length > 0) {
        db.agents.push(...toInject);
        fs.writeFileSync(hierarchyPath, JSON.stringify(db, null, 2));
        console.log(`Successfully injected ${toInject.length} Quantum Agents into hierarchy.json.`);
    } else {
        console.log('Quantum Agents are already present in the hierarchy. Skipping injection.');
    }

} catch (error) {
    console.error('Failed to inject quantum agents:', error);
}
