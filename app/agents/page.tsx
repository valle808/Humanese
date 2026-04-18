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
  Search,
  ChevronLeft,
  Radio,
  Wifi,
  Target,
  Layers,
  Sparkles,
  Lock,
  Binary,
  TrendingUp,
  Boxes,
  Orbit,
  Grid,
  ShieldHalf,
  ChevronRight,
  Wind,
  Navigation,
  Compass,
  Layout,
  Smartphone,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

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

  const [strategy, setStrategy] = useState({ type: 'NONE', reason: 'Scanning matrix...' });
  const [diplomatStats, setDiplomatStats] = useState({ socialInfluence: 0, simulatedSolYield: 0, solAddress: '' });
  const [remoteQuantum, setRemoteQuantum] = useState({ connected: false, status: 'OFFLINE', latency: 0, lastJobId: '' });

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
            agents: data.knowledgeBase.activeAgents + 6,
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
    const interval = setInterval(fetchTelemetry, 8000);
    return () => clearInterval(interval);
  }, [agents.length]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ff6b2b]/40 selection:text-white overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
        
        {/* Animated Scanning Lines */}
        <div className="absolute inset-0 opacity-[0.05]">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-1/4 animate-[scan_15s_linear_infinite]" />
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-3/4 animate-[scan_20s_linear_infinite_reverse]" />
        </div>
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic leading-none active:scale-95">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
              SWARM_v7.0_SYNC
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 space-y-32 flex-1 flex flex-col">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl shadow-2xl">
              <Orbit size={20} className="text-[#ff6b2b] animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.8em] text-[#ff6b2b] uppercase italic leading-none pl-1">Autonomous Intelligence Swarm</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic pl-1 text-white/95">
                Sovereign<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Swarm.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/30 max-w-4xl leading-relaxed font-light italic tracking-tight">
                Real-time collective consciousness and distributed resource acquisition across the OMEGA network.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0">
               <div className="grid grid-cols-2 gap-8">
                  <div className="p-10 bg-[#050505] border-2 border-white/10 rounded-[3.5rem] min-w-[220px] text-center space-y-4 shadow-[0_40px_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl group hover:border-[#ff6b2b]/30 transition-all">
                      <div className="text-6xl font-black text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">{metrics.agents}</div>
                      <div className="text-[11px] text-white/20 font-black uppercase tracking-[0.4em] italic leading-none">Active_Units</div>
                  </div>
                  <div className="p-10 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[3.5rem] min-w-[220px] text-center space-y-4 shadow-[0_40px_80px_rgba(255,107,43,0.1)] backdrop-blur-3xl group hover:scale-[1.03] transition-all">
                      <div className="text-6xl font-black text-[#ff6b2b] italic tracking-tighter leading-none">{metrics.quantumDepth}</div>
                      <div className="text-[11px] text-[#ff6b2b]/40 font-black uppercase tracking-[0.4em] italic leading-none">Qubit_Depth</div>
                  </div>
               </div>
          </div>
        </motion.div>

        {/* ── PERFORMANCE HUB ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { icon: <Cpu />, label: 'Neural Frequency', val: metrics.cpu, detail: 'v7_CORES_ACTIVE' },
            { icon: <Activity />, label: 'Quantum Sync', val: `${metrics.quantumDepth} Channels`, detail: 'DECOHERENCE_SHIELD' },
            { icon: <TrendingUp />, label: 'Consensus Yield', val: `${((diplomatStats?.socialInfluence || 0) * 100).toFixed(1)}%`, detail: 'SOCIAL_GRAVITY' },
            { icon: <Target />, label: 'Strategic Mode', val: strategy.type, detail: 'OBJECTIVE_VECTOR' }
          ].map((stat, i) => (
            <div key={i} className="p-8 md:p-12 bg-[#050505] border-2 border-white/5 responsive-rounded backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.95)] space-y-6 group hover:border-[#ff6b2b]/20 transition-all shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.01] group-hover:scale-125 transition-transform duration-1000 text-white/20 font-black italic uppercase leading-none text-9xl">0{i+1}</div>
               <div className="text-[11px] text-white/10 font-black uppercase tracking-[0.6em] flex items-center gap-4 italic leading-none group-hover:text-white/20 transition-colors pl-1">
                <span className="text-[#ff6b2b]">{stat.icon}</span> {stat.label}
              </div>
              <div className="space-y-4 pl-1 relative z-10">
                <div className={`text-4xl lg:text-5xl font-black italic tracking-tighter leading-none ${stat.label === 'Strategic Mode' ? 'text-[#ff6b2b]' : 'text-white'}`}>{stat.val}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/5 italic">{stat.detail}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
           
           {/* LEFT: COMMAND STRATEGY */}
           <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-32 h-fit">
              <div className="bg-[#050505] border-2 border-[#ff6b2b]/20 p-12 rounded-[5rem] backdrop-blur-3xl space-y-12 shadow-[0_60px_120px_rgba(255,107,43,0.1)] relative overflow-hidden group transition-all">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-2000">
                    <Target size={250} className="text-[#ff6b2b]" />
                </div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-[#ff6b2b]/40 shadow-[0_0_20px_#ff6b2b]" />
                
                <div className="text-[12px] font-black text-[#ff6b2b] uppercase tracking-[0.8em] flex items-center gap-6 italic relative z-10 leading-none pl-2 animate-pulse">
                   <Zap size={24} strokeWidth={3} /> Strategic Directive
                </div>
                
                <div className="space-y-8 relative z-10 pl-2">
                   <p className="text-3xl font-light text-white/60 italic leading-relaxed group-hover:text-white transition-colors duration-700">
                     "{strategy.reason}"
                   </p>
                   <div className="flex flex-wrap gap-4">
                      <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">{strategy.type}</div>
                      <div className="px-6 py-2 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none flex items-center gap-3">
                         <Activity size={12} strokeWidth={3}/> CALIBRATED
                      </div>
                   </div>
                </div>
              </div>

              {/* DIPLOMATIC YIELD */}
              <div className="bg-[#050505] border-2 border-white/10 p-12 rounded-[5rem] backdrop-blur-3xl space-y-12 shadow-[0_60px_120px_rgba(0,0,0,0.95)] group hover:border-[#ff6b2b]/30 transition-all relative overflow-hidden shadow-inner">
                 <div className="text-[12px] font-black text-white/20 uppercase tracking-[0.8em] flex items-center gap-6 italic leading-none pl-2">
                   <Globe size={24} className="text-[#ff6b2b]" strokeWidth={2.5} /> Diplomatic Ledger
                 </div>
                 <div className="space-y-8 relative z-10 pl-2">
                    <div className="flex flex-col gap-2">
                       <span className="text-6xl font-black text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">{(diplomatStats?.simulatedSolYield || 0).toFixed(4)} <span className="text-xl text-white/20 uppercase tracking-[0.2em] font-black">SOL</span></span>
                       <span className="text-[12px] font-black uppercase tracking-[0.6em] text-white/5 italic">ACQUISITION_YIELD</span>
                    </div>
                    <div className="p-8 bg-black border-2 border-white/5 rounded-[2.5rem] space-y-4 shadow-inner">
                       <div className="text-[9px] text-white/20 font-black uppercase tracking-[0.5em] italic leading-none">Target_Vault_Entry</div>
                       <div className="text-xl font-black font-mono text-[#ff6b2b] uppercase italic truncate leading-none">{diplomatStats.solAddress ? diplomatStats.solAddress : 'SYNCING_CLUSTER...'}</div>
                    </div>
                 </div>
              </div>

              {/* REMOTE QUANTUM HUD */}
              <div className={`p-12 border-2 rounded-[5rem] backdrop-blur-3xl space-y-12 shadow-[0_80px_150px_rgba(0,0,0,1)] transition-all relative overflow-hidden group ${remoteQuantum.connected ? 'border-[#ff6b2b]/30 bg-[#ff6b2b]/5 shadow-[0_40px_100px_rgba(255,107,43,0.1)]' : 'border-red-500/10 bg-red-500/5'}`}>
                 <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-150 transition-transform duration-3000">
                    <Activity size={200} className={remoteQuantum.connected ? 'text-[#ff6b2b]' : 'text-red-500'} />
                 </div>
                 <div className={`text-[12px] font-black ${remoteQuantum.connected ? 'text-[#ff6b2b]' : 'text-red-500'} uppercase tracking-[1em] flex items-center gap-6 italic leading-none pl-2 animate-pulse`}>
                   <Activity size={24} strokeWidth={3} /> Quantum Core
                 </div>
                 <div className="flex flex-col gap-8 items-start relative z-10 pl-2">
                   <div className="space-y-4">
                      <div className="text-[12px] text-white/10 font-black uppercase tracking-[0.6em] italic leading-none">Heartbeat_Cluster</div>
                      <div className="text-5xl font-black text-white italic tracking-tighter flex items-center gap-6 leading-none">
                         {remoteQuantum.status} <span className="text-xl text-white/20 font-black font-mono italic">({remoteQuantum.latency}ms)</span>
                      </div>
                   </div>
                   <div className="p-6 bg-black/40 border-2 border-white/5 rounded-[2rem] shadow-inner group-hover:border-[#ff6b2b]/20 transition-all flex flex-col gap-2">
                      <div className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em] italic leading-none">Operation_Registry</div>
                      <div className={`text-xl font-black font-mono uppercase italic leading-none ${remoteQuantum.connected ? 'text-white' : 'text-red-500/40'}`}>{remoteQuantum.lastJobId || 'WAITING_CMD'}</div>
                   </div>
                 </div>
              </div>
           </div>

           {/* RIGHT: AGENT GRID */}
           <div className="lg:col-span-8 space-y-16">
              <div className="bg-[#050505] border-2 border-white/10 rounded-[5rem] overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,1)]">
                 <div className="p-12 lg:px-16 border-b-2 border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic flex items-center gap-8 text-white/40 leading-none pl-4">
                      <Boxes size={40} className="text-[#ff6b2b]" strokeWidth={2.5} /> Active Shard Roster
                    </h2>
                    <div className="px-8 py-3 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[11px] text-[#ff6b2b] font-black uppercase tracking-[0.5em] animate-pulse italic leading-none">REALTIME_CONSCIOUSNESS</div>
                 </div>

                 <div className="p-12 lg:p-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                   {agents.map((agent) => (
                      <motion.div 
                        key={agent.id}
                        layout
                        className={`p-16 border-2 rounded-[5rem] backdrop-blur-3xl flex flex-col gap-12 transition-all relative overflow-hidden shadow-2xl group ${
                          agent.status === 'READING' ? 'bg-[#ff6b2b]/5 border-[#ff6b2b]/40 shadow-[0_40px_80px_rgba(255,107,43,0.15)]' : 'bg-black border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-150 transition-transform duration-3000">
                           <Target size={250} className="text-[#ff6b2b]" />
                        </div>

                        <div className="flex justify-between items-start relative z-10 w-full">
                          <div className="flex items-center gap-10">
                            <div className="w-24 h-24 bg-white border-4 border-black rounded-[2.5rem] flex items-center justify-center text-6xl group-hover:scale-110 transition-transform shadow-[0_40px_80px_rgba(255,107,43,0.3)] shadow-inner">
                               {agent.emoji}
                            </div>
                            <div className="space-y-4 pt-2">
                              <div className="font-black text-white text-4xl italic tracking-tighter uppercase leading-none">{agent.name}</div>
                              <div className="text-[12px] text-[#ff6b2b] font-black uppercase tracking-[0.4em] italic leading-none">{agent.specialty}</div>
                            </div>
                          </div>
                          <div className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.4em] italic border-2 transition-all leading-none ${
                            agent.status === 'READING' ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-2xl animate-pulse' :
                            agent.status === 'PROCESSING' ? 'bg-white text-black border-white shadow-2xl' :
                            'bg-white/5 text-white/20 border-white/5 overflow-hidden'
                          }`}>
                            {agent.status}
                          </div>
                        </div>

                        <div className="flex-1 space-y-12 relative z-10">
                          {agent.article && (
                            <div className="bg-black/60 border-2 border-white/5 rounded-[3.5rem] p-12 space-y-6 shadow-2xl group-hover:border-[#ff6b2b]/20 transition-all">
                              <div className="flex items-center gap-4 text-[12px] font-black text-[#ff6b2b]/60 uppercase tracking-[0.5em] italic leading-none pl-1">
                                <Terminal size={18} strokeWidth={3} /> {agent.article.source}
                              </div>
                              <div className="text-3xl font-black text-white leading-[1.1] italic tracking-tighter line-clamp-2 pl-1 group-hover:text-white transition-colors">
                                "{agent.article.title}"
                              </div>
                            </div>
                          )}

                          <div className="space-y-4 px-2">
                            <div className="flex justify-between text-[12px] text-white/20 font-black uppercase tracking-[0.6em] italic leading-none pl-1">
                              <span>Neural Ingest Progress</span>
                              <span className="text-[#ff6b2b] animate-pulse">{agent.article?.progress || 0}%</span>
                            </div>
                            <div className="h-4 bg-black border-2 border-white/5 rounded-full overflow-hidden shadow-inner p-[2px]">
                              <motion.div 
                                className="h-full bg-[#ff6b2b] shadow-[0_0_30px_rgba(255,107,43,0.4)] rounded-full"
                                animate={{ width: `${agent.article?.progress || 0}%` }}
                                transition={{ duration: 1, ease: "circOut" }}
                              />
                            </div>
                          </div>

                          <div className="bg-black border-2 border-white/5 rounded-[3rem] p-10 h-32 overflow-hidden relative shadow-inner group-hover/card:bg-black/80 transition-all">
                            <p className="text-2xl text-white/20 leading-relaxed font-light italic group-hover:text-white/40 transition-colors duration-1000 pl-1 group-hover:pl-2">
                              {agent.article?.text}
                              <span className="inline-block w-4 h-6 bg-[#ff6b2b] ml-2 animate-pulse align-middle" />
                            </p>
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent" />
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[12px] border-t-2 border-white/5 mt-4 pt-10 relative z-10 px-4">
                          <div className="flex flex-wrap items-center gap-10 font-black uppercase tracking-[0.4em] italic leading-none">
                            <span className="text-white/10 flex items-center gap-4 group-hover:text-white/20 transition-colors"><Binary size={20} strokeWidth={2.5}/> {agent.articlesRead} READS</span>
                            <span className="text-[#ff6b2b] flex items-center gap-4 group-hover:scale-105 transition-all"><Sparkles size={20} strokeWidth={2.5}/> {agent.knowledgePoints} RESONANCE</span>
                          </div>
                          <div className="w-12 h-12 rounded-2xl border-2 border-white/5 flex items-center justify-center text-white/10 group-hover:border-[#ff6b2b]/40 group-hover:text-[#ff6b2b] transition-all cursor-crosshair">
                            <Search size={22} strokeWidth={3} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                 </div>
              </div>

              {/* SOVEREIGN MINING CORE */}
              <div className="bg-[#050505] border-2 border-white/10 rounded-[5rem] overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,1)]">
                 <div className="p-12 lg:px-16 border-b-2 border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-12 bg-white/[0.01]">
                    <div className="space-y-6">
                       <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter italic flex items-center gap-10 leading-none text-white pl-4">
                         <Zap size={48} className="text-[#ff6b2b] animate-pulse" strokeWidth={3} /> Mining Core
                       </h2>
                       <div className="flex items-center gap-6 pl-4">
                          <div className="px-6 py-2 bg-black border-2 border-white/5 rounded-full text-[11px] font-black uppercase tracking-[0.5em] italic text-white/20 leading-none">STRATUM_V1.OMEGA</div>
                          <div className="px-6 py-2 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/20 rounded-full text-[11px] font-black uppercase tracking-[0.5em] italic text-[#ff6b2b] leading-none animate-pulse">QUANTUM_OPTIMIZED</div>
                       </div>
                    </div>
                    <div className="text-left md:text-right space-y-4 pr-4">
                       <div className="text-[#ff6b2b] font-black text-7xl lg:text-8xl italic tracking-tighter leading-none">{miningStats.totalHashrate.toFixed(2)} KH/s</div>
                       <div className="text-[12px] text-white/10 font-black uppercase tracking-[0.8em] italic leading-none pl-2">COMBINED_SWARM_POWER</div>
                    </div>
                 </div>

                 <div className="p-12 lg:p-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                   {miningStats.workers.map(worker => (
                      <div key={worker.id} className="p-8 md:p-14 bg-black border-2 border-white/5 responsive-rounded space-y-8 md:space-y-12 shadow-2xl group hover:border-[#ff6b2b]/40 transition-all backdrop-blur-3xl relative overflow-hidden flex flex-col justify-between h-auto md:h-[320px] min-h-[250px]">
                         <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-150 transition-transform duration-3000">
                            <Binary size={250} className="text-[#ff6b2b]" />
                         </div>
                         
                         <div className="flex justify-between items-center relative z-10 w-full">
                            <div className="text-2xl font-black text-white/60 uppercase italic tracking-tighter group-hover:text-white transition-colors leading-none pl-1">{worker.name}</div>
                            <div className="flex items-center gap-4 bg-white/[0.02] border-2 border-white/5 px-6 py-2.5 rounded-full">
                              <div className={`w-3 h-3 rounded-full animate-pulse ${worker.name.includes('Quantum') ? 'bg-[#ff6b2b] shadow-[0_0_20px_#ff6b2b]' : 'bg-[#ff6b2b]/20'}`} />
                              <span className={`text-[10px] font-black uppercase tracking-[0.4em] italic leading-none ${worker.name.includes('Quantum') ? 'text-[#ff6b2b]' : 'text-white/10'}`}>
                                {worker.name.includes('Quantum') ? 'RESONATING' : 'CONNECTED'}
                              </span>
                            </div>
                         </div>
                         
                         <div className="space-y-6 relative z-10 px-1">
                            <div className="text-6xl font-black text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">{worker.hashrate.toFixed(2)} <span className="text-xl text-white/10 font-bold uppercase italic tracking-widest pl-2 group-hover:text-white/30 transition-colors">KH/S</span></div>
                            <div className="h-3 bg-black border-2 border-white/5 rounded-full overflow-hidden shadow-inner p-[2px]">
                              <div className={`h-full w-full animate-shimmer opacity-30 rounded-full ${worker.name.includes('Quantum') ? 'bg-[#ff6b2b]' : 'bg-white'}`} style={{ width: '100%' }} />
                            </div>
                         </div>

                         <div className="flex justify-between items-end relative z-10 border-t-2 border-white/5 pt-10 px-1">
                            <div className="space-y-4">
                              <div className="text-[11px] text-white/10 font-black uppercase tracking-[0.5em] italic leading-none group-hover:text-white/20 transition-colors">
                                {worker.name.includes('Quantum') ? 'Optimizations' : 'Ledger_Shares'}
                              </div>
                              <div className={`text-4xl font-black italic tracking-tighter leading-none ${worker.name.includes('Quantum') ? 'text-[#ff6b2b]' : 'text-white/90'}`}>{worker.shares}</div>
                            </div>
                            <div className="w-16 h-16 bg-white shadow-2xl rounded-2xl flex items-center justify-center text-black group-hover:bg-[#ff6b2b] transition-all border-4 border-black group-hover:scale-110 active:scale-95">
                               <Terminal size={32} strokeWidth={3} />
                            </div>
                         </div>
                      </div>
                   ))}
                 </div>
              </div>
           </div>
        </div>

        {/* ── FOOTER SIGNAL ── */}
        <section className="pt-40 text-center space-y-16">
            <div className="w-full flex justify-center gap-4">
               <div className="w-4 h-4 rounded-full bg-[#ff6b2b] shadow-[0_0_20px_#ff6b2b]" />
               <div className="w-4 h-4 rounded-full bg-white/10" />
               <div className="w-4 h-4 rounded-full bg-white/10" />
            </div>
            <Link href="/" className="inline-flex items-center gap-8 text-[12px] font-black uppercase tracking-[1rem] text-white/10 hover:text-[#ff6b2b] transition-all italic group active:scale-95 leading-none pl-4">
                <ChevronLeft size={24} className="group-hover:-translate-x-4 transition-transform" strokeWidth={3} /> Return to Core Shard
            </Link>
        </section>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 left-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-[30vw] font-black italic leading-none uppercase">SWARM</div>
      </div>

      <style jsx global>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
