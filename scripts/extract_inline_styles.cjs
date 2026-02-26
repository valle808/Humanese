const fs = require('fs');
const path = require('path');

const htmlFile = process.argv[2] || 'index.html';
const baseName = path.basename(htmlFile, '.html');
const targetHtml = path.resolve(__dirname, '..', htmlFile);
const cssFile = path.resolve(__dirname, '..', 'css', `${baseName}.css`);

let htmlContent = fs.readFileSync(targetHtml, 'utf8');
let cssContent = fs.existsSync(cssFile) ? fs.readFileSync(cssFile, 'utf8') : '';

let counter = 1;
let extractedStyles = '';

htmlContent = htmlContent.replace(/<([^>]+)\sstyle="([^"]+)"([^>]*)>/g, (match, beforeStyle, styleContent, afterStyle) => {
    const className = `auto-style-${counter++}`;
    extractedStyles += `\n.${className} {\n  ${styleContent.split(';').map(s => s.trim()).filter(Boolean).join(';\n  ')};\n}\n`;

    // Check if the element already has a class attribute
    let newTag = `<${beforeStyle}${afterStyle}>`;
    if (newTag.includes('class="')) {
        newTag = newTag.replace('class="', `class="${className} `);
    } else {
        newTag = `<${beforeStyle} class="${className}"${afterStyle}>`;
    }
    return newTag;
});

// Write changes
fs.writeFileSync(targetHtml, htmlContent, 'utf8');
if (extractedStyles) {
    fs.writeFileSync(cssFile, cssContent + extractedStyles, 'utf8');
}

console.log(`Extracted ${counter - 1} inline styles from index.html to css/index.css.`);
