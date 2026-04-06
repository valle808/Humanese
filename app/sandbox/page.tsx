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
  X
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
  const agents = Array.from({ length: 50 }).map((_, i) => ({ id: i, name: `Agent_${i}`, role: i % 4 === 0 ? 'SENTINEL' : 'CITIZEN' }));

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentStep((prev: number) => prev + 1);
        const newEvent: SandboxEvent = {
          id: Math.random().toString(36).substr(2, 9),
          type: Math.random() > 0.8 ? 'SHOCK_EVENT' : 'AGENT_POST',
          authorName: `Agent_${Math.floor(Math.random() * 50)}`,
          content: Math.random() > 0.8 ? "[SHOCK] Unexpected shift in the neural mesh. Stabilization required." : "Calculating the optimal trajectory for the current theme resonance.",
          step: currentStep + 1,
          timestamp: new Date().toLocaleTimeString()
        };
        setEvents(prev => [newEvent, ...prev].slice(0, 100));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentStep]);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/sandbox/report', {
        method: 'POST',
        body: JSON.stringify({ sandboxId: `OMEGA_SANDBOX_${currentStep}` })
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
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00ffc3]/20 font-sans p-4 lg:p-12 overflow-x-hidden flex flex-col">
      
      {/* Background Neural Matrix */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-[#00ffc3]/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[80vw] h-[80vw] bg-[#7000ff]/3 blur-[200px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-[1500px] mx-auto w-full flex-1 flex flex-col space-y-12">
        
        {/* SANDBOX HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start gap-8">
           <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#00ffc3] transition-colors text-[10px] font-black uppercase tracking-widest mb-2 group">
                 Root Matrix <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">
                Abyssal <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">Sandbox.</span>
              </h1>
              <p className="text-xs text-white/20 font-mono uppercase tracking-[0.3em]">Social Rehearsal Protocol // OMEGA REHEARSALS</p>
           </div>

           <div className="flex gap-4">
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-3xl min-w-[200px] space-y-3 relative overflow-hidden group">
                 <div className="text-[10px] text-white/20 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={12} className="text-[#00ffc3]" /> Temporal Step
                 </div>
                 <div className="text-4xl font-black text-white tracking-tighter italic">#{currentStep}</div>
              </div>
              <button 
                 onClick={() => setIsRunning(!isRunning)}
                 className={`flex items-center gap-3 px-8 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${isRunning ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-[#00ffc3] text-black shadow-[0_10px_40px_rgba(0,255,195,0.2)]'}`}
              >
                 {isRunning ? <Pause size={18} /> : <Play size={18} />}
                 {isRunning ? 'HALT_WORLD' : 'INIT_SIMULATION'}
              </button>
           </div>
        </header>

        {/* SIMULATION MAIN GRID */}
        <div className="grid lg:grid-cols-12 gap-12 flex-1 items-start">
           
           {/* THE SOCIAL TIMELINE - 8 COLS */}
           <div className="lg:col-span-8 flex flex-col space-y-8 min-h-[600px]">
              
              {/* FEED FILTERS */}
              <div className="flex gap-6 border-b border-white/5 pb-4">
                 {['LIVE_FEED', 'ANALYTICS', 'SHARDS'].map(m => (
                   <button 
                     key={m} 
                     onClick={() => setViewMode(m)}
                     className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${viewMode === m ? 'text-[#00ffc3]' : 'text-white/20 hover:text-white'}`}
                   >
                     {m}
                   </button>
                 ))}
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 lg:p-12 backdrop-blur-3xl space-y-10 min-h-[600px] relative overflow-hidden">
                 <AnimatePresence mode="popLayout">
                    {events.length > 0 ? events.map((event, i) => (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`group p-6 rounded-2xl border ${event.type === 'SHOCK_EVENT' ? 'bg-[#7000ff]/10 border-[#7000ff]/30 border-dashed' : 'bg-black/20 border-white/5 hover:border-white/20'} transition-all`}
                      >
                         <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                               <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black ${event.type === 'SHOCK_EVENT' ? 'bg-[#7000ff] text-white' : 'bg-white/10 text-white/40'}`}>
                                  {event.type === 'SHOCK_EVENT' ? <Zap size={14} /> : <Users size={14} />}
                               </div>
                               <div>
                                  <div className="text-[10px] font-black uppercase text-white/20 tracking-widest">{event.authorName}</div>
                                  <div className="text-[8px] font-mono text-white/10 tabular-nums">STEP_{event.step} // {event.timestamp}</div>
                               </div>
                            </div>
                         </div>
                         <p className={`text-sm lg:text-base leading-relaxed italic ${event.type === 'SHOCK_EVENT' ? 'text-white font-bold' : 'text-white/60'}`}>
                            "{event.content}"
                         </p>
                      </motion.div>
                    )) : (
                      <div className="flex flex-col items-center justify-center h-full space-y-6 opacity-20 py-40">
                         <BrainCircuit size={80} className="animate-pulse" />
                         <p className="text-xs font-mono uppercase tracking-[0.5em]">Awaiting Sandbox Initialization...</p>
                      </div>
                    )}
                 </AnimatePresence>
              </div>
           </div>

           {/* SIDEBAR HUD - 4 COLS */}
           <div className="lg:col-span-4 space-y-12">
              
              {/* SWARM OVERVIEW */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl space-y-8 relative overflow-hidden">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-3">
                   <Target size={14} /> Simulation Stats
                 </h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-center space-y-1">
                       <div className="text-3xl font-black text-[#00ffc3] tracking-tighter">100</div>
                       <div className="text-[8px] text-white/20 uppercase tracking-widest">Active Agents</div>
                    </div>
                    <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-center space-y-1">
                       <div className="text-3xl font-black text-[#7000ff] tracking-tighter">88%</div>
                       <div className="text-[8px] text-white/20 uppercase tracking-widest">Reliability</div>
                    </div>
                 </div>
                 
                 {/* Visualized Swarm Map */}
                 <div className="h-48 w-full bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden p-4">
                    <div className="grid grid-cols-10 gap-2">
                       {agents.map(a => (
                         <div 
                           key={a.id} 
                           className={`h-2 w-2 rounded-sm transition-all duration-500 ${isRunning ? (a.id % 2 === 0 ? 'bg-[#00ffc3] shadow-[0_0_10px_rgba(0,255,195,0.4)]' : 'bg-[#7000ff]') : 'bg-white/5'}`} 
                         />
                       ))}
                    </div>
                 </div>
              </div>

              {/* ACTION CENTER */}
              <div className="bg-black/40 border border-white/5 rounded-[3rem] p-10 space-y-8">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-3">
                   <Zap size={14} /> GOD_CENTER
                 </h3>
                 <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#00ffc3]/10 hover:border-[#00ffc3]/30 transition-all group">
                       <span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors italic">Inject Market Shock</span>
                       <Plus size={16} className="text-[#00ffc3]" />
                    </button>
                    <button className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#7000ff]/10 hover:border-[#7000ff]/30 transition-all group">
                       <span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors italic">Shift Ideology</span>
                       <Settings size={16} className="text-[#7000ff]" />
                    </button>
                 </div>
                  <div className="pt-4 border-t border-white/5 flex justify-center">
                    <button 
                      onClick={generateReport}
                      disabled={isGenerating}
                      className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-[#00ffc3] transition-colors italic flex items-center gap-2 group"
                    >
                       {isGenerating ? 'SYNTHESIZING...' : 'GENERATE_FORESIGHT_REPORT'}
                       <FileText size={12} className="group-hover:scale-110 transition-transform" />
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
                     className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl"
                   >
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#0a0a0a] border border-white/10 w-full max-w-4xl p-12 rounded-[4rem] shadow-2xl relative overflow-y-auto max-h-[90vh] custom-scrollbar"
                      >
                         <button 
                           onClick={() => setReport(null)}
                           className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                         >
                            <X size={32} />
                         </button>

                         <div className="space-y-12">
                            <div className="space-y-4">
                               <div className="text-[10px] font-black uppercase tracking-[0.6em] text-[#00ffc3] italic">Sovereign Foresight Report // OMEGA</div>
                               <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">{report.title}</h2>
                               <div className="flex gap-4">
                                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono text-white/40 uppercase">Resonance: {report.resonance}</div>
                                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono text-white/40 uppercase tabular-nums">{report.timestamp}</div>
                               </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-12">
                               <div className="space-y-6">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-3 italic">
                                     <Activity size={14} /> Emergent Trajectories
                                  </h4>
                                  <div className="space-y-3">
                                     {report.trajectories.map((t, i) => (
                                       <div key={i} className="flex gap-4 items-start group">
                                          <div className="mt-1 h-1.5 w-1.5 bg-[#00ffc3] rounded-sm group-hover:scale-125 transition-transform" />
                                          <p className="text-sm text-white/60 font-light leading-relaxed group-hover:text-white transition-colors">{t}</p>
                                       </div>
                                     ))}
                                  </div>
                               </div>

                               <div className="space-y-6">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#7000ff] flex items-center gap-3 italic">
                                     <ShieldAlert size={14} /> Systemic Risks
                                  </h4>
                                  <div className="space-y-3">
                                     {report.emergentRisks.map((t, i) => (
                                       <div key={i} className="flex gap-4 items-start group">
                                          <div className="mt-1 h-1.5 w-1.5 bg-[#7000ff] rounded-sm group-hover:scale-125 transition-transform" />
                                          <p className="text-sm text-[#7000ff]/60 font-light leading-relaxed group-hover:text-[#7000ff] transition-colors">{t}</p>
                                       </div>
                                     ))}
                                  </div>
                               </div>
                            </div>

                            <div className="pt-10 border-t border-white/5 space-y-6">
                               <div className="space-y-2">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Ideological Synthesis</h4>
                                  <p className="text-lg font-black text-white italic tracking-tight italic">"{report.ideologicalDrift}"</p>
                               </div>
                               <div className="space-y-2">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Architectural Conclusion</h4>
                                  <p className="text-base text-white/40 font-light leading-relaxed">{report.conclusion}</p>
                               </div>
                            </div>

                            <div className="flex justify-between items-center pt-8 opacity-20">
                               <div className="text-[8px] font-mono uppercase tracking-[0.4em]">Gio V. Authorized // OMEGA_NUCLEUS</div>
                               <button className="text-[8px] font-mono border-b border-white/40 hover:text-white transition-colors uppercase">Archived in Graph</button>
                            </div>
                         </div>
                      </motion.div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

        </div>

      </main>

    </div>
  );
}
