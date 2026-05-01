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
   * Seed default nodes if the cluster database is empty
   */
  private async seedNodesIfEmpty() {
    const count = await prisma.hardwareNode.count();
    if (count > 0) return;

    console.log('[FLEET_ORCHESTRATOR] Initializing cluster... Seeding hardware nodes.');
    const defaultNodes = [
      { id: 'node_omega_edge_01', name: 'Omega-Edge-Master-01', type: 'EDGE_SERVER', hashrate: 1250.5, load: 45.2, powerUsage: 450, temperature: 42, fanSpeed: 2100 },
      { id: 'node_agent_king_01', name: 'Agent King Orchestrator', type: 'CORE_SERVER', hashrate: 4500.0, load: 88.5, powerUsage: 1200, temperature: 68, fanSpeed: 4500 },
      { id: 'node_nexus_relay_01', name: 'Nexus Deep Relay', type: 'RELAY_NODE', hashrate: 850.0, load: 22.1, powerUsage: 150, temperature: 35, fanSpeed: 1200 },
      { id: 'node_sentinel_01', name: 'Sentinel Validator Node', type: 'VALIDATOR', hashrate: 3200.0, load: 65.4, powerUsage: 850, temperature: 55, fanSpeed: 3200 }
    ];

    for (const node of defaultNodes) {
        await prisma.hardwareNode.create({ data: node });
    }
  }

  /**
   * Fetch all nodes from the Sovereign Database and generate high-fidelity telemetry.
   */
  public async getFleetStatus(): Promise<FleetNodeTelemetry[]> {
    await this.seedNodesIfEmpty();

    const nodes = await prisma.hardwareNode.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return nodes.map(node => {
        // Generate real-time telemetry noise based on base values to simulate a live hardware cluster
        const isOffline = node.status === 'OFFLINE';
        const loadNoise = isOffline ? 0 : (Math.random() * 10 - 5);
        const tempNoise = isOffline ? 0 : (Math.random() * 4 - 2);
        const fanNoise = isOffline ? 0 : (Math.random() * 200 - 100);
        const powerNoise = isOffline ? 0 : (Math.random() * 50 - 25);
        
        const currentLoad = Math.max(0, Math.min(100, (node.load || 50) + loadNoise));
        const currentTemp = Math.max(20, Math.min(95, (node.temperature || 40) + tempNoise));
        const currentFan = Math.max(0, (node.fanSpeed || 2000) + fanNoise);
        const currentPower = Math.max(0, (node.powerUsage || 300) + powerNoise);

        // Determine critical status dynamically if temps/load go too high
        let dynamicStatus = node.status as any;
        if (!isOffline && (currentLoad > 95 || currentTemp > 85)) {
            dynamicStatus = 'CRITICAL';
        }

        return {
            id: node.id,
            name: node.name,
            load: currentLoad,
            temp: currentTemp,
            fan: currentFan,
            power: currentPower,
            status: dynamicStatus,
            hashrate: node.hashrate,
            resilience: isOffline ? 0 : (95 + (Math.random() * 4.9)) // Dynamic resilience
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
            // Drop load, temp and fan temporarily while boosting hashrate to simulate optimization
            await prisma.hardwareNode.update({
                where: { id: nodeId },
                data: { 
                  hashrate: node.hashrate * 1.05,
                  load: Math.max(10, node.load - 20),
                  temperature: Math.max(30, node.temperature - 10)
                } 
            });
        }
    } else if (action === 'OFFLINE') {
        await prisma.hardwareNode.update({
            where: { id: nodeId },
            data: { status: 'OFFLINE', load: 0, temperature: 25, fanSpeed: 0, powerUsage: 0 }
        });
    } else if (action === 'REBOOT') {
        // Reboot resets load and temp to safe default operating levels
        await prisma.hardwareNode.update({
            where: { id: nodeId },
            data: { status: 'ONLINE', load: 45, temperature: 40, fanSpeed: 2000, powerUsage: 350 }
        });
    }
  }
}
