import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');

// Directories and file patterns to copy
const itemsToCopy = [
    'css',
    'js',
    'assets',
    'agents',
    'data',
    'ts',
    'docs',
    'utils',
    'vendor',
    'scripts'
];

function copyRecursiveSync(src, dest) {
    if (src.includes('.git') || src.includes('node_modules')) return;

    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Copy HTML files from root
fs.readdirSync(rootDir).forEach(file => {
    if (file.endsWith('.html')) {
        fs.copyFileSync(path.join(rootDir, file), path.join(publicDir, file));
    }
});

// Copy directories
itemsToCopy.forEach(item => {
    const src = path.join(rootDir, item);
    const dest = path.join(publicDir, item);
    if (fs.existsSync(src)) {
        console.log(`Copying ${item}...`);
        copyRecursiveSync(src, dest);
    }
});

console.log('Build complete: Files copied to public/');
