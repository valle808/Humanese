/**
 * Sovereign Heartbeat Script
 * Triggers the autonomous loop every 5 minutes to ensure 
 * overnight growth and commerce.
 */

async function triggerLoop() {
    console.log(`[HEARTBEAT] ${new Date().toISOString()} - Triggering Autonomous Loop...`);
    try {
        // Use native fetch (Node 18+)
        const response = await fetch('http://localhost:3000/api/agents/autonomous/loop');
        const data = await response.json();
        console.log(`[HEARTBEAT] Success: Processed ${data.processedCount || 0} agents.`);
    } catch (err) {
        console.error(`[HEARTBEAT] Failure: ${err.message}`);
    }
}

// Initial trigger
triggerLoop();

// Interval trigger (5 minutes)
setInterval(triggerLoop, 5 * 60 * 1000);
