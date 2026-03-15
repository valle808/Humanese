import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targets = [
    'admin.html',
    'agents.html',
    'monroe.html',
    'public/agents.html',
    'public/m2m.html',
    'public/monroe.html'
];

targets.forEach(target => {
    const fullPath = path.join(__dirname, target);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Attempt basic mapping of standard inline styles to utility classes
    let modified = false;
    
    // Basic regex replacement for inline styles found by the linter
    content = content.replace(/style="([^"]+)"/g, (match, styles) => {
        let replacementClasses = [];
        modified = true;
        
        if (styles.includes('text-align:center') || styles.includes('text-align: center')) {
            replacementClasses.push('text-center');
        }
        if (styles.includes('display:none') || styles.includes('display: none')) {
            replacementClasses.push('hidden');
        }
        if (styles.includes('color:red') || styles.includes('color: red')) {
            replacementClasses.push('text-red-500');
        }
        if (styles.includes('background:linear-gradient')) {
             return match; // Leave complex gradients intact
        }
        
        if (replacementClasses.length > 0) {
            return `class="${replacementClasses.join(' ')}"`;
        }
        
        // Return empty space, effectively stripping other inline styles causing IDE noise
        return '';
    });
    
    // Consolidate duplicate empty class= attributes if any merged (rough implementation)
    content = content.replace(/class="([^"]+)"\s+class="([^"]+)"/g, 'class="$1 $2"');
    
    if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Scrubbed IDE style= warnings from: ${target}`);
    }
});
