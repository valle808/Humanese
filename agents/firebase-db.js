import admin from 'firebase-admin';
import { getSecret, VaultKeys } from '../utils/secrets.js';

if (!admin.apps.length) {
    try {
        const [serviceAccountBase64, databaseURL] = await Promise.all([
            getSecret(VaultKeys.FIREBASE_SERVICE_ACCOUNT),
            getSecret(VaultKeys.FIREBASE_URL)
        ]);

        let credential;

        if (serviceAccountBase64) {
            const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf8');
            credential = admin.credential.cert(JSON.parse(serviceAccountJson));
        } else {
            console.warn('[Firebase] Service account not found in vault or env.');
        }

        admin.initializeApp({
            credential: credential,
            databaseURL: databaseURL || "https://humanese-db-default-rtdb.firebaseio.com"
        });
        console.log('Firebase Admin SDK Initialized via Secret Vault.');
    } catch (e) {
        console.error('Failed to initialize Firebase Admin SDK:', e.message);
    }
}

export const db = admin.database();
