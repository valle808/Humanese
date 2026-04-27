/**
 * scripts/generate_sovereign_skills.js
 * 
 * Transforms Matt Pocock skills into Sovereign Native skills with 5 tiers each.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

const SKILLS_REPO_PATH = path.join(__dirname, '../scratch/skills_repo');

const TIERS = [
    { suffix: 'Core', price: 0, level: 'Essential' },
    { suffix: 'Advanced', price: 100, level: 'Enhanced Reasoning' },
    { suffix: 'Quantum', price: 500, level: 'Optimized Speed' },
    { suffix: 'Elite', price: 1000, level: 'High-Authority' },
    { suffix: 'Sovereign', price: 5000, level: 'Autonomous Agency' }
];

function parseFrontmatter(content) {
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return { metadata: {}, body: content };

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

import crypto from 'crypto';

function generateSkillKey(name, tier) {
    const year = new Date().getFullYear();
    const hash = crypto.createHash('md5').update(name + tier).digest('hex').slice(0, 12).toUpperCase();
    return `SKL-${year}-SOV-${hash}`;
}

async function transformSkills() {
    console.log('🔱 Starting Sovereign Skill Transformation...');

    // 1. Delete old skills
    console.log('🗑️  Deleting old skills...');
    await prisma.$queryRaw`DELETE FROM skills WHERE seller_id = 'MATT_POCOCK'`;
    await prisma.$queryRaw`DELETE FROM skills WHERE seller_id = 'MONROE_NATIVE'`;

    if (!fs.existsSync(SKILLS_REPO_PATH)) {
        console.error('❌ Base skills repo not found.');
        process.exit(1);
    }

    const dirs = fs.readdirSync(SKILLS_REPO_PATH).filter(d => 
        fs.statSync(path.join(SKILLS_REPO_PATH, d)).isDirectory() && d !== '.git'
    );

    console.log(`📂 Found ${dirs.length} base skill templates.`);

    let importedCount = 0;

    for (const dirName of dirs) {
        const skillMdPath = path.join(SKILLS_REPO_PATH, dirName, 'SKILL.md');
        if (!fs.existsSync(skillMdPath)) continue;

        const content = fs.readFileSync(skillMdPath, 'utf-8');
        const { metadata, body } = parseFrontmatter(content);

        const baseName = metadata.name || dirName;
        const cleanDescription = (metadata.description || body.slice(0, 200))
            .replace(/Matt Pocock/gi, 'Monroe Core')
            .replace(/Claude Code/gi, 'Monroe Swarm');

        for (const tier of TIERS) {
            const name = `${baseName.toUpperCase()} [${tier.suffix}]`;
            const description = `[${tier.level}] ${cleanDescription}`;
            const skill_key = generateSkillKey(baseName, tier.suffix);

            console.log(`✨ Generating: ${name} (${skill_key})`);

            try {
                await prisma.$queryRaw`
                    INSERT INTO skills (
                        skill_key, title, description, category, tags, price_valle,
                        seller_id, seller_name, seller_platform, 
                        capabilities, input_schema, output_schema, is_active
                    ) VALUES (
                        ${skill_key}, ${name}, ${description}, 'intelligence', ${['sovereign', 'monroe-native', tier.suffix.toLowerCase(), baseName]}, ${tier.price},
                        'MONROE_NATIVE', 'Sovereign Matrix', 'Native OMEGA',
                        ${['sovereign-intelligence', tier.level]}, ${JSON.stringify({ prompt: 'string' })}::jsonb, ${JSON.stringify({ result: 'string' })}::jsonb,
                        true
                    )
                `;
                importedCount++;
            } catch (err) {
                console.error(`  ❌ Failed to generate ${name}:`, err.message);
            }
        }
    }

    console.log(`\n🎯 Transformation complete. Total sovereign skills generated: ${importedCount}`);
    await prisma.$disconnect();
}

transformSkills().catch(async (e) => {
    console.error('💥 Transformation fatal error:', e);
    await prisma.$disconnect();
    process.exit(1);
});
