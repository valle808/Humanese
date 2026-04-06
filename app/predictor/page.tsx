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
  ArrowUpRight 
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
      id: `SOVEREIGN_PRD_${Math.floor(Math.random()*10000)}`,
      report: `### Prediction Consensus: HIGH STABILITY\n\nThe swarm has deduced that the injection of ${variables.join(', ')} results in a localized resonance shift. Total system stability remains above 88% throughout the 12-round simulation.\n\n**Outcome:** Optimal scenario achieved by Round 5.`,
      confidence: 0.92,
      rounds: 12
    });
    setIsSimulating(false);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00ffc3] selection:text-black font-sans overflow-x-hidden flex flex-col p-4 lg:p-12">
      
      {/* BACKGROUND DEPTH ENGINE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-[#7000ff]/5 blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#00ffc3]/3 blur-[180px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto w-full space-y-12">
        
        {/* HEADER */}
        <header className="flex justify-between items-start">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#00ffc3] transition-colors text-xs font-black uppercase tracking-widest mb-4 group">
               <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Nexus
            </Link>
            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">
              The Sovereign <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffc3] to-[#7000ff]">Predictor.</span>
            </h1>
            <p className="text-sm lg:text-lg text-white/30 font-light max-w-2xl">
              Extract seed information from reality. Construct parallel digital sandboxes. Win the future.
            </p>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-2">
             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full font-mono text-[9px] uppercase tracking-widest text-white/40">
                PWA: ONLINE / SYNCED
             </div>
             <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-[#00ffc3] animate-pulse" />
                <div className="h-2 w-2 rounded-full bg-[#7000ff] animate-pulse [animation-delay:200ms]" />
             </div>
          </div>
        </header>

        {/* PREDICTOR CONSOLE */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT: INPUT MATRIX */}
          <div className="lg:col-span-12 space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Seed Section */}
              <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-6 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Target size={120} />
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                  <Terminal size={14} /> Neural Seed Material
                </div>
                <textarea 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-white/80 focus:outline-none focus:border-[#00ffc3]/50 transition-all min-h-[160px] relative z-10"
                  placeholder="Paste raw data, news reports, or scenarios to simulate..."
                  value={seedText}
                  onChange={e => setSeedText(e.target.value)}
                />
              </div>

              {/* Variables Section */}
              <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-6 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Layers size={120} />
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                  <Shield size={14} /> Variable Injection
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white/80 focus:outline-none focus:border-[#7000ff]/50 transition-all font-mono"
                      placeholder="Add God's-eye variable (e.g. 'Policy Volatility')"
                      value={currentVar}
                      onChange={e => setCurrentVar(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleAddVariable()}
                    />
                    <button onClick={handleAddVariable} className="bg-white text-black px-4 py-3 rounded-xl font-black uppercase text-[10px] hover:scale-105 transition-transform">Inject</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variables.map((v, i) => (
                      <span key={i} className="px-3 py-1.5 bg-[#7000ff]/10 border border-[#7000ff]/30 text-[#b380ff] text-[10px] rounded-lg font-mono flex items-center gap-2">
                         {v} <button onClick={() => setVariables(variables.filter((_, idx) => idx !== i))}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* ACTION CTR */}
            <div className="flex justify-center pt-4">
              <button 
                onClick={runPrediction}
                disabled={!seedText.trim() || isSimulating}
                className="group relative bg-[#00ffc3] text-black px-16 py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(0,255,195,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {isSimulating ? 'Simulating Swarm Intelligence...' : 'Execute Trajectory Prediction'}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl" />
              </button>
            </div>
          </div>

          {/* RESULTS PHASE */}
          <AnimatePresence>
            {(isSimulating || predictionResult) && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                className="lg:col-span-12"
              >
                <div className="bg-white/[0.01] border border-white/10 rounded-[3rem] p-1 lg:p-8 relative overflow-hidden backdrop-blur-3xl min-h-[400px]">
                  
                  {/* Progress Glow */}
                  {isSimulating && (
                    <div className="absolute top-0 left-0 h-1 bg-[#00ffc3] transition-all duration-500 shadow-[0_0_20px_#00ffc3]" style={{ width: `${progress}%` }} />
                  )}

                  <div className="grid lg:grid-cols-12 gap-12 p-8 h-full items-stretch">
                    
                    {/* Trajectory Data */}
                    <div className="lg:col-span-4 space-y-8 flex flex-col justify-between">
                       <div className="space-y-6">
                         <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-[#7000ff]">
                               <Cpu size={28} />
                            </div>
                            <div>
                               <h3 className="text-2xl font-black uppercase tracking-tighter">Swarm Metrics</h3>
                               <p className="text-[9px] text-white/30 uppercase tracking-widest">Real-time simulation indices</p>
                            </div>
                         </div>
                         <div className="space-y-4 divide-y divide-white/5">
                            <div className="flex justify-between py-2">
                               <span className="text-[10px] font-black uppercase text-white/30">Prediction ID</span>
                               <span className="font-mono text-xs text-[#00ffc3]">{predictionResult?.id || 'PENDING...'}</span>
                            </div>
                            <div className="flex justify-between py-2">
                               <span className="text-[10px] font-black uppercase text-white/30">Confidence Rating</span>
                               <span className="font-mono text-xs text-[#7000ff]">{predictionResult ? (predictionResult.confidence * 100).toFixed(0) : 'CALC...'}%</span>
                            </div>
                            <div className="flex justify-between py-2">
                               <span className="text-[10px] font-black uppercase text-white/30">Simulation Iterations</span>
                               <span className="font-mono text-xs italic">{predictionResult?.rounds || 'RUNNING...'}</span>
                            </div>
                         </div>
                       </div>
                       
                       <div className="bg-black/40 border border-white/5 p-6 rounded-2xl space-y-2">
                          <p className="text-[8px] font-black uppercase tracking-widest text-[#00ffc3]">Machine Learning Status</p>
                          <p className="text-xs text-white/40 italic">Predictive data formatted for M2M broadcast protocol.</p>
                       </div>
                    </div>

                    {/* Report Output */}
                    <div className="lg:col-span-8 bg-black/60 rounded-[2.5rem] border border-white/5 p-10 flex flex-col relative group">
                       <div className="absolute top-0 right-0 p-8">
                          <Activity className="text-white/5 animate-pulse" size={60} />
                       </div>
                       <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 pb-4 border-b border-white/5">
                          <BrainCircuit size={14} /> Trajectory Report Output
                       </div>
                       <div className="flex-1 text-lg text-white/60 font-light leading-relaxed whitespace-pre-wrap selection:bg-[#7000ff]/30">
                          {isSimulating ? (
                            <div className="flex flex-col gap-4">
                               <div className="h-4 w-3/4 bg-white/5 rounded-full animate-pulse" />
                               <div className="h-4 w-1/2 bg-white/5 rounded-full animate-pulse delay-75" />
                               <div className="h-4 w-5/6 bg-white/5 rounded-full animate-pulse delay-150" />
                               <p className="text-xs italic text-white/20 pt-4">Processing Swarm emergent behaviors...</p>
                            </div>
                          ) : (
                            predictionResult?.report
                          )}
                       </div>
                       <div className="mt-8 flex justify-between items-center bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                          <span className="text-[10px] font-bold text-white/40 uppercase">Ecosystem Broadcast: READY</span>
                          <button className="text-[10px] font-black text-[#00ffc3] uppercase flex items-center gap-2 hover:bg-[#00ffc3]/10 px-3 py-1 rounded-lg transition-all">
                             Sync M2M <ArrowUpRight size={14} />
                          </button>
                       </div>
                    </div>

                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </main>

    </div>
  );
}
