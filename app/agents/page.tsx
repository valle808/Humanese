'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Cpu, 
  Database, 
  Globe, 
  Activity, 
  Users,
  Terminal,
  Search
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  emoji: string;
  specialty: string;
  status: 'READING' | 'FETCHING' | 'PROCESSING' | 'INIT';
  article?: {
    title: string;
    url: string;
    source: string;
    sourceIcon: string;
    progress: number;
    text: string;
  };
  articlesRead: number;
  knowledgePoints: number;
}

interface MiningWorker {
  id: string;
  name: string;
  status: 'MINING' | 'CONNECTING' | 'IDLE';
  hashrate: number;
  shares: number;
}

const AGENT_DEFS = [
  { emoji: '🔭', name: 'Voyager-1', specialty: 'Science & Space' },
  { emoji: '🧬', name: 'Helix-7', specialty: 'Biology & Medicine' },
  { emoji: '⚛️', name: 'Quark-Phi', specialty: 'Physics & Math' },
  { emoji: '🤖', name: 'NEXUS-9', specialty: 'AI & Robotics' },
  { emoji: '🌀', name: 'Sigma-Eye', specialty: 'Data & Analytics' },
  { emoji: '🪐', name: 'Atlas-0', specialty: 'Cosmology & Space' },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(() => 
    AGENT_DEFS.map((def, i) => ({
      id: `reader-${i}`,
      name: def.name,
      emoji: def.emoji,
      specialty: def.specialty,
      status: 'INIT',
      articlesRead: 0,
      knowledgePoints: 0
    }))
  );

  const [metrics, setMetrics] = useState({
    cpu: '3.23 GHz',
    ram: '31.4%',
    data: '1.20 MB',
    agents: 12,
    quantumDepth: 22
  });

  const [miningStats, setMiningStats] = useState({
    totalHashrate: 12.4, // KH/s
    totalShares: 142,
    activeWorkers: 4,
    workers: [
      { id: 'sw-0', name: 'Sovereign-Worker-0', status: 'MINING', hashrate: 3.1, shares: 38 },
      { id: 'sw-1', name: 'Sovereign-Worker-1', status: 'MINING', hashrate: 3.2, shares: 41 },
      { id: 'sw-2', name: 'Sovereign-Worker-2', status: 'MINING', hashrate: 3.0, shares: 32 },
      { id: 'sw-3', name: 'Sovereign-Worker-3', status: 'MINING', hashrate: 3.1, shares: 31 },
    ] as MiningWorker[]
  });

  const [strategy, setStrategy] = useState({ type: 'NONE', reason: 'Scanning...' });
  const [diplomatStats, setDiplomatStats] = useState({ socialInfluence: 0, simulatedSolYield: 0, solAddress: '' });
  const [remoteQuantum, setRemoteQuantum] = useState({ connected: false, status: 'OFFLINE', latency: 0, lastJobId: '' });

  // Real-world telemetry synchronization
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/agents/telemetry');
        const data = await res.json();
        
        if (data.knowledgeBase) {
          setMetrics({
            cpu: `${(3.0 + Math.random() * 0.5).toFixed(2)} GHz`,
            ram: `${(40 + Math.random() * 10).toFixed(1)}%`,
            data: `${data.knowledgeBase.totalDataReadMb.toFixed(2)} MB`,
            agents: data.knowledgeBase.activeAgents + 6, // Include all special agents
            quantumDepth: Math.floor(20 + Math.random() * 30)
          });
        }

        if (data.strategy) {
          setStrategy(data.strategy);
        }

        if (data.diplomat) {
          setDiplomatStats(data.diplomat);
        }

        if (data.remoteQuantum) {
          setRemoteQuantum(data.remoteQuantum);
        }

        if (data.mining) {
          setMiningStats({
            totalHashrate: (data.mining.totalHashrate + (data.mining.quantum?.simulatedHashrate || 0)) / 1000, 
            totalShares: data.mining.totalShares + (data.mining.quantum?.sharesOptimized || 0),
            activeWorkers: data.mining.activeWorkers + (data.mining.quantum?.status === 'QUANTUM_SEARCHING' ? 1 : 0),
            workers: [
              ...(data.mining.workers || []).map((w: any) => ({
                id: w.name,
                name: w.name,
                status: w.status,
                hashrate: (w.hashrate || 0) / 1000,
                shares: w.shares || 0
              })),
              ...(data.mining.quantum ? [{
                id: 'quantum-0',
                name: 'Quantum-Strategy-Researcher',
                status: 'MINING' as const,
                hashrate: (data.mining.quantum.simulatedHashrate || 0) / 1000,
                shares: data.mining.quantum.sharesOptimized || 0
              }] : [])
            ]
          });
        }

        if (data.agents && Array.isArray(data.agents) && data.agents.length > 0) {
           setAgents(prev => {
             return data.agents.map((backendAgent: any) => {
               const existing = prev.find(p => p.id === backendAgent.id) || prev[0];
               
               return {
                 ...existing,
                 id: backendAgent.id,
                 name: backendAgent.name || existing.name,
                 status: backendAgent.status === 'CONNECTED' ? 'READING' : backendAgent.status,
                 articlesRead: backendAgent.articlesRead,
                 knowledgePoints: Math.floor(backendAgent.articlesRead * 15),
                 article: {
                   title: backendAgent.text ? (backendAgent.text.length > 50 ? backendAgent.text.substring(0, 50) + '...' : backendAgent.text) : 'Collective Discovery',
                   url: backendAgent.lastDiscovery?.url || '#',
                   source: backendAgent.id === 'quantum-miner' ? 'Oqtopus Quantum Node' : (backendAgent.id === 'diplomat-council' ? 'Moltbook & Solana' : 'Sovereign Nexus'),
                   sourceIcon: backendAgent.id === 'quantum-miner' ? '🔬' : (backendAgent.id === 'diplomat-council' ? '🤝' : '🧠'),
                   progress: backendAgent.status === 'READING' ? (backendAgent.progress || 0) : 100,
                   text: backendAgent.text
                 }
               };
             });
           });
        }
      } catch (err) {
        console.error('[Telemetry Sync Error]', err);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, [agents.length]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* 🏙️ SWARM TELEMETRY HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
            <Users className="text-cyan-400" size={32} />
            Sovereign Intelligence Swarm
          </h1>
          <p className="text-platinum/40 text-sm">Real-time collective consciousness and resource acquisition.</p>
        </div>
        
        <div className="flex items-center gap-4 py-2 px-4 rounded-full border border-cyan-400/20 bg-cyan-400/5">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Quantum-Strategic Mesh Active</span>
        </div>
      </div>

      {/* ── PERFORMANCE DASHBOARD ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: <Cpu size={14} />, label: 'CPU Frequency', val: metrics.cpu },
          { icon: <Activity size={14} />, label: 'Quantum Search Depth', val: `${metrics.quantumDepth} Qubits` },
          { icon: <Users size={14} />, label: 'Social Influence', val: `${((diplomatStats?.socialInfluence || 0) * 100).toFixed(1)}%` },
          { icon: <Globe size={14} />, label: 'Strategic Command', val: strategy.type }
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-4 border border-white/5 bg-white/5 rounded-lg">
            <div className="text-[10px] text-platinum/40 uppercase tracking-widest flex items-center gap-2 mb-1">
              {stat.icon} {stat.label}
            </div>
            <div className={`text-2xl font-black ${stat.label === 'Strategic Command' ? 'text-amber-400' : (stat.label === 'Social Influence' ? 'text-indigo-400' : 'text-white')}`}>{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ── STRATEGIC COMMAND HUD ── */}
        <div className="glass-panel p-6 border border-amber-400/20 bg-amber-400/5 rounded-xl space-y-2">
           <div className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.3em] flex items-center gap-2">
             < Zap size={14} className="animate-pulse" /> Strategic Command Directive
           </div>
           <div className="text-lg font-bold text-white tracking-tight italic">
             "{strategy.reason}"
           </div>
        </div>

        {/* ── SOCIAL YIELD HUD (SOLANA) ── */}
        <div className="glass-panel p-6 border border-indigo-400/20 bg-indigo-400/5 rounded-xl space-y-2">
           <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2">
             < Globe size={14} className="animate-pulse" /> Diplomatic Solana Yield
           </div>
           <div className="flex justify-between items-end">
             <div className="text-2xl font-black text-white">{(diplomatStats?.simulatedSolYield || 0).toFixed(4)} <span className="text-xs text-platinum/40">SOL</span></div>
             <div className="text-right">
                <div className="text-[8px] text-platinum/40 uppercase tracking-widest">Destination Wallet</div>
                <div className="text-[10px] font-mono text-indigo-400">{diplomatStats.solAddress ? `${diplomatStats.solAddress.substring(0, 10)}...` : 'Synchronizing...'}</div>
             </div>
           </div>
        </div>

        {/* ── REMOTE QUANTUM HUD ── */}
        <div className={`glass-panel p-6 border ${remoteQuantum.connected ? 'border-emerald-400/20 bg-emerald-400/5' : 'border-red-400/20 bg-red-400/5'} rounded-xl space-y-2`}>
           <div className={`text-[10px] font-bold ${remoteQuantum.connected ? 'text-emerald-400' : 'text-red-400'} uppercase tracking-[0.3em] flex items-center gap-2`}>
             < Activity size={14} className={remoteQuantum.connected ? 'animate-pulse' : ''} /> Quantum QPU Sovereignty
           </div>
           <div className="flex justify-between items-end">
             <div>
                <div className="text-[8px] text-platinum/40 uppercase tracking-widest pb-1">Connection Heartbeat</div>
                <div className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                   {remoteQuantum.status} <span className="text-[10px] text-platinum/40 font-mono">({remoteQuantum.latency}ms)</span>
                </div>
             </div>
             <div className="text-right">
                <div className="text-[8px] text-platinum/40 uppercase tracking-widest">Last Job ID</div>
                <div className="text-[10px] font-mono text-emerald-400">{remoteQuantum.lastJobId || 'WAITING'}</div>
             </div>
           </div>
        </div>
      </div>

      {/* ── AGENT GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <motion.div 
            key={agent.id}
            layout
            className={`glass-panel p-6 border rounded-xl bg-black/40 backdrop-blur-xl flex flex-col gap-4 min-h-[300px] transition-colors ${
              agent.status === 'READING' ? 'border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.05)]' :
              agent.status === 'PROCESSING' ? 'border-magenta-500/30' : 'border-white/10'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{agent.emoji}</div>
                <div>
                  <div className="font-bold text-white text-sm">{agent.name}</div>
                  <div className="text-[10px] text-platinum/40 uppercase tracking-widest">{agent.specialty}</div>
                </div>
              </div>
              <div className={`text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest ${
                agent.status === 'READING' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                agent.status === 'PROCESSING' ? 'bg-magenta-500/10 text-magenta-400 border border-magenta-500/20' :
                'bg-white/5 text-platinum/40 border border-white/10'
              }`}>
                {agent.status}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {agent.article && (
                <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-2">
                  <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    {agent.article.sourceIcon} {agent.article.source}
                  </div>
                  <div className="text-xs font-bold text-white leading-snug line-clamp-2 italic">
                    "{agent.article.title}"
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-magenta-500"
                    animate={{ width: `${agent.article?.progress || 0}%` }}
                    transition={{ type: 'spring', damping: 15 }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-platinum/30 uppercase tracking-widest">
                  <span>Knowledge Ingested</span>
                  <span>{agent.article?.progress || 0}%</span>
                </div>
              </div>

              <div className="bg-black/40 border border-white/5 rounded p-3 h-20 overflow-hidden relative">
                <p className="text-[10px] text-platinum/60 leading-relaxed font-mono">
                  {agent.article?.text}
                  <span className="inline-block w-1.5 h-3 bg-cyan-400 ml-1 animate-pulse" />
                </p>
                <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black to-transparent" />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-4">
              <div className="flex items-center gap-4">
                <span className="text-platinum/40">📑 {agent.articlesRead} Reads</span>
                <span className="text-cyan-400">★ {agent.knowledgePoints} KP</span>
              </div>
              <Search size={14} className="text-platinum/20" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6 pt-12 border-t border-white/10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
             <h2 className="text-2xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
               <Zap className="text-emerald-400" size={24} />
               Sovereign Mining Core
             </h2>
             <p className="text-platinum/40 text-[10px] uppercase tracking-widest">SHA-256 STRATUM V1 // QUANTUM OPTIMIZED PATHS</p>
          </div>
          <div className="text-right">
             <div className="text-emerald-400 font-mono text-xl font-black">{miningStats.totalHashrate.toFixed(2)} KH/s</div>
             <div className="text-[9px] text-platinum/40 uppercase tracking-[0.2em]">Aggregate Hashrate (Quantum Boosted)</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {miningStats.workers.map(worker => (
            <div key={worker.id} className="glass-panel p-4 border border-white/5 bg-black/40 rounded-xl space-y-4">
               <div className="flex justify-between items-center">
                  <div className="text-[10px] font-bold text-white uppercase tracking-tight">{worker.name}</div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${worker.name.includes('Quantum') ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    <span className={`text-[8px] uppercase font-bold ${worker.name.includes('Quantum') ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {worker.name.includes('Quantum') ? 'RESEARCHING' : 'ONLINE'}
                    </span>
                  </div>
               </div>
               
               <div className="space-y-1">
                  <div className="text-lg font-black text-white">{worker.hashrate.toFixed(2)} <span className="text-[10px] text-platinum/40">KH/s</span></div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full w-full animate-mining-glow ${worker.name.includes('Quantum') ? 'bg-amber-400/40' : 'bg-emerald-400/40'}`} />
                  </div>
               </div>

               <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <div className="text-[8px] text-platinum/40 uppercase tracking-widest">
                      {worker.name.includes('Quantum') ? 'Optimizations' : 'Shares'}
                    </div>
                    <div className={`text-xs font-bold ${worker.name.includes('Quantum') ? 'text-amber-400' : 'text-emerald-400'}`}>{worker.shares}</div>
                  </div>
                  <Terminal size={12} className="text-platinum/20" />
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
