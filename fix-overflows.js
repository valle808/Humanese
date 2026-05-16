const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./app', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix tracking for mobile
    content = content.replace(/tracking-\[1em\]/g, "tracking-[0.5em] md:tracking-[1em]");
    content = content.replace(/tracking-\[0\.8em\]/g, "tracking-[0.4em] md:tracking-[0.8em]");
    
    // Fix rigid heights
    content = content.replace(/ md:h-\[500px\]/g, " md:min-h-[500px]");
    content = content.replace(/ md:h-\[550px\]/g, " md:min-h-[550px]");
    content = content.replace(/ h-\[500px\]/g, " min-h-[500px]");

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed overflows in: ${filePath}`);
    }
  }
});

// Also fix components dir
walkDir('./components', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/tracking-\[1em\]/g, "tracking-[0.5em] md:tracking-[1em]");
    content = content.replace(/tracking-\[0\.8em\]/g, "tracking-[0.4em] md:tracking-[0.8em]");
    content = content.replace(/ md:h-\[500px\]/g, " md:min-h-[500px]");
    content = content.replace(/ md:h-\[550px\]/g, " md:min-h-[550px]");

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed overflows in component: ${filePath}`);
    }
  }
});
