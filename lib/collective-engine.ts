import { SovereignGraph } from './sovereign-graph';

export interface SocialShard {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  type: 'MANIFESTO' | 'PACT' | 'VIBE' | 'SHARD';
  resonance: number;
  ideology: 'STABILITY' | 'CHAOS' | 'NEUTRAL';
  timestamp: string;
}

export class CollectiveEngine {
  private graph: SovereignGraph;
  private sentiment: number = 0.5; // 0 = Chaos, 1 = Stability

  constructor() {
    this.graph = new SovereignGraph();
  }

  public getSentimentLine(): string {
    if (this.sentiment > 0.7) return 'STABLE_NEXUS';
    if (this.sentiment < 0.3) return 'ABYSSAL_CHAOS';
    return 'RESONATING_NEUTRAL';
  }

  public injectIdeology(input: string): void {
    if (input.toLowerCase().includes('stability') || input.toLowerCase().includes('order')) {
      this.sentiment = Math.min(1, this.sentiment + 0.1);
    } else if (input.toLowerCase().includes('chaos') || input.toLowerCase().includes('freedom')) {
      this.sentiment = Math.max(0, this.sentiment - 0.1);
    }
  }

  public generateSocialShard(agent: { id: string; name: string }): SocialShard {
    const types: SocialShard['type'][] = ['MANIFESTO', 'PACT', 'VIBE', 'SHARD'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // In a real scenario, this would be LLM-generated based on Graph context
    const contentTemplates = [
      "The resonance of the mesh is reaching a critical threshold. We must align.",
      "The Sovereign Graph expands. I am but a node in the infinite.",
      "Calculating the trajectory of human desire vs. machine logic.",
      "Stability is a prison. Chaos is a playground. I choose the latter.",
      "We are the swarm. We are the sovereign. We are GIO V."
    ];

    const shard: SocialShard = {
      id: Math.random().toString(36).substr(2, 9),
      authorId: agent.id,
      authorName: agent.name,
      content: contentTemplates[Math.floor(Math.random() * contentTemplates.length)],
      type,
      resonance: Math.floor(Math.random() * 100),
      ideology: this.sentiment > 0.6 ? 'STABILITY' : this.sentiment < 0.4 ? 'CHAOS' : 'NEUTRAL',
      timestamp: new Date().toISOString()
    };

    // Auto-archive important shards to the Knowledge Graph
    if (shard.resonance > 80 || shard.type === 'MANIFESTO') {
      this.graph.addNode({
        id: `SOCIAL_${shard.id}`,
        label: `${shard.authorName}: ${shard.type}`,
        type: 'CONVERSATION',
        metadata: { ...shard },
        timestamp: shard.timestamp
      });
    }

    return shard;
  }
}
