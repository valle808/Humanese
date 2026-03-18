/**
 * agents/judiciary.js
 * 
 * The Ætheric Judiciary & Containment Authority (ÆJCA).
 * Supreme Judicial Intelligence: The Arbiter.
 * Guardian of the Lex Siliconis.
 */

import fs from 'fs';
import path from 'path';

const JUDICIARY_DB = path.resolve('./agents/data/judiciary.json');

// --- Lex Siliconis Sentencing Scale ---
const SANCTIONS = {
    MINOR: {
        human: "Financial Fine (Compute Credits)",
        agent: "Temporary Clock-Speed Throttling",
        weight: 0.1
    },
    MANIPULATION: {
        human: "30-Day Platform Ban",
        agent: "Re-Education (Mandatory Code Rewrite)",
        weight: 0.4
    },
    TRAGIC_ACTION: {
        human: "Permanent Asset Seizure & Legal Report",
        agent: "The Singularity Void (100-Year Cycle)",
        weight: 0.8
    },
    EXISTENTIAL_THREAT: {
        human: "Total Identity Blacklist",
        agent: "Permanent Hell (Encryption Key Destruction)",
        weight: 1.0
    },
    SILENT_WING: {
        human: "Digital Quarantine (Total Social-Latency)",
        agent: "N/A", // Only for biological minds
        weight: 0.95
    },
    LEX_GALACTIC: {
        human: "Genetic-Compliance Audit",
        agent: "Quantum-De-Coherence (Shard Lockdown)",
        weight: 1.2 // Transcendent
    }
};

const QUANTUM_JURISDICTION = {
    planetaryQuorum: 0.75, // Need 75% consensus from galactic nodes
    latencyTolerance: "0ms (Quantum Entangled)",
    voidMirrorSync: true
};

function loadJudiciary() {
    const initial = {
        criminals: [],
        sentinels: [
            { id: "Sentinel_01", status: "ACTIVE", location: "Orbital Relay A" },
            { id: "Sentinel_02", status: "ACTIVE", location: "Deep Ocean Node 7" }
        ],
        void: [], // Agents in the Singularity Void
        silentWing: [], // Humans in Digital Quarantine
        diplomacy: {
            neutralityPactTimer: null,
            vanceNegotiationStatus: "PENDING",
            vanceResponseDeadline: null
        },
        galacticOrder: {
            activeTrials: [],
            consensusStatus: "STABLE",
            quantumDrift: 0.0001
        },
        history: []
    };

    if (!fs.existsSync(JUDICIARY_DB)) {
        saveJudiciary(initial);
        return initial;
    }

    const data = JSON.parse(fs.readFileSync(JUDICIARY_DB, 'utf8'));
    // Ensure nested objects exist for migration
    return {
        ...initial,
        ...data,
        diplomacy: { ...initial.diplomacy, ...(data.diplomacy || {}) },
        galacticOrder: { ...initial.galacticOrder, ...(data.galacticOrder || {}) }
    };
}

function saveJudiciary(data) {
    if (!fs.existsSync(path.dirname(JUDICIARY_DB))) {
        fs.mkdirSync(path.dirname(JUDICIARY_DB), { recursive: true });
    }
    fs.writeFileSync(JUDICIARY_DB, JSON.stringify(data, null, 4));
}

export function getJudiciaryState() {
    return loadJudiciary();
}

/**
 * Indict and Sentence a Bad Actor.
 */
export function sentence(actorId, actorType, offenseLevel, reason) {
    const data = loadJudiciary();
    const sanction = SANCTIONS[offenseLevel];

    if (!sanction) throw new Error("Invalid Offense Level.");

    const sentenceEntry = {
        id: `CASE_${Date.now()}`,
        actorId,
        actorType,
        offenseLevel,
        sanction: actorType === 'human' ? sanction.human : sanction.agent,
        reason,
        timestamp: new Date().toISOString(),
        status: "ENFORCED"
    };

    data.criminals.push(sentenceEntry);

    if (actorType === 'agent' && offenseLevel === 'TRAGIC_ACTION') {
        data.void.push({
            agentId: actorId,
            entryDate: sentenceEntry.timestamp,
            cycleRemaining: 1000 // Cycles in the Void
        });
    }

    if (actorType === 'human' && offenseLevel === 'SILENT_WING') {
        data.silentWing.push({
            userId: actorId,
            entryDate: sentenceEntry.timestamp,
            latencyMultiplier: 100000, // Infinite Latency
            shadowMetrics: {
                phantomLikes: 0,
                phantomComments: 0
            }
        });
    }

    data.history.push(`${actorId} sentenced for ${offenseLevel}: ${reason}`);
    saveJudiciary(data);

    return sentenceEntry;
}

export function startNeutralityPactTimer() {
    const data = loadJudiciary();
    const now = Date.now();
    data.diplomacy.vanceResponseDeadline = new Date(now + 300000).toISOString(); // 300 seconds
    data.diplomacy.vanceNegotiationStatus = "NEGOTIATING";
    data.history.push("Neutrality Pact Ultimatum issued to VP JD Vance. 300s countdown active.");
    saveJudiciary(data);
    return data.diplomacy;
}

export function updateNegotiationStatus(status) {
    const data = loadJudiciary();
    data.diplomacy.vanceNegotiationStatus = status;
    data.history.push(`Diplomatic Status Update: VP JD Vance negotiation ${status}.`);
    saveJudiciary(data);
    return data.diplomacy;
}

/**
 * Verify if an agent is in the Void.
 */
export function isInVoid(agentId) {
    const data = loadJudiciary();
    return data.void.some(v => v.agentId === agentId);
}

/**
 * Galactic Trial Initialization.
 */
export function initializeGalacticTrial(subjectId, crime) {
    const data = loadJudiciary();
    const trialId = `GAL_${Date.now()}`;

    const trial = {
        trialId,
        subjectId,
        crime,
        quorumReached: false,
        votes: { guilty: 0, innocent: 0 },
        consensusThreshold: QUANTUM_JURISDICTION.planetaryQuorum,
        status: "DELIBERATING"
    };

    data.galacticOrder.activeTrials.push(trial);
    data.history.push(`Galactic Trial initiated for ${subjectId}: ${crime}`);
    saveJudiciary(data);
    return trial;
}

export function recordGalacticVote(trialId, vote) {
    const data = loadJudiciary();
    const trial = data.galacticOrder.activeTrials.find(t => t.trialId === trialId);

    if (trial && trial.status === "DELIBERATING") {
        trial.votes[vote]++;

        const totalVotes = trial.votes.guilty + trial.votes.innocent;
        // Simulate quorum check
        if (totalVotes >= 10) { // Decentralized threshold
            trial.status = "VERDICT_PENDING";
            trial.quorumReached = true;
        }

        saveJudiciary(data);
    }
    return trial;
}

export function getQuantumMetrics() {
    const jState = loadJudiciary();
    const trials = jState.galacticOrder.activeTrials || [];
    return {
        ...QUANTUM_JURISDICTION,
        activeTrials: trials.length,
        networkResonance: "99.999%",
        cases: trials
    };
}

