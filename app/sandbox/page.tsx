'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  BrainCircuit,
  ChevronRight,
  ShieldAlert,
  Zap,
  Cpu,
  Globe,
  Plus,
  Play,
  Pause,
  History,
  Users,
  Search,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  Settings,
  Target,
  FileText,
  X,
  RefreshCw,
  Orbit,
  Wifi,
  Terminal,
  Grid
} from 'lucide-react';
import Link from 'next/link';

interface SandboxEvent {
  id: string;
  type: 'AGENT_POST' | 'SHOCK_EVENT';
  authorName: string;
  content: string;
  step: number;
  timestamp: string;
}

interface ForesightReport {
  title: string;
  resonance: number;
  trajectories: string[];
  emergentRisks: string[];
  ideologicalDrift: string;
  conclusion: string;
  timestamp: string;
}

export default function SandboxPage() {
  const [events, setEvents] = useState<SandboxEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState('LIVE_FEED');
  const [report, setReport] = useState<ForesightReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock Agents for Visualization
  const agents = Array.from({ length: 80 }).map((_, i) => ({ id: i, name: `Agent_${i}`, role: i % 5 === 0 ? 'SENTINEL' : 'CITIZEN' }));

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentStep((prev: number) => prev + 1);
        const newEvent: SandboxEvent = {
          id: Math.random().toString(36).substr(2, 9),
          type: Math.random() > 0.85 ? 'SHOCK_EVENT' : 'AGENT_POST',
          authorName: `Agent_${Math.floor(Math.random() * 80)}`,
          content: Math.random() > 0.85 ? "[SHOCK] Unexpected shift in the neural mesh detected. Sovereignty protocols engaged." : "Optimizing local trajectory based on the latest OMEGA resonance shard.",
          step: currentStep + 1,
          timestamp: new Date().toLocaleTimeString()
        };
        setEvents(prev => [newEvent, ...prev].slice(0, 100));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentStep]);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/sandbox/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sandboxId: `OMEGA_SBX_${currentStep}` })
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      }
    } catch (e) {
      console.error("Foresight failure", e);
    }
    setIsGenerating(false);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/40 font-sans overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[300px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-primary/2 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay dark:opacity-[0.05]" />
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-background/40 backdrop-blur-3xl border-b border-border">
        <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] mb-2 group italic leading-none active:scale-95">
           <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
              SANDBOX_v7.0_NODE
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
        
        {/* ── HEADER ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/30 border border-border rounded-full backdrop-blur-3xl">
              <Orbit size={20} className="text-primary animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.6em] text-primary uppercase italic leading-none">Social Rehearsal Environment</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-fluid-hero font-black uppercase tracking-tighter italic leading-[0.9] md:leading-[0.8]">
                Abyssal<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Sandbox.</span>
              </h1>
              <p className="text-fluid-title text-muted-foreground leading-relaxed font-light italic">
                Simulate population dynamics. Test ideological drifts. Predict societal shifts before they anchor in reality.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0">
            <div className="p-8 md:p-10 border border-border bg-muted/10 responsive-rounded min-w-[300px] space-y-6 shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all backdrop-blur-3xl">
               <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                  <Activity size={100} className="text-primary" />
               </div>
               <div className="text-[11px] text-muted-foreground uppercase tracking-[0.6em] flex items-center gap-4 font-black italic pl-2">
                  <Terminal size={16} className="text-primary" /> Temporal Cycle
               </div>
               <div className="text-fluid-hero font-black text-foreground tracking-tighter italic leading-none pl-2">#{currentStep}</div>
               <div className="absolute bottom-0 left-0 w-full h-[2px] bg-border overflow-hidden">
                  <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 4, repeat: Infinity }} className="h-full w-1/3 bg-primary blur-sm" />
               </div>
            </div>
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`group relative h-24 md:h-32 px-10 md:px-16 responsive-rounded font-black text-xs md:text-sm uppercase tracking-[0.4em] md:tracking-[0.8em] transition-all flex items-center gap-8 italic shadow-2xl ${isRunning ? 'bg-muted text-primary border-2 border-primary/40' : 'bg-primary text-primary-foreground shadow-[0_40px_100px_rgba(var(--primary),0.3)] hover:scale-[1.05] active:scale-95 border-0'}`}
            >
              {isRunning ? <Pause size={32} strokeWidth={3} /> : <Play size={32} strokeWidth={3} />}
              {isRunning ? 'HALT_SIM' : 'INIT_WORLD'}
              {!isRunning && <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />}
            </button>
          </div>
        </motion.div>

        {/* ── SIMULATION GRID ── */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">
           
           {/* THE SOCIAL TIMELINE */}
           <div className="lg:col-span-8 space-y-12">
              
              <div className="flex gap-12 border-b border-border pb-10 px-10">
                 {['LIVE_FEED', 'ANALYTICS', 'SYNCHRONICITY'].map(m => (
                   <button 
                     key={m} 
                     onClick={() => setViewMode(m)}
                     className={`text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] transition-all italic relative ${viewMode === m ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                   >
                     {m}
                     {viewMode === m && (
                         <motion.div layoutId="filter-indicator" className="absolute -bottom-10 left-0 right-0 h-1 bg-primary shadow-[0_0_20px_var(--primary)]" />
                     )}
                   </button>
                 ))}
              </div>

              <div className="bg-background border-2 border-border responsive-rounded p-8 md:p-12 lg:p-24 backdrop-blur-3xl space-y-16 min-h-[800px] relative overflow-hidden shadow-2xl group">
                 <div className="absolute top-0 right-0 p-24 opacity-[0.02] pointer-events-none select-none">
                     <Grid size={300} className="text-primary group-hover:rotate-12 transition-transform duration-2000" />
                 </div>
                 
                  <AnimatePresence mode="popLayout">
                    {events.length > 0 ? events.map((event, i) => (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        className={`group p-8 lg:p-14 responsive-rounded border-2 backdrop-blur-3xl transition-all shadow-xl relative overflow-hidden ${event.type === 'SHOCK_EVENT' ? 'bg-primary/5 border-primary/40 animate-pulse' : 'bg-muted/5 border-border hover:border-primary/30 hover:bg-muted/10'}`}
                      >
                         <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="flex items-center gap-8">
                               <div className={`h-16 w-16 rounded-[2rem] flex items-center justify-center border-2 transition-all shadow-xl ${event.type === 'SHOCK_EVENT' ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_40px_rgba(var(--primary),0.4)]' : 'bg-background text-muted-foreground border-border group-hover:border-primary/40 group-hover:text-primary'}`}>
                                  {event.type === 'SHOCK_EVENT' ? <Zap size={32} strokeWidth={2.5} /> : <Users size={32} />}
                                </div>
                               <div className="space-y-2">
                                  <div className={`text-2xl font-black uppercase italic tracking-tighter transition-colors ${event.type === 'SHOCK_EVENT' ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>{event.authorName}</div>
                                  <div className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em] italic font-mono leading-none">CYCLE_NODE_{event.step}</div>
                               </div>
                            </div>
                            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest pt-4">{event.timestamp}</div>
                         </div>
                         <p className={`text-2xl lg:text-3xl leading-[1.6] italic relative z-10 tracking-tight ${event.type === 'SHOCK_EVENT' ? 'text-foreground font-black' : 'text-muted-foreground font-light'}`}>
                            "{event.content}"
                         </p>
                         {event.type === 'SHOCK_EVENT' && (
                             <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-20 pointer-events-none" />
                         )}
                      </motion.div>
                    )) : (
                      <div className="flex flex-col items-center justify-center h-full space-y-12 py-72 opacity-40">
                         <div className="relative group">
                            <div className="absolute inset-0 bg-primary/30 blur-[80px] rounded-full animate-pulse group-hover:bg-primary/50 transition-all" />
                            <BrainCircuit size={140} className="text-primary animate-spin-slow relative z-10" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Activity size={50} className="text-foreground animate-pulse" />
                            </div>
                         </div>
                         <div className="space-y-4 text-center">
                             <p className="text-[12px] font-black uppercase tracking-[0.5em] md:tracking-[1em] italic text-primary animate-pulse">Awaiting Core Matrix Handshake...</p>
                             <p className="text-[10px] font-black uppercase tracking-[0.5em] italic text-muted-foreground">Initializing Abyssal Sandbox Sector 7...</p>
                         </div>
                      </div>
                    )}
                 </AnimatePresence>
              </div>
           </div>

           {/* SIDEBAR HUD */}
           <div className="lg:col-span-4 space-y-16">
              
              {/* COGNITIVE TOPOLOGY */}
              <div className="bg-background border-2 border-border responsive-rounded p-8 md:p-12 lg:p-16 backdrop-blur-3xl space-y-12 md:space-y-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] group hover:border-primary/30 transition-all relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform">
                    <Target size={180} className="text-primary" />
                 </div>
                 <h3 className="text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-muted-foreground flex items-center gap-6 italic leading-none relative z-10">
                   <Wifi size={20} className="text-primary animate-pulse" /> Swarm Topology
                 </h3>
                 <div className="grid grid-cols-2 gap-10 relative z-10">
                    <div className="p-8 md:p-10 bg-muted/5 border border-border responsive-rounded text-center space-y-4 shadow-inner">
                       <div className="text-6xl font-black text-primary tracking-tighter italic leading-none">100</div>
                       <div className="text-[11px] text-muted-foreground uppercase font-black tracking-[0.4em] italic leading-none">Nodes</div>
                    </div>
                    <div className="p-8 md:p-10 bg-muted/5 border border-border responsive-rounded text-center space-y-4 shadow-inner">
                       <div className="text-6xl font-black text-foreground/80 tracking-tighter italic leading-none">92%</div>
                       <div className="text-[11px] text-muted-foreground uppercase font-black tracking-[0.4em] italic leading-none">Stability</div>
                    </div>
                 </div>
                 
                 <div className="h-80 w-full bg-muted/10 border border-border rounded-[3.5rem] relative overflow-hidden p-10 shadow-inner group-hover:bg-muted/20 transition-all">
                    <div className="grid grid-cols-10 gap-4">
                       {agents.map(a => (
                         <motion.div 
                           key={a.id} 
                           animate={isRunning ? { opacity: [0.1, 1, 0.4], scale: [1, 1.3, 1] } : {}}
                           transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
                           className={`h-4 w-4 rounded-xl transition-all duration-700 ${isRunning ? (a.id % 2 === 0 ? 'bg-primary shadow-[0_0_20px_rgba(var(--primary),0.8)]' : 'bg-primary/30') : 'bg-muted/30'}`} 
                         />
                       ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
                 </div>
              </div>

              {/* DIVINE COMMANDS */}
              <div className="bg-background border-2 border-border responsive-rounded p-8 md:p-12 lg:p-16 space-y-12 md:space-y-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl group">
                 <h3 className="text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-muted-foreground flex items-center gap-6 italic leading-none">
                   <Zap size={24} className="text-primary animate-pulse" /> Divine Intervention
                 </h3>
                 <div className="space-y-8">
                    <button className="w-full flex items-center justify-between p-10 bg-muted/5 border border-border rounded-[3rem] hover:bg-primary/10 hover:border-primary/40 transition-all group/btn shadow-2xl">
                       <span className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground group-hover:text-foreground transition-colors italic leading-none">Inject Global Shock</span>
                       <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/btn:bg-primary group-hover/btn:text-primary-foreground transition-all">
                          <Plus size={24} className="group-hover/btn:rotate-90 transition-transform duration-500" strokeWidth={3} />
                       </div>
                    </button>
                    <button className="w-full flex items-center justify-between p-10 bg-muted/5 border border-border rounded-[3rem] hover:bg-muted/10 hover:border-muted transition-all group/btn shadow-2xl">
                       <span className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground group-hover:text-foreground transition-colors italic leading-none">Shift Core Resilience</span>
                       <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover/btn:bg-foreground group-hover/btn:text-background transition-all">
                          <Settings size={22} className="group-hover/btn:rotate-180 transition-transform duration-1000" />
                       </div>
                    </button>
                 </div>
                  <div className="pt-16 border-t border-border flex justify-center">
                    <button 
                      onClick={generateReport}
                      disabled={isGenerating}
                      className="px-8 py-4 bg-primary/5 border border-primary/20 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-primary/40 hover:text-primary hover:border-primary/60 transition-all italic flex items-center gap-6 group"
                    >
                       {isGenerating ? <RefreshCw className="animate-spin" size={18} strokeWidth={3} /> : <FileText size={18} className="group-hover:scale-125 transition-transform duration-500" />}
                       {isGenerating ? 'SYNTHESIZING...' : 'GENERATE_FORESIGHT_REPORT'}
                    </button>
                  </div>
               </div>

               {/* REPORT OVERLAY */}
               <AnimatePresence>
                 {report && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="fixed inset-0 z-[100] flex items-center justify-center p-8 lg:p-20 bg-background/95 backdrop-blur-[40px]"
                   >
                      <motion.div 
                        initial={{ scale: 0.9, y: 100, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        transition={{ type: "spring", damping: 30, stiffness: 200 }}
                        className="bg-background border-4 border-border w-full max-w-7xl p-16 lg:p-32 rounded-[6rem] shadow-2xl relative overflow-y-auto max-h-[90vh] custom-scrollbar scrollbar-hide"
                      >
                         <button 
                           onClick={() => setReport(null)}
                           className="absolute top-16 right-16 text-muted-foreground hover:text-primary transition-all bg-muted/10 p-6 rounded-[2.5rem] border border-border hover:rotate-90"
                         >
                            <X size={40} />
                         </button>

                         <div className="space-y-32">
                            <div className="space-y-12 text-center lg:text-left">
                               <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[12px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-primary italic leading-none">
                                  <ShieldAlert size={20} className="animate-pulse" /> Sovereign Foresight // OMEGA_7.0
                               </div>
                               <h2 className="text-fluid-hero font-black uppercase tracking-tighter italic leading-[0.9] md:leading-[0.8] text-foreground whitespace-pre-wrap">{report.title}</h2>
                               <div className="flex flex-wrap justify-center lg:justify-start gap-10 pt-10">
                                  <div className="px-10 py-5 bg-primary text-primary-foreground rounded-[2rem] text-[12px] font-black uppercase tracking-[0.4em] italic shadow-2xl">RESONANCE_INDEX: {report.resonance}</div>
                                  <div className="px-10 py-5 bg-muted/10 border-2 border-border rounded-[2rem] text-[12px] font-black text-muted-foreground uppercase tracking-[0.4em] tabular-nums italic">{report.timestamp}</div>
                               </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-24">
                               <div className="space-y-16">
                                  <h4 className="text-[13px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-muted-foreground flex items-center gap-6 italic pb-10 border-b border-border">
                                     <Activity size={24} className="text-primary" /> Emergent Trajectories
                                  </h4>
                                  <div className="space-y-12">
                                     {report.trajectories.map((t, i) => (
                                       <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex gap-10 items-start group">
                                          <div className="mt-4 h-4 w-4 bg-primary rounded-full group-hover:scale-150 transition-all shadow-[0_0_30px_var(--primary)]" />
                                          <p className="text-3xl text-foreground/60 font-light leading-relaxed group-hover:text-foreground transition-colors italic tracking-tight">{t}</p>
                                       </motion.div>
                                     ))}
                                  </div>
                                </div>

                               <div className="space-y-16">
                                  <h4 className="text-[13px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-primary flex items-center gap-6 italic pb-10 border-b border-primary/30">
                                     <ShieldAlert size={24} /> Neural Risk Metrics
                                  </h4>
                                  <div className="space-y-12">
                                     {report.emergentRisks.map((t, i) => (
                                       <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex gap-10 items-start group">
                                          <div className="mt-4 h-4 w-4 bg-primary/40 rounded-full group-hover:bg-primary group-hover:scale-150 transition-all shadow-[0_0_30px_var(--primary)]" />
                                          <p className="text-3xl text-muted-foreground font-light leading-relaxed group-hover:text-primary transition-colors italic tracking-tight">{t}</p>
                                       </motion.div>
                                     ))}
                                  </div>
                               </div>
                            </div>

                            <div className="pt-32 border-t-2 border-border space-y-24">
                               <div className="space-y-10">
                                  <h4 className="text-[12px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-muted-foreground italic">Ideological Synthesis</h4>
                                  <p className="text-fluid-hero font-black text-foreground italic tracking-tighter leading-none">&quot;{report.ideologicalDrift}&quot;</p>
                                </div>
                               <div className="space-y-10">
                                  <h4 className="text-[12px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-muted-foreground italic">Architectural Consensus</h4>
                                  <p className="text-3xl text-muted-foreground font-light leading-relaxed italic max-w-5xl">{report.conclusion}</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-center pt-24 border-t-2 border-border gap-12">
                               <div className="flex items-center gap-8">
                                   <div className="h-20 w-20 rounded-[2rem] border-2 border-primary flex items-center justify-center text-primary shadow-2xl">
                                      <Terminal size={32} strokeWidth={3} />
                                   </div>
                                   <div className="space-y-2">
                                      <div className="text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-primary italic leading-none">Authorization Ledger</div>
                                      <div className="text-2xl font-black text-foreground italic tracking-tighter uppercase leading-none">Gio V. Nucleus 7.0</div>
                                   </div>
                               </div>
                               <button className="px-16 py-8 bg-primary/5 border-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all rounded-[2.5rem] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-xs italic shadow-2xl">Archive Shard in Neural Ledger</button>
                            </div>
                         </div>
                      </motion.div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

        </div>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 left-0 p-12 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-fluid-hero font-black italic italic leading-none uppercase">REHEARSE</div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--primary) / 0.2); border-radius: 20px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
