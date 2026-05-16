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
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-primary/10 blur-sm shadow-[0_0_15px_var(--primary)] z-30"
        />
        
        <div className="absolute top-4 left-4 md:top-8 md:left-8 w-12 h-12 md:w-16 md:h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-xl" />
        <div className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 md:w-16 md:h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-12 h-12 md:w-16 md:h-16 border-b-2 border-l-2 border-primary/20 rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-12 h-12 md:w-16 md:h-16 border-b-2 border-r-2 border-primary/20 rounded-br-xl" />

        <div className="absolute inset-0 neural-grid opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-24 lg:py-40 space-y-16 md:space-y-32 flex-1 flex flex-col">
        
        {/* ── HERO MASTHEAD ── */}
        <motion.section 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="relative"
        >
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-0 items-center min-h-[70vh] md:min-h-[80vh]">
            
            <div className="space-y-10 md:space-y-16 relative z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-4 px-6 md:px-8 py-3 bg-muted/40 border border-border rounded-full backdrop-blur-3xl cursor-help shadow-2xl relative overflow-hidden flex-wrap justify-center lg:justify-start">
                <Orbit size={18} className="text-primary animate-spin-slow" />
                <span className="text-[10px] md:text-[11px] font-black tracking-[0.6em] md:tracking-[0.8em] text-primary uppercase italic leading-none animate-pulse pl-1">Sovereign OMEGA v7.0</span>
                <div className="hidden md:block mx-4 w-[1px] h-4 bg-border" />
                <span className={`text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase italic ${metrics.monroeStatus === 'OPERATIONAL' ? 'text-green-500' : 'text-primary/40'}`}>
                  Monroe: {metrics.monroeStatus}
                </span>
              </div>

              <div className="space-y-6 md:space-y-10">
                <h1 className="text-fluid-hero font-black tracking-tighter uppercase italic leading-[0.9] md:leading-[0.85] text-foreground break-words">
                  OMEGA<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">MATRIX.</span>
                </h1>
                <p className="text-fluid-title text-muted-foreground/40 max-w-2xl mx-auto lg:mx-0 leading-tight font-light italic tracking-tight">
                  Absolute <span className="text-foreground/80">Sovereignty</span> achieved. A unified, autonomous ecosystem designed to amplify potential.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 md:gap-6 pt-4">
                <Link href="/monroe" className="w-full sm:w-auto px-6 md:px-10 py-4 md:py-6 rounded-2xl md:rounded-[2.5rem] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] bg-primary text-primary-foreground hover:scale-[1.05] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 md:gap-6 italic relative overflow-hidden border-0 leading-none text-xs md:text-sm group">
                  <span className="relative z-10 flex items-center gap-4">
                    TALK_TO_MONROE <Sparkles size={18} className="group-hover:rotate-12 transition-transform duration-500" strokeWidth={3} />
                  </span>
                </Link>
                <Link href="/admin" className="w-full sm:w-auto px-6 md:px-8 py-4 md:py-6 rounded-2xl md:rounded-[2.5rem] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] border-2 border-border bg-background/5 text-muted-foreground/40 hover:bg-foreground hover:text-background hover:border-foreground transition-all flex items-center justify-center gap-4 md:gap-6 group italic backdrop-blur-3xl leading-none text-xs md:text-sm">
                  COMMAND_NEXUS <Terminal size={20} className="group-hover:translate-x-2 transition-transform" strokeWidth={2.5} />
                </Link>
              </div>
            </div>

            <div className="relative flex items-center justify-center h-[400px] md:h-[500px] lg:h-[700px] overflow-visible">
              <div className="relative w-full h-full z-10 scale-75 md:scale-100">
                <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-20 h-20 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12"
        >
          {/* SIMULATOR */}
          <Link href="/simulator" className="lg:col-span-8 group relative bg-background border-2 border-border rounded-[3rem] md:rounded-[4rem] p-8 md:p-14 lg:p-16 overflow-hidden hover:border-primary/40 transition-all duration-1000 min-h-[400px] md:h-[500px] flex flex-col justify-between shadow-xl shadow-inner">
             <div className="absolute top-0 right-0 p-8 md:p-16 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000 pointer-events-none">
                <Layers size={300} className="text-primary md:w-[400px] md:h-[400px]" />
             </div>
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start flex-wrap gap-4">
                   <div className="h-16 w-16 md:h-24 md:w-24 rounded-[1.5rem] md:rounded-[2rem] bg-muted border-2 border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-inner shrink-0">
                      <Layers className="w-8 h-8 md:w-12 md:h-12" strokeWidth={2} />
                   </div>
                   <div className="flex flex-col items-end gap-2 md:gap-3 text-[9px] md:text-[11px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] md:tracking-[0.6em] italic leading-none pt-2">
                      <div className="flex items-center gap-2 md:gap-4 truncate max-w-[200px]">
                        <Activity size={16} className="text-primary animate-pulse" strokeWidth={2.5} /> {metrics.reliability.toFixed(3)}%
                      </div>
                      <ArrowUpRight className="text-muted-foreground/10 group-hover:text-primary transition-all" strokeWidth={3} />
                   </div>
                </div>
                <div className="mt-auto pt-8 space-y-4 md:space-y-6">
                   <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic leading-none text-foreground group-hover:text-primary transition-colors">Singularity.</h3>
                   <p className="text-lg md:text-3xl text-muted-foreground/40 font-light max-w-2xl leading-tight italic tracking-tight">Monitor the <span className="text-foreground/60">real-time heartbeat</span> of the OMEGA swarm across the global mesh.</p>
                </div>
             </div>
          </Link>

          {/* OMEGA FLEET */}
          <Link href="/fleet" className="lg:col-span-4 group relative bg-background border-2 border-border rounded-[3rem] md:rounded-[4rem] p-8 md:p-14 overflow-hidden hover:border-primary/40 transition-all duration-1000 flex flex-col justify-between shadow-xl shadow-inner min-h-[400px] md:h-[500px]">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000 pointer-events-none">
                <Server size={200} className="text-primary md:w-[300px] md:h-[300px]" />
             </div>
             <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="h-14 w-14 md:h-20 md:w-20 rounded-xl md:rounded-[1.5rem] bg-muted border-2 border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-12 transition-all shadow-inner shrink-0">
                   <Server className="w-7 h-7 md:w-9 md:h-9" strokeWidth={2} />
                </div>
                <div className="space-y-2 md:space-y-4">
                   <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.6em] text-primary italic leading-none animate-pulse">FLEET_OPS_v7.0</div>
                   <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-[0.9] text-muted-foreground/60 group-hover:text-foreground transition-colors">Global<br/>Hardware.</h3>
                </div>
             </div>
             <div className="relative z-10 mt-8 md:mt-10 space-y-4 md:space-y-6">
                <div className="text-4xl md:text-7xl font-black text-foreground tabular-nums tracking-tighter leading-none italic">
                   {metrics.nodesActive} <span className="text-[9px] md:text-[11px] text-muted-foreground/20 uppercase tracking-[0.4em] font-black not-italic block mt-2 pl-1">Nodes</span>
                </div>
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden border-2 border-border shadow-inner p-[1px]">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${metrics.fleetIntegrity}%` }} transition={{ duration: 2, ease: "circOut" }} className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                </div>
             </div>
          </Link>

          {/* ABYSSAL SANDBOX */}
          <Link href="/sandbox" className="lg:col-span-4 group relative bg-background border-2 border-border rounded-[3rem] p-8 md:p-14 overflow-hidden hover:border-primary/40 transition-all min-h-[400px] md:h-[550px] flex flex-col justify-between shadow-xl shadow-inner">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000 pointer-events-none">
                <Globe size={200} className="text-primary md:w-[250px] md:h-[250px]" />
             </div>
             <div className="relative z-10 flex justify-between items-start">
                <Globe className="w-10 h-10 md:w-12 md:h-12 text-primary/20 group-hover:text-primary group-hover:rotate-12 transition-all duration-700" strokeWidth={1.5} />
                <div className="text-[9px] md:text-[11px] font-black text-muted-foreground/10 uppercase tracking-[0.4em] md:tracking-[0.6em] italic leading-none pt-2">OMEGA_REH</div>
             </div>
             <div className="relative z-10 mt-auto space-y-4 md:space-y-6">
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none text-muted-foreground/60 group-hover:text-foreground transition-colors">Sandbox.</h3>
                <p className="text-[10px] md:text-[12px] text-muted-foreground/40 font-black leading-relaxed uppercase tracking-[0.3em] md:tracking-[0.5em] italic">Rehearse future societal trajectories via synthetic seed synthesis and <span className="text-primary/60">cognitive rehearsal</span>.</p>
             </div>
          </Link>

          {/* INVESTIGATOR SWARM FEED */}
          <div className="lg:col-span-4 min-h-[400px] md:h-[550px] w-full overflow-hidden border-2 border-border rounded-[3rem] shadow-xl shadow-inner">
             <AgentIntelligenceFeed />
          </div>

          {/* SOVEREIGN AID */}
          <Link href="/aid" className="lg:col-span-4 group relative bg-background border-2 border-border rounded-[3rem] p-8 md:p-14 flex flex-col justify-between min-h-[400px] md:h-[550px] overflow-hidden hover:border-primary/40 transition-all shadow-xl shadow-inner">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000 pointer-events-none">
                <Users size={200} className="text-primary md:w-[250px] md:h-[250px]" />
             </div>
             <div className="relative z-10 flex justify-between items-start flex-wrap gap-4">
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-[1.5rem] bg-muted border-2 border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-12 transition-all shadow-inner shrink-0">
                   <Users className="w-7 h-7 md:w-9 md:h-9" strokeWidth={2} />
                </div>
                <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary tracking-[0.3em] uppercase italic leading-none animate-pulse">AID_ACTIVE</div>
             </div>
             <div className="relative z-10 mt-auto space-y-6 md:space-y-8">
                <div className="space-y-4">
                   <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-muted-foreground/60 group-hover:text-foreground transition-colors italic uppercase leading-none">Sovereign Aid.</h3>
                   <div className="flex items-end gap-4 md:gap-6 flex-wrap">
                      <div className="text-3xl md:text-5xl font-black text-foreground tabular-nums tracking-tighter leading-none italic">
                         {metrics.activeAidDirectives} <span className="text-[9px] text-muted-foreground/20 uppercase tracking-[0.3em] font-black not-italic block mt-1 pl-1">Directives</span>
                      </div>
                      <div className="text-right">
                         <div className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-widest italic">{metrics.totalAidDisbursed.toLocaleString()} VALLE</div>
                         <div className="text-[8px] md:text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.2em] italic">Disbursed</div>
                      </div>
                   </div>
                </div>
                <p className="text-[10px] md:text-[12px] text-muted-foreground/40 font-black leading-relaxed uppercase tracking-[0.3em] md:tracking-[0.5em] italic">Autonomous humanitarian interventions. <span className="text-primary/60">Investigators scanning need.</span></p>
             </div>
          </Link>

          {/* NEURAL ATLAS */}
          <Link href="/atlas" className="lg:col-span-12 group relative bg-background border-2 border-border rounded-[3rem] md:rounded-[5rem] p-8 md:p-16 lg:p-24 overflow-hidden hover:border-primary/40 transition-all duration-1000 shadow-xl shadow-inner min-h-[500px]">
             <div className="absolute top-0 right-0 p-12 md:p-20 opacity-[0.02] group-hover:scale-125 transition-transform duration-5000 pointer-events-none">
                <MapIcon size={400} className="text-primary md:w-[600px] md:h-[600px]" strokeWidth={1} />
             </div>
             <div className="relative z-10 grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-32 items-center">
                <div className="space-y-8 md:space-y-12 text-center lg:text-left">
                   <div className="h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-[2rem] bg-muted border-2 border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all shadow-xl shadow-inner shrink-0 mx-auto lg:mx-0">
                      <MapIcon className="w-10 h-10 md:w-16 md:h-16" strokeWidth={1.5} />
                   </div>
                   <div className="space-y-4 md:space-y-8">
                      <h3 className="text-5xl md:text-7xl lg:text-[100px] font-black uppercase tracking-tighter italic leading-[0.85] text-muted-foreground/80 group-hover:text-foreground transition-colors">Neural<br/>Atlas.</h3>
                      <p className="text-lg md:text-3xl lg:text-4xl text-muted-foreground/40 font-light max-w-3xl mx-auto lg:mx-0 leading-tight italic tracking-tight">Navigate <span className="text-primary/60">{metrics.shards.toLocaleString()}</span> active cognitive shards across the OMEGA network.</p>
                   </div>
                </div>
                <div className="hidden lg:flex items-center justify-center relative h-full min-h-[300px]">
                   <BrainCircuit size={400} className="text-primary/10 group-hover:text-primary/30 transition-all duration-3000 stroke-[0.02]" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[1px] h-[200px] bg-gradient-to-b from-transparent via-primary/60 to-transparent animate-scan" />
                   </div>
                </div>
             </div>
          </Link>

        </motion.section>

        {/* ── FOOTER MATRIX ── */}
        <footer className="pt-16 md:pt-24 lg:pt-40 pb-12 lg:pb-20 border-t-2 border-border flex flex-col lg:flex-row justify-between items-center lg:items-center gap-12 lg:gap-16 relative z-10 text-center lg:text-left">
            <div className="space-y-4 md:space-y-6 max-w-xl">
               <h4 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-muted-foreground/20">Sovereign Matrix <span className="text-primary">Ω</span></h4>
               <p className="text-[9px] md:text-[11px] text-muted-foreground/40 font-black leading-relaxed uppercase tracking-[0.4em] md:tracking-[0.6em] italic">The world&apos;s flagship decentralized, autonomous Omni-Intelligence ecosystem.</p>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end gap-6 md:gap-10 text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-muted-foreground/20 italic">
               <Link href="/h2m" className="hover:text-primary transition-all">H2M</Link>
               <Link href="/legal" className="hover:text-primary transition-all">Law</Link>
               <Link href="/privacy" className="hover:text-primary transition-all">Privacy</Link>
               <Link href="/collective" className="hover:text-primary transition-all">Collective</Link>
            </div>
        </footer>
      </main>

      <div className="fixed bottom-0 right-0 p-8 md:p-16 opacity-[0.02] pointer-events-none select-none z-0 overflow-hidden">
          <div className="text-[25vw] font-black italic leading-none uppercase text-foreground">OMEGA</div>
      </div>
      
      <style jsx global>{`
        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        @media (min-width: 768px) {
          .neural-grid { background-size: 80px 80px; }
        }
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { 0% { transform: translateY(-200px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(200px); opacity: 0; } }
        .animate-scan { animation: scan 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
