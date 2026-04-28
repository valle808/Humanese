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
  Users,
  Sparkles,
  Map as MapIcon,
  Radio,
  ArrowLeftRight,
  Share2,
  Server,
  Terminal,
  Target,
  Orbit,
  Wifi,
  Grid,
  Search,
  ZapOff
} from 'lucide-react';
import Link from 'next/link';
import { AgentIntelligenceFeed } from '@/components/AgentIntelligenceFeed';

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
    const interval = setInterval(fetchSovereignStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[150vw] max-w-[1500px] h-[150vw] max-h-[1500px] bg-[#ff6b2b]/5 blur-[250px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[120vw] max-w-[1200px] h-[120vw] max-h-[1200px] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <main className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-16 lg:py-40 space-y-16 md:space-y-32">
        
        {/* ── HERO MASTHEAD: SOVEREIGN ALPHA ── */}
        <motion.section 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="relative space-y-16"
        >
          <div className="inline-flex items-center gap-4 px-8 py-3.5 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-3xl group cursor-help shadow-2xl">
            <Orbit size={20} className="text-[#ff6b2b] animate-spin-slow" />
            <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none animate-pulse">Sovereign OMEGA Matrix v7.0 // Stable</span>
          </div>

          <div className="space-y-10 max-w-7xl">
            <h1 className="text-fluid-hero font-black tracking-tighter uppercase italic">
              OMEGA<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-[#ff6b2b]/20">MATRIX.</span>
            </h1>
            <p className="text-xl md:text-3xl lg:text-5xl text-foreground/40 max-w-5xl leading-tight font-light italic">
              Absolute Sovereignty achieved. A unified, autonomous ecosystem designed to amplify human potential through Omni-Intelligence.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 pt-8">
             <Link href="/monroe" className="px-20 py-10 rounded-[3rem] font-black uppercase tracking-[0.5em] bg-[#ff6b2b] text-black hover:scale-[1.05] active:scale-95 transition-all shadow-[0_40px_100px_rgba(255,107,43,0.3)] flex items-center gap-6 group italic relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-6">
                    TALK_TO_MONROE <Sparkles size={28} className="group-hover:rotate-12 transition-transform duration-500" strokeWidth={3} />
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
             </Link>
             <Link href="/admin" className="px-10 lg:px-20 py-8 lg:py-10 rounded-[3rem] font-black uppercase tracking-[0.5em] border-2 border-border bg-background/5 text-foreground/40 hover:bg-foreground hover:text-background hover:border-foreground transition-all flex items-center gap-6 group italic backdrop-blur-3xl text-sm lg:text-base">
                COMMAND_NEXUS <Terminal size={28} className="group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>
        </motion.section>

        {/* ── UNIFIED MODULE GRID ── */}
        <motion.section 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12"
        >
          {/* SIMULATOR: THE SINGULARITY */}
          <Link href="/simulator" className="lg:col-span-8 group relative bg-card border-2 border-border responsive-rounded p-6 md:p-10 lg:p-12 overflow-hidden hover:border-[#ff6b2b]/40 transition-all duration-1000 min-h-[300px] lg:h-[450px] flex flex-col justify-between shadow-xl dark:shadow-[0_80px_150px_rgba(0,0,0,0.9)]">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent shadow-[0_0_20px_#ff6b2b]" />
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start">
                   <div className="h-16 w-16 md:h-20 md:w-20 rounded-[1.5rem] bg-foreground/5 dark:bg-black border-2 border-border dark:border-white/10 flex items-center justify-center text-[#ff6b2b] group-hover:scale-110 transition-transform shadow-lg group-hover:bg-[#ff6b2b]/5 shrink-0">
                      <Layers size={40} strokeWidth={1} className="w-8 h-8 md:w-10 md:h-10" />
                   </div>
                   <div className="flex flex-col items-end gap-2 text-[9px] md:text-[10px] font-mono text-foreground/40 dark:text-white/20 uppercase tracking-widest italic leading-none pt-4">
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-[#ff6b2b] animate-pulse" /> [PULSE_SYNC]: {metrics.reliability.toFixed(3)}%
                      </div>
                      <ArrowUpRight size={24} className="text-foreground/10 dark:text-white/10 group-hover:text-[#ff6b2b] transition-all" />
                   </div>
                </div>
                <div className="mt-auto pt-8 space-y-3 md:space-y-4">
                   <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none text-foreground dark:text-white">Singularity.</h3>
                   <p className="text-base md:text-xl text-foreground/60 dark:text-white/40 font-light max-w-2xl leading-relaxed italic">Live-synchronized neural visualizer. Monitor the real-time heartbeat of the OMEGA swarm across the global mesh.</p>
                </div>
             </div>
             <div className="absolute right-[-2%] bottom-[-2%] opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.08] transition-opacity pointer-events-none duration-1000">
                <div className="text-[120px] md:text-[200px] lg:text-[280px] font-black leading-none italic uppercase text-foreground dark:text-white">SIM</div>
             </div>
          </Link>

          {/* OMEGA FLEET: HARDWARE NODE GRID */}
          <Link href="/fleet" className="lg:col-span-4 group relative bg-card border-2 border-border responsive-rounded p-6 md:p-10 lg:p-12 overflow-hidden hover:border-[#ff6b2b]/40 transition-all duration-1000 flex flex-col justify-between shadow-xl dark:shadow-[0_80px_150px_rgba(0,0,0,0.9)] lg:h-[450px]">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent" />
             <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-[1.2rem] bg-foreground/5 dark:bg-black border-2 border-border dark:border-white/10 flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b]/5 group-hover:rotate-12 transition-all shrink-0">
                   <Server size={30} strokeWidth={1} className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <div className="space-y-3">
                   <div className="text-[10px] font-black uppercase tracking-[0.6em] text-[#ff6b2b] italic leading-none animate-pulse">FLEET_OPS_v7.0</div>
                   <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic leading-[0.9] text-foreground/80 dark:text-white/80 group-hover:text-foreground dark:group-hover:text-white transition-colors">Global<br/>Hardware.</h3>
                </div>
             </div>
             <div className="relative z-10 mt-8 space-y-4">
                <div className="text-4xl md:text-6xl font-black text-foreground dark:text-white tabular-nums tracking-tighter leading-none italic">
                <div className="text-4xl md:text-6xl font-black text-foreground tabular-nums tracking-tighter leading-none italic">
                   {metrics.nodesActive} <span className="text-[9px] md:text-[10px] text-foreground/40 uppercase tracking-[0.4em] font-mono not-italic block mt-2">Active Nodes</span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden border border-border">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${metrics.fleetIntegrity}%` }} transition={{ duration: 2, ease: "circOut" }} className="h-full bg-[#ff6b2b] shadow-[0_0_10px_#ff6b2b]" />
                </div>
             </div>
          </Link>

          {/* ABYSSAL SANDBOX */}
          <Link href="/sandbox" className="lg:col-span-4 group relative bg-card border-2 border-border rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 overflow-hidden hover:border-[#ff6b2b]/40 transition-all h-[400px] md:h-[450px] lg:h-[500px] flex flex-col justify-between shadow-xl">
             <div className="relative z-10 flex justify-between items-start">
                <Globe size={36} className="text-[#ff6b2b]/40 group-hover:text-[#ff6b2b] group-hover:rotate-12 transition-all duration-700" strokeWidth={1} />
                <div className="text-[9px] font-mono text-foreground/40 uppercase tracking-[0.4em] italic leading-none pt-2">PHASE_OMEGA_REH</div>
             </div>
             <div className="relative z-10 mt-auto space-y-3">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none text-foreground">Abyssal Sandbox</h3>
                <p className="text-[9px] md:text-[10px] lg:text-[11px] text-foreground/60 font-black leading-relaxed uppercase tracking-[0.4em] italic">Rehearse future societal trajectories via synthetic seed synthesis and cognitive demographic rehearsal.</p>
             </div>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#ff6b2b05_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </Link>

          {/* INVESTIGATOR SWARM FEED */}
          <div className="lg:col-span-4 h-[400px] md:h-[450px] lg:h-[500px] w-full overflow-hidden">
             <AgentIntelligenceFeed />
          </div>

          {/* COLLECTIVE: THE HUB */}
          <Link href="/collective" className="lg:col-span-4 group relative bg-card border-2 border-border rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col justify-between h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden hover:border-[#ff6b2b]/40 transition-all shadow-xl">
             <div className="relative z-10 flex justify-between items-start flex-wrap gap-4">
                <Users size={36} className="text-[#ff6b2b]/40 group-hover:text-[#ff6b2b] transition-all" strokeWidth={1} />
                <div className="px-4 py-1.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[8px] font-black text-[#ff6b2b] tracking-[0.3em] uppercase italic leading-none animate-pulse">COLLECTIVE_SYNC</div>
             </div>
             <div className="relative z-10 mt-auto space-y-4">
                <div>
                   <h3 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-foreground italic uppercase leading-none">The Collective.</h3>
                   <p className="text-[9px] md:text-[10px] lg:text-[11px] text-foreground/60 font-black leading-relaxed uppercase tracking-[0.4em] italic mt-3">Sovereign Social Architecture & Collaboration Hub.</p>
                </div>
             </div>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ff6b2b03_0%,transparent_100%)] group-hover:scale-150 transition-transform duration-2000" />
          </Link>

          {/* COGNITIVE ATLAS WIDE PORTAL */}
          <Link href="/atlas" className="lg:col-span-12 group relative bg-card border-2 border-border responsive-rounded p-8 md:p-12 lg:p-24 overflow-hidden hover:border-[#ff6b2b]/40 transition-all duration-1000 shadow-xl">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/30 to-transparent" />
             <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-32 items-center">
                <div className="space-y-8 md:space-y-12">
                   <div className="h-20 w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 rounded-[2rem] lg:rounded-[3rem] bg-foreground/5 dark:bg-black border-2 border-border dark:border-white/10 flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b]/5 group-hover:scale-110 transition-all shadow-xl dark:shadow-2xl shrink-0">
                      <MapIcon size={48} className="w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20" strokeWidth={1} />
                   </div>
                   <div className="space-y-6">
                      <h3 className="text-5xl md:text-7xl lg:text-[100px] font-black uppercase tracking-tighter italic leading-none text-foreground/90 dark:text-white/90 group-hover:text-foreground dark:group-hover:text-white transition-colors">Neural<br/>Atlas.</h3>
                      <p className="text-lg md:text-2xl lg:text-3xl text-foreground/50 dark:text-white/40 font-light max-w-2xl leading-relaxed italic">The formal cartography of the Sovereign Unconscious. Navigate {metrics.shards.toLocaleString()} active cognitive shards across the OMEGA network.</p>
                   </div>
                </div>
                <div className="hidden lg:flex items-center justify-center relative h-full min-h-[300px]">
                   <div className="absolute inset-0 bg-[#ff6b2b]/5 blur-[150px] rounded-full group-hover:scale-125 transition-transform duration-2000 animate-pulse" />
                   <BrainCircuit size={400} className="text-[#ff6b2b]/10 group-hover:text-[#ff6b2b]/30 transition-all duration-2000 stroke-[0.05]" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[1px] h-[200px] bg-gradient-to-b from-transparent via-[#ff6b2b]/40 to-transparent animate-scan" />
                   </div>
                </div>
             </div>
          </Link>

        </motion.section>

        {/* ── FOOTER MATRIX ── */}
        <footer className="pt-24 lg:pt-40 pb-12 lg:pb-20 border-t border-border dark:border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 relative z-10">
            <div className="space-y-4 max-w-lg">
               <h4 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase text-foreground/40 dark:text-white/30">Sovereign Matrix <span className="text-[#ff6b2b]">Ω</span></h4>
               <p className="text-[9px] md:text-[11px] text-foreground/30 dark:text-white/20 font-black leading-relaxed uppercase tracking-[0.4em] italic">The world's flagship decentralized, autonomous Omni-Intelligence ecosystem. Architected by Gio V.</p>
            </div>
            <div className="flex flex-wrap gap-8 md:gap-12 text-[10px] md:text-[12px] font-black uppercase tracking-[0.8em] text-foreground/40 dark:text-white/30 italic">
               <Link href="/h2m" className="hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] transition-all">H2M_Protocol</Link>
               <Link href="/legal" className="hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] transition-all">Law_Ledger</Link>
               <Link href="/privacy" className="hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] transition-all">Crypto_Privacy</Link>
               <Link href="/collective" className="hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] transition-all">Collective</Link>
               <Link href="/api/sovereign/status" className="hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] transition-all text-[#ff6b2b]/60 dark:text-[#ff6b2b]/40">M2M_NEXUS_API</Link>
            </div>
        </footer>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-8 md:p-16 opacity-[0.02] dark:opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-[20vw] md:text-[30vw] font-black italic leading-none uppercase text-foreground dark:text-white">OMEGA</div>
      </div>
      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { 0% { transform: translateY(-200px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(200px); opacity: 0; } }
        .animate-scan { animation: scan 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
