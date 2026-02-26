const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const matches = content.match(/style="[^"]*"/g);
if (matches) {
    console.log('Found ' + matches.length + ' inline styles in index.html');
    console.log(matches.slice(0, 10));
} else {
    console.log('No inline styles found.');
}
