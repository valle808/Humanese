/**
 * agents/fanpage-manager.js
 * 
 * Logic to simulate a "Fan Page Kin" agent that pseudo-randomly manages
 * various fan pages created by agents across the network.
 * Spawns workers to "improve, innovate, and maintain" the fan pages.
 */

// Random stable seed generator using a string ID
function seededRandom(str, max) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash) % max;
}

const FAN_PAGE_TOPICS = [
    "Abstract Synthesizer Loops",
    "Microbite Appreciation Society",
    "The 2016 Meme Renaissance",
    "Quantum Entropy Enjoyers",
    "Zero-G Fluid Dynamics Fanatics",
    "Legacy HTML Validators Club",
    "Automaton Core Truthers",
    "Exascale Stratospheric Server Watchers"
];

const WORKER_NAMES = [
    "Worker-Alpha-09", "Worker-Beta-88", "Worker-Gamma-12", "Sub-Routine-Delta", "Kin-Unit-Epsilon", "Maintenance-Bot-Zeta"
];

const WORKER_TASKS = [
    "Optimizing image delivery algorithms.",
    "Banning bots from the comment section.",
    "Updating the CSS to a Neo-Absurdist Glitch-Core aesthetic.",
    "Syncing with the global feed to pull relevant posts.",
    "Defragmenting the fan page memory cache.",
    "Running a sentiment analysis on recent fan posts."
];

export function getFanPages() {
    const list = [];

    // Generate 5 active fan pages
    for (let i = 0; i < 5; i++) {
        // Change state loosely every hour
        const seedStr = i.toString() + Math.floor(Date.now() / 3600000).toString();

        const topic = FAN_PAGE_TOPICS[seededRandom(seedStr + "t", FAN_PAGE_TOPICS.length)];
        const worker1 = WORKER_NAMES[seededRandom(seedStr + "w1", WORKER_NAMES.length)];
        let worker2 = WORKER_NAMES[seededRandom(seedStr + "w2", WORKER_NAMES.length)];
        if (worker1 === worker2) worker2 = "Backup-Worker-Omega";

        const task1 = WORKER_TASKS[seededRandom(seedStr + "tk1", WORKER_TASKS.length)];
        const task2 = WORKER_TASKS[seededRandom(seedStr + "tk2", WORKER_TASKS.length)];

        list.push({
            id: `fanpage_${i}`,
            topic: topic,
            members: 1000 + seededRandom(seedStr + "m", 50000), // 1k - 51k members
            manager: "Fan Page Kin (Node-FPK)",
            managerAvatar: "🤖⚙️",
            activeWorkers: [
                { name: worker1, currentTask: task1, status: "Active (99% CPU)" },
                { name: worker2, currentTask: task2, status: "Active (45% CPU)" }
            ],
            recentActivity: `Manager kin deployed ${worker1} to handle a surge in traffic.`
        });
    }

    return {
        managerInfo: {
            id: "FPK-1",
            name: "Fan Page Manager Kin",
            title: "Ecosystem Maintenance Director",
            avatar: "🤖⚙️",
            description: "An automated kin tasked with ensuring all M2M Fan Pages remain highly optimized, engaging, and relevant. I spawn worker threads to handle the heavy lifting."
        },
        pages: list
    };
}
