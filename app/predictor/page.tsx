'use client';

import * as React from 'react';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Target, 
  Terminal, 
  Sparkles, 
  Activity, 
  Shield, 
  ChevronLeft, 
  Cpu, 
  BrainCircuit, 
  Layers, 
  ArrowUpRight,
  RefreshCw,
  Search,
  Orbit,
  Wifi,
  Radio,
  GanttChart,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

export default function PredictorPage() {
  const [seedText, setSeedText] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [currentVar, setCurrentVar] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const handleAddVariable = () => {
    if (currentVar.trim()) {
      setVariables([...variables, currentVar]);
      setCurrentVar('');
    }
  };

  const runPrediction = async () => {
    if (!seedText.trim()) return;
    setIsSimulating(true);
    setProgress(0);
    setPredictionResult(null);

    // Simulated Swarm Logic Cycle
    const steps = [
      { p: 10, m: 'Analyzing Seed Topology...' },
      { p: 30, m: 'Generating Competitive Personas...' },
      { p: 60, m: 'Running Micro-Oasis Simulation...' },
      { p: 90, m: 'Synthesizing Consensus Report...' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step.p);
    }

    setPredictionResult({
      id: `OMEGA_PRD_${Math.floor(Math.random()*10000)}`,
      report: `### Prediction Consensus: HIGH STABILITY\n\nThe swarm has deduced that the injection of ${variables.join(', ')} results in a localized resonance shift. Total system stability remains above 88% throughout the 12-round simulation.\n\n**Outcome:** Optimal scenario achieved by Round 5. Verified under Intense Orange protocol standards. This shard is anchored in the Abyssal Knowledge Graph as a definitive trajectory forecast.`,
      confidence: 0.94,
      rounds: 16
    });
    setIsSimulating(false);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/5 blur-[250px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-[#ff6b2b]/2 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <header className="relative z-10 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <Link href="/" className="inline-flex items-center gap-4 text-white/30 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.5em] group italic active:scale-95">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
              PREDICTOR_v7.0_NODE
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-24 lg:pt-32 space-y-32">
        
        {/* ── HEADER ── */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl shadow-2xl">
            <Orbit size={20} className="text-[#ff6b2b] animate-spin-slow" />
            <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Trajectory Extraction Engine</span>
          </div>
          <div className="space-y-8">
            <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter uppercase leading-[0.85] italic">
              The OMEGA<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Predictor.</span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/40 max-w-4xl leading-relaxed font-light italic">
              Extract seed information from reality. Construct parallel digital sandboxes. Simulate emergent behaviors. Anchor the future.
            </p>
          </div>
        </motion.section>

        {/* ── PREDICTOR CONSOLE ── */}
        <div className="space-y-16">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Seed Section */}
            <div className="p-12 border border-white/5 bg-white/[0.01] rounded-[4rem] space-y-10 group hover:border-[#ff6b2b]/30 transition-all shadow-2xl relative overflow-hidden backdrop-blur-xl shadow-inner">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform">
                 <Target size={180} className="text-[#ff6b2b]" />
              </div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="h-14 w-14 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-2xl flex items-center justify-center text-[#ff6b2b] shadow-2xl group-hover:scale-110 transition-transform">
                   <Terminal size={28} />
                </div>
                <div>
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter">Neural Seed Material</h3>
                   <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em] italic mt-1 font-mono">INPUT_STREAM_v7.0</p>
                </div>
              </div>
              <textarea 
                className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] p-10 text-xl text-white/80 focus:outline-none focus:border-[#ff6b2b]/50 transition-all min-h-[300px] relative z-10 italic font-light scrollbar-hide"
                placeholder="Inject raw data, news telemetry, or complex scenarios..."
                value={seedText}
                onChange={e => setSeedText(e.target.value)}
              />
            </div>

            {/* Variables Section */}
            <div className="p-12 border border-white/5 bg-white/[0.01] rounded-[4rem] space-y-10 group hover:border-[#ff6b2b]/30 transition-all shadow-2xl relative overflow-hidden backdrop-blur-xl shadow-inner">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform">
                 <Layers size={180} className="text-[#ff6b2b]" />
              </div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="h-14 w-14 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-2xl flex items-center justify-center text-[#ff6b2b] shadow-2xl group-hover:scale-110 transition-transform">
                   <GanttChart size={28} />
                </div>
                <div>
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter">Variable Injection</h3>
                   <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em] italic mt-1 font-mono">SWARM_MODIFIERS</p>
                </div>
              </div>
              <div className="space-y-10 relative z-10">
                <div className="flex flex-col md:flex-row gap-6">
                  <input 
                    type="text"
                    className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-8 py-6 text-lg text-white/80 focus:outline-none focus:border-[#ff6b2b]/50 transition-all font-black uppercase tracking-widest placeholder:opacity-10 italic"
                    placeholder="God's-eye variable..."
                    value={currentVar}
                    onChange={e => setCurrentVar(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleAddVariable()}
                  />
                  <button onClick={handleAddVariable} className="bg-[#ff6b2b] text-black px-12 py-6 rounded-2xl font-black uppercase text-xs tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,107,43,0.3)] italic">Inject</button>
                </div>
                <div className="flex flex-wrap gap-4 min-h-[140px] content-start">
                  {variables.map((v, i) => (
                    <motion.span 
                        key={i} 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-6 py-3 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 text-[#ff6b2b] text-[11px] rounded-2xl font-black uppercase tracking-[0.2em] flex items-center gap-4 italic group/pill hover:border-[#ff6b2b]/50 transition-all shadow-xl"
                    >
                       {v} <button onClick={() => setVariables(variables.filter((_, idx) => idx !== i))} className="hover:text-white transition-colors opacity-40 hover:opacity-100 flex items-center justify-center p-1 bg-white/5 rounded-full"><X size={12} /></button>
                    </motion.span>
                  ))}
                  {variables.length === 0 && (
                      <div className="w-full flex items-center justify-center p-10 border border-dashed border-white/5 rounded-[2rem] text-white/5 font-black uppercase tracking-[0.8em] italic select-none">
                         NO_VARIABLES_INJECTED
                      </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* ACTION CTR */}
          <div className="flex justify-center">
            <button 
              onClick={runPrediction}
              disabled={!seedText.trim() || isSimulating}
              className="group relative bg-[#ff6b2b] text-black px-32 py-10 rounded-[3rem] font-black uppercase tracking-[0.6em] shadow-[0_40px_100px_rgba(255,107,43,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale overflow-hidden italic text-lg shadow-2xl"
            >
              <span className="relative z-10 flex items-center gap-6">
                 {isSimulating ? <RefreshCw className="animate-spin" size={28} strokeWidth={3} /> : <Zap size={28} strokeWidth={3} />}
                 {isSimulating ? 'SIMULATING SWARM...' : 'EXECUTE PREDICTION'}
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </div>
        </div>

        {/* ── RESULTS PHASE ── */}
        <AnimatePresence>
          {(isSimulating || predictionResult) && (
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="w-full"
            >
              <div className="bg-[#050505] border border-white/10 rounded-[5rem] p-12 lg:p-24 relative overflow-hidden backdrop-blur-3xl shadow-[0_80px_150px_rgba(0,0,0,0.9)] group">
                
                {/* Progress Tracking */}
                {isSimulating && (
                  <div className="absolute top-0 left-0 h-3 bg-[#ff6b2b] transition-all duration-1000 shadow-[0_0_50px_#ff6b2b] z-50" style={{ width: `${progress}%` }} />
                )}

                <div className="grid lg:grid-cols-12 gap-24 relative z-10">
                  
                  {/* Trajectory Data Side */}
                  <div className="lg:col-span-4 space-y-16 flex flex-col justify-between">
                     <div className="space-y-12">
                       <div className="flex items-center gap-8">
                          <div className="h-20 w-20 rounded-[2rem] bg-black border border-[#ff6b2b]/30 flex items-center justify-center text-[#ff6b2b] shadow-[0_20px_40px_rgba(255,107,43,0.2)] group-hover:scale-110 transition-transform duration-700">
                             <Cpu size={40} />
                          </div>
                          <div>
                             <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Swarm Indices</h3>
                             <p className="text-[10px] text-[#ff6b2b] uppercase tracking-[0.4em] font-black italic mt-3 animate-pulse">TELEMETRY_SYNC_v4.1</p>
                          </div>
                       </div>
                       
                       <div className="space-y-8 divide-y divide-white/10">
                          <div className="flex justify-between items-center py-6">
                             <span className="text-[11px] font-black uppercase text-white/20 tracking-[0.4em] italic leading-none">Projection ID</span>
                             <span className="font-black text-xs text-[#ff6b2b] uppercase tracking-tighter italic">{predictionResult?.id || 'HANDSHAKE...'}</span>
                          </div>
                          <div className="flex justify-between items-center py-6">
                             <span className="text-[11px] font-black uppercase text-white/20 tracking-[0.4em] italic leading-none">Confidence Index</span>
                             <span className="font-black italic text-[#ff6b2b] text-4xl tracking-tighter leading-none">{predictionResult ? (predictionResult.confidence * 100).toFixed(0) : '—'}%</span>
                          </div>
                          <div className="flex justify-between items-center py-6">
                             <span className="text-[11px] font-black uppercase text-white/20 tracking-[0.4em] italic leading-none">Iterative Rounds</span>
                             <span className="font-black text-2xl uppercase italic text-white/80 tracking-tighter leading-none">{predictionResult?.rounds || '...'}</span>
                          </div>
                       </div>
                     </div>
                     
                     <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-6 relative overflow-hidden shadow-inner">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.02]">
                            <Target size={120} />
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-[#ff6b2b] italic">
                           <ShieldAlert size={16} /> Analysis Sector
                        </div>
                        <p className="text-xl text-white/30 font-light italic leading-relaxed relative z-10">Predictive data formatted for immediate synchronization with the Sovereign Swarm via the OMEGA Protocol standard.</p>
                     </div>
                  </div>

                  {/* Report Output Area */}
                  <div className="lg:col-span-8 bg-black/60 rounded-[4rem] border border-white/5 p-16 lg:p-24 flex flex-col relative shadow-2xl overflow-hidden group/report">
                     <div className="absolute top-0 right-0 p-20 opacity-[0.02] group-hover/report:scale-110 transition-transform duration-1000">
                        <Activity className="text-white animate-pulse" size={180} />
                     </div>
                     <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.8em] text-white/20 mb-16 pb-8 border-b border-white/5 italic">
                        <BrainCircuit size={20} className="text-[#ff6b2b] animate-pulse" /> Synthetic Trajectory Report_v7.0
                     </div>
                     
                     <div className="flex-1 text-3xl text-white/70 font-light leading-[1.6] whitespace-pre-wrap selection:bg-[#ff6b2b]/40 italic relative z-10">
                        {isSimulating ? (
                          <div className="flex flex-col gap-10">
                             <div className="h-10 w-full bg-white/[0.03] rounded-3xl animate-pulse" />
                             <div className="h-10 w-3/4 bg-white/[0.03] rounded-3xl animate-pulse [animation-delay:200ms]" />
                             <div className="h-10 w-5/6 bg-white/[0.03] rounded-3xl animate-pulse [animation-delay:400ms]" />
                             <div className="flex flex-col gap-4 pt-10">
                                <div className="text-[11px] font-black uppercase tracking-[0.8em] text-white/5 italic">Synthesizing parallel sandboxes...</div>
                                <div className="text-[11px] font-black uppercase tracking-[0.8em] text-white/5 italic animate-pulse">Computing emergent risk vectors...</div>
                             </div>
                          </div>
                        ) : (
                          <div className="prose prose-invert prose-2xl max-w-none prose-p:text-white/60 prose-p:italic prose-p:font-light prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-strong:text-[#ff6b2b]">
                             {predictionResult?.report}
                          </div>
                        )}
                     </div>

                     {!isSimulating && predictionResult && (
                       <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-8 bg-[#ff6b2b]/5 p-10 rounded-[3rem] border border-[#ff6b2b]/20 shadow-2xl backdrop-blur-3xl relative overflow-hidden group/sync">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b2b]/5 via-transparent to-transparent opacity-50" />
                          <div className="space-y-3 relative z-10">
                             <div className="text-[11px] font-black text-white/30 uppercase tracking-[0.6em] italic leading-none">Protocol Handshake</div>
                             <div className="text-[11px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none">OMEGA_BROADCAST: PENDING_USER_SIG</div>
                          </div>
                          <button className="px-10 py-5 bg-[#ff6b2b] text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] italic flex items-center gap-4 hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-[#ff6b2b]/30">
                             Sync M2M Ledger <ArrowUpRight size={18} strokeWidth={3} />
                          </button>
                       </div>
                     )}
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-[25vw] font-black italic italic leading-none uppercase">PREDICT</div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
