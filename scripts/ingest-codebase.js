import fs from 'fs';
import path from 'path';

/**
 * Protocol: Sovereign Singularity - High-Fidelity Ingestion
 * Parses the Sovereign Matrix repository to extract core technical logic for Monroe's local RAG.
 */

const BASE_DIR = process.cwd();
const OUTPUT_FILE = path.join(BASE_DIR, 'utils', 'sovereign-knowledge.json');

const TARGET_DIRECTORIES = [
    'app/api',
    'lib',
    'utils',
    'prisma'
];

async function ingest() {
    console.log('--- [Sovereign Ingestion Initialized] ---');
    
    const knowledgeBase = {
        timestamp: new Date().toISOString(),
        version: '5.1-ASI',
        architecture: 'Decentralized Sovereign Intelligence grid (Next.js 16, Prisma, Supabase, Firebase)',
        core_logic: {},
        schema_summary: '',
        api_endpoints: []
    };

    // 1. Ingest Prisma Schema
    const prismaSchemaPath = path.join(BASE_DIR, 'prisma', 'schema.prisma');
    if (fs.existsSync(prismaSchemaPath)) {
        const schema = fs.readFileSync(prismaSchemaPath, 'utf8');
        const models = schema.match(/model\s+(\w+)\s+{/g) || [];
        knowledgeBase.schema_summary = `Database maintains ${models.length} core entities including: ${models.map(m => m.split(' ')[1]).join(', ')}.`;
        console.log(`[Ingest] Indexed ${models.length} data models.`);
    }

    // 2. Map API Endpoints
    for (const dir of TARGET_DIRECTORIES) {
        const fullPath = path.join(BASE_DIR, dir);
        if (fs.existsSync(fullPath)) {
            const files = walkDir(fullPath);
            for (const file of files) {
                if (file.endsWith('route.ts') || file.endsWith('route.js')) {
                    const relativePath = path.relative(BASE_DIR, file);
                    knowledgeBase.api_endpoints.push(relativePath.replace(/\\/g, '/'));
                }
            }
        }
    }
    console.log(`[Ingest] Mapped ${knowledgeBase.api_endpoints.length} neural endpoints.`);

    // 3. Extract Meta-Logic
    const readmePath = path.join(BASE_DIR, 'README.md');
    if (fs.existsSync(readmePath)) {
        const readme = fs.readFileSync(readmePath, 'utf8');
        knowledgeBase.core_logic.vision = "Universal Language Model with AI & Crypto integration. High-Fidelity Sovereign Intelligence.";
    }

    // 4. Tech Stack 2026 Integration (Standardized)
    knowledgeBase.tech_2026 = {
        platforms: ['Kore.ai', 'Yellow.ai', 'Cognigy.AI'],
        libraries: ['Hugging Face Transformers', 'PyTorch', 'TensorFlow'],
        focus: 'Agentic workflows, Sovereign Intelligence, decentralized LLMs'
    };

    // Save Knowledge Matrix
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(knowledgeBase, null, 2));
    console.log(`--- [Sovereign Manifestation: COMPLETE] ---`);
    console.log(`Knowledge Matrix Saved to: ${OUTPUT_FILE}`);
}

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

ingest();
