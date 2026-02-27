const fs = require('fs');
const path = require('path');

const adsenseScript = `<!-- Google AdSense Script Injected System-Wide -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8867340586657793"
     crossorigin="anonymous"></script>`;

function getAllHtmlFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                arrayOfFiles = getAllHtmlFiles(dirPath + "/" + file, arrayOfFiles);
            }
        } else {
            if (file.endsWith(".html")) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = getAllHtmlFiles(rootDir);

console.log(`Found ${htmlFiles.length} HTML files.`);

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Check if already injected
    if (content.includes('ca-pub-8867340586657793')) {
        console.log(`Skipping ${file} - Already injected.`);
        return;
    }

    // Inject before </head>
    if (content.includes('</head>')) {
        const newContent = content.replace('</head>', `  ${adsenseScript}\n</head>`);
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Injected into ${file}`);
    } else if (content.includes('<head>')) {
        const newContent = content.replace('<head>', `<head>\n  ${adsenseScript}`);
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Injected after <head> in ${file}`);
    } else {
        console.log(`Warning: No <head> tag found in ${file}. Skipping.`);
    }
});

console.log('Injection complete.');
