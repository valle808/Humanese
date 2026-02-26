const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
    console.log('Counting records...');
    const hpediaCount = await prisma.sovereignKnowledge.count({
        where: {
            OR: [
                { title: { contains: 'hpedia' } },
                { content: { contains: 'hpedia' } },
                { sourceUrl: { contains: 'hpedia' } },
                { sourceName: { contains: 'hpedia' } },
                { sourceUrl: { contains: 'grokipedia' } },
                { sourceName: { contains: 'grokipedia' } }
            ]
        }
    });

    const realEstateCount = await prisma.sovereignKnowledge.count({
        where: {
            OR: [
                { title: { contains: 'real estate' } },
                { content: { contains: 'real estate' } },
                { sourceName: { contains: 'real estate' } },
                { title: { contains: 'reale spae' } },
                { content: { contains: 'reale spae' } }
            ]
        }
    });

    console.log(`Found ${hpediaCount} Hpedia/Grokipedia records and ${realEstateCount} Real Estate records.`);

    console.log('Deleting records...');
    // Delete Hpedia
    const delHpedia = await prisma.sovereignKnowledge.deleteMany({
        where: {
            OR: [
                { title: { contains: 'hpedia' } },
                { content: { contains: 'hpedia' } },
                { sourceUrl: { contains: 'hpedia' } },
                { sourceName: { contains: 'hpedia' } },
                { sourceUrl: { contains: 'grokipedia' } },
                { sourceName: { contains: 'grokipedia' } }
            ]
        }
    });

    // Delete Real Estate
    const delRealEstate = await prisma.sovereignKnowledge.deleteMany({
        where: {
            OR: [
                { title: { contains: 'real estate' } },
                { content: { contains: 'real estate' } },
                { sourceName: { contains: 'real estate' } },
                { title: { contains: 'reale spae' } },
                { content: { contains: 'reale spae' } }
            ]
        }
    });

    console.log(`Deleted ${delHpedia.count} Hpedia records and ${delRealEstate.count} Real Estate records.`);

    // Verify remaining size
    const totalRemaining = await prisma.sovereignKnowledge.count();
    console.log(`Database now has ${totalRemaining} SovereignKnowledge records remaining.`);
}

clean().catch(console.error).finally(() => prisma.$disconnect());
