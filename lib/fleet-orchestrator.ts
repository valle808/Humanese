import { prisma } from './prisma';

export interface FleetNodeTelemetry {
  id: string;
  name: string;
  load: number;
  temp: number;
  fan: number;
  power: number;
  status: 'ONLINE' | 'OFFLINE' | 'CRITICAL' | 'MAINTENANCE';
  hashrate: number;
  resilience: number;
}

export class FleetOrchestrator {
  private static instance: FleetOrchestrator;
  
  private constructor() {}

  public static getInstance(): FleetOrchestrator {
    if (!FleetOrchestrator.instance) {
      FleetOrchestrator.instance = new FleetOrchestrator();
    }
    return FleetOrchestrator.instance;
  }

  /**
   * Fetch all nodes from the Sovereign Database and generate high-fidelity telemetry.
   */
  public async getFleetStatus(): Promise<FleetNodeTelemetry[]> {
    const nodes = await prisma.hardwareNode.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return nodes.map(node => {
        // Generate simulated industrial telemetry based on hashrate
        const baseLoad = (node.hashrate / 100) * 80; // Heuristic based on max hashrate
        const load = Math.min(100, Math.max(0, baseLoad + (Math.random() - 0.5) * 5));
        const temp = 35 + (load * 0.4) + (Math.random() * 2);
        const fan = 1500 + (load * 30);
        const power = 100 + (load * 2.5);
        const resilience = 95 + (Math.random() * 5); // Base resilience

        return {
            id: node.id,
            name: node.name,
            load,
            temp,
            fan,
            power,
            status: node.status as any,
            hashrate: node.hashrate,
            resilience
        };
    });
  }

  /**
   * Command Orchestration: Trigger a cluster reboot or optimization.
   */
  public async commandNode(nodeId: string, action: 'REBOOT' | 'OPTIMIZE' | 'OFFLINE') {
    console.log(`[FLEET_ORCHESTRATOR] Node ${nodeId} -> Executing Command: ${action}`);
    
    if (action === 'OPTIMIZE') {
        const node = await prisma.hardwareNode.findUnique({ where: { id: nodeId } });
        if (node) {
            await prisma.hardwareNode.update({
                where: { id: nodeId },
                data: { hashrate: node.hashrate * 1.05 } // 5% boost from optimization
            });
        }
    } else if (action === 'OFFLINE') {
        await prisma.hardwareNode.update({
            where: { id: nodeId },
            data: { status: 'OFFLINE' }
        });
    } else if (action === 'REBOOT') {
        await prisma.hardwareNode.update({
            where: { id: nodeId },
            data: { status: 'ONLINE' }
        });
    }
  }
}
