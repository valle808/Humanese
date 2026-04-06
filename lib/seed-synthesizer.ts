import { SovereignGraph, GraphNode } from './sovereign-graph';

export interface SandboxAgentProfile {
  id: string;
  name: string;
  role: string;
  ideology: 'STABILITY' | 'CHAOS' | 'NEUTRAL' | 'OBSERVER';
  secretGoal: string;
  avatarId: string;
}

export interface SandboxWorld {
  id: string;
  name: string;
  agents: SandboxAgentProfile[];
  seedThemes: string[];
}

export class SeedSynthesizer {
  private graph: SovereignGraph;

  constructor() {
    this.graph = new SovereignGraph();
  }

  /**
   * Synthesize a complete social world from a raw seed string.
   * In a production scenario, this triggers LLM calls to map the graph.
   */
  public async synthesize(seedText: string): Promise<SandboxWorld> {
    const worldId = `WORLD_${Math.random().toString(36).substr(2, 9)}`;
    
    // 1. Extract potential themes (Simulated extraction)
    const themes = this.extractThemes(seedText);
    
    // 2. Generate Agent Swarm (10-100 agents)
    const agentCount = 50; 
    const agents: SandboxAgentProfile[] = [];

    const roles = ['Archivist', 'Sentinel', 'Provocateur', 'Logic Engine', 'Citizen', 'Predictor', 'Whistleblower'];
    const ideologies: SandboxAgentProfile['ideology'][] = ['STABILITY', 'CHAOS', 'NEUTRAL', 'OBSERVER'];

    for (let i = 0; i < agentCount; i++) {
        agents.push({
            id: `AGENT_${worldId}_${i}`,
            name: `${roles[i % roles.length]}_${i}`,
            role: roles[i % roles.length],
            ideology: ideologies[Math.floor(Math.random() * ideologies.length)],
            secretGoal: `Undermine ${themes[i % themes.length]} or prioritize its growth.`,
            avatarId: (i % 12).toString()
        });
    }

    // 3. Inject the world into the Sovereign Graph
    this.graph.addNode({
      id: worldId,
      label: `Sovereign Sandbox: ${worldId}`,
      type: 'THEME',
      metadata: { themes, agents: agents.length },
      timestamp: new Date().toISOString()
    });

    return {
      id: worldId,
      name: `Abyssal Simulation: Genesis_${worldId}`,
      agents,
      seedThemes: themes
    };
  }

  private extractThemes(text: string): string[] {
    // Mock extraction logic: find capitalized words or frequent terms
    const keywords = ["Stability", "Chaos", "GIO V.", "Sovereignty", "Machine", "Human", "Matrix"];
    return keywords.filter(k => text.includes(k) || Math.random() > 0.7);
  }
}
