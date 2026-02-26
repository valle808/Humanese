const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const cssDir = path.join(projectDir, 'css');

if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir);
}

const items = fs.readdirSync(projectDir);
let extractedCount = 0;

for (const item of items) {
    if (item.endsWith('.html')) {
        const filePath = path.join(projectDir, item);
        let content = fs.readFileSync(filePath, 'utf8');

        const startTag = '<style>';
        const endTag = '</style>';

        let startIndex = content.indexOf(startTag);
        let endIndex = content.indexOf(endTag);

        if (startIndex !== -1 && endIndex !== -1) {
            const cssContent = content.substring(startIndex + startTag.length, endIndex).trim();
            if (cssContent.length > 50) { // Only extract if it's somewhat substantive
                const baseName = path.basename(item, '.html');
                const cssFileName = `${baseName}.css`;
                const cssFilePath = path.join(cssDir, cssFileName);

                // Don't overwrite existing CSS files unless we append
                if (!fs.existsSync(cssFilePath)) {
                    fs.writeFileSync(cssFilePath, cssContent);
                } else {
                    fs.appendFileSync(cssFilePath, '\n' + cssContent);
                }

                const newContent = content.substring(0, startIndex) +
                    `<link rel="stylesheet" href="./css/${cssFileName}">\n` +
                    content.substring(endIndex + endTag.length);

                fs.writeFileSync(filePath, newContent);
                console.log(`Extracted CSS from ${item} to css/${cssFileName}`);
                extractedCount++;
            }
        }
    }
}

console.log(`Finished checking. Extracted CSS from ${extractedCount} files.`);
