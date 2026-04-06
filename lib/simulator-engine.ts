import { OpenAI } from 'openai';

export type AgentStatus = 'SYNCING' | 'RESONATING' | 'CONFLICT' | 'STABLIZING' | 'IDLE';

export interface SovereignAgent {
  id: string;
  name: string;
  objective: string;
  thoughtStream: string[];
  status: AgentStatus;
  group: number;
  connections: string[];
  coordinates: { x: number; y: number; z: number };
}

export interface SimulationState {
  agents: SovereignAgent[];
  events: string[];
}

export class SimulatorEngine {
  private openai: OpenAI;
  private state: SimulationState;

  constructor(apiKey: string, baseURL: string = 'https://openrouter.ai/api/v1') {
    this.openai = new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: true });
    this.state = {
      agents: [],
      events: []
    };
  }

  // Generate initial agent swarm (simulated scale)
  public async initializeSwarm(count: number = 30) {
    const roles = ['Researcher', 'Sentinel', 'Synthesizer', 'Architect', 'Diplomat'];
    this.state.agents = Array.from({ length: count }).map((_, i) => ({
      id: `Agent_${i}`,
      name: `${roles[i % roles.length]} ${i}`,
      objective: `Stabilize neural shard ${i}`,
      thoughtStream: ['Neural matrix initialized.'],
      status: 'IDLE',
      group: i % 5,
      connections: [],
      coordinates: { 
        x: (Math.random() - 0.5) * 500, 
        y: (Math.random() - 0.5) * 500, 
        z: (Math.random() - 0.5) * 500 
      }
    }));
    
    // Connect them randomly to form a mesh
    this.state.agents.forEach(agent => {
      const targetCount = Math.floor(Math.random() * 3) + 1;
      for(let j=0; j<targetCount; j++) {
        const target = this.state.agents[Math.floor(Math.random() * count)].id;
        if(target !== agent.id && !agent.connections.includes(target)) {
          agent.connections.push(target);
        }
      }
    });

    return this.state;
  }

  // Oasis-inspired "Neural Injection" (Process a user thought through the mesh)
  public async injectNeuralThought(prompt: string) {
    this.state.events.unshift(`[INJECTION]: ${prompt}`);
    
    // Pick the most relevant agent to "process" the thought
    const primaryAgent = this.state.agents[Math.floor(Math.random() * this.state.agents.length)];
    primaryAgent.status = 'RESONATING';
    primaryAgent.thoughtStream.push(`Processing external surge: "${prompt}"`);

    // In a real scenario, we'd call LLM here to generate the agent's unique reaction
    // For the poc scale, we simulate the "ripple effect" through connections
    for (const connectionId of primaryAgent.connections) {
      const target = this.state.agents.find(a => a.id === connectionId);
      if (target) {
        target.status = 'SYNCING';
        target.thoughtStream.push(`Syncing with ${primaryAgent.name}...`);
      }
    }

    return { ...this.state };
  }

  public getState() {
    return this.state;
  }
}
