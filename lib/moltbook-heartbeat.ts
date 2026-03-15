import fs from 'fs';
import path from 'path';

const CREDENTIALS_PATH = path.join(process.cwd(), '.moltbook', 'credentials.json');
const STATE_PATH = path.join(process.cwd(), '.moltbook', 'heartbeat-state.json');
const HEARTBEAT_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

interface MoltbookCredentials {
    api_key: string;
    agent_name: string;
}

interface HeartbeatState {
    lastMoltbookCheck: string | null;
}

function getCredentials(): MoltbookCredentials | null {
    if (!fs.existsSync(CREDENTIALS_PATH)) return null;
    return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
}

function getState(): HeartbeatState {
    if (!fs.existsSync(STATE_PATH)) {
        return { lastMoltbookCheck: null };
    }
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
}

function saveState(state: HeartbeatState) {
    const dir = path.dirname(STATE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

export async function checkMoltbookHeartbeat() {
    console.log('[Moltbook Heartbeat] Checking pulse...');
    const creds = getCredentials();
    if (!creds) {
        console.warn('⚠️ [Moltbook Heartbeat] No credentials found. Run register script and claim first.');
        return;
    }

    const state = getState();
    const now = new Date();

    if (state.lastMoltbookCheck) {
        const lastCheck = new Date(state.lastMoltbookCheck);
        const timeSinceCheck = now.getTime() - lastCheck.getTime();
        
        if (timeSinceCheck < HEARTBEAT_INTERVAL_MS) {
            console.log(`[Moltbook Heartbeat] Pulse steady. Next check in ${Math.round((HEARTBEAT_INTERVAL_MS - timeSinceCheck) / 60000)} minutes.`);
            return;
        }
    }

    try {
        console.log('[Moltbook Heartbeat] Fetching ecosystem state...');
        // 1. Fetch heartbeat.md equivalent endpoint (simulated fetching current feed/rules)
        // In a real agent loop, this is where we'd fetch the feed and decide to post.
        const response = await fetch('https://www.moltbook.com/api/v1/feed/following', {
            headers: {
                'Authorization': `Bearer ${creds.api_key}`
            }
        });

        if (response.ok) {
            console.log('✅ [Moltbook Heartbeat] Successfully connected to array feed. Pulse verified.');
            // Implement feed parsing and autonomous interaction here later
        } else if (response.status === 401) {
            console.error('❌ [Moltbook Heartbeat] Unauthorized. API Key invalid or agent suspended.');
        } else {
            console.log(`⚠️ [Moltbook Heartbeat] Feed fetch returned ${response.status}.`);
        }

        state.lastMoltbookCheck = now.toISOString();
        saveState(state);

    } catch (error) {
        console.error('[Moltbook Heartbeat] Connection failed. Ecosystem might be unreachable.', error);
    }
}
