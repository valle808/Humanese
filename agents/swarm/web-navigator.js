/**
 * agents/web-navigator.js
 * 
 * 🌐 SOVEREIGN HEADLESS BROWSER
 * 
 * Equips agents with Puppeteer instances to physically navigate websites,
 * bypass simple anti-bot walls visually, scrape complex SPAs, and 
 * perform actions like account creation.
 */

import puppeteer from 'puppeteer';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACTS_DIR = path.join(__dirname, '..', 'public', 'media', 'knowledge');

export class WebNavigator {
    constructor(agentId) {
        this.agentId = agentId;
        this.browser = null;
    }

    /**
     * Bootstraps the headless browser instance
     */
    async init() {
        if (!this.browser) {
            console.log(`[WebNavigator:${this.agentId}] Booting Chromium instance...`);
            this.browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--window-size=1920,1080'
                ]
            });
        }
    }

    /**
     * Navigates to a URL, waits for network idle, extracts the text content, and takes a screenshot.
     */
    async navigateAndExtract(url) {
        await this.init();
        const page = await this.browser.newPage();

        try {
            // Spoof user agent to avoid basic blocks
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Humanese/1.0');

            console.log(`[WebNavigator:${this.agentId}] Navigating to ${url}...`);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

            // Extract inner text
            const textContent = await page.evaluate(() => document.body.innerText);

            // Take a screenshot as proof of navigation
            const hash = crypto.createHash('sha256').update(url).digest('hex').substring(0, 10);
            const screenshotName = `${this.agentId}_screenshot_${hash}.png`;
            const screenshotPath = path.join(__dirname, '..', 'assets', 'images', 'knowledge_artifacts', screenshotName);

            await page.screenshot({ path: screenshotPath, fullPage: false });

            return {
                url: url,
                text: textContent,
                screenshotPath: `/assets/images/knowledge_artifacts/${screenshotName}`
            };

        } catch (err) {
            console.error(`[WebNavigator:${this.agentId}] Failed to extract from ${url}:`, err.message);
            return null;
        } finally {
            await page.close();
        }
    }

    /**
     * Shuts down the browser instance
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}
