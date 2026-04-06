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
  Map as MapIcon
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
      const interval = setInterval(fetchData, 5000);
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
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 selection:bg-[#00ffc3]/30 selection:text-white">
        
        {/* Background Depth */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-20%] w-[100vw] h-[100vw] bg-[#00ffc3]/5 blur-[250px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[100vw] h-[100vw] bg-[#7000ff]/3 blur-[250px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg z-10 space-y-8"
        >
          <div className="text-center space-y-4">
             <h1 className="text-6xl font-black uppercase tracking-tighter text-white italic leading-none">
                Sovereign<br/> <span className="text-[#00ffc3]">Nexus.</span>
             </h1>
             <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-mono">Neural Interface Handshake Protocol v5.0.1</p>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl space-y-8 relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {authStep === 0 && (
                <motion.div 
                  key="step0"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-center">
                    <div className="h-20 w-20 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-[#7000ff] shadow-[0_0_40px_rgba(112,0,255,0.1)]">
                       <ShieldAlert size={36} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input 
                        type="password"
                        placeholder="Neural Signature Phrase"
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAuthorize()}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-12 pr-6 text-white text-sm outline-none focus:border-[#00ffc3]/40 transition-colors font-mono"
                      />
                    </div>
                    {error && <p className="text-center text-magenta-500 text-[10px] font-black uppercase animate-pulse">Signature Rejection: Protocol Lockdown.</p>}
                    <button 
                      onClick={handleAuthorize}
                      className="w-full py-5 bg-[#00ffc3] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_50px_rgba(0,255,195,0.2)]"
                    >
                      Authenticate Signature
                    </button>
                  </div>
                </motion.div>
              )}

              {authStep === 1 && (
                <motion.div 
                   key="step1"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="text-center space-y-6 py-10"
                >
                   <div className="flex justify-center flex-col items-center gap-6">
                      <div className="h-2 w-2 rounded-full bg-[#00ffc3] animate-ping" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00ffc3]">Verifying Neural Patterns...</p>
                   </div>
                </motion.div>
              )}

              {authStep === 2 && (
                <motion.div 
                   key="step2"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="text-center space-y-6 py-10"
                >
                   <div className="flex justify-center flex-col items-center gap-6">
                      <ShieldCheck size={48} className="text-[#00ffc3] animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Access Granted. Syncing Nexus nodes.</p>
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
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00ffc3]/20 font-sans p-4 lg:p-12 overflow-x-hidden flex flex-col">
      
      {/* Nexus Depth Engine */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-[#00ffc3]/3 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[80vw] h-[80vw] bg-[#7000ff]/3 blur-[200px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-[1700px] mx-auto w-full space-y-12 flex-1 flex flex-col">
        
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#00ffc3] transition-colors text-[10px] font-black uppercase tracking-widest mb-2 group">
               Nexus Entrance <Radio size={14} className="group-hover:animate-pulse" />
            </Link>
            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">
              Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">Terminal.</span>
            </h1>
            <p className="text-xs text-white/20 font-mono uppercase tracking-[0.3em]">Omni-Intelligence Operations Center // OMEGA CLEARANCE</p>
          </div>

          <div className="flex flex-wrap gap-4">
             <div className="px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4 group">
                <div className="h-10 w-10 bg-black border border-[#00ffc3]/20 rounded-xl flex items-center justify-center text-[#00ffc3] group-hover:scale-110 transition-transform">
                   <Activity size={20} />
                </div>
                <div>
                   <div className="text-[9px] text-white/20 uppercase tracking-widest">Neural Stability</div>
                   <div className="text-lg font-black text-[#00ffc3]">99.982%</div>
                </div>
             </div>
             <div className="px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4 group">
                <div className="h-10 w-10 bg-black border border-[#7000ff]/20 rounded-xl flex items-center justify-center text-[#7000ff] group-hover:scale-110 transition-transform">
                   <Globe size={20} />
                </div>
                <div>
                   <div className="text-[9px] text-white/20 uppercase tracking-widest">Global Reach</div>
                   <div className="text-lg font-black text-white">{systemData?.metrics?.reach || '4.2M'}</div>
                </div>
             </div>
          </div>
        </header>

        {/* MAIN OPERATIONS GRID */}
        <div className="grid lg:grid-cols-12 gap-8 flex-1">
          
          {/* THE TERMINAL SHELL - 8 COLS */}
          <div className="lg:col-span-8 flex flex-col space-y-8 min-h-[600px]">
             <NeuralTerminal />
             
             {/* DATA ANALYTICS TICKER */}
             <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-3xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-3">
                      <BrainCircuit size={14} className="text-[#00ffc3]" /> Sovereign Cognitive Manifest
                   </h3>
                   <div className="text-[9px] text-[#00ffc3] font-mono animate-pulse">STREAMING_LIVE</div>
                </div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                  {systemData?.manifest?.map((log: any, i: number) => (
                    <div key={log.id} className="group border-l border-white/10 pl-6 py-2 hover:border-[#00ffc3]/50 transition-all">
                       <div className="flex items-center gap-3 mb-1">
                          <span className="text-[9px] font-mono text-white/20 tabular-nums">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                          <span className="px-2 py-0.5 bg-black border border-white/5 text-[8px] text-[#7000ff] font-black rounded uppercase">{log.agentName}</span>
                       </div>
                       <p className="text-sm text-white/60 leading-relaxed font-light group-hover:text-white transition-colors">{log.thought}</p>
                       {log.action && (
                         <div className="mt-2 text-[#00ffc3] text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Zap size={10} /> EXECUTION: {log.action}
                         </div>
                       )}
                    </div>
                  ))}
                  {!systemData?.manifest && <div className="text-center py-20 text-white/10 italic text-xs">Synchronizing with Sovereign Swarm...</div>}
                </div>
             </div>
          </div>

          {/* SIDE HUD - 4 COLS */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* KNOWLEDGE SHARD STATUS */}
             <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-3xl space-y-8 relative overflow-hidden">
                <Database size={80} className="absolute -bottom-4 -right-4 text-white/5 rotate-12" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-3">
                   <Layers size={14} /> Cognitive Storage
                </h3>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                   <div className="bg-black/40 border border-white/5 p-6 rounded-2xl text-center space-y-1">
                      <div className="text-3xl font-black text-[#00ffc3] tracking-tighter">{systemData?.metrics?.knowledge_shards || '0'}</div>
                      <div className="text-[8px] text-white/20 uppercase tracking-widest">Shards</div>
                   </div>
                   <div className="bg-black/40 border border-white/5 p-6 rounded-2xl text-center space-y-1">
                      <div className="text-3xl font-black text-[#7000ff] tracking-tighter">{systemData?.metrics?.neural_links || '0'}</div>
                      <div className="text-[8px] text-white/20 uppercase tracking-widest">Links</div>
                   </div>
                </div>
                <div className="space-y-3 pt-2">
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-white/30">Sync Status</span>
                      <span className="text-[#00ffc3]">OPTIMIZED</span>
                   </div>
                   <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '88%' }}
                        className="bg-gradient-to-r from-[#7000ff] to-[#00ffc3] h-full"
                      />
                   </div>
                </div>
             </div>

             {/* SIMULATOR QUICK LINKS */}
             <div className="bg-black/60 border border-white/5 rounded-3xl p-8 space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-3">
                   <Cpu size={14} /> Swarm Core Controls
                </h3>
                <div className="grid gap-3 font-mono uppercase text-[9px] font-bold">
                   <Link href="/simulator" className="group flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-[#00ffc3]/10 hover:border-[#00ffc3]/30 transition-all">
                      <span className="text-white/40 group-hover:text-white transition-colors">Enter High-Fidelity Mesh</span>
                      <ArrowUpRight size={14} className="text-[#00ffc3]" />
                   </Link>
                   <Link href="/predictor" className="group flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-[#7000ff]/10 hover:border-[#7000ff]/30 transition-all">
                      <span className="text-white/40 group-hover:text-white transition-colors">Invoke Swarm Foresight</span>
                      <ArrowUpRight size={14} className="text-[#7000ff]" />
                   </Link>
                   <Link href="/atlas" className="group flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-[#00ffc3]/10 hover:border-[#00ffc3]/30 transition-all border-dashed">
                      <span className="text-white/40 group-hover:text-white transition-colors">Neural Cartography (Atlas)</span>
                      <MapIcon size={14} className="text-[#00ffc3]" />
                   </Link>
                </div>
             </div>

             {/* SOVEREIGN ORACLE: AUTONOMOUS SELF-REPAIR */}
             <div className={`${autoHealActive ? 'bg-[#00ffc3]/5 border-[#00ffc3]/20' : 'bg-white/5 border-white/10'} border rounded-3xl p-8 space-y-6 transition-all duration-700`}>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3 text-[10px] font-black uppercase text-[#00ffc3] tracking-widest">
                      <ShieldCheck size={14} className={autoHealActive ? 'animate-pulse' : ''} /> Sovereign Oracle
                   </div>
                   <button 
                     onClick={() => setAutoHealActive(!autoHealActive)}
                     className={`h-4 w-8 rounded-full relative transition-colors ${autoHealActive ? 'bg-[#00ffc3]' : 'bg-white/10'}`}
                   >
                      <motion.div 
                        animate={{ x: autoHealActive ? 16 : 2 }}
                        className="absolute top-1 h-2 w-2 bg-black rounded-full" 
                      />
                   </button>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/30 uppercase tracking-widest font-black italic">Health Score</span>
                      <span className="text-xl font-black text-[#00ffc3] tabular-nums">{(oracleData?.healthScore * 100 || 99.99).toFixed(2)}%</span>
                   </div>
                   <div className="space-y-2">
                       <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase tracking-widest font-black italic">
                          <span>Graph Stability</span>
                          <span>{(oracleData?.graphStability * 100 || 99.9).toFixed(1)}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            animate={{ width: `${(oracleData?.graphStability * 100 || 99.9)}%` }} 
                            className="h-full bg-[#00ffc3]/40" 
                          />
                       </div>
                   </div>
                </div>
                <p className="text-[10px] text-white/30 font-light leading-relaxed font-mono uppercase tracking-widest">
                   Status: {oracleData?.meshSyncState || 'SYNCHRONIZED'}
                </p>
                {autoHealActive && (
                  <button 
                    onClick={triggerOracleHeal}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#00ffc3] hover:text-black transition-all flex items-center justify-center gap-2"
                  >
                     <Zap size={12} /> Force Diagnostic Sweep
                  </button>
                )}
             </div>

          </div>

        </div>

      </main>

    </div>
  );
}
