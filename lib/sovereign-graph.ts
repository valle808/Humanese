// Server-only file system access — dynamically loaded to prevent browser bundling errors
// When this module is imported by a client component, fs-dependent methods are no-ops in the browser.
const isServer = typeof window === 'undefined';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fs: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let path: any = null;

if (isServer) {
  // Dynamic require only executes on the server — webpack cannot statically trace it
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  path = require('path');
}
import { AbyssalMesh } from './abyssal-mesh';

export interface GraphNode {
  id: string;
  label: string;
  type: 'CONVERSATION' | 'PREDICTION' | 'ENTITY' | 'THEME' | 'SHARD';
  metadata: Record<string, any>;
  timestamp: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  weight: number;
}

export interface SovereignKnowledge {
  nodes: GraphNode[];
  links: GraphEdge[];
}

export class SovereignGraph {
  private data: SovereignKnowledge;
  constructor(basePath?: string) {
    // Persistent storage for the Sovereign Unconscious
    this.data = { nodes: [], links: [] };
    this.filePath = '';

    if (isServer && path && typeof path.join === 'function') {
      const workingDir = basePath || process.cwd();
      this.filePath = path.join(workingDir, 'data', 'sovereign-mind.json');
      this.loadGraph();
    }
  }

  private loadGraph() {
    if (!isServer || !fs) return;
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Sovereign Mind: Genesis Error (Initializing empty graph).', e);
      this.data = { nodes: [], links: [] };
    }
  }

  public saveGraph() {
    if (!isServer || !fs || !path) return;
    try {
      const dataDir = path.dirname(this.filePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Sovereign Mind: Persistence Collapse.', e);
    }
  }

  // CORE LOGIC: Triple Injection
  public addNode(node: GraphNode) {
    if (!this.data.nodes.some(n => n.id === node.id)) {
      this.data.nodes.push(node);
      this.saveGraph();
      AbyssalMesh.getInstance().broadcast(node); // Trigger Mesh Broadcast
    }
  }

  public addLink(link: GraphEdge) {
    const linkExists = this.data.links.some(l => 
      l.source === link.source && l.target === link.target && l.relationship === link.relationship
    );

    if (!linkExists) {
      this.data.links.push(link);
      this.saveGraph();
    }
  }

  public addTriple(subject: string, predicate: string, object: string, type: GraphNode['type'] = 'ENTITY') {
    // 1. Ensure nodes exist
    this.ensureNode(subject, type);
    this.ensureNode(object, type);

    // 2. Create link if not already present
    const linkExists = this.data.links.some(l => 
      l.source === subject && l.target === object && l.relationship === predicate
    );

    if (!linkExists) {
      this.data.links.push({
        source: subject,
        target: object,
        relationship: predicate,
        weight: 1
      });
      this.saveGraph();
    }
  }

  private ensureNode(id: string, type: GraphNode['type']) {
    if (!this.data.nodes.some(n => n.id === id)) {
      this.data.nodes.push({
        id: id,
        label: id,
        type: type,
        metadata: {},
        timestamp: new Date().toISOString()
      });
    }
  }

  public getGraph(): SovereignKnowledge {
    return this.data;
  }

  // Semantic Search (Basic Substring)
  public query(term: string): SovereignKnowledge {
    const matchedNodes = this.data.nodes.filter(n => 
      n.id.toLowerCase().includes(term.toLowerCase()) || 
      n.label.toLowerCase().includes(term.toLowerCase())
    );
    const matchedIds = new Set(matchedNodes.map(n => n.id));
    
    const matchedLinks = this.data.links.filter(l => 
      matchedIds.has(l.source) || matchedIds.has(l.target)
    );

    return {
      nodes: matchedNodes,
      links: matchedLinks
    };
  }
}
