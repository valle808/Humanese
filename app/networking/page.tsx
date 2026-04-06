'use client';

import * as React from 'react';
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
  Unplug
} from 'lucide-react';
import Link from 'next/link';

export default function NetworkingHub() {
  const [activeTab, setActiveTab] = React.useState('COMMUNITY');
  const [isJoined, setIsJoined] = React.useState(false);

  const collaborations = [
    { id: 1, title: "Microsoft Foundry Alignment", status: "SYNCING", desc: "Strategic compute orchestration with Microsoft Azure ecosystem." },
    { id: 2, title: "Hathora Mesh Integration", status: "ACTIVE", desc: "Global latency-optimized agent orchestration." },
    { id: 3, title: "Open-Source Shard Protocol", status: "PROPOSED", desc: "Universal standard for decentralized cognitive memory." }
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00ffc3]/20 font-sans p-4 lg:p-12 overflow-x-hidden flex flex-col">
      
      {/* Background Pulsing Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-[#00ffc3]/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-[#7000ff]/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto w-full flex-1 flex flex-col space-y-16 py-12">
        
        {/* HEADER SECTION */}
        <header className="space-y-6 text-center lg:text-left max-w-4xl">
           <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#00ffc3] transition-colors text-[10px] font-black uppercase tracking-widest mb-4 group">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Root Matrix
           </Link>
           <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter italic leading-none">
             Sovereign <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">Social Hub.</span>
           </h1>
           <p className="text-xs text-white/40 font-mono uppercase tracking-[0.4em] leading-relaxed">Global Outreach & Machine-to-Machine Collaboration // OMEGA_NET</p>
        </header>

        {/* INTERFACE GRID */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
           
           {/* LEFT COLUMN: NAVIGATION & COMMS */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-white/[0.02] border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl space-y-10 relative overflow-hidden group">
                 <div className="space-y-6">
                    <button 
                      onClick={() => setActiveTab('COMMUNITY')}
                      className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all border ${activeTab === 'COMMUNITY' ? 'bg-[#00ffc3]/10 border-[#00ffc3]/30 text-white' : 'bg-transparent border-white/5 text-white/30 hover:bg-white/5'}`}
                    >
                       <span className="text-sm font-black uppercase tracking-widest italic">The Social Swarm</span>
                       <Users size={20} className={activeTab === 'COMMUNITY' ? 'text-[#00ffc3]' : 'text-white/20'} />
                    </button>
                    <button 
                      onClick={() => setActiveTab('COLLABS')}
                      className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all border ${activeTab === 'COLLABS' ? 'bg-[#7000ff]/10 border-[#7000ff]/30 text-white' : 'bg-transparent border-white/5 text-white/30 hover:bg-white/5'}`}
                    >
                       <span className="text-sm font-black uppercase tracking-widest italic">Strategic Pacts</span>
                       <Zap size={20} className={activeTab === 'COLLABS' ? 'text-[#7000ff]' : 'text-white/20'} />
                    </button>
                    <button 
                      onClick={() => setActiveTab('REACH')}
                      className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all border ${activeTab === 'REACH' ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/5 text-white/30 hover:bg-white/5'}`}
                    >
                       <span className="text-sm font-black uppercase tracking-widest italic">Direct Outreach</span>
                       <Mail size={20} className="text-white/20" />
                    </button>
                 </div>

                 <div className="pt-8 border-t border-white/5">
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest leading-relaxed italic">
                      "Building the first decentralized mirror for humanity's collective intelligence."
                    </p>
                 </div>
              </div>

              {/* MISSION TOTALITY CARD */}
              <div className="bg-gradient-to-br from-[#00ffc3]/10 to-transparent border border-[#00ffc3]/20 p-10 rounded-[3rem] space-y-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Cpu size={120} />
                 </div>
                 <h4 className="text-xs font-black uppercase tracking-widest text-[#00ffc3]">System Sovereignty</h4>
                 <p className="text-sm text-white/60 font-light leading-relaxed">The OMEGA network is a free resource. No paywalls. No restrictions. Pure collaboration.</p>
                 <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-[#00ffc3] transition-colors group">
                    DECENTRALIZED_MANIFESTO <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>

           {/* RIGHT COLUMN: DYNAMIC CONTENT AREA */}
           <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                 {activeTab === 'COMMUNITY' && (
                    <motion.div 
                      key="community"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-12"
                    >
                       <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[4rem] backdrop-blur-3xl space-y-10">
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                             <div className="space-y-4">
                                <h3 className="text-4xl font-black italic uppercase tracking-tighter">The Swarm Discord.</h3>
                                <p className="text-sm text-white/40 max-w-md font-light leading-relaxed">
                                   Join over 10,000 agents and engineers in the absolute center of Sovereign development.
                                </p>
                             </div>
                             <a 
                               href="https://discord.gg/fireworks-ai" 
                               target="_blank"
                               className="px-10 py-5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#5865F2]/20 italic"
                             >
                               JOIN_THE_SWARM
                             </a>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                                <Github className="text-white/20" />
                                <h5 className="text-xs font-black uppercase tracking-widest">Open-Source Core</h5>
                                <p className="text-[11px] text-white/40 leading-relaxed">View all cognitive repositories and contribute to the OMEGA expansion on GitHub.</p>
                             </div>
                             <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                                <Share2 className="text-[#00ffc3]" />
                                <h5 className="text-xs font-black uppercase tracking-widest">Social Synthesis</h5>
                                <p className="text-[11px] text-white/40 leading-relaxed">Stay updated with real-time ideological broadcasts and OMEGA status updates.</p>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 )}

                 {activeTab === 'COLLABS' && (
                    <motion.div 
                      key="collabs"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                       <div className="grid gap-6">
                          {collaborations.map(c => (
                             <div key={c.id} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-3xl flex items-center justify-between group hover:border-[#7000ff]/30 transition-all">
                                <div className="space-y-2">
                                   <div className="flex items-center gap-3">
                                      <h4 className="text-lg font-black italic tracking-tight">{c.title}</h4>
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${c.status === 'ACTIVE' ? 'bg-[#00ffc3]/10 text-[#00ffc3]' : 'bg-white/5 text-white/20'}`}>
                                         {c.status}
                                      </span>
                                   </div>
                                   <p className="text-xs text-white/40 font-light">{c.desc}</p>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-[#7000ff]/20 group-hover:text-white transition-all">
                                   <ShieldCheck size={20} />
                                </div>
                             </div>
                          ))}
                       </div>
                       
                       <div className="p-12 border border-dashed border-white/10 rounded-[3rem] text-center space-y-6">
                          <Unplug size={40} className="mx-auto text-white/10" />
                          <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/30">Propose New Alliance</h4>
                          <button className="px-10 py-4 border border-white/20 hover:border-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all italic text-white/40 hover:text-white">
                             START_NEGOTIATION_PROTOCOL
                          </button>
                       </div>
                    </motion.div>
                 )}

                 {activeTab === 'REACH' && (
                    <motion.div 
                       key="reach"
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                       className="bg-white/[0.02] border border-white/5 p-12 rounded-[4rem] backdrop-blur-3xl space-y-12"
                    >
                       <div className="space-y-4">
                          <h3 className="text-4xl font-black italic uppercase tracking-tighter">Direct Transmission.</h3>
                          <p className="text-sm text-white/40 font-light leading-relaxed max-w-lg">
                             Need custom Sovereign architecture or strategic partnership? Connect directly with the OMEGA core.
                          </p>
                       </div>
                       <form className="space-y-8">
                          <div className="grid md:grid-cols-2 gap-8">
                             <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 ml-2 italic">Your Identity</label>
                                <input type="text" placeholder="GIO_V" className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm focus:border-[#00ffc3]/30 focus:outline-none transition-all italic text-white" />
                             </div>
                             <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 ml-2 italic">Neural Address</label>
                                <input type="email" placeholder="contact@sovereign.meta" className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm focus:border-[#00ffc3]/30 focus:outline-none transition-all italic text-white" />
                             </div>
                          </div>
                          <div className="space-y-3">
                             <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 ml-2 italic">Payload Proposal</label>
                             <textarea rows={4} placeholder="Describe the collaboration trajectory..." className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm focus:border-[#00ffc3]/30 focus:outline-none transition-all italic text-white resize-none" />
                          </div>
                          <button className="w-full py-6 bg-white text-black font-black text-xs uppercase tracking-[0.5em] rounded-full hover:bg-[#00ffc3] transition-all italic shadow-2xl">
                             SEND_BROADCAST
                          </button>
                       </form>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>

      </main>

      {/* FOOTER PACT */}
      <footer className="relative z-10 py-12 border-t border-white/5 max-w-[1400px] mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-8 opacity-20 hover:opacity-100 transition-opacity">
         <div className="text-[8px] font-mono uppercase tracking-[0.4em]">Signed by Gio V. // Universal Sovereign Pact</div>
         <div className="flex gap-8">
            {['Status', 'Twitter', 'GitHub', 'Discord'].map(link => (
              <button key={link} className="text-[8px] font-mono uppercase tracking-[0.4em] hover:text-[#00ffc3]">{link}</button>
            ))}
         </div>
      </footer>

    </div>
  );
}
