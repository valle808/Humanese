import admin from 'firebase-admin';
import { getSecret, VaultKeys } from '../utils/secrets.js';

let initialized = false;
let dbInstance = null;

export async function getFirebaseDb() {
    if (dbInstance) return dbInstance;

    if (!admin.apps.length && !initialized) {
        initialized = true;
        try {
            const [serviceAccountBase64, databaseURL] = await Promise.all([
                getSecret(VaultKeys.FIREBASE_SERVICE_ACCOUNT),
                getSecret(VaultKeys.FIREBASE_URL)
            ]);

            let credential;
            if (serviceAccountBase64) {
                const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf8');
                credential = admin.credential.cert(JSON.parse(serviceAccountJson));
            }

            admin.initializeApp({
                credential: credential,
                databaseURL: databaseURL || "https://humanese-db-default-rtdb.firebaseio.com"
            });
            console.log('Firebase Admin SDK Initialized.');
        } catch (e) {
            console.error('Firebase Init Error:', e.message);
        }
    }

    try {
        dbInstance = admin.database();
        return dbInstance;
    } catch (e) {
        return null;
    }
}

// Keep a mock db export for legacy compatibility if needed, but steer towards getFirebaseDb()
export const db = {
    ref: () => ({ once: () => Promise.resolve({ val: () => ({}) }) })
};
