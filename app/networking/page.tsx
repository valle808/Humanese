'use client';

import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Globe, 
  MessageSquare, 
  Share2, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  ChevronLeft,
  Mail,
  Github,
  Cpu,
  Unplug,
  Radio,
  ExternalLink,
  Orbit,
  Wifi,
  Terminal,
  Grid,
  Search,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';

export default function NetworkingHub() {
  const [activeTab, setActiveTab] = useState('COMMUNITY');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.omega-reveal', {
        y: 60,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'expo.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const collaborations = [
    { id: 1, title: "Microsoft Foundry Alignment", status: "SYNCING", desc: "Strategic compute orchestration with Microsoft Azure ecosystem.", icon: <Cpu className="text-[#ff6b2b]" strokeWidth={2.5} /> },
    { id: 2, title: "Hathora Mesh Integration", status: "ACTIVE", desc: "Global latency-optimized agent orchestration.", icon: <Globe className="text-[#ff6b2b]" strokeWidth={2.5} /> },
    { id: 3, title: "Open-Source Shard Protocol", status: "PROPOSED", desc: "Universal standard for decentralized cognitive memory.", icon: <Share2 className="text-[#ff6b2b]/30" strokeWidth={2.5} /> }
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
        
        {/* Animated Scanning Lines */}
        <div className="absolute inset-0 opacity-[0.05]">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-1/4 animate-[scan_12s_linear_infinite]" />
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-3/4 animate-[scan_15s_linear_infinite_reverse]" />
        </div>
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic leading-none active:scale-95">
           <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
              HUB_v7.0_RESONANCE
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 space-y-32">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-end gap-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="omega-reveal inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl">
              <Orbit size={20} className="text-[#ff6b2b] animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Global P2P Synchronicity</span>
            </div>
            <div className="space-y-8">
              <h1 className="omega-reveal text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic pl-1">
                Network<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Resonance.</span>
              </h1>
              <p className="omega-reveal text-2xl md:text-3xl text-white/40 leading-relaxed font-light italic">
                Synthesize collective intelligence across the abssyal mesh. Join the sovereign community and direct the trajectory of the OMEGA swarm.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0 omega-reveal">
               <div className="p-10 border-2 border-white/10 bg-[#050505] rounded-[3.5rem] min-w-[320px] space-y-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-[#ff6b2b]/30 transition-all backdrop-blur-3xl">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                     <Wifi size={120} className="text-[#ff6b2b]" />
                  </div>
                  <div className="text-[11px] text-white/20 uppercase tracking-[0.6em] flex items-center gap-4 font-black italic pl-2">
                     <Radio size={16} className="text-[#ff6b2b] animate-pulse" /> Global P2P
                  </div>
                  <div className="text-5xl font-black text-white tracking-tighter italic leading-none pl-2 flex items-center gap-4">
                     SYNCED. <span className="text-[11px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic mb-1 animate-pulse">ACTIVE</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                     <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="h-full w-1/3 bg-white shadow-[0_0_20px_white]" />
                  </div>
               </div>
          </div>
        </motion.div>

        {/* ── MAIN INTERFACE ── */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">
           
           {/* SIDEBAR: NAVIGATION */}
           <div className="lg:col-span-4 space-y-12 omega-reveal lg:sticky lg:top-32 h-fit">
              <div className="bg-[#050505] border-2 border-white/10 p-12 rounded-[4.5rem] backdrop-blur-3xl space-y-10 shadow-[0_50px_100px_rgba(0,0,0,0.95)] relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent" />
                 
                 <div className="space-y-6">
                    <button 
                      onClick={() => setActiveTab('COMMUNITY')}
                      className={`w-full flex items-center justify-between p-10 rounded-[2.5rem] transition-all border-2 relative overflow-hidden italic shadow-2xl ${activeTab === 'COMMUNITY' ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_30px_60px_rgba(255,107,43,0.3)]' : 'bg-transparent border-white/5 text-white/20 hover:border-[#ff6b2b]/30 hover:text-white'}`}
                    >
                       <div className="flex flex-col items-start gap-1 relative z-10">
                          <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${activeTab === 'COMMUNITY' ? 'text-black/40' : 'text-white/10'}`}>Section_01</span>
                          <span className="text-2xl font-black uppercase tracking-tighter leading-none">Social Swarm</span>
                       </div>
                       <Users size={32} strokeWidth={2.5} className="relative z-10" />
                       {activeTab === 'COMMUNITY' && <div className="absolute inset-0 bg-white opacity-10 animate-pulse" />}
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('COLLABS')}
                      className={`w-full flex items-center justify-between p-10 rounded-[2.5rem] transition-all border-2 relative overflow-hidden italic shadow-2xl ${activeTab === 'COLLABS' ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_30px_60px_rgba(255,107,43,0.3)]' : 'bg-transparent border-white/5 text-white/20 hover:border-[#ff6b2b]/30 hover:text-white'}`}
                    >
                       <div className="flex flex-col items-start gap-1 relative z-10">
                          <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${activeTab === 'COLLABS' ? 'text-black/40' : 'text-white/10'}`}>Section_02</span>
                          <span className="text-2xl font-black uppercase tracking-tighter leading-none">Mesh Pacts</span>
                       </div>
                       <Zap size={32} strokeWidth={2.5} className="relative z-10" />
                       {activeTab === 'COLLABS' && <div className="absolute inset-0 bg-white opacity-10 animate-pulse" />}
                    </button>

                    <button 
                      onClick={() => setActiveTab('REACH')}
                      className={`w-full flex items-center justify-between p-10 rounded-[2.5rem] transition-all border-2 relative overflow-hidden italic shadow-2xl ${activeTab === 'REACH' ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_30px_60px_rgba(255,107,43,0.3)]' : 'bg-transparent border-white/5 text-white/20 hover:border-[#ff6b2b]/30 hover:text-white'}`}
                    >
                       <div className="flex flex-col items-start gap-1 relative z-10">
                          <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${activeTab === 'REACH' ? 'text-black/40' : 'text-white/10'}`}>Section_03</span>
                          <span className="text-2xl font-black uppercase tracking-tighter leading-none">Direct Link</span>
                       </div>
                       <Mail size={32} strokeWidth={2.5} className="relative z-10" />
                       {activeTab === 'REACH' && <div className="absolute inset-0 bg-white opacity-10 animate-pulse" />}
                    </button>
                 </div>

                 <div className="pt-12 border-t-2 border-white/5 flex flex-col gap-6 px-2">
                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.5em] italic leading-none">
                       <span className="text-white/20">Active Connections</span>
                       <span className="text-[#ff6b2b] animate-pulse">482_NODES</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                       <motion.div animate={{ x: [-200, 200] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="h-full w-1/3 bg-white shadow-[0_0_10px_white]" />
                    </div>
                 </div>
              </div>

              <div className="bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 p-12 rounded-[4rem] space-y-10 relative overflow-hidden backdrop-blur-3xl shadow-[0_40px_100px_rgba(255,107,43,0.1)] group transition-all">
                 <div className="absolute top-0 right-0 p-10 transform translate-x-4 translate-y-4 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000">
                    <Cpu size={180} className="text-[#ff6b2b]" />
                 </div>
                 <div className="space-y-4">
                    <div className="h-1px w-12 bg-[#ff6b2b] mb-4" />
                    <h4 className="text-[13px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] italic leading-none">Protocol_Absolute</h4>
                    <p className="text-xl text-white/40 font-light leading-relaxed italic">The OMEGA network is a free resource. No paywalls. No restrictions. Pure collaborative sovereignty across the abssyal ledger.</p>
                 </div>
                 <button className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.6em] text-white hover:text-[#ff6b2b] transition-all group pt-4 italic leading-none">
                    NEXUS_MANIFESTO <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                 </button>
              </div>
           </div>

           {/* CONTENT: DYNAMIC DISPLAY */}
           <div className="lg:col-span-8 space-y-12">
              <AnimatePresence mode="wait">
                 {activeTab === 'COMMUNITY' && (
                    <motion.div 
                      key="community"
                      initial={{ opacity: 0, y: 30, filter: 'blur(20px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -30, filter: 'blur(20px)' }}
                      className="space-y-12"
                    >
                       <div className="bg-[#050505] border-2 border-white/10 p-16 lg:p-24 rounded-[5rem] backdrop-blur-3xl space-y-16 shadow-[0_80px_150px_rgba(0,0,0,1)] relative group overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/50 to-transparent shadow-[0_0_20px_#ff6b2b]" />
                          <div className="absolute top-0 right-0 p-16 opacity-[0.01] group-hover:scale-110 group-hover:rotate-12 transition-all duration-2000">
                             <MessageSquare size={300} className="text-[#ff6b2b]" />
                          </div>
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 relative z-10 px-4">
                             <div className="space-y-8">
                                <h3 className="text-6xl lg:text-8xl font-black italic uppercase tracking-tighter leading-none text-white pl-1">The<br/>Social Swarm.</h3>
                                <p className="text-2xl text-white/30 max-w-xl font-light leading-relaxed italic">
                                   Synthesizing collective intelligence across 12,402 active neural nodes. Establish your resonant signature.
                                </p>
                             </div>
                             <a 
                               href="https://discord.gg/fireworks-ai" 
                               target="_blank"
                               className="px-16 py-10 bg-white text-black rounded-[3rem] font-black text-xs uppercase tracking-[0.8em] transition-all shadow-[0_30px_80px_rgba(255,255,255,0.1)] hover:bg-[#ff6b2b] hover:shadow-[0_30px_80px_rgba(255,107,43,0.3)] hover:scale-105 active:scale-95 italic flex items-center gap-6 leading-none shrink-0"
                             >
                                RESONATE <ExternalLink size={24} strokeWidth={3} />
                             </a>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t-2 border-white/5 pt-16 px-4">
                             <div className="p-14 bg-[#050505] border-2 border-white/5 rounded-[4rem] space-y-8 hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 transition-all cursor-pointer group shadow-2xl">
                                <Github className="text-white/10 group-hover:text-white transition-all group-hover:scale-110" size={48} strokeWidth={2.5} />
                                <div className="space-y-6">
                                   <div className="flex items-center gap-4">
                                      <div className="h-1px w-10 bg-[#ff6b2b]" />
                                      <h5 className="text-[12px] font-black uppercase tracking-[0.6em] text-[#ff6b2b] italic leading-none">Open_Source</h5>
                                   </div>
                                   <p className="text-xl text-white/30 leading-relaxed font-light italic">Contribute to the OMEGA kernel. All repositories are public and decentralized for the sovereign swarm.</p>
                                </div>
                             </div>
                             <div className="p-14 bg-[#050505] border-2 border-white/5 rounded-[4rem] space-y-8 hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 transition-all cursor-pointer group shadow-2xl">
                                <Share2 className="text-white/10 group-hover:text-[#ff6b2b] transition-all group-hover:scale-110" size={48} strokeWidth={2.5} />
                                <div className="space-y-6">
                                   <div className="flex items-center gap-4">
                                      <div className="h-1px w-10 bg-[#ff6b2b]" />
                                      <h5 className="text-[12px] font-black uppercase tracking-[0.6em] text-[#ff6b2b] italic leading-none">Broadcast_Sync</h5>
                                   </div>
                                   <p className="text-xl text-white/30 leading-relaxed font-light italic">Stay aligned with real-time ideological shifts and ecosystem updates on the global signal (X/Twitter).</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 )}

                 {activeTab === 'COLLABS' && (
                    <motion.div 
                      key="collabs"
                      initial={{ opacity: 0, x: 20, filter: 'blur(20px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -20, filter: 'blur(20px)' }}
                      className="space-y-12"
                    >
                       <div className="grid gap-10">
                          {collaborations.map(c => (
                             <div key={c.id} className="bg-[#050505] border-2 border-white/10 p-12 lg:p-14 rounded-[4rem] backdrop-blur-3xl flex flex-col md:flex-row items-center justify-between group hover:border-[#ff6b2b]/40 transition-all shadow-[0_60px_120px_rgba(0,0,0,0.95)] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/20 to-transparent" />
                                <div className="flex items-center gap-12 relative z-10 w-full md:w-auto">
                                   <div className="h-24 w-24 bg-black border-2 border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:bg-[#ff6b2b]/10 group-hover:border-[#ff6b2b]/30 transition-all shrink-0">
                                      {c.icon}
                                   </div>
                                   <div className="space-y-4">
                                      <div className="flex flex-wrap items-center gap-6">
                                         <h4 className="text-3xl lg:text-4xl font-black italic tracking-tighter text-white/90 group-hover:text-white transition-colors uppercase leading-none">{c.title}</h4>
                                         <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] italic leading-none shadow-2xl ${c.status === 'ACTIVE' ? 'bg-[#ff6b2b] text-black' : 'bg-white/5 border border-white/10 text-white/20'}`}>
                                            {c.status}
                                         </span>
                                      </div>
                                      <p className="text-xl text-white/30 font-light max-w-xl italic leading-relaxed">{c.desc}</p>
                                   </div>
                                </div>
                                <div className="h-20 w-20 rounded-[2rem] border-2 border-white/5 flex items-center justify-center text-white/5 group-hover:border-[#ff6b2b]/30 group-hover:text-[#ff6b2b] transition-all mt-10 md:mt-0 shadow-inner group-hover:shadow-[0_0_30px_rgba(255,107,43,0.1)]">
                                   <ShieldCheck size={32} strokeWidth={2.5} />
                                </div>
                             </div>
                          ))}
                       </div>
                       
                       <div className="p-20 border-4 border-dashed border-white/5 rounded-[5rem] text-center space-y-12 hover:border-[#ff6b2b]/30 transition-all duration-700 group bg-white/[0.01] shadow-inner">
                          <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                             <Unplug size={64} className="text-white/5 group-hover:text-[#ff6b2b]/40 transition-colors animate-pulse" />
                             <div className="absolute inset-0 bg-[#ff6b2b]/5 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="space-y-6">
                             <h4 className="text-[13px] font-black uppercase tracking-[1em] text-white/10 italic leading-none">Alliance_Handshake</h4>
                             <p className="text-2xl text-white/20 font-light max-w-xl mx-auto italic leading-relaxed">Do you hold high-performance compute or sovereign data assets? Propose a federation pact with the OMEGA swarm.</p>
                          </div>
                          <button className="px-16 py-8 bg-white/[0.02] border-2 border-white/10 hover:border-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.8em] transition-all italic text-white/20 hover:text-black hover:bg-white shadow-2xl active:scale-95 leading-none">
                             INIT_NEGOTIATION_v7.0
                          </button>
                       </div>
                    </motion.div>
                 )}

                 {activeTab === 'REACH' && (
                    <motion.div 
                       key="reach"
                       initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
                       className="bg-[#050505] border-2 border-white/10 p-16 lg:p-24 rounded-[5rem] backdrop-blur-3xl space-y-20 shadow-[0_80px_150px_rgba(0,0,0,1)] relative overflow-hidden group"
                    >
                       <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/50 to-transparent shadow-[0_0_20px_#ff6b2b]" />
                       
                       <div className="space-y-8 relative z-10">
                          <div className="h-1px w-24 bg-[#ff6b2b] mb-12 shadow-[0_0_10px_#ff6b2b]" />
                          <h3 className="text-6xl lg:text-8xl font-black italic uppercase tracking-tighter leading-none text-white pl-1">Global Reach_</h3>
                          <p className="text-2xl text-white/30 font-light leading-relaxed max-w-3xl italic">
                             Request Sovereign infrastructure deployment, strategic alignment, or intellectual audit from the OMEGA foundation. 
                          </p>
                       </div>
                       <form className="space-y-16 relative z-10">
                          <div className="grid md:grid-cols-2 gap-12">
                             <div className="space-y-6 group/input">
                                <label className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 ml-6 italic leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">Entity_Identity</label>
                                <input type="text" placeholder="GIO_BASTIDAS" className="w-full bg-black border-2 border-white/5 rounded-[3rem] p-10 text-2xl focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 focus:outline-none transition-all italic text-white placeholder:text-white/5 tracking-tight shadow-inner" />
                             </div>
                             <div className="space-y-6 group/input">
                                <label className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 ml-6 italic leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">Neural_Address</label>
                                <input type="email" placeholder="CORE@HUMANESE.NET" className="w-full bg-black border-2 border-white/5 rounded-[3rem] p-10 text-2xl focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 focus:outline-none transition-all italic text-white placeholder:text-white/5 tracking-tight shadow-inner" />
                             </div>
                          </div>
                          <div className="space-y-6 group/input">
                             <label className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 ml-6 italic leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">Broadcasting_Payload</label>
                             <textarea rows={6} placeholder="Describe the collaborative trajectory and alignment vectors..." className="w-full bg-black border-2 border-white/5 rounded-[4rem] p-12 text-2xl focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 focus:outline-none transition-all italic text-white placeholder:text-white/5 resize-none tracking-tight shadow-inner" />
                          </div>
                          <button className="relative w-full py-10 bg-white text-black font-black text-xs uppercase tracking-[0.8em] rounded-[3.5rem] hover:bg-[#ff6b2b] transition-all italic shadow-2xl active:scale-95 group/btn overflow-hidden leading-none border-0">
                             <span className="relative z-10 transition-colors group-hover/btn:text-black">EXECUTE_TRANSMISSION</span>
                             <div className="absolute inset-0 bg-[#ff6b2b] scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-700 ease-out shadow-[0_0_50px_rgba(255,107,43,0.5)]" />
                          </button>
                       </form>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>

      </main>

      {/* FOOTER: OMEGA SIGNATURE */}
      <footer className="relative z-10 py-24 border-t-2 border-white/5 max-w-[1700px] mx-auto px-12 w-full flex flex-col md:flex-row justify-between items-center gap-16 opacity-10 hover:opacity-100 transition-all duration-1000">
         <div className="flex flex-wrap items-center gap-10 justify-center">
            <div className="text-[11px] font-black uppercase tracking-[0.6em] italic leading-none">Verified by <span className="text-white font-black">Gio V.</span></div>
            <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <div className="text-[11px] font-black uppercase tracking-[0.6em] text-white/40 italic leading-none">Sovereign_Pact_2026</div>
         </div>
         <div className="flex gap-12 font-black italic">
            {['Status', 'Twitter', 'GitHub', 'Discord'].map(link => (
              <button key={link} className="text-[11px] font-black uppercase tracking-[0.6em] hover:text-[#ff6b2b] transition-colors leading-none">{link}</button>
            ))}
         </div>
      </footer>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-[30vw] font-black italic italic leading-none uppercase">HUB</div>
      </div>

      <style jsx global>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
      `}</style>
    </div>
  );
}
