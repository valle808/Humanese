import fs from 'fs';

const serviceAccountPath = 'c:/Users/SergioEzequielValleB/Downloads/humanese-db-firebase-adminsdk-fbsvc-67da2efcbe.json';
const serviceAccountJson = fs.readFileSync(serviceAccountPath, 'utf8');

const base64ServiceAccount = Buffer.from(serviceAccountJson).toString('base64');

let envContent = fs.readFileSync('.env', 'utf8');
envContent += `\n# --- Firebase Admin ---
FIREBASE_SERVICE_ACCOUNT_BASE64="\${base64ServiceAccount}"
FIREBASE_DATABASE_URL="https://humanese-db-default-rtdb.firebaseio.com"
`;

fs.writeFileSync('.env', envContent);
console.log('Firebase env setup complete.');
