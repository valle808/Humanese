import http from 'http';
import { spawn } from 'child_process';

const PORT = 3005;
const URL = `http://localhost:${PORT}/`;
const CHECK_INTERVAL = 5000; // Check every 5 seconds
let serverProcess = null;

console.log('=================================');
console.log('[Auto-Heal Agent] Initialized');
console.log('=================================');
console.log(`[Protocol] Monitoring ${URL} every ${CHECK_INTERVAL}ms`);

function startServer() {
    if (serverProcess) {
        return;
    }
    console.log('[Auto-Heal Agent] Action: Starting server (npm run dev)...');
    serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        shell: true
    });

    serverProcess.on('close', (code) => {
        console.log(`[Auto-Heal Agent] Alert: Server process exited with code ${code}`);
        serverProcess = null;
    });

    serverProcess.on('error', (err) => {
        console.error(`[Auto-Heal Agent] Error starting server:`, err);
        serverProcess = null;
    });
}

function checkServer() {
    return new Promise((resolve) => {
        const req = http.get(URL, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve(true);
            } else {
                console.log(`[Protocol] Warning: Server responded with status ${res.statusCode}`);
                resolve(false);
            }
        });

        req.on('error', (err) => {
            resolve(false);
        });

        req.setTimeout(2000, () => {
            req.abort();
            resolve(false);
        });
    });
}

async function runProtocol() {
    while (true) {
        const isUp = await checkServer();
        if (!isUp) {
            console.log('[Protocol] Status: DOWN. Triggering Auto-Heal Agent...');
            if (serverProcess) {
                console.log('[Auto-Heal Agent] Action: Killing stale process...');
                serverProcess.kill();
                serverProcess = null;
                await new Promise(r => setTimeout(r, 2000));
            }
            startServer();
            // Wait for server to boot up before checking again
            await new Promise(r => setTimeout(r, 6000));
        }
        await new Promise(r => setTimeout(r, CHECK_INTERVAL));
    }
}

runProtocol();
