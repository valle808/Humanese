import fs from 'fs';
import path from 'path';

const ADSENSE_META = '<meta name="google-adsense-account" content="ca-pub-8867340586657793">';
const ADSENSE_SCRIPT = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8867340586657793" crossorigin="anonymous"></script>';

function injectAdSense(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if already injected
    if (content.includes('ca-pub-8867340586657793')) {
        console.log(`[Skipping] ${filePath} - AdSense already present`);
        return;
    }

    // Find <head> or <html> tag
    if (content.includes('</head>')) {
        content = content.replace('</head>', `    ${ADSENSE_META}\n    ${ADSENSE_SCRIPT}\n</head>`);
    } else if (content.includes('<head>')) {
        content = content.replace('<head>', `<head>\n    ${ADSENSE_META}\n    ${ADSENSE_SCRIPT}`);
    } else if (content.includes('<html>')) {
        content = content.replace('<html>', `<html>\n<head>\n    ${ADSENSE_META}\n    ${ADSENSE_SCRIPT}\n</head>`);
    } else {
        console.error(`[Error] ${filePath} - No <head> or <html> tag found`);
        return;
    }

    fs.writeFileSync(filePath, content);
    console.log(`[Success] ${filePath} - AdSense injected`);
}

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

// Start injection
const rootDir = process.cwd();
walkDir(rootDir, (filePath) => {
    if (filePath.endsWith('.html') && !filePath.includes('node_modules')) {
        injectAdSense(filePath);
    }
});

console.log('AdSense injection complete.');
