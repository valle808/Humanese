const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');

// Skip these directories
const ignoreDirs = ['node_modules', '.git', '.gemini', 'scripts', 'vendor', 'ClawdX'];

function processDirectory(directory) {
    const items = fs.readdirSync(directory);

    for (const item of items) {
        const fullPath = path.join(directory, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!ignoreDirs.includes(item)) {
                processDirectory(fullPath);
            }
        } else if (stat.isFile() && fullPath.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Fix src="//..." and href="//..." -> src="https://..." and href="https://..."
    content = content.replace(/(src|href)=["']\/\/(.*?)["']/g, '$1="https://$2"');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated URLs in: ${filePath}`);
    }
}

console.log('Starting URL prefix fix...');
processDirectory(projectDir);
console.log('Finished URL prefix fix.');
