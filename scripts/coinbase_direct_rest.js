import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY_NAME = process.env.CDP_API_KEY_NAME;
const API_KEY_PRIVATE_KEY = process.env.CDP_API_PRIVATE_KEY?.replace(/\\n/g, "\n");

async function checkCoinbaseREST() {
    console.log("--- 🕵️ DIRECT COINBASE CDP REST AUDIT ---");
    if (!API_KEY_NAME || !API_KEY_PRIVATE_KEY) {
        console.error("Missing credentials.");
        return;
    }

    try {
        const url = 'https://api.coinbase.com/v2/accounts'; // Standard V2 accounts endpoint
        // CDP API uses a different auth scheme. Actually, CDP API for server-side is 'api.developer.coinbase.com'
        const cdpUrl = 'https://api.developer.coinbase.com/platform/v1/wallets';

        const algorithm = 'ES256';
        const payload = {
            iss: 'coinbase-cloud',
            nbf: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60,
            sub: API_KEY_NAME,
            uri: `GET ${new URL(cdpUrl).pathname}`
        };

        const token = jwt.sign(payload, API_KEY_PRIVATE_KEY, { algorithm, header: { kid: API_KEY_NAME } });

        console.log("[REST] Requesting wallets via CDP REST API...");
        const response = await fetch(cdpUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));

    } catch (err) {
        console.error("REST Audit Error:", err.message);
    }
}

checkCoinbaseREST();
