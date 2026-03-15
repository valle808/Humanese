import * as crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

console.log('Available crypto exports:', Object.keys(crypto).filter(k => k.toLowerCase().includes('private')));

dotenv.config();

const API_KEY_NAME = process.env.CDP_API_KEY_NAME;
const rawKey = process.env.CDP_API_PRIVATE_KEY;
const b64 = "MHCcAQEEIAw+yukaAKvCaDZvyZLDbq6BFEuNQvv2sOmbNSY+W1vCoAoGCCqGSM49AwEHoUQDQgAENj4KZg32MazNWoJIQIXzNtDgljwIe/MaR13iuNbZ5ziNyUNoH+IRfh/51DeCMn6195v00sIIdP+523Zso5n8Ug==";
const API_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\n${b64}\n-----END PRIVATE KEY-----`;

try {
    const key = crypto.createPrivateKey(API_PRIVATE_KEY);
    console.log('Key Object Type:', key.type);
    console.log('Key Object AsymmetricType:', key.asymmetricKeyType);

    const payload = {
        iss: 'coinbase-cloud',
        sub: API_KEY_NAME,
        uri: 'GET localhost/api/v3/brokerage/accounts'
    };

    const token = jwt.sign(payload, key, {
        algorithm: 'ES256',
        header: {
            kid: API_KEY_NAME
        }
    });
    console.log('Token generated successfully:', token.substring(0, 20) + '...');
} catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
}
