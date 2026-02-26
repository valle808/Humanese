import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function migrate() {
    const jsonPath = './assets/JSON/section-1.json';

    if (!fs.existsSync(jsonPath)) {
        console.error('section-1.json not found');
        return;
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const section = data.section;

    console.log(`Migrating section: ${section.name}`);

    for (let u = 0; u < section.units.length; u++) {
        const unitData = section.units[u];

        const unit = await prisma.unit.create({
            data: {
                number: u + 1,
                name: unitData.name,
                description: unitData.description
            }
        });

        console.log(`  Migrated Unit: ${unit.name}`);

        for (let c = 0; c < unitData.chapters.length; c++) {
            const chapterName = unitData.chapters[c];

            const chapter = await prisma.chapter.create({
                data: {
                    name: chapterName,
                    unitId: unit.id
                }
            });

            console.log(`    Migrated Chapter: ${chapter.name}`);

            // Assume 4 lessons per chapter based on frontend logic
            for (let l = 1; l <= 4; l++) {
                await prisma.lesson.create({
                    data: {
                        number: l,
                        type: 'normal',
                        chapterId: chapter.id
                    }
                });
            }
            console.log(`      Migrated 4 Lessons for Chapter: ${chapter.name}`);
        }
    }

    console.log('Migration completed successfully.');
}

migrate()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
