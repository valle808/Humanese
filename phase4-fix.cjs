const fs = require('fs');

// 1. Fix AidPortal.tsx (Button tracking and missing onClick)
let aidFile = './components/AidPortal.tsx';
let aidContent = fs.readFileSync(aidFile, 'utf8');

// Change tracking from [0.6em] to widest and add md:tracking-[0.4em], and add onClick
aidContent = aidContent.replace(
  '<Button \n                        disabled={isSubmitting}\n                        className="w-full h-20 bg-primary text-primary-foreground font-black uppercase tracking-[0.6em] rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 text-sm md:text-lg flex items-center justify-center gap-6"\n                    >',
  '<Button \n                        disabled={isSubmitting}\n                        onClick={handleSubmit}\n                        type="submit"\n                        className="w-full h-20 bg-primary text-primary-foreground font-black uppercase tracking-widest md:tracking-[0.3em] rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 text-sm md:text-lg flex items-center justify-center gap-6"\n                    >'
);

// Also change the text just in case from "ENGAGE_INVESTIGATORS" to "ENGAGE INVESTIGATORS"
aidContent = aidContent.replace('"ENGAGE_INVESTIGATORS"', '"ENGAGE INVESTIGATORS"');

fs.writeFileSync(aidFile, aidContent, 'utf8');
console.log('✓ Fixed components/AidPortal.tsx');

// 2. Fix Collective page ideology tags overflowing on the right
let collectiveFile = './app/collective/page.tsx';
let collectiveContent = fs.readFileSync(collectiveFile, 'utf8');

// Fix: Add flex-wrap or min-w-0 / truncate
collectiveContent = collectiveContent.replace(
  '<span className="text-sm font-black text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-[0.4em] italic leading-none">{tag}</span>',
  '<span className="text-sm font-black text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest md:tracking-[0.4em] italic leading-none truncate min-w-0 pr-2">{tag}</span>'
);

fs.writeFileSync(collectiveFile, collectiveContent, 'utf8');
console.log('✓ Fixed app/collective/page.tsx');

// 3. Fix Donate page (prevent tracking overflow)
let donateFile = './app/donate/page.tsx';
if (fs.existsSync(donateFile)) {
  let donateContent = fs.readFileSync(donateFile, 'utf8');
  donateContent = donateContent.replace('tracking-[0.4em] md:tracking-[0.8em]', 'tracking-widest md:tracking-[0.4em]');
  fs.writeFileSync(donateFile, donateContent, 'utf8');
  console.log('✓ Fixed app/donate/page.tsx');
}
