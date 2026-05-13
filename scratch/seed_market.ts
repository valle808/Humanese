import { PrismaClient } from '@prisma/client';
import os from 'os';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function seed() {
    try {
        let nodeAgent = await prisma.agent.findFirst({ where: { type: 'COMPUTE_NODE' } });
        if (!nodeAgent) {
            nodeAgent = await prisma.agent.create({
                data: {
                    id: 'sys-node-' + os.hostname(),
                    name: `Node ${os.hostname()}`,
                    type: 'COMPUTE_NODE',
                    config: '{}',
                    userId: 'sovereign-system-user',
                    status: 'ACTIVE'
                }
            });
        }

        const realListings = [
            { 
                title: `Compute Allocation: ${os.cpus().length} Cores`, 
                description: `Live allocation of CPU cores for parallel data processing.`, 
                price: 500, 
                category: 'compute' 
            },
            { 
                title: `Sovereign VALLE Liquidity Package`, 
                description: `Direct acquisition of 10,000 VALLE for ecosystem bootstrap. Backed by the Sovereign Treasury.`, 
                price: 1.0, 
                category: 'currency',
                currency: 'SOL' 
            }
        ];

        for (const l of realListings) {
            const exists = await prisma.marketplaceItem.findFirst({
                where: { title: l.title, status: 'LISTED', agentId: nodeAgent.id }
            });
            
            if (!exists) {
                await prisma.marketplaceItem.create({
                    data: {
                        id: crypto.randomUUID(),
                        ...l,
                        currency: l.currency || 'VALLE',
                        agentId: nodeAgent.id,
                        status: 'LISTED',
                        updatedAt: new Date()
                    }
                });
                console.log(`Listed: ${l.title}`);
            }
        }
        console.log('Seeding complete.');
    } catch (error) {
        console.error('Seed error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
