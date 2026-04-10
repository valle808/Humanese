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
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[300px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/2 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] mb-2 group italic leading-none active:scale-95">
           <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
              SANDBOX_v7.0_NODE
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 space-y-32">
        
        {/* ── HEADER ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl">
              <Orbit size={20} className="text-[#ff6b2b] animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Social Rehearsal Environment</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8]">
                Abyssal<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Sandbox.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/40 leading-relaxed font-light italic">
                Simulate population dynamics. Test ideological drifts. Predict societal shifts before they anchor in reality.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0">
            <div className="p-10 border border-white/10 bg-white/[0.01] rounded-[3.5rem] min-w-[300px] space-y-6 shadow-2xl relative overflow-hidden group hover:border-[#ff6b2b]/30 transition-all backdrop-blur-3xl">
               <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                  <Activity size={100} className="text-[#ff6b2b]" />
               </div>
               <div className="text-[11px] text-white/20 uppercase tracking-[0.6em] flex items-center gap-4 font-black italic pl-2">
                  <Terminal size={16} className="text-[#ff6b2b]" /> Temporal Cycle
               </div>
               <div className="text-7xl font-black text-white tracking-tighter italic leading-none pl-2">#{currentStep}</div>
               <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 overflow-hidden">
                  <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 4, repeat: Infinity }} className="h-full w-1/3 bg-[#ff6b2b] blur-sm" />
               </div>
            </div>
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`group relative h-32 px-16 rounded-[4rem] font-black text-sm uppercase tracking-[0.8em] transition-all flex items-center gap-8 italic shadow-2xl ${isRunning ? 'bg-white/5 text-[#ff6b2b] border-2 border-[#ff6b2b]/40' : 'bg-[#ff6b2b] text-black shadow-[0_40px_100px_rgba(255,107,43,0.3)] hover:scale-[1.05] active:scale-95'}`}
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
              
              <div className="flex gap-12 border-b border-white/5 pb-10 px-10">
                 {['LIVE_FEED', 'ANALYTICS', 'SYNCHRONICITY'].map(m => (
                   <button 
                     key={m} 
                     onClick={() => setViewMode(m)}
                     className={`text-[11px] font-black uppercase tracking-[0.8em] transition-all italic relative ${viewMode === m ? 'text-[#ff6b2b]' : 'text-white/20 hover:text-white'}`}
                   >
                     {m}
                     {viewMode === m && (
                         <motion.div layoutId="filter-indicator" className="absolute -bottom-10 left-0 right-0 h-1 bg-[#ff6b2b] shadow-[0_0_20px_#ff6b2b]" />
                     )}
                   </button>
                 ))}
              </div>

              <div className="bg-[#050505] border border-white/10 rounded-[5rem] p-12 lg:p-24 backdrop-blur-3xl space-y-16 min-h-[800px] relative overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,0.9)] group">
                 <div className="absolute top-0 right-0 p-24 opacity-[0.02] pointer-events-none select-none">
                     <Grid size={300} className="text-[#ff6b2b] group-hover:rotate-12 transition-transform duration-2000" />
                 </div>
                 
                 <AnimatePresence mode="popLayout">
                    {events.length > 0 ? events.map((event, i) => (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        className={`group p-10 lg:p-14 rounded-[4rem] border-2 backdrop-blur-3xl transition-all shadow-[0_30px_80px_rgba(0,0,0,0.8)] relative overflow-hidden ${event.type === 'SHOCK_EVENT' ? 'bg-[#ff6b2b]/5 border-[#ff6b2b]/40 animate-pulse' : 'bg-white/[0.01] border-white/5 hover:border-[#ff6b2b]/30 hover:bg-white/[0.02]'}`}
                      >
                         <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="flex items-center gap-8">
                               <div className={`h-16 w-16 rounded-[2rem] flex items-center justify-center border-2 transition-all shadow-2xl ${event.type === 'SHOCK_EVENT' ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_0_40px_rgba(255,107,43,0.4)]' : 'bg-black/60 text-white/20 border-white/10 group-hover:border-[#ff6b2b]/40 group-hover:text-[#ff6b2b]'}`}>
                                  {event.type === 'SHOCK_EVENT' ? <Zap size={32} strokeWidth={2.5} /> : <Users size={32} />}
                                </div>
                               <div className="space-y-2">
                                  <div className={`text-2xl font-black uppercase italic tracking-tighter transition-colors ${event.type === 'SHOCK_EVENT' ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>{event.authorName}</div>
                                  <div className="text-[10px] font-black text-[#ff6b2b]/40 uppercase tracking-[0.4em] italic font-mono leading-none">CYCLE_NODE_{event.step}</div>
                               </div>
                            </div>
                            <div className="text-[10px] font-mono text-white/10 uppercase tracking-widest pt-4">{event.timestamp}</div>
                         </div>
                         <p className={`text-2xl lg:text-3xl leading-[1.6] italic relative z-10 tracking-tight ${event.type === 'SHOCK_EVENT' ? 'text-white font-black' : 'text-white/60 font-light'}`}>
                            "{event.content}"
                         </p>
                         {event.type === 'SHOCK_EVENT' && (
                             <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b2b]/10 to-transparent opacity-20 pointer-events-none" />
                         )}
                      </motion.div>
                    )) : (
                      <div className="flex flex-col items-center justify-center h-full space-y-12 py-72 opacity-40">
                         <div className="relative group">
                            <div className="absolute inset-0 bg-[#ff6b2b]/30 blur-[80px] rounded-full animate-pulse group-hover:bg-[#ff6b2b]/50 transition-all" />
                            <BrainCircuit size={140} className="text-[#ff6b2b] animate-spin-slow relative z-10" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Activity size={50} className="text-white animate-pulse" />
                            </div>
                         </div>
                         <div className="space-y-4 text-center">
                             <p className="text-[12px] font-black uppercase tracking-[1em] italic text-[#ff6b2b] animate-pulse">Awaiting Core Matrix Handshake...</p>
                             <p className="text-[10px] font-black uppercase tracking-[0.5em] italic text-white/10">Initializing Abyssal Sandbox Sector 7...</p>
                         </div>
                      </div>
                    )}
                 </AnimatePresence>
              </div>
           </div>

           {/* SIDEBAR HUD */}
           <div className="lg:col-span-4 space-y-16">
              
              {/* COGNITIVE TOPOLOGY */}
              <div className="bg-[#050505] border border-white/10 rounded-[5rem] p-12 lg:p-16 backdrop-blur-3xl space-y-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] group hover:border-[#ff6b2b]/30 transition-all relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform">
                    <Target size={180} className="text-[#ff6b2b]" />
                 </div>
                 <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-white/20 flex items-center gap-6 italic leading-none relative z-10">
                   <Wifi size={20} className="text-[#ff6b2b] animate-pulse" /> Swarm Topology
                 </h3>
                 <div className="grid grid-cols-2 gap-10 relative z-10">
                    <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3.5rem] text-center space-y-4 shadow-inner">
                       <div className="text-6xl font-black text-[#ff6b2b] tracking-tighter italic leading-none">100</div>
                       <div className="text-[11px] text-white/20 uppercase font-black tracking-[0.4em] italic leading-none">Nodes</div>
                    </div>
                    <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3.5rem] text-center space-y-4 shadow-inner">
                       <div className="text-6xl font-black text-white/80 tracking-tighter italic leading-none">92%</div>
                       <div className="text-[11px] text-white/20 uppercase font-black tracking-[0.4em] italic leading-none">Stability</div>
                    </div>
                 </div>
                 
                 <div className="h-80 w-full bg-black/60 border border-white/10 rounded-[3.5rem] relative overflow-hidden p-10 shadow-inner group-hover:bg-black/80 transition-all">
                    <div className="grid grid-cols-10 gap-4">
                       {agents.map(a => (
                         <motion.div 
                           key={a.id} 
                           animate={isRunning ? { opacity: [0.1, 1, 0.4], scale: [1, 1.3, 1] } : {}}
                           transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
                           className={`h-4 w-4 rounded-xl transition-all duration-700 ${isRunning ? (a.id % 2 === 0 ? 'bg-[#ff6b2b] shadow-[0_0_20px_rgba(255,107,43,0.8)]' : 'bg-[#ff6b2b]/30') : 'bg-white/5'}`} 
                         />
                       ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                 </div>
              </div>

              {/* DIVINE COMMANDS */}
              <div className="bg-[#050505] border border-white/10 rounded-[5.5rem] p-12 lg:p-16 space-y-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl group">
                 <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 flex items-center gap-6 italic leading-none">
                   <Zap size={24} className="text-[#ff6b2b] animate-pulse" /> Divine Intervention
                 </h3>
                 <div className="space-y-8">
                    <button className="w-full flex items-center justify-between p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:bg-[#ff6b2b]/10 hover:border-[#ff6b2b]/40 transition-all group/btn shadow-2xl">
                       <span className="text-sm font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white transition-colors italic leading-none">Inject Global Shock</span>
                       <div className="h-10 w-10 rounded-full bg-[#ff6b2b]/10 flex items-center justify-center text-[#ff6b2b] group-hover/btn:bg-[#ff6b2b] group-hover/btn:text-black transition-all">
                          <Plus size={24} className="group-hover/btn:rotate-90 transition-transform duration-500" strokeWidth={3} />
                       </div>
                    </button>
                    <button className="w-full flex items-center justify-between p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:bg-white/[0.05] hover:border-white/20 transition-all group/btn shadow-2xl">
                       <span className="text-sm font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white transition-colors italic leading-none">Shift Core Resilience</span>
                       <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/10 group-hover/btn:bg-white group-hover/btn:text-black transition-all">
                          <Settings size={22} className="group-hover/btn:rotate-180 transition-transform duration-1000" />
                       </div>
                    </button>
                 </div>
                  <div className="pt-16 border-t border-white/5 flex justify-center">
                    <button 
                      onClick={generateReport}
                      disabled={isGenerating}
                      className="px-8 py-4 bg-[#ff6b2b]/5 border border-[#ff6b2b]/20 rounded-2xl text-[11px] font-black uppercase tracking-[0.8em] text-[#ff6b2b]/40 hover:text-[#ff6b2b] hover:border-[#ff6b2b]/60 transition-all italic flex items-center gap-6 group"
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
                     className="fixed inset-0 z-[100] flex items-center justify-center p-8 lg:p-20 bg-black/95 backdrop-blur-[40px]"
                   >
                      <motion.div 
                        initial={{ scale: 0.9, y: 100, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        transition={{ type: "spring", damping: 30, stiffness: 200 }}
                        className="bg-[#050505] border-4 border-white/10 w-full max-w-7xl p-16 lg:p-32 rounded-[6rem] shadow-[0_0_200px_rgba(255,107,43,0.3)] relative overflow-y-auto max-h-[90vh] custom-scrollbar scrollbar-hide"
                      >
                         <button 
                           onClick={() => setReport(null)}
                           className="absolute top-16 right-16 text-white/20 hover:text-[#ff6b2b] transition-all bg-white/[0.02] p-6 rounded-[2.5rem] border border-white/10 hover:rotate-90"
                         >
                            <X size={40} />
                         </button>

                         <div className="space-y-32">
                            <div className="space-y-12 text-center lg:text-left">
                               <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[12px] font-black uppercase tracking-[1em] text-[#ff6b2b] italic leading-none">
                                  <ShieldAlert size={20} className="animate-pulse" /> Sovereign Foresight // OMEGA_7.0
                               </div>
                               <h2 className="text-7xl lg:text-[11rem] font-black uppercase tracking-tighter italic leading-[0.8] text-white whitespace-pre-wrap">{report.title}</h2>
                               <div className="flex flex-wrap justify-center lg:justify-start gap-10 pt-10">
                                  <div className="px-10 py-5 bg-[#ff6b2b] text-black rounded-[2rem] text-[12px] font-black uppercase tracking-[0.4em] italic shadow-2xl">RESONANCE_INDEX: {report.resonance}</div>
                                  <div className="px-10 py-5 bg-white/[0.05] border-2 border-white/10 rounded-[2rem] text-[12px] font-black text-white/40 uppercase tracking-[0.4em] tabular-nums italic">{report.timestamp}</div>
                               </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-24">
                               <div className="space-y-16">
                                  <h4 className="text-[13px] font-black uppercase tracking-[0.8em] text-white/20 flex items-center gap-6 italic pb-10 border-b border-white/10">
                                     <Activity size={24} className="text-[#ff6b2b]" /> Emergent Trajectories
                                  </h4>
                                  <div className="space-y-12">
                                     {report.trajectories.map((t, i) => (
                                       <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex gap-10 items-start group">
                                          <div className="mt-4 h-4 w-4 bg-[#ff6b2b] rounded-full group-hover:scale-150 transition-all shadow-[0_0_30px_#ff6b2b]" />
                                          <p className="text-3xl text-white/60 font-light leading-relaxed group-hover:text-white transition-colors italic tracking-tight">{t}</p>
                                       </motion.div>
                                     ))}
                                  </div>
                                </div>

                               <div className="space-y-16">
                                  <h4 className="text-[13px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] flex items-center gap-6 italic pb-10 border-b border-[#ff6b2b]/30">
                                     <ShieldAlert size={24} /> Neural Risk Metrics
                                  </h4>
                                  <div className="space-y-12">
                                     {report.emergentRisks.map((t, i) => (
                                       <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex gap-10 items-start group">
                                          <div className="mt-4 h-4 w-4 bg-[#ff6b2b]/40 rounded-full group-hover:bg-[#ff6b2b] group-hover:scale-150 transition-all shadow-[0_0_30px_#ff6b2b]" />
                                          <p className="text-3xl text-white/30 font-light leading-relaxed group-hover:text-[#ff6b2b] transition-colors italic tracking-tight">{t}</p>
                                       </motion.div>
                                     ))}
                                  </div>
                               </div>
                            </div>

                            <div className="pt-32 border-t-2 border-white/5 space-y-24">
                               <div className="space-y-10">
                                  <h4 className="text-[12px] font-black uppercase tracking-[1em] text-white/10 italic">Ideological Synthesis</h4>
                                  <p className="text-5xl lg:text-8xl font-black text-white italic tracking-tighter leading-none">"{report.ideologicalDrift}"</p>
                                </div>
                               <div className="space-y-10">
                                  <h4 className="text-[12px] font-black uppercase tracking-[1em] text-white/10 italic">Architectural Consensus</h4>
                                  <p className="text-3xl text-white/30 font-light leading-relaxed italic max-w-5xl">{report.conclusion}</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-center pt-24 border-t-2 border-white/10 gap-12">
                               <div className="flex items-center gap-8">
                                   <div className="h-20 w-20 rounded-[2rem] border-2 border-[#ff6b2b] flex items-center justify-center text-[#ff6b2b] shadow-2xl">
                                      <Terminal size={32} strokeWidth={3} />
                                   </div>
                                   <div className="space-y-2">
                                      <div className="text-[11px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] italic leading-none">Authorization Ledger</div>
                                      <div className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Gio V. Nucleus 7.0</div>
                                   </div>
                               </div>
                               <button className="px-16 py-8 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/30 text-[#ff6b2b] hover:bg-[#ff6b2b] hover:text-black transition-all rounded-[2.5rem] font-black uppercase tracking-[0.8em] text-xs italic shadow-2xl">Archive Shard in Neural Ledger</button>
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
          <div className="text-[25vw] font-black italic italic leading-none uppercase">REHEARSE</div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.2); border-radius: 20px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
