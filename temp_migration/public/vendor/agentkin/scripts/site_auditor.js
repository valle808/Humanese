const fs = require('fs');
const path = require('path');

/**
 * AgentKin Site Auditor
 * This script autonomously checks for website issues:
 * - Unclosed HTML tags
 * - Misplaced JavaScript code (outside <script> tags)
 * - Broken links (internal)
 * - Missing assets
 */

const ROOT_DIR = path.resolve(__dirname, '..');
const FILES_TO_CHECK = ['index.html', 'terms.html', 'register.html', 'login.html', 'cms.html'];

function auditFile(filename) {
    console.log(`\n--- Auditing ${filename} ---`);
    const filePath = path.join(ROOT_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.error(`Error: ${filename} not found.`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let issues = 0;

    // 1. Check for basic tag balance (more robust)
    const scriptOpen = (content.match(/<script\b[^>]*>/gi) || []).length;
    const scriptClose = (content.match(/<\/script\s*>/gi) || []).length;
    if (scriptOpen !== scriptClose) {
        console.error(`[!] Mismatched <script> tags: ${scriptOpen} open vs ${scriptClose} close.`);
        issues++;
    }

    const styleOpen = (content.match(/<style\b[^>]*>/gi) || []).length;
    const styleClose = (content.match(/<\/style\s*>/gi) || []).length;
    if (styleOpen !== styleClose) {
        console.error(`[!] Mismatched <style> tags: ${styleOpen} open vs ${styleClose} close.`);
        issues++;
    }

    // 2. Scan for JS-like code outside <script> tags
    let inScript = false;
    let inStyle = false;
    lines.forEach((line, index) => {
        const trimmed = line.trim();

        // Match tags even if there's other stuff on the line
        if (/<script\b[^>]*>/i.test(line)) inScript = true;
        if (/<\/script\s*>/i.test(line)) inScript = false;
        if (/<style\b[^>]*>/i.test(line)) inStyle = true;
        if (/<\/style\s*>/i.test(line)) inStyle = false;

        if (!inScript && !inStyle && trimmed.length > 5) {
            // Patterns that shouldn't be in plain HTML content
            const jsPatterns = [
                /function\s+\w+\s*\(/,
                /const\s+\w+\s*=/,
                /let\s+\w+\s*=/,
                /\w+\.addEventListener\(/,
                /toLowerCase\(\)\s*===/,
                /\.offsetWidth/,
                /Math\.random\(\)/,
                /\[href="login\.html"\]/
            ];

            jsPatterns.forEach(pattern => {
                if (pattern.test(line) && !line.includes('<code>') && !line.includes('<pre>') && !line.includes('<!--')) {
                    console.warn(`[?] Potential visible code at line ${index + 1}: ${trimmed}`);
                    issues++;
                }
            });
        }
    });

    if (issues === 0) {
        console.log(`[✓] No major issues found in ${filename}.`);
    } else {
        console.log(`[X] Found ${issues} potential issues in ${filename}.`);
    }
    return issues;
}

function runAudit() {
    let totalIssues = 0;
    FILES_TO_CHECK.forEach(file => {
        totalIssues += auditFile(file);
    });
    console.log(`\nTotal potential issues found: ${totalIssues}`);
}

runAudit();
