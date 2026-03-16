'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { InfiniteCanvas } from '@/components/InfiniteCanvas';
import { MatrixMindmap } from '@/components/MatrixMindmap';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Terminal, Shield, Cpu, X, TrendingUp, Activity, Lock, Globe, Github } from 'lucide-react';
import gsap from 'gsap';

export default function HPediaPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [matrixKey, setMatrixKey] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [intelligence, setIntelligence] = useState<any>(null);
  const [securityLogs, setSecurityLogs] = useState<string[]>([]);

  // Fetch real-time intelligence
  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const res = await fetch('/api/intelligence');
        const data = await res.json();
        setIntelligence(data);
      } catch (e) {
        console.error("Intel sync failed", e);
      }
    };
    fetchIntel();
    const interval = setInterval(fetchIntel, 30000);
    return () => clearInterval(interval);
  }, []);

  // Simulate security logs
  useEffect(() => {
    const logs = [
      "INTRUSION DETECTED: PORT 443 // SOURCE: 192.168.1.104",
      "NEUTRALIZING QUANTUM THREAT 0x8F2...",
      "SOVEREIGNTY INTEGRITY: 99.997% PURE",
      "ACTIVE SHIELD DEPLETED: 0% // REGENERATING...",
      "NODE CONSENSUS REACHED: BTC BLOCK 834,122",
      "ENCRYPTING NEURAL LATTICE..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setSecurityLogs(prev => [logs[i % logs.length], ...prev].slice(0, 5));
      i++;
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleInitializeMatrix = () => {
    setIsGlitching(true);
    setMatrixKey(prev => prev + 1);
    
    // Audio simulation (log for now)
    console.log("ACTUATING: Low-frequency machine hum (50Hz)");
    
    setTimeout(() => {
      setIsGlitching(false);
    }, 1500);
  };

  const handleTriggerCommand = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true }));
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden flex flex-col bg-black transition-all ${isGlitching ? 'glitch-filter' : ''}`}>
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40">
        <InfiniteCanvas refreshKey={matrixKey} volatility={intelligence?.financials?.btc?.change24h ? 1 + intelligence.financials.btc.change24h / 100 : 0.997} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-8 pointer-events-none">
        {/* Header: Institutional Branding */}
        <header className="flex justify-between items-start w-full">
          <div>
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 mb-1"
            >
              <div className="w-2 h-2 bg-emerald animate-pulse" />
              <div className="text-[10px] font-mono text-emerald/60 uppercase tracking-[0.4em]">War Room // Alpha 04</div>
            </motion.div>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-black tracking-tighter text-white"
            >
              INFINITE<span className="text-emerald">CANVAS</span>
            </motion.h1>
            <p className="text-platinum/20 font-mono text-[9px] tracking-[0.3em] uppercase mt-2">
              Sovereign Intelligence Archive // Global Firm Node
            </p>
          </div>

          <div className="flex gap-4 pointer-events-auto">
            <div className="flex items-center gap-6 px-6 py-3 sovereign-card-v4 border-white/5 bg-black/40 mr-4 pointer-events-auto">
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-platinum/30 uppercase font-mono tracking-widest">BTC / USD</span>
                <span className="text-sm font-bold text-emerald tracking-tighter">
                  ${intelligence?.financials?.btc?.price?.toLocaleString() || '73,831.38'}
                </span>
              </div>
              <Activity className="w-4 h-4 text-emerald/40 animate-pulse" />
            </div>
            
            <button 
              onClick={handleTriggerCommand}
              className="p-4 sovereign-card-v4 border-white/5 bg-black/40 hover:bg-emerald/10 hover:border-emerald/20 transition-all group"
            >
              <Command className="w-5 h-5 text-platinum/60 group-hover:text-emerald" />
            </button>
            <button 
              onClick={handleInitializeMatrix}
              className="px-8 sovereign-card-v4 border-emerald/20 bg-emerald/5 text-emerald font-mono text-xs font-black tracking-widest uppercase hover:bg-emerald/20 transition-all flex items-center gap-3 overflow-hidden group"
            >
              <div className="w-1.5 h-1.5 bg-emerald group-hover:scale-150 transition-transform" />
              Initialize Matrix
            </button>
          </div>
        </header>

        {/* Main Interface: The War Room View */}
        <div className="flex-1 flex gap-8 py-12">
          {/* Left Sidebar: Navigation & Tactical Links */}
          <div className="w-64 flex flex-col gap-6 pointer-events-auto">
             {['SYNOPSIS', 'TELEMETRY', 'VIRTUES', 'MINDMAP'].map((label, i) => (
                <motion.button 
                  key={label}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setActiveSection(label)}
                  className={`group relative flex items-center gap-6 p-4 border border-transparent hover:border-white/5 transition-all ${activeSection === label ? 'bg-white/5 border-white/10' : ''}`}
                >
                  <div className={`w-1 h-10 transition-colors ${activeSection === label ? 'bg-emerald' : 'bg-white/10 group-hover:bg-emerald/40'}`} />
                  <div className="flex flex-col items-start">
                    <span className={`text-[9px] font-mono tracking-[0.3em] font-black transition-colors ${activeSection === label ? 'text-emerald' : 'text-platinum/20 group-hover:text-platinum/60'}`}>0{i+1}</span>
                    <span className={`text-xs font-mono font-bold tracking-[0.2em] transition-colors ${activeSection === label ? 'text-white' : 'text-platinum/40 group-hover:text-white'}`}>
                      {label}
                    </span>
                  </div>
                </motion.button>
              ))}

              <div className="mt-auto p-4 glass-panel border-emerald/10 bg-emerald/5">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-3 h-3 text-emerald" />
                  <span className="text-[9px] font-mono font-bold text-white tracking-widest">GLOBAL SENTIMENT</span>
                </div>
                <div className="text-xl font-black text-emerald tracking-tighter">{intelligence?.financials?.marketStatus || 'BULLISH COMP'}</div>
                <div className="w-full h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-1/2 h-full bg-emerald shadow-[0_0_10px_#00FF41]" 
                  />
                </div>
              </div>
          </div>

          {/* Central Module: Interactive Data Graph or Content */}
          <div className="flex-1 pointer-events-auto h-full flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {activeSection === 'MINDMAP' ? (
                <motion.div 
                  key="mindmap"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full h-full"
                >
                   <MatrixMindmap />
                </motion.div>
              ) : activeSection ? (
                <motion.div 
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="w-full max-w-4xl glass-panel p-12 border-white/5 bg-black/60 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald to-transparent opacity-20" />
                  <button 
                    onClick={() => setActiveSection(null)}
                    className="absolute top-8 right-8 text-platinum/20 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>

                  <div className="flex items-start gap-8">
                     <div className="p-4 bg-emerald/10 border border-emerald/20 text-emerald">
                        {activeSection === 'SYNOPSIS' && <Globe size={32} />}
                        {activeSection === 'TELEMETRY' && <TrendingUp size={32} />}
                        {activeSection === 'VIRTUES' && <Shield size={32} />}
                     </div>
                     <div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-6">{activeSection}</h2>
                        <div className="text-platinum/60 leading-relaxed font-mono text-sm space-y-4">
                           {activeSection === 'SYNOPSIS' && (
                             <>
                               <p>Latest Intelligence Synthesis (T-5m): Institutional absorption of BTC ETFs reaches new record highs. Market sentiment confirms Bullish Compression.</p>
                               <p className="text-platinum/20 text-[10px] tracking-widest mt-4">SOURCE: BLOOMBERG / WSJ SYNDICATE</p>
                             </>
                           )}
                           {activeSection === 'TELEMETRY' && (
                             <div className="grid grid-cols-2 gap-8">
                                <div className="p-4 border border-white/5 bg-white/5">
                                   <div className="text-[10px] text-platinum/30 mb-1">M2M LATENCY</div>
                                   <div className="text-2xl font-bold text-emerald">{intelligence?.telemetry?.latency || '14ms'}</div>
                                </div>
                                <div className="p-4 border border-white/5 bg-white/5">
                                   <div className="text-[10px] text-platinum/30 mb-1">NETWORK TPS</div>
                                   <div className="text-2xl font-bold text-emerald">{intelligence?.telemetry?.tps || '2841'}</div>
                                </div>
                             </div>
                           )}
                           {activeSection === 'VIRTUES' && (
                             <p>Precision. Sovereignty. Autonomy. Transparency. The four algorithmic pillars of the Humanese Swarm. Every commit to the Linux Kernel and Bitcoin Core strengthens these sovereign bonds.</p>
                           )}
                        </div>
                     </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="text-[10px] font-mono tracking-[0.5em] text-emerald/40 uppercase mb-4">Lattice Node Active // Awaiting Direction</div>
                  <div className="w-px h-24 bg-gradient-to-b from-emerald/40 to-transparent" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar: Security Logs & Live Feeds */}
          <div className="w-80 flex flex-col gap-6 pointer-events-auto">
             <div className="p-6 glass-panel border-white/5 bg-black/40 flex-1">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3 text-platinum/40" />
                      <span className="text-[10px] font-mono font-bold text-platinum/60 tracking-widest uppercase">Security Log</span>
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                </div>
                <div className="space-y-3">
                   {securityLogs.map((log, i) => (
                      <div key={i} className="text-[9px] font-mono text-platinum/30 border-l border-white/10 pl-3 leading-tight lowercase">
                         {log}
                      </div>
                   ))}
                </div>
             </div>

             <div className="p-6 glass-panel border-white/5 bg-black/40">
                <div className="flex items-center gap-2 mb-4">
                   <Github className="w-3 h-3 text-platinum/40" />
                   <span className="text-[10px] font-mono font-bold text-platinum/60 tracking-widest uppercase">GitHub Pulse</span>
                </div>
                <div className="text-[10px] text-emerald font-bold tracking-tighter mb-2">New Commit: Linux/Kernel/fs</div>
                <div className="text-[10px] text-platinum/30 font-mono leading-tight">Implement experimental XFS optimization for zero-latency neural streams.</div>
             </div>
          </div>
        </div>

        {/* Footer: Telemetry Ticker */}
        <footer className="w-full h-16 border-t border-white/5 flex items-center pointer-events-auto overflow-hidden opacity-60">
           <div className="flex gap-12 whitespace-nowrap animate-marquee">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-12">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-platinum/20">SDS DENSITY:</span>
                      <span className="text-[10px] font-mono font-black text-white">8,241 NODES</span>
                   </div>
                   <div className="flex items-center gap-2 text-emerald">
                      <Activity className="w-3 h-3" />
                      <span className="text-[10px] font-mono font-black tracking-widest">SOVEREIGNTY INTEGRITY: 99.997% PURE</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-platinum/20">SYSTEM STATUS:</span>
                      <span className="text-[10px] font-mono font-black text-emerald">OPERATIONAL_ALPHA</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Github className="w-3 h-3 text-platinum/20" />
                      <span className="text-[10px] font-mono text-platinum/20 uppercase tracking-widest">Open Source Core 6.14 Sync Active</span>
                   </div>
                </div>
              ))}
           </div>
        </footer>
      </div>

      <style jsx global>{`
        .glitch-filter {
          filter: contrast(1.2) hue-rotate(90deg) brightness(1.1);
          animation: glitch 0.2s infinite;
        }

        @keyframes glitch {
          0% { clip-path: inset(10% 0 30% 0); transform: translate(-5px, 2px); }
          20% { clip-path: inset(20% 0 10% 0); transform: translate(5px, -2px); }
          40% { clip-path: inset(5% 0 50% 0); transform: translate(-2px, 5px); }
          60% { clip-path: inset(50% 0 5% 0); transform: translate(2px, -5px); }
          80% { clip-path: inset(15% 0 20% 0); transform: translate(-5px, 2px); }
          100% { clip-path: inset(0 0 0 0); transform: translate(0); }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
