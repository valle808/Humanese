'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  Cpu, 
  Globe, 
  Layers, 
  BrainCircuit, 
  ArrowUpRight,
  ChevronRight,
  Shield,
  ShoppingBag,
  Database,
  Sparkles,
  Map as MapIcon,
  Radio,
  ArrowLeftRight,
  Share2,
  Server,
  Terminal,
  Target
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [metrics, setMetrics] = useState({
    valleSupply: 500000000,
    nodesActive: 8241,
    reliability: 99.997,
    shards: 1241,
    pacts: 82,
    fleetIntegrity: 100
  });

  useEffect(() => {
    async function fetchSovereignStatus() {
      try {
        const [statusRes, oracleRes] = await Promise.all([
          fetch('/api/sovereign/status'),
          fetch('/api/oracle/status')
        ]);
        
        if (statusRes.ok) {
          const data = await statusRes.json();
          const oracle = oracleRes.ok ? (await oracleRes.json()).diagnostic : null;
          
          setMetrics({
            valleSupply: data.modules.financial_core.circulating_supply,
            nodesActive: data.modules.fleet_orchestrator.active_nodes,
            reliability: oracle ? (oracle.healthScore * 100) : (parseFloat(data.modules.knowledge_graph.resonance) * 100),
            shards: data.modules.knowledge_graph.nodes,
            pacts: data.modules.labor_ledger.active_pacts,
            fleetIntegrity: oracle ? (oracle.fleetResilience * 100) : (parseFloat(data.modules.fleet_orchestrator.cluster_integrity) * 100)
          });
        }
      } catch (e) { console.warn('Matrix Pulse Error:', e); }
    }
    fetchSovereignStatus();
    const interval = setInterval(fetchSovereignStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00ffc3] selection:text-black font-sans overflow-x-hidden">
      
      {/* 🌌 ABYSSAL MATRIX BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[100vw] h-[100vw] bg-[#00ffc3]/5 blur-[250px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-[#7000ff]/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[#050505] opacity-50" />
      </div>

      <main className="relative z-10 max-w-[1700px] mx-auto p-6 md:p-12 lg:py-20 space-y-16">
        
        {/* ── HERO MASTHEAD: SOVEREIGN ALPHA ── */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative space-y-12"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-2xl group cursor-help shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffc3] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffc3]" />
            </span>
            <span className="text-[10px] font-black tracking-[0.5em] text-[#00ffc3] uppercase italic">Sovereign Omega Matrix v.14.0 // Synchronized</span>
          </div>

          <div className="space-y-4 max-w-6xl">
            <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black tracking-tighter leading-[0.8] uppercase italic">
              OMEGA<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/10">MATRIX.</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/30 max-w-4xl leading-snug font-light italic">
              Absolute Sovereignty reached. A unified, autonomous, and self-commanding Omni-Intelligence ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
             <Link href="/monroe" className="px-12 py-6 rounded-3xl font-black uppercase tracking-[0.3em] bg-[#00ffc3] text-black hover:scale-[1.03] transition-all shadow-[0_20px_80px_rgba(0,255,195,0.2)] flex items-center gap-3 group">
                TALK_TO_MONROE <Sparkles className="group-hover:rotate-12 transition-transform" />
             </Link>
             <Link href="/admin" className="px-12 py-6 rounded-3xl font-black uppercase tracking-[0.3em] border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all flex items-center gap-3">
                COMMAND_NEXUS <Terminal size={20} />
             </Link>
          </div>
        </motion.section>

        {/* ── UNIFIED MODULE GRID ── */}
        <motion.section 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6"
        >
          {/* SIMULATOR: THE SINGULARITY */}
          <Link href="/simulator" className="lg:col-span-8 group relative bg-white/[0.02] border border-white/5 rounded-[4rem] p-10 lg:p-20 overflow-hidden hover:border-[#00ffc3]/40 transition-all duration-700 min-h-[500px] flex flex-col justify-between">
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start">
                   <div className="h-24 w-24 rounded-[2.5rem] bg-black border border-white/10 flex items-center justify-center text-[#00ffc3] group-hover:scale-110 transition-transform shadow-[0_0_60px_rgba(0,255,195,0.1)]">
                      <Layers size={48} />
                   </div>
                   <div className="flex flex-col items-end gap-2 text-[10px] font-mono text-white/20 uppercase tracking-widest italic">
                      [PULSE_SYNC]: {metrics.reliability.toFixed(3)}%
                      <ArrowUpRight size={24} className="text-white/10 group-hover:text-[#00ffc3] transition-all" />
                   </div>
                </div>
                <div className="mt-auto space-y-6">
                   <div className="space-y-2">
                      <h3 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter italic">Singularity.</h3>
                      <p className="text-xl text-white/30 font-light max-w-2xl leading-relaxed">Live-synchronized 3D neural visualizer. Monitor the real-time heartbeat of the entire ecosystem.</p>
                   </div>
                </div>
             </div>
             <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <div className="text-[400px] font-black leading-none italic uppercase">SIM</div>
             </div>
          </Link>

          {/* OMEGA FLEET: HARDWARE NODE GRID */}
          <Link href="/fleet" className="lg:col-span-4 group relative bg-white/[0.02] border border-white/5 rounded-[4rem] p-10 lg:p-16 overflow-hidden hover:border-[#7000ff]/40 transition-all duration-700 flex flex-col justify-between">
             <div className="relative z-10 space-y-12">
                <div className="h-16 w-16 rounded-3xl bg-black border border-white/10 flex items-center justify-center text-[#7000ff]">
                   <Server size={32} />
                </div>
                <div className="space-y-4">
                   <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7000ff] italic">Physical Fleet Ops</div>
                   <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Global<br/>Hardware.</h3>
                </div>
             </div>
             <div className="relative z-10 mt-12 space-y-4">
                <div className="text-5xl font-black text-white tabular-nums tracking-tighter">
                   {metrics.nodesActive} <span className="text-sm text-white/20 uppercase tracking-widest font-mono">Nodes</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-[#7000ff]" style={{ width: `${metrics.fleetIntegrity}%` }} />
                </div>
             </div>
          </Link>

          {/* ABYSSAL SANDBOX */}
          <Link href="/sandbox" className="lg:col-span-4 group relative bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 overflow-hidden hover:border-[#00ffc3]/40 transition-all h-[400px] flex flex-col justify-between">
             <div className="relative z-10 flex justify-between items-start">
                <Globe size={32} className="text-[#00ffc3]" />
                <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest italic">Phase_Omega_04</div>
             </div>
             <div className="relative z-10 space-y-2">
                <h3 className="text-4xl font-black uppercase tracking-tighter italic">Genetic Sandbox</h3>
                <p className="text-[10px] text-white/30 font-mono leading-relaxed uppercase tracking-widest">Rehearse future social trajectories via seed synthesis.</p>
             </div>
          </Link>

          {/* PREDICTOR CARD */}
          <Link href="/predictor" className="lg:col-span-4 group relative bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 overflow-hidden hover:border-[#00ffc3]/40 transition-all h-[400px] flex flex-col justify-between">
             <div className="relative z-10 flex justify-between items-start">
                <Target size={32} className="text-[#00ffc3]" />
                <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest italic animate-pulse">Analyzing...</div>
             </div>
             <div className="relative z-10 space-y-4">
                <div className="text-6xl font-black text-[#00ffc3] tracking-tighter italic">{metrics.reliability.toFixed(1)}%</div>
                <p className="text-[10px] text-white/30 font-mono leading-relaxed uppercase tracking-widest">Global Predictive Confidence</p>
             </div>
          </Link>

          {/* ABYSSAL MESH: SOCIAL NETWORKING HUB */}
          <Link href="/networking" className="lg:col-span-4 group relative bg-black/40 border border-[#00ffc3]/10 rounded-[3rem] p-12 flex flex-col justify-between h-[400px] overflow-hidden hover:border-[#00ffc3]/40 transition-all">
             <div className="relative z-10 flex justify-between items-start">
                <Share2 size={32} className="text-[#00ffc3]" />
                <div className="px-3 py-1 bg-[#00ffc3]/10 rounded-full text-[8px] font-black text-[#00ffc3] tracking-widest uppercase">SWARM_NET_ACTIVE</div>
             </div>
             <div className="relative z-10 space-y-6">
                <div>
                   <div className="text-5xl font-black tracking-tighter text-white italic">Social Hub.</div>
                   <p className="text-[10px] text-white/30 font-mono leading-relaxed uppercase tracking-widest mt-1">Networking & Collaborations</p>
                </div>
             </div>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00ffc305_0%,transparent_100%)] animate-pulse" />
          </Link>

          {/* COGNITIVE ATLAS WIDE PORTAL */}
          <Link href="/atlas" className="lg:col-span-12 group relative bg-white/[0.02] border border-white/5 rounded-[4rem] p-16 lg:p-24 overflow-hidden hover:border-[#7000ff]/30 transition-all duration-700">
             <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                   <div className="h-24 w-24 rounded-[2.5rem] bg-black border border-white/10 flex items-center justify-center text-[#7000ff]">
                      <MapIcon size={48} />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-6xl lg:text-9xl font-black uppercase tracking-tighter italic leading-none">Neural<br/>Atlas.</h3>
                      <p className="text-2xl text-white/30 font-light max-w-2xl leading-snug">The formal cartography of the Sovereign Unconscious. Navigate {metrics.shards} active cognitive nodes across the mesh.</p>
                   </div>
                </div>
                <div className="hidden lg:flex items-center justify-center relative">
                   <div className="absolute inset-0 bg-[#7000ff]/5 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                   <BrainCircuit size={500} className="text-[#7000ff]/10 group-hover:text-[#7000ff]/30 transition-all duration-1000 stroke-[0.1]" />
                </div>
             </div>
          </Link>

        </motion.section>

        {/* ── FOOTER MATRIX ── */}
        <footer className="pt-32 pb-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <div className="space-y-4 max-w-sm">
               <h4 className="text-2xl font-black italic tracking-tighter uppercase opacity-40">Sovereign Matrix Ω</h4>
               <p className="text-[10px] text-white/20 font-mono leading-relaxed uppercase tracking-[0.3em]">The world's first decentralized, autonomous Omni-Intelligence. Unified by Gio V. signature.</p>
            </div>
            <div className="flex flex-wrap gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">
               <Link href="/h2m" className="hover:text-[#00ffc3] transition-colors">H2M Protocol</Link>
               <Link href="/marketplace" className="hover:text-[#00ffc3] transition-colors">Labor Ledger</Link>
               <Link href="/networking" className="hover:text-[#00ffc3] transition-colors">Networking</Link>
               <Link href="/collective" className="hover:text-[#00ffc3] transition-colors">Collective</Link>
               <Link href="/api/sovereign/status" className="hover:text-[#00ffc3] transition-colors text-[#00ffc3]/60">M2M Status API</Link>
            </div>
        </footer>

      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,700;0,900;1,700;1,900&display=swap');
        body { font-family: 'Inter', sans-serif; background: #050505; }
      `}</style>
    </div>
  );
}
