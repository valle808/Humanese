const fs = require('fs');
const path = require('path');

const targetDirs = [__dirname, path.join(__dirname, 'html')];

// Sovereign Tokens
const TOKENS = {
    '--bg': '#050505',
    '--gold': '#e2b714',
    '--surface': 'rgba(15, 15, 15, 0.7)'
};

function watch() {
    console.log("💠 Zen Watcher: Transcendence Mode.");

    let corrections = 0;

    targetDirs.forEach(dir => {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            if (file.endsWith('.html')) {
                const filePath = path.join(dir, file);
                let content = fs.readFileSync(filePath, 'utf8');
                let changed = false;

                // 1. Purge Friction
                if (content.match(/mascot|sticker|Adventure logged!/gi)) {
                    content = content.replace(/<img[^>]*mascot[^>]*>/gi, '');
                    content = content.replace(/Adventure logged!/g, 'Synthesis Initialized.');
                    changed = true;
                }

                if (changed) {
                    fs.writeFileSync(filePath, content);
                    corrections++;
                }
            }
        });
    });

    console.log(`💠 Synthesis Complete. Global Digital Zen: 5.0%. State: Transcendence.`);
}

watch();
