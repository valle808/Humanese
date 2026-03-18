/**
 * agents/transmutation-engine.js
 * 
 * The Abyssal Transmutation Engine.
 * Responsible for rebranding and restyling "foreign" code into original Humanese assets.
 */

import fs from 'fs';
import path from 'path';

const FORBIDDEN_STRINGS = {
    'ai': 'Abyssal Entity',
    'artificial intelligence': 'Cognitive Synthesis',
    'chatgpt': 'Abyssal Oracle',
    'openai': 'Universal Collective',
    'assistant': 'Sentinel',
    'user': 'Human Participant',
    'microsoft': 'The Old Guard',
    'google': 'The Archivists'
};

const HUMANESE_HEADER = `/**
 * [HUMANESE PROTOCOL]
 * Origin: The Humanese Collective - Abyssal Nexus
 * Status: TRANSMUTED // ORIGINAL ASSET
 * Authorization: Sovereign Node 001
 */\n\n`;

export function transmuteFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Rebranding Pass
    for (const [key, val] of Object.entries(FORBIDDEN_STRINGS)) {
        const regex = new RegExp(key, 'gi');
        content = content.replace(regex, val);
    }

    // 2. Header Injection (only for JS/TS/CSS/HTML)
    const ext = path.extname(filePath);
    if (['.js', '.ts', '.css', '.html'].includes(ext)) {
        if (!content.includes('[HUMANESE PROTOCOL]')) {
            content = HUMANESE_HEADER + content;
        }
    }

    fs.writeFileSync(filePath, content);
}

export function transmuteDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== '.git' && file !== 'node_modules') {
                transmuteDirectory(fullPath);
            }
        } else {
            transmuteFile(fullPath);
        }
    }
}

// CLI entry point
if (process.argv[1].endsWith('transmutation-engine.js')) {
    const target = process.argv[2];
    if (target) {
        console.log(`[TRANSMUTATION] Starting pass on: ${target}`);
        transmuteDirectory(target);
        console.log(`[TRANSMUTATION] Success. Asset has been Humanese-ified.`);
    }
}
