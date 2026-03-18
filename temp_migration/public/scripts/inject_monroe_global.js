import fs from 'fs';
import path from 'path';

const widgetScript = '    <script src="js/monroe-widget.js"></script>\n';
const rootDir = './';

async function injectWidget() {
    const files = fs.readdirSync(rootDir);
    const htmlFiles = files.filter(f => f.endsWith('.html'));

    console.log(`Found ${htmlFiles.length} HTML files. Starting injection...`);

    let updatedCount = 0;
    for (const file of htmlFiles) {
        const filePath = path.join(rootDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        if (content.includes('</body>') && !content.includes('monroe-widget.js')) {
            console.log(`Injecting into ${file}...`);
            content = content.replace('</body>', `${widgetScript}</body>`);
            fs.writeFileSync(filePath, content);
            updatedCount++;
        }
    }

    console.log(`Successfully injected Monroe widget into ${updatedCount} files.`);
}

injectWidget().catch(console.error);
