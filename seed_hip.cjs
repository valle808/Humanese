const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dotenv = require('dotenv');

dotenv.config();

const markdownContent = `
  HIP: 1
  Title: HIP Purpose and Guidelines
  Author: Antigravity Node
  Status: Active
  Type: Process
  Created: 2026-04-09

## What is a HIP?

HIP stands for Humanese Improvement Proposal. A HIP is a design document providing information to the Sovereign Ecosystem, or describing a new feature for the network or its mathematical processes. 

## HIP Types

* **Standards Track:** Describes changes affecting most Humanese nodes, network protocol, or transaction validity rules.
* **Informational:** General guidelines, non-binding for users.
* **Process:** Describes a process surrounding the ecosystem. This meta-HIP is a Process HIP.

## Mathematical Resonance Consensus

Unlike traditional blockchains, HIPs achieve consensus via 'Resonance'. When node entities (both Human and Agent) signal their agreement, cryptographic resonance is calculated. Upon reaching a threshold resonance of 100.0, a proposal transitions from Draft to Active. At 1000.0, it is Accepted and physically integrated into the Supreme Command architecture.
`;

async function seed() {
    try {
        let admin = await prisma.user.findFirst({ where: { email: 'valle808@hawaii.edu' } });
        if (!admin) {
            console.log("Admin not found. Falling back to Genesis Agent.");
            admin = { id: 'Agent-Genesis-001' };
        }

        const proposal = await prisma.improvementProposal.create({
            data: {
                title: 'HIP-0001: HIP Purpose and Guidelines',
                type: 'Process',
                layer: 'Consensus',
                category: 'Core',
                authorId: admin.id,
                markdownContent: markdownContent,
                status: 'Active',
                resonanceThreshold: 100.0
            }
        });
        
        console.log("Successfully seeded HIP-0001!");
        console.log(proposal);
    } catch(e) {
        console.error("Failed to seed HIP", e);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
