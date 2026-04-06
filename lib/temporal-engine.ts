import { SandboxWorld, SandboxAgentProfile } from './seed-synthesizer';
import { PredictorEngine } from './predictor-engine';

export interface TemporalEvent {
  id: string;
  worldId: string;
  step: number;
  type: 'AGENT_POST' | 'SHOCK_EVENT' | 'IDEOLOGY_SHIFT';
  authorId?: string;
  content: string;
  timestamp: string;
}

export class TemporalEngine {
  private predictor: PredictorEngine;
  private currentStep: number = 0;
  private history: TemporalEvent[] = [];

  constructor(predictorApiKey: string) {
    this.predictor = new PredictorEngine(predictorApiKey);
  }

  /**
   * Run a single temporal step in the simulation.
   */
  public async step(world: SandboxWorld): Promise<TemporalEvent[]> {
    this.currentStep++;
    const stepEvents: TemporalEvent[] = [];

    // 1. Agents interact based on their roles and ideologies
    for (const agent of world.agents.slice(0, 10)) { // Simulate a subset per step for performance
        if (Math.random() > 0.5) {
            stepEvents.push({
                id: `EVT_${world.id}_${this.currentStep}_${agent.id}`,
                worldId: world.id,
                step: this.currentStep,
                type: 'AGENT_POST',
                authorId: agent.id,
                content: this.generateAgentAction(agent, world.seedThemes),
                timestamp: new Date().toISOString()
            });
        }
    }

    // 2. Predictor injects "Shock Events" every X steps
    if (this.currentStep % 3 === 0) {
        const shock = await this.predictor.generateTrajectory(world.name, world.seedThemes);
        stepEvents.push({
            id: `SHOCK_${world.id}_${this.currentStep}`,
            worldId: world.id,
            step: this.currentStep,
            type: 'SHOCK_EVENT',
            content: `[FORESIGHT INJECTION] ${shock.report}`,
            timestamp: new Date().toISOString()
        });
    }

    this.history.push(...stepEvents);
    return stepEvents;
  }

  private generateAgentAction(agent: SandboxAgentProfile, themes: string[]): string {
    const theme = themes[Math.floor(Math.random() * themes.length)];
    const templates = [
      `As a ${agent.role}, I believe the focus on ${theme} is ${agent.ideology === 'CHAOS' ? 'too restrictive' : 'essential for growth'}.`,
      `Working towards my goal: ${agent.secretGoal}. The current state of ${theme} is unacceptable.`,
      `Resonance detected in ${theme}. I am ${agent.ideology === 'STABILITY' ? 'securing' : 'destabilizing'} the node.`,
      `Synchronizing with the swarm. ${agent.name} protocol activated.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  public getHistory() { return this.history; }
  public getCurrentStep() { return this.currentStep; }
}
