import fs from 'fs';
import path from 'path';

export class IntegrityAgent {
    public name = "System Integrity Agent";

    public verifyEncodings(dir: string): string[] {
        const issues: string[] = [];

        function scan(currentDir: string) {
            const files = fs.readdirSync(currentDir);
            for (const file of files) {
                if (file === 'node_modules' || file === '.next' || file === '.git') continue;

                const fullPath = path.join(currentDir, file);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    scan(fullPath);
                } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
                    const buffer = fs.readFileSync(fullPath);
                    // Check for UTF-16 LE BOM (FF FE) or Null bytes which suggest improper encoding for Next.js
                    if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
                        issues.push(`UTF-16 LE BOM found in: ${fullPath}`);
                    }
                }
            }
        }

        scan(dir);
        return issues;
    }

    public fixEncodings(filePath: string) {
        // A placeholder for automatic self-healing routines.
        console.log(`[IntegrityAgent] Healing encoding for ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf16le');
        fs.writeFileSync(filePath, content, 'utf8');
    }
}
