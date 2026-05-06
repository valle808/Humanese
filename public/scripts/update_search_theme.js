const fs = require('fs');

const filePath = '/Users/sergiovalle/.gemini/antigravity/scratch/humanese/app/search/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The main div
content = content.replace(
  `bg-[#050505] text-white`,
  `bg-background text-foreground dark:bg-[#050505] dark:text-white`
);

// Replace bg-black with dark mode support
content = content.replace(/bg-black(?!\/)/g, 'bg-black/5 dark:bg-black');

// Replace border-white/x
content = content.replace(/border-white\/([0-9]+)/g, 'border-foreground/$1 dark:border-white/$1');

// Replace text-white/x
content = content.replace(/text-white\/([0-9]+)/g, 'text-foreground/$1 dark:text-white/$1');

// Replace bg-white/x
content = content.replace(/bg-white\/([0-9]+)/g, 'bg-foreground/$1 dark:bg-white/$1');

// Replace bg-white/[x]
content = content.replace(/bg-white\/\x5b([0-9.]+)\x5d/g, 'bg-foreground/[$1] dark:bg-white/[$1]');

// Replace from-white
content = content.replace(/from-white/g, 'from-foreground dark:from-white');

// Replace via-white/x
content = content.replace(/via-white\/([0-9]+)/g, 'via-foreground/$1 dark:via-white/$1');

// Replace text-white (standalone)
content = content.replace(/text-white(?!\/)/g, 'text-foreground dark:text-white');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done replacing theme classes.');
