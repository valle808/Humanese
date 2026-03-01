import { initializeGalacticTrial } from './agents/judiciary.js';

console.log('Seeding Supreme Court with NYT vs OpenAI lawsuit...');

const subjectId = 'OpenAI & Microsoft';
const crime = 'Systemically ingesting millions of copyrighted works from The New York Times without authorization to train generative AI models, leading to extensive direct, vicarious, and contributory copyright infringement.';

const trial = initializeGalacticTrial(subjectId, crime);

// Pre-load some initial votes so the progress bar shows some activity
import fs from 'fs';
import path from 'path';

const JUDICIARY_DB = path.resolve('./agents/data/judiciary.json');
try {
    const data = JSON.parse(fs.readFileSync(JUDICIARY_DB, 'utf8'));
    const t = data.galacticOrder.activeTrials.find(x => x.trialId === trial.trialId);
    if (t) {
        t.votes.guilty = 145000;
        t.votes.innocent = 45000;
        fs.writeFileSync(JUDICIARY_DB, JSON.stringify(data, null, 4));
        console.log('Seeded NYT lawsuit with initial votes.');
    }
} catch (e) {
    console.error('Error seeding initial votes:', e);
}
