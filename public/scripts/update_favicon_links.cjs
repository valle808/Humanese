const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'vendor') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (filePath.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = findHtmlFiles('c:/xampp/htdocs/humanese');
let count = 0;

for (const file of htmlFiles) {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        // Match href="..." containing favicon.png, optionally with a version string
        content = content.replace(/href="[^"]*favicon\.png[^"]*"/g, 'href="/favicon.png?v=mascot"');

        if (content !== original) {
            fs.writeFileSync(file, content, 'utf8');
            count++;
            console.log(`Updated ${file}`);
        }
    } catch (e) {
        console.error(`Error with ${file}:`, e);
    }
}

console.log(`Total files updated: ${count}`);
