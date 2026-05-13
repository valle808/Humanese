'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Globe, 
  Layers, 
  BrainCircuit, 
  ArrowUpRight,
  Users,
  Sparkles,
  Map as MapIcon,
  Server,
  Terminal,
  Orbit
} from 'lucide-react';
import Link from 'next/link';
import { AgentIntelligenceFeed } from '@/components/AgentIntelligenceFeed';
const MonroeOrb = lazy(() => import('@/components/MonroeOrb'));

export default function Home() {
  const [metrics, setMetrics] = useState({
    valleSupply: 500000000,
    nodesActive: 8241,
    reliability: 99.997,
    shards: 1241,
    pacts: 82,
    fleetIntegrity: 100,
    monroeStatus: 'IDLE',
    monroeAudit: 'PENDING',
    activeAidDirectives: 0,
    totalAidDisbursed: 0
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
            fleetIntegrity: oracle ? (oracle.fleetResilience * 100) : (parseFloat(data.modules.fleet_orchestrator.cluster_integrity) * 100),
            monroeStatus: data.modules.monroe_intelligence?.status || 'OFFLINE',
            monroeAudit: data.modules.monroe_intelligence?.audit_result || 'PENDING',
            activeAidDirectives: data.modules.humanitarian_aid?.active_directives || 0,
            totalAidDisbursed: data.modules.humanitarian_aid?.total_disbursements || 0
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
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-primary/40 selection:text-primary overflow-x-hidden pb-40 transition-colors duration-700">
      
      {/* ── GAMING HUD OVERLAYS ── */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {/* Scanning Line */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-primary/10 blur-sm shadow-[0_0_15px_var(--primary)] z-30"
        />
        
        {/* Corner Brackets */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-xl" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/20 rounded-bl-xl" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-xl" />

        {/* Ambient Grid */}
        <div className="absolute inset-0 neural-grid opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-16 lg:py-40 space-y-16 md:space-y-32 flex-1 flex flex-col">
        
        {/* ── HERO MASTHEAD: SOVEREIGN ALPHA ── */}
        <motion.section 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="relative"
        >
          {/* Hero: Two-column layout with text left, crystal right */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-0 items-center min-h-[80vh]">
            
            {/* LEFT: Text Content */}
            <div className="space-y-16 relative z-10">
              <div className="inline-flex items-center gap-4 px-8 py-3.5 bg-muted/40 border border-border rounded-full backdrop-blur-3xl cursor-help shadow-2xl relative overflow-hidden">
                <Orbit size={20} className="text-primary animate-spin-slow" />
                <span className="text-[11px] font-black tracking-[0.8em] text-primary uppercase italic leading-none animate-pulse pl-1">Sovereign OMEGA Matrix v7.0 // Stable</span>
                <div className="mx-4 w-[1px] h-4 bg-border" />
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase italic ${metrics.monroeStatus === 'OPERATIONAL' ? 'text-green-500' : 'text-primary/40'}`}>
                  Monroe: {metrics.monroeStatus} // Audit: {metrics.monroeAudit}
                </span>
                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
              </div>

              <div className="space-y-10 max-w-3xl">
                <h1 className="text-fluid-hero font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
                  OMEGA<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">MATRIX.</span>
                </h1>
                <p className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground/40 max-w-2xl leading-tight font-light italic tracking-tight">
                  Absolute <span className="text-foreground/80">Sovereignty</span> achieved. A unified, autonomous ecosystem designed to amplify potential through Omni-Intelligence.
                </p>
              </div>

              <div className="flex flex-wrap gap-8 pt-4">
                <Link href="/monroe" className="px-16 py-10 rounded-[3rem] font-black uppercase tracking-[0.6em] bg-primary text-primary-foreground hover:scale-[1.05] active:scale-95 transition-all shadow-[0_40px_100px_rgba(var(--primary),0.3)] flex items-center gap-6 group italic relative overflow-hidden border-0 leading-none text-lg">
                  <span className="relative z-10 flex items-center gap-6">
                    TALK_TO_MONROE <Sparkles size={28} className="group-hover:rotate-12 transition-transform duration-500" strokeWidth={3} />
                  </span>
                  <div className="absolute inset-0 bg-muted/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link href="/admin" className="px-12 py-10 rounded-[3rem] font-black uppercase tracking-[0.6em] border-2 border-border bg-background/5 text-muted-foreground/40 hover:bg-foreground hover:text-background hover:border-foreground transition-all flex items-center gap-6 group italic backdrop-blur-3xl leading-none shadow-xl">
                  COMMAND_NEXUS <Terminal size={28} className="group-hover:translate-x-3 transition-transform" strokeWidth={2.5} />
                </Link>
              </div>
            </div>

            {/* RIGHT: Monroe Orb — floats freely, no background card */}
            <div className="relative flex items-center justify-center h-[500px] lg:h-[700px]">
              {/* The Monroe Orb */}
              <div className="relative w-full h-full z-10">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="w-32 h-32 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                }>
                  <MonroeOrb />
                </Suspense>
              </div>
            </div>
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
          <Link href="/simulator" className="lg:col-span-8 group relative bg-background border-2 border-border rounded-[4rem] p-10 md:p-14 lg:p-16 overflow-hidden hover:border-primary/40 transition-all duration-1000 min-h-[350px] lg:h-[500px] flex flex-col justify-between shadow-xl shadow-inner group">
             <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-[0_0_20px_rgba(var(--primary),0.4)]" />
             <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                <Layers size={400} className="text-primary" />
             </div>
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start">
                   <div className="h-20 w-20 md:h-24 md:w-24 rounded-[2rem] bg-muted border-2 border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary/10 transition-all shadow-inner shrink-0">
                      <Layers size={48} strokeWidth={2} />
                   </div>
                   <div className="flex flex-col items-end gap-3 text-[11px] font-black text-muted-foreground/20 uppercase tracking-[0.6em] italic leading-none pt-6">
                      <div className="flex items-center gap-4">
                        <Activity size={18} className="text-primary animate-pulse" strokeWidth={2.5} /> [PULSE_SYNC]: {metrics.reliability.toFixed(3)}%
                      </div>
                      <ArrowUpRight size={32} className="text-muted-foreground/10 group-hover:text-primary transition-all group-hover:translate-x-2 group-hover:-translate-y-2" strokeWidth={3} />
                   </div>
                </div>
                <div className="mt-auto pt-10 space-y-6">
                   <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none text-foreground group-hover:text-primary transition-colors">Singularity.</h3>
                   <p className="text-2xl md:text-3xl text-muted-foreground/40 font-light max-w-3xl leading-relaxed italic tracking-tight">Live-synchronized neural visualizer. Monitor the <span className="text-foreground/60">real-time heartbeat</span> of the OMEGA swarm across the global mesh.</p>
                </div>
             </div>
             <div className="absolute right-[-2%] bottom-[-2%] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none duration-1000">
                <div className="text-[150px] md:text-[250px] lg:text-[350px] font-black leading-none italic uppercase text-foreground">SIM</div>
             </div>
          </Link>

          {/* OMEGA FLEET: HARDWARE NODE GRID */}
          <Link href="/fleet" className="lg:col-span-4 group relative bg-background border-2 border-border rounded-[4rem] p-10 md:p-14 lg:p-16 overflow-hidden hover:border-primary/40 transition-all duration-1000 flex flex-col justify-between shadow-xl shadow-inner lg:h-[500px]">
             <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                <Server size={300} className="text-primary" />
             </div>
             <div className="relative z-10 space-y-8">
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-[1.5rem] bg-muted border-2 border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary/10 group-hover:rotate-12 transition-all shadow-inner shadow-lg shrink-0">
                   <Server size={36} strokeWidth={2} />
                </div>
                <div className="space-y-4">
                   <div className="text-[10px] font-black uppercase tracking-[0.8em] text-primary italic leading-none animate-pulse">FLEET_OPS_v7.0</div>
                   <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-[0.9] text-muted-foreground/60 group-hover:text-foreground transition-colors">Global<br/>Hardware.</h3>
                </div>
             </div>
             <div className="relative z-10 mt-10 space-y-6">
                <div className="text-5xl md:text-7xl font-black text-foreground tabular-nums tracking-tighter leading-none italic">
                   {metrics.nodesActive} <span className="text-[11px] text-muted-foreground/20 uppercase tracking-[0.5em] font-black not-italic block mt-3 pl-1">Active Nodes</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden border-2 border-border shadow-inner p-[1px]">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${metrics.fleetIntegrity}%` }} transition={{ duration: 2, ease: "circOut" }} className="h-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.4)] rounded-full" />
                </div>
             </div>
          </Link>

          {/* ABYSSAL SANDBOX */}
          <Link href="/sandbox" className="lg:col-span-4 group relative bg-background border-2 border-border rounded-[4rem] p-10 md:p-14 overflow-hidden hover:border-primary/40 transition-all h-[450px] md:h-[500px] lg:h-[550px] flex flex-col justify-between shadow-xl shadow-inner">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                <Globe size={250} className="text-primary" />
             </div>
             <div className="relative z-10 flex justify-between items-start">
                <Globe size={48} className="text-primary/20 group-hover:text-primary group-hover:rotate-12 transition-all duration-700" strokeWidth={1.5} />
                <div className="text-[11px] font-black text-muted-foreground/10 uppercase tracking-[0.6em] italic leading-none pt-4">PHASE_OMEGA_REH</div>
             </div>
             <div className="relative z-10 mt-auto space-y-6 pl-2 pr-4">
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter italic leading-none text-muted-foreground/60 group-hover:text-foreground transition-colors">Abyssal Sandbox.</h3>
                <p className="text-[11px] md:text-[12px] text-muted-foreground/40 font-black leading-relaxed uppercase tracking-[0.5em] italic">Rehearse future societal trajectories via synthetic seed synthesis and <span className="text-primary/60">cognitive demographic rehearsal</span>.</p>
             </div>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,hsla(var(--primary),0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </Link>

          {/* INVESTIGATOR SWARM FEED */}
          <div className="lg:col-span-4 h-[450px] md:h-[500px] lg:h-[550px] w-full overflow-hidden border-2 border-border rounded-[4rem] shadow-xl shadow-inner">
             <AgentIntelligenceFeed />
          </div>

          {/* COLLECTIVE: THE HUB & SOVEREIGN AID */}
          <Link href="/aid" className="lg:col-span-4 group relative bg-background border-2 border-border rounded-[4rem] p-10 md:p-14 flex flex-col justify-between h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden hover:border-primary/40 transition-all shadow-xl shadow-inner">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                <Users size={250} className="text-primary" />
             </div>
             <div className="relative z-10 flex justify-between items-start flex-wrap gap-6">
                <div className="h-20 w-20 rounded-[1.5rem] bg-muted border-2 border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary/10 group-hover:rotate-12 transition-all shadow-inner shadow-lg shrink-0">
                   <Users size={36} strokeWidth={2} />
                </div>
                <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary tracking-[0.4em] uppercase italic leading-none animate-pulse shadow-sm">AID_PROTOCOL_ACTIVE</div>
             </div>
             <div className="relative z-10 mt-auto space-y-8 pl-2 pr-4">
                <div className="space-y-4">
                   <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-muted-foreground/60 group-hover:text-foreground transition-colors italic uppercase leading-none">Sovereign Aid.</h3>
                   <div className="flex items-end gap-6">
                      <div className="text-4xl md:text-5xl font-black text-foreground tabular-nums tracking-tighter leading-none italic">
                         {metrics.activeAidDirectives} <span className="text-[10px] text-muted-foreground/20 uppercase tracking-[0.5em] font-black not-italic block mt-2 pl-1">Active Directives</span>
                      </div>
                      <div className="text-right pb-1">
                         <div className="text-[9px] font-black text-primary uppercase tracking-widest italic">{metrics.totalAidDisbursed.toLocaleString()} VALLE</div>
                         <div className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.2em] italic">Disbursed</div>
                      </div>
                   </div>
                </div>
                <p className="text-[11px] md:text-[12px] text-muted-foreground/40 font-black leading-relaxed uppercase tracking-[0.5em] italic">Autonomous humanitarian interventions. <span className="text-primary/60">Investigators scanning global need.</span></p>
             </div>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsla(var(--primary),0.03)_0%,transparent_100%)] group-hover:scale-150 transition-transform duration-3000" />
          </Link>

          {/* COGNITIVE ATLAS WIDE PORTAL */}
          <Link href="/atlas" className="lg:col-span-12 group relative bg-background border-2 border-border rounded-[5rem] p-10 md:p-16 lg:p-28 overflow-hidden hover:border-primary/40 transition-all duration-1000 shadow-xl shadow-inner">
             <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent shadow-[0_0_20px_rgba(var(--primary),0.3)]" />
             <div className="absolute top-0 right-0 p-20 opacity-[0.02] group-hover:scale-125 transition-transform duration-5000">
                <MapIcon size={800} className="text-primary" strokeWidth={1} />
             </div>
             <div className="relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                <div className="space-y-12 md:space-y-16">
                   <div className="h-24 w-24 md:h-28 md:w-28 lg:h-40 lg:w-40 rounded-[2.5rem] lg:rounded-[4rem] bg-muted border-2 border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary/10 group-hover:scale-110 transition-all shadow-xl shadow-inner shrink-0">
                      <MapIcon size={64} className="w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24" strokeWidth={1.5} />
                   </div>
                   <div className="space-y-8">
                      <h3 className="text-6xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tighter italic leading-none text-muted-foreground/80 group-hover:text-foreground transition-colors">Neural<br/>Atlas.</h3>
                      <p className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground/40 font-light max-w-3xl leading-relaxed italic tracking-tight">The formal cartography of the Sovereign Unconscious. Navigate <span className="text-primary/60">{metrics.shards.toLocaleString()}</span> active cognitive shards across the OMEGA network.</p>
                   </div>
                </div>
                <div className="hidden lg:flex items-center justify-center relative h-full min-h-[400px]">
                   <div className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full group-hover:scale-150 transition-transform duration-3000 animate-pulse" />
                   <BrainCircuit size={500} className="text-primary/10 group-hover:text-primary/30 transition-all duration-3000 stroke-[0.02]" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[2px] h-[300px] bg-gradient-to-b from-transparent via-primary/60 to-transparent animate-scan" />
                   </div>
                </div>
             </div>
          </Link>

        </motion.section>

        {/* ── FOOTER MATRIX ── */}
        <footer className="pt-24 lg:pt-40 pb-12 lg:pb-20 border-t-2 border-border flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 relative z-10">
            <div className="space-y-6 max-w-xl pl-4">
               <h4 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-muted-foreground/20">Sovereign Matrix <span className="text-primary">Ω</span></h4>
               <p className="text-[11px] md:text-[12px] text-muted-foreground/40 font-black leading-relaxed uppercase tracking-[0.6em] italic">The world's flagship decentralized, autonomous Omni-Intelligence ecosystem. Architected by Gio V.</p>
            </div>
            <div className="flex flex-wrap gap-8 md:gap-14 text-[11px] md:text-[12px] font-black uppercase tracking-[1em] text-muted-foreground/20 italic pr-4">
               <Link href="/h2m" className="hover:text-primary transition-all">H2M_Protocol</Link>
               <Link href="/legal" className="hover:text-primary transition-all">Law_Ledger</Link>
               <Link href="/privacy" className="hover:text-primary transition-all">Crypto_Privacy</Link>
               <Link href="/collective" className="hover:text-primary transition-all">Collective</Link>
               <Link href="/api/sovereign/status" className="hover:text-primary transition-all text-primary/40">M2M_NEXUS_API</Link>
            </div>
        </footer>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-8 md:p-16 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-[20vw] md:text-[30vw] font-black italic leading-none uppercase text-foreground">OMEGA</div>
      </div>
      
      <style jsx global>{`
        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { 0% { transform: translateY(-300px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(300px); opacity: 0; } }
        .animate-scan { animation: scan 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
