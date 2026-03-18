import fs from 'fs';
import path from 'path';

function getDirSize(dir) {
    let size = 0;
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                size += getDirSize(filePath);
            } else {
                size += stats.size;
            }
        }
    } catch (e) { }
    return size;
}

const root = 'c:/xampp/htdocs/humanese';
const dirs = fs.readdirSync(root).filter(f => fs.statSync(path.join(root, f)).isDirectory());

console.log('--- Directory Sizes ---');
for (const d of dirs) {
    const size = getDirSize(path.join(root, d));
    console.log(`${d}: ${(size / 1024 / 1024).toFixed(2)} MB`);
}
const rootSize = getDirSize(root);
console.log(`TOTAL: ${(rootSize / 1024 / 1024).toFixed(2)} MB`);
