import ftp from 'basic-ftp';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load local environment variables for FTP credentials
dotenv.config({ path: '.env.local' });

async function deployToNamecheap() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    const host = process.env.NAMECHEAP_FTP_HOST;
    const user = process.env.NAMECHEAP_FTP_USER;
    const pass = process.env.NAMECHEAP_FTP_PASS;
    const remoteDir = process.env.NAMECHEAP_REMOTE_DIR || "public_html";

    if (!host || !user || !pass) {
        console.error("❌ ERROR: Missing Namecheap FTP Credentials in .env.local");
        console.error("Please set NAMECHEAP_FTP_HOST, NAMECHEAP_FTP_USER, and NAMECHEAP_FTP_PASS.");
        process.exit(1);
    }

    try {
        console.log(`\n======================================`);
        console.log(`🚀 INITIATING NAMECHEAP FTP DEPLOYMENT`);
        console.log(`======================================\n`);
        console.log(`Connecting to FTP Server: ${host}...`);
        
        await client.access({
            host: host,
            user: user,
            password: pass,
            secure: false // Set to true if explicit FTPS is required by Namecheap
        });

        console.log(`✅ Connected successfully.`);

        // Navigate to the target directory
        console.log(`Navigating to remote directory: ${remoteDir}`);
        await client.ensureDir(remoteDir);

        // Standard Namecheap Shared Hosting (Non-Node.js) usually serves from `public_html`.
        // We will deploy the compiled purely static `/public` directory assets.
        // *If you are running a Node.js App via cPanel, you would modify this to upload `.next` and `package.json` instead.

        const localStaticDir = "public";
        
        if (!fs.existsSync(localStaticDir)) {
            console.error(`❌ ERROR: Local directory '${localStaticDir}' not found. Run 'npm run build:static' first.`);
            process.exit(1);
        }

        console.log(`Uploading contents of './${localStaticDir}' to '${remoteDir}'...`);
        
        // This will upload all contents inside the local directory to the remote working directory
        await client.uploadFromDir(localStaticDir);

        console.log(`\n🎉 DEPLOYMENT COMPLETE! All static assets uploaded to Namecheap.`);
    } catch (err) {
        console.error(`\n❌ DEPLOYMENT FAILED:`, err.message);
    } finally {
        client.close();
    }
}

deployToNamecheap();
