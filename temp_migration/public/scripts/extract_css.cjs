const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '../index.html');
const cssPath = path.resolve(__dirname, '../css/index.css');

let content = fs.readFileSync(indexPath, 'utf8');

const startTag = '<style>';
const endTag = '</style>';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
    const cssContent = content.substring(startIndex + startTag.length, endIndex);
    fs.writeFileSync(cssPath, cssContent.trim());

    const newContent = content.substring(0, startIndex) +
        '<link rel="stylesheet" href="./css/index.css">\n' +
        content.substring(endIndex + endTag.length);

    fs.writeFileSync(indexPath, newContent);
    console.log('Successfully extracted CSS to css/index.css');
} else {
    console.log('Could not find <style> block in index.html');
}
