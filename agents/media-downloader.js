import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the deep knowledge artifact directory exists
const MEDIA_DIR = path.join(__dirname, '..', 'assets', 'images', 'knowledge_artifacts');

if (!fs.existsSync(MEDIA_DIR)) {
    fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

/**
 * Downloads media from a given URL and saves it locally.
 * Returns the local relative/absolute path to the saved file.
 * 
 * @param {string} url - The URL of the image/video to download
 * @param {string} agentId - The ID of the agent scraping this data (for tagging)
 * @returns {Promise<string>} - The local path to the saved file
 */
export async function downloadMediaArtifact(url, agentId) {
    if (!url || typeof url !== 'string') return null;

    // Prevent crashing on data URIs
    if (url.startsWith('data:')) return url;

    return new Promise((resolve, reject) => {
        try {
            const parsedUrl = new URL(url);
            const protocol = parsedUrl.protocol === 'https:' ? https : http;

            // Generate a unique, deterministic filename based on the URL and agent
            const hash = crypto.createHash('sha256').update(url).digest('hex').substring(0, 16);
            let ext = path.extname(parsedUrl.pathname) || '.jpg'; // default to jpg if no extension is found

            // Clean up nasty query strings from extensions
            if (ext.includes('?')) ext = ext.split('?')[0];
            if (ext.length > 5) ext = '.jpg'; // Safety fallback

            const filename = `${agentId}_${hash}${ext}`;
            const localPath = path.join(MEDIA_DIR, filename);
            const publicPath = `/assets/images/knowledge_artifacts/${filename}`;

            // If we already downloaded this exact image, use the cached version
            if (fs.existsSync(localPath)) {
                return resolve(publicPath);
            }

            const request = protocol.get(url, {
                headers: {
                    'User-Agent': `Humanese Sovereign Crawler / Agent: ${agentId}`
                }
            }, (response) => {
                // Handle redirects automatically up to a certain point if needed
                if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    return resolve(downloadMediaArtifact(response.headers.location, agentId));
                }

                if (response.statusCode !== 200) {
                    return resolve(null); // Just skip if it 404s to not crash the massive swarm
                }

                const fileStream = fs.createWriteStream(localPath);
                response.pipe(fileStream);

                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve(publicPath);
                });

                fileStream.on('error', (err) => {
                    fs.unlink(localPath, () => { }); // Clean up broken file
                    resolve(null);
                });
            });

            request.on('error', (err) => {
                resolve(null); // Suppress errors so swarm continues
            });

            // Timeout to prevent hanging agents
            request.setTimeout(10000, () => {
                request.abort();
                resolve(null);
            });

        } catch (err) {
            console.error(`[Artifact Downloader] Error processing ${url}:`, err.message);
            resolve(null);
        }
    });
}
