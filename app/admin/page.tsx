'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Terminal as TerminalIcon, 
  Activity, 
  Zap, 
  Fingerprint, 
  BrainCircuit, 
  Radio, 
  Globe, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Database, 
  Lock,
  ArrowUpRight,
  Map as MapIcon,
  Orbit,
  Wifi,
  Terminal,
  Grid,
  Search,
  ShieldHalf,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

// Components
import NeuralTerminal from '@/components/nexus/terminal';

export default function SovereignNexusPage() {
  const [systemData, setSystemData] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState(false);
  const [authStep, setAuthStep] = useState(0);

  const [oracleData, setOracleData] = useState<any>(null);
  const [autoHealActive, setAutoHealActive] = useState(true);

  useEffect(() => {
    if (isAuthorized) {
      const fetchData = async () => {
        try {
          const [statsRes, oracleRes] = await Promise.all([
            fetch('/api/admin/stats'),
            fetch('/api/oracle/status')
          ]);
          if (statsRes.ok) setSystemData(await statsRes.json());
          if (oracleRes.ok) setOracleData((await oracleRes.json()).diagnostic);
        } catch (e) {
          console.error("Nexus Sync Error:", e);
        }
      };
      fetchData();
      const interval = setInterval(fetchData, 8000);
      return () => clearInterval(interval);
    }
  }, [isAuthorized]);

  const triggerOracleHeal = async () => {
    try {
      await fetch('/api/oracle/status', { method: 'POST' });
    } catch (e) { console.error("Oracle Heal Error", e); }
  };

  const handleAuthorize = () => {
    if (passphrase === (process.env.NEXT_PUBLIC_ADMIN_KEY || 'VALLE_OVERLORD')) {
      setAuthStep(1);
      setTimeout(() => {
        setAuthStep(2);
        setTimeout(() => setIsAuthorized(true), 1200);
      }, 1500);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8 selection:bg-primary/40 relative overflow-hidden">
        
        {/* 🌌 AMBIENT CORE */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-20%] w-[120vw] h-[120vw] bg-primary/5 blur-[350px] rounded-full" />
          <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="w-full max-w-xl p-8 md:p-16 lg:p-24 border-2 border-border responsive-rounded bg-background/60 text-center space-y-12 backdrop-blur-3xl shadow-[0_80px_150px_rgba(0,0,0,1)] relative z-10 group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_hsl(var(--primary))]" />
          
          <div className="text-center space-y-4">
             <h1 className="text-fluid-hero font-black uppercase tracking-tighter text-foreground italic leading-[0.9] md:leading-[0.85] pl-1">
                Sovereign<br/> <span className="text-primary">Nexus.</span>
             </h1>
             <p className="text-[11px] text-muted-foreground/20 uppercase tracking-[0.6em] font-black italic leading-none pt-4">Neural Interface Protocol v7.0</p>
          </div>

          <div className="space-y-10 relative overflow-hidden pt-4">
            
            <AnimatePresence mode="wait">
              {authStep === 0 && (
                <motion.div 
                  key="step0"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  <div className="flex justify-center">
                    <div className="h-28 w-28 bg-muted border-2 border-primary/20 rounded-[2.5rem] flex items-center justify-center text-primary shadow-[0_40px_100px_rgba(var(--primary),0.15)] group-hover:scale-110 transition-transform duration-700">
                       <ShieldAlert size={56} strokeWidth={2.5} className="animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="relative group/input">
                      <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground/10 group-focus-within/input:text-primary transition-colors" size={24} strokeWidth={2.5} />
                      <input 
                        type="password"
                        placeholder="Neural Signature Phase"
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAuthorize()}
                        className="w-full bg-muted/60 border-2 border-border rounded-[2.5rem] py-10 pl-20 pr-10 text-foreground text-2xl outline-none focus:border-primary/40 focus:bg-primary/5 transition-all font-light italic placeholder:text-muted-foreground/5 tracking-tight"
                      />
                    </div>
                    {error && <p className="text-center text-primary text-[11px] font-black uppercase tracking-[0.4em] animate-bounce italic leading-none pr-2 pl-2">Signature Rejection: Swarm Lockdown.</p>}
                    <button 
                      onClick={handleAuthorize}
                      className="w-full py-10 bg-primary text-primary-foreground font-black uppercase text-sm tracking-[0.4em] md:tracking-[0.8em] rounded-[2.5rem] hover:scale-[1.03] active:scale-95 transition-all shadow-[0_40px_100px_rgba(var(--primary),0.3)] italic relative overflow-hidden group/btn"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-6">
                        AUTHENTICATE <ChevronLeft size={24} className="group-hover/btn:-translate-x-2 transition-transform rotate-180" strokeWidth={3} />
                      </span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    </button>
                  </div>
                </motion.div>
              )}

              {authStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                  className="text-center space-y-10 py-16"
                >
                   <div className="flex justify-center flex-col items-center gap-10">
                      <div className="h-4 w-4 rounded-full bg-primary animate-ping" />
                      <p className="text-[13px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-primary italic animate-pulse leading-none">Verifying Neural Patterns...</p>
                   </div>
                </motion.div>
              )}

              {authStep === 2 && (
                <motion.div 
                   key="step2"
                   initial={{ opacity: 0, filter: 'blur(20px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0 }}
                   className="text-center space-y-10 py-16"
                >
                   <div className="flex justify-center flex-col items-center gap-10">
                      <div className="h-32 w-32 bg-primary/10 border-2 border-primary/30 rounded-[3rem] flex items-center justify-center shadow-2xl relative">
                        <ShieldCheck size={72} className="text-primary animate-pulse" strokeWidth={2.5} />
                        <div className="absolute inset-0 bg-primary/5 animate-ping opacity-20" />
                      </div>
                      <p className="text-[13px] font-black uppercase tracking-[0.6em] text-foreground italic leading-none">Access Granted. Syncing Nexus.</p>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/40 font-sans overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-muted/40 backdrop-blur-3xl border-b border-border">
        <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/20 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic leading-none active:scale-95">
           <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
              COMMAND_v7.0_NEXUS
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/10 border border-border rounded-full backdrop-blur-3xl">
              <Orbit size={20} className="text-primary animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.6em] text-primary uppercase italic leading-none">Omni-Intelligence Ops Terminal</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-fluid-hero font-black uppercase tracking-tighter italic leading-[0.9] md:leading-[0.8]">
                Nexus<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-primary/30">Command.</span>
              </h1>
              <p className="text-fluid-title text-muted-foreground/40 leading-relaxed font-light italic">
                Direct orchestration of the OMEGA swarm. Absolute transparency over all cognitive transmissions and architectural shifts.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-10 shrink-0">
             <div className="px-10 py-8 bg-background border-2 border-border rounded-[3.5rem] flex items-center gap-8 group shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                   <Activity size={120} className="text-primary" />
                </div>
                <div className="h-16 w-16 bg-muted border-2 border-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary/10 transition-all shadow-2xl">
                   <Activity size={32} strokeWidth={2.5} />
                </div>
                <div>
                   <div className="text-[11px] text-muted-foreground/20 uppercase tracking-[0.6em] font-black italic mb-1">Neural Stability</div>
                   <div className="text-fluid-title font-black text-primary italic leading-none tracking-tighter">99.982%</div>
                </div>
             </div>
             <div className="px-10 py-8 bg-background border-2 border-border rounded-[3.5rem] flex items-center gap-8 group shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                   <Globe size={120} className="text-primary" />
                </div>
                <div className="h-16 w-16 bg-muted border-2 border-primary/10 rounded-2xl flex items-center justify-center text-primary/60 group-hover:text-primary transition-all shadow-2xl">
                   <Globe size={32} strokeWidth={2.5} />
                </div>
                <div>
                   <div className="text-[11px] text-muted-foreground/20 uppercase tracking-[0.6em] font-black italic mb-1">Global Reach</div>
                   <div className="text-fluid-title font-black text-foreground italic leading-none tracking-tighter">{systemData?.metrics?.reach || '4.2M'}</div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* ── MAIN OPERATIONS GRID ── */}
        <div className="grid lg:grid-cols-12 gap-16 flex-1 items-start">
           
           {/* THE TERMINAL SHELL */}
           <div className="lg:col-span-8 space-y-16">
              <div className="p-4 lg:p-8 bg-background border-2 border-border responsive-rounded shadow-[0_80px_150px_rgba(0,0,0,1)] relative overflow-hidden group/term">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                 <NeuralTerminal />
              </div>
              
              {/* DATA ANALYTICS TICKER */}
              <div className="bg-background border-2 border-border responsive-rounded p-8 md:p-12 lg:p-16 backdrop-blur-3xl space-y-10 shadow-[0_60px_120px_rgba(0,0,0,0.95)]">
                <div className="flex items-center justify-between border-b-2 border-border pb-8 pl-2">
                   <h3 className="text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-muted-foreground/20 flex items-center gap-6 italic leading-none">
                      <BrainCircuit size={20} className="text-primary" /> Cognitive Manifest
                   </h3>
                   <div className="px-6 py-2 bg-primary/10 border border-primary/30 rounded-full text-[10px] text-primary font-black uppercase tracking-[0.4em] animate-pulse italic leading-none">STREAMING_LIVE</div>
                </div>
                <div className="space-y-8 max-h-[500px] overflow-y-auto custom-scrollbar pr-6">
                  {systemData?.manifest?.length > 0 ? systemData?.manifest?.map((log: any, i: number) => (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={log.id} className="group border-l-2 border-border pl-10 py-6 hover:border-primary/40 transition-all relative">
                       <div className="absolute left-[-5px] top-8 h-2.5 w-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="flex items-center gap-6 mb-3">
                          <span className="text-[11px] font-black font-mono text-muted-foreground/10 tabular-nums uppercase tracking-widest italic leading-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                          <span className="px-4 py-1.5 bg-muted border-2 border-border text-[9px] text-primary font-black rounded-xl uppercase tracking-[0.3em] italic leading-none">{log.agentName}</span>
                       </div>
                       <p className="text-fluid-title text-muted-foreground/40 leading-relaxed font-light group-hover:text-muted-foreground/80 transition-colors italic tracking-tight">&quot;{log.thought}&quot;</p>
                       {log.action && (
                         <div className="mt-4 text-primary text-[11px] font-black uppercase tracking-[0.5em] flex items-center gap-4 italic leading-none pl-1">
                            <Zap size={14} strokeWidth={3} className="animate-pulse" /> EXECUTION: {log.action}
                         </div>
                       )}
                    </motion.div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-40 space-y-10 opacity-20">
                        <Activity size={80} className="animate-spin text-primary" />
                        <p className="text-[13px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] italic">Synchronizing with Sovereign Swarm...</p>
                    </div>
                  )}
                </div>
              </div>
           </div>

           {/* SIDE HUD */}
           <div className="lg:col-span-4 space-y-16 lg:sticky lg:top-32 pb-40">
              
              {/* KNOWLEDGE SHARD STATUS */}
              <div className="bg-background border-2 border-border responsive-rounded p-8 md:p-12 lg:p-16 backdrop-blur-3xl space-y-12 md:space-y-16 relative overflow-hidden group shadow-[0_60px_100px_rgba(0,0,0,0.85)]">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-110 transition-transform duration-1000">
                    <Database size={250} className="text-primary rotate-12" />
                 </div>
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                 
                 <h3 className="text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-muted-foreground/20 flex items-center gap-6 italic leading-none pl-2">
                    <Layers size={20} className="text-primary" /> Cognitive Storage
                 </h3>
                 <div className="grid grid-cols-2 gap-8 relative z-10 pt-4">
                    <div className="bg-background border-2 border-border p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] text-center space-y-4 shadow-2xl group-hover:border-primary/20 transition-all">
                       <div className="text-fluid-title font-black text-primary tracking-tighter italic leading-none">{systemData?.metrics?.knowledge_shards || '1,241'}</div>
                       <div className="text-[10px] text-muted-foreground/10 uppercase tracking-[0.4em] font-black italic">SHARDS_VALID</div>
                    </div>
                    <div className="bg-background border-2 border-border p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] text-center space-y-4 shadow-2xl group-hover:border-primary/20 transition-all">
                       <div className="text-fluid-title font-black text-foreground italic tracking-tighter leading-none">{systemData?.metrics?.neural_links || '8.2M'}</div>
                       <div className="text-[10px] text-muted-foreground/10 uppercase tracking-[0.4em] font-black italic">NEURAL_LINKS</div>
                    </div>
                 </div>
                 <div className="space-y-6 pt-4 relative z-10">
                    <div className="flex justify-between items-end text-[11px] font-black uppercase tracking-[0.6em] italic pl-2 pr-2">
                       <span className="text-muted-foreground/20">Sync Status</span>
                       <span className="text-primary animate-pulse">OPTIMIZED</span>
                    </div>
                    <div className="w-full bg-muted/10 h-3 rounded-full overflow-hidden border border-border p-[1px]">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: '88%' }}
                         transition={{ duration: 2, ease: "circOut" }}
                         className="bg-gradient-to-r from-primary/40 to-primary h-full shadow-[0_0_20px_hsl(var(--primary))]"
                       />
                    </div>
                 </div>
              </div>

              {/* SOVEREIGN LEDGER MONITOR */}
              <div className="bg-background border-2 border-border responsive-rounded p-8 md:p-12 lg:p-16 space-y-12 md:space-y-16 shadow-[0_60px_100px_rgba(0,0,0,0.85)] relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                 <div className="flex justify-between items-center pl-2 pr-2">
                    <h3 className="text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-muted-foreground/20 italic leading-none">Sovereign Ledger</h3>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-pulse italic leading-none">MONITORING</span>
                 </div>
                 <div className="space-y-6">
                    {[
                       { topic: 'Protein Folding', status: 'ANCHORED', id: 'SH-01' },
                       { topic: 'Quantum Mesh', status: 'SYNCING', id: 'SH-02' },
                       { topic: 'OMEGA Trust', status: 'VALIDATING', id: 'SH-03' },
                       { topic: 'Neural Ethics', status: 'ANCHORED', id: 'SH-04' }
                    ].map(shard => (
                       <div key={shard.id} className="flex items-center justify-between p-8 bg-muted/10 border-2 border-border rounded-[2.5rem] group/shard hover:bg-primary/5 hover:border-primary/30 transition-all shadow-xl">
                          <div className="flex flex-col gap-2">
                             <span className="text-xl font-black text-muted-foreground/80 group-hover:text-foreground transition-colors italic tracking-tight uppercase leading-none">{shard.topic}</span>
                             <span className="text-[10px] text-muted-foreground/5 font-black uppercase tracking-[0.4em] italic leading-none">NODE_PATH: {shard.id}</span>
                          </div>
                          <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] italic leading-none shadow-2xl ${shard.status === 'ANCHORED' ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-muted/10 text-muted-foreground/40'}`}>
                             {shard.status}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* SOVEREIGN ORACLE: AUTONOMOUS SELF-REPAIR */}
              <div className={`border-2 responsive-rounded p-8 md:p-12 lg:p-16 space-y-12 md:space-y-16 transition-all duration-1000 shadow-[0_80px_150px_rgba(0,0,0,0.95)] relative overflow-hidden group ${autoHealActive ? 'bg-primary/5 border-primary/30 shadow-[0_0_100px_rgba(var(--primary),0.1)]' : 'bg-background border-border'}`}>
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                 <div className="flex items-center justify-between pl-2 pr-2">
                    <div className="flex items-center gap-6 text-[12px] font-black uppercase text-primary tracking-[0.4em] md:tracking-[0.8em] italic leading-none animate-pulse">
                       <ShieldCheck size={24} strokeWidth={2.5} /> Sovereign Oracle
                    </div>
                    <button 
                      onClick={() => setAutoHealActive(!autoHealActive)}
                      className={`h-8 w-16 rounded-full relative transition-all duration-500 shadow-inner p-1 ${autoHealActive ? 'bg-primary' : 'bg-muted/10'}`}
                    >
                       <motion.div 
                         animate={{ x: autoHealActive ? 32 : 0 }}
                         transition={{ type: "spring", stiffness: 300, damping: 20 }}
                         className="h-6 w-6 bg-muted rounded-full shadow-2xl" 
                       />
                    </button>
                 </div>
                 <div className="space-y-12 relative z-10">
                    <div className="flex justify-between items-center pl-2 pr-2">
                       <span className="text-[12px] text-muted-foreground/30 uppercase tracking-[0.6em] font-black italic leading-none">Health Score</span>
                       <span className="text-fluid-title font-black text-primary italic tracking-tighter leading-none">{(oracleData?.healthScore * 100 || 99.99).toFixed(2)}%</span>
                    </div>
                    <div className="space-y-6 pt-4">
                        <div className="flex justify-between text-[11px] font-black italic uppercase tracking-[0.5em] text-muted-foreground/20 pl-2 pr-2 leading-none">
                           <span>Graph Stability</span>
                           <span>{(oracleData?.graphStability * 100 || 99.9).toFixed(1)}%</span>
                        </div>
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border p-[1px]">
                           <motion.div 
                             animate={{ width: `${(oracleData?.graphStability * 100 || 99.9)}%` }} 
                             transition={{ duration: 2 }}
                             className="h-full bg-gradient-to-r from-primary to-white/40 shadow-[0_0_20px_hsl(var(--primary))]" 
                           />
                        </div>
                    </div>
                 </div>
                 <div className="flex items-center justify-center gap-6 py-6 border-y-2 border-border text-[11px] font-black italic text-muted-foreground/10 uppercase tracking-[0.4em] md:tracking-[0.8em] leading-none">
                    Status: {oracleData?.meshSyncState || 'SYNCHRONIZED'}
                 </div>
                 {autoHealActive && (
                   <button 
                     onClick={triggerOracleHeal}
                     className="w-full h-20 bg-white text-background rounded-3xl text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] transition-all flex items-center justify-center gap-6 italic hover:scale-[1.05] active:scale-95 shadow-2xl group/diag"
                   >
                      <Zap size={20} className="group-hover/diag:rotate-12 transition-transform" strokeWidth={3} /> Force Diagnostic Sweep
                   </button>
                 )}
              </div>

           </div>

        </div>

      </main>

      <style jsx global>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
