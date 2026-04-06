'use client';

import * as React from 'react';
import { useRef, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';

export default function NetworkingHub() {
  const [activeTab, setActiveTab] = React.useState('COMMUNITY');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.omega-reveal', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'expo.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const collaborations = [
    { id: 1, title: "Microsoft Foundry Alignment", status: "SYNCING", desc: "Strategic compute orchestration with Microsoft Azure ecosystem.", icon: <Cpu className="text-[#00ffc3]" /> },
    { id: 2, title: "Hathora Mesh Integration", status: "ACTIVE", desc: "Global latency-optimized agent orchestration.", icon: <Globe className="text-[#7000ff]" /> },
    { id: 3, title: "Open-Source Shard Protocol", status: "PROPOSED", desc: "Universal standard for decentralized cognitive memory.", icon: <Share2 className="text-white/40" /> }
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00ffc3]/20 font-sans p-4 lg:p-12 overflow-x-hidden flex flex-col">
      
      {/* ── OMEGA OPTICAL DEPTH ENGINE ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-[#00ffc3]/5 blur-[220px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#7000ff]/3 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
        
        {/* Animated Scanning Lines */}
        <div className="absolute inset-0 opacity-[0.03]">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00ffc3] to-transparent absolute top-1/4 animate-[scan_8s_linear_infinite]" />
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7000ff] to-transparent absolute top-3/4 animate-[scan_12s_linear_infinite_reverse]" />
        </div>
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto w-full flex-1 flex flex-col space-y-20 py-12">
        
        {/* HEADER: OMEGA AUTHORITATIVE TITLE */}
        <header className="space-y-8 text-center lg:text-left max-w-5xl">
           <Link href="/" className="omega-reveal inline-flex items-center gap-3 text-white/30 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.4em] mb-4 group px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-3xl">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Matrix
           </Link>
           <h1 className="omega-reveal text-6xl lg:text-9xl font-black uppercase tracking-[-0.04em] italic leading-[0.85]">
             Network<br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-transparent">Resonance.</span>
           </h1>
           <div className="omega-reveal flex flex-wrap gap-6 items-center pt-4">
              <div className="flex items-center gap-3 text-[10px] font-black text-[#00ffc3] uppercase tracking-[0.5em] italic">
                 <Radio size={14} className="animate-pulse" /> Global P2P: Synchronized
              </div>
              <div className="h-px w-12 bg-white/10 hidden lg:block" />
              <div className="text-[10px] text-white/20 font-mono uppercase tracking-[0.5em]">
                 ASP_OMEGA_PROTOCOL_V.1.2
              </div>
           </div>
        </header>

        {/* ── MULTI-DIMENSIONAL INTERFACE ── */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">
           
           {/* SIDEBAR: NAVIGATION SELECTOR */}
           <div className="lg:col-span-4 space-y-8 omega-reveal">
              <div className="bg-black/60 border border-white/5 p-12 rounded-[3.5rem] backdrop-blur-3xl space-y-12 relative overflow-hidden shadow-2xl group transition-all hover:bg-black/80">
                 <div className="space-y-6">
                    <button 
                      onClick={() => setActiveTab('COMMUNITY')}
                      className={`w-full flex items-center justify-between p-8 rounded-[2rem] transition-all border ${activeTab === 'COMMUNITY' ? 'bg-[#00ffc3]/10 border-[#00ffc3]/40 text-white shadow-[0_0_40px_rgba(0,255,195,0.1)]' : 'bg-transparent border-white/5 text-white/20 hover:border-white/20'}`}
                    >
                       <div className="flex flex-col items-start gap-1">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Section_01</span>
                          <span className="text-sm font-black uppercase tracking-[0.2em] italic">Social Swarm</span>
                       </div>
                       <Users size={22} className={activeTab === 'COMMUNITY' ? 'text-[#00ffc3]' : 'text-white/10'} />
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('COLLABS')}
                      className={`w-full flex items-center justify-between p-8 rounded-[2rem] transition-all border ${activeTab === 'COLLABS' ? 'bg-[#7000ff]/10 border-[#7000ff]/40 text-white shadow-[0_0_40px_rgba(112,0,255,0.1)]' : 'bg-transparent border-white/5 text-white/20 hover:border-white/20'}`}
                    >
                       <div className="flex flex-col items-start gap-1">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Section_02</span>
                          <span className="text-sm font-black uppercase tracking-[0.2em] italic">Mesh Pacts</span>
                       </div>
                       <Zap size={22} className={activeTab === 'COLLABS' ? 'text-[#7000ff]' : 'text-white/10'} />
                    </button>

                    <button 
                      onClick={() => setActiveTab('REACH')}
                      className={`w-full flex items-center justify-between p-8 rounded-[2rem] transition-all border ${activeTab === 'REACH' ? 'bg-white/10 border-white/40 text-white' : 'bg-transparent border-white/5 text-white/20 hover:border-white/20'}`}
                    >
                       <div className="flex flex-col items-start gap-1">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Section_03</span>
                          <span className="text-sm font-black uppercase tracking-[0.2em] italic">Direct Link</span>
                       </div>
                       <Mail size={22} className="text-white/10" />
                    </button>
                 </div>

                 <div className="pt-10 border-t border-white/5 flex flex-col gap-4">
                    <div className="flex justify-between items-center text-[10px] font-mono text-white/20">
                       <span className="uppercase italic tracking-widest">Active Connections</span>
                       <span className="text-[#00ffc3] font-black tabular-nums">482_NODES</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div animate={{ x: [-100, 100] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#00ffc3] to-transparent shadow-[0_0_10px_#00ffc3]" />
                    </div>
                 </div>
              </div>

              {/* MISSION TOTALITY CARD */}
              <div className="bg-gradient-to-br from-[#00ffc3]/5 to-transparent border border-[#00ffc3]/15 p-12 rounded-[3.5rem] space-y-8 relative overflow-hidden backdrop-blur-3xl shadow-xl hover:scale-[1.02] transition-transform">
                 <div className="absolute top-0 right-0 p-8 transform translate-x-4 translate-y-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <Cpu size={160} />
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00ffc3] italic">Protocol_Absolute</h4>
                    <p className="text-sm text-white/50 font-light leading-relaxed">The OMEGA network is a free resource. No paywalls. No restrictions. Pure collaborative sovereignty.</p>
                 </div>
                 <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-[#00ffc3] transition-all group pt-2">
                    NEXUS_MANIFESTO <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>

           {/* CONTENT: DYNAMIC DATA DISPLAY */}
           <div className="lg:col-span-8 omega-reveal">
              <AnimatePresence mode="wait">
                 {activeTab === 'COMMUNITY' && (
                    <motion.div 
                      key="community"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                      className="space-y-12"
                    >
                       <div className="bg-black/40 border border-white/10 p-14 rounded-[4.5rem] backdrop-blur-3xl space-y-12 shadow-2xl relative group">
                          <div className="absolute top-0 right-0 p-14 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                             <MessageSquare size={140} />
                          </div>
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
                             <div className="space-y-6">
                                <h3 className="text-5xl lg:text-6xl font-black italic uppercase tracking-[-0.03em] leading-none">The Social Swarm.</h3>
                                <p className="text-lg text-white/50 max-w-lg font-light leading-relaxed">
                                   Synthesizing collective intelligence across 12,402 active neural nodes.
                                </p>
                             </div>
                             <a 
                               href="https://discord.gg/fireworks-ai" 
                               target="_blank"
                               className="px-14 py-7 bg-white text-black rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] transition-all shadow-2xl shadow-white/10 hover:scale-105 active:scale-95 italic flex items-center gap-4"
                             >
                                RESONATE <ExternalLink size={18} />
                             </a>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-12">
                             <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6 hover:bg-white/[0.04] transition-all cursor-pointer group">
                                <Github className="text-white/20 group-hover:text-white transition-colors" size={32} />
                                <div className="space-y-2">
                                   <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00ffc3]">Open_Source</h5>
                                   <p className="text-xs text-white/40 leading-relaxed font-light">Contribute to the OMEGA kernel. All cognitive repositories are public and decentralized.</p>
                                </div>
                             </div>
                             <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6 hover:bg-white/[0.04] transition-all cursor-pointer group">
                                <Share2 className="text-white/20 group-hover:text-[#7000ff] transition-colors" size={32} />
                                <div className="space-y-2">
                                   <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#7000ff]">Broadcast_Sync</h5>
                                   <p className="text-xs text-white/40 leading-relaxed font-light">Stay aligned with real-time ideological shifts and ecosystem updates on X/Twitter.</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 )}

                 {activeTab === 'COLLABS' && (
                    <motion.div 
                      key="collabs"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                      className="space-y-8"
                    >
                       <div className="grid gap-6">
                          {collaborations.map(c => (
                             <div key={c.id} className="bg-black/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-3xl flex items-center justify-between group hover:border-[#00ffc3]/40 transition-all shadow-xl">
                                <div className="flex items-center gap-10">
                                   <div className="h-20 w-20 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                      {c.icon}
                                   </div>
                                   <div className="space-y-3">
                                      <div className="flex items-center gap-4">
                                         <h4 className="text-2xl font-black italic tracking-tighter opacity-90">{c.title}</h4>
                                         <span className={`px-4 py-1.5 rounded-[1rem] text-[9px] font-black uppercase tracking-[0.3em] ${c.status === 'ACTIVE' ? 'bg-[#00ffc3]/15 text-[#00ffc3] border border-[#00ffc3]/20' : 'bg-white/5 text-white/20 border border-white/10'}`}>
                                            {c.status}
                                         </span>
                                      </div>
                                      <p className="text-sm text-white/40 font-light max-w-lg">{c.desc}</p>
                                   </div>
                                </div>
                                <div className="h-16 w-16 rounded-[1.5rem] border border-white/10 flex items-center justify-center text-white/10 group-hover:border-[#00ffc3]/40 group-hover:text-[#00ffc3] transition-all">
                                   <ShieldCheck size={28} />
                                </div>
                             </div>
                          ))}
                       </div>
                       
                       <div className="p-16 border-2 border-dashed border-white/5 rounded-[4rem] text-center space-y-8 hover:border-[#00ffc3]/30 transition-colors group">
                          <Unplug size={48} className="mx-auto text-white/5 group-hover:text-[#00ffc3]/40 transition-colors" />
                          <div className="space-y-4">
                             <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-white/20 italic">Alliance_Protocol</h4>
                             <p className="text-sm text-white/30 font-light max-w-sm mx-auto">Do you hold high-performance compute or data assets? Propose a federation handshake.</p>
                          </div>
                          <button className="px-14 py-5 bg-white/5 border border-white/10 hover:border-white rounded-full text-[10px] font-black uppercase tracking-[0.5em] transition-all italic text-white/40 hover:text-white hover:bg-white/10">
                             INIT_NEGOTIATION_V6
                          </button>
                       </div>
                    </motion.div>
                 )}

                 {activeTab === 'REACH' && (
                    <motion.div 
                       key="reach"
                       initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                       className="bg-black/40 border border-white/10 p-16 rounded-[4.5rem] backdrop-blur-3xl space-y-16 shadow-2xl"
                    >
                       <div className="space-y-6">
                          <div className="h-1px w-20 bg-[#00ffc3] mb-8" />
                          <h3 className="text-5xl lg:text-6xl font-black italic uppercase tracking-[-0.04em] leading-none">Global Reach_</h3>
                          <p className="text-lg text-white/50 font-light leading-relaxed max-w-2xl">
                             Request Sovereign infrastructure deployment, strategic alignment, or intellectual audit. 
                          </p>
                       </div>
                       <form className="space-y-10">
                          <div className="grid md:grid-cols-2 gap-10">
                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 ml-2 italic">Entity_Identity</label>
                                <input type="text" placeholder="GIO_BASTIDAS" className="w-full bg-black/40 border border-white/5 rounded-[2rem] p-7 text-sm focus:border-[#00ffc3]/40 focus:outline-none transition-all italic text-white/90 placeholder:text-white/10" />
                             </div>
                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 ml-2 italic">Neural_Address</label>
                                <input type="email" placeholder="CORE@HUMANESE.NET" className="w-full bg-black/40 border border-white/5 rounded-[2rem] p-7 text-sm focus:border-[#00ffc3]/40 focus:outline-none transition-all italic text-white/90 placeholder:text-white/10" />
                             </div>
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 ml-2 italic">Broadcasting_Payload</label>
                             <textarea rows={5} placeholder="Describe the collaborative trajectory..." className="w-full bg-black/40 border border-white/5 rounded-[2rem] p-7 text-sm focus:border-[#00ffc3]/40 focus:outline-none transition-all italic text-white/90 placeholder:text-white/10 resize-none" />
                          </div>
                          <button className="relative w-full py-8 bg-white text-black font-black text-sm uppercase tracking-[0.6em] rounded-full hover:bg-[#00ffc3] transition-all italic shadow-2xl active:scale-95 group overflow-hidden">
                             <span className="relative z-10 transition-colors group-hover:text-black">EXECUTE_TRANSMISSION</span>
                             <div className="absolute inset-0 bg-[#00ffc3] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
                          </button>
                       </form>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>

      </main>

      {/* FOOTER: OMEGA SIGNATURE */}
      <footer className="relative z-10 py-16 border-t border-white/5 max-w-[1400px] mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-10 opacity-30 hover:opacity-100 transition-all duration-700">
         <div className="flex items-center gap-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.5em] italic">Signed by <span className="text-white font-black">Gio V.</span></div>
            <div className="h-1 w-1 rounded-full bg-white/20" />
            <div className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/40">Sovereign_Pact_2026</div>
         </div>
         <div className="flex gap-10">
            {['Status', 'Twitter', 'GitHub', 'Discord'].map(link => (
              <button key={link} className="text-[10px] font-mono uppercase tracking-[0.5em] hover:text-[#00ffc3] transition-colors">{link}</button>
            ))}
         </div>
      </footer>

      <style jsx global>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
      `}</style>
    </div>
  );
}
