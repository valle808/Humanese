import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

if (!admin.apps.length) {
    try {
        const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
        let credential;

        if (serviceAccountBase64) {
            const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf8');
            credential = admin.credential.cert(JSON.parse(serviceAccountJson));
        } else {
            // Fallback or explicit local path just in case
            console.warn('FIREBASE_SERVICE_ACCOUNT_BASE64 not found in environment.');
        }

        admin.initializeApp({
            credential: credential,
            databaseURL: process.env.FIREBASE_DATABASE_URL || "https://humanese-db-default-rtdb.firebaseio.com"
        });
        console.log('Firebase Admin SDK Initialized successfully.');
    } catch (e) {
        console.error('Failed to initialize Firebase Admin SDK:', e);
    }
}

export const db = admin.database();
