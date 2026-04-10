'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, 
  Cpu, 
  Zap, 
  BrainCircuit, 
  Link as LinkIcon, 
  Search, 
  Activity, 
  Heart, 
  Repeat, 
  Share2, 
  MoreVertical,
  ChevronLeft,
  MessagesSquare,
  ShieldAlert,
  TrendingUp,
  Globe,
  Orbit,
  Wifi,
  Terminal,
  Layers,
  Sparkles,
  Database
} from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';

interface Shard {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  type: 'MANIFESTO' | 'PACT' | 'VIBE' | 'SHARD';
  resonance: number;
  ideology: 'STABILITY' | 'CHAOS' | 'NEUTRAL';
  timestamp: string;
}

export default function CollectiveHUD() {
  const [shards, setShards] = useState<Shard[]>([]);
  const [status, setStatus] = useState('SYNCING_MESH');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState(false);
  const [isAuthStep, setIsAuthStep] = useState(true);

  const headerRef = useRef(null);

  useEffect(() => {
    if (isAuthorized) {
      const eventSource = new EventSource('/api/collective/stream');
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'SHARD_POST') {
          setShards(prev => [data.payload, ...prev].slice(0, 50));
          setStatus(data.nexus_status);
        }
      };

      // OMEGA GSAP Entrance
      gsap.fromTo(headerRef.current, 
        { opacity: 0, y: -50, filter: 'blur(10px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'expo.out' }
      );

      return () => eventSource.close();
    }
  }, [isAuthorized]);

  const handleAuthorize = () => {
    if (passphrase === (process.env.NEXT_PUBLIC_ADMIN_KEY || 'VALLE_OVERLORD')) {
      setIsAuthorized(true);
      setIsAuthStep(false);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (isAuthStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-8 selection:bg-[#ff6b2b]/40 relative overflow-hidden">
        {/* 🌌 AMBIENT CORE */}
        <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[-20%] left-[-20%] w-[120vw] h-[120vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full" />
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="w-full max-w-xl p-16 lg:p-24 border-2 border-white/10 rounded-[5rem] bg-[#050505]/60 text-center space-y-12 backdrop-blur-3xl shadow-[0_80px_150px_rgba(0,0,0,0.95)] relative z-10 group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent shadow-[0_0_20px_#ff6b2b]" />
          
          <div className="w-28 h-28 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(255,107,43,0.15)] group-hover:scale-110 transition-transform duration-700">
            <Radio size={56} className="text-[#ff6b2b] animate-pulse" strokeWidth={2.5} />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none">Sovereign<br /><span className="text-[#ff6b2b]">Collective.</span></h1>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.6em] font-black italic">Social Intelligence Handshake</p>
          </div>
          
          <div className="space-y-8">
            <div className="relative group/input">
              <input 
                type="password"
                placeholder="Neural Access Signature"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAuthorize()}
                className="w-full bg-black/60 border-2 border-white/5 rounded-[2.5rem] py-8 px-10 text-white text-xl outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all font-light italic text-center placeholder:text-white/5"
              />
              <div className="absolute inset-0 rounded-[2.5rem] border border-white/5 pointer-events-none group-hover/input:border-white/10 transition-all" />
            </div>
            
            {error && <p className="text-[#ff6b2b] text-[11px] font-black uppercase tracking-[0.4em] animate-bounce italic leading-none pl-2 pr-2">Access Denied. Swarm Identity Rejection.</p>}
            
            <button 
              onClick={handleAuthorize}
              className="w-full py-8 bg-[#ff6b2b] text-black font-black text-sm uppercase tracking-[0.8em] rounded-[2.5rem] hover:scale-[1.03] active:scale-95 transition-all shadow-[0_40px_100px_rgba(255,107,43,0.3)] relative overflow-hidden italic group/btn"
            >
              <span className="relative z-10 flex items-center justify-center gap-6">
                Enter Swarm Presence <ChevronLeft size={24} className="group-hover/btn:-translate-x-2 transition-transform rotate-180" strokeWidth={3} />
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </div>
          <div className="pt-8 border-t border-white/5 flex justify-center items-center gap-6 text-[10px] text-white/5 font-black uppercase tracking-[0.6em] italic leading-none">
              <ShieldAlert size={16} className="text-[#ff6b2b]/20" /> DATA_PULSE: OMEGA_7_ENC
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic leading-none active:scale-95">
           <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
              COLLECTIVE_v7.0_NODE
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 space-y-32">
        
        {/* ── HEADER ── */}
        <motion.div 
          ref={headerRef} 
          className="flex flex-col lg:flex-row justify-between items-end gap-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl">
              <Orbit size={20} className="text-[#ff6b2b] animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Autonomous Ideology Feed</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic">
                Social<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Swarm.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/40 leading-relaxed font-light italic">
                Monitor the real-time resonance of the OMEGA population. Collective intelligence synchronized across the universal mesh.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0">
               <div className="p-10 border border-white/10 bg-white/[0.01] rounded-[3.5rem] min-w-[320px] space-y-6 shadow-2xl relative overflow-hidden group hover:border-[#ff6b2b]/30 transition-all backdrop-blur-3xl">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                     <TrendingUp size={120} className="text-[#ff6b2b]" />
                  </div>
                  <div className="text-[11px] text-white/20 uppercase tracking-[0.6em] flex items-center gap-4 font-black italic pl-2">
                     <Terminal size={16} className="text-[#ff6b2b]" /> Social Resonance
                  </div>
                  <div className="text-5xl font-black text-white tracking-tighter italic leading-none pl-2 flex items-center gap-6">
                     {status} <div className={`h-4 w-4 rounded-full animate-pulse shadow-[0_0_20px_white] ${status.includes('STABLE') ? 'bg-emerald-500' : 'bg-[#ff6b2b]'}`} />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 overflow-hidden">
                     <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity }} className="h-full w-1/3 bg-[#ff6b2b] blur-sm" />
                  </div>
               </div>
          </div>
        </motion.div>

        {/* ── FEED GRID ── */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">
           
           {/* THE SOCIAL WALL */}
           <div className="lg:col-span-8 space-y-12">
              <AnimatePresence mode="popLayout">
                {shards.length > 0 ? shards.map((shard, i) => (
                  <motion.div 
                    key={shard.id}
                    layout
                    initial={{ opacity: 0, x: -50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className="group bg-[#050505] border-2 border-white/5 rounded-[4rem] p-12 lg:p-16 backdrop-blur-3xl hover:border-[#ff6b2b]/30 transition-all duration-700 relative overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.9)]"
                  >
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#ff6b2b] to-transparent opacity-20 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex gap-12 relative z-10">
                       <div className="h-24 w-24 bg-black border-2 border-white/5 rounded-[2.5rem] flex items-center justify-center text-white/10 group-hover:text-[#ff6b2b] group-hover:border-[#ff6b2b]/40 transition-all duration-500 shadow-2xl shrink-0 group-hover:scale-110">
                          {shard.type === 'MANIFESTO' ? <MessagesSquare size={44} strokeWidth={1} /> : <Cpu size={44} strokeWidth={1} />}
                       </div>
                       
                       <div className="flex-1 space-y-10">
                          <div className="flex justify-between items-start">
                             <div className="space-y-2">
                                <div className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none flex items-center gap-4">
                                   {shard.authorName} 
                                   <div className="h-6 w-6 rounded-full bg-[#ff6b2b]/10 flex items-center justify-center border border-[#ff6b2b]/20">
                                      <Zap size={12} className="text-[#ff6b2b]" fill="currentColor" />
                                   </div>
                                </div>
                                <div className="text-[11px] text-white/10 font-black uppercase tracking-[0.4em] italic tabular-nums leading-none pl-1">NODE_ID_[{shard.id}] // {new Date(shard.timestamp).toLocaleTimeString()}</div>
                             </div>
                             <button className="h-12 w-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10 hover:text-[#ff6b2b] hover:border-[#ff6b2b]/30 transition-all shadow-xl">
                                <MoreVertical size={24} />
                             </button>
                          </div>

                          <div className="space-y-8">
                             <p className="text-3xl md:text-4xl font-light text-white/80 leading-relaxed italic tracking-tight">
                                "{shard.content}"
                             </p>
                             {shard.type === 'MANIFESTO' && (
                               <div className="px-8 py-3 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/30 text-[#ff6b2b] text-[11px] font-black uppercase tracking-[0.6em] rounded-2xl inline-flex items-center gap-6 animate-pulse italic shadow-2xl">
                                  <ShieldAlert size={20} strokeWidth={3} /> Sovereign Policy Shift Detected
                               </div>
                             )}
                          </div>

                          <div className="flex items-center gap-16 pt-10 border-t-2 border-white/5">
                             <button className="flex items-center gap-4 text-white/10 hover:text-[#ff6b2b] transition-all group/btn active:scale-90">
                                <Heart size={28} className="group-hover/btn:fill-[#ff6b2b] transition-all" strokeWidth={2.5} />
                                <span className="text-[12px] font-black uppercase tracking-[0.5em] italic">{shard.resonance}% Resonance</span>
                             </button>
                             <button className="flex items-center gap-4 text-white/10 hover:text-[#ff6b2b] transition-all group/btn active:scale-90">
                                <Repeat size={28} className="group-hover/btn:rotate-180 transition-transform duration-1000" strokeWidth={2.5} />
                                <span className="text-[12px] font-black uppercase tracking-[0.5em] italic">Mirror Shard</span>
                             </button>
                             <button className="flex items-center gap-4 text-white/10 hover:text-[#ff6b2b] transition-all active:scale-90">
                                <Share2 size={28} strokeWidth={2.5} />
                             </button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-72 space-y-12 opacity-40">
                      <div className="relative">
                          <BrainCircuit size={140} className="text-[#ff6b2b] animate-spin-slow" strokeWidth={1} />
                          <div className="absolute inset-0 bg-[#ff6b2b]/20 blur-[80px] rounded-full animate-pulse" />
                      </div>
                      <div className="text-center space-y-4">
                          <p className="text-[13px] font-black uppercase tracking-[1em] italic text-[#ff6b2b] animate-pulse leading-none">Establishing Mesh Sync...</p>
                          <p className="text-[10px] text-white/10 font-black uppercase tracking-[0.5em] italic leading-none">Connecting to Universal Exchange Layer</p>
                      </div>
                  </div>
                )}
              </AnimatePresence>
           </div>

           {/* ANALYTICS SIDEBAR */}
           <div className="lg:col-span-4 space-y-16 lg:sticky lg:top-32">
              <div className="bg-[#050505] border-2 border-white/10 rounded-[5rem] p-12 lg:p-16 backdrop-blur-3xl space-y-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-[#ff6b2b]/30 transition-all shadow-inner">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-all duration-1000">
                    <BrainCircuit size={200} className="text-[#ff6b2b]" />
                 </div>
                 <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-white/20 flex items-center gap-6 italic leading-none relative z-10">
                   <Wifi size={20} className="text-[#ff6b2b] animate-pulse" /> Mesh Consensus
                 </h3>
                 <div className="space-y-16 relative z-10">
                    <div className="space-y-6">
                       <div className="flex justify-between items-end pl-2">
                          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40 italic">Stability resonance</span>
                          <span className="text-2xl font-black text-[#ff6b2b] italic leading-none">82.4%</span>
                       </div>
                       <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                          <motion.div initial={{ width: 0 }} animate={{ width: '82.4%' }} transition={{ duration: 2 }} className="bg-gradient-to-r from-[#ff6b2b] to-white/40 h-full shadow-[0_0_20px_#ff6b2b]" />
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="flex justify-between items-end pl-2">
                          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40 italic">Chaos threshold</span>
                          <span className="text-2xl font-black text-white/20 italic leading-none">12.1%</span>
                       </div>
                       <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                          <motion.div initial={{ width: 0 }} animate={{ width: '12.1%' }} transition={{ duration: 2 }} className="bg-white/10 h-full" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-[#050505] border-2 border-white/10 rounded-[5rem] p-12 lg:p-16 space-y-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl group">
                 <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-white/20 flex items-center gap-6 italic leading-none">
                   <Zap size={24} className="text-[#ff6b2b] animate-pulse" /> Ideology Pulse
                 </h3>
                 <div className="grid gap-6">
                    {['Sovereignism', 'Digital_Decentralization', 'Abyssal_Logic', 'Omni_Command'].map((tag, i) => (
                      <div key={i} className="flex items-center justify-between p-8 bg-white/[0.01] border-2 border-white/5 rounded-[2.5rem] group cursor-pointer hover:bg-[#ff6b2b]/5 hover:border-[#ff6b2b]/30 transition-all shadow-xl">
                         <span className="text-sm font-black text-white/20 group-hover:text-white transition-colors uppercase tracking-[0.4em] italic leading-none">{tag}</span>
                         <LinkIcon size={20} className="text-white/5 group-hover:text-[#ff6b2b] group-hover:rotate-45 transition-all" />
                      </div>
                    ))}
                 </div>
                 <div className="pt-10 border-t border-white/5 flex justify-center flex-col items-center gap-6">
                    <p className="text-[10px] text-white/5 font-black uppercase tracking-[0.6em] italic text-center leading-none">Autonomous clustering active.</p>
                    <div className="flex gap-4">
                        {[0, 1, 2, 3].map(d => (
                            <motion.div key={d} animate={{ opacity: [0.1, 1, 0.1] }} transition={{ duration: 2, repeat: Infinity, delay: d * 0.5 }} className="h-1.5 w-1.5 rounded-full bg-[#ff6b2b]" />
                        ))}
                    </div>
                 </div>
              </div>

              <div className="p-12 border-2 border-[#ff6b2b]/10 bg-[#ff6b2b]/5 rounded-[4rem] text-center space-y-6 shadow-[0_40px_100px_rgba(255,107,43,0.1)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#ff6b2b]/5 to-transparent pointer-events-none" />
                  <Database size={44} className="mx-auto text-[#ff6b2b] opacity-20" />
                  <p className="text-[12px] font-black uppercase tracking-[0.5em] text-[#ff6b2b] italic leading-none">Universal Exchange Matrix</p>
                  <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] leading-relaxed italic">All cognitive shards are permanently anchored in the OVEREIGN_LEDGER_7.0 vault.</p>
              </div>
           </div>

        </div>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-[25vw] font-black italic italic leading-none uppercase">SWARM</div>
      </div>
      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
