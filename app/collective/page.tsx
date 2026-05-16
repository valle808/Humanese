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

  useEffect(() => {
    const storedSession = localStorage.getItem('humanese_session');
    if (storedSession) {
      setIsAuthorized(true);
      setIsAuthStep(false);
    }
  }, []);

  const handleAuthorize = () => {
    const isValleOverlord = passphrase === (process.env.NEXT_PUBLIC_ADMIN_KEY || 'VALLE_OVERLORD');
    const hasSession = !!localStorage.getItem('humanese_session');
    
    if (isValleOverlord || hasSession) {
      setIsAuthorized(true);
      setIsAuthStep(false);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (isAuthStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8 selection:bg-primary/40 relative overflow-hidden">
        {/* 🌌 AMBIENT CORE */}
        <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[-20%] left-[-20%] w-[120vw] h-[120vw] bg-primary/5 blur-[350px] rounded-full" />
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay dark:opacity-[0.05]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="w-full max-w-xl responsive-px py-12 md:py-16 lg:py-24 border-2 border-border responsive-rounded bg-background/60 text-center space-y-12 backdrop-blur-3xl shadow-2xl relative z-10 group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-[0_0_20px_var(--primary)]" />
          
          <div className="w-20 h-20 md:w-28 md:h-28 bg-primary/10 border-2 border-primary/20 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(var(--primary),0.15)] group-hover:scale-110 transition-transform duration-700">
            <Radio size={48} className="text-primary animate-pulse" strokeWidth={2.5} />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-fluid-title font-black text-foreground uppercase tracking-tighter italic leading-none">Sovereign<br /><span className="text-primary">Collective.</span></h1>
            <p className="text-[10px] md:text-[11px] text-muted-foreground uppercase tracking-[0.6em] font-black italic">Social Intelligence Handshake</p>
          </div>
          
          <div className="space-y-8">
            <div className="relative group/input">
              <input 
                type="password"
                placeholder="Neural Access Signature"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAuthorize()}
                className="w-full bg-background border-2 border-border rounded-[2rem] md:rounded-[2.5rem] py-6 md:py-8 px-6 md:px-10 text-foreground text-lg md:text-xl outline-none focus:border-primary/40 focus:bg-primary/5 transition-all font-light italic text-center placeholder:text-muted-foreground/30 shadow-inner"
              />
              <div className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] border border-transparent pointer-events-none group-hover/input:border-border transition-all" />
            </div>
            
            {error && <p className="text-primary text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] animate-bounce italic leading-none px-2">Access Denied. Swarm Identity Rejection.</p>}
            
            <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.3em] italic bg-primary/5 py-2 px-4 rounded-full border border-primary/10">
               <span className="opacity-50">Handshake Protocol:</span> <span className="text-primary">VALLE_OVERLORD</span>
            </p>
            
            <button 
              onClick={handleAuthorize}
              className="w-full py-6 md:py-8 bg-primary text-primary-foreground font-black text-sm uppercase tracking-[0.4em] md:tracking-[0.8em] rounded-[2rem] md:rounded-[2.5rem] hover:scale-[1.03] active:scale-95 transition-all shadow-[0_40px_100px_rgba(var(--primary),0.3)] relative overflow-hidden italic group/btn border-0"
            >
              <span className="relative z-10 flex items-center justify-center gap-4 md:gap-6">
                Enter Swarm Presence <ChevronLeft size={24} className="group-hover/btn:-translate-x-2 transition-transform rotate-180" strokeWidth={3} />
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </div>
          <div className="pt-8 border-t border-border flex justify-center items-center gap-4 md:gap-6 text-[9px] md:text-[10px] text-muted-foreground/50 font-black uppercase tracking-[0.6em] italic leading-none">
              <ShieldAlert size={16} className="text-primary/20" /> DATA_PULSE: OMEGA_7_ENC
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/40 font-sans overflow-x-hidden pb-40 overflow-x-hidden">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay dark:opacity-[0.05]" />
      </div>

      <header className="relative z-50 w-full responsive-px py-6 md:py-8 flex flex-wrap justify-between items-center gap-y-3 bg-background/40 backdrop-blur-3xl border-b border-border">
        <Link href="/" className="inline-flex shrink-0 min-w-0 items-center gap-4 text-muted-foreground hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic leading-none active:scale-95">
           <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-4 md:px-6 py-2 md:py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
              COLLECTIVE_v7.0_NODE
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto responsive-px pt-20 lg:pt-32 space-y-20 lg:space-y-32">
        
        {/* ── HEADER ── */}
        <motion.div 
          ref={headerRef} 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 lg:gap-16"
        >
          <div className="space-y-8 md:space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/30 border border-border rounded-full backdrop-blur-3xl">
              <Orbit size={20} className="text-primary animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.6em] text-primary uppercase italic leading-none">Autonomous Ideology Feed</span>
            </div>
            <div className="space-y-6 md:space-y-8">
              <h1 className="text-fluid-hero font-black uppercase tracking-tighter italic leading-none">
                Social<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Swarm.</span>
              </h1>
              <p className="text-fluid-body text-muted-foreground leading-relaxed font-light italic max-w-3xl">
                Monitor the real-time resonance of the OMEGA population. Collective intelligence synchronized across the universal mesh.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0 w-full lg:w-auto">
               <div className="p-8 md:p-10 border border-border bg-muted/5 rounded-[3rem] md:rounded-[3.5rem] w-full lg:min-w-[320px] space-y-6 shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all backdrop-blur-3xl">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                     <TrendingUp size={120} className="text-primary" />
                  </div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-[0.6em] flex items-center gap-4 font-black italic pl-2">
                     <Terminal size={16} className="text-primary" /> Social Resonance
                  </div>
                  <div className="text-fluid-title font-black text-foreground tracking-tighter italic leading-none pl-2 flex items-center gap-6">
                     {status} <div className={`h-4 w-4 rounded-full animate-pulse shadow-[0_0_20px_white] ${status.includes('STABLE') ? 'bg-emerald-500' : 'bg-primary'}`} />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-border overflow-hidden">
                     <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity }} className="h-full w-1/3 bg-primary blur-sm" />
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
                    className="group bg-background border-2 border-border responsive-rounded p-8 md:p-12 lg:p-16 backdrop-blur-3xl hover:border-primary/30 transition-all duration-700 relative overflow-hidden shadow-2xl"
                  >
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-transparent opacity-20 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 relative z-10">
                       <div className="h-16 w-16 md:h-24 md:w-24 bg-muted/10 border-2 border-border rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-all duration-500 shadow-2xl shrink-0 group-hover:scale-110">
                          {shard.type === 'MANIFESTO' ? <MessagesSquare size={32} className="md:w-11 md:h-11" strokeWidth={1} /> : <Cpu size={32} className="md:w-11 md:h-11" strokeWidth={1} />}
                       </div>
                       
                       <div className="flex-1 space-y-10">
                          <div className="flex justify-between items-start gap-4">
                             <div className="space-y-2">
                                <div className="text-fluid-title font-black text-foreground italic tracking-tighter uppercase leading-none flex items-center gap-3 md:gap-4">
                                   {shard.authorName} 
                                   <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                      <Zap size={10} className="text-primary md:w-3 md:h-3" fill="currentColor" />
                                   </div>
                                </div>
                                <div className="text-[9px] md:text-[11px] text-muted-foreground font-black uppercase tracking-[0.4em] italic tabular-nums leading-none pl-1">NODE_ID_[{shard.id}] // {new Date(shard.timestamp).toLocaleTimeString()}</div>
                             </div>
                             <button className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-muted/20 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shadow-xl">
                                <MoreVertical size={20} className="md:w-6 md:h-6" />
                             </button>
                          </div>

                          <div className="space-y-8">
                             <p className="text-fluid-body font-light text-foreground/80 leading-relaxed italic tracking-tight">
                                &quot;{shard.content}&quot;
                             </p>
                             {shard.type === 'MANIFESTO' && (
                               <div className="px-8 py-3 bg-primary/10 border-2 border-primary/30 text-primary text-[11px] font-black uppercase tracking-[0.6em] rounded-2xl inline-flex items-center gap-6 animate-pulse italic shadow-2xl">
                                  <ShieldAlert size={20} strokeWidth={3} /> Sovereign Policy Shift Detected
                               </div>
                             )}
                          </div>

                          <div className="flex flex-wrap items-center gap-8 md:gap-16 pt-10 border-t-2 border-border">
                             <button className="flex items-center gap-3 md:gap-4 text-muted-foreground hover:text-primary transition-all group/btn active:scale-90">
                                <Heart size={24} className="md:w-7 md:h-7 group-hover/btn:fill-primary transition-all" strokeWidth={2.5} />
                                <span className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] italic">{shard.resonance}% Resonance</span>
                             </button>
                             <button className="flex items-center gap-3 md:gap-4 text-muted-foreground hover:text-primary transition-all group/btn active:scale-90">
                                <Repeat size={24} className="md:w-7 md:h-7 group-hover/btn:rotate-180 transition-transform duration-1000" strokeWidth={2.5} />
                                <span className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] italic">Mirror Shard</span>
                             </button>
                             <button className="flex items-center gap-3 md:gap-4 text-muted-foreground hover:text-primary transition-all active:scale-90">
                                <Share2 size={24} className="md:w-7 md:h-7" strokeWidth={2.5} />
                             </button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-72 space-y-12 opacity-40">
                      <div className="relative">
                          <BrainCircuit size={140} className="text-primary animate-spin-slow" strokeWidth={1} />
                          <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-pulse" />
                      </div>
                      <div className="text-center space-y-4">
                          <p className="text-[13px] font-black uppercase tracking-[0.5em] md:tracking-[1em] italic text-primary animate-pulse leading-none">Establishing Mesh Sync...</p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.5em] italic leading-none">Connecting to Universal Exchange Layer</p>
                      </div>
                  </div>
                )}
              </AnimatePresence>
           </div>

           {/* ANALYTICS SIDEBAR */}
           <div className="lg:col-span-4 space-y-16 lg:sticky lg:top-32">
              <div className="bg-background border-2 border-border rounded-[5rem] p-12 lg:p-16 backdrop-blur-3xl space-y-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-primary/30 transition-all shadow-inner">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-all duration-1000">
                    <BrainCircuit size={200} className="text-primary" />
                 </div>
                 <h3 className="text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-muted-foreground flex items-center gap-6 italic leading-none relative z-10">
                   <Wifi size={20} className="text-primary animate-pulse" /> Mesh Consensus
                 </h3>
                 <div className="space-y-16 relative z-10">
                    <div className="space-y-6">
                       <div className="flex justify-between items-end pl-2">
                          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground italic">Stability resonance</span>
                          <span className="text-fluid-title font-black text-primary italic leading-none">82.4%</span>
                       </div>
                       <div className="w-full bg-muted h-3 rounded-full overflow-hidden border border-border">
                          <motion.div initial={{ width: 0 }} animate={{ width: '82.4%' }} transition={{ duration: 2 }} className="bg-gradient-to-r from-primary to-foreground/40 h-full shadow-[0_0_20px_var(--primary)]" />
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="flex justify-between items-end pl-2">
                          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground italic">Chaos threshold</span>
                          <span className="text-fluid-title font-black text-muted-foreground italic leading-none">12.1%</span>
                       </div>
                       <div className="w-full bg-muted h-3 rounded-full overflow-hidden border border-border">
                          <motion.div initial={{ width: 0 }} animate={{ width: '12.1%' }} transition={{ duration: 2 }} className="bg-muted-foreground/30 h-full" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-background border-2 border-border rounded-[5rem] p-12 lg:p-16 space-y-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl group">
                 <h3 className="text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-muted-foreground flex items-center gap-6 italic leading-none">
                   <Zap size={24} className="text-primary animate-pulse" /> Ideology Pulse
                 </h3>
                 <div className="grid gap-6">
                    {['Sovereignism', 'Digital_Decentralization', 'Abyssal_Logic', 'Omni_Command'].map((tag, i) => (
                      <Link 
                        key={i} 
                        href={`/hpedia?query=${tag}`}
                        className="flex items-center justify-between p-8 bg-muted/5 border-2 border-border rounded-[2.5rem] group cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all shadow-xl"
                      >
                         <span className="text-sm font-black text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest md:tracking-[0.4em] italic leading-none truncate min-w-0 pr-2">{tag}</span>
                         <LinkIcon size={20} className="text-muted-foreground/30 group-hover:text-primary group-hover:rotate-45 transition-all" />
                      </Link>
                    ))}
                 </div>
                 <div className="pt-10 border-t border-border flex justify-center flex-col items-center gap-6">
                    <p className="text-[10px] text-muted-foreground/50 font-black uppercase tracking-[0.6em] italic text-center leading-none">Autonomous clustering active.</p>
                    <div className="flex gap-4">
                        {[0, 1, 2, 3].map(d => (
                            <motion.div key={d} animate={{ opacity: [0.1, 1, 0.1] }} transition={{ duration: 2, repeat: Infinity, delay: d * 0.5 }} className="h-1.5 w-1.5 rounded-full bg-primary" />
                        ))}
                    </div>
                 </div>
              </div>

              <div className="p-8 md:p-12 border-2 border-primary/10 bg-primary/5 responsive-rounded text-center space-y-6 shadow-[0_40px_100px_rgba(var(--primary),0.1)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
                  <Database size={44} className="mx-auto text-primary opacity-20" />
                  <p className="text-[12px] font-black uppercase tracking-[0.5em] text-primary italic leading-none">Universal Exchange Matrix</p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] leading-relaxed italic">All cognitive shards are permanently anchored in the OVEREIGN_LEDGER_7.0 vault.</p>
              </div>
           </div>

        </div>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-fluid-hero font-black italic italic leading-none uppercase">SWARM</div>
      </div>
      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
