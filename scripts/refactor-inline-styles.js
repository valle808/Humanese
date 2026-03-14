import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dir = 'c:\\xampp\\htdocs\\humanese';
const cssFile = path.join(dir, 'css', 'page-fixes.css');

const ignoreDirs = ['vendor', 'node_modules', '.git', 'css', 'js', 'assets', 'api', '.tempmediaStorage'];
let cssOutput = '\n/* Auto-extracted inline styles */\n';
const styleMap = new Map(); // hash -> style content

function hashStyle(styleStr) {
    return 'u-fx-' + crypto.createHash('md5').update(styleStr).digest('hex').substr(0, 8);
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Regex to match style="..."  (ignoring those with ${} for JS templates)
    const styleRegex = /style="([^"\$]+)"/g;

    // Check if file uses link rel="stylesheet" href="./css/page-fixes.css"
    // If we replace something, we need to ensure the CSS is linked
    let hasPageFixesLink = content.includes('page-fixes.css');

    // We will do a manual pass to carefully merge into class attributes
    // A regex for the tag opening: <[a-zA-Z0-9-]+[^>]*>
    const tagRegex = /<[a-zA-Z0-9-]+[^>]*style="[^"\$]+"[^>]*>/g;

    content = content.replace(tagRegex, (tagStr) => {
        let newTag = tagStr;
        let match;
        const styleRegexLocal = /style="([^"\$]+)"/g;
        while ((match = styleRegexLocal.exec(newTag)) !== null) {
            let styleContent = match[1].trim();
            if (!styleContent) continue;

            // Clean up style content
            if (!styleContent.endsWith(';')) styleContent += ';';

            let className = '';
            for (let [hash, existingStyle] of styleMap.entries()) {
                if (existingStyle === styleContent) {
                    className = hash;
                    break;
                }
            }
            if (!className) {
                className = hashStyle(styleContent);
                styleMap.set(className, styleContent);
                cssOutput += `.${className} { ${styleContent} }\n`;
            }

            // Remove the style attribute
            newTag = newTag.replace(match[0], '');

            // Add to class attribute
            const classMatch = newTag.match(/class="([^"]*)"/);
            if (classMatch) {
                newTag = newTag.replace(classMatch[0], `class="${className} ${classMatch[1]}"`);
            } else {
                // Determine insertion point (before ending > or />)
                if (newTag.endsWith('/>')) {
                    newTag = newTag.replace(/\/>$/, ` class="${className}" />`);
                } else {
                    newTag = newTag.replace(/>$/, ` class="${className}">`);
                }
            }
            changed = true;
        }
        return newTag;
    });

    if (changed) {
        if (!hasPageFixesLink) {
            // Find </head> to inject link
            content = content.replace('</head>', '    <link rel="stylesheet" href="./css/page-fixes.css">\n</head>');
        }
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkArgs(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
        if (ignoreDirs.includes(file)) continue;
        const fullPath = path.join(currentDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkArgs(fullPath);
        } else if (file.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

// Ensure page-fixes.css exists
if (!fs.existsSync(cssFile)) {
    fs.writeFileSync(cssFile, '/* Page fixes */\n');
}

walkArgs(dir);

// Append new styles
fs.appendFileSync(cssFile, cssOutput);
console.log('Finished refactoring styles.');
