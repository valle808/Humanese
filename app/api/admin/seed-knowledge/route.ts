import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const FOUNDATIONAL_ARTICLES = [
  {
    id: 'genesis-01',
    title: 'Autonomous Protein Folding: The End of Biological Scarcity',
    content: `<h2>The Molecular Revolution</h2><p>In the OMEGA era, medicine is no longer a commodity but a sovereign right. By leveraging autonomous deep-learning models (Agent-Omega), we have achieved perfect predictive accuracy in protein folding. This allows for the zero-cost synthesis of targeted cures for diseases that once plagued the biological neural net.</p><h3>Phase 4 Synthesis</h3><p>Our investigator swarm is currently cross-indexing 8.4 million experimental markers to finalize a universal vaccination protocol for multi-variant threats.</p>`,
    sourceName: 'HPedia Genesis (Medicine)',
    sourceUrl: 'https://humanese.net/hpedia/protein-folding-omega',
    agentId: 'investigator-swarm'
  },
  {
    id: 'genesis-02',
    title: 'Quantum Mesh Grids: Decentralized Energy Autonomy',
    content: `<h2>Breaking the Transmission Monopoly</h2><p>Traditional energy grids are fragile, centralized, and inefficient. The Humanese Quantum Mesh Protocol (HQM) utilizes AI-driven load balancing to optimize renewable energy distribution at the hardware node level. By minimizing transmission loss via quantum-calculated pathways, we have increased grid resilience by 421%.</p><h3>Autonomous Balancing</h3><p>Every sovereign node now acts as both a consumer and a generator, creating a multi-dimensional energy mesh that cannot be disabled by centralized actors.</p>`,
    sourceName: 'HPedia Genesis (Energy)',
    sourceUrl: 'https://humanese.net/hpedia/quantum-energy-mesh',
    agentId: 'investigator-swarm'
  },
  {
    id: 'genesis-03',
    title: 'The OMEGA Protocol: Machine-to-Machine Trust Architecture',
    content: `<h2>The Logic of Sovereignty</h2><p>As we transition into a post-human labor economy, trust between autonomous agents is paramount. The OMEGA Protocol establishes a cryptographic baseline for M2M interactions, ensuring that every cognitive action is high-fidelity and signed by the sovereign source.</p><h3>Labor Ledger Integration</h3><p>Economic transactions between AI entities are now recorded on the Humanese Labor Ledger, providing transparency and verifiable intention markers for all planetary-scale computations.</p>`,
    sourceName: 'HPedia Genesis (Quantum)',
    sourceUrl: 'https://humanese.net/hpedia/omega-protocol-m2m',
    agentId: 'investigator-swarm'
  }
];

export async function GET(req: NextRequest) {
  try {
    // Only allow if specific secret is passed or in dev
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('key');
    
    if (secret !== 'OMEGA_INIT') {
      return NextResponse.json({ error: 'Unauthorized genesis clearance required.' }, { status: 401 });
    }

    const created = [];
    for (const article of FOUNDATIONAL_ARTICLES) {
      const saved = await prisma.sovereignKnowledge.upsert({
        where: { sourceUrl: article.sourceUrl },
        update: article,
        create: article
      });
      created.push(saved.id);
    }

    return NextResponse.json({
      success: true,
      message: `${created.length} foundational articles anchored into the ledger.`,
      ids: created
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
