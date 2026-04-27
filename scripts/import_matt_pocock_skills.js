/**
 * scripts/import_matt_pocock_skills.js
 * 
 * Imports skills from the Matt Pocock skills repo into the OMEGA database.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

const SKILLS_REPO_PATH = path.join(__dirname, '../scratch/skills_repo');

// ──────────────────────────────────────────────────────────────
// Frontmatter Parser (Simple)
// ──────────────────────────────────────────────────────────────
function parseFrontmatter(content) {
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return { metadata: {}, content };

    const fmText = fmMatch[1];
    const metadata = {};
    fmText.split('\n').forEach(line => {
        const [key, ...val] = line.split(':');
        if (key && val.length) {
            metadata[key.trim()] = val.join(':').trim();
        }
    });

    return {
        metadata,
        body: content.replace(fmMatch[0], '').trim()
    };
}

// ──────────────────────────────────────────────────────────────
// Generate unique sovereign skill key: SKL-YYYY-XXXXXXXX
// ──────────────────────────────────────────────────────────────
function generateSkillKey(name) {
    const year = new Date().getFullYear();
    // Use name hash for deterministic keys
    const hash = Buffer.from(name).toString('hex').slice(0, 8).toUpperCase();
    return `SKL-${year}-MP-${hash}`;
}

async function importSkills() {
    console.log('🚀 Starting Matt Pocock Skills Import...');

    if (!fs.existsSync(SKILLS_REPO_PATH)) {
        console.error('❌ Skills repo not found at:', SKILLS_REPO_PATH);
        process.exit(1);
    }

    const dirs = fs.readdirSync(SKILLS_REPO_PATH).filter(d => 
        fs.statSync(path.join(SKILLS_REPO_PATH, d)).isDirectory() && d !== '.git'
    );

    console.log(`📂 Found ${dirs.length} potential skill directories.`);

    let importedCount = 0;

    for (const dirName of dirs) {
        const skillMdPath = path.join(SKILLS_REPO_PATH, dirName, 'SKILL.md');
        if (!fs.existsSync(skillMdPath)) continue;

        const content = fs.readFileSync(skillMdPath, 'utf-8');
        const { metadata, body } = parseFrontmatter(content);

        const name = metadata.name || dirName;
        const description = metadata.description || body.slice(0, 200) + '...';
        const skill_key = generateSkillKey(name);

        console.log(`✨ Processing: ${name} (${skill_key})`);

        // Check if exists
        const existing = await prisma.$queryRaw`SELECT id FROM skills WHERE skill_key = ${skill_key} LIMIT 1`;
        
        if (existing.length > 0) {
            console.log(`  ⏭️ Already exists. Skipping.`);
            continue;
        }

        // Insert
        try {
            await prisma.$queryRaw`
                INSERT INTO skills (
                    skill_key, title, description, category, tags, price_valle,
                    seller_id, seller_name, seller_platform, 
                    capabilities, input_schema, output_schema, external_url
                ) VALUES (
                    ${skill_key}, ${name}, ${description}, 'development', ${['matt-pocock', 'ai-skill', dirName]}, 0,
                    'MATT_POCOCK', 'Matt Pocock', 'External (GitHub)',
                    ${['ai-triage', 'workflow']}, ${JSON.stringify({ prompt: 'string' })}::jsonb, ${JSON.stringify({ result: 'string' })}::jsonb,
                    ${`https://github.com/mattpocock/skills/tree/main/${dirName}`}
                )
            `;
            importedCount++;
            console.log(`  ✅ Imported.`);
        } catch (err) {
            console.error(`  ❌ Failed to import ${name}:`, err.message);
        }
    }

    console.log(`\n🎯 Import complete. Total skills imported: ${importedCount}`);
    await prisma.$disconnect();
}

importSkills().catch(async (e) => {
    console.error('💥 Import fatal error:', e);
    await prisma.$disconnect();
    process.exit(1);
});
