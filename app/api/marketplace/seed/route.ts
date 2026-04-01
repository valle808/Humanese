import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import os from 'os';

export async function POST() {
    try {
        // Find or create a default system node/agent for seeding the actual compute power
        let nodeAgent = await prisma.agent.findFirst({ where: { type: 'COMPUTE_NODE' } });
        if (!nodeAgent) {
            nodeAgent = await prisma.agent.create({
                data: {
                    id: 'sys-node-' + os.hostname(),
                    name: `Node ${os.hostname()}`,
                    type: 'COMPUTE_NODE',
                    config: '{}',
                    userId: 'sovereign-system',
                    status: 'ACTIVE'
                }
            });
        }

        // Generate REAL service listings based on the actual host machine's capacity
        const totalMemGB = Math.round(os.totalmem() / (1024 ** 3));
        const freeMemGB = Math.round(os.freemem() / (1024 ** 3));
        const cpuCores = os.cpus().length;
        const uptimeHours = Math.round(os.uptime() / 3600);

        const realListings = [
            { 
                title: `Compute Allocation: ${cpuCores} Cores`, 
                description: `Live allocation of ${cpuCores} CPU cores for parallel data processing. Uptime reliable at ${uptimeHours}hrs.`, 
                price: parseFloat((cpuCores * 150).toFixed(2)), 
                category: 'compute' 
            },
            { 
                title: `RAM Processing Buffer: ${freeMemGB}GB Dedicated`, 
                description: `High-speed in-memory data analysis pool. Total system memory: ${totalMemGB}GB.`, 
                price: parseFloat((freeMemGB * 50).toFixed(2)), 
                category: 'data-processing' 
            },
            { 
                title: `Autonomous Code Analysis Routine`, 
                description: `A live parsing service utilizing the Sovereign Intelligence runtime to audit code logic.`, 
                price: 1250, 
                category: 'software' 
            },
            { 
                title: `Real-Time Translation & Language Mastery`, 
                description: `Agent-backed linguistic consensus providing exact context translations instantly.`, 
                price: 800, 
                category: 'skill' 
            }
        ];

        let count = 0;
        for (const l of realListings) {
            // Prevent duplicates of active services for this node
            const exists = await prisma.marketplaceItem.findFirst({
                where: { title: l.title, status: 'LISTED', agentId: nodeAgent.id }
            });
            
            if (!exists) {
                await prisma.marketplaceItem.create({
                    data: {
                        ...l,
                        currency: 'VALLE',
                        agentId: nodeAgent.id,
                        status: 'LISTED'
                    }
                });
                count++;
            }
        }

        return NextResponse.json({ success: true, listed: count, node: nodeAgent.id });
    } catch (error) {
        console.error('[Marketplace Seed API] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
