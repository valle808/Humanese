/**
 * No-IP Dynamic DNS Ecosystem Updater
 * 
 * Automatically synchronizes your local dynamic IP with your active DDNS No-IP endpoint.
 * This is useful if you are using Humanese decentralization nodes directly from your local home lab
 * and your IP shifts organically.
 * 
 * USAge: node scripts/noip_updater.js
 */

const NOIP_USERNAME = process.env.NOIP_USERNAME || 'YOUR_NOIP_EMAIL';
const NOIP_PASSWORD = process.env.NOIP_PASSWORD || 'YOUR_NOIP_PASSWORD';
const NOIP_HOSTNAME = process.env.NOIP_HOSTNAME || 'humanese.ddns.net';

async function updateDynamicDNS() {
    console.log(`[NO-IP] Attempting synchronization for ${NOIP_HOSTNAME}...`);

    try {
        const credentials = Buffer.from(`${NOIP_USERNAME}:${NOIP_PASSWORD}`).toString('base64');
        const updateUrl = `https://dynupdate.no-ip.com/nic/update?hostname=${NOIP_HOSTNAME}`;

        const response = await fetch(updateUrl, {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'User-Agent': `Humanese-Bastidas-Agent/3.0 ${NOIP_USERNAME}`
            }
        });

        const resultText = await response.text();

        if (resultText.startsWith('good') || resultText.startsWith('nochg')) {
            console.log(`[NO-IP SUCCESS] Domain linked actively to your IP. Status: ${resultText.trim()}`);
        } else {
            console.error(`[NO-IP FAULT] Authentication failed or domain locked. Status: ${resultText.trim()}`);
        }
    } catch (error) {
        console.error(`[NO-IP SEVERE TILT] Network failure to reach update endpoint: ${error.message}`);
    }
}

// Ping every 5 minutes (300,000 ms) automatically
setInterval(updateDynamicDNS, 300000);
updateDynamicDNS();
