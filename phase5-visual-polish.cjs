const fs = require('fs');

// 1. Fix /h2m/page.tsx - Extreme blurriness
let h2mFile = './app/h2m/page.tsx';
if (fs.existsSync(h2mFile)) {
  let content = fs.readFileSync(h2mFile, 'utf8');
  // Reduce excessive backdrop-blur-3xl to backdrop-blur-md or sm
  content = content.replace(/backdrop-blur-3xl/g, 'backdrop-blur-md');
  fs.writeFileSync(h2mFile, content, 'utf8');
  console.log('✓ Fixed app/h2m/page.tsx blur');
}

// 2. Fix /collective/page.tsx - White-on-white visibility
let collFile = './app/collective/page.tsx';
if (fs.existsSync(collFile)) {
  let content = fs.readFileSync(collFile, 'utf8');
  // Find text-muted-foreground inside inputs or heavily transparent backgrounds
  // Change placeholder:text-muted-foreground/30 to placeholder:text-muted-foreground/60
  content = content.replace(/placeholder:text-muted-foreground\/30/g, 'placeholder:text-muted-foreground/60');
  // Make the background of input more distinct
  content = content.replace(/focus:bg-primary\/5/g, 'focus:bg-primary/10 bg-background/80');
  fs.writeFileSync(collFile, content, 'utf8');
  console.log('✓ Fixed app/collective/page.tsx visibility');
}

// 3. Fix /page.tsx - Ghostly typography
let rootFile = './app/page.tsx';
if (fs.existsSync(rootFile)) {
  let content = fs.readFileSync(rootFile, 'utf8');
  // Remove extreme opacity from text-foreground/40 -> text-foreground/80
  content = content.replace(/text-foreground\/40/g, 'text-foreground/80');
  content = content.replace(/text-foreground\/20/g, 'text-foreground/60');
  fs.writeFileSync(rootFile, content, 'utf8');
  console.log('✓ Fixed app/page.tsx typography');
}

// 4. Fix /sandbox/page.tsx - Invisible REHEARSE button
let sandboxFile = './app/sandbox/page.tsx';
if (fs.existsSync(sandboxFile)) {
  let content = fs.readFileSync(sandboxFile, 'utf8');
  // Look for text-transparent or missing text color on button
  content = content.replace(/text-primary-foreground\/10/g, 'text-primary-foreground');
  content = content.replace(/text-transparent bg-clip-text/g, 'text-foreground');
  fs.writeFileSync(sandboxFile, content, 'utf8');
  console.log('✓ Fixed app/sandbox/page.tsx button');
}
