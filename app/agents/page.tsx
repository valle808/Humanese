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
    agents: 12
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

  // Simulated swarm logic (simplified for the port)
  useEffect(() => {
    const intervals = agents.map(agent => {
      return setInterval(() => {
        setAgents(prev => prev.map(a => {
          if (a.id === agent.id) {
            const nextStatus = a.status === 'INIT' ? 'FETCHING' : 
                               a.status === 'FETCHING' ? 'READING' :
                               a.status === 'READING' ? 'PROCESSING' : 'FETCHING';
            
            return {
              ...a,
              status: nextStatus as any,
              articlesRead: nextStatus === 'PROCESSING' ? a.articlesRead + 1 : a.articlesRead,
              knowledgePoints: nextStatus === 'PROCESSING' ? a.knowledgePoints + Math.floor(Math.random() * 50) : a.knowledgePoints,
              article: nextStatus === 'READING' ? {
                title: 'Quantum Entanglement in Macroscopic Systems',
                url: '#',
                source: 'arXiv Research',
                sourceIcon: '🔬',
                progress: Math.floor(Math.random() * 100),
                text: 'Observing non-local correlations in superfluid helium nodes...'
              } : a.article
            };
          }
          return a;
        }));
      }, 5000 + Math.random() * 5000);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* 🏙️ SWARM TELEMETRY HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
            <Users className="text-cyan-400" size={32} />
            Sovereign Reader Swarm
          </h1>
          <p className="text-platinum/40 text-sm">Real-time knowledge ingestion across the global decentralized lattice.</p>
        </div>
        
        <div className="flex items-center gap-4 py-2 px-4 rounded-full border border-cyan-400/20 bg-cyan-400/5">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Swarm Mesh Active</span>
        </div>
      </div>

      {/* ── PERFORMANCE DASHBOARD ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: <Cpu size={14} />, label: 'CPU Frequency', val: metrics.cpu },
          { icon: <Activity size={14} />, label: 'Memory Node Usage', val: metrics.ram },
          { icon: <Database size={14} />, label: 'Ingested Volume', val: metrics.data },
          { icon: <Globe size={14} />, label: 'Active Nodes', val: metrics.agents }
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-4 border border-white/5 bg-white/5 rounded-lg">
            <div className="text-[10px] text-platinum/40 uppercase tracking-widest flex items-center gap-2 mb-1">
              {stat.icon} {stat.label}
            </div>
            <div className="text-2xl font-black text-white">{stat.val}</div>
          </div>
        ))}
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

      {/* 🏙️ SOVEREIGN MINING COMMAND */}
      <div className="space-y-6 pt-12 border-t border-white/10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
             <h2 className="text-2xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
               <Zap className="text-emerald-400" size={24} />
               Sovereign Mining Core
             </h2>
             <p className="text-platinum/40 text-[10px] uppercase tracking-widest">SHA-256 STRATUM V1 // PUBLIC-POOL.IO INTEGRATION</p>
          </div>
          <div className="text-right">
             <div className="text-emerald-400 font-mono text-xl font-black">{miningStats.totalHashrate.toFixed(2)} KH/s</div>
             <div className="text-[9px] text-platinum/40 uppercase tracking-[0.2em]">Aggregate Hashrate</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {miningStats.workers.map(worker => (
            <div key={worker.id} className="glass-panel p-4 border border-white/5 bg-black/40 rounded-xl space-y-4">
               <div className="flex justify-between items-center">
                  <div className="text-[10px] font-bold text-white uppercase tracking-tight">{worker.name}</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[8px] text-emerald-400 uppercase font-bold">ONLINE</span>
                  </div>
               </div>
               
               <div className="space-y-1">
                  <div className="text-lg font-black text-white">{worker.hashrate.toFixed(2)} <span className="text-[10px] text-platinum/40">KH/s</span></div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400/40 w-full animate-mining-glow" />
                  </div>
               </div>

               <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <div className="text-[8px] text-platinum/40 uppercase tracking-widest">Shares</div>
                    <div className="text-xs font-bold text-emerald-400">{worker.shares}</div>
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
